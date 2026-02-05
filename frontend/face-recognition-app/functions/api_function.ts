import axios from 'axios';
import StorageService from './storage';

const api=axios.create({
    baseURL:'http://34.201.3.70:8000',
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