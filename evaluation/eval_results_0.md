# Model Evaluation Results

Automated evaluation results across saved checkpoints using Peak Signal-to-Noise Ratio (**PSNR**) and Structural Similarity Index (**SSIM**).

## 📊 Checkpoint Performance Table

| Checkpoint | Epoch | Average PSNR (dB) | Average SSIM |
| :--- | :--- | :--- | :--- |
| `generator_epoch_0.pth` | 0 | 10.35 dB | 0.0744 |
| `generator_epoch_5.pth` | 5 | 13.61 dB | 0.3162 |
| `generator_epoch_10.pth` | 10 | 15.25 dB | 0.4214 |
| `generator_epoch_15.pth` | 15 | 15.92 dB | 0.4625 |
| `generator_epoch_20.pth` | 20 | 16.67 dB | 0.4975 |
| `generator_epoch_25.pth` | 25 | 17.00 dB | 0.5235 |
| `generator_epoch_30.pth` | 30 | 17.38 dB | 0.5483 |
| `generator_epoch_35.pth` | 35 | 17.40 dB | 0.5524 |
| `generator_epoch_40.pth` | 40 | 18.36 dB | 0.5910 |
| `generator_epoch_45.pth` | 45 | 17.87 dB | 0.5915 |
| `generator_epoch_50.pth` | 50 | 18.85 dB | 0.6249 |
| `generator_epoch_55.pth` | 55 | 18.67 dB | 0.6302 |
| `generator_epoch_60.pth` | 60 | 19.12 dB | 0.6471 |
| `generator_epoch_65.pth` | 65 | 19.57 dB | 0.6697 |
| `generator_epoch_70.pth` | 70 | 19.64 dB | 0.6725 |
| `generator_epoch_75.pth` | 75 | 19.60 dB | 0.6745 |
| `generator_epoch_80.pth` | 80 | 19.84 dB | 0.6882 |
| `generator_epoch_85.pth` | 85 | 20.64 dB | 0.7232 |
| `generator_epoch_90.pth` | 90 | 20.53 dB | 0.7133 |
| **`generator_epoch_95.pth`** | **95** | **20.89 dB** 🏆 | **0.7359** 🏆 |

---

## 🏆 The Best Model
The best checkpoint is **`generator_epoch_95.pth`** (epoch 95). It achieved:
* **Average PSNR**: `20.89 dB`
* **Average SSIM**: `0.7359`
