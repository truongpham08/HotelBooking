
import axiosClient from './axiosClient';

const roomApi = {
  /**
  
   * @param {Object}
   */
  getRooms: (params = {}) => {
    return axiosClient.get('/rooms', { params });
  },

  /**
   
   * @param {number|string} id
   */
  getRoomById: (id) => {
    return axiosClient.get(`/rooms/${id}`);
  },

  createRoom: (data) => {
    return axiosClient.post('/rooms', data);
  },

  updateRoom: (id, data) => {
    return axiosClient.put(`/rooms/${id}`, data);
  },

  deleteRoom: (id) => {
    return axiosClient.delete(`/rooms/${id}`);
  },


  getFeaturedRooms: () => {
    return axiosClient.get('/rooms', { params: { featured: true, page: 0, size: 4 } });
  },

  getRoomTypes: () => {
    return axiosClient.get('/rooms/types');
  },
};

export default roomApi;


