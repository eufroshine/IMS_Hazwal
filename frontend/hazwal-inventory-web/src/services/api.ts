// ===== src/services/api.ts =====
import axios, { AxiosInstance } from 'axios';

// If NEXT_PUBLIC_API_BASE_URL is set, use it. Otherwise, when running in the browser
// build a base URL that points to the same host as the page but on the API port.
// This makes the frontend work when accessed from other devices without extra env vars.
const API_BASE_URL = (() => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:5292/api`;
  }
  return 'http://localhost:5292/api';
})();

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add token if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
