// File: src/components/layout/AdminLayout.jsx
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { label: '📊 Tổng Quan Thống Kê', path: '/admin' },
    { label: '🔑 Quản Lý Phòng', path: '/admin/rooms' },
    { label: '📅 Quản Lý Đơn Đặt', path: '/admin/bookings' },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-stone-900 text-white flex flex-col border-r border-stone-850">
        <div className="h-16 flex items-center px-6 border-b border-stone-800 bg-stone-950">
          <Link to="/" className="text-lg font-serif font-extrabold tracking-wider">
            🌟 GRAND <span className="text-gold-400">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  isActive 
                    ? 'bg-gold-600 text-white shadow-md' 
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-800 text-center text-xs text-stone-500">
          <Link to="/" className="text-gold-400 hover:underline font-semibold block mb-1">
            ← Quay về User Web
          </Link>
          <p>SBA303 Admin Panel v1.0</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-x-hidden">
        {/* Header Admin */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 shadow-sm">
          <span className="text-sm font-bold text-stone-600 uppercase tracking-wider">
            HỆ THỐNG QUẢN TRỊ KHÁCH SẠN
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-gold-50 text-gold-700 font-bold px-2.5 py-1 rounded-lg border border-gold-200">
              Admin Mode
            </span>
            <div className="text-sm font-medium text-stone-700">
              Xin chào, <span className="font-bold text-stone-900">Quản trị viên</span>
            </div>
          </div>
        </header>

        {/* Dynamic content rendering using Outlet */}
        <main className="flex-grow p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
