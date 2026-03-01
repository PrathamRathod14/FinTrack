import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://fintrack-api-4bxl.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor – attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fintrack_token');
      const path = window.location.pathname;
      if (!path.endsWith('/login') && !path.endsWith('/register') && path !== '/FinTrack/' && path !== '/FinTrack') {
        window.location.href = '/FinTrack/login';
      }
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
