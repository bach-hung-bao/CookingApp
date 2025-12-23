from fastapi import FastAPI, UploadFile, File, Form
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json
import os
from pathlib import Path
from datetime import datetime
import threading

load_dotenv()

from search_service_llm import search_recipe_by_text
from detect_service import detect_ingredients_from_images
from recipe_service import recommend_recipe
from recipe_service_llm import generate_recipes  

app = FastAPI(
    title="Food Recommendation API",
    description="Nhận diện nguyên liệu và gợi ý món ăn",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

#  HISTORY SYSTEM
_API_DIR = Path(__file__).parent
HISTORY_FILE = _API_DIR / "history.json"
_HISTORY_LOCK = threading.Lock()

def load_history():
    """Đọc file lịch sử an toàn, trả về list."""
    if not HISTORY_FILE.exists():
        return []
    try:
        with HISTORY_FILE.open("r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception:
       
        return []

def save_history(data):
    """Ghi file lịch sử an toàn, có khóa tránh ghi đè cạnh tranh."""
    with _HISTORY_LOCK:
        try:
            with HISTORY_FILE.open("w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception:
            
            pass

@app.post("/history/add")
async def add_history(recipe_name: str = Form(...), hist_type: str = Form(...)):
    """Thêm lịch sử.
    hist_type: "search" hoặc "image"
    """
    name = (recipe_name or "").strip()
    htype = (hist_type or "").strip()
    if not name:
        return {"message": "ignored", "reason": "empty recipe_name"}
    if htype not in {"search", "image"}:
        htype = "search"

    history = load_history()


    if history and history[0].get("recipe_name") == name and history[0].get("type") == htype:
        return {"message": "skipped-duplicate"}

    item = {
        "recipe_name": name,
        "type": htype,
        "timestamp": datetime.now().isoformat(timespec="seconds")
    }

    history.insert(0, item)
    
    if len(history) > 20:
        history = history[:20]
    save_history(history)

    return {"message": "added", "item": item}

@app.get("/history/latest")
async def get_latest_history():
    """Trả về 5 lịch sử gần đây nhất ."""
    return load_history()[:5]

@app.get("/history")
async def get_all_history():
    """Trả về toàn bộ lịch sử."""
    return load_history()



# YOLOv5 Predict
@app.post("/predict")
async def predict(files: List[UploadFile] = File(...)):
    images_bytes = [await file.read() for file in files]
    details, ingredients = detect_ingredients_from_images(images_bytes)

    return {
        "detected_details": details,
        "detected_ingredients": ingredients
    }

# Recommend from JSON gợi ý món
@app.post("/recommend")
async def recommend(files: List[UploadFile] = File(...)):
    images_bytes = [await file.read() for file in files]
    details, ingredients = detect_ingredients_from_images(images_bytes)
    recipes = recommend_recipe(ingredients)

    return {
        "detected_details": details,
        "detected_ingredients": ingredients,
        "recommended_recipes": recipes
    }


# Recommend LLM (GROQ)
@app.post("/recommend_llm")
async def recommend_llm(files: List[UploadFile] = File(...)):
    images_bytes = [await file.read() for file in files]
    details, ingredients = detect_ingredients_from_images(images_bytes)
    
    recipes = generate_recipes(ingredients)

    return {
        "detected_details": details,
        "detected_ingredients": ingredients,
        "recommended_recipes": recipes
    }

# SEARCH LLM
@app.post("/search")
async def search_recipe(query: str = Form(...)):
    results = search_recipe_by_text(query)

    return {
        "success": True,
        "query": query,
        "recipes": results
    }
