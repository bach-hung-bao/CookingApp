import torch
from PIL import Image
import cv2
import matplotlib.pyplot as plt

# Tải mô hình YOLOv5
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')  # Chọn mô hình nhỏ

# Đường dẫn đến hình ảnh
image_path = 'data/images/your_image.jpg'  # Thay đổi đường dẫn nếu cần

# Đọc hình ảnh
img = Image.open(image_path)

# Phát hiện đối tượng
results = model(img)

# Hiển thị kết quả
results.show()  # Hiển thị hình ảnh với khung bao quanh các đối tượng phát hiện

# Lưu kết quả vào tệp
results.save('output/')  # Lưu kết quả vào thư mục 'output'