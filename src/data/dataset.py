import os
import glob
from PIL import Image
import torch
from torch.utils.data import Dataset
import torchvision.transforms as transforms


class LandsatDataset(Dataset):
    """
    This class helps Python load our images from the hard drive so the AI can read them.
    It expects two folders:
        data/ir/  -> The black-and-white infrared images
        data/rgb/ -> The corresponding real color images
    """

    def __init__(self, root_dir: str, img_size: int = 256):
        self.ir_dir = os.path.join(root_dir, "ir")
        self.rgb_dir = os.path.join(root_dir, "rgb")

        self.ir_paths = sorted(
            glob.glob(os.path.join(self.ir_dir, "*.png"))
            + glob.glob(os.path.join(self.ir_dir, "*.jpg"))
            + glob.glob(os.path.join(self.ir_dir, "*.tif"))
        )
        self.rgb_paths = sorted(
            glob.glob(os.path.join(self.rgb_dir, "*.png"))
            + glob.glob(os.path.join(self.rgb_dir, "*.jpg"))
            + glob.glob(os.path.join(self.rgb_dir, "*.tif"))
        )

        assert len(self.ir_paths) == len(self.rgb_paths), (
            f"Mismatch: {len(self.ir_paths)} IR images vs {len(self.rgb_paths)} RGB images."
        )

        self.transform_ir = transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.Grayscale(num_output_channels=1),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5], std=[0.5]),
        ])

        self.transform_rgb = transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
        ])

    def __len__(self):
        return len(self.ir_paths)

    def __getitem__(self, idx):
        ir_img = Image.open(self.ir_paths[idx]).convert("L")
        rgb_img = Image.open(self.rgb_paths[idx]).convert("RGB")

        return {
            "ir": self.transform_ir(ir_img),
            "rgb": self.transform_rgb(rgb_img),
        }
