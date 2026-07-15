// src/pages/AdminRooms/RoomListPage.jsx - THÀNH VIÊN 4
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Search, SlidersHorizontal,
  AlertCircle, Check, X, Info, Maximize2, Users, AlertTriangle
} from 'lucide-react';
import adminRoomApi from '../../services/api/adminRoomApi';

const ROOM_TYPE_LABELS = {
  STANDARD: { label: 'Standard', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  DELUXE: { label: 'Deluxe', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  SUITE: { label: 'Suite', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  PRESIDENTIAL: { label: 'Presidential', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
};

const RoomListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [filters, setFilters] = useState({ keyword: '', roomType: '', available: '' });
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0, first: true, last: true });

  // Toast
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState(null); // { id, name }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const loadRooms = async (activeFilters = filters, requestedPage = pagination.page) => {
    setLoading(true);
    try {
      const params = { page: requestedPage, size: 5 };
      if (activeFilters.keyword.trim()) params.keyword = activeFilters.keyword.trim();
      if (activeFilters.roomType) params.roomType = activeFilters.roomType;
      if (activeFilters.available !== '') params.available = activeFilters.available === 'true';

      const data = await adminRoomApi.getRooms(params);
      const roomsList = Array.isArray(data) ? data : (data?.content || data?.data || []);
      setRooms(roomsList);
      setPagination({
        page: data?.page ?? requestedPage,
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? roomsList.length,
        first: data?.first ?? requestedPage === 0,
        last: data?.last ?? true,
      });
      setIsOffline(false);
    } catch (error) {
      console.error('Không thể tải danh sách phòng từ API:', error);
      setRooms([]);
      setPagination({ page: 0, totalPages: 0, totalElements: 0, first: true, last: true });
      setIsOffline(true);
      showToast('Không thể tải danh sách phòng từ backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadRooms(filters, 0);
  };

  const handleClearFilters = () => {
    const clearedFilters = { keyword: '', roomType: '', available: '' };
    setFilters(clearedFilters);
    loadRooms(clearedFilters, 0);
  };

  const handlePageChange = (page) => {
    if (page < 0 || page >= pagination.totalPages || page === pagination.page) return;
    loadRooms(filters, page);
  };

  // Mở confirm xóa
  const handleOpenDelete = (room) => {
    setDeletingRoom(room);
    setIsDeleteModalOpen(true);
  };

  // Thực hiện xóa
  const handleDeleteConfirm = async () => {
    if (!deletingRoom) return;
    try {
      await adminRoomApi.deleteRoom(deletingRoom.id);
      showToast(`Đã xóa phòng "${deletingRoom.name}" thành công!`);
      setIsDeleteModalOpen(false);
      setDeletingRoom(null);
      loadRooms(filters, pagination.page);
    } catch (error) {
      showToast('Có lỗi xảy ra khi xóa phòng: ' + (error.response?.data?.message || error.message), 'error');
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Tổng hợp thống kê nhanh
  const stats = {
    total: pagination.totalElements,
    available: rooms.filter(r => r.available).length,
    maintenance: rooms.filter(r => !r.available).length,
    featured: rooms.filter(r => r.featured).length,
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          toast.type === 'info'    ? 'bg-blue-50 border-blue-200 text-blue-800' :
                                     'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' && <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />}
          {toast.type === 'info'    && <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />}
          {toast.type === 'error'   && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
          <span className="text-sm font-semibold">{toast.message}</span>
          <button onClick={() => setToast(p => ({ ...p, show: false }))} className="text-stone-400 hover:text-stone-600 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Offline Banner */}
      {isOffline && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">Không thể kết nối backend. Danh sách phòng hiện không có dữ liệu để hiển thị.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-stone-900 tracking-tight">
            Quản Lý Danh Sách Phòng
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Xem và quản lý các phòng nghỉ của khách sạn Grand Harbor.
          </p>
        </div>
        <Link
          to="/admin/rooms/add"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all active:scale-[0.98] shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Thêm phòng mới
        </Link>
      </div>

      <form onSubmit={handleSearch} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-stone-700">
          <SlidersHorizontal className="w-4 h-4" />
          <h2 className="text-sm font-bold">Tìm kiếm và lọc phòng</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px_auto] gap-3">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Tìm theo tên phòng..."
              className="w-full rounded-xl border border-stone-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </label>
          <select name="roomType" value={filters.roomType} onChange={handleFilterChange} className="rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-amber-500">
            <option value="">Tất cả loại phòng</option>
            {Object.entries(ROOM_TYPE_LABELS).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select name="available" value={filters.available} onChange={handleFilterChange} className="rounded-xl border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-amber-500">
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang trống</option>
            <option value="false">Bảo trì / hết phòng</option>
          </select>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-stone-800">Tìm</button>
            <button type="button" onClick={handleClearFilters} className="rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50">Xóa lọc</button>
          </div>
        </div>
      </form>

      {/* Stats Cards */}
      {!loading && rooms.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Tổng phòng', value: stats.total, color: 'text-stone-900', bg: 'bg-stone-50 border-stone-200' },
            { label: 'Đang trống', value: stats.available, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
            { label: 'Bảo trì', value: stats.maintenance, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
            { label: 'Nổi bật', value: stats.featured, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} border rounded-2xl p-4 shadow-sm`}>
              <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className={`text-3xl font-extrabold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bảng Danh sách Phòng */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm">
          <div className="inline-block animate-spin text-amber-600 mb-4">
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
            Hiện tại hệ thống chưa có phòng nào. Bấm "Thêm phòng mới" để bắt đầu.
          </p>
          <Link to="/admin/rooms/add" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all text-sm">
            <Plus className="w-4 h-4" /> Thêm phòng đầu tiên
          </Link>
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
                  <th className="py-4 px-6 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {rooms.map((room) => {
                  const typeLabel = ROOM_TYPE_LABELS[room.roomType] || ROOM_TYPE_LABELS.STANDARD;
                  const imageSrc = room.image || '/room-deluxe.png';

                  return (
                    <tr key={room.id} className="hover:bg-stone-50/70 transition-colors group">
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
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-stone-400">ID: {room.id}</span>
                              {room.featured && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold">★ Nổi bật</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Loại phòng */}
                      <td className="py-4 px-6">
                        <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full border ${typeLabel.color}`}>
                          {typeLabel.label}
                        </span>
                      </td>

                      {/* Thông số */}
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
                        <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-full ${
                          room.available
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${room.available ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {room.available ? 'Đang trống' : 'Bảo trì'}
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

                      {/* Hành động */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/admin/rooms/edit/${room.id}`}
                            className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenDelete(room)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

          {/* Footer bảng */}
          <div className="flex flex-col gap-3 px-6 py-3 bg-stone-50 border-t border-stone-100 text-xs text-stone-400 font-medium sm:flex-row sm:items-center sm:justify-between">
            <span>Tổng cộng <strong className="text-stone-700">{pagination.totalElements}</strong> phòng · Trang <strong className="text-stone-700">{pagination.page + 1}</strong>/{pagination.totalPages || 1}</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.first} className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-semibold text-stone-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-100">← Trước</button>
              <button type="button" onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.last} className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-semibold text-stone-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-100">Sau →</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-7 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2 font-serif">Xác nhận xóa phòng?</h3>
            <p className="text-stone-500 text-sm mb-1">Bạn đang xóa phòng:</p>
            <p className="text-stone-800 font-bold text-sm mb-5 px-4 py-2 bg-stone-50 rounded-xl border border-stone-200">
              "{deletingRoom.name}"
            </p>
            <p className="text-stone-400 text-xs mb-6">Hành động này không thể hoàn tác.</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => { setIsDeleteModalOpen(false); setDeletingRoom(null); }}
                className="px-5 py-2.5 font-bold text-stone-600 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors text-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors text-sm"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomListPage;
