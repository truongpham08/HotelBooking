// File: src/components/layout/Footer.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage) return null; // Không hiển thị Footer khách ở trang Admin

  return (
    <footer className="bg-stone-900 text-white border-t border-stone-850 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Info */}
        <div className="space-y-4">
          <span className="text-xl font-serif font-extrabold tracking-wider block">
            🌟 GRAND <span className="text-gold-400">HARBOR</span>
          </span>
          <p className="text-xs text-stone-400 leading-relaxed">
            Chuỗi khách sạn 5 sao mang đến trải nghiệm nghỉ dưỡng hoàn mỹ và đẳng cấp hàng đầu Việt Nam. Nơi kiến tạo những khoảnh khắc tuyệt vời nhất của bạn.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-gold-400">Dịch Vụ</h4>
          <ul className="text-xs text-stone-400 space-y-2.5">
            <li><a href="#" className="hover:text-gold-400 transition-colors">Đặt Phòng Nghỉ</a></li>
            <li><a href="#" className="hover:text-gold-400 transition-colors">Tổ Chức Sự Kiện</a></li>
            <li><a href="#" className="hover:text-gold-400 transition-colors">Spa & Massage</a></li>
            <li><a href="#" className="hover:text-gold-400 transition-colors">Nhà Hàng Ẩm Thực</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-gold-400">Hỗ Trợ</h4>
          <ul className="text-xs text-stone-400 space-y-2.5">
            <li><a href="#" className="hover:text-gold-400 transition-colors">Trung Tâm Trợ Giúp</a></li>
            <li><a href="#" className="hover:text-gold-400 transition-colors">Điều Khoản Sử Dụng</a></li>
            <li><a href="#" className="hover:text-gold-400 transition-colors">Chính Sách Bảo Mật</a></li>
            <li><a href="#" className="hover:text-gold-400 transition-colors">Câu Hỏi Thường Gặp</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-gold-400">Liên Hệ</h4>
          <p className="text-xs text-stone-400 leading-relaxed">
            📍 Địa chỉ: 123 Đường ven biển, Quận Hải Châu, Đà Nẵng, Việt Nam<br />
            📞 Hotline: 1800 1234 (Miễn phí)<br />
            ✉️ Email: contact@grandharbor.com
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-800 mt-12 pt-6 text-center text-xs text-stone-500">
        <p>© 2026 Grand Harbor Hotel & Resort. Developed for SBA303 Group Project. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
