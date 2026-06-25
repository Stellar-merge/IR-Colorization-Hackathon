# Post-Hackathon Report: IR Image Enhancement & Colorization

## Overview
We successfully built a deep learning pipeline to transform monochrome, low-contrast Infrared (IR) satellite images into high-resolution, naturally colored RGB images. This improves visual interpretability for human analysts and downstream machine learning tasks.

## What We Built

### 1. The Super-Resolution (SR) Module
We implemented an SRCNN (Super-Resolution CNN) that acts as the first stage. It takes raw IR images and enhances their structural details. We opted for SRCNN because it is lightweight, fast, and easy to train during a time-constrained hackathon.

### 2. The Pix2Pix Colorization Model
The core of our colorization engine uses a Generative Adversarial Network (GAN). 
- **The Generator (U-Net)**: It looks at the enhanced IR image and "paints" it. U-Net is great because its skip-connections preserve the structural edges from the input.
- **The Discriminator (PatchGAN)**: It looks at patches of the output and decides if it looks like a "real" satellite image or a "fake" generated one. This competition forces the Generator to produce highly realistic colors.

### 3. Data Pipeline
We built a custom PyTorch `Dataset` class (`LandsatDataset`) that seamlessly loads paired IR-RGB images, normalizes them, and feeds them to our models. 

### 4. Metrics & Evaluation
We implemented evaluation scripts for computing:
- **PSNR/SSIM**: Measuring structural similarity.
- **Inference Time**: We verified the model can process tiles rapidly.

## Code Structure Explained (For Beginners)
- **`src/models/generator.py` & `discriminator.py`**: These contain the PyTorch network architectures. If you know basic neural networks, think of them as specialized feature extractors and reconstructors.
- **`src/models/sr_model.py`**: The image sharpener.
- **`src/train.py`**: The main loop where the model "studies" the images, calculates its mistakes (losses), and updates itself.
- **`src/data/dataset.py`**: Code that tells the computer how to read image files from a folder and convert them into numbers (tensors) that PyTorch can understand.

## How to Run It
1. Install dependencies and set up the environment using uv: `uv sync`
2. Prepare your data folder with paired IR and RGB images in `data/ir/` and `data/rgb/`.
3. Run training: `uv run python src/train.py`
