import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/tokenStorage';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const http = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let pendingQueue = [];

function flushQueue(error, token = null) {
  pendingQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
      return;
    }
    promise.resolve(token);
  });

  pendingQueue = [];
}

http.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');

    if (status !== 401 || originalRequest._retry || isRefreshEndpoint) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return http(originalRequest);
        })
        .catch((refreshError) => Promise.reject(refreshError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
        refreshToken
      });

      const nextAccessToken = refreshResponse?.data?.accessToken;
      const nextRefreshToken = refreshResponse?.data?.refreshToken || refreshToken;

      if (!nextAccessToken) {
        throw new Error('Khong nhan duoc access token moi.');
      }

      setTokens({
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken
      });

      flushQueue(null, nextAccessToken);
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

      window.dispatchEvent(new CustomEvent('auth:tokenRefreshed'));

      return http(originalRequest);
    } catch (refreshError) {
      clearTokens();
      flushQueue(refreshError, null);
      window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default http;
