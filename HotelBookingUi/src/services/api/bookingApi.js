import axiosClient from './axiosClient';

const bookingApi = {
  createBooking: (data) => {
    return axiosClient.post('/bookings', data);
  },
  getBookingById: (id) => {
    return axiosClient.get(`/bookings/${id}`);
  }
};

export default bookingApi;
