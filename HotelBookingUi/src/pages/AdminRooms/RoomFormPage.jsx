// src/pages/AdminRooms/RoomFormPage.jsx - THÀNH VIÊN 4
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Image as ImageIcon, Check,
  Users, Maximize2
} from 'lucide-react';

const AMENITIES_OPTIONS = [
  'WiFi', 'Điều hòa', 'TV', 'Ban công', 'Tủ lạnh', '2 Giường đôi',
  '2 Phòng ngủ', 'Phòng khách', 'Bếp nhỏ', 'Hồ bơi riêng',
  'Quầy bar', 'View biển', 'View toàn cảnh', 'Ăn sáng miễn phí',
  'Giặt ủi', 'Dịch vụ 24/7', 'Bồn tắm', 'Máy sấy tóc'
];

const ROOM_TYPE_OPTIONS = [
  { value: 'STANDARD', label: 'Standard (Tiêu chuẩn)' },
  { value: 'DELUXE', label: 'Deluxe (Cao cấp)' },
  { value: 'SUITE', label: 'Suite (Sang trọng)' },
  { value: 'PRESIDENTIAL', label: 'Presidential (Thượng hạng)' }
];

// --- Reusable UI Components ---
const InputField = ({ label, name, type = 'text', value, onChange, placeholder, icon: Icon, extraContent, required }) => (
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
        className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all`}
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
  const [formData, setFormData] = useState({
    name: '',
    roomType: 'STANDARD',
    pricePerNight: '',
    capacity: 2,
    area: '',
    image: '',
    available: true,
    amenities: []
  });

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

  // Xử lý Gửi Form (Submit) - Chỉ mock UI
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dữ liệu form (Chưa gọi API):", formData);
    alert("Nút lưu đã được bấm! Bạn có thể xem dữ liệu form ở màn hình Console.");
  };

  const formatPrice = (price) => {
    if (!price) return '0 đ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // --- Giao diện (Render) ---
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
            Thêm Phòng Mới
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Giao diện cấu hình thông số phòng nghỉ.
          </p>
        </div>
      </div>

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
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-stone-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                >
                  {ROOM_TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <InputField
                label="Sức chứa tối đa (Người)"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                required
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
                placeholder="Ví dụ: 850000"
                icon="₫"
                extraContent={<p className="text-[11px] text-stone-400">Xem trước giá: <strong className="text-gold-600">{formatPrice(formData.pricePerNight)}</strong></p>}
              />

              <InputField
                label="Diện tích phòng nghỉ (m²)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                required
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
              className="inline-flex items-center justify-center gap-2 bg-gold-600 hover:bg-gold-700 text-white font-bold px-8 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 text-sm"
            >
              <Save className="w-4 h-4" /> Lưu phòng nghỉ
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: Xem trước ảnh và Tiện ích */}
        <div className="space-y-6">

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-850 uppercase tracking-wider font-serif">Xem trước ảnh phòng</h3>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center text-stone-300">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '';
                    e.target.className = 'hidden';
                    e.target.parentNode.innerHTML = '<span class="text-xs text-rose-500 font-medium px-4 text-center">Không tải được ảnh từ link đã cung cấp!</span>';
                  }}
                />
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  <span className="text-xs text-stone-400">Chưa có ảnh</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-stone-850 uppercase tracking-wider font-serif">Trạng thái phòng</h3>
            <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-150">
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
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-600"></div>
              </label>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-850 uppercase tracking-wider font-serif">Tiện ích phòng</h3>
              <span className="text-xs text-gold-600 font-bold bg-gold-50 border border-gold-200 px-2 py-0.5 rounded-lg">
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
                      ? 'bg-gold-50 border-gold-500 text-gold-800'
                      : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600'
                      }`}
                  >
                    <span className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${isChecked ? 'bg-gold-600 border-gold-600 text-white' : 'border-stone-300 bg-white'
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
