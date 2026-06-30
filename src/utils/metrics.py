import torch
import torch.nn.functional as F

def calculate_psnr(img1, img2):
    """
    Peak Signal-to-Noise Ratio.
    Assumes img1 and img2 are tensors with values in [-1, 1] or [0, 1].
    """
    # If the inputs are in [-1, 1], map them to [0, 1]
    if img1.min() < -0.05 or img2.min() < -0.05:
        img1 = (img1 + 1.0) / 2.0
        img2 = (img2 + 1.0) / 2.0

    img1 = torch.clamp(img1, 0.0, 1.0)
    img2 = torch.clamp(img2, 0.0, 1.0)

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
    # If the inputs are in [-1, 1], map them to [0, 1]
    if img1.min() < -0.05 or img2.min() < -0.05:
        img1 = (img1 + 1.0) / 2.0
        img2 = (img2 + 1.0) / 2.0

    img1 = torch.clamp(img1, 0.0, 1.0)
    img2 = torch.clamp(img2, 0.0, 1.0)

    # Convert tensors to numpy arrays and change shape to [H, W, C] for skimage
    img1_np = img1.detach().cpu().numpy().transpose(1, 2, 0)
    img2_np = img2.detach().cpu().numpy().transpose(1, 2, 0)
    
    # Calculate SSIM 
    data_range = 1.0

    ssim_value = structural_similarity(
        img1_np, img2_np, 
        data_range=data_range,
        channel_axis=-1
    )
    return ssim_value

class SSIMLoss(torch.nn.Module):
    def __init__(self, window_size=11, size_average=True):
        super(SSIMLoss, self).__init__()
        self.window_size = window_size
        self.size_average = size_average
        
    def forward(self, img1, img2):
        # Denormalize if they are in [-1, 1]
        if img1.min() < -0.05 or img2.min() < -0.05:
            img1 = (img1 + 1.0) / 2.0
            img2 = (img2 + 1.0) / 2.0
            
        img1 = torch.clamp(img1, 0.0, 1.0)
        img2 = torch.clamp(img2, 0.0, 1.0)
        
        channel = img1.size(1)
        
        # Create Gaussian window
        def gaussian(window_size, sigma):
            gauss = torch.exp(torch.tensor([-(x - window_size//2)**2 / (2.0 * sigma**2) for x in range(window_size)]))
            return gauss / gauss.sum()
            
        _1D_window = gaussian(self.window_size, 1.5).unsqueeze(1)
        _2D_window = _1D_window.mm(_1D_window.t()).float().unsqueeze(0).unsqueeze(0)
        window = _2D_window.expand(channel, 1, self.window_size, self.window_size).to(img1.device)
        
        mu1 = F.conv2d(img1, window, padding=self.window_size//2, groups=channel)
        mu2 = F.conv2d(img2, window, padding=self.window_size//2, groups=channel)
        
        mu1_sq = mu1.pow(2)
        mu2_sq = mu2.pow(2)
        mu1_mu2 = mu1 * mu2
        
        sigma1_sq = F.conv2d(img1 * img1, window, padding=self.window_size//2, groups=channel) - mu1_sq
        sigma2_sq = F.conv2d(img2 * img2, window, padding=self.window_size//2, groups=channel) - mu2_sq
        sigma12 = F.conv2d(img1 * img2, window, padding=self.window_size//2, groups=channel) - mu1_mu2
        
        C1 = 0.01**2
        C2 = 0.03**2
        
        ssim_map = ((2 * mu1_mu2 + C1) * (2 * sigma12 + C2)) / ((mu1_sq + mu2_sq + C1) * (sigma1_sq + sigma2_sq + C2))
        
        if self.size_average:
            return 1.0 - ssim_map.mean()
        else:
            return 1.0 - ssim_map.mean(1).mean(1).mean(1)
