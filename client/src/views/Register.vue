<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">创建账号</h1>
      <p class="auth-subtitle">加入 Token Proxy</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label class="form-label">用户名</label>
          <input v-model="form.username" type="text" class="form-input" placeholder="3-32个字符" required minlength="3" maxlength="32" />
        </div>
        <div class="form-group">
          <label class="form-label">密码</label>
          <input v-model="form.password" type="password" class="form-input" placeholder="至少6个字符" required minlength="6" />
        </div>
        <div class="form-group">
          <label class="form-label">确认密码</label>
          <input v-model="form.confirmPassword" type="password" class="form-input" placeholder="再次输入密码" required />
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
        <p v-if="error" style="color:var(--danger);font-size:14px;margin-top:12px;text-align:center">{{ error }}</p>
      </form>

      <div class="auth-footer">
        已有账号？<a @click="$router.push('/login')">立即登录</a>
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
const form = ref({ username: '', password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = '两次密码输入不一致'
    return
  }
  loading.value = true
  error.value = ''
  try {
    await authStore.register(form.value.username, form.value.password)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.error || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>
