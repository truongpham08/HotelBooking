import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import bookingApi from '../../services/api/bookingApi';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

const formatDate = (date) => date
  ? new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN')
  : '—';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingId) return setLoading(false);
      try {
        const response = await bookingApi.getBookingById(bookingId);
        if (response?.success) setBooking(response.data);
      } catch {
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [bookingId]);

  if (loading) return <div className="min-h-[60vh] grid place-items-center text-stone-500">Đang tải thông tin đặt phòng...</div>;

  if (!booking) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Không tìm thấy đặt phòng</h1>
          <p className="mt-2 text-stone-500">Thông tin đặt phòng không tồn tại hoặc đã hết hạn.</p>
          <Link to="/search" className="mt-5 inline-block rounded-md bg-gold-600 px-5 py-2.5 font-medium text-white">Tìm phòng</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-stone-50 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-lg border border-stone-200 bg-white p-6 sm:p-9">
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-700">✓</div>
            <h1 className="mt-4 text-3xl font-semibold text-stone-900">Đặt phòng thành công</h1>
            <p className="mt-2 text-stone-500">Xác nhận đã được gửi đến email của bạn.</p>
          </div>

          <div className="mt-7 rounded-md bg-stone-50 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-stone-500">Mã đặt phòng</p>
            <p className="mt-1 text-xl font-semibold text-stone-900">{booking.id}</p>
          </div>

          <div className="mt-7">
            <h2 className="font-semibold text-stone-900">Chi tiết đặt phòng</h2>
            <dl className="mt-3 divide-y divide-stone-200 text-sm">
              {[
                ['Phòng', booking.roomName],
                ['Khách hàng', booking.customer?.fullName],
                ['Nhận phòng', formatDate(booking.checkIn)],
                ['Trả phòng', formatDate(booking.checkOut)],
                ['Thời gian', `${booking.nights} đêm · ${booking.capacity} khách`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-3">
                  <dt className="text-stone-500">{label}</dt>
                  <dd className="text-right font-medium text-stone-800">{value || '—'}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 py-4 text-base">
                <dt className="font-semibold text-stone-900">Tổng thanh toán</dt>
                <dd className="font-semibold text-gold-700">{formatPrice(booking.totalAmount)}</dd>
              </div>
            </dl>
          </div>

          <p className="mt-4 text-center text-sm text-stone-500">Vui lòng lưu mã đặt phòng để tiện tra cứu khi nhận phòng.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="flex-1 rounded-md border border-stone-300 px-4 py-2.5 text-center font-medium text-stone-700 hover:bg-stone-50">Về trang chủ</Link>
            <Link to="/search" className="flex-1 rounded-md bg-gold-600 px-4 py-2.5 text-center font-medium text-white hover:bg-gold-700">Xem thêm phòng</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SuccessPage;
