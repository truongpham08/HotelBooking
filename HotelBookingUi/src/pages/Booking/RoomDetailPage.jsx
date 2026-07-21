import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import roomApi from '../../services/api/roomApi';
import { MOCK_ROOMS } from '../../services/mockRooms';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`);
  return Math.max(0, Math.floor(diff / 86400000));
};

const RoomDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    capacity: searchParams.get('capacity') || '1',
  });

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const response = await roomApi.getRoomById(id);
        setRoom(response?.id ? response : MOCK_ROOMS.find((item) => String(item.id) === String(id)));
      } catch {
        setRoom(MOCK_ROOMS.find((item) => String(item.id) === String(id)));
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [id]);

  const nights = useMemo(
    () => getNights(booking.checkIn, booking.checkOut),
    [booking.checkIn, booking.checkOut],
  );
  const canBook = room?.available && nights > 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBooking((current) => ({ ...current, [name]: value }));
  };

  const handleContinue = () => {
    const query = new URLSearchParams({ roomId: room.id, ...booking });
    navigate(`/checkout?${query.toString()}`);
  };

  if (loading) return <div className="min-h-[60vh] grid place-items-center text-stone-500">Đang tải phòng...</div>;

  if (!room) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-stone-900">Không tìm thấy phòng</h1>
          <p className="mt-2 text-stone-500">Phòng bạn chọn không tồn tại hoặc đã bị xoá.</p>
          <Link to="/search" className="mt-5 inline-block text-gold-700 font-medium">← Về danh sách phòng</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-stone-50 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4">
        <Link to="/search" className="text-sm font-medium text-stone-600 hover:text-gold-700">← Quay lại</Link>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <img
            src={room.image || '/room-deluxe.png'}
            alt={room.name}
            onError={(event) => { event.currentTarget.src = '/room-deluxe.png'; }}
            className="h-64 w-full rounded-lg object-cover sm:col-span-2 sm:h-80"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            {[0, 1].map((item) => (
              <img
                key={item}
                src={room.image || '/room-deluxe.png'}
                alt={`${room.name} ${item + 2}`}
                onError={(event) => { event.currentTarget.src = '/room-deluxe.png'; }}
                className="h-32 w-full rounded-lg object-cover sm:h-[154px]"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="border-b border-stone-200 pb-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-3xl font-semibold text-stone-900">{room.name}</h1>
                  <p className="mt-2 text-stone-500">{room.roomType} · {room.area} m² · Tối đa {room.capacity} khách</p>
                </div>
                <span className={`text-sm font-medium ${room.available ? 'text-emerald-700' : 'text-red-600'}`}>
                  {room.available ? 'Còn phòng' : 'Hết phòng'}
                </span>
              </div>
              <p className="mt-5 leading-7 text-stone-600">{room.description}</p>
            </div>

            <section className="border-b border-stone-200 py-6">
              <h2 className="text-xl font-semibold text-stone-900">Tiện ích</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-stone-600 sm:grid-cols-3">
                {room.amenities?.map((amenity) => <div key={amenity}>✓ {amenity}</div>)}
              </div>
            </section>

            <section className="py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-stone-900">Đánh giá</h2>
                <span className="font-semibold text-stone-800">4.8 / 5</span>
              </div>
              <div className="mt-4 space-y-4">
                {[
                  ['Minh Anh', 'Phòng sạch sẽ, nhân viên thân thiện và hỗ trợ nhanh.'],
                  ['Hoàng Nam', 'Không gian thoải mái, đúng như hình và vị trí thuận tiện.'],
                ].map(([name, review]) => (
                  <div key={name} className="border-t border-stone-200 pt-4">
                    <p className="font-medium text-stone-800">{name} <span className="ml-2 text-sm text-amber-500">★★★★★</span></p>
                    <p className="mt-1 text-sm text-stone-600">{review}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 lg:sticky lg:top-24">
            <p><span className="text-2xl font-semibold text-stone-900">{formatPrice(room.pricePerNight)}</span> <span className="text-sm text-stone-500">/ đêm</span></p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <label className="text-sm text-stone-700">Nhận phòng
                <input name="checkIn" type="date" value={booking.checkIn} onChange={handleChange} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
              </label>
              <label className="text-sm text-stone-700">Trả phòng
                <input name="checkOut" type="date" min={booking.checkIn || undefined} value={booking.checkOut} onChange={handleChange} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
              </label>
            </div>
            <label className="mt-3 block text-sm text-stone-700">Số khách
              <select name="capacity" value={booking.capacity} onChange={handleChange} className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2">
                {Array.from({ length: 6 }, (_, index) => index + 1).map((number) => <option key={number} value={number}>{number} khách</option>)}
              </select>
            </label>
            {nights > 0 && (
              <div className="mt-5 flex justify-between border-t border-stone-200 pt-4 text-sm">
                <span>{nights} đêm</span>
                <strong>{formatPrice(room.pricePerNight * nights)}</strong>
              </div>
            )}
            <button type="button" disabled={!canBook} onClick={handleContinue} className="mt-5 w-full rounded-md bg-gold-600 px-4 py-3 font-semibold text-white hover:bg-gold-700 disabled:cursor-not-allowed disabled:bg-stone-300">
              {room.available ? 'Đặt phòng' : 'Phòng đã hết'}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default RoomDetailPage;
