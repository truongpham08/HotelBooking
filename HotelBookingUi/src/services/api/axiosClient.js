// File: src/services/api/axiosClient.js
import axios from 'axios';

// Khởi tạo instance của axios
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/hotel-booking/api', // URL API backend mặc định
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Thời gian timeout tối đa: 10s
});

// Interceptor xử lý Request: tự động gắn Token JWT vào header nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('hotel_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Lỗi phân tích token:', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor xử lý Response: gom dữ liệu hoặc bắt các lỗi hệ thống 401, 403, 500
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi tự động (ví dụ: tự động logout nếu token hết hạn - lỗi 401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('hotel_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

