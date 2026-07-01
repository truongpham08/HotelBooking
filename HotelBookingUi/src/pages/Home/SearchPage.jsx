
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../../components/home/SearchBar';
import RoomCard from '../../components/home/RoomCard';
import roomApi from '../../services/api/roomApi';

// ─── Mock data fallback ───────────────────────────────────────────────────────
const MOCK_ROOMS = [
  {
    id: 1,
    name: 'Grand Deluxe Ocean View',
    roomType: 'DELUXE',
    pricePerNight: 2500000,
    capacity: 2,
    area: 45,
    image: '/room-deluxe.png',
    amenities: ['WiFi', 'Minibar', 'Bồn tắm', 'Ban công'],
    available: true,
  },
  {
    id: 2,
    name: 'Presidential Suite',
    roomType: 'SUITE',
    pricePerNight: 8500000,
    capacity: 4,
    area: 120,
    image: '/room-suite.png',
    amenities: ['WiFi', 'Bể bơi riêng', 'Butler', 'Phòng khách', 'Bếp'],
    available: true,
  },
  {
    id: 3,
    name: 'Superior Comfort Room',
    roomType: 'STANDARD',
    pricePerNight: 1200000,
    capacity: 2,
    area: 30,
    image: '/room-standard.png',
    amenities: ['WiFi', 'TV 55"', 'Điều hòa'],
    available: true,
  },
  {
    id: 4,
    name: 'Family Deluxe Suite',
    roomType: 'DELUXE',
    pricePerNight: 3800000,
    capacity: 5,
    area: 75,
    image: '/room-deluxe.png',
    amenities: ['WiFi', '2 Phòng ngủ', 'Bếp nhỏ', 'Giường phụ'],
    available: true,
  },
  {
    id: 5,
    name: 'Classic Standard Room',
    roomType: 'STANDARD',
    pricePerNight: 950000,
    capacity: 1,
    area: 25,
    image: '/room-standard.png',
    amenities: ['WiFi', 'Điều hòa', 'Tủ lạnh nhỏ'],
    available: false,
  },
  {
    id: 6,
    name: 'Honeymoon Ocean Suite',
    roomType: 'SUITE',
    pricePerNight: 6200000,
    capacity: 2,
    area: 90,
    image: '/room-suite.png',
    amenities: ['WiFi', 'Bồn tắm ngoài trời', 'Rượu vang', 'Hoa tươi'],
    available: true,
  },
  {
    id: 7,
    name: 'Executive Business Room',
    roomType: 'DELUXE',
    pricePerNight: 2200000,
    capacity: 2,
    area: 40,
    image: '/room-deluxe.png',
    amenities: ['WiFi tốc độ cao', 'Bàn làm việc', 'In ấn', 'Minibar'],
    available: true,
  },
  {
    id: 8,
    name: 'Presidential Grand Suite',
    roomType: 'PRESIDENTIAL',
    pricePerNight: 15000000,
    capacity: 6,
    area: 250,
    image: '/room-suite.png',
    amenities: ['Butler riêng', 'Bể bơi', 'Phòng tập gym', 'Bếp trưởng'],
    available: true,
  },
];

const ROOM_TYPES = [
  { value: '', label: 'Tất cả loại phòng' },
  { value: 'STANDARD', label: 'Standard' },
  { value: 'DELUXE', label: 'Deluxe' },
  { value: 'SUITE', label: 'Suite' },
  { value: 'PRESIDENTIAL', label: 'Presidential' },
];

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
  { value: 'name_asc', label: 'Tên A → Z' },
  { value: 'capacity_asc', label: 'Sức chứa: Ít → Nhiều' },
];

const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: 0, max: Infinity },
  { label: 'Dưới 1.5 triệu', min: 0, max: 1500000 },
  { label: '1.5 – 3 triệu', min: 1500000, max: 3000000 },
  { label: '3 – 6 triệu', min: 3000000, max: 6000000 },
  { label: 'Trên 6 triệu', min: 6000000, max: Infinity },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const FilterSection = ({ title, children }) => (
  <div className="border-b border-stone-100 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
    <h3 className="text-xs font-bold text-stone-700 uppercase tracking-widest mb-3">{title}</h3>
    {children}
  </div>
);

const CheckboxOption = ({ id, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer py-1">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
    />
    <span className="text-sm text-stone-600">{label}</span>
  </label>
);

const FilterChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
    {label}
    <button
      onClick={onRemove}
      className="text-amber-500 hover:text-red-500 leading-none text-sm"
      aria-label="Xóa bộ lọc"
    >
      ×
    </button>
  </span>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-md">
    <div className="h-52 bg-stone-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-stone-200 rounded-full w-3/4" />
      <div className="h-3 bg-stone-100 rounded-full w-1/2" />
      <div className="flex gap-1.5 mt-2">
        <div className="h-5 bg-stone-100 rounded-full w-12" />
        <div className="h-5 bg-stone-100 rounded-full w-16" />
      </div>
      <div className="flex justify-between items-end pt-2">
        <div>
          <div className="h-3 bg-stone-100 rounded w-10 mb-1" />
          <div className="h-5 bg-stone-200 rounded w-24" />
        </div>
        <div className="h-8 bg-stone-200 rounded-xl w-20" />
      </div>
    </div>
  </div>
);

const EmptyState = ({ onReset }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-6xl mb-4">🔍</div>
    <h3 className="text-xl font-bold text-stone-800 mb-2">Không tìm thấy phòng phù hợp</h3>
    <p className="text-stone-500 text-sm max-w-sm mb-6">
      Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem nhiều kết quả hơn.
    </p>
    <button
      onClick={onReset}
      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl shadow"
    >
      Xóa Bộ Lọc
    </button>
    <Link to="/" className="mt-3 text-sm text-stone-400 hover:text-stone-600 underline underline-offset-2">
      Quay về trang chủ
    </Link>
  </div>
);

// ─── Main SearchPage ──────────────────────────────────────────────────────────
const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── State ──────────────────────────────────────────────────────────────────
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);


  // Filters state
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    capacity: searchParams.get('capacity') || '',
    roomType: searchParams.get('roomType') || '',
    priceRange: 0, // index in PRICE_RANGES
    sortBy: 'price_asc',
    availableOnly: false,
  });

  // ── Apply client-side filters on mock data ────────────────────────────────
  const applyMockFilters = (data, f) => {
    let result = [...data];
    if (f.keyword) {
      const kw = f.keyword.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(kw) || r.roomType.toLowerCase().includes(kw)
      );
    }
    if (f.roomType) result = result.filter((r) => r.roomType === f.roomType);
    if (f.capacity) result = result.filter((r) => r.capacity >= parseInt(f.capacity));
    const pr = PRICE_RANGES[f.priceRange];
    result = result.filter((r) => r.pricePerNight >= pr.min && r.pricePerNight <= pr.max);
    if (f.availableOnly) result = result.filter((r) => r.available);
    return result;
  };

  const applySortAndFilter = (data, f) => {
    const sorted = [...data];
    switch (f.sortBy) {
      case 'price_asc': return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
      case 'price_desc': return sorted.sort((a, b) => b.pricePerNight - a.pricePerNight);
      case 'name_asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'capacity_asc': return sorted.sort((a, b) => a.capacity - b.capacity);
      default: return sorted;
    }
  };

  // ── Fetch rooms ────────────────────────────────────────────────────────────
  const fetchRooms = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const params = {
        keyword: filters.keyword || undefined,
        checkIn: filters.checkIn || undefined,
        checkOut: filters.checkOut || undefined,
        capacity: filters.capacity || undefined,
        roomType: filters.roomType || undefined,
      };
      const data = await roomApi.getRooms(params);
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
            ? data.data
            : null;
      const source = list ?? MOCK_ROOMS;
      let result = applyMockFilters(source, filters);
      result = applySortAndFilter(result, filters);
      setRooms(result);
      setTotalResults(result.length);
    } catch {
      let result = applyMockFilters(MOCK_ROOMS, filters);
      result = applySortAndFilter(result, filters);
      setRooms(result);
      setTotalResults(result.length);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {

    fetchRooms();
  }, [fetchRooms]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      checkIn: '',
      checkOut: '',
      capacity: '',
      roomType: '',
      priceRange: 0,
      sortBy: 'price_asc',
      availableOnly: false,
    });
    setSearchParams({});
  };

  const activeFilterCount = [
    filters.keyword,
    filters.roomType,
    filters.capacity,
    filters.priceRange > 0 ? 'price' : '',
    filters.availableOnly ? 'avail' : '',
  ].filter(Boolean).length;

  // ─── Filter Panel ────────────────────────────────────────────────────────
  const FilterPanel = () => (
    <aside className="w-full bg-white rounded-xl shadow-sm border border-stone-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
          🎛️ Bộ Lọc
          {activeFilterCount > 0 && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs text-red-500 hover:text-red-700 font-semibold underline underline-offset-2"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Loại phòng */}
      <FilterSection title="Loại Phòng">
        <div className="space-y-1">
          {ROOM_TYPES.map((t) => (
            <label
              key={t.value}
              htmlFor={`type-${t.value}`}
              className={`flex items-center gap-2.5 cursor-pointer py-1.5 px-2 rounded-lg ${filters.roomType === t.value
                ? 'bg-amber-50 text-amber-700'
                : 'text-stone-600'
                }`}
            >
              <input
                id={`type-${t.value}`}
                type="radio"
                name="roomType"
                value={t.value}
                checked={filters.roomType === t.value}
                onChange={() => updateFilter('roomType', t.value)}
                className="accent-amber-600"
              />
              <span className="text-sm font-medium">{t.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Khoảng giá */}
      <FilterSection title="Khoảng Giá">
        <div className="space-y-1">
          {PRICE_RANGES.map((pr, idx) => (
            <label
              key={idx}
              htmlFor={`price-${idx}`}
              className={`flex items-center gap-2.5 cursor-pointer py-1.5 px-2 rounded-lg ${filters.priceRange === idx
                ? 'bg-amber-50 text-amber-700'
                : 'text-stone-600'
                }`}
            >
              <input
                id={`price-${idx}`}
                type="radio"
                name="priceRange"
                checked={filters.priceRange === idx}
                onChange={() => updateFilter('priceRange', idx)}
                className="accent-amber-600"
              />
              <span className="text-sm font-medium">{pr.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Số khách */}
      <FilterSection title="Số Khách Tối Thiểu">
        <div className="grid grid-cols-3 gap-2">
          {['', '1', '2', '3', '4', '5'].map((n) => (
            <button
              key={n}
              onClick={() => updateFilter('capacity', n)}
              className={`py-1.5 rounded-lg text-xs font-semibold border ${filters.capacity === n
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600'
                }`}
            >
              {n === '' ? 'Tất cả' : `${n}+`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Trạng thái phòng */}
      <FilterSection title="Trạng Thái">
        <CheckboxOption
          id="available-only"
          label="Chỉ hiện phòng còn trống"
          checked={filters.availableOnly}
          onChange={(e) => updateFilter('availableOnly', e.target.checked)}
        />
      </FilterSection>
    </aside>
  );

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">

      {/* ── Search header bar ── */}
      <div className="bg-white border-b border-stone-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SearchBar
            compact
            initialValues={{
              keyword: filters.keyword,
              checkIn: filters.checkIn,
              checkOut: filters.checkOut,
              capacity: filters.capacity,
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Page title row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-stone-900">
              {filters.keyword
                ? `Kết quả cho "${filters.keyword}"`
                : 'Tất Cả Phòng Nghỉ'}
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${totalResults} phòng phù hợp`}
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-stone-500 hidden sm:block whitespace-nowrap">
                Sắp xếp:
              </label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="border border-stone-200 bg-white rounded-xl px-3 py-2 text-sm text-stone-700 outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 shadow-sm"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Active filter chips ── */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.keyword && (
              <FilterChip
                label={`Từ khóa: "${filters.keyword}"`}
                onRemove={() => updateFilter('keyword', '')}
              />
            )}
            {filters.roomType && (
              <FilterChip
                label={`Loại: ${ROOM_TYPES.find((t) => t.value === filters.roomType)?.label}`}
                onRemove={() => updateFilter('roomType', '')}
              />
            )}
            {filters.capacity && (
              <FilterChip
                label={`${filters.capacity}+ khách`}
                onRemove={() => updateFilter('capacity', '')}
              />
            )}
            {filters.priceRange > 0 && (
              <FilterChip
                label={PRICE_RANGES[filters.priceRange].label}
                onRemove={() => updateFilter('priceRange', 0)}
              />
            )}
            {filters.availableOnly && (
              <FilterChip
                label="Còn phòng trống"
                onRemove={() => updateFilter('availableOnly', false)}
              />
            )}
          </div>
        )}

        {/* ── Main grid: sidebar + results ── */}
        <div className="flex gap-6">

          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <div className="sticky top-36">
              <FilterPanel />
            </div>
          </div>

          {/* Results grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : rooms.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>

                {/* Pagination placeholder */}
                <div className="flex justify-center mt-10">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3].map((p) => (
                      <button
                        key={p}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold border ${p === 1
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button className="w-9 h-9 rounded-lg text-sm font-semibold bg-white border border-stone-200 text-stone-500 hover:border-amber-400">
                      →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
