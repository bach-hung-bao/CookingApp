from groq import Groq
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_recipes(ingredients: list):

    ing_text = ", ".join(ingredients)

    prompt = f"""
    Với các nguyên liệu: {ing_text}

    Hãy đề xuất 7 món ăn phù hợp.

    Trả về JSON dạng:

    [
      {{
        "title": "Tên món ăn",
        "ingredients": ["Nguyên liệu"],
        "steps": ["Bước 1", "Bước 2"],
        "time": "30 phút"
      }}
    ]

    Không giải thích.
    Không thêm ```json```.
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
