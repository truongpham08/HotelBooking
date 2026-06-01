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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // Modals & Notifs
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
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

  const handleDelete = async (id) => {
    try {
      if (isOffline) {
        const localRooms = JSON.parse(localStorage.getItem('admin_rooms') || '[]');
        const updated = localRooms.filter(r => r.id !== id);
        localStorage.setItem('admin_rooms', JSON.stringify(updated));
        setRooms(updated);
        showToast("Xóa phòng thành công trên trình duyệt (Offline)!", 'success');
      } else {
        await roomApi.deleteRoom(id);
        const updated = rooms.filter(r => r.id !== id);
        setRooms(updated);
        localStorage.setItem('admin_rooms', JSON.stringify(updated));
        showToast("Xóa phòng thành công trên hệ thống!", 'success');
      }
    } catch (error) {
      console.error("Lỗi khi xóa phòng:", error);
      // Fallback
      const localRooms = JSON.parse(localStorage.getItem('admin_rooms') || '[]');
      const updated = localRooms.filter(r => r.id !== id);
      localStorage.setItem('admin_rooms', JSON.stringify(updated));
      setRooms(updated);
      setIsOffline(true);
      showToast("Lỗi API! Phòng đã được xóa trên bộ nhớ tạm (Offline).", 'warning');
    }
    setDeleteConfirmId(null);
  };

  // Lọc phòng
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || room.roomType === filterType;
    let matchesStatus = true;
    if (filterStatus === 'AVAILABLE') matchesStatus = room.available === true;
    if (filterStatus === 'UNAVAILABLE') matchesStatus = room.available === false;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Tính toán thống kê nhanh
  const totalRoomsCount = rooms.length;
  const availableCount = rooms.filter(r => r.available).length;
  const maintenanceCount = totalRoomsCount - availableCount;
  const averagePrice = totalRoomsCount > 0 
    ? Math.round(rooms.reduce((acc, curr) => acc + (curr.pricePerNight || 0), 0) / totalRoomsCount) 
    : 0;

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 animate-slide-in-right ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
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
            Xem, sửa đổi và thêm các phòng nghỉ của khách sạn Grand Harbor.
          </p>
        </div>
        <Link
          to="/admin/rooms/add"
          className="inline-flex items-center justify-center gap-2 bg-gold-600 hover:bg-gold-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Thêm Phòng Mới
        </Link>
      </div>

      {/* Bảng thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Tổng số phòng</p>
            <h3 className="text-2xl font-bold text-stone-900 mt-1">{totalRoomsCount}</h3>
          </div>
          <span className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-stone-600">🏢</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Đang sẵn sàng</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{availableCount}</h3>
          </div>
          <span className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">✅</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Bận / Bảo trì</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{maintenanceCount}</h3>
          </div>
          <span className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-600">🛠️</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">Giá trung bình</p>
            <h3 className="text-xl font-bold text-gold-600 mt-1">{formatPrice(averagePrice)}</h3>
          </div>
          <span className="p-3 bg-gold-50 rounded-xl border border-gold-100 text-gold-600">💰</span>
        </div>
      </div>

      {/* Thông báo Offline Mode */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-center gap-3 text-sm">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-bold">Đang chạy ở chế độ Demo (Offline):</span> Các chỉnh sửa được lưu trực tiếp vào bộ nhớ cục bộ `localStorage` của trình duyệt này và sẽ không mất khi tải lại trang.
          </div>
        </div>
      )}

      {/* Thanh công cụ tìm kiếm và lọc */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Ô Tìm kiếm */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm phòng theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Các bộ lọc */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            <span className="text-xs font-semibold text-stone-500">Lọc theo:</span>
          </div>

          {/* Loại phòng */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="ALL">Tất cả loại phòng</option>
            <option value="STANDARD">Standard</option>
            <option value="DELUXE">Deluxe</option>
            <option value="SUITE">Suite</option>
            <option value="PRESIDENTIAL">Presidential</option>
          </select>

          {/* Trạng thái */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="AVAILABLE">Còn phòng (Sẵn sàng)</option>
            <option value="UNAVAILABLE">Hết phòng / Bảo trì</option>
          </select>
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
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-stone-800 font-serif">Không tìm thấy phòng</h3>
          <p className="text-stone-500 text-sm mt-1 max-w-md mx-auto">
            Không có kết quả phòng nào trùng khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setFilterType('ALL'); setFilterStatus('ALL'); }}
            className="mt-4 text-xs font-bold text-gold-600 hover:text-gold-700 underline"
          >
            Đặt lại bộ lọc
          </button>
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
                  <th className="py-4 px-6 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filteredRooms.map((room) => {
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
                        <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                          room.available 
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

                      {/* Thao tác */}
                      <td className="py-4 px-6 text-center">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/rooms/edit/${room.id}`}
                            className="p-1.5 text-stone-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors border border-stone-200 hover:border-gold-300"
                            title="Sửa phòng"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirmId(room.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-stone-200 hover:border-rose-300"
                            title="Xóa phòng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-stone-200 animate-scale-in">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <span className="p-2 bg-rose-50 rounded-xl border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <h3 className="text-lg font-bold font-serif text-stone-900">Xác Nhận Xóa Phòng</h3>
            </div>
            
            <p className="text-sm text-stone-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa phòng nghỉ này khỏi hệ thống quản lý? Thao tác này sẽ không thể khôi phục lại.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-sm transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-xl font-bold text-sm transition-colors shadow shadow-rose-200 hover:shadow-md"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomListPage;
