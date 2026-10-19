import axios from 'axios';
import { settleRequest, trackRequestStart } from './loadingBar.js';

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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Fired when the session can't be renewed; AuthProvider logs out and redirects to /login.
export const AUTH_EXPIRED_EVENT = 'auth:expired';

// Shared so that several requests failing at once trigger only one refresh call.
let refreshPromise = null;
// A user-started logout should not also redirect through the expired-session handler.
let manualLogout = false;

export function markManualLogout() {
  manualLogout = true;
}

export function clearManualLogout() {
  manualLogout = false;
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token');

  // Plain axios (not `api`) so this request doesn't go through the interceptors below
  const response = await axios.post(
    `${API_BASE_URL}/users/refresh-token`,
    { refreshToken },
    { withCredentials: true },
  );

  const session = response.data?.data;
  if (!session?.accessToken) throw new Error('Refresh failed');

  localStorage.setItem('accessToken', session.accessToken);
  if (session.refreshToken) {
    localStorage.setItem('refreshToken', session.refreshToken);
  }
  return session.accessToken;
}

api.interceptors.request.use((config) => {
  if (!config.__loadingTracked) {
    config.__loadingTracked = true;
    trackRequestStart();
  }

  if (isPublicAuthRequest(config.url)) {
    return config;
  }

  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    settleRequest(response.config);
    return response;
  },
  async (error) => {
    const original = error.config;
    const willRetry =
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isPublicAuthRequest(original.url);

    if (!willRetry) {
      settleRequest(original);
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const accessToken = await refreshPromise;

      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch {
      settleRequest(original);
      if (!manualLogout) {
        window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
      }
      return Promise.reject(error);
    }
  },
);

export default api;
