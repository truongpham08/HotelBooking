import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import roomApi from '../../services/api/roomApi';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const parseNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const roomId = searchParams.get('roomId');
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialCapacity = searchParams.get('capacity') || '1';

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    paymentMethod: 'card',
    requests: '',
  });
  const [reservation, setReservation] = useState({
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    capacity: initialCapacity,
  });

  useEffect(() => {
    setReservation({
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
      capacity: initialCapacity,
    });
  }, [initialCheckIn, initialCheckOut, initialCapacity]);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await roomApi.getRoomById(roomId);
        if (response && response.id) {
          setRoom(response);
        } else {
          setError('Không tìm thấy thông tin phòng để thanh toán.');
        }
      } catch {
        setError('Không thể tải thông tin phòng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRoom();
    } else {
      setLoading(false);
      setError('Xin vui lòng chọn phòng trước khi tiến hành thanh toán.');
    }
  }, [roomId]);

  const nights = useMemo(
    () => parseNights(reservation.checkIn, reservation.checkOut),
    [reservation.checkIn, reservation.checkOut],
  );

  const subTotal = room ? room.pricePerNight * Math.max(1, nights) : 0;
  const serviceFee = Math.round(subTotal * 0.08);
  const totalAmount = subTotal + serviceFee;

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReservationChange = (event) => {
    const { name, value } = event.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!room) return;
    if (!reservation.checkIn || !reservation.checkOut || nights <= 0) {
      setError('Vui lòng chọn thời gian nhận và trả phòng hợp lệ.');
      return;
    }
    if (!form.fullName || !form.email || !form.phone) {
      setError('Vui lòng điền đầy đủ thông tin liên hệ.');
      return;
    }

    const booking = {
      id: `BOOK-${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      pricePerNight: room.pricePerNight,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      capacity: reservation.capacity,
      nights,
      subTotal,
      serviceFee,
      totalAmount,
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
      },
      paymentMethod: form.paymentMethod,
      requests: form.requests,
      createdAt: new Date().toISOString(),
    };

    sessionStorage.setItem('hotel_booking_confirmation', JSON.stringify(booking));
    navigate(`/success?bookingId=${booking.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl animate-pulse">
          <div className="h-20 rounded-3xl bg-stone-200 mb-6" />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="h-10 rounded-full bg-stone-200" />
              <div className="h-80 rounded-[2rem] bg-stone-200" />
            </div>
            <div className="space-y-4">
              <div className="h-80 rounded-[2rem] bg-stone-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link to={room ? `/room/${room.id}` : '/search'} className="text-sm text-gold-600 hover:text-gold-700 font-semibold">
            ← Quay về chi tiết phòng
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold text-stone-900">Thanh toán đặt phòng</h1>
          <p className="mt-2 text-sm text-stone-500">Hoàn tất đơn hàng và xác nhận chỗ nghỉ của bạn.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white border border-stone-200 p-8 shadow-sm">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-stone-900 mb-4">Thông tin khách hàng</h2>
              {error && (
                <div className="rounded-3xl bg-red-50 border border-red-200 p-4 mb-6 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-stone-700">Họ và tên</span>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleFormChange}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                    placeholder="Nguyễn Văn A"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-stone-700">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                    placeholder="email@domain.com"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-stone-700">Số điện thoại</span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                    placeholder="09xx xxx xxx"
                  />
                </label>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-stone-900 mb-4">Chi tiết đặt phòng</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="text-sm font-semibold text-stone-700">Ngày nhận</span>
                  <input
                    name="checkIn"
                    type="date"
                    value={reservation.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleReservationChange}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-stone-700">Ngày trả</span>
                  <input
                    name="checkOut"
                    type="date"
                    value={reservation.checkOut}
                    min={reservation.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={handleReservationChange}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-stone-700">Số khách</span>
                  <select
                    name="capacity"
                    value={reservation.capacity}
                    onChange={handleReservationChange}
                    className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{`${n} khách`}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block mt-6">
                <span className="text-sm font-semibold text-stone-700">Ghi chú yêu cầu đặc biệt</span>
                <textarea
                  name="requests"
                  value={form.requests}
                  onChange={handleFormChange}
                  rows={4}
                  className="mt-2 w-full rounded-3xl border border-stone-200 px-4 py-3 text-sm text-stone-900 outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
                  placeholder="Ví dụ: cần giường đôi, phòng tầng cao..."
                />
              </label>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-stone-900 mb-4">Phương thức thanh toán</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {['card', 'cash', 'transfer'].map((method) => (
                  <label
                    key={method}
                    className={`flex items-center gap-3 rounded-3xl border px-4 py-4 cursor-pointer transition ${form.paymentMethod === method
                      ? 'border-gold-500 bg-gold-50 text-stone-900'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={form.paymentMethod === method}
                      onChange={handleFormChange}
                      className="w-4 h-4 accent-gold-600"
                    />
                    <span className="font-semibold capitalize">
                      {method === 'card' ? 'Thẻ tín dụng' : method === 'cash' ? 'Thanh toán khi nhận' : 'Chuyển khoản'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-3xl bg-gold-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-gold-700 active:scale-[0.99]"
            >
              Xác nhận đặt phòng
            </button>
          </form>

          <div className="rounded-[2rem] bg-white border border-stone-200 p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-stone-900">Tóm tắt đơn hàng</h2>
              <p className="mt-2 text-sm text-stone-500">Kiểm tra lại thông tin trước khi thanh toán.</p>
            </div>

            <div className="space-y-4 text-sm text-stone-600">
              <div className="rounded-3xl bg-stone-50 p-5">
                <p className="font-semibold text-stone-800">Phòng</p>
                <p className="mt-2 text-sm text-stone-500">{room.name}</p>
              </div>
              <div className="rounded-3xl bg-stone-50 p-5">
                <div className="flex justify-between mb-2">
                  <span>Giá mỗi đêm</span>
                  <span>{formatPrice(room.pricePerNight)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số đêm</span>
                  <span>{nights || 1}</span>
                </div>
              </div>
              <div className="rounded-3xl bg-stone-50 p-5">
                <div className="flex justify-between mb-2">
                  <span>Tạm tính</span>
                  <span>{formatPrice(Math.max(subTotal, room.pricePerNight))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí dịch vụ</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
              </div>
              <div className="rounded-[2rem] bg-stone-900 p-5 text-white">
                <div className="flex justify-between text-sm opacity-80">Tổng thanh toán</div>
                <div className="mt-3 text-3xl font-extrabold">{formatPrice(totalAmount)}</div>
              </div>
            </div>

            <div className="mt-6 text-sm text-stone-500">
              <p className="font-semibold text-stone-800 mb-2">Lưu ý</p>
              <p>Hoàn tất đặt phòng ngay, chúng tôi sẽ giữ chỗ cho bạn trong thời gian ngắn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
