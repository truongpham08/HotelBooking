import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import authApi from '../../../services/api/authApi';

// src/pages/Auth/ProfilePage.jsx - quân
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin user', err);
        // Fallback to user from context if API fails
        setProfile(user);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInfo = profile || {
    fullName: user?.fullName || 'N/A',
    email: user?.email || 'N/A',
    phone: user?.phone || 'N/A',
    memberSince: 'N/A'
  };

  const bookingHistory = [
    {
      id: 'BK12345',
      hotelName: 'Khách sạn Mường Thanh',
      checkIn: '15/10/2024',
      checkOut: '18/10/2024',
      status: 'Đã hoàn thành',
      totalPrice: '3,500,000 VNĐ'
    },
    {
      id: 'BK12346',
      hotelName: 'Vinpearl Resort',
      checkIn: '01/12/2024',
      checkOut: '05/12/2024',
      status: 'Sắp tới',
      totalPrice: '8,200,000 VNĐ'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-stone-900">Trang Cá Nhân</h1>

        {/* Section: Thông tin cá nhân */}
        <div className="bg-white shadow-md border border-stone-100 overflow-hidden sm:rounded-2xl">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-bold text-stone-900">
                Thông tin hồ sơ
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-stone-500">
                Chi tiết tài khoản của bạn.
              </p>
            </div>
            <button className="bg-gold-600 hover:bg-gold-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors">
              Chỉnh sửa
            </button>
          </div>
          <div className="border-t border-stone-100">
            <dl>
              <div className="bg-stone-50/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-stone-500">Họ và tên</dt>
                <dd className="mt-1 text-sm font-medium text-stone-900 sm:mt-0 sm:col-span-2">{userInfo.fullName}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-stone-500">Email</dt>
                <dd className="mt-1 text-sm font-medium text-stone-900 sm:mt-0 sm:col-span-2">{userInfo.email}</dd>
              </div>
              <div className="bg-stone-50/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-stone-500">Số điện thoại</dt>
                <dd className="mt-1 text-sm font-medium text-stone-900 sm:mt-0 sm:col-span-2">{userInfo.phone}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Section: Lịch sử đặt phòng */}
        <div className="bg-white shadow-md border border-stone-100 overflow-hidden sm:rounded-2xl">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-bold text-stone-900">
              Lịch sử đặt phòng
            </h3>
          </div>
          <div className="border-t border-stone-100">
            <ul className="divide-y divide-stone-100">
              {bookingHistory.map((booking) => (
                <li key={booking.id} className="p-4 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-bold text-gold-600 truncate">{booking.hotelName}</p>
                        <p className="ml-2 flex-shrink-0 font-normal text-stone-500">
                          Mã Đặt: #{booking.id}
                        </p>
                      </div>
                      <div className="mt-1 flex text-sm text-stone-500">
                        {booking.checkIn} đến {booking.checkOut}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status}
                      </p>
                      <p className="mt-1 text-sm font-bold text-stone-900">{booking.totalPrice}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section: Đăng xuất */}
        <div className="flex justify-end">
          <button 
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-6 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
