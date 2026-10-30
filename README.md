# 🎮 GameScore MindX - Đấu Trường Điểm Số & Tiến Hóa Digimon

Hệ thống game hóa chấm điểm tương tác theo thời gian thực (Real-time Gamified Classroom Scoring & Evolution Arena) được thiết kế chuyên biệt cho các lớp học Robotics và Lập trình tại **MindX Technology School**.

Ứng dụng giúp tạo động lực học tập, tinh thần làm việc nhóm và không khí sôi nổi trong lớp thông qua cơ chế thi đua điểm số và chứng kiến linh thú Digimon tiến hóa trực tiếp trên màn hình máy chiếu.

---

## ✨ Tính Năng Nổi Bật

### 🖥️ Màn Hình Kép Độc Lập (Dual-Monitor Sync)
- **Teacher View (`#teacher`)**: Bảng điều khiển dành riêng cho giáo viên trên laptop để cộng/trừ điểm nhanh (+1, +2, +5, -1, -5), quản lý danh sách đội và xem thống kê chi tiết.
- **Projector View (`#projector`)**: Màn hình chiếu cỡ lớn dành cho cả lớp chiêm ngưỡng với hiệu ứng hoạt họa, thanh tiến trình mượt mà, đường đua mascot và bục vinh danh.
- **Đồng bộ thời gian thực**: Sử dụng `BroadcastChannel` và `localStorage`, đồng bộ tức thời giữa hai tab trình duyệt mà không cần kết nối server hay internet.

### 🦖 Hệ Thống Tiến Hóa Digimon (Evolution System)
- Kho linh thú Digimon phong phú với hàng trăm loài và các nhánh tiến hóa chuẩn (Agumon, Gabumon, Patamon, Guilmon, V-mon...).
- Hoạt họa động đa trạng thái: `idle` (nghỉ), `walk` (chạy đua), `attack` (tấn công khi nhận điểm lớn), `happy` (vui mừng), `sleep` (khi bị trừ điểm).
- Cơ chế trứng **Digitama**: Khi đội bị trừ điểm về $\le 0$, Digimon sẽ thoái hóa về dạng trứng Digitama để nhắc nhở học sinh tập trung.
- Hiệu ứng tiến hóa hoành tráng (Evolution Overlay Modal): Pháo hoa ăn mừng (`canvas-confetti`), âm thanh hào hùng và hiệu ứng ánh sáng.

### 🏆 Tổng Kết Buổi Học & Bục Vinh Danh
- Bục vinh quang (Podium) 3 hạng đầu với cúp vàng, bạc, đồng.
- Bảng tổng kết buổi học (Session Summary Modal) chi tiết để giáo viên chia sẻ thành tích với phụ huynh và học sinh.
- Tính năng Undo lịch sử điểm số an toàn (phục hồi tối đa 10 thao tác gần nhất).

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 8](https://vite.dev/) (tốc độ khởi động và HMR siêu nhanh)
- **Âm thanh**: [Howler.js](https://howlerjs.com/)
- **Hiệu ứng đồ họa**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti), [Lucide React](https://lucide.dev/)
- **Linter & Code Quality**: [Oxlint](https://oxc.rs/)

---

## 🚀 Cài Đặt & Khởi Chạy

### 1. Cài đặt phụ thuộc
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Trình duyệt sẽ mở tại `http://localhost:5173`.
- Bật tab máy chiếu: mở đường dẫn `http://localhost:5173#projector` và kéo sang màn hình phụ/máy chiếu (ấn `F11` để full màn hình).
- Tab điều khiển giáo viên: mở tại `http://localhost:5173#teacher`.

### 3. Kiểm tra mã nguồn (Lint)
```bash
npm run lint
```

### 4. Đóng gói sản phẩm (Build Production)
```bash
npm run build
```

---

## 📦 Scripts Đồng Bộ Dữ Liệu

Dự án tích hợp sẵn các script lấy dữ liệu và hoạt họa Digimon từ DIM Card Catalog:
```bash
# Đồng bộ danh mục sprite
npm run sync:sprites

# Đồng bộ sprite sheet và animation APNG
npm run sync:animations
```

---

## 📂 Cấu Trúc Dự Án

```
├── public/
│   ├── assets/digimon/     # Dữ liệu sprite và animation của Digimon
│   ├── audio/              # Nhạc và âm thanh hiệu ứng tiến hóa
│   └── fonts/              # Font chữ gaming hiển thị máy chiếu
├── scripts/                # Script đồng bộ tài nguyên từ DIM
├── src/
│   ├── components/         # Các React component (TeacherView, ProjectorView, Podium...)
│   ├── data/               # Dữ liệu catalog Digimon và cấu hình mốc tiến hóa
│   ├── services/           # Quản lý âm thanh (sound) và đồng bộ lưu trữ (storage)
│   ├── styles/             # Global CSS và bảng màu theme
│   ├── types/              # Định nghĩa kiểu dữ liệu TypeScript
│   ├── App.tsx             # Điều phối trạng thái chính và view router
│   └── main.tsx            # Điểm khởi chạy React ứng dụng
├── index.html              # HTML template chính
├── vite.config.ts          # Cấu hình Vite & alias đường dẫn @
└── package.json            # Cấu hình gói và kịch bản chạy
```

---

*Phát triển với sự tận tâm dành cho học sinh MindX Technology School.*
