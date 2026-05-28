# HƯỚNG DẪN SỬ DỤNG GIT & PHỐI HỢP NHÓM (GIT FLOW)

Tài liệu này hướng dẫn chi tiết cách nhóm 5 thành viên phối hợp làm việc trên Git để phát triển giao diện dự án Đặt phòng Khách sạn (Hotel Booking) mà **không bị xung đột mã nguồn (code conflict)**.

---

## 1. PHÂN CHIA NHÁNH GIT (GIT BRANCHES)
Mỗi thành viên trong nhóm sẽ làm việc trên một nhánh (branch) riêng biệt của mình được rẽ nhánh từ nhánh `main`.

*   **Nhánh chính (`main`):** Chứa code chạy ổn định nhất của cả nhóm. **Không ai được phép trực tiếp commit hay push lên nhánh `main`**.
*   **Các nhánh của thành viên:**
    *   Thành viên 1 (Auth): `feat/member-1-auth`
    *   Thành viên 2 (Home): `feat/member-2-home`
    *   Thành viên 3 (Booking): `feat/member-3-booking`
    *   Thành viên 4 (Admin Rooms): `feat/member-4-admin-rooms`
    *   Thành viên 5 (Admin Bookings): `feat/member-5-admin-bookings`

---

## 2. QUY TRÌNH LÀM VIỆC HÀNG NGÀY CHO THÀNH VIÊN

Mỗi khi bắt đầu ngồi vào bàn code, thành viên cần thực hiện đúng các bước sau:

### Bước 1: Cập nhật code mới nhất từ nhóm về máy mình
Chuyển về nhánh `main`, lấy code mới nhất mà Trưởng nhóm đã duyệt merge từ các thành viên khác về máy:
```bash
git checkout main
git pull origin main
```

### Bước 2: Chuyển sang nhánh của mình và nhận code mới từ `main`
Chuyển về nhánh làm việc riêng của bạn (nếu chưa có nhánh thì dùng lệnh `-b` để tạo mới):
```bash
# Nếu đã có nhánh từ trước:
git checkout feat/member-1-auth

# Nếu chưa bao giờ tạo nhánh này trên máy:
git checkout -b feat/member-1-auth
```
Sau đó, gộp (merge) code mới nhất từ `main` vừa lấy ở Bước 1 vào nhánh làm việc của mình để đảm bảo bạn không bị code cũ hơn mọi người:
```bash
git merge main
```

### Bước 3: Bắt tay vào Code
Mở file trong thư mục phân hệ của mình và viết code.
*   *Ví dụ Thành viên 1:* Chỉ viết code trong `src/pages/Auth/` (LoginPage, RegisterPage, ProfilePage).
*   **Quy tắc vàng:** Không chỉnh sửa hay đụng vào file trong thư mục của thành viên khác để tránh xung đột code!

### Bước 4: Lưu code và tạo Commit
Khi đã làm xong một tính năng hoặc cuối ngày làm việc, hãy lưu lại và commit:
```bash
# Kiểm tra xem những file nào đã thay đổi
git status

# Đưa tất cả file thay đổi vào hàng chờ commit
git add .

# Tạo commit kèm thông điệp rõ ràng bằng Tiếng Việt
git commit -m "feat: hoàn thành giao diện đăng nhập và bắt lỗi form"
```

### Bước 5: Đẩy code lên GitHub
Đẩy nhánh làm việc của bạn lên trên kho lưu trữ chung (GitHub/GitLab):
```bash
git push origin feat/member-1-auth
```

### Bước 6: Tạo Pull Request (PR) để Trưởng nhóm duyệt
1.  Truy cập vào trang dự án trên GitHub.
2.  Bạn sẽ thấy một nút màu vàng hiện lên ghi: **"Compare & pull request"** cho nhánh bạn vừa đẩy lên. Bấm vào đó.
3.  Viết mô tả ngắn gọn những gì bạn đã làm (Ví dụ: *"Đã làm xong màn hình Đăng nhập và Đăng ký, responsive tốt trên mobile"*).
4.  Bấm nút **"Create pull request"**.
5.  Báo cho Trưởng nhóm vào kiểm tra và duyệt merge.

---

## 3. QUY TRÌNH DÀNH CHO TRƯỞNG NHÓM (LEAD / MAINTAINER)

Trưởng nhóm là người duy nhất có quyền duyệt merge Pull Request của thành viên vào nhánh chính `main`.

1.  Khi nhận được thông báo Pull Request từ thành viên trên GitHub, truy cập vào tab **Pull Requests**.
2.  Bấm vào Pull Request cần duyệt.
3.  Vào tab **Files changed** để xem thành viên đó đã thay đổi những gì, có sửa nhầm vào file của người khác không.
4.  Nếu thấy code ổn, không có lỗi xung đột (GitHub báo *"This branch has no conflicts with the base branch"*):
    *   Bấm nút **Merge pull request**.
    *   Bấm **Confirm merge**.
5.  Nếu có lỗi hoặc code chưa đẹp, viết comment yêu cầu thành viên sửa lại. Thành viên chỉ cần sửa ở máy mình, commit và push lại lên nhánh cũ, GitHub sẽ tự động cập nhật vào Pull Request đó.

---

## 4. XỬ LÝ KHI GẶP CONFLICT (XUNG ĐỘT CODE)
Nếu GitHub báo có conflict và không cho merge, nguyên nhân là do 2 người cùng sửa chung một dòng trên một file (ví dụ file cấu hình định tuyến chung `App.jsx`).

**Cách giải quyết tại máy local của thành viên:**
1.  Chuyển về `main` và `pull` code mới nhất:
    ```bash
    git checkout main
    git pull origin main
    ```
2.  Chuyển về nhánh của mình và `merge main`:
    ```bash
    git checkout feat/member-1-auth
    git merge main
    ```
3.  Git sẽ báo các file bị conflict. Mở các file đó lên bằng VS Code. Bạn sẽ thấy các ký hiệu:
    ```
    <<<<<<< HEAD
    Giao diện Đăng Nhập (Code của bạn)
    =======
    Giao diện Trang Chủ (Code của người khác vừa được merge vào main trước đó)
    >>>>>>> main
    ```
4.  VS Code sẽ hiển thị các nút bấm nhanh:
    *   *Accept Current Change:* Giữ lại code của bạn.
    *   *Accept Incoming Change:* Giữ lại code của người khác từ `main`.
    *   *Accept Both Changes (Khuyên dùng):* Giữ lại cả hai đoạn code để kết hợp.
5.  Sau khi chọn xong và file hết báo đỏ, lưu lại, tiến hành commit và push lại:
    ```bash
    git add .
    git commit -m "fix: giải quyết xung đột với nhánh main"
    git push origin feat/member-1-auth
    ```
    Pull Request trên GitHub sẽ tự động xanh trở lại và sẵn sàng để merge!
