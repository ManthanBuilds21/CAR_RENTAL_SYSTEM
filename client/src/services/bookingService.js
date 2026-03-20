// ============================================================
//  bookingService.js
//  Path: client/src/services/bookingService.js
//  No style changes needed — pure API service, no UI.
// ============================================================

import API from './api';

const bookingService = {
  createBooking: async (bookingData) => {
    const { data } = await API.post('/bookings', bookingData);
    return data.data;
  },
  getAllBookings: async (params = {}) => {
    const { data } = await API.get('/bookings', { params });
    return data;
  },
  getUserBookings: async () => {
    const { data } = await API.get('/bookings/user');
    return data.data;
  },
  getBookingById: async (id) => {
    const { data } = await API.get(`/bookings/${id}`);
    return data.data;
  },
  cancelBooking: async (id) => {
    const { data } = await API.delete(`/bookings/${id}`);
    return data;
  },
  updateBookingStatus: async (id, status) => {
    const { data } = await API.put(`/bookings/${id}/status`, { status });
    return data.data;
  },
};

export default bookingService;