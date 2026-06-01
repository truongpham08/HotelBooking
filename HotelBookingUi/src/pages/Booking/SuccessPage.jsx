import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('hotel_booking_confirmation');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.id === bookingId) {
        setBooking(parsed);
      }
    } catch {
      // ignore
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-stone-200 p-10 shadow-lg text-center max-w-xl">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">Không tìm thấy đặt phòng</h1>
          <p className="text-stone-600 mb-6">Thông tin đặt phòng đã hết hạn hoặc bạn chưa thực hiện giao dịch nào.</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-3xl bg-gold-600 px-6 py-3 text-white font-semibold hover:bg-gold-700 transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-[2rem] bg-white border border-stone-200 p-10 shadow-sm">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
              ✓
            </div>
            <h1 className="text-4xl font-extrabold text-stone-900">Đặt phòng thành công!</h1>
            <p className="mt-3 text-stone-500">Cám ơn bạn đã đặt phòng. Chúng tôi đã gửi xác nhận qua email.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.75rem] bg-stone-50 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-3">Mã đặt phòng</p>
              <p className="text-3xl font-bold text-stone-900">{booking.id}</p>
              <p className="mt-3 text-sm text-stone-600">Vui lòng lưu lại mã này để tra cứu và liên hệ hỗ trợ.</p>
            </div>
            <div className="rounded-[1.75rem] bg-stone-50 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-3">Khách hàng</p>
              <p className="font-semibold text-stone-900">{booking.customer.fullName}</p>
              <p className="text-sm text-stone-600">{booking.customer.email}</p>
              <p className="text-sm text-stone-600">{booking.customer.phone}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.75rem] bg-white border border-stone-200 p-6 shadow-sm">
              <p className="text-sm font-semibold text-stone-700 mb-4">Chi tiết phòng</p>
              <div className="space-y-3 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Phòng</span>
                  <span className="font-semibold text-stone-900">{booking.roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nhận phòng</span>
                  <span>{booking.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trả phòng</span>
                  <span>{booking.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số đêm</span>
                  <span>{booking.nights}</span>
                </div>
                <div className="flex justify-between">
                  <span>Khách</span>
                  <span>{booking.capacity} khách</span>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-white border border-stone-200 p-6 shadow-sm">
              <p className="text-sm font-semibold text-stone-700 mb-4">Hóa đơn</p>
              <div className="space-y-3 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatPrice(booking.subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí dịch vụ</span>
                  <span>{formatPrice(booking.serviceFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-stone-900 border-t border-stone-200 pt-3">
                  <span>Tổng</span>
                  <span>{formatPrice(booking.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-3xl border border-stone-200 px-6 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              Quay về trang chủ
            </Link>
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="inline-flex items-center justify-center rounded-3xl bg-gold-600 px-6 py-3 text-sm font-semibold text-white hover:bg-gold-700 transition"
            >
              Xem thêm phòng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
