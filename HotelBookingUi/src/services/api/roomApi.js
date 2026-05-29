// File: src/services/api/roomApi.js
import axiosClient from './axiosClient';

const roomApi = {
  /**
   * Lấy danh sách phòng với bộ lọc
   * @param {Object} params - { keyword, roomType, minPrice, maxPrice, checkIn, checkOut, capacity, page, size }
   */
  getRooms: (params = {}) => {
    return axiosClient.get('/rooms', { params });
  },

  /**
   * Lấy chi tiết một phòng theo ID
   * @param {number|string} id
   */
  getRoomById: (id) => {
    return axiosClient.get(`/rooms/${id}`);
  },

  /**
   * Lấy danh sách phòng nổi bật (featured) cho trang chủ
   */
  getFeaturedRooms: () => {
    return axiosClient.get('/rooms', { params: { featured: true, size: 4 } });
  },
};

export default roomApi;
