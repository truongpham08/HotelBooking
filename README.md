# 🏨 Hotel Booking System

Chào mừng đến với dự án **Hotel Booking System** — Hệ thống đặt phòng khách sạn trực tuyến được phát triển bởi nhóm 5 thành viên trong môn học **SBA303**.

---

## 📂 Cấu Trúc Dự Án (Project Structure)

Dự án được tổ chức theo cấu trúc Monorepo gồm 2 thành phần độc lập:

| Thư mục | Thành phần | Công nghệ chính | Mô tả |
| :--- | :--- | :--- | :--- |
| **`HotelBookingService/`** | Backend | Java Spring Boot, MySQL | RESTful API, xử lý nghiệp vụ đặt phòng, xác thực JWT |
| **`HotelBookingUi/`** | Frontend | React + Vite, Tailwind CSS | Giao diện đặt phòng cho khách hàng và Admin Dashboard |

---

## 👥 Phân Chia Công Việc (Team Assignment)

Dự án Frontend được chia thành **5 phân hệ độc lập** cho 5 thành viên, mỗi người làm trên một **nhánh Git riêng** để tránh xung đột code:

| Thành viên | Nhánh Git | Thư mục phụ trách | Màn hình chính |
| :---: | :--- | :--- | :--- |
| **TV 1** | `feat/member-1-auth` | `src/pages/Auth/` | Đăng nhập, Đăng ký, Trang cá nhân |
| **TV 2** | `feat/member-2-home` | `src/pages/Home/` | Trang chủ, Tìm kiếm & Lọc phòng |
| **TV 3** | `feat/member-3-booking` | `src/pages/Booking/` | Chi tiết phòng, Thanh toán, Thành công |
| **TV 4** | `feat/member-4-admin-rooms` | `src/pages/AdminRooms/` | Admin - Quản lý Phòng & Loại phòng |
| **TV 5** | `feat/member-5-admin-bookings` | `src/pages/AdminBookings/` | Admin - Quản lý Đơn đặt & Dashboard |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 📌 Yêu Cầu Hệ Thống
- **Node.js** 18+ (khuyên dùng LTS) — [Tải tại nodejs.org](https://nodejs.org)
- **Git** — [Tải tại git-scm.com](https://git-scm.com)

### 1️⃣ Frontend Setup

```bash
# 1. Clone repository về máy
git clone <URL_GITHUB_REPO_CUA_NHOM>

# 2. Di chuyển vào thư mục Frontend
cd HotelBookingUi

# 3. Cài đặt tất cả thư viện cần thiết
npm install

# 4. Chạy server phát triển (Development)
npm run dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

> Các trang có thể truy cập nhanh:
> - `/` — Trang chủ (Thành viên 2)
> - `/search` — Tìm kiếm phòng (Thành viên 2)
> - `/login` — Đăng nhập (Thành viên 1)
> - `/register` — Đăng ký (Thành viên 1)
> - `/room/1` — Chi tiết phòng (Thành viên 3)
> - `/checkout` — Thanh toán (Thành viên 3)
> - `/admin` — Dashboard Admin (Thành viên 5)
> - `/admin/rooms` — Quản lý phòng (Thành viên 4)
> - `/admin/bookings` — Quản lý đơn đặt (Thành viên 5)

### 2️⃣ Backend Setup

> *(Backend sẽ được phát triển sau khi Frontend hoàn thiện)*

**Yêu cầu:** JDK 17+, Maven, MySQL 8.0+

```bash
# Di chuyển vào thư mục backend
cd HotelBookingService

# Cấu hình database trong:
# src/main/resources/application.properties

# Chạy ứng dụng Spring Boot
./mvnw spring-boot:run
```

Backend API chạy tại: **http://localhost:8080**

---

## 🌿 Quy Trình Git (Git Flow)

> **Đọc kỹ trước khi bắt đầu code!** Tham khảo file [`GIT_GUIDE.md`](./GIT_GUIDE.md) để biết hướng dẫn chi tiết từng bước.

### Quy tắc bắt buộc:
1. ❌ **KHÔNG BAO GIỜ** commit/push trực tiếp lên nhánh `main`
2. ✅ Mỗi thành viên chỉ được code trong **thư mục phân hệ của mình**
3. ✅ Tạo **Pull Request (PR)** để Trưởng nhóm kiểm tra và duyệt merge
4. ✅ Luôn `git pull origin main` và `git merge main` vào nhánh cá nhân **trước khi bắt đầu code mỗi ngày**

### Tóm tắt lệnh hàng ngày:
```bash
# Trước khi code: cập nhật code mới nhất
git checkout main && git pull origin main
git checkout feat/member-X-ten-phan-he
git merge main

# Sau khi code xong một tính năng: lưu & đẩy lên
git add .
git commit -m "feat: mô tả ngắn gọn việc đã làm"
git push origin feat/member-X-ten-phan-he
# → Vào GitHub tạo Pull Request để Trưởng nhóm duyệt
```

---

## 📏 Quy Tắc Code (Coding Conventions)

### Frontend (React + Tailwind CSS)

| Quy tắc | Chi tiết |
| :--- | :--- |
| **Ngôn ngữ file** | Dùng `.jsx` cho file có JSX, `.js` cho logic thuần |
| **Component** | Arrow Function: `const MyComponent = () => { }` |
| **Đặt tên** | Component: `PascalCase` / File hook & utils: `camelCase` |
| **Export** | Dùng `export default` cho trang (Page), Named Export cho component nhỏ |
| **Styling** | **Bắt buộc** dùng Tailwind CSS, không viết CSS thủ công vào file `.css` |
| **Gọi API** | Tất cả lệnh gọi API **phải đi qua** `src/services/api/axiosClient.js` |
| **State** | Dùng `useState`, `useReducer` cho state cục bộ; `AuthContext` cho state đăng nhập |

### Cấu Trúc Thư Mục Frontend

```
src/
├── components/layout/   # Navbar, Footer, AdminLayout (KHÔNG SỬA)
├── context/             # AuthContext.jsx (KHÔNG SỬA)
├── services/api/        # axiosClient.js (KHÔNG SỬA)
│
├── pages/
│   ├── Auth/            # → Thành viên 1
│   ├── Home/            # → Thành viên 2
│   ├── Booking/         # → Thành viên 3
│   ├── AdminRooms/      # → Thành viên 4
│   └── AdminBookings/   # → Thành viên 5
│
├── App.jsx              # Routing (KHÔNG SỬA — liên hệ Trưởng nhóm nếu cần)
├── main.jsx             # Entry point (KHÔNG SỬA)
└── index.css            # CSS toàn cục (KHÔNG SỬA)
```

### Backend (Spring Boot)

| Quy tắc | Chi tiết |
| :--- | :--- |
| **Ngôn ngữ** | Java 17+ |
| **Cấu trúc Layer** | Controller → Service → Repository → Entity |
| **Đặt tên** | Class: `PascalCase` / Method & biến: `camelCase` / Hằng số: `UPPER_SNAKE_CASE` |
| **DTO** | Bắt buộc dùng DTO cho Request/Response, không trả Entity thô ra ngoài API |
| **API Response** | Thống nhất format response (`ResponseJson`/`ApiResponse` wrapper) |
| **Exception** | Xử lý lỗi tập trung qua `GlobalExceptionHandler` (`@ControllerAdvice`) |

---

## 🔗 Tài Liệu Liên Quan

- 📖 [GIT_GUIDE.md](./GIT_GUIDE.md) — Hướng dẫn chi tiết quy trình Git nhóm
- 📐 [docs/hotel-booking-design.md](./docs/hotel-booking-design.md) — Tài liệu thiết kế kiến trúc hệ thống

---

## 🛠️ Tech Stack

| | Frontend | Backend |
| :--- | :--- | :--- |
| **Framework** | React 19 + Vite | Spring Boot 3.x |
| **Ngôn ngữ** | JavaScript (JSX) | Java 17 |
| **Styling** | Tailwind CSS | — |
| **Routing** | React Router DOM v7 | — |
| **HTTP Client** | Axios | — |
| **ORM** | — | Spring Data JPA / Hibernate |
| **Database** | — | MySQL 8.0 |
| **Xác thực** | JWT (lưu LocalStorage) | Spring Security + JWT |
| **Build** | Vite | Maven |
