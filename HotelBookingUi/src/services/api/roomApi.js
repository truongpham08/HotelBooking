
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


  getFeaturedRooms: () => {
    return axiosClient.get('/rooms', { params: { featured: true, size: 4 } });
  },
};

export default roomApi;
