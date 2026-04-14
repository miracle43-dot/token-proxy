<template>
  <div v-if="authStore.isLoggedIn">
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-logo">🤖 Token Proxy</div>
        <ul class="sidebar-nav">
          <li><router-link to="/" :class="{ active: $route.path === '/' }">📊 概览</router-link></li>
          <li><router-link to="/api-keys" :class="{ active: $route.path === '/api-keys' }">🔑 API Keys</router-link></li>
          <li><router-link to="/usage" :class="{ active: $route.path === '/usage' }">📈 用量统计</router-link></li>
          <li><router-link to="/recharge" :class="{ active: $route.path === '/recharge' }">💰 充值</router-link></li>
          <li><router-link to="/settings" :class="{ active: $route.path === '/settings' }">⚙️ 设置</router-link></li>
        </ul>
      </aside>
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
  <div v-else>
    <router-view />
  </div>

  <!-- Toast -->
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" :class="['toast', `toast-${toast.type}`]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useAuthStore } from './stores/auth.js'

const authStore = useAuthStore()
const toasts = ref([])

function showToast(message, type = 'success') {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}

provide('showToast', showToast)
</script>
