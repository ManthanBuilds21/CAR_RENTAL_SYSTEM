import API from './api';

const carService = {
  getCars: async (params = {}) => {
    const { data } = await API.get('/cars', { params });
    return data;
  },

  getFeaturedCars: async () => {
    const { data } = await API.get('/cars/featured');
    return data; // API returns array directly
  },

  getCarById: async (id) => {
    const { data } = await API.get(`/cars/${id}`);
    return data; // API returns object directly
  },

  createCar: async (carData) => {
    const { data } = await API.post('/cars', carData);
    return data;
  },

  updateCar: async (id, carData) => {
    const { data } = await API.put(`/cars/${id}`, carData);
    return data;
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

  // ── MAP FEATURE ──
  getNearbyCars: async (lat, lng, radius = 20) => {
    const { data } = await API.get('/cars/nearby', {
      params: { lat, lng, radius },
    });
    return data; // returns { count, cars }
  },
};

export default carService;