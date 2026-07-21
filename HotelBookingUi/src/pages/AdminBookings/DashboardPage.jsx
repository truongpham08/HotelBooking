import { useEffect, useState } from "react";
import { TrendingUp, Users, Home } from "lucide-react";
import axiosClient from "../../services/api/axiosClient";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    availableRooms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get("/admin/dashboard/stats");
        setStats({
          totalRevenue: response.totalRevenue || 0,
          totalBookings: response.totalBookings || 0,
          availableRooms: response.availableRooms || 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50/50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Tổng Quan</h1>
        <p className="text-gray-500 mt-2">Chào mừng trở lại! Dưới đây là hoạt động của khách sạn hôm nay.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                <TrendingUp size={24} strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">+12.5%</span>
            </div>
            <h2 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">Tổng Doanh Thu</h2>
            <p className="text-3xl font-extrabold text-gray-900">
              {stats.totalRevenue.toLocaleString()} <span className="text-lg text-gray-500 font-medium">VNĐ</span>
            </p>
          </div>

          {/* Bookings */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <Users size={24} strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">+5.2%</span>
            </div>
            <h2 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">Tổng Lượt Đặt</h2>
            <p className="text-3xl font-extrabold text-gray-900">
              {stats.totalBookings}
            </p>
          </div>

          {/* Rooms */}
          <div className="bg-white/70 backdrop-blur-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                <Home size={24} strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Trống</span>
            </div>
            <h2 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-1">Phòng Trống</h2>
            <p className="text-3xl font-extrabold text-gray-900">
              {stats.availableRooms}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;