
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../../components/home/SearchBar';
import RoomCard from '../../components/home/RoomCard';
import roomApi from '../../services/api/roomApi';

const DEFAULT_ROOM_TYPES = [
  { value: '', label: 'Tất cả loại phòng' },
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

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-6xl mb-4">!</div>
    <h3 className="text-xl font-bold text-stone-800 mb-2">Không thể tải danh sách phòng</h3>
    <p className="text-stone-500 text-sm max-w-sm mb-6">
      {message || 'Vui lòng kiểm tra backend và thử lại.'}
    </p>
    <button
      onClick={onRetry}
      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl shadow"
    >
      Thử Lại
    </button>
  </div>
);
// ─── Main SearchPage ──────────────────────────────────────────────────────────
const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(6);
  const [roomTypes, setRoomTypes] = useState(DEFAULT_ROOM_TYPES);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    capacity: searchParams.get('capacity') || '',
    roomType: searchParams.get('roomType') || '',
    priceRange: 0,
    sortBy: 'price_asc',
    availableOnly: false,
  });

  // ── Fetch rooms ────────────────────────────────────────────────────────────
  const fetchRooms = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setError('');
    try {
      const priceRange = PRICE_RANGES[filters.priceRange];
      const params = {
        keyword: filters.keyword || undefined,
        checkIn: filters.checkIn || undefined,
        checkOut: filters.checkOut || undefined,
        capacity: filters.capacity || undefined,
        roomType: filters.roomType || undefined,
        available: filters.availableOnly ? true : undefined,
        minPrice: priceRange?.min > 0 ? priceRange.min : undefined,
        maxPrice: Number.isFinite(priceRange?.max) ? priceRange.max : undefined,
        sortBy: filters.sortBy,
        page: currentPage,
        size: pageSize,
      };
      const data = await roomApi.getRooms(params);
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setRooms(list);
      setTotalResults(Number.isFinite(data?.totalElements) ? data.totalElements : list.length);
      setTotalPages(Number.isFinite(data?.totalPages) ? data.totalPages : 1);
      setCurrentPage(Number.isFinite(data?.page) ? data.page : currentPage);
    } catch {
      setRooms([]);
      setTotalResults(0);
      setError('Không kết nối được API phòng. Hãy đảm bảo backend đang chạy ở cổng 8080.');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const data = await roomApi.getRoomTypes();
        const types = Array.isArray(data) ? data : [];
        setRoomTypes([
          DEFAULT_ROOM_TYPES[0],
          ...types.filter((type) => type?.value && type?.label),
        ]);
      } catch {
        setRoomTypes(DEFAULT_ROOM_TYPES);
      }
    };

    fetchRoomTypes();
  }, []);
  useEffect(() => {

    fetchRooms();
  }, [fetchRooms]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const updateFilter = (key, value) => {
    setCurrentPage(0);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = (values, params) => {
    setCurrentPage(0);
    setFilters((prev) => ({
      ...prev,
      keyword: values.keyword,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      capacity: values.capacity,
      roomType: '',
    }));
    setSearchParams(params);
  };

  const resetFilters = () => {
    setCurrentPage(0);
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
          {roomTypes.map((t) => (
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
            onSearch={handleSearch}
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
                label={`Loại: ${roomTypes.find((t) => t.value === filters.roomType)?.label}`}
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
            ) : error ? (
              <ErrorState message={error} onRetry={fetchRooms} />
            ) : rooms.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-10">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
                        disabled={currentPage === 0}
                        className="w-9 h-9 rounded-lg text-sm font-semibold bg-white border border-stone-200 text-stone-500 hover:border-amber-400 disabled:opacity-40 disabled:hover:border-stone-200"
                      >
                        &lt;
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => index).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-lg text-sm font-semibold border ${page === currentPage
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-600'
                            }`}
                        >
                          {page + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="w-9 h-9 rounded-lg text-sm font-semibold bg-white border border-stone-200 text-stone-500 hover:border-amber-400 disabled:opacity-40 disabled:hover:border-stone-200"
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;





