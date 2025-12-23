import torch
from pathlib import Path
from PIL import Image
from io import BytesIO
import pathlib


pathlib.PosixPath = pathlib.WindowsPath

YOLOV5_PATH = Path("C:/Users/Admin/Music/bao/yolov5")
MODEL_PATH = Path("C:/Users/Admin/Music/bao/ingredient_detector/api/weights/best.pt")

print(" Loading YOLOv5 model từ:", MODEL_PATH)

# Load YOLOv5 model custom
model = torch.hub.load(
    str(YOLOV5_PATH),
    "custom",
    path=str(MODEL_PATH),
    source="local",
    force_reload=False
)

CLASS_NAMES = model.names


def detect_ingredients_from_images(images: list):
    detected_details = []
    all_names = []

    for idx, img in enumerate(images):

        # mở ảnh (bytes hoặc path)
        if isinstance(img, (bytes, bytearray)):
            image = Image.open(BytesIO(img)).convert("RGB")
            image_key = f"upload_{idx + 1}.jpg"
        else:
            image = Image.open(img).convert("RGB")
            image_key = str(img)

        # chạy YOLOv5
        results = model(image, size=640)
        df = results.pandas().xyxy[0]

        items = []
        for _, row in df.iterrows():
            name = row["name"]
            conf = float(row["confidence"])

            items.append({
                "name": name,
                "confidence": round(conf, 3)
            })

            all_names.append(name)

        detected_details.append({
            "image": image_key,
            "ingredients": items
        })

    # unique list
    unique_ingredients = list(dict.fromkeys(all_names))

    return detected_details, unique_ingredients
