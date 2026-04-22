<template>
  <div class="auth-page">
    <div class="auth-bg" />
    <el-card class="auth-card">
      <template #header>
        <div class="auth-logo">TokenProxy</div>
        <h2 class="auth-title">登录</h2>
      </template>
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="0"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="邮箱"
            size="large"
            prefix-icon="Message"
            class="dark-input"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            size="large"
            prefix-icon="Lock"
            show-password
            class="dark-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width:100%"
            :loading="loading"
            native-type="submit"
            class="brand-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="auth-footer">
        还没有账号？ <router-link to="/auth/register">立即注册</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import api from '../api/index.js';
import { useUserStore } from '../stores/user.js';

const router = useRouter();
const userStore = useUserStore();
const formRef = ref();
const loading = ref(false);

const form = ref({ email: '', password: '' });
const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '邮箱格式不正确' },
  ],
  password: [{ required: true, message: '请输入密码' }],
};

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  loading.value = true;
  try {
    const { data } = await api.post('/auth/login', form.value);
    userStore.setAuth(data.token, data.user);
    ElMessage.success('登录成功');
    router.push('/dashboard');
  } catch (err) {
    ElMessage.error(err.response?.data?.error || '登录失败');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.auth-bg {
  position: absolute;
  inset: 0;
  background: var(--brand-gradient);
  z-index: 0;
}

/* Subtle grid overlay */
.auth-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 400px;
  background: rgba(17, 17, 24, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: var(--radius-xl);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(124, 58, 237, 0.15);
}

:deep(.auth-card .el-card__header) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px 24px 16px;
}

:deep(.auth-card .el-card__body) {
  padding: 16px 24px 24px;
}

.auth-logo {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: var(--brand-primary-light);
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.auth-title {
  text-align: center;
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
}

.auth-footer {
  text-align: center;
  margin-top: 8px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.auth-footer a {
  color: var(--brand-primary-light);
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* Brand Button */
:deep(.brand-btn) {
  background: var(--brand-gradient);
  border: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all var(--duration-fast) var(--ease-out);
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);
}

:deep(.brand-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5);
  filter: brightness(1.08);
}

:deep(.brand-btn:active) {
  transform: translateY(0);
}
</style>

<style>
/* Global input styles for dark theme on auth pages */
.dark-input .el-input__wrapper {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  box-shadow: none;
  color: var(--text-primary);
  transition: border-color var(--duration-fast) var(--ease-out);
}

.dark-input .el-input__wrapper:hover {
  border-color: var(--border-strong);
}

.dark-input .el-input__wrapper.is-focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15) !important;
}

.dark-input .el-input__inner {
  color: var(--text-primary);
}

.dark-input .el-input__inner::placeholder {
  color: var(--text-tertiary);
}

.dark-input .el-input__prefix .el-icon {
  color: var(--text-tertiary);
}
</style>
