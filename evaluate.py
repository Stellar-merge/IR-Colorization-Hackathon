import os
import time
import json
import argparse
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import torch
from torchvision.utils import save_image
import torchvision.transforms as transforms
from PIL import Image
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TimeElapsedColumn
import lpips
from pytorch_fid.fid_score import calculate_frechet_distance
from pytorch_fid.inception import InceptionV3
from torch.nn.functional import adaptive_avg_pool2d

from src.models.generator import GeneratorUNet
from src.utils.metrics import calculate_psnr, calculate_ssim

console = Console()

# ---------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------

def ensure_dir(d):
    os.makedirs(d, exist_ok=True)

def denorm(x):
    """Denormalize from [-1, 1] to [0, 1] for saving."""
    out = (x + 1) / 2
    return out.clamp(0, 1)

def get_fid_features(images_list, model, device, batch_size=32):
    """Calculate Inception features for a list of images (tensors)."""
    model.eval()
    features = []
    
    with torch.no_grad():
        for i in range(0, len(images_list), batch_size):
            batch = torch.stack(images_list[i:i+batch_size]).to(device)
            # inception requires 3 channels, size doesn't strictly matter but usually 299x299
            # images should be 0-1
            pred = model(batch)[0]
            if pred.size(2) != 1 or pred.size(3) != 1:
                pred = adaptive_avg_pool2d(pred, output_size=(1, 1))
            features.append(pred.cpu().numpy().reshape(pred.size(0), -1))
            
    if len(features) == 0:
        return np.zeros((0, 2048))
    return np.concatenate(features, axis=0)

def plot_heatmap(diff_map, save_path):
    """Save difference map as a seaborn heatmap."""
    plt.figure(figsize=(6, 6))
    ax = sns.heatmap(diff_map, cmap='magma', cbar=False, xticklabels=False, yticklabels=False)
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches='tight', pad_inches=0)
    plt.close()

def save_comparison(ir, gt, pred, diff, save_path):
    """Save side-by-side comparison of IR, GT, Pred, Diff."""
    fig, axes = plt.subplots(1, 4, figsize=(20, 5))
    
    # Convert tensors to displayable numpy arrays
    ir_disp = ir.squeeze().cpu().numpy()
    gt_disp = gt.permute(1, 2, 0).cpu().numpy()
    pred_disp = pred.permute(1, 2, 0).cpu().numpy()
    
    axes[0].imshow(ir_disp, cmap='gray')
    axes[0].set_title("Input IR")
    axes[0].axis('off')
    
    axes[1].imshow(pred_disp)
    axes[1].set_title("Predicted RGB")
    axes[1].axis('off')
    
    axes[2].imshow(gt_disp)
    axes[2].set_title("Ground Truth RGB")
    axes[2].axis('off')
    
    im3 = axes[3].imshow(diff, cmap='magma')
    axes[3].set_title("Absolute Diff")
    axes[3].axis('off')
    fig.colorbar(im3, ax=axes[3], fraction=0.046, pad=0.04)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()

def save_sample_grid(data, title, save_path):
    """Save a grid of top/worst/random results."""
    if not data: return
    n = len(data)
    fig, axes = plt.subplots(n, 3, figsize=(12, 4*n))
    fig.suptitle(title, fontsize=16, y=1.02)
    
    if n == 1:
        axes = [axes]
        
    for i, row in enumerate(data):
        ax = axes[i]
        ir = np.array(Image.open(row['ir_path']))
        pred = np.array(Image.open(row['pred_path']))
        gt = np.array(Image.open(row['gt_path']))
        
        ax[0].imshow(ir, cmap='gray')
        ax[0].set_title(f"IR (Input)\n{row['filename']}")
        ax[0].axis('off')
        
        ax[1].imshow(pred)
        ax[1].set_title(f"Prediction\nSSIM: {row['ssim']:.3f} | LPIPS: {row['lpips']:.3f}")
        ax[1].axis('off')
        
        ax[2].imshow(gt)
        ax[2].set_title("Ground Truth")
        ax[2].axis('off')
        
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()

# ---------------------------------------------------------
# Main Evaluator Class
# ---------------------------------------------------------

class Evaluator:
    def __init__(self, weights_path, test_dir, output_dir, device, limit=None):
        self.weights_path = weights_path
        self.test_dir = test_dir
        self.out_dir = output_dir
        self.device = device
        self.limit = limit
        
        # Subdirectories
        self.dirs = {
            'preds': os.path.join(output_dir, "predictions"),
            'comps': os.path.join(output_dir, "comparisons"),
            'metrics': os.path.join(output_dir, "metrics"),
            'plots': os.path.join(output_dir, "plots"),
            'report': os.path.join(output_dir, "report"),
            'worst': os.path.join(output_dir, "worst_predictions"),
            'best': os.path.join(output_dir, "best_predictions"),
        }
        for d in self.dirs.values():
            ensure_dir(d)
            
        # Metrics Lists
        self.results = []
        self.pred_tensors_for_fid = []
        self.gt_tensors_for_fid = []
        
        # Load Model
        console.print(f"[bold cyan]Loading model...[/]")
        self.model = GeneratorUNet().to(device)
        self.model.load_state_dict(torch.load(weights_path, map_location=device, weights_only=True))
        self.model.eval()
        
        # LPIPS
        self.lpips_fn = lpips.LPIPS(net='alex').to(device)
        # FID model
        block_idx = InceptionV3.BLOCK_INDEX_BY_DIM[2048]
        self.inception = InceptionV3([block_idx]).to(device)
        self.inception.eval()
        
    def evaluate_single(self, img_path):
        console.print(f"[bold yellow]Evaluating single image:[/] {img_path}")
        filename = os.path.basename(img_path)
        
        transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.Grayscale(num_output_channels=1),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5], std=[0.5]),
        ])
        
        img = Image.open(img_path).convert("L")
        x = transform(img).unsqueeze(0).to(self.device)
        
        start_t = time.time()
        with torch.no_grad():
            pred = self.model(x)
        processing_time = time.time() - start_t
        
        pred_rgb = denorm(pred)[0]
        out_path = os.path.join(self.dirs['preds'], f"pred_{filename}")
        save_image(pred_rgb, out_path)
        
        console.print(f"[bold green]Saved prediction to:[/] {out_path}")
        console.print(f"Processing Time: {processing_time*1000:.1f} ms")
        
    def evaluate_dataset(self):
        from src.data.dataset import LandsatDataset
        from torch.utils.data import DataLoader
        
        console.print(f"[bold cyan]Loading Dataset from:[/] {self.test_dir}")
        dataset = LandsatDataset(self.test_dir)
        loader = DataLoader(dataset, batch_size=1, shuffle=False)
        
        console.print(f"[bold green]Found {len(dataset)} images.[/]")
        
        times = []
        
        with Progress() as progress:
            task = progress.add_task("[cyan]Running inference...", total=len(dataset))
            
            for idx, batch in enumerate(loader):
                if self.limit is not None and idx >= self.limit:
                    break
                ir = batch['ir'].to(self.device)
                gt = batch['rgb'].to(self.device)
                
                filename = os.path.basename(dataset.ir_paths[idx])
                
                start_t = time.time()
                with torch.no_grad():
                    pred = self.model(ir)
                processing_time = time.time() - start_t
                times.append(processing_time)
                
                # Denormalize to [0,1]
                pred_denorm = denorm(pred)[0]
                gt_denorm = denorm(gt)[0]
                
                # Save Prediction
                pred_path = os.path.join(self.dirs['preds'], filename)
                save_image(pred_denorm, pred_path)
                
                # Compute Metrics (per image)
                psnr_val = calculate_psnr(pred_denorm, gt_denorm)
                ssim_val = calculate_ssim(pred_denorm, gt_denorm)
                mse_val = torch.mean((pred_denorm - gt_denorm)**2).item()
                mae_val = torch.mean(torch.abs(pred_denorm - gt_denorm)).item()
                
                # LPIPS expects [-1, 1]
                lpips_val = self.lpips_fn(pred, gt).item()
                
                # FID storage (expects 0-1 tensors for our helper)
                self.pred_tensors_for_fid.append(pred_denorm)
                self.gt_tensors_for_fid.append(gt_denorm)
                
                # Diff map & Comparison
                diff = torch.abs(pred_denorm - gt_denorm).mean(dim=0).cpu().numpy()
                comp_path = os.path.join(self.dirs['comps'], f"comp_{filename}")
                save_comparison(ir[0], gt_denorm, pred_denorm, diff, comp_path)
                
                self.results.append({
                    "filename": filename,
                    "psnr": psnr_val,
                    "ssim": ssim_val,
                    "mse": mse_val,
                    "mae": mae_val,
                    "lpips": lpips_val,
                    "inference_time": inf_time,
                    "ir_path": dataset.ir_paths[idx],
                    "pred_path": pred_path,
                    "gt_path": dataset.rgb_paths[idx]
                })
                
                progress.advance(task)
                
        self.generate_reports(times)
        
    def generate_reports(self, times):
        console.print("\n[bold cyan]Calculating evaluation metrics...[/]")
        
        # FID
        pred_feats = get_fid_features(self.pred_tensors_for_fid, self.inception, self.device)
        gt_feats = get_fid_features(self.gt_tensors_for_fid, self.inception, self.device)
        
        mu1, sigma1 = np.mean(pred_feats, axis=0), np.cov(pred_feats, rowvar=False)
        mu2, sigma2 = np.mean(gt_feats, axis=0), np.cov(gt_feats, rowvar=False)
        # Local fixed version of calculate_frechet_distance since scipy removed `disp`
        import scipy.linalg
        def calculate_frechet_distance_local(mu1, sigma1, mu2, sigma2, eps=1e-6):
            mu1 = np.atleast_1d(mu1)
            mu2 = np.atleast_1d(mu2)
            sigma1 = np.atleast_2d(sigma1)
            sigma2 = np.atleast_2d(sigma2)
            diff = mu1 - mu2
            covmean, _ = scipy.linalg.sqrtm(sigma1.dot(sigma2), disp=False) if 'disp' in scipy.linalg.sqrtm.__code__.co_varnames else (scipy.linalg.sqrtm(sigma1.dot(sigma2)), None)
            
            if not np.isfinite(covmean).all():
                msg = ('fid calculation produces singular product; '
                       'adding %s to diagonal of cov estimates') % eps
                offset = np.eye(sigma1.shape[0]) * eps
                covmean = scipy.linalg.sqrtm((sigma1 + offset).dot(sigma2 + offset))
            
            if np.iscomplexobj(covmean):
                if not np.allclose(np.diagonal(covmean).imag, 0, atol=1e-3):
                    m = np.max(np.abs(covmean.imag))
                    raise ValueError('Imaginary component {}'.format(m))
                covmean = covmean.real
            
            tr_covmean = np.trace(covmean)
            return (diff.dot(diff) + np.trace(sigma1) + np.trace(sigma2) - 2 * tr_covmean)
            
        fid_val = calculate_frechet_distance_local(mu1, sigma1, mu2, sigma2)
        
        df = pd.DataFrame(self.results)
        df.to_csv(os.path.join(self.dirs['metrics'], "metrics.csv"), index=False)
        
        avg_psnr = df['psnr'].mean()
        avg_ssim = df['ssim'].mean()
        avg_mse = df['mse'].mean()
        avg_mae = df['mae'].mean()
        avg_lpips = df['lpips'].mean()
        
        avg_time = np.mean(times)
        min_time = np.min(times)
        max_time = np.max(times)
        fps = 1.0 / avg_time
        
        summary = {
            "Total Images": int(len(df)),
            "Average PSNR": float(avg_psnr),
            "Average SSIM": float(avg_ssim),
            "Average LPIPS": float(avg_lpips),
            "Average FID": float(fid_val),
            "Average MSE": float(avg_mse),
            "Average MAE": float(avg_mae),
            "Average Inference Time (s)": float(avg_time),
            "Min Inference Time (s)": float(min_time),
            "Max Inference Time (s)": float(max_time),
            "Average FPS": float(fps)
        }
        
        with open(os.path.join(self.dirs['metrics'], "summary.json"), "w") as f:
            json.dump(summary, f, indent=4)
            
        self._generate_plots(df)
        self._generate_grids(df)
        self._print_console_summary(summary)
        self._generate_markdown(summary)
        
    def _generate_plots(self, df):
        sns.set_theme(style="whitegrid")
        
        # PSNR Distribution
        plt.figure()
        sns.histplot(df['psnr'], kde=True, color='blue')
        plt.title('PSNR Distribution')
        plt.savefig(os.path.join(self.dirs['plots'], 'psnr_distribution.png'))
        plt.close()
        
        # SSIM Distribution
        plt.figure()
        sns.histplot(df['ssim'], kde=True, color='green')
        plt.title('SSIM Distribution')
        plt.savefig(os.path.join(self.dirs['plots'], 'ssim_distribution.png'))
        plt.close()
        
        # Inference Time
        plt.figure()
        sns.histplot(df['inference_time'] * 1000, kde=True, color='orange')
        plt.title('Inference Time Distribution (ms)')
        plt.xlabel('Time (ms)')
        plt.savefig(os.path.join(self.dirs['plots'], 'inference_time.png'))
        plt.close()
        
        # PSNR vs SSIM
        plt.figure()
        sns.scatterplot(x='psnr', y='ssim', data=df, hue='lpips', palette='viridis')
        plt.title('PSNR vs SSIM (Color: LPIPS)')
        plt.savefig(os.path.join(self.dirs['plots'], 'psnr_vs_ssim.png'))
        plt.close()

    def _generate_grids(self, df):
        sorted_df = df.sort_values(by='lpips') # lower is better
        
        best = sorted_df.head(10).to_dict('records')
        worst = sorted_df.tail(10).to_dict('records')
        random_samp = sorted_df.sample(min(10, len(df))).to_dict('records')
        
        save_sample_grid(best, "Top 10 Best Predictions (Lowest LPIPS)", os.path.join(self.dirs['best'], "best_predictions.png"))
        save_sample_grid(worst, "Top 10 Worst Predictions (Highest LPIPS)", os.path.join(self.dirs['worst'], "worst_predictions.png"))
        save_sample_grid(random_samp, "Random 10 Predictions", os.path.join(self.dirs['report'], "random_predictions.png"))

    def _print_console_summary(self, s):
        table = Table(title="Evaluation Summary", show_header=True, header_style="bold magenta")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="green")
        
        table.add_row("Images Evaluated", str(s["Total Images"]))
        table.add_row("Average PSNR", f"{s['Average PSNR']:.2f} dB")
        table.add_row("Average SSIM", f"{s['Average SSIM']:.4f}")
        table.add_row("Average LPIPS", f"{s['Average LPIPS']:.4f}")
        table.add_row("Average FID", f"{s['Average FID']:.2f}")
        table.add_row("Average Inference", f"{s['Average Inference Time (s)']*1000:.2f} ms")
        table.add_row("FPS", f"{s['Average FPS']:.1f}")
        
        console.print("\n")
        console.print(table)
        console.print("\n")

    def _generate_markdown(self, s):
        md = f"""# Model Evaluation Report
        
## Overview
- **Project:** InfraVision AI
- **Model Used:** Pix2Pix (U-Net Generator + PatchGAN Discriminator)
- **Dataset:** Landsat 8 (Thermal IR to RGB)
- **Images Evaluated:** {s['Total Images']}
- **Hardware:** {'GPU' if self.device.type == 'cuda' else 'CPU'}

## Average Metrics
| Metric | Score | Description |
|---|---|---|
| **PSNR** | {s['Average PSNR']:.2f} dB | Peak Signal-to-Noise Ratio (Higher is better) |
| **SSIM** | {s['Average SSIM']:.4f} | Structural Similarity Index (Closer to 1 is better) |
| **LPIPS** | {s['Average LPIPS']:.4f} | Learned Perceptual Image Patch Similarity (Lower is better) |
| **FID** | {s['Average FID']:.2f} | Fréchet Inception Distance (Lower is better) |
| **MSE** | {s['Average MSE']:.4f} | Mean Squared Error |
| **MAE** | {s['Average MAE']:.4f} | Mean Absolute Error |

## Performance
| Metric | Time |
|---|---|
| **Average Inference Time** | {s['Average Inference Time (s)']*1000:.2f} ms |
| **Min Inference Time** | {s['Min Inference Time (s)']*1000:.2f} ms |
| **Max Inference Time** | {s['Max Inference Time (s)']*1000:.2f} ms |
| **Frames Per Second (FPS)** | {s['Average FPS']:.1f} |

## Figures
- ![PSNR Distribution](../plots/psnr_distribution.png)
- ![SSIM Distribution](../plots/ssim_distribution.png)
- ![PSNR vs SSIM](../plots/psnr_vs_ssim.png)

## Future Improvements
- Train on larger batch sizes to improve FID.
- Introduce Attention mechanisms in the U-Net.
"""
        with open(os.path.join(self.dirs['report'], "evaluation_report.md"), "w") as f:
            f.write(md)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate the Pix2Pix Model")
    parser.add_argument("--weights", type=str, default="saved_models/generator_epoch_95.pth")
    parser.add_argument("--test_dir", type=str, default="data/")
    parser.add_argument("--output", type=str, default="outputs/")
    parser.add_argument("--single", type=str, default=None, help="Path to single IR image to evaluate")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of dataset items")
    args = parser.parse_args()
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    console.print(f"[bold magenta]Using Device:[/] {device}")
    
    evaluator = Evaluator(args.weights, args.test_dir, args.output, device, args.limit)
    
    if args.single:
        evaluator.evaluate_single(args.single)
    else:
        evaluator.evaluate_dataset()
