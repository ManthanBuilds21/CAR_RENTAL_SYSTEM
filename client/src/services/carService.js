// ============================================================
//  carService.js
//  Path: client/src/services/carService.js
//  No style changes needed — pure API service, no UI.
// ============================================================

import API from './api';
const uploadImage = async (formData) => {
  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

const carService = {
  getCars: async (params = {}) => {
    const { data } = await API.get('/cars', { params });
    return data;
  },
  getFeaturedCars: async () => {
    const { data } = await API.get('/cars/featured');
    return data.data;
  },
  getCarById: async (id) => {
    const { data } = await API.get(`/cars/${id}`);
    return data.data;
  },
  createCar: async (carData) => {
    const { data } = await API.post('/cars', carData);
    return data.data;
  },
  updateCar: async (id, carData) => {
    const { data } = await API.put(`/cars/${id}`, carData);
    return data.data;
  },
  deleteCar: async (id) => {
    const { data } = await API.delete(`/cars/${id}`);
    return data;
  },
  uploadImage: async (formData) => {
    const { data } = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

export default carService;