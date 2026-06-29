import os

# To enable the 1-thread limit (the default): 
#   uv run python src/train.py --limit_threads=true 
#   (or simply) uv run python src/train.py

# To disable the 1-thread limit: 
#   uv run python src/train.py --limit_threads=false

import argparse

# Parse arguments before importing PyTorch to ensure environment variables take effect
parser = argparse.ArgumentParser(description="Train IR Colorization model")
parser.add_argument("--limit_threads", type=lambda x: str(x).lower() in ['true', '1', 'yes'], 
                    default=True, help="Limit threads to 1 (True/False)")
args, _ = parser.parse_known_args()

if args.limit_threads:
    # Fix for OpenBLAS memory allocation error on Windows
    os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
    os.environ["OPENBLAS_NUM_THREADS"] = "1"
    os.environ["OMP_NUM_THREADS"] = "1"

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import torch.optim as optim
from torchvision.utils import save_image
from tqdm import tqdm

from models.generator import GeneratorUNet
from models.discriminator import Discriminator
from data.dataset import LandsatDataset
from utils.metrics import calculate_psnr

def train():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")
    
    # 1. Hyperparameters
    lr = 0.0002
    batch_size = 4
    epochs = 100
    SAVED_MODELS_DIR = "saved_models"
    OUTPUT_SAMPLES_DIR = "output_samples"
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    os.makedirs(OUTPUT_SAMPLES_DIR, exist_ok=True)
    
    # 2. Initialize models
    generator = GeneratorUNet(in_channels=1, out_channels=3).to(device)
    discriminator = Discriminator(in_channels=1, out_channels=3).to(device)
    
    # Loss functions for Pix2Pix
    criterion_GAN = nn.MSELoss()
    criterion_pixelwise = nn.L1Loss()
    lambda_pixel = 100 # Weight for L1 loss
    
    # Optimizers
    optimizer_G = optim.Adam(generator.parameters(), lr=lr, betas=(0.5, 0.999))
    optimizer_D = optim.Adam(discriminator.parameters(), lr=lr, betas=(0.5, 0.999))
    
    # 3. Data Loading
    data_dir = os.path.join("data", "train")
    os.makedirs(os.path.join(data_dir, "ir"), exist_ok=True)
    os.makedirs(os.path.join(data_dir, "rgb"), exist_ok=True)
    
    dataset = LandsatDataset(root_dir=data_dir, img_size=256)
    
    if len(dataset) == 0:
        print(f"No images found in {data_dir}/ir and {data_dir}/rgb. Please add data before training.")
        return
        
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    
    # 4. Training Loop
    for epoch in range(epochs):
        loop = tqdm(dataloader, leave=True)
        for i, batch in enumerate(loop):
            real_ir = batch["ir"].to(device)
            real_rgb = batch["rgb"].to(device)
            
            # Adversarial ground truths
            valid = torch.ones((real_ir.size(0), 1, 16, 16), device=device, requires_grad=False)
            fake = torch.zeros((real_ir.size(0), 1, 16, 16), device=device, requires_grad=False)
            
            # ------------------
            #  Train Generator
            # ------------------
            optimizer_G.zero_grad()
            
            fake_rgb = generator(real_ir)
            
            # GAN loss (discriminator's opinion on fake images)
            pred_fake = discriminator(fake_rgb, real_ir)
            loss_GAN = criterion_GAN(pred_fake, valid)
            
            # Pixel-wise loss
            loss_pixel = criterion_pixelwise(fake_rgb, real_rgb)
            
            # Total generator loss
            loss_G = loss_GAN + lambda_pixel * loss_pixel
            loss_G.backward()
            optimizer_G.step()
            
            # ---------------------
            #  Train Discriminator
            # ---------------------
            optimizer_D.zero_grad()
            
            # Real loss
            pred_real = discriminator(real_rgb, real_ir)
            loss_real = criterion_GAN(pred_real, valid)
            
            # Fake loss
            pred_fake = discriminator(fake_rgb.detach(), real_ir)
            loss_fake = criterion_GAN(pred_fake, fake)
            
            # Total discriminator loss
            loss_D = 0.5 * (loss_real + loss_fake)
            loss_D.backward()
            optimizer_D.step()
            
            # Calculate PSNR for this batch (acts as an "accuracy" metric for image generation)
            psnr = calculate_psnr(fake_rgb.detach(), real_rgb)
            
            # Update progress bar
            loop.set_description(f"Epoch [{epoch}/{epochs}]")
            loop.set_postfix(loss_D=loss_D.item(), loss_G=loss_G.item(), psnr=f"{psnr:.2f}")
            
        # Save sample images every 5 epochs
        if epoch % 5 == 0:
            sample_ir = real_ir[:4]
            sample_rgb = real_rgb[:4]
            sample_fake = fake_rgb[:4]
            
            # Combine real IR (repeated to 3 channels), generated RGB, and Real RGB for visualization
            img_sample = torch.cat((sample_ir.repeat(1, 3, 1, 1), sample_fake, sample_rgb), -2)
            save_image(img_sample, os.path.join(OUTPUT_SAMPLES_DIR, f"epoch_{epoch}.png"), nrow=4, normalize=True)
            
            import io
            buffer = io.BytesIO()
            torch.save(generator.state_dict(), buffer)
            with open(os.path.join(SAVED_MODELS_DIR, f"generator_epoch_{epoch}.pth"), "wb") as f:
                f.write(buffer.getvalue())
if __name__ == "__main__":
    train()
