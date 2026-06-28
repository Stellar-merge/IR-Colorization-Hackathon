import os
import io
import urllib.request
import numpy as np
import cv2
import rasterio
from dotenv import load_dotenv
import ee

# Load environment variables
load_dotenv()

# Define 18 diverse locations across India to train a highly generalizable model
LOCATIONS = {
    "Delhi_NCR": [77.2090, 28.6139],        # Urban & Agricultural
    "Western_Ghats": [73.8567, 18.5204],    # Heavy Forest / Dense Vegetation
    "Thar_Desert": [70.9126, 26.9157],      # Arid Sand / Desert (Jaisalmer)
    "Sundarbans": [88.8500, 22.0000],       # Mangrove / Wetlands / Delta
    "Deccan_Plateau": [78.4867, 17.3850],   # Scrubland / Urban (Hyderabad)
    "Varanasi_Plains": [83.0080, 25.3176],  # Intensive Crop Agriculture
    "Himalayas": [88.3639, 27.0360],        # Mountainous / Snow / Forest (Darjeeling)
    "Bangalore": [77.5946, 12.9716],        # Built-up / Urban Vegetation
    "Gulf_of_Khambhat": [72.5000, 21.7500], # Coastal Mudflats / Tidal Water
    "Godavari_Delta": [82.2400, 16.9800],   # Estuary / Riverine / Agriculture
    "Rann_of_Kutch": [69.8000, 23.8000],    # Salt Flats / Saline Desert
    "Western_Ghats_South": [76.5369, 10.4507], # Tropical rainforest / Hills
    "Sundarbans_East": [89.2000, 22.1000],   # Estuary / Mangroves
    "Western_Ghats_North": [73.5000, 19.5000], # Mountain forest
    "Gujarat_Salt_Flats": [70.5000, 23.5000],  # Barren flats
    "Punjab_Agriculture": [75.5000, 31.0000],  # Dense farmland
    "Assam_Valley": [92.5000, 26.5000],        # River valley / tea gardens
    "JK_Mountains": [74.8000, 34.1000]         # High alpine terrain / Snow
}

def initialize_gee():
    project_id = os.getenv("EE_PROJECT_ID")
    if not project_id:
        raise ValueError("EE_PROJECT_ID not found in .env file. Please add it.")
    
    print(f"Initializing Google Earth Engine with Project: {project_id}")
    try:
        ee.Initialize(project=project_id)
        print("Earth Engine initialized successfully!")
    except Exception as e:
        print("Initialization failed. Attempting to run authenticate...")
        ee.Authenticate()
        ee.Initialize(project=project_id)

