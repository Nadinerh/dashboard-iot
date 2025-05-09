import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_IP,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchEncryptedData = () => api.get('/api/upload/status');
export const fetchSensorData = () => api.get('/api/donnees/all');
export const fetchTrafficData = () => api.get('/api/stats/hourly');

export default api;
