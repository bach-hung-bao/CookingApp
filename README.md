# 🍳 CookingApp – Food Ingredient Detection & Recipe Recommendation

CookingApp là một hệ thống **Full-stack AI Application** gồm:
- 📱 **Frontend**: React Native (Expo)
- ⚙️ **Backend**: FastAPI (Python)


Hệ thống cho phép:
- Nhận diện nguyên liệu từ ảnh
- Gợi ý món ăn phù hợp
- Tìm kiếm công thức bằng AI
- Lưu lịch sử và chi tiết món ăn

---

## 🧱 Kiến trúc tổng thể

CookingApp/
│
├
│
├── ingredient_detector/ # Backend (FastAPI)
│ ├── api/
│ │ ├── main.py
│ │ ├── detect_service.py
│ │ ├── recipe_service.py
│ │ ├── recipe_service_llm.py
│ │ ├── search_service_llm.py
│ │ └── requirements.txt
│ │
│ └── recipes.json
│
├── MyApp/ # Frontend (Expo - React Native)
│
├── yolov5/ 
├── yolo_env(.\yolo_env\Scripts\activate)
└── .gitignore
Do dung lượng lớn và bảo mật:
- ❌ **KHÔNG có** `best.pt` trong repo
- ❌ **KHÔNG có** dataset
- ❌ **KHÔNG có** `.env`, `yolo_env`, `node_modules`

👉 Người dùng cần **tải thủ công** các thành phần này theo hướng dẫn bên dưới.

## 🤖 AI Model & Dataset
📥 Tải tại Google Drive:  
👉 https://drive.google.com/drive/folders/1LsUa_glu7nuI68yD61NAiBv8XvyBAlYY?usp=sharing

