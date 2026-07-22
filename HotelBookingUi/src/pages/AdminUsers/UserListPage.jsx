import { useCallback, useEffect, useState } from 'react';
import { Eye, Search, Users, X } from 'lucide-react';
import adminUserApi from '../../services/api/adminUserApi';

const money = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency', currency: 'VND', maximumFractionDigits: 0,
}).format(value || 0);

const date = (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-';

const STATUS_LABELS = {
  PENDING: 'Chờ xác nhận', APPROVED: 'Đã xác nhận', CANCELLED: 'Đã hủy', COMPLETED: 'Hoàn thành',
};

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [submittedKeyword, setSubmittedKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminUserApi.getUsers({ keyword: submittedKeyword || undefined, page, size: 10 });
      setUsers(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  }, [page, submittedKeyword]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(0);
    setSubmittedKeyword(keyword.trim());
  };

  const openDetail = async (id) => {
    setDetailLoading(true);
    setError('');
    try {
      setDetail(await adminUserApi.getUserById(id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể tải chi tiết người dùng.');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.2em] text-amber-600'>Khách hàng</p>
          <h1 className='mt-1 text-3xl font-bold text-stone-900'>Quản lý người dùng</h1>
          <p className='mt-2 text-sm text-stone-500'>Chỉ hiển thị tài khoản khách hàng, không bao gồm quản trị viên.</p>
        </div>
        <div className='flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm'>
          <Users className='h-5 w-5 text-amber-600' />
          <div><p className='text-xs text-stone-500'>Tổng người dùng</p><p className='text-xl font-bold'>{totalElements}</p></div>
        </div>
      </div>

      <form onSubmit={handleSearch} className='flex gap-2 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400' />
          <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder='Tìm theo tên, email hoặc số điện thoại' className='w-full rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 outline-none focus:border-amber-500' />
        </div>
        <button className='rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-bold text-white'>Tìm kiếm</button>
      </form>

      {error && <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>{error}</div>}

      <div className='overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-stone-50 text-xs uppercase tracking-wider text-stone-500'>
              <tr><th className='px-5 py-4'>Người dùng</th><th className='px-5 py-4'>Liên hệ</th><th className='px-5 py-4'>Địa chỉ</th><th className='px-5 py-4'>Ngày tạo</th><th className='px-5 py-4 text-right'>Thao tác</th></tr>
            </thead>
            <tbody className='divide-y divide-stone-100'>
              {loading ? <tr><td colSpan='5' className='px-5 py-12 text-center'>Đang tải...</td></tr>
                : users.length === 0 ? <tr><td colSpan='5' className='px-5 py-12 text-center'>Không tìm thấy người dùng.</td></tr>
                  : users.map((user) => (
                    <tr key={user.id} className='hover:bg-stone-50/70'>
                      <td className='px-5 py-4'><p className='font-bold'>{user.fullName}</p><p className='text-xs text-stone-400'>ID #{user.id}</p></td>
                      <td className='px-5 py-4'><p>{user.email}</p><p className='text-xs text-stone-500'>{user.phone || 'Chưa cập nhật'}</p></td>
                      <td className='max-w-xs px-5 py-4 text-stone-600'>{user.address || 'Chưa cập nhật'}</td>
                      <td className='px-5 py-4 text-stone-600'>{date(user.createdAt)}</td>
                      <td className='px-5 py-4 text-right'>
                        <button disabled={detailLoading} onClick={() => openDetail(user.id)} className='inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 font-semibold hover:border-amber-400 hover:text-amber-700 disabled:opacity-50'><Eye className='h-4 w-4' /> Xem chi tiết</button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <div className='flex justify-between border-t px-5 py-4'><span className='text-xs text-stone-500'>Trang {page + 1} / {totalPages}</span><div className='flex gap-2'><button disabled={page === 0} onClick={() => setPage(page - 1)} className='rounded-lg border px-3 py-1.5 disabled:opacity-40'>Trước</button><button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className='rounded-lg border px-3 py-1.5 disabled:opacity-40'>Sau</button></div></div>}
      </div>

      {detail && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 p-4'>
          <div className='max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl'>
            <div className='flex items-start justify-between border-b pb-5'>
              <div><h2 className='text-2xl font-bold'>{detail.user.fullName}</h2><p className='text-sm text-stone-500'>Thông tin tài khoản và lịch sử đặt phòng</p></div>
              <button onClick={() => setDetail(null)} className='rounded-lg p-2 hover:bg-stone-100'><X className='h-5 w-5' /></button>
            </div>
            <div className='grid gap-4 border-b py-5 sm:grid-cols-2 lg:grid-cols-4'>
              <div><p className='text-xs font-bold uppercase text-stone-400'>Email</p><p className='mt-1'>{detail.user.email}</p></div>
              <div><p className='text-xs font-bold uppercase text-stone-400'>Số điện thoại</p><p className='mt-1'>{detail.user.phone || 'Chưa cập nhật'}</p></div>
              <div><p className='text-xs font-bold uppercase text-stone-400'>Địa chỉ</p><p className='mt-1'>{detail.user.address || 'Chưa cập nhật'}</p></div>
              <div><p className='text-xs font-bold uppercase text-stone-400'>Ngày đăng ký</p><p className='mt-1'>{date(detail.user.createdAt)}</p></div>
            </div>
            <h3 className='mb-3 mt-5 text-lg font-bold'>Lịch sử booking ({detail.bookings.length})</h3>
            <div className='overflow-x-auto rounded-xl border'>
              <table className='w-full text-left text-sm'>
                <thead className='bg-stone-50 text-xs uppercase text-stone-500'><tr><th className='px-4 py-3'>Mã</th><th className='px-4 py-3'>Phòng</th><th className='px-4 py-3'>Nhận / trả</th><th className='px-4 py-3'>Tổng tiền</th><th className='px-4 py-3'>Trạng thái</th></tr></thead>
                <tbody className='divide-y'>
                  {detail.bookings.length === 0 ? <tr><td colSpan='5' className='px-4 py-10 text-center text-stone-500'>Tài khoản chưa có booking.</td></tr>
                    : detail.bookings.map((booking) => <tr key={booking.id}><td className='px-4 py-3 font-semibold'>#{booking.id}</td><td className='px-4 py-3'>{booking.roomName}</td><td className='px-4 py-3'>{date(booking.checkInDate)} – {date(booking.checkOutDate)}</td><td className='px-4 py-3 font-semibold'>{money(booking.totalAmount)}</td><td className='px-4 py-3'>{STATUS_LABELS[booking.status] || booking.status}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
