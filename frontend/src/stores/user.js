import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

const API_BASE = '/api';

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

  const isLoggedIn = computed(() => !!token.value);

  function setAuth(newToken, newUser) {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function fetchMe() {
    return axios.get(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token.value}` } })
      .then(r => { user.value = r.data.user; return r.data.user; });
  }

  // 通用请求头
  function authHeaders() {
    return { Authorization: `Bearer ${token.value}` };
  }

  return { token, user, isLoggedIn, setAuth, logout, fetchMe, authHeaders, API_BASE };
});
