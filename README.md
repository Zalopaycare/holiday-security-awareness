# An toàn thông tin mùa lễ hội · Security Awareness 2026

Trang web một trang (static site) dành cho Starter, phong cách pixel game. Không cần build, không phụ thuộc framework. Chạy được ngay trên GitHub Pages.

## Cấu trúc

```
index.html            Trang chính (toàn bộ nội dung)
css/style.css         Giao diện
js/main.js            Thanh tiến độ, điều hướng, checklist, chọn wifi, sao chép email
assets/img/           Hình pixel (mascot, nền, logo)
assets/fonts/         Aeonik Pro (Regular, Medium, Bold)
content/              Bản nội dung gốc (markdown) để sửa chữ
.nojekyll             Tắt Jekyll trên GitHub Pages
```

## Đưa lên GitHub Pages

1. Tạo repository mới trên GitHub (ví dụ `holiday-security-awareness`).
2. Đẩy toàn bộ thư mục này lên nhánh `main`:
   ```bash
   git init
   git add .
   git commit -m "Holiday security awareness site"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
3. Vào **Settings → Pages**, mục **Build and deployment** chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, bấm **Save**.
4. Sau khoảng một phút, trang sẽ có tại `https://<user>.github.io/<repo>/`.

## Chạy thử trên máy

Mở `index.html` trực tiếp bằng trình duyệt, hoặc chạy một server tĩnh:

```bash
python3 -m http.server 8000
```

rồi mở `http://localhost:8000`.

## Sửa nội dung

Toàn bộ chữ nằm trong `index.html`, theo đúng thứ tự của `content/noi-dung-v7.md`. Quy ước viết: gọi người đọc là Starter, không dùng cụm "không chỉ… mà còn", không dùng dấu gạch ngang trong câu.

## Ghi chú kỹ thuật

- Font pixel "Press Start 2P" tải từ Google Fonts; nếu không có mạng, trang tự dùng font monospace thay thế.
- Checklist và bảy quy tắc lưu trạng thái trong trình duyệt của người đọc (localStorage), không gửi đi đâu.
- Trang tương thích điện thoại, hỗ trợ `prefers-reduced-motion`.
