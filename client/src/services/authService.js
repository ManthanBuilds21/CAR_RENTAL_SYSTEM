// ============================================================
//  authService.js
//  Path: client/src/services/authService.js
//  No style changes needed — pure API service, no UI.
// ============================================================

import API from './api';

const authService = {
  login: async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    return data.data;
  },
  register: async (name, email, password, phone) => {
    const { data } = await API.post('/auth/register', { name, email, password, phone });
    return data.data;
  },
  getProfile: async () => {
    const { data } = await API.get('/auth/profile');
    return data.data;
  },
  updateProfile: async (updates) => {
    const { data } = await API.put('/auth/profile', updates);
    return data.data;
  },
  getAllUsers: async () => {
    const { data } = await API.get('/auth/users');
    return data;
  },
};

export default authService;