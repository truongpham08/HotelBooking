import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import roomApi from '../../services/api/roomApi';
import bookingApi from '../../services/api/bookingApi';
import { MOCK_ROOMS } from '../../services/mockRooms';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  return Math.max(0, Math.floor((new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`)) / 86400000));
};

const fieldClass = 'mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-stone-900 outline-none focus:border-gold-600 focus:ring-1 focus:ring-gold-600';
const createBookingId = () => `BOOK-${Date.now()}`;

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const roomId = searchParams.get('roomId');
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reservation, setReservation] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    capacity: searchParams.get('capacity') || '1',
  });
  const [form, setForm] = useState({
    fullName: user?.name || '', email: user?.email || '', phone: '', paymentMethod: 'cash', requests: '',
  });

  useEffect(() => {
    const loadRoom = async () => {
      if (!roomId) {
        setError('Vui lòng chọn phòng trước khi đặt.');
        setLoading(false);
        return;
      }
      try {
        const response = await roomApi.getRoomById(roomId);
        setRoom(response?.id ? response : MOCK_ROOMS.find((item) => String(item.id) === roomId));
      } catch {
        setRoom(MOCK_ROOMS.find((item) => String(item.id) === roomId));
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [roomId]);

  const nights = useMemo(() => getNights(reservation.checkIn, reservation.checkOut), [reservation]);
  const subTotal = room ? room.pricePerNight * nights : 0;
  const serviceFee = Math.round(subTotal * 0.08);
  const totalAmount = subTotal + serviceFee;

  const update = (setter) => (event) => {
    const { name, value } = event.target;
    setter((current) => ({ ...current, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!room || nights <= 0) return setError('Ngày trả phòng phải sau ngày nhận phòng.');
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) return setError('Vui lòng điền đầy đủ thông tin liên hệ.');

    const booking = {
      id: createBookingId(), roomId: room.id, roomName: room.name, pricePerNight: room.pricePerNight,
      ...reservation, nights, subTotal, serviceFee, totalAmount,
      customer: { fullName: form.fullName, email: form.email, phone: form.phone },
      paymentMethod: form.paymentMethod, requests: form.requests, createdAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      const response = await bookingApi.createBooking(booking);
      if (response?.success) navigate(`/success?bookingId=${response.data.id}`);
      else setError(response?.message || 'Không thể hoàn tất đặt phòng.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể kết nối đến máy chủ.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] grid place-items-center text-stone-500">Đang tải thông tin...</div>;
  if (!room) return <div className="min-h-[60vh] grid place-items-center text-center"><div><p className="text-stone-600">{error || 'Không tìm thấy phòng.'}</p><Link to="/search" className="mt-4 inline-block font-medium text-gold-700">Chọn phòng khác</Link></div></div>;

  return (
    <main className="bg-stone-50 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Link to={`/room/${room.id}`} className="text-sm font-medium text-stone-600 hover:text-gold-700">← Chi tiết phòng</Link>
        <h1 className="mt-4 text-3xl font-semibold text-stone-900">Thông tin đặt phòng</h1>
        <p className="mt-1 text-stone-500">Điền thông tin bên dưới để hoàn tất.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="rounded-lg border border-stone-200 bg-white p-5 sm:p-7">
            {error && <p className="mb-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <section>
              <h2 className="text-lg font-semibold text-stone-900">Thông tin liên hệ</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm text-stone-700">Họ và tên *<input required name="fullName" value={form.fullName} onChange={update(setForm)} className={fieldClass} placeholder="Nguyễn Văn A" /></label>
                <label className="text-sm text-stone-700">Email *<input required name="email" type="email" value={form.email} onChange={update(setForm)} className={fieldClass} placeholder="email@example.com" /></label>
                <label className="text-sm text-stone-700 sm:col-span-2">Số điện thoại *<input required name="phone" type="tel" value={form.phone} onChange={update(setForm)} className={fieldClass} placeholder="09xx xxx xxx" /></label>
              </div>
            </section>

            <section className="mt-7 border-t border-stone-200 pt-6">
              <h2 className="text-lg font-semibold text-stone-900">Thời gian lưu trú</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <label className="text-sm text-stone-700">Nhận phòng<input required name="checkIn" type="date" value={reservation.checkIn} onChange={update(setReservation)} className={fieldClass} /></label>
                <label className="text-sm text-stone-700">Trả phòng<input required name="checkOut" type="date" min={reservation.checkIn || undefined} value={reservation.checkOut} onChange={update(setReservation)} className={fieldClass} /></label>
                <label className="text-sm text-stone-700">Số khách<select name="capacity" value={reservation.capacity} onChange={update(setReservation)} className={fieldClass}>{Array.from({ length: 6 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} khách</option>)}</select></label>
              </div>
            </section>

            <section className="mt-7 border-t border-stone-200 pt-6">
              <h2 className="text-lg font-semibold text-stone-900">Thanh toán</h2>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                {[['cash', 'Thanh toán tại khách sạn'], ['transfer', 'Chuyển khoản'], ['card', 'Thẻ tín dụng']].map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-sm text-stone-700"><input type="radio" name="paymentMethod" value={value} checked={form.paymentMethod === value} onChange={update(setForm)} className="accent-gold-600" />{label}</label>
                ))}
              </div>
              <label className="mt-5 block text-sm text-stone-700">Yêu cầu thêm (không bắt buộc)<textarea name="requests" rows="3" value={form.requests} onChange={update(setForm)} className={fieldClass} placeholder="Ví dụ: phòng tầng cao..." /></label>
            </section>
          </div>

          <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 lg:sticky lg:top-24">
            <img src={room.image || '/room-deluxe.png'} alt={room.name} className="h-36 w-full rounded-md object-cover" />
            <h2 className="mt-4 font-semibold text-stone-900">{room.name}</h2>
            <div className="mt-5 space-y-3 border-t border-stone-200 pt-4 text-sm text-stone-600">
              <div className="flex justify-between"><span>{nights || 0} đêm</span><span>{formatPrice(subTotal)}</span></div>
              <div className="flex justify-between"><span>Phí dịch vụ</span><span>{formatPrice(serviceFee)}</span></div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900"><span>Tổng cộng</span><span>{formatPrice(totalAmount)}</span></div>
            </div>
            <button type="submit" disabled={submitting} className="mt-5 w-full rounded-md bg-gold-600 px-4 py-3 font-semibold text-white hover:bg-gold-700 disabled:bg-stone-400">{submitting ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}</button>
            <p className="mt-3 text-center text-xs text-stone-500">Thông tin của bạn được bảo mật.</p>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
