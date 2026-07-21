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
  },
  updateProfile: (data) => {
    return axiosClient.put('/auth/profile', data);
  },
  changePassword: (data) => {
    return axiosClient.put('/auth/password', data);
  },
  getMyBookings: () => {
    return axiosClient.get('/bookings/my-bookings');
  },
  forgotPassword: (data) => {
    return axiosClient.post('/auth/forgot-password', data);
  }
};

export default authApi;
