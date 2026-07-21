
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ initialValues = {}, compact = false, onSearch }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    checkIn: initialValues.checkIn || '',
    checkOut: initialValues.checkOut || '',
    capacity: initialValues.capacity || '1',
    keyword: initialValues.keyword || '',
  });

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.checkIn) params.set('checkIn', form.checkIn);
    if (form.checkOut) params.set('checkOut', form.checkOut);
    if (form.capacity) params.set('capacity', form.capacity);
    if (form.keyword) params.set('keyword', form.keyword);
    if (onSearch) {
      onSearch(form, params);
      return;
    }
    navigate(`/search?${params.toString()}`);
  };

  if (compact) {
    return (
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap gap-2 items-end bg-white rounded-2xl shadow-lg p-4 border border-stone-100"
      >
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-stone-500 mb-1">Từ khóa</label>
          <input
            type="text"
            name="keyword"
            value={form.keyword}
            onChange={handleChange}
            placeholder="Tên phòng, loại phòng..."
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-stone-500 mb-1">Nhận phòng</label>
          <input
            type="date"
            name="checkIn"
            value={form.checkIn}
            min={today}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-semibold text-stone-500 mb-1">Trả phòng</label>
          <input
            type="date"
            name="checkOut"
            value={form.checkOut}
            min={form.checkIn || today}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
          />
        </div>
        <div className="min-w-[110px]">
          <label className="block text-xs font-semibold text-stone-500 mb-1">Số khách</label>
          <select
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition bg-white"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} khách</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-gold-600 hover:bg-gold-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          🔍 Tìm
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-5xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 md:p-8 border border-white/40"
    >
      <h2 className="text-center text-stone-700 font-semibold text-sm uppercase tracking-widest mb-6">
        ✨ Tìm Phòng Lý Tưởng Của Bạn
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Keyword */}
        <div className="relative">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
            Tìm kiếm
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-base">🔍</span>
            <input
              type="text"
              name="keyword"
              value={form.keyword}
              onChange={handleChange}
              placeholder="Tên phòng, loại phòng..."
              className="w-full pl-9 pr-3 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition placeholder:text-stone-300"
            />
          </div>
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
            📅 Ngày nhận phòng
          </label>
          <input
            type="date"
            name="checkIn"
            value={form.checkIn}
            min={today}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-xl px-3 py-3 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
            📅 Ngày trả phòng
          </label>
          <input
            type="date"
            name="checkOut"
            value={form.checkOut}
            min={form.checkIn || today}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-xl px-3 py-3 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition"
          />
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
            👥 Số khách
          </label>
          <select
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="w-full border border-stone-200 rounded-xl px-3 py-3 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-gold-400 focus:border-gold-400 transition bg-white"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} khách</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        id="hero-search-btn"
        className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-bold py-3.5 rounded-2xl text-base transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] tracking-wide"
      >
        🏨 Tìm Phòng Ngay
      </button>
    </form>
  );
};

export default SearchBar;
