import axios from 'axios';

const api=axios.create({
    baseURL: process.env.URL || 'http://192.168.102.119:8000'
});

export default api;