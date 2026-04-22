import axios from 'axios';
import { useUserStore } from '../stores/user.js';

const api = axios.create({ baseURL: '/api' });

// 请求拦截器：自动附加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：401 时跳转登录
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// 代理 API (直接请求 /v1 前缀，不带 /api)
export const proxyApi = axios.create({ baseURL: '/v1' });
