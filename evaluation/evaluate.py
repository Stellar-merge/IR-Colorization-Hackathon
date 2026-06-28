import os
import sys
import torch
from torch.utils.data import DataLoader

# Add src and project_root to Python path so we can import modules
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(project_root, "src"))
sys.path.append(project_root)

from models.generator import GeneratorUNet
from data.dataset import LandsatDataset
from utils.metrics import calculate_psnr, calculate_ssim

def evaluate_all():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # We resolve paths relative to the project root (assumed to be parent of src)
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(project_root, "data")
    model_dir = os.path.join(project_root, "saved_models")
    
    # Load dataset
    dataset = LandsatDataset(root_dir=data_dir, img_size=256)
    if len(dataset) == 0:
        print(f"No evaluation data found. Make sure {data_dir}/ir and {data_dir}/rgb are populated.")
        return
        
    dataloader = DataLoader(dataset, batch_size=1, shuffle=False)
    print(f"Loaded {len(dataset)} images for evaluation.")
    
    # Find all models in saved_models
    if not os.path.exists(model_dir):
        print(f"Model directory '{model_dir}' does not exist.")
        return
        
    model_files = [f for f in os.listdir(model_dir) if f.startswith("generator_epoch_") and f.endswith(".pth")]
    if not model_files:
        print("No saved generator models found.")
        return
        
    # Sort models by epoch number (generator_epoch_X.pth)
    model_files.sort(key=lambda x: int(x.split('_')[2].split('.')[0]))
    
    print(f"Found {len(model_files)} checkpoints to evaluate.\n")
    print(f"{'Epoch':<8} | {'Avg PSNR (dB)':<15} | {'Avg SSIM':<10}")
    print("-" * 40)
    
    results = []
    
    for model_file in model_files:
        epoch = int(model_file.split('_')[2].split('.')[0])
        model_path = os.path.join(model_dir, model_file)
        
        # Load model
        generator = GeneratorUNet(in_channels=1, out_channels=3).to(device)
        generator.load_state_dict(torch.load(model_path, map_location=device))
        generator.eval()
        
        total_psnr = 0
        total_ssim = 0
        num_samples = 0
        
        with torch.no_grad():
            for batch in dataloader:
                real_ir = batch["ir"].to(device)
                real_rgb = batch["rgb"].to(device)
                
                fake_rgb = generator(real_ir)
                
                for i in range(real_ir.size(0)):
                    total_psnr += calculate_psnr(fake_rgb[i], real_rgb[i])
                    total_ssim += calculate_ssim(fake_rgb[i], real_rgb[i])
                    num_samples += 1
                    
        avg_psnr = total_psnr / num_samples if num_samples > 0 else 0
        avg_ssim = total_ssim / num_samples if num_samples > 0 else 0
        
        print(f"{epoch:<8} | {avg_psnr:<15.2f} | {avg_ssim:<10.4f}")
        results.append({
            "epoch": epoch,
            "filename": model_file,
            "psnr": avg_psnr,
            "ssim": avg_ssim
        })
        
    # Find the best models
    best_psnr_model = max(results, key=lambda x: x["psnr"])
    best_ssim_model = max(results, key=lambda x: x["ssim"])
    
    print("\n" + "=" * 40)
    print("EVALUATION SUMMARY")
    print("=" * 40)
    print(f"Best PSNR Model: {best_psnr_model['filename']} (PSNR: {best_psnr_model['psnr']:.2f} dB, SSIM: {best_psnr_model['ssim']:.4f})")
    print(f"Best SSIM Model: {best_ssim_model['filename']} (PSNR: {best_ssim_model['psnr']:.2f} dB, SSIM: {best_ssim_model['ssim']:.4f})")
    print("=" * 40)

    # Generate MD report
    evaluation_dir = os.path.dirname(os.path.abspath(__file__))
    n = 0
    while True:
        report_filename = f"eval_results_{n}.md"
        report_path = os.path.join(evaluation_dir, report_filename)
        if not os.path.exists(report_path):
            break
        n += 1

    md_content = []
    md_content.append("# Model Evaluation Results")
    md_content.append("")
    md_content.append("Automated evaluation results across saved checkpoints using Peak Signal-to-Noise Ratio (**PSNR**) and Structural Similarity Index (**SSIM**).")
    md_content.append("")
    md_content.append("## 📊 Checkpoint Performance Table")
    md_content.append("")
    md_content.append("| Checkpoint | Epoch | Average PSNR (dB) | Average SSIM |")
    md_content.append("| :--- | :--- | :--- | :--- |")
    for r in results:
        is_best_psnr = (r["filename"] == best_psnr_model["filename"])
        is_best_ssim = (r["filename"] == best_ssim_model["filename"])
        
        name_str = f"**`{r['filename']}`**" if (is_best_psnr or is_best_ssim) else f"`{r['filename']}`"
        epoch_str = f"**{r['epoch']}**" if (is_best_psnr or is_best_ssim) else str(r["epoch"])
        psnr_str = f"**{r['psnr']:.2f} dB**" if is_best_psnr else f"{r['psnr']:.2f} dB"
        ssim_str = f"**{r['ssim']:.4f}**" if is_best_ssim else f"{r['ssim']:.4f}"
        
        if is_best_psnr:
            psnr_str += " 🏆"
        if is_best_ssim:
            ssim_str += " 🏆"
            
        md_content.append(f"| {name_str} | {epoch_str} | {psnr_str} | {ssim_str} |")
        
    md_content.append("")
    md_content.append("---")
    md_content.append("")
    md_content.append("## 🏆 The Best Model")
    md_content.append(f"The best checkpoint is **`{best_psnr_model['filename']}`** (epoch {best_psnr_model['epoch']}). It achieved:")
    md_content.append(f"* **Average PSNR**: `{best_psnr_model['psnr']:.2f} dB`")
    md_content.append(f"* **Average SSIM**: `{best_psnr_model['ssim']:.4f}`")
    
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_content) + "\n")
        
    print(f"\nSaved evaluation report to: evaluation/{report_filename}")

if __name__ == "__main__":
    evaluate_all()
