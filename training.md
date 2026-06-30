# 🏋️‍♂️ Model Training, Data Ingestion, & Evaluation Guide

This guide is for developers who want to download training datasets from Google Earth Engine, train the **SRCNN (Detail Enhancer)** and **Pix2Pix GAN (Colorizer)** models from scratch, and benchmark model checkpoints.

If you just want to run the pre-trained web app or perform single-image prediction, please refer to the main [readme.md](file:///d:/Coding_local/IR_colorizing_model/IR-Colorization-Hackathon/readme.md).

---

## 🛰️ Step 1: Set up Google Earth Engine & Ingest Data

We provide an automated script to download training data (matched Infrared and RGB imagery pairs) directly from Google Earth Engine.

1. **Set up project environment variables**:
   Create a file named `.env` in the root of the project and add your Google Cloud Project ID:
   ```env
   EE_PROJECT_ID=your-google-cloud-project-id
   ```
   *(Refer to `.env.example` in the root directory for reference).*

2. **Authenticate with Earth Engine**:
   Ensure you have access to Google Earth Engine and run:
   ```bash
   uv run python src/data/download_gee.py
   ```
   *This script downloads matched IR-RGB tiles and places them inside the `data/ir/` and `data/rgb/` training directories.*

---

## 🧠 Step 2: Train the Models

Once your datasets are downloaded, you can start the model training pipeline.

Run the main training script:
```bash
uv run python src/train.py
```
* **SRCNN Training**: Focuses on enhancing image sharpness and structural details.
* **Pix2Pix GAN Training**: Composed of a **Generator (U-Net)** to paint natural colors onto the enhanced IR imagery, and a **Discriminator (PatchGAN)** to classify inputs as real/fake to improve generation realism.

### Windows OMP/OpenBLAS Threading Note:
On some Windows systems, PyTorch might crash due to OpenBLAS memory allocation. The training script limits OpenBLAS threads to `1` by default to prevent crashes. If you want to disable this thread limit and utilize full multi-core performance (if your CPU configuration supports it), run:
```bash
uv run python src/train.py --limit_threads=false
```

---

## 📊 Step 3: Evaluate Checkpoints & Benchmark Performance

To identify the best performing model checkpoint from your training runs, you can benchmark all saved models against Peak Signal-to-Noise Ratio (**PSNR**) and Structural Similarity Index (**SSIM**) metrics.

Run the automated evaluation script:
```bash
uv run python evaluation/evaluate.py
```

### Benchmarking Workflow:
* **Auto-scan Checkpoints**: The runner scans your `saved_models/` folder and orders all checkpoints sequentially by training epoch.
* **Metric Computation**: It computes structural coherence (SSIM) and color-matching accuracy (PSNR) compared to ground-truth RGB evaluation imagery.
* **Auto-generated Reports**: The script dynamically outputs a benchmark table to the console and generates a sequential markdown report at `eval_results/eval_results_{n}.md` (e.g., `eval_results_0.md`, `eval_results_1.md`) so you can track improvements across training runs.
* **Best Model Selection**: Use the summary at the bottom of the generated report to choose the best weights (such as `generator_epoch_60.pth`) for deployment. Copy these to `saved_models/` to be picked up by the API server.
