import axios from 'axios';
import StorageService from './storage';

const api=axios.create({
    baseURL:'http://alb-gesttask-1697059265.us-east-1.elb.amazonaws.com:8000/api',
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