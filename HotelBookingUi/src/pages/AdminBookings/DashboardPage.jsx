import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    availableRooms: 0,
  });

  useEffect(() => {
    setStats({
      totalRevenue: 15000000,
      totalBookings: 120,
      availableRooms: 35,
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Revenue */}
        <div className="bg-white shadow-md rounded-2xl p-5">
          <h2 className="text-gray-500">Doanh thu</h2>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {stats.totalRevenue.toLocaleString()} VNĐ
          </p>
        </div>

        {/* Bookings */}
        <div className="bg-white shadow-md rounded-2xl p-5">
          <h2 className="text-gray-500">Số đơn</h2>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {stats.totalBookings}
          </p>
        </div>

        {/* Rooms */}
        <div className="bg-white shadow-md rounded-2xl p-5">
          <h2 className="text-gray-500">Phòng trống</h2>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {stats.availableRooms}
          </p>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;