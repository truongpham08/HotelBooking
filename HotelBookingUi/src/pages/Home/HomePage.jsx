
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/home/SearchBar';
import RoomCard from '../../components/home/RoomCard';
import roomApi from '../../services/api/roomApi';


const MOCK_FEATURED_ROOMS = [
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
    available: true,
  },
];

const AMENITIES_ICONS = [
  { icon: '🏊', label: 'Hồ bơi' },
  { icon: '🍽️', label: 'Nhà hàng' },
  { icon: '☕', label: 'Ăn sáng miễn phí' },
  { icon: '🚗', label: 'Bãi đỗ xe' },
  { icon: '📶', label: 'WiFi miễn phí' },
  { icon: '🧺', label: 'Giặt ủi' },
];

const TESTIMONIALS = [
  {
    name: 'Nguyễn Minh Tuấn',
    role: 'Khách lưu trú',
    avatar: '👨‍💼',
    content: 'Phòng sạch sẽ, thoải mái, nhân viên thân thiện. Giá cả hợp lý, xứng đáng với số tiền bỏ ra. Sẽ quay lại!',
    rating: 5,
  },
  {
    name: 'Trần Thị Lan',
    role: 'Khách du lịch',
    avatar: '👩‍🦱',
    content: 'Vị trí thuận tiện, gần biển, ăn sáng ngon. Phòng không quá rộng nhưng đầy đủ tiện nghi cần thiết.',
    rating: 4,
  },
  {
    name: 'Lê Văn Hùng',
    role: 'Gia đình 4 người',
    avatar: '👨‍👩‍👧‍👦',
    content: 'Đặt phòng gia đình, không gian thoải mái cho cả nhà. Nhân viên hỗ trợ nhiệt tình, check-in nhanh.',
    rating: 5,
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await roomApi.getFeaturedRooms();
        const rooms = Array.isArray(data) ? data : (data?.content || data?.data || []);
        setFeaturedRooms(rooms.length > 0 ? rooms : MOCK_FEATURED_ROOMS);
      } catch {
        setFeaturedRooms(MOCK_FEATURED_ROOMS);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">

      {/* ──── HERO BANNER ──────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative flex items-center justify-center"
        style={{
          minHeight: '60vh',
          backgroundImage: 'url(/hero-banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex flex-col items-center px-4 text-center w-full max-w-5xl mx-auto py-16">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-serif text-white leading-tight mb-4 drop-shadow-lg">
            Nghỉ Ngơi Thoải Mái
            <br />
            <span className="text-yellow-300">Tại Grand Harbor</span>
          </h1>

          <p className="text-stone-200 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            Phòng sạch sẽ, tiện nghi đầy đủ, vị trí trung tâm ngay tại Đà Nẵng.
            Đặt phòng dễ dàng – giá hợp lý – phục vụ tận tâm.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-4xl">
            <SearchBar />
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-8 text-white/80 text-sm">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-yellow-300">50+</p>
              <p className="text-xs">Phòng nghỉ</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-yellow-300">2K+</p>
              <p className="text-xs">Lượt khách</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-yellow-300">4.6★</p>
              <p className="text-xs">Đánh giá trung bình</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-yellow-300">5+</p>
              <p className="text-xs">Năm hoạt động</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──── FEATURED ROOMS ───────────────────────────────────────────────── */}
      <section id="featured-rooms" className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-xs uppercase tracking-widest mb-2">
              Phòng Được Chọn Nhiều
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 mb-3">
              Phòng Nổi Bật
            </h2>
            <p className="text-stone-500 max-w-lg mx-auto text-sm leading-relaxed">
              Những căn phòng sạch sẽ, thoáng mát và được khách hàng đặt nhiều nhất tại Grand Harbor.
            </p>
          </div>

          {loadingRooms ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md">
                  <div className="h-52 bg-stone-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-100 rounded w-1/2" />
                    <div className="h-8 bg-stone-200 rounded w-1/3 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              id="view-all-rooms-btn"
              to="/search"
              className="inline-flex items-center gap-2 bg-white border-2 border-amber-500 text-amber-700 hover:bg-amber-50 font-bold px-8 py-3 rounded-xl text-sm shadow"
            >
              Xem Tất Cả Phòng
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ──── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section id="why-us" className="py-14 px-4 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-2">
              Tại Sao Chọn Chúng Tôi
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white mb-3">
              Tiện Nghi Đầy Đủ, Giá Hợp Lý
            </h2>
            <p className="text-stone-400 max-w-lg mx-auto text-sm leading-relaxed">
              Grand Harbor mang đến không gian nghỉ ngơi sạch sẽ, thoải mái với đầy đủ tiện nghi cần thiết.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {AMENITIES_ICONS.map((item, idx) => (
              <div
                key={idx}
                className="text-center p-5 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-white/80 text-xs font-medium leading-tight">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: '🔒',
                title: 'Đặt Phòng Dễ Dàng',
                desc: 'Đặt phòng online nhanh chóng, thanh toán an toàn, nhận xác nhận ngay qua email.',
              },
              {
                icon: '💰',
                title: 'Giá Cả Hợp Lý',
                desc: 'Mức giá phù hợp với nhiều đối tượng khách hàng. Không phát sinh phí ẩn.',
              },
              {
                icon: '📞',
                title: 'Hỗ Trợ Tận Tâm',
                desc: 'Đội ngũ lễ tân luôn sẵn sàng hỗ trợ trong giờ làm việc và cả buổi tối.',
              },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="text-white font-bold mt-3 mb-2">{f.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-600 font-semibold text-xs uppercase tracking-widest mb-2">
              Khách Hàng Nói Gì
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-stone-900 mb-3">
              Nhận Xét Của Khách
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-stone-100 rounded-xl p-6 shadow-sm flex flex-col"
              >
                <div className="flex text-yellow-400 text-base mb-4">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed italic flex-1 mb-5">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <p className="font-bold text-stone-900 text-sm">{t.name}</p>
                    <p className="text-xs text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA BANNER ───────────────────────────────────────────────────── */}
      <section id="cta" className="py-14 px-4 bg-amber-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white mb-4">
            Đặt Phòng Ngay Hôm Nay?
          </h2>
          <p className="text-white/85 text-sm mb-8 leading-relaxed">
            Tìm phòng phù hợp, đặt nhanh chóng và tận hưởng kỳ nghỉ thoải mái tại Grand Harbor!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              id="cta-book-btn"
              to="/search"
              className="bg-white text-amber-700 font-bold px-8 py-3 rounded-xl hover:bg-stone-100 shadow-md"
            >
              Đặt Phòng Ngay
            </Link>
            <a
              href="tel:18001234"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10"
            >
              📞 1800 1234
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
