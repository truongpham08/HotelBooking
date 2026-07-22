import axiosClient from './axiosClient';

const adminUserApi = {
  getUsers: (params = {}) => axiosClient.get('/admin/users', { params }),
  getUserById: (id) => axiosClient.get(`/admin/users/${id}`),
};

export default adminUserApi;
