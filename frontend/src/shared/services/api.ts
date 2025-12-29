import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { getErrorMessage } from '../utils/errorMessages';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const message = getErrorMessage(error);
      if (message) {
        sessionStorage.setItem('authError', message);
      }
      window.location.href = '/login';
      return Promise.reject(error);
    }

    (error as any).userMessage = getErrorMessage(error);
    
    return Promise.reject(error);
  }
);

export default api;
