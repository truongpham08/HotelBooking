import { useEffect, useState } from "react";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const fetchBookings = () => {
    setLoading(true);

    setTimeout(() => {
      setBookings([
        {
          id: 1,
          customerName: "Nguyễn Văn A",
          roomName: "101",
          date: "2025-05-01",
          status: "PENDING",
        },
        {
          id: 2,
          customerName: "Trần Thị B",
          roomName: "202",
          date: "2025-05-02",
          status: "APPROVED",
        },
        {
          id: 3,
          customerName: "Lê Văn C",
          roomName: "303",
          date: "2025-05-03",
          status: "CANCELLED",
        },
      ]);

      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 
  const handleApprove = (id) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "APPROVED" } : b
    );
    setBookings(updated);
  };


  const handleCancel = (id) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "CANCELLED" } : b
    );
    setBookings(updated);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Danh sách đơn đặt phòng
      </h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Khách hàng</th>
                <th className="p-3 text-left">Phòng</th>
                <th className="p-3 text-left">Ngày</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-left">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.customerName}</td>
                  <td className="p-3">{b.roomName}</td>
                  <td className="p-3">{b.date}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-sm text-white rounded ${
                        b.status === "PENDING"
                          ? "bg-yellow-500"
                          : b.status === "APPROVED"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleApprove(b.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Duyệt
                    </button>

                    <button
                      onClick={() => handleCancel(b.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Hủy
                    </button>
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookingList;