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
Open your terminal in the project folder and run:
```bash
uv sync
```
*This will automatically create an isolated virtual environment (`.venv`) and install PyTorch (with CUDA support!) and all other dependencies.*

### Step 3: Set up your Google Earth Engine Credentials
We provide an automated script to download training data directly from Google Earth Engine.
1. Create a file named `.env` in the root of the project.
2. Add your Google Cloud Project ID to it like this:
   ```env
   EE_PROJECT_ID=your-google-cloud-project-id
   ```
   *(You can look at `.env.example` if you forget!)*
3. Run the download script to fetch the imagery:
   ```bash
   uv run python src/data/download_gee.py
   ```

### Step 4: Train the Model
Once your data is downloaded into the `data/ir/` and `data/rgb/` folders, you can start training the AI!

```bash
uv run python src/train.py
```

**Note on Windows/OpenBLAS Threading:**
Sometimes PyTorch on Windows crashes due to OpenBLAS memory allocation. We have built-in a flag that limits the threads to `1` to prevent this. It is enabled by default. If you want to disable the thread limit to speed things up (if your system handles it), you can run:
```bash
uv run python src/train.py --limit_threads=false
```

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

## 📁 Where do my files go?

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
