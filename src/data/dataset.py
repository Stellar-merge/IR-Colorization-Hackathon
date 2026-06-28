import os
from PIL import Image
from torch.utils.data import Dataset
import torchvision.transforms as transforms

class LandsatDataset(Dataset):
    def __init__(self, root_dir, img_size=256):
        self.root_dir = root_dir
        self.img_size = img_size
        
        # Paths to IR and RGB directories
        self.ir_dir = os.path.join(root_dir, "ir")
        self.rgb_dir = os.path.join(root_dir, "rgb")
        
        # Get all image filenames in ir directory
        if os.path.exists(self.ir_dir):
            self.filenames = sorted([f for f in os.listdir(self.ir_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.tif', '.tiff'))])
        else:
            self.filenames = []
        
        # Define transforms
        # For IR (grayscale): convert to tensor, resize, and normalize to [-1, 1]
        self.ir_transform = transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize((0.5,), (0.5,))
        ])
        
        # For RGB: convert to tensor, resize, and normalize to [-1, 1]
        self.rgb_transform = transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])

    def __len__(self):
        return len(self.filenames)

    def __getitem__(self, idx):
        filename = self.filenames[idx]
        
        # Load IR image as grayscale (1 channel)
        ir_path = os.path.join(self.ir_dir, filename)
        ir_img = Image.open(ir_path).convert("L")
        
        # Load RGB image as RGB (3 channels)
        rgb_path = os.path.join(self.rgb_dir, filename)
        rgb_img = Image.open(rgb_path).convert("RGB")
        
        # Apply transforms
        ir_tensor = self.ir_transform(ir_img)
        rgb_tensor = self.rgb_transform(rgb_img)
        
        return {
            "ir": ir_tensor,
            "rgb": rgb_tensor
        }