def download_and_slice():
    # Make directories if they don't exist
    os.makedirs(os.path.join("data", "ir"), exist_ok=True)
    os.makedirs(os.path.join("data", "rgb"), exist_ok=True)
    
    patch_size = 256
    stride = 192  # 25% overlap to increase dataset size and help generalization
    img_dimension = 1024  # Reduced to 1024x1024 to stay safely below GEE's 48MB API download limit
    scale = 30  # Landsat 8 resolution (30m per pixel)
    
    patch_count = 0
    
    for loc_name, coords in LOCATIONS.items():
        print(f"\nProcessing region: {loc_name} at {coords}...")
        
        # Define geometry (2048 pixels * 30m resolution = ~61.4km square)
        point = ee.Geometry.Point(coords)
        roi = point.buffer((img_dimension * scale) / 2).bounds()
        
        # Filter Landsat 8 TOA collection for clean, cloud-free imagery in 2023
        collection = (
            ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
            .filterBounds(roi)
            .filterDate('2023-01-01', '2023-12-31')
            .filter(ee.Filter.lt('CLOUD_COVER', 5))
        )
        
        count = collection.size().getInfo()
        if count == 0:
            print(f"No low-cloud images found for {loc_name}. Skipping...")
            continue
            
        print(f"Found {count} clear images. Creating median composite...")
        # Get the median composite
        composite = collection.median().clip(roi)
        
        # Select required bands
        # RGB: B4, B3, B2. IR: B5 (Near Infrared, 30m resolution)
        # Note: B10 is thermal (100m resampled to 30m), but B5 provides superior spatial detail.
        selected_bands = composite.select(['B4', 'B3', 'B2', 'B5'])
        
        # Request download URL for GeoTIFF
        try:
            url = selected_bands.getDownloadURL({
                'scale': scale,
                'crs': 'EPSG:4326',
                'region': roi,
                'format': 'GEO_TIFF'
            })
            
            print(f"Downloading GeoTIFF for {loc_name}...")
            response = urllib.request.urlopen(url)
            tif_bytes = response.read()
            
            from rasterio.io import MemoryFile
            with MemoryFile(tif_bytes) as memfile:
                with memfile.open() as src:
                    # Read bands: B4=1, B3=2, B2=3, B5=4
                    b4 = src.read(1)[:img_dimension, :img_dimension]
                    b3 = src.read(2)[:img_dimension, :img_dimension]
                    b2 = src.read(3)[:img_dimension, :img_dimension]
                    b5 = src.read(4)[:img_dimension, :img_dimension]
                    
                    # Ensure shapes are aligned
                    h = min(b4.shape[0], b3.shape[0], b2.shape[0], b5.shape[0])
                    w = min(b4.shape[1], b3.shape[1], b2.shape[1], b5.shape[1])
                    
                    b4, b3, b2, b5 = b4[:h, :w], b3[:h, :w], b2[:h, :w], b5[:h, :w]
                    
                    if h < patch_size or w < patch_size:
                        print(f"Downloaded image size {h}x{w} is too small. Skipping...")
                        continue
                            
                    # Normalization / Contrast Stretching
                    # Landsat 8 TOA values are 0.0 to 1.0 (reflectance)
                    # We stretch standard reflectance bounds to visible 0-255 uint8 range.
                    # RGB bands typical reflectance is 0.0 - 0.28 (dark surfaces)
                    rgb_min, rgb_max = 0.0, 0.28
                    # Near Infrared (B5) has high vegetation reflectance up to 0.45
                    ir_min, ir_max = 0.0, 0.45
                    
                    b4_norm = np.clip((b4 - rgb_min) / (rgb_max - rgb_min) * 255.0, 0, 255).astype(np.uint8)
                    b3_norm = np.clip((b3 - rgb_min) / (rgb_max - rgb_min) * 255.0, 0, 255).astype(np.uint8)
                    b2_norm = np.clip((b2 - rgb_min) / (rgb_max - rgb_min) * 255.0, 0, 255).astype(np.uint8)
                    b5_norm = np.clip((b5 - ir_min) / (ir_max - ir_min) * 255.0, 0, 255).astype(np.uint8)
                    
                    # Stack RGB channels (Note: OpenCV expects BGR)
                    rgb_stacked = np.stack([b2_norm, b3_norm, b4_norm], axis=-1)
                    
                    # Slice into 256x256 patches
                    for y in range(0, h - patch_size + 1, stride):
                        for x in range(0, w - patch_size + 1, stride):
                            rgb_patch = rgb_stacked[y:y+patch_size, x:x+patch_size]
                            ir_patch = b5_norm[y:y+patch_size, x:x+patch_size]
                            
                            # Validate patch: skip if completely blank (zero variance)
                            if np.std(rgb_patch) < 2.0 or np.std(ir_patch) < 2.0:
                                continue
                            
                            # Save patches
                            ir_filename = f"patch_{patch_count}.png"
                            rgb_filename = f"patch_{patch_count}.png"
                            
                            cv2.imwrite(os.path.join("data", "ir", ir_filename), ir_patch)
                            cv2.imwrite(os.path.join("data", "rgb", rgb_filename), rgb_patch)
                            
                            patch_count += 1
                        
            print(f"Successfully processed {loc_name}. Total patches collected so far: {patch_count}")
            
        except Exception as e:
            print(f"Failed to process {loc_name}: {e}")
            
    print(f"\nFINISHED! Generated {patch_count} training patches in 'data/ir' and 'data/rgb'.")

if __name__ == "__main__":
    initialize_gee()
    download_and_slice()
