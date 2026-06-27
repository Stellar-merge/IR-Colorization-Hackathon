"""
download_gee.py

Downloads paired Infrared (Band 10 TIRS) and RGB (Bands 4,3,2) imagery
from Landsat 8/9 via Google Earth Engine and saves them as PNG tiles.

Usage:
    uv run python src/data/download_gee.py

Requires:
    - .env file in the project root with EE_PROJECT_ID set
    - Google Earth Engine authenticated (run `earthengine authenticate` if first time)
"""

import os
import sys
import time
import urllib.request
from pathlib import Path
from dotenv import load_dotenv

# ── Load env ──────────────────────────────────────────────────────────────────
# Find .env in project root (two levels up from this file: src/data -> src -> root)
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT_DIR / ".env")

EE_PROJECT_ID = os.getenv("EE_PROJECT_ID")
if not EE_PROJECT_ID:
    print("ERROR: EE_PROJECT_ID not found in .env file.", flush=True)
    sys.exit(1)

print(f"Using Google Cloud Project: {EE_PROJECT_ID}", flush=True)

# ── Initialise Earth Engine ───────────────────────────────────────────────────
try:
    import ee
    print("Initialising Earth Engine...", flush=True)
    ee.Initialize(project=EE_PROJECT_ID)
    print("[OK] Earth Engine initialised successfully.", flush=True)
except Exception as e:
    print(f"[ERROR] Earth Engine initialisation failed: {e}", flush=True)
    print("\nIf this is your first time, run:  earthengine authenticate", flush=True)
    sys.exit(1)

# ── Configuration ─────────────────────────────────────────────────────────────
# Output directories
DATA_DIR   = ROOT_DIR / "data"
IR_DIR     = DATA_DIR / "ir"
RGB_DIR    = DATA_DIR / "rgb"
IR_DIR.mkdir(parents=True, exist_ok=True)
RGB_DIR.mkdir(parents=True, exist_ok=True)

# Sampling parameters
NUM_TILES       = 200        # Number of image tiles to download
TILE_SIZE_DEG   = 0.1        # ~11 km per side
IMG_PIXEL_SIZE  = 256        # Output image resolution in pixels
MAX_CLOUD_PCT   = 20         # Cloud cover filter threshold

# ── AOI: India bounding box ───────────────────────────────────────────────────
AOI = ee.Geometry.Rectangle([68.0, 8.0, 97.5, 37.5])

# ── Build Landsat 8/9 collection ─────────────────────────────────────────────
print("Building Landsat collection...", flush=True)
collection = (
    ee.ImageCollection("LANDSAT/LC09/C02/T1_TOA")
    .merge(ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA"))
    .filterBounds(AOI)
    .filterDate("2022-01-01", "2024-12-31")
    .filter(ee.Filter.lt("CLOUD_COVER", MAX_CLOUD_PCT))
    .sort("CLOUD_COVER")
    .limit(500)
)

print("Querying collection size (this may take ~30s)...", flush=True)
count = collection.size().getInfo()
print(f"Found {count} scenes after cloud filter.", flush=True)

if count == 0:
    print("No scenes found. Try relaxing cloud cover or date filters.", flush=True)
    sys.exit(1)

# ── Helper: download a single URL to disk ─────────────────────────────────────
def download_tile(url: str, out_path: Path, label: str) -> bool:
    try:
        urllib.request.urlretrieve(url, out_path)
        return True
    except Exception as e:
        print(f"    [WARN] Failed to download {label}: {e}", flush=True)
        if out_path.exists():
            out_path.unlink()
        return False

# ── Main download loop ────────────────────────────────────────────────────────
print(f"\nStarting download of {NUM_TILES} tiles ...", flush=True)
downloaded = 0
images     = collection.toList(collection.size())

import random
indices = list(range(count))
random.shuffle(indices)

for idx in indices:
    if downloaded >= NUM_TILES:
        break

    try:
        img = ee.Image(images.get(idx))
        centroid = img.geometry().centroid(maxError=1)
        lon, lat = centroid.coordinates().getInfo()

        # Define a small tile around the centroid
        tile_geom = ee.Geometry.Rectangle([
            lon - TILE_SIZE_DEG / 2,
            lat - TILE_SIZE_DEG / 2,
            lon + TILE_SIZE_DEG / 2,
            lat + TILE_SIZE_DEG / 2,
        ])

        tile_id = f"tile_{downloaded:04d}"

        # ── IR: Band B10 (Thermal Infrared) ──────────────────────────────────
        ir_img = img.select("B10")
        ir_url = ir_img.getThumbURL({
            "region": tile_geom,
            "dimensions": IMG_PIXEL_SIZE,
            "format": "png",
            "min": 280,
            "max": 320,
        })

        # ── RGB: Bands B4 (Red), B3 (Green), B2 (Blue) ───────────────────────
        rgb_img = img.select(["B4", "B3", "B2"])
        rgb_url = rgb_img.getThumbURL({
            "region": tile_geom,
            "dimensions": IMG_PIXEL_SIZE,
            "format": "png",
            "min": 0,
            "max": 0.3,
            "gamma": 1.4,
        })

        ir_path  = IR_DIR  / f"{tile_id}.png"
        rgb_path = RGB_DIR / f"{tile_id}.png"

        ok_ir  = download_tile(ir_url,  ir_path,  f"{tile_id} IR")
        ok_rgb = download_tile(rgb_url, rgb_path, f"{tile_id} RGB")

        if ok_ir and ok_rgb:
            downloaded += 1
            print(f"  [{downloaded}/{NUM_TILES}] OK {tile_id}  (lon={lon:.2f}, lat={lat:.2f})", flush=True)
        else:
            # Clean up partial downloads
            for p in [ir_path, rgb_path]:
                if p.exists():
                    p.unlink()

    except Exception as e:
        print(f"  ⚠️  Skipping scene {idx}: {e}")

    # Small delay to avoid hitting GEE rate limits
    time.sleep(0.3)

print(f"\nDone! Downloaded {downloaded} paired tiles.")
print(f"   IR  images -> {IR_DIR}")
print(f"   RGB images -> {RGB_DIR}")

if downloaded < NUM_TILES:
    print(f"\n[WARN] Only {downloaded}/{NUM_TILES} tiles downloaded. "
          "Try increasing the date range or cloud cover threshold.")
