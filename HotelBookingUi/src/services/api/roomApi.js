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

  /**
   * Thêm mới một phòng
   * @param {Object} roomData
   */
  createRoom: (roomData) => {
    return axiosClient.post('/rooms', roomData);
  },

  /**
   * Cập nhật thông tin phòng
   * @param {number|string} id
   * @param {Object} roomData
   */
  updateRoom: (id, roomData) => {
    return axiosClient.put(`/rooms/${id}`, roomData);
  },

  /**
   * Xóa một phòng
   * @param {number|string} id
   */
  deleteRoom: (id) => {
    return axiosClient.delete(`/rooms/${id}`);
  },
};

export default roomApi;
