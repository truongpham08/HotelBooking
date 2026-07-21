import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../services/api/authApi';

// src/pages/Auth/ProfilePage.jsx - quân
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Edit Profile
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  // States for Change Password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState(() => {
    return localStorage.getItem('user_avatar_' + (user?.email || ''));
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        if (user?.email) {
          localStorage.setItem('user_avatar_' + user.email, reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        const profileData = await authApi.getProfile();
        setProfile(profileData);
        setEditData({
          fullName: profileData.fullName || '',
          phone: profileData.phone || '',
          address: profileData.address || ''
        });

        const bookingsData = await authApi.getMyBookings();
        setBookingHistory(bookingsData || []);
      } catch (err) {
        console.error('Lỗi khi lấy thông tin', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = await authApi.updateProfile(editData);
      setProfile(updatedProfile);
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    try {
      await authApi.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      alert("Đổi mật khẩu thành công!");
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error("Lỗi đổi mật khẩu", error);
      alert(error.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50">Đang tải...</div>;
  }

  const userInfo = profile || user || {};

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-stone-900">Trang Cá Nhân</h1>

        {/* Section: Thông tin cá nhân */}
        <div className="bg-white shadow-md border border-stone-100 overflow-hidden sm:rounded-2xl">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={avatarPreview || userInfo.avatar || "https://ui-avatars.com/api/?name=" + (userInfo.fullName || "User") + "&background=random"}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover border border-stone-200"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-gold-600 rounded-full p-1.5 cursor-pointer hover:bg-gold-700 transition-colors shadow-sm">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                )}
              </div>
              <div>
                <h3 className="text-lg leading-6 font-bold text-stone-900">
                  Thông tin hồ sơ
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-stone-500">
                  Chi tiết tài khoản của bạn.
                </p>
              </div>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gold-600 hover:bg-gold-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm text-sm transition-colors"
              >
                Chỉnh sửa
              </button>
            ) : (
              <div className="space-x-3">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold py-2 px-4 rounded-xl shadow-sm text-sm transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm text-sm transition-colors"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
          <div className="border-t border-stone-100">
            <dl>
              <div className="bg-stone-50/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-stone-500 flex items-center">Họ và tên</dt>
                <dd className="mt-1 text-sm font-medium text-stone-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input 
                      type="text" name="fullName" value={editData.fullName} onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm"
                    />
                  ) : userInfo.fullName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-stone-500 flex items-center">Email</dt>
                <dd className="mt-1 text-sm font-medium text-stone-900 sm:mt-0 sm:col-span-2">{userInfo.email}</dd>
              </div>
              <div className="bg-stone-50/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-stone-500 flex items-center">Số điện thoại</dt>
                <dd className="mt-1 text-sm font-medium text-stone-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input 
                      type="text" name="phone" value={editData.phone} onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm"
                    />
                  ) : userInfo.phone}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-stone-500 flex items-center">Địa chỉ</dt>
                <dd className="mt-1 text-sm font-medium text-stone-900 sm:mt-0 sm:col-span-2">
                  {isEditing ? (
                    <input 
                      type="text" name="address" value={editData.address} onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm"
                    />
                  ) : (userInfo.address || 'Chưa cập nhật')}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Section: Đổi mật khẩu */}
        <div className="bg-white shadow-md border border-stone-100 overflow-hidden sm:rounded-2xl">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-bold text-stone-900">
                Bảo mật
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-stone-500">
                Quản lý mật khẩu của bạn.
              </p>
            </div>
            {!isChangingPassword && (
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="bg-stone-800 hover:bg-stone-900 text-white font-bold py-2 px-4 rounded-xl shadow-sm text-sm transition-colors"
              >
                Đổi mật khẩu
              </button>
            )}
          </div>
          {isChangingPassword && (
            <div className="border-t border-stone-100 px-4 py-5 sm:px-6">
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-stone-700">Mật khẩu cũ</label>
                  <input type="password" name="oldPassword" required
                    value={passwordData.oldPassword} onChange={handlePasswordChange}
                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Mật khẩu mới</label>
                  <input type="password" name="newPassword" required minLength={6}
                    value={passwordData.newPassword} onChange={handlePasswordChange}
                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Xác nhận mật khẩu mới</label>
                  <input type="password" name="confirmPassword" required minLength={6}
                    value={passwordData.confirmPassword} onChange={handlePasswordChange}
                    className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm p-2 border"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl shadow-sm text-sm transition-colors">
                    Cập nhật mật khẩu
                  </button>
                  <button type="button" onClick={() => { setIsChangingPassword(false); setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }); }}
                    className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold py-2 px-4 rounded-xl shadow-sm text-sm transition-colors">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Section: Lịch sử đặt phòng */}
        <div className="bg-white shadow-md border border-stone-100 overflow-hidden sm:rounded-2xl">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-bold text-stone-900">
              Lịch sử đặt phòng
            </h3>
          </div>
          <div className="border-t border-stone-100">
            {bookingHistory.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                Bạn chưa có lịch sử đặt phòng nào.
              </div>
            ) : (
              <ul className="divide-y divide-stone-100">
                {bookingHistory.map((booking) => (
                  <li key={booking.id} className="p-4 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <div className="flex text-sm">
                          <p className="font-bold text-gold-600 truncate">{booking.roomName || booking.hotelName || 'Phòng khách sạn'}</p>
                          <p className="ml-2 flex-shrink-0 font-normal text-stone-500">
                            Mã Đặt: #{booking.id}
                          </p>
                        </div>
                        <div className="mt-1 flex text-sm text-stone-500">
                          {booking.checkInDate || booking.checkIn} đến {booking.checkOutDate || booking.checkOut}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                          booking.status === "APPROVED" ? "bg-green-100 text-green-800" :
                          booking.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                          booking.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                          booking.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === "PENDING" ? "Chờ xử lý" :
                           booking.status === "APPROVED" ? "Đã duyệt" :
                           booking.status === "COMPLETED" ? "Hoàn thành" :
                           booking.status === "CANCELLED" ? "Đã hủy" : booking.status}
                        </p>
                        <p className="mt-1 text-sm font-bold text-stone-900">{booking.totalPrice ? booking.totalPrice.toLocaleString() : "0"} VNĐ</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
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
