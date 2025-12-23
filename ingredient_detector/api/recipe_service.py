import json
from pathlib import Path
from typing import List, Dict


RECIPES_PATH = Path(__file__).parent.parent / "recipes.json"
with open(RECIPES_PATH, "r", encoding="utf-8") as f:
    RECIPES = json.load(f)

def recommend_recipe(ingredients: List[str]) -> List[Dict]:
    """
    Gợi ý 2–3 món ăn phù hợp nhất với các nguyên liệu nhận diện được.
    Cho điểm dựa trên % nguyên liệu trùng khớp.
    """
    if not ingredients:
        return [{"message": "Không phát hiện được nguyên liệu nào trong ảnh."}]

    matched_recipes = []
    for recipe in RECIPES:
        recipe_ings = [ing.lower() for ing in recipe["ingredients"]]
        detected = [i.lower() for i in ingredients]

        matched = set(recipe_ings) & set(detected)
        score = len(matched) / len(recipe_ings) if recipe_ings else 0

        # Nếu có ít nhất 1 nguyên liệu trùng
        if score > 0:
            matched_recipes.append({
                "name": recipe["name"],
                "match_score": round(score, 2),
                "ingredients": recipe["ingredients"],
                "steps": recipe.get("steps", "")
            })

  
    if not matched_recipes:
        return [{"message": "Chưa có món phù hợp tuyệt đối, thử thêm nguyên liệu khác nhé!"}]


    matched_recipes = sorted(matched_recipes, key=lambda x: x["match_score"], reverse=True)[:3]

    return matched_recipes
