# 🌍 IR-Colorization-Hackathon

Welcome to the **IR Image Enhancement & Colorization** project! This repository contains a deep learning pipeline built to transform monochrome, low-contrast Infrared (IR) satellite images into high-resolution, naturally colored RGB images. 

This helps human analysts visualize satellite data much faster and can improve downstream machine learning tasks!

---

## 🧠 How It Works (For Beginners)

Our AI pipeline is broken down into two main parts:

### 1. The Image Sharpener (SRCNN Module)
Before we add color, we first need to make sure the image is sharp. We use a **Super-Resolution Convolutional Neural Network (SRCNN)**. It looks at the blurry/low-contrast raw Infrared image and enhances its structural details. We chose SRCNN because it's fast, lightweight, and perfect for a hackathon timeframe!

### 2. The Colorizer (Pix2Pix GAN)
Once the image is sharp, we use a **Generative Adversarial Network (GAN)** to paint it. A GAN is basically two AI networks competing against each other:
* **The Generator (The Artist - U-Net)**: It looks at the enhanced IR image and tries to "paint" realistic colors onto it. U-Net is great because it remembers the structural edges from the input.
* **The Discriminator (The Art Critic - PatchGAN)**: It looks at the painted image and tries to guess if it's a "real" satellite image or a "fake" generated one. 
By competing, the Generator gets incredibly good at producing highly realistic colors.

---

## 🚀 Getting Started

We use `uv` to manage our Python environment, making setup incredibly fast and perfectly reproducible across Windows, Mac, and Linux.

### Step 1: Clone the Repository
First, clone this repository to your local machine and navigate into it:
```bash
git clone https://github.com/your-username/IR-Colorization-Hackathon.git
cd IR-Colorization-Hackathon
```

### Step 2: Install Dependencies
Open your terminal in the project root folder and run:
```bash
uv sync
```
*This will automatically create an isolated virtual environment (`.venv`) and install PyTorch (with CUDA support!) and all other backend dependencies.*

### Step 3: Run the Web UI & Model API Server
The project includes an interactive web dashboard built with Next.js that communicates with a FastAPI deep learning inference backend.

#### 1. Start the Python Inference API Server
Open a terminal in the root of the project and run:
```bash
uv run python src/serve.py
```
*This starts the FastAPI server at `http://127.0.0.1:8000`. It loads the PyTorch model weights once into memory (utilizing GPU/CUDA acceleration if available) for instant, sub-second colorization and detail enhancement.*

#### 2. Start the Next.js Web Frontend
Open a separate terminal window, navigate to the `web` folder, and run:
```bash
cd web
npm run dev
```
*This starts the Next.js development server at `http://localhost:3000`. Open this URL in your web browser to access the imagery reconstruction portal.*

### Step 4: Offline Single-Image Prediction (CLI)
You can run colorization and detail enhancement on any raw IR image directly from your terminal using the offline prediction script:

```bash
uv run python src/predict.py --image path/to/your/image.png
```
* **Weights Resolution**: The script automatically scans your `saved_models/` directory, selects the latest checkpoint, and saves both the structural-enhanced IR and colorized RGB outputs directly into `output_samples/`.
* **Detail Fallback**: If no SRCNN weights are provided, it automatically applies advanced CLAHE & Unsharp Masking filters to enhance structural details.

---

## 💻 Monitoring Connection Status (Live vs. Demo)

To ensure that your frontend is successfully communicating with your PyTorch backend, look at the **Reconstruction Console** header after processing an image:
* **🟢 Live Backend**: Indicates a successful connection to the FastAPI server running on port 8000. It uses actual PyTorch model inference (or classical fallback if weights are missing).
* **🟡 Demo Fallback**: Indicates the frontend could not reach the FastAPI server and has automatically fallen back to the offline mock simulation to prevent the application from hanging.

---

## 🏋️‍♂️ Model Training & Dataset Creation
If you want to ingest new training datasets from Google Earth Engine, train the models, and benchmark evaluation checkpoints, please see our separate [Model Training & Evaluation Guide](file:///d:/Coding_local/IR_colorizing_model/IR-Colorization-Hackathon/training.md).

---

## 🛠️ Troubleshooting Port Conflicts (Error `10048`)

If you see an error like:
> `[Errno 10048] error while attempting to bind on address ('127.0.0.1', 8000): only one usage of each socket address is normally permitted`

This means another Python process (or previous server run) is already listening on port 8000. Follow these steps to free up the port:

### On Windows (PowerShell)
1. Find the Process ID (PID) occupying port 8000:
   ```powershell
   Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess
   ```
2. Kill the process (replace `PID` with the ID found in step 1):
   ```powershell
   Stop-Process -Id PID -Force
   ```
   *Alternatively, force kill all python processes occupying port 8000 in one go:*
   ```powershell
   Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
   ```

### On macOS / Linux
1. Find the PID:
   ```bash
   lsof -i :8000
   ```
2. Kill the process:
   ```bash
   kill -9 PID
   ```

---

## 📁 File Structure & Organization

* **`src/predict.py`**: Command-line tool for offline image prediction.
* **`src/serve.py`**: FastAPI server hosting the deep learning API endpoints.
* **`web/`**: Next.js interactive web frontend dashboard.
* **`web/.env.local`**: Configures the API URL connecting the frontend to the backend.
* **`output_samples/`**: During training, saves a side-by-side image comparison (Input IR, Generated, Target) every 5 epochs. During offline prediction, outputs are saved here.
* **`saved_models/`**: Stores generator training checkpoints (`generator_epoch_{n}.pth`) saved every 5 epochs.
* **`evaluation/`**: Contains the scripts for automated performance evaluations.
* **`eval_results/`**: Holds sequential markdown reports tracking model benchmark stats.

⚠️ **WARNING FOR TEAM COLLABORATION** ⚠️
When pushing to GitHub, **never** push the `.venv/`, `data/`, `saved_models/`, `eval_results/`, or `web/node_modules/` folders. 
*(These are already configured in our `.gitignore` to prevent accidental commits.)*
