# InfraVision AI

## Project Overview
InfraVision AI is a futuristic web application and machine learning project that converts Infrared (IR) satellite images into full-color RGB images. We use an AI model called Pix2Pix to automatically guess and fill in the missing colors, helping researchers and students view satellite data in true color.

## Problem Statement
Satellites often capture images in the infrared spectrum because it helps them see through thin clouds and gather data about temperature or vegetation. However, these infrared images look like black-and-white or false-color pictures, which are very hard for humans to understand intuitively. Our goal is to use AI to automatically colorize these infrared images so they look like normal, human-readable satellite photos.

## Features
- **AI Colorization:** Uses a trained Pix2Pix (U-Net) neural network to turn IR images into RGB images.
- **Modern Dashboard:** A sleek, futuristic web interface inspired by ISRO and NASA mission control.
- **Fast Evaluation:** A complete testing script that automatically calculates how well the AI model is performing.
- **Detailed Reports:** Automatically generates graphs, heatmaps, and quality scores so you can see exactly where the AI succeeded or made mistakes.

## Folder Structure
```text
IR-Colorization-Hackathon/
│
├── data/                  # Contains the test satellite images (IR and RGB)
├── saved_models/          # Contains our trained AI model weights
├── src/                   # Source code for the AI models and dataset loaders
├── web/                   # The Next.js web dashboard frontend
├── evaluate.py            # The main script to run tests and evaluate the AI
└── outputs/               # Where the final graphs, reports, and metrics are saved
```

## Installation

1. **Clone the repository:**
   Download the project folder to your computer.

2. **Install Python Packages:**
   Make sure you have Python installed. Then, install the required packages using:
   ```bash
   pip install torch torchvision opencv-python numpy matplotlib seaborn pandas scikit-image torchmetrics tqdm rich pytorch-fid lpips
   ```

3. **Install Web Dashboard Packages:**
   Open a new terminal, go into the `web` folder, and install the website dependencies:
   ```bash
   cd web
   npm install
   ```

## How to Run

### 1. Start the Web Dashboard
To see the futuristic web interface, run the development server:
```bash
cd web
npm run dev
```
Then, open your web browser and go to `http://localhost:3000`.

### 2. Run the Evaluation Pipeline
To test the AI model and generate performance graphs, run the evaluation script from the main folder:
```bash
python evaluate.py --test_dir data/ --output outputs/
```

## Training
*Note: The model is already trained and the weights are included in the `saved_models/` folder. You do not need to run training again.*

<<<<<<< HEAD
If you do want to train a new model from scratch in the future, you would use a training script that feeds pairs of IR and RGB images to the Pix2Pix model until it learns the mapping.
=======
### Step 5: Evaluate Checkpoints & Performance Benchmarking
To identify the best performing model from your training runs, you can benchmark all saved checkpoints against Peak Signal-to-Noise Ratio (**PSNR**) and Structural Similarity Index (**SSIM**) metrics.

Run the automated evaluation runner:
```bash
uv run python evaluation/evaluate.py
```

**Benchmarking Workflow:**
* **Auto-scan Checkpoints**: The runner scans the `saved_models/` folder and orders all checkpoints sequentially by training epoch.
* **Metric Computation**: It computes structural coherence (SSIM) and color-matching accuracy (PSNR) compared to ground-truth RGB imagery.
* **Auto-generated Reports**: The script dynamically outputs a benchmark table to the console and generates a sequential markdown report at `eval_results/eval_results_{n}.md` (e.g., `eval_results_0.md`, `eval_results_1.md`) so you can track improvement across runs.
* **Best Model Selection**: Use the summary at the bottom of the generated report to choose the best weights for deployment.

### Step 6: Offline Single-Image Prediction (CLI)
You can run colorization and detail enhancement on any raw IR image directly from your terminal using the offline prediction script:

```bash
uv run python src/predict.py --image path/to/your/image.png
```
* **Weights Resolution**: The script automatically scans your `saved_models/` directory, selects the latest checkpoint, and saves both the structural-enhanced IR and colorized RGB outputs directly into `output_samples/`.
* **Detail Fallback**: If no SRCNN weights are provided, it automatically applies advanced CLAHE & Unsharp Masking filters to enhance structural details.

### Step 7: Launch the Web UI & Model API Server
The project includes a web dashboard built with Next.js that communicates with a FastAPI model-serving backend.

1. **Start the Python Inference API Server**:
   ```bash
   uv run python src/serve.py
   ```
   *This starts the FastAPI server at `http://127.0.0.1:8000`. The server loads the model once into memory (utilizing GPU CUDA acceleration if available) for instant, sub-second responses.*

2. **Start the Next.js Web Frontend**:
   Open a separate terminal window and run:
   ```bash
   cd web
   npm run dev
   ```
   *This starts the Next.js development server. Open [http://localhost:3000](http://localhost:3000) in your browser to view the interactive imagery reconstruction portal!*

---
>>>>>>> 85e741e951eaa75693abe36a0384dbf209e08c74

## Testing and Evaluation
We use several standard computer vision metrics to test how good the AI's colors are. 
* **Why do we use these?** Because predicting colors isn't a simple "True or False" question. We need math to tell us how close the predicted color is to the real color.

<<<<<<< HEAD
- **PSNR (Peak Signal-to-Noise Ratio):** Measures the overall quality of the image. Higher is better.
- **SSIM (Structural Similarity Index):** Measures if the shapes, buildings, and rivers look correct. Closer to 1 is better.
- **LPIPS & FID:** These are advanced "perceptual" metrics. They use another AI to judge if the final image actually *looks* real to the human eye. Lower is better.

## Results
Based on a recent test of 50 images:
- **Images Evaluated:** 50
- **Average PSNR:** 28.83 dB
- **Average SSIM:** 0.5825
- **Average LPIPS:** 0.3135
- **Average FID:** 132.92
- **Speed:** 69.6 Frames Per Second (FPS) on a standard graphics card.

The model successfully colorizes the satellite images and runs fast enough for real-time video feeds!

## Future Work
- **Live Video Stream:** Connect the AI directly to a live satellite feed.
- **Better AI Models:** Upgrade from Pix2Pix to a modern Diffusion model for even higher quality images.
- **Live Backend:** Connect the Python AI code directly to the Next.js website so users can upload their own images and get real-time colorization results.
=======
* **`src/predict.py`**: Command-line tool for offline image prediction.
* **`src/serve.py`**: FastAPI server hosting the deep learning API endpoints.
* **`web/`**: Next.js interactive web frontend dashboard.
* **`output_samples/`**: During training, saves a side-by-side image comparison (Input IR, Generated, Target) every 5 epochs. During offline prediction, outputs are saved here.
* **`saved_models/`**: Stores generator training checkpoints (`generator_epoch_{n}.pth`) saved every 5 epochs.
* **`evaluation/`**: Contains the scripts for automated performance evaluations.
* **`eval_results/`**: Holds sequential markdown reports tracking model benchmark stats.

⚠️ **WARNING FOR TEAM COLLABORATION** ⚠️
When pushing to GitHub, **never** push the `.venv/`, `data/`, `saved_models/`, `eval_results/`, or `web/node_modules/` folders. 
* Your environments and nodes won't work on other people's computers.
* Training data and model checkpoints are extremely large and will crash your git push (GitHub has a 100MB file limit). 
*(Don't worry, we've already set up a `.gitignore` file to protect you from accidentally doing this!)*
>>>>>>> 85e741e951eaa75693abe36a0384dbf209e08c74
