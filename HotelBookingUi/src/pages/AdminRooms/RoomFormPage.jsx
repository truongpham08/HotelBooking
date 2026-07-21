// src/pages/AdminRooms/RoomFormPage.jsx - THÀNH VIÊN 4
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Image as ImageIcon, Check,
  Users, Maximize2, AlertCircle, Loader2
} from 'lucide-react';
import adminRoomApi from '../../services/api/adminRoomApi';

const AMENITIES_OPTIONS = [
  'WiFi', 'Điều hòa', 'TV', 'Ban công', 'Tủ lạnh', '2 Giường đôi',
  '2 Phòng ngủ', 'Phòng khách', 'Bếp nhỏ', 'Hồ bơi riêng',
  'Quầy bar', 'View biển', 'View toàn cảnh', 'Ăn sáng miễn phí',
  'Giặt ủi', 'Dịch vụ 24/7', 'Bồn tắm', 'Máy sấy tóc'
];

// --- Reusable UI Components ---
const InputField = ({ label, name, type = 'text', value, onChange, placeholder, icon: Icon, extraContent, required, min }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all`}
      />
      {Icon && (
        typeof Icon === 'string'
          ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">{Icon}</span>
          : <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
      )}
    </div>
    {extraContent}
  </div>
);

// --- Main Page Component ---
const RoomFormPage = () => {
  const { id } = useParams(); // có id => Edit mode, không có => Create mode
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    roomType: 'STANDARD',
    pricePerNight: '',
    capacity: 2,
    area: '',
    image: '',
    available: true,
    featured: false,
    amenities: []
  });

  const [loading, setLoading] = useState(isEditMode); // chỉ loading khi edit
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Room types từ backend
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // Luôn fetch danh sách loại phòng từ backend khi vào form
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const data = await adminRoomApi.getRoomTypes();
        // API trả về: [{ value: 'STANDARD', label: 'Standard' }, ...]
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (list.length > 0) {
          setRoomTypes(list);
          // Đặt lại roomType mặc định = loại đầu tiên từ backend
          if (!isEditMode) {
            setFormData(prev => ({ ...prev, roomType: list[0].value }));
          }
        }
      } catch (err) {
        console.error('Không thể tải loại phòng từ API.', err);
        showToast('Không thể tải loại phòng từ backend.', 'error');
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchRoomTypes();
  }, [isEditMode]);

  // Nếu là Edit, tải dữ liệu phòng hiện tại
  useEffect(() => {
    if (!isEditMode) return;
    const fetchRoom = async () => {
      try {
        const data = await adminRoomApi.getRoomById(id);
        const room = data?.data || data;
        setFormData({
          name: room.name || '',
          roomType: room.roomType || 'STANDARD',
          pricePerNight: room.pricePerNight || '',
          capacity: room.capacity || 2,
          area: room.area || '',
          image: room.image || '',
          available: room.available ?? true,
          featured: room.featured ?? false,
          amenities: Array.isArray(room.amenities) ? room.amenities : []
        });
      } catch (err) {
        setError('Không thể tải thông tin phòng. Vui lòng thử lại.');
        console.error('Error fetching room:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, isEditMode]);

  // Xử lý thay đổi dữ liệu Form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Xử lý Submit Form - gọi API thật
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        area: formData.area ? Number(formData.area) : null,
      };

      if (isEditMode) {
        await adminRoomApi.updateRoom(id, payload);
        showToast('Cập nhật phòng thành công!');
      } else {
        await adminRoomApi.createRoom(payload);
        showToast('Thêm phòng mới thành công!');
      }
      // Điều hướng về danh sách sau 1 giây để user thấy toast
      setTimeout(() => navigate('/admin/rooms'), 1200);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra.';
      setError(message);
      console.error('Error saving room:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-stone-500 font-medium">Đang tải thông tin phòng...</p>
      </div>
    );
  }

  // --- Giao diện (Render) ---
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border transition-all duration-300 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          {toast.type === 'success' ? <Check className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header & Điều hướng */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/rooms"
          className="p-2 text-stone-500 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-extrabold text-stone-900 tracking-tight">
            {isEditMode ? `Chỉnh sửa phòng #${id}` : 'Thêm Phòng Mới'}
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {isEditMode ? 'Cập nhật thông tin phòng nghỉ.' : 'Giao diện cấu hình thông số phòng nghỉ.'}
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* CỘT TRÁI + GIỮA: Thông tin cơ bản */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">

            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-lg font-bold text-stone-900 font-serif">Thông tin cơ bản</h2>
              <p className="text-xs text-stone-400">Vui lòng điền đúng và đủ các thông tin bắt buộc.</p>
            </div>

            <InputField
              label="Tên phòng nghỉ"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Phòng Deluxe View Biển 203"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Loại phòng khách sạn
                </label>
                {loadingTypes ? (
                  <div className="w-full px-4 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm text-stone-400 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    Đang tải loại phòng...
                  </div>
                ) : (
                  <select
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-stone-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  >
                    {roomTypes.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
              </div>

              <InputField
                label="Sức chứa tối đa (Người)"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
                min="1"
                placeholder="Số lượng người ở"
                icon={Users}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Giá một đêm (VND)"
                name="pricePerNight"
                type="number"
                value={formData.pricePerNight}
                onChange={handleChange}
                required
                min="0"
                placeholder="Ví dụ: 850000"
                icon="₫"
                extraContent={<p className="text-[11px] text-stone-400">Xem trước giá: <strong className="text-amber-600">{formatPrice(formData.pricePerNight)}</strong></p>}
              />

              <InputField
                label="Diện tích phòng nghỉ (m²)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                min="1"
                placeholder="Ví dụ: 35"
                icon={Maximize2}
              />
            </div>

            <InputField
              label="Đường dẫn ảnh phòng (URL)"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Nhập link ảnh (ví dụ: /room-deluxe.png)"
              extraContent={
                <p className="text-[11px] text-stone-400 leading-normal">
                  Bạn có thể nhập đường dẫn tương đối hoặc tuyệt đối.
                </p>
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <Link
              to="/admin/rooms"
              className="px-6 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-sm shadow-sm transition-all duration-200"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-bold px-8 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-sm"
            >
              {submitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...</>
                : <><Save className="w-4 h-4" /> {isEditMode ? 'Lưu thay đổi' : 'Thêm phòng'}</>
              }
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: Xem trước ảnh, Trạng thái, Tiện ích */}
        <div className="space-y-6">

          {/* Xem trước ảnh */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider font-serif">Xem trước ảnh phòng</h3>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center text-stone-300">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`absolute inset-0 items-center justify-center text-center p-4 ${formData.image ? 'hidden' : 'flex'} flex-col`}>
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                <span className="text-xs text-stone-400">Chưa có ảnh</span>
              </div>
            </div>
          </div>

          {/* Trạng thái phòng */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider font-serif">Trạng thái phòng</h3>
            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
              <div>
                <span className="text-xs font-bold text-stone-700 block">Sẵn sàng đón khách</span>
                <span className="text-[10px] text-stone-400 mt-0.5 block">Cho phép khách tìm kiếm & đặt phòng</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
              <div>
                <span className="text-xs font-bold text-stone-700 block">Phòng nổi bật</span>
                <span className="text-[10px] text-stone-400 mt-0.5 block">Hiển thị trên trang chủ & kết quả tìm kiếm</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* Tiện ích phòng */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider font-serif">Tiện ích phòng</h3>
              <span className="text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                Đã chọn: {formData.amenities.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
              {AMENITIES_OPTIONS.map((amenity) => {
                const isChecked = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityChange(amenity)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all duration-150 ${isChecked
                      ? 'bg-amber-50 border-amber-400 text-amber-800'
                      : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600'
                      }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${isChecked ? 'bg-amber-500 border-amber-500 text-white' : 'border-stone-300 bg-white'
                      }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span className="truncate">{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};

export default RoomFormPage;
