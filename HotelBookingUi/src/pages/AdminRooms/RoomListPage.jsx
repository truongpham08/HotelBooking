// src/pages/AdminRooms/RoomListPage.jsx - THÀNH VIÊN 4
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Search, Edit2, Trash2, SlidersHorizontal,
  AlertCircle, Check, X, Info, Maximize2, Users, AlertTriangle
} from 'lucide-react';
import roomApi from '../../services/api/roomApi';

const DEFAULT_MOCK_ROOMS = [
  {
    id: 1,
    name: 'Phòng Deluxe View Biển',
    roomType: 'DELUXE',
    pricePerNight: 850000,
    capacity: 2,
    area: 35,
    image: '/room-deluxe.png',
    amenities: ['WiFi', 'Điều hòa', 'TV', 'Ban công'],
    available: true,
  },
  {
    id: 2,
    name: 'Phòng Suite Gia Đình',
    roomType: 'SUITE',
    pricePerNight: 1500000,
    capacity: 4,
    area: 65,
    image: '/room-suite.png',
    amenities: ['WiFi', '2 Phòng ngủ', 'Phòng khách', 'Bếp nhỏ'],
    available: true,
  },
  {
    id: 3,
    name: 'Phòng Standard Tiêu Chuẩn',
    roomType: 'STANDARD',
    pricePerNight: 450000,
    capacity: 2,
    area: 25,
    image: '/room-standard.png',
    amenities: ['WiFi', 'TV', 'Điều hòa'],
    available: true,
  },
  {
    id: 4,
    name: 'Phòng Deluxe Gia Đình',
    roomType: 'DELUXE',
    pricePerNight: 1100000,
    capacity: 4,
    area: 50,
    image: '/room-deluxe.png',
    amenities: ['WiFi', '2 Giường đôi', 'Điều hòa', 'Tủ lạnh'],
    available: false,
  },
  {
    id: 5,
    name: 'Phòng Presidential Thượng Hạng',
    roomType: 'PRESIDENTIAL',
    pricePerNight: 5000000,
    capacity: 6,
    area: 120,
    image: '/room-presidential.png',
    amenities: ['WiFi', 'Hồ bơi riêng', 'Quầy bar', 'View toàn cảnh', 'Dịch vụ 24/7'],
    available: true,
  }
];

const ROOM_TYPE_LABELS = {
  STANDARD: { label: 'Standard', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  DELUXE: { label: 'Deluxe', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  SUITE: { label: 'Suite', color: 'bg-gold-50 text-gold-700 border-gold-200' },
  PRESIDENTIAL: { label: 'Presidential', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
};

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Modals & Notifs
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await roomApi.getRooms();
      const roomsList = Array.isArray(data) ? data : (data?.content || data?.data || []);
      if (roomsList.length > 0) {
        setRooms(roomsList);
        localStorage.setItem('admin_rooms', JSON.stringify(roomsList));
        setIsOffline(false);
      } else {
        loadMockRooms("Không có phòng trên hệ thống, đã sử dụng dữ liệu mô phỏng LocalStorage.");
      }
    } catch (error) {
      console.warn("Lỗi kết nối API, chuyển sang sử dụng LocalStorage:", error);
      loadMockRooms("Đang chạy ở chế độ Demo Offline (Lưu trữ LocalStorage).");
    } finally {
      setLoading(false);
    }
  };

  const loadMockRooms = (reasonMessage) => {
    const localRooms = localStorage.getItem('admin_rooms');
    if (localRooms) {
      setRooms(JSON.parse(localRooms));
    } else {
      localStorage.setItem('admin_rooms', JSON.stringify(DEFAULT_MOCK_ROOMS));
      setRooms(DEFAULT_MOCK_ROOMS);
    }
    setIsOffline(true);
    showToast(reasonMessage, 'info');
  };

  useEffect(() => {
    loadRooms();
  }, []);





  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 animate-slide-in-right ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            toast.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
          {toast.type === 'success' && <Check className="w-5 h-5 text-emerald-600" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span className="text-sm font-semibold">{toast.message}</span>
          <button onClick={() => setToast(p => ({ ...p, show: false }))} className="text-stone-400 hover:text-stone-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header và Nút thêm */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-stone-900 tracking-tight">
            Quản Lý Danh Sách Phòng
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Xem và sửa đổi các phòng nghỉ của khách sạn Grand Harbor.
          </p>
        </div>
      </div>


      {/* Bảng Danh sách Phòng */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm">
          <div className="inline-block animate-spin text-gold-600 mb-4">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
            </svg>
          </div>
          <p className="text-stone-500 text-sm font-medium">Đang tải danh sách phòng...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-stone-800 font-serif">Chưa có phòng nào</h3>
          <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
            Hiện tại hệ thống chưa có phòng nào.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Phòng nghỉ</th>
                  <th className="py-4 px-6">Loại phòng</th>
                  <th className="py-4 px-6 text-center">Thông số</th>
                  <th className="py-4 px-6 text-right">Giá / Đêm</th>
                  <th className="py-4 px-6 text-center">Trạng thái</th>
                  <th className="py-4 px-6">Tiện nghi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {rooms.map((room) => {
                  const typeLabel = ROOM_TYPE_LABELS[room.roomType] || ROOM_TYPE_LABELS.STANDARD;
                  const imageSrc = room.image || '/room-deluxe.png';

                  return (
                    <tr key={room.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Ảnh & Tên phòng */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0">
                            <img
                              src={imageSrc}
                              alt={room.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = '/room-deluxe.png'; }}
                            />
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 block leading-tight">{room.name}</span>
                            <span className="text-xs text-stone-400 mt-1 block">ID: {room.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Loại phòng */}
                      <td className="py-4 px-6">
                        <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${typeLabel.color}`}>
                          {typeLabel.label}
                        </span>
                      </td>

                      {/* Thông số sức chứa/diện tích */}
                      <td className="py-4 px-6 text-stone-600">
                        <div className="flex flex-col items-center justify-center gap-1 text-xs">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-stone-400" />
                            {room.capacity} khách
                          </span>
                          {room.area && (
                            <span className="flex items-center gap-1 text-stone-400">
                              <Maximize2 className="w-3 h-3" />
                              {room.area}m²
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Giá */}
                      <td className="py-4 px-6 text-right font-extrabold text-stone-900">
                        {formatPrice(room.pricePerNight)}
                      </td>

                      {/* Trạng thái */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full ${room.available
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${room.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {room.available ? 'Đang trống' : 'Hết phòng / Bảo trì'}
                        </span>
                      </td>

                      {/* Tiện nghi */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {Array.isArray(room.amenities) && room.amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                              {a}
                            </span>
                          ))}
                          {Array.isArray(room.amenities) && room.amenities.length > 3 && (
                            <span className="text-[10px] text-stone-400 font-bold px-1.5 py-0.5">
                              +{room.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      </td>


                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


    </div>
  );
};

export default RoomListPage;
