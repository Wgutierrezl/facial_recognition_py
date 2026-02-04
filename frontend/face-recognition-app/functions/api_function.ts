import axios from 'axios';
import StorageService from './storage';

const api=axios.create({
    baseURL: process.env.URL || 'http://192.168.102.119:8000',
    /* timeout: 10000 */
});

api.interceptors.request.use(
  async (config) => {
    // ⛔ skipAuth → no token
    if ((config.headers as any)?.skipAuth) {
      delete config.headers?.Authorization;
      return config;
    }

    // 🔑 leer token desde SecureStore
    const token = await StorageService.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default api;