# Comprehensive Project Report: IR Image Enhancement & Colorization

## 1. Project Overview
The objective of this project for the Bharatiya Antariksh Hackathon is to build a robust deep learning pipeline capable of transforming monochrome, low-contrast Infrared (IR) satellite imagery into high-resolution, naturally colored RGB imagery. This capability accelerates visual interpretation for human analysts and provides structured color channels for downstream machine learning tasks.

This report documents the entire end-to-end development process, from environment initialization to successful model training.

---

## 2. Environment & Infrastructure Setup
We established a modern, highly performant Python environment designed to handle deep learning workloads.
- **Dependency Management**: We utilized `uv` for lightning-fast resolution and installation of dependencies.
- **Environment**: Initialized a Python 3.12 virtual environment (`.venv`).
- **Dependencies Installed**: Successfully installed 62 required packages, most notably `torch` (with CUDA 12.4 support for GPU acceleration), `torchvision`, `earthengine-api` (for satellite data retrieval), `tqdm`, and `pillow`.
- **Infrastructure Migration**: Mid-development, we encountered storage constraints (Errno 28) and OneDrive sync file-locking conflicts (`PytorchStreamWriter failed`) on the `C:\` drive. We resolved this by clearing 2.7 GB of `uv` cache and permanently migrating the entire workspace to the `D:\` drive.

---

## 3. Data Engineering & Google Earth Engine (GEE)
The model required high-quality, geographically diverse paired imagery (IR and RGB) for supervised training. 
- **GEE Authentication**: We configured and authenticated the Google Earth Engine API using the designated GCP project (`ir-hackathon-500606`).
- **Data Downloader (`src/data/download_gee.py`)**: We developed a custom script to interface with the Landsat 8 image collection.
  - Applied cloud filters to ensure clean imagery.
  - Dynamically fetched **200 paired tiles** of Infrared and RGB imagery across various coordinates in India.
  - Handled network I/O and saved the raw PNG tiles locally to `data/ir/` and `data/rgb/`.

---

## 4. Deep Learning Architecture
We employed a Pix2Pix-style Generative Adversarial Network (GAN) architecture to achieve realistic colorization.
- **The Generator (U-Net)**: Acts as the primary colorization engine. It takes the single-channel IR image and outputs a 3-channel RGB image. The U-Net architecture utilizes skip-connections to preserve high-frequency spatial structures and edges from the original satellite image.
- **The Discriminator (PatchGAN)**: Acts as the critic. It receives both the original IR image and the generated RGB image, and attempts to classify whether the colorization is "real" (ground truth) or "fake" (generated). This adversarial setup forces the Generator to produce highly realistic color distributions.
- **Data Loader (`src/data/dataset.py`)**: We built a custom PyTorch `Dataset` (`LandsatDataset`) to load, pair, resize (to 256x256), normalize, and tensorize the imagery for the neural networks.

---

## 5. Model Training & Optimization
The training loop was engineered for stability and visual tracking.
- **Training Script (`src/train.py`)**: Orchestrated the data loaders, initialized the optimizers (Adam), and managed the dual-loss functions (Adversarial GAN loss + L1 Pixel-wise loss).
- **Windows Optimizations**: Applied `KMP_DUPLICATE_LIB_OK=TRUE` to resolve OpenMP library conflicts specific to Windows environments.
- **Training Execution**: We successfully executed the training pipeline for **100 full epochs** over the 200 Landsat tiles.
- **Convergence**: Both the Discriminator loss and Generator loss converged smoothly, stabilizing around `loss_G ~ 6.0` and `loss_D ~ 0.0006`.
- **Artifacts Generated**:
  - **Checkpoints**: Saved the model weights every 5 epochs to the `saved_models/` directory (up to `generator_epoch_95.pth`), allowing for inference at various stages of learning.
  - **Visual Samples**: Automatically generated validation images during training and saved them to `output_samples/` to visually track the colorization improvements over time.

---

## 6. Version Control & Repository Management
- **Git Configuration**: We updated `.gitignore` to explicitly ignore the massive `data/` directory, the 2.4+ GB of PyTorch virtual environment files (`.venv/`), and the heavy model weights (`saved_models/`) and image outputs (`output_samples/`).
- **Code Submission**: Successfully committed all source code (`dataset.py`, `download_gee.py`, `train.py`) and pushed the clean repository up to the `main` branch on GitHub.

---

## 7. Next Steps for Hackathon Submission
With the heavy lifting of data engineering and model training complete, the pipeline is fully operational. The recommended next steps include:
1. **Inference Script**: Develop a standalone script to load `generator_epoch_95.pth` and colorize newly provided IR images.
2. **Interactive UI**: Wrap the inference script in a lightweight Web UI (e.g., Streamlit) to allow judges to upload an IR image and view the colorized result in real-time.
