// File: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

// Phân hệ 1: Auth & Profile (Thành viên 1)
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ProfilePage from './pages/Auth/ProfilePage';

// Phân hệ 2: Home & Search (Thành viên 2)
import HomePage from './pages/Home/HomePage';
import SearchPage from './pages/Home/SearchPage';

// Phân hệ 3: Room Detail & Booking Flow (Thành viên 3)
import RoomDetailPage from './pages/Booking/RoomDetailPage';
import CheckoutPage from './pages/Booking/CheckoutPage';
import SuccessPage from './pages/Booking/SuccessPage';

// Phân hệ 4: Admin Rooms (Thành viên 4)
import RoomListPage from './pages/AdminRooms/RoomListPage';
import RoomFormPage from './pages/AdminRooms/RoomFormPage';

// Phân hệ 5: Admin Bookings (Thành viên 5)
import BookingListPage from './pages/AdminBookings/BookingListPage';
import DashboardPage from './pages/AdminBookings/DashboardPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar hiển thị trên tất cả các trang ngoại trừ trang Admin */}
        <Navbar />

        {/* Khu vực nội dung thay đổi theo Route */}
        <main className="flex-grow">
          <Routes>
            {/* --- CÁC ROUTE PHÍA KHÁCH HÀNG (CUSTOMER ROUTES) --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/room/:id" element={<RoomDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/success" element={<SuccessPage />} />
            
            {/* Phân hệ 1: Auth & Profile */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* --- CÁC ROUTE PHÍA QUẢN TRỊ (ADMIN ROUTES) --- */}
            <Route path="/admin" element={<AdminLayout />}>
              {/* Thống kê doanh thu (Thành viên 5) */}
              <Route index element={<DashboardPage />} />
              
              {/* Quản lý danh sách đơn hàng (Thành viên 5) */}
              <Route path="bookings" element={<BookingListPage />} />
              
              {/* Quản lý danh sách phòng (Thành viên 4) */}
              <Route path="rooms" element={<RoomListPage />} />
              <Route path="rooms/add" element={<RoomFormPage />} />
              <Route path="rooms/edit/:id" element={<RoomFormPage />} />
            </Route>

            {/* Trang 404 nếu không tìm thấy Route */}
            <Route path="*" element={
              <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <h1 className="text-6xl font-extrabold text-stone-900 font-serif">404</h1>
                <p className="text-stone-500">Trang bạn tìm kiếm không tồn tại hoặc đang phát triển.</p>
                <a href="/" className="bg-gold-600 hover:bg-gold-700 text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors">
                  Quay về Trang chủ
                </a>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer hiển thị trên tất cả các trang ngoại trừ trang Admin */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
