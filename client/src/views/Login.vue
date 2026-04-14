<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">欢迎回来</h1>
      <p class="auth-subtitle">登录到 Token Proxy</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input v-model="form.username" type="text" class="form-input" placeholder="输入用户名" required />
        </div>
        <div class="form-group">
          <label class="form-label">密码</label>
          <input v-model="form.password" type="password" class="form-input" placeholder="输入密码" required />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <p v-if="error" style="color:var(--danger);font-size:14px;margin-top:12px;text-align:center">{{ error }}</p>
      </form>

      <div class="auth-footer">
        还没有账号？<a @click="$router.push('/register')">立即注册</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()
const form = ref({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.value.username, form.value.password)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.error || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>
