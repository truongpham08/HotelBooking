import axiosClient from './axiosClient';

const authApi = {
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },
  getProfile: () => {
    return axiosClient.get('/auth/profile');
  }
};

export default authApi;
