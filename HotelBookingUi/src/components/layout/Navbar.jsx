// File: src/components/layout/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null; // Không hiển thị Navbar khách ở trang Admin

  const activeClass = (path) => 
    location.pathname === path ? 'text-gold-600 font-bold' : 'text-stone-600 hover:text-gold-600';

  return (
    <nav className="bg-white border-b border-stone-100 sticky top-0 z-50 premium-card-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-serif font-extrabold text-stone-900 tracking-wider">
                🌟 GRAND <span className="text-gold-600">HARBOR</span>
              </span>
            </Link>

            {/* Menu chính */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8 text-sm font-semibold">
              <Link to="/" className={`${activeClass('/')} transition-colors`}>
                Trang Chủ
              </Link>
              <Link to="/search" className={`${activeClass('/search')} transition-colors`}>
                Tìm Phòng
              </Link>
              <Link to="/profile" className={`${activeClass('/profile')} transition-colors`}>
                Tài Khoản
              </Link>
              <Link to="/admin" className="text-stone-500 hover:text-stone-900 border border-stone-200 px-3 py-1 rounded-md transition-colors bg-stone-50">
                Dashboard Admin
              </Link>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-semibold text-stone-700 hover:text-stone-900 transition-colors">
              Đăng Nhập
            </Link>
            <Link to="/register" className="bg-gold-600 hover:bg-gold-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm">
              Đăng Ký
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
