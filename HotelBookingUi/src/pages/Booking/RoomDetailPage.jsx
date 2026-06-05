import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import roomApi from '../../services/api/roomApi';
import { MOCK_ROOMS } from '../../services/mockRooms';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const formatDate = (value) => {
  if (!value) return 'Chưa chọn';
  return new Date(`${value}T00:00:00`).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getMockRoom = (roomId) =>
  MOCK_ROOMS.find((room) => String(room.id) === String(roomId));

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const buildQueryString = (params) => new URLSearchParams(params).toString();

const RoomDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    capacity: searchParams.get('capacity') || '1',
  });

  useEffect(() => {
    setBookingData({
      checkIn: searchParams.get('checkIn') || '',
      checkOut: searchParams.get('checkOut') || '',
      capacity: searchParams.get('capacity') || '1',
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await roomApi.getRoomById(id);
        if (response && response.id) {
          setRoom(response);
        } else {
          const fallback = getMockRoom(id);
          if (fallback) {
            setRoom(fallback);
          } else {
            setError('Không tìm thấy thông tin phòng.');
          }
        }
      } catch (err) {
        const fallback = getMockRoom(id);
        if (fallback) {
          setRoom(fallback);
        } else {
          setError('Không thể tải dữ liệu phòng. Vui lòng thử lại sau.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const nights = useMemo(
    () => getNights(bookingData.checkIn, bookingData.checkOut),
    [bookingData.checkIn, bookingData.checkOut],
  );

  const totalPrice = room ? room.pricePerNight * Math.max(1, nights) : 0;
  const canBook = room?.available && bookingData.checkIn && bookingData.checkOut && nights > 0;

  const handleBookingChange = (event) => {
    const { name, value } = event.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    if (!canBook || !room) return;
    navigate(
      `/checkout?${buildQueryString({
        roomId: room.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        capacity: bookingData.capacity,
      })}`,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl animate-pulse">
          <div className="h-72 rounded-[2rem] bg-stone-200 mb-6" />
          <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded-full bg-stone-200" />
              <div className="h-6 w-1/2 rounded-full bg-stone-200" />
              <div className="h-44 rounded-[1.5rem] bg-stone-200" />
              <div className="h-24 rounded-[1.5rem] bg-stone-200" />
            </div>
            <div className="space-y-4">
              <div className="h-80 rounded-[1.5rem] bg-stone-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg border border-stone-200 p-10 text-center max-w-xl">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">Lỗi tải phòng</h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <Link
            to="/search"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gold-600 text-white font-semibold hover:bg-gold-700 transition"
          >
            Quay về danh sách phòng
          </Link>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg border border-stone-200 p-10 text-center max-w-xl">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">Không tìm thấy phòng</h1>
          <p className="text-stone-600 mb-6">Phòng bạn yêu cầu có thể đã bị xóa hoặc không tồn tại.</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gold-600 text-white font-semibold hover:bg-gold-700 transition"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Link to="/search" className="text-sm text-gold-600 hover:text-gold-700 font-semibold">
              ← Quay về tìm kiếm
            </Link>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-stone-900">{room.name}</h1>
            <p className="mt-2 text-sm text-stone-500">
              {room.capacity} khách · {room.area}m² · {room.roomType}
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-stone-200 px-6 py-4 shadow-sm">
            <p className="text-sm text-stone-500">Giá từ</p>
            <p className="text-3xl font-extrabold text-gold-600">{formatPrice(room.pricePerNight)}</p>
            <p className="text-sm text-stone-400">/ đêm</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
          <section className="space-y-8">
            <div className="rounded-[2rem] overflow-hidden shadow-lg border border-stone-200 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-3">
                <img
                  src={room.image || '/room-deluxe.png'}
                  alt={room.name}
                  className="h-96 w-full object-cover"
                  onError={(e) => { e.target.src = '/room-deluxe.png'; }}
                />
                <img
                  src={room.image || '/room-deluxe.png'}
                  alt={room.name}
                  className="h-96 w-full object-cover"
                  onError={(e) => { e.target.src = '/room-deluxe.png'; }}
                />
              </div>
            </div>

            <div className="rounded-[2rem] bg-white border border-stone-200 p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900">Mô tả phòng</h2>
                  <p className="mt-2 text-sm text-stone-500">Chi tiết dịch vụ và tiện ích cho chuyến nghỉ của bạn.</p>
                </div>
                {!room.available && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                    Hết phòng
                  </span>
                )}
              </div>

              <p className="text-stone-600 leading-relaxed">{room.description}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-stone-50 p-5">
                  <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-[0.16em] mb-3">Tiện ích</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
                      <span key={amenity} className="text-xs bg-white border border-stone-200 px-3 py-2 rounded-2xl text-stone-600">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl bg-stone-50 p-5">
                  <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-[0.16em] mb-3">Nội dung đặt phòng</h3>
                  <ul className="space-y-3 text-sm text-stone-600">
                    <li>• Check-in từ 14:00, check-out trước 12:00</li>
                    <li>• Hủy miễn phí trước 24 giờ</li>
                    <li>• Miễn phí WiFi tốc độ cao</li>
                    <li>• Dọn phòng hàng ngày</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-white border border-stone-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Đặt phòng nhanh</h2>
                  <p className="text-sm text-stone-500">Chọn ngày và số khách để tiếp tục.</p>
                </div>
                <span className={`text-sm font-semibold ${room.available ? 'text-green-600' : 'text-red-600'}`}>
                  {room.available ? 'Còn phòng' : 'Hết phòng'}
                </span>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-stone-700">Ngày nhận phòng</label>
                <input
                  name="checkIn"
                  type="date"
                  value={bookingData.checkIn}
                  onChange={handleBookingChange}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-800 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                />

                <label className="block text-sm font-medium text-stone-700">Ngày trả phòng</label>
                <input
                  name="checkOut"
                  type="date"
                  value={bookingData.checkOut}
                  min={bookingData.checkIn || undefined}
                  onChange={handleBookingChange}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-800 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                />

                <label className="block text-sm font-medium text-stone-700">Số khách</label>
                <select
                  name="capacity"
                  value={bookingData.capacity}
                  onChange={handleBookingChange}
                  className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-800 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{`${n} khách`}</option>
                  ))}
                </select>
              </div>

              <div className="mt-6 rounded-3xl bg-stone-50 p-5 text-sm text-stone-600">
                <p className="font-semibold text-stone-800">Tóm tắt</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Ngày nhận</span>
                    <span>{formatDate(bookingData.checkIn)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày trả</span>
                    <span>{formatDate(bookingData.checkOut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số đêm</span>
                    <span>{nights || 'Chưa chọn'}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-stone-900 pt-3 border-t border-stone-200">
                    <span>Tổng tạm tính</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={!canBook}
                onClick={handleContinue}
                className={`w-full rounded-3xl px-5 py-3 text-sm font-bold transition ${canBook
                  ? 'bg-gold-600 text-white hover:bg-gold-700 shadow-lg'
                  : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                }`}
              >
                Tiếp tục đặt phòng
              </button>
            </div>

            <div className="rounded-[2rem] bg-white border border-stone-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-[0.16em] mb-4">Lựa chọn khác</h3>
              <div className="space-y-3 text-sm text-stone-600">
                <div className="rounded-3xl bg-stone-50 p-4">
                  <p className="font-semibold text-stone-900">Nhận phòng</p>
                  <p>14:00 trở đi</p>
                </div>
                <div className="rounded-3xl bg-stone-50 p-4">
                  <p className="font-semibold text-stone-900">Trả phòng</p>
                  <p>Trước 12:00</p>
                </div>
                <div className="rounded-3xl bg-stone-50 p-4">
                  <p className="font-semibold text-stone-900">Thanh toán an toàn</p>
                  <p>Hỗ trợ nhiều hình thức.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;
