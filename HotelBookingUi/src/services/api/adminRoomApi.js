import axiosClient from './axiosClient';

const adminRoomApi = {
  getRooms: (params = {}) => axiosClient.get('/admin/rooms', { params }),
  getRoomById: (id) => axiosClient.get(`/admin/rooms/${id}`),
  getRoomTypes: () => axiosClient.get('/admin/rooms/types'),
  createRoom: (data) => axiosClient.post('/admin/rooms', data),
  updateRoom: (id, data) => axiosClient.put(`/admin/rooms/${id}`, data),
  deleteRoom: (id) => axiosClient.delete(`/admin/rooms/${id}`),
};

export default adminRoomApi;
