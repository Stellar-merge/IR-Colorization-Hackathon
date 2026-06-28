import os
import random
import shutil

def split_dataset(train_ratio=0.85):
    base_dir = "data"
    ir_source = os.path.join(base_dir, "ir")
    rgb_source = os.path.join(base_dir, "rgb")
    
    if not os.path.exists(ir_source) or not os.path.exists(rgb_source):
        print("Data directories do not exist. Please run download_gee.py first.")
        return
        
    filenames = [f for f in os.listdir(ir_source) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if len(filenames) == 0:
        print("No patches found in data/ir. Run download_gee.py first.")
        return
        
    print(f"Found {len(filenames)} total patches. Splitting dataset...")
    
    # Shuffle randomly
    random.seed(42)
    random.shuffle(filenames)
    
    # Calculate split index
    split_idx = int(len(filenames) * train_ratio)
    train_files = filenames[:split_idx]
    val_files = filenames[split_idx:]
    
    # Target directories
    train_ir = os.path.join(base_dir, "train", "ir")
    train_rgb = os.path.join(base_dir, "train", "rgb")
    val_ir = os.path.join(base_dir, "val", "ir")
    val_rgb = os.path.join(base_dir, "val", "rgb")
    
    # Create target directories
    os.makedirs(train_ir, exist_ok=True)
    os.makedirs(train_rgb, exist_ok=True)
    os.makedirs(val_ir, exist_ok=True)
    os.makedirs(val_rgb, exist_ok=True)
    
    # Move files
    print(f"Moving {len(train_files)} files to train split...")
    for f in train_files:
        shutil.move(os.path.join(ir_source, f), os.path.join(train_ir, f))
        shutil.move(os.path.join(rgb_source, f), os.path.join(train_rgb, f))
        
    print(f"Moving {len(val_files)} files to val split...")
    for f in val_files:
        shutil.move(os.path.join(ir_source, f), os.path.join(val_ir, f))
        shutil.move(os.path.join(rgb_source, f), os.path.join(val_rgb, f))
        
    # Clean up empty original directories
    try:
        os.rmdir(ir_source)
        os.rmdir(rgb_source)
    except Exception:
        pass
        
    print(f"Dataset split completed! \n - Train: {len(train_files)} patches \n - Validation: {len(val_files)} patches")

if __name__ == "__main__":
    split_dataset()
