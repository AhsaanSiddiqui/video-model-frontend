import axios from 'axios';

const PUBLIC_AUTH_PATHS = [
  '/users/login',
  '/users/register',
  '/users/forgot-password',
  '/users/refresh-token',
];

function isPublicAuthRequest(url = '') {
  return PUBLIC_AUTH_PATHS.some((path) => url.includes(path))
    || /\/users\/reset-password\//.test(url);
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (isPublicAuthRequest(config.url)) {
    return config;
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
