import torch
import torch.nn.functional as F

def calculate_psnr(img1, img2):
    """
    Peak Signal-to-Noise Ratio.
    Assumes img1 and img2 are tensors with values in [-1, 1] or [0, 1].
    """
    mse = F.mse_loss(img1, img2)
    if mse == 0:
        return float('inf')
    
    # Assuming images are scaled to [0, 1] after normalization mapping
    max_pixel = 1.0
    psnr = 20 * torch.log10(max_pixel / torch.sqrt(mse))
    return psnr.item()

import numpy as np
from skimage.metrics import structural_similarity

def calculate_ssim(img1, img2):
    """
    Structural Similarity Index.
    Assumes img1 and img2 are PyTorch tensors.
    """
    # Convert tensors to numpy arrays and change shape to [H, W, C] for skimage
    img1_np = img1.detach().cpu().numpy().transpose(1, 2, 0)
    img2_np = img2.detach().cpu().numpy().transpose(1, 2, 0)
    
    # Calculate SSIM 
    data_range = img2_np.max() - img2_np.min()
    if data_range == 0:
        data_range = 1.0 # fallback

    ssim_value = structural_similarity(
        img1_np, img2_np, 
        data_range=data_range,
        channel_axis=-1
    )
    return ssim_value
