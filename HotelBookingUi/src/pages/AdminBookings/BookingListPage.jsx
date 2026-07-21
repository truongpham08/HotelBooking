import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Search, Calendar, Home, Filter } from "lucide-react";
import axiosClient from "../../services/api/axiosClient";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get("/admin/bookings");
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axiosClient.put(`/admin/bookings/${id}/status`, { status: "APPROVED" });
      const updated = bookings.map((b) =>
        b.id === id ? { ...b, status: "APPROVED" } : b
      );
      setBookings(updated);
    } catch (error) {
      console.error("Failed to approve booking", error);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axiosClient.put(`/admin/bookings/${id}/status`, { status: "CANCELLED" });
      const updated = bookings.map((b) =>
        b.id === id ? { ...b, status: "CANCELLED" } : b
      );
      setBookings(updated);
    } catch (error) {
      console.error("Failed to cancel booking", error);
    }
  };

  const filteredBookings = bookings.filter((b) => 
    (b.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.roomName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50/50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Booking Management</h1>
          <p className="text-gray-500 mt-2">Manage customer reservations and room assignments</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all"
            />
          </div>
          <button className="p-2 border border-gray-200 bg-white rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Range</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">#{b.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                          {b.customerName ? b.customerName.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{b.customerName}</div>
                          <div className="text-xs text-gray-500">{b.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700 font-medium">
                        <Home className="w-4 h-4 mr-2 text-gray-400" />
                        {b.roomName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {b.checkInDate} <span className="mx-1 text-gray-400">→</span> {b.checkOutDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      {b.totalPrice ? b.totalPrice.toLocaleString() : "0"} VNĐ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        b.status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        b.status === "APPROVED" ? "bg-green-50 text-green-700 border-green-200" :
                        b.status === "COMPLETED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          b.status === "PENDING" ? "bg-yellow-500" :
                          b.status === "APPROVED" ? "bg-green-500" :
                          b.status === "COMPLETED" ? "bg-blue-500" :
                          "bg-red-500"
                        }`}></span>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {b.status === "PENDING" && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApprove(b.id)}
                            className="flex items-center justify-center p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl transition-all duration-200"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="flex items-center justify-center p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-200"
                            title="Cancel"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium text-gray-600">No bookings found</p>
                        <p className="text-sm">Try adjusting your search query</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;