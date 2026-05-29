
import { Link } from 'react-router-dom';

const ROOM_TYPE_LABELS = {
  STANDARD: { label: 'Standard', color: 'bg-stone-100 text-stone-600' },
  DELUXE: { label: 'Deluxe', color: 'bg-amber-50 text-amber-700' },
  SUITE: { label: 'Suite', color: 'bg-gold-100 text-gold-700' },
  PRESIDENTIAL: { label: 'Presidential', color: 'bg-yellow-50 text-yellow-700' },
};

const RoomCard = ({ room }) => {
  const {
    id,
    name = 'Grand Deluxe Room',
    roomType = 'DELUXE',
    pricePerNight = 2500000,
    capacity = 2,
    area = 45,
    image,
    amenities = [],
    available = true,
  } = room || {};

  const typeInfo = ROOM_TYPE_LABELS[roomType] || ROOM_TYPE_LABELS.STANDARD;
  const imgSrc = image || '/room-deluxe.png';

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div
      id={`room-card-${id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = '/room-deluxe.png'; }}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeInfo.color} shadow-sm`}>
            {typeInfo.label}
          </span>
          {!available && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600 shadow-sm">
              Hết phòng
            </span>
          )}
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-stone-900 text-base leading-tight line-clamp-1">{name}</h3>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
          <span>👥 {capacity} khách</span>
          {area && <span>📐 {area}m²</span>}
          <span className="text-yellow-500 font-bold">★ 4.8</span>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenities.slice(0, 3).map((a, i) => (
              <span key={i} className="text-xs bg-stone-50 text-stone-600 border border-stone-100 px-2 py-0.5 rounded-full">
                {a}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="text-xs bg-stone-50 text-stone-400 border border-stone-100 px-2 py-0.5 rounded-full">
                +{amenities.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-xs text-stone-400">Giá từ</p>
            <p className="text-lg font-extrabold text-gold-600">{formatPrice(pricePerNight)}</p>
            <p className="text-xs text-stone-400">/ đêm</p>
          </div>
          <Link
            to={`/room/${id}`}
            className={`text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 ${available
                ? 'bg-gold-600 hover:bg-gold-700 text-white shadow hover:shadow-md active:scale-95'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed pointer-events-none'
              }`}
          >
            {available ? 'Đặt Ngay' : 'Hết Phòng'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
