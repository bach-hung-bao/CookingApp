from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def search_recipe_by_text(query: str):

    prompt = f"""
    Hãy tìm 5 món ăn phù hợp với từ khóa: "{query}"

    Trả về đúng JSON hợp lệ dạng:

    [
      {{
        "title": "Tên món ăn",
        "ingredients": ["Danh sách nguyên liệu"],
        "steps": ["Bước 1", "Bước 2"],
        "time": "30 phút"
      }}
    ]

    Không giải thích thêm.
    Không thêm ```json```.
    Chỉ trả về JSON hợp lệ 100%.
    """

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        text = response.choices[0].message.content.strip()

        try:
            return json.loads(text)
        except:
            return [{"raw_output": text}]

    except Exception as e:
        return [{"error": str(e)}]
