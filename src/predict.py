import os
import sys
import argparse
import time
from PIL import Image
import torch
import torchvision.transforms as transforms
import torchvision.transforms.functional as TF
import numpy as np
import cv2

# Set pathing for local imports
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(project_root, "src"))
sys.path.insert(0, project_root)

from models.generator import GeneratorUNet
from models.sr_model import SRCNN

# Set environment variables for Windows thread safety
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["OMP_NUM_THREADS"] = "1"

def get_latest_checkpoint(model_dir):
    """Scan saved_models for the latest generator checkpoint."""
    if not os.path.exists(model_dir):
        return None
    checkpoints = [f for f in os.listdir(model_dir) if f.startswith("generator_epoch_") and f.endswith(".pth")]
    if not checkpoints:
        return None
    # Sort by epoch number
    checkpoints.sort(key=lambda x: int(x.split('_')[2].split('.')[0]))
    return os.path.join(model_dir, checkpoints[-1])

def enhance_ir_classical(pil_img):
    """Classical fallback to enhance structural details using CLAHE & Unsharp Masking."""
    img_np = np.array(pil_img)
    
    # Apply Contrast Limited Adaptive Histogram Equalization (CLAHE)
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    enhanced_np = clahe.apply(img_np)
    
    # Apply Unsharp Masking to sharpen details
    blurred = cv2.GaussianBlur(enhanced_np, (9, 9), 10.0)
    sharpened = cv2.addWeighted(enhanced_np, 1.6, blurred, -0.6, 0)
    
    return Image.fromarray(sharpened)

def run_inference(image_path, generator_weights_path=None, sr_weights_path=None, output_dir=None):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[*] Running inference on device: {device}")
    
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
    
    # 1. Load the raw IR Image
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Input image not found: {image_path}")
        
    raw_ir = Image.open(image_path).convert("L")
    original_size = raw_ir.size # (width, height)
    
    start_time = time.time()
    
    # 2. Image Details Enhancement (SRCNN vs. Classical Filter)
    if sr_weights_path and os.path.exists(sr_weights_path):
        print(f"[*] Loading SRCNN model weights from: {sr_weights_path}")
        srcnn = SRCNN(num_channels=1).to(device)
        srcnn.load_state_dict(torch.load(sr_weights_path, map_location=device))
        srcnn.eval()
        
        # Preprocess for SRCNN
        sr_transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
        ])
        ir_tensor = sr_transform(raw_ir).unsqueeze(0).to(device)
        
        with torch.no_grad():
            enhanced_tensor = srcnn(ir_tensor)
            enhanced_tensor = torch.clamp(enhanced_tensor, 0.0, 1.0)
            
        enhanced_ir = TF.to_pil_image(enhanced_tensor.squeeze(0).cpu())
    else:
        print("[!] No valid SRCNN weights found. Using high-fidelity CLAHE + Unsharp Masking details enhancement.")
        enhanced_ir = enhance_ir_classical(raw_ir)
    
    # Resize enhanced IR to 256 for U-Net generator
    enhanced_resized = enhanced_ir.resize((256, 256))
    
    # 3. Image Colorization (Pix2Pix U-Net Generator)
    if not generator_weights_path:
        model_dir = os.path.join(project_root, "saved_models")
        generator_weights_path = get_latest_checkpoint(model_dir)
        
    if not generator_weights_path or not os.path.exists(generator_weights_path):
        raise FileNotFoundError("No generator model checkpoint found. Train the model first or supply weights path.")
        
    print(f"[*] Loading Generator U-Net weights from: {generator_weights_path}")
    generator = GeneratorUNet(in_channels=1, out_channels=3).to(device)
    generator.load_state_dict(torch.load(generator_weights_path, map_location=device))
    generator.eval()
    
    # Preprocess for Generator (Normalizes to [-1, 1])
    gen_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,))
    ])
    
    # Input is the enhanced/sharpened IR image
    gen_input = gen_transform(enhanced_resized).unsqueeze(0).to(device)
    
    with torch.no_grad():
        fake_rgb_tensor = generator(gen_input)
        # Denormalize from [-1, 1] to [0, 1]
        fake_rgb_tensor = (fake_rgb_tensor.squeeze(0) + 1.0) / 2.0
        fake_rgb_tensor = torch.clamp(fake_rgb_tensor, 0.0, 1.0)
        
    generated_rgb = TF.to_pil_image(fake_rgb_tensor.cpu())
    
    # Resize back to original resolution if desired for natural output
    enhanced_ir_out = enhanced_ir.resize(original_size, Image.Resampling.LANCZOS)
    generated_rgb_out = generated_rgb.resize(original_size, Image.Resampling.LANCZOS)
    
    inference_time = time.time() - start_time
    print(f"[+] Inference complete in {inference_time:.4f} seconds.")
    
    if output_dir:
        base_name = os.path.splitext(os.path.basename(image_path))[0]
        enhanced_path = os.path.join(output_dir, f"{base_name}_enhanced.png")
        generated_path = os.path.join(output_dir, f"{base_name}_colorized.png")
        
        enhanced_ir_out.save(enhanced_path)
        generated_rgb_out.save(generated_path)
        print(f"[+] Saved enhanced IR to: {enhanced_path}")
        print(f"[+] Saved colorized RGB to: {generated_path}")
        
    return enhanced_ir_out, generated_rgb_out, inference_time

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run IR Image Enhancement & Colorization Inference")
    parser.add_argument("--image", type=str, required=True, help="Path to input IR image")
    parser.add_argument("--generator_weights", type=str, default=None, help="Path to Generator weight file (.pth)")
    parser.add_argument("--sr_weights", type=str, default=None, help="Path to SRCNN weight file (.pth)")
    parser.add_argument("--output_dir", type=str, default="output_samples", help="Directory to save output results")
    
    args = parser.parse_args()
    
    try:
        run_inference(
            image_path=args.image,
            generator_weights_path=args.generator_weights,
            sr_weights_path=args.sr_weights,
            output_dir=args.output_dir
        )
    except Exception as e:
        print(f"[-] Error: {e}")
        sys.exit(1)
