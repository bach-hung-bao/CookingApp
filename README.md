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
```
CookingApp/
│
├── ingredient_detector/                # Backend + AI
│   ├── api/                            # FastAPI backend
│   │   ├── __pycache__/                
│   │   ├── weights/                    # YOLO model weights (best.pt) (ignore)
│   │   ├── .env                       
│   │   ├── detect_service.py           # Ingredient detection logic
│   │   ├── history.json                # Search / detection history
│   │   ├── main.py                     # FastAPI entry point
│   │   ├── recipe_service.py           # Rule-based recipe recommendation
│   │   ├── recipe_service_llm.py       # LLM-based recipe generation
│   │   ├── search_service_llm.py       # LLM-based search
│   │   └── requirements.txt           
│   │
│   ├── datasets/                   
│   │                  
│   └── recipes.json                    # Recipe database
│
├── MyApp/                              # Frontend (React Native + Expo)
│   ├── app/                            # App routing (Expo Router)
│   ├── assets/                         # Images, icons
│   ├── components/                     # Reusable UI components
│   ├── constants/                      # Constants, colors, configs
│   ├── hooks/                          # Custom React hooks            
│   ├── scripts/                        # Helper scripts
│   ├── utils/                          # Utility functions
│   ├── api.js                          # Frontend API calls
│   ├── app.json                        # Expo app config
│   ├── config.js                       # API base URL config
│   ├── eslint.config.js
│   ├── expo-env.d.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md                       # Frontend README
│   └── tsconfig.json
│
├── yolo_env/                           # Python virtual environment (ignore)
│
├── yolov5/                             # YOLOv5 source code
│
└── .gitignore                          # Git ignore rules
```
Do dung lượng lớn và bảo mật:
- ❌ **KHÔNG có** `best.pt` trong repo
- ❌ **KHÔNG có** dataset
- ❌ **KHÔNG có** `.env`, `yolo_env`, `node_modules`

👉 Người dùng cần **tải thủ công** các thành phần này theo hướng dẫn bên dưới.
```
.env: lấy GROQ_API_KEY: https://console.groq.com/keys
```
## 🤖 AI Model & Dataset
📥 Tải tại Google Drive:  
👉 https://drive.google.com/drive/folders/1LsUa_glu7nuI68yD61NAiBv8XvyBAlYY?usp=sharing

###  Thiết Lập Backend (Python API)

####  Tạo và Kích Hoạt Virtual Environment
```bash
# Tạo virtual environment
python -m venv yolo_env

# Kích hoạt (Windows PowerShell)
yolo_env\Scripts\Activate.ps1

# Kích hoạt (Windows CMD)
yolo_env\Scripts\activate.bat

# Kích hoạt (macOS/Linux)
source yolo_env/bin/activate
```
```
# Cài YOLOv5 framework
pip install -r yolov5/requirements.txt

# Cài Backend API dependencies
pip install -r ingredient_detector/api/requirements.txt
