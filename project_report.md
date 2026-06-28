# InfraVision AI - Project Report & Walkthrough

This document summarizes everything we have accomplished so far in building the InfraVision AI project, from the interactive website to the automated testing script for our AI model.

## 1. Web Dashboard (Frontend UI)

We designed and built a professional, futuristic website inspired by NASA Mission Control and ISRO dashboards.

### Technologies Used
- **Website Framework**: Next.js 15
- **Design & Styling**: Tailwind CSS
- **State Management**: Zustand (to keep track of user actions)
- **Animations**: Framer Motion (for smooth visual effects)

### Key Features
- **Hero Section**: A dynamic welcome page that invites users to start colorizing images.
- **Upload Panel**: A simple drag-and-drop box where users can upload their black-and-white infrared satellite photos.
- **Pipeline Animation**: A neat visual animation showing the steps our AI takes to add color to the image.
- **Interactive Image Comparison**: A slider tool that lets users drag horizontally to instantly compare the original infrared image with the AI's final colorized image.
- **Metrics Dashboard**: Easy-to-read charts that display how fast the AI is running and how accurate its colors are.

---

## 2. Model Evaluation Pipeline

We successfully built a robust testing script (`evaluate.py`) to systematically test our trained AI model against a dataset of satellite images.

### How It Works
- **Input**: The script loads our pre-trained AI brain (model weights) and a folder of test images.
- **Processing**: It automatically feeds the black-and-white images into the AI to see what colors it guesses, utilizing the graphics card (GPU) for speed.
- **Scoring**: It compares the AI's guessed colors against the real colors using several mathematical tests:
  - **PSNR**: Checks the overall quality. Higher is better.
  - **SSIM**: Checks if the shapes (like buildings or roads) look correct. Closer to 1 is better.
  - **LPIPS & FID**: Advanced tests that judge if the final image actually *looks* real to the human eye. Lower is better.

### Output Files
The script automatically generates a full report in the `outputs/` folder:
- **Data Spreadsheets**: Raw logs containing the scores for every single image.
- **Graphs**: Visual charts showing how the AI performed across all images.
- **Visual Comparisons**: Images placed side-by-side so you can easily see the Original, the AI's Guess, the Real Image, and a Heatmap showing where the AI made mistakes.
- **Best and Worst**: Special collages showing the top 10 best and top 10 worst images, so we can study where the AI struggles.

### Final Results
We ran a test on a 50-image subset and got the following performance:

| Metric | Score | Description |
|---|---|---|
| **Images Tested** | 50 | Total number of images processed |
| **Average PSNR** | 28.83 dB | Overall image quality (Higher is better) |
| **Average SSIM** | 0.5825 | Structural accuracy (Closer to 1 is better) |
| **Average LPIPS** | 0.3135 | Perceptual realism (Lower is better) |
| **Average FID** | 132.92 | Realism compared to real photos (Lower is better) |
| **Processing Speed** | 14.37 ms | Time it takes to colorize one image (almost 70 Frames Per Second!) |

> [!TIP]
> Because the model can process nearly **70 frames per second**, it is fast enough to colorize a live satellite video stream in real time!

## Next Steps
Everything is complete and ready for the hackathon presentation! All the code, documentation, UI, and test results are finalized in simple, readable English. The only optional future step is to connect the Python AI code to the live website so anyone on the internet can test it out.
