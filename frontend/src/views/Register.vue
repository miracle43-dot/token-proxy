<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <template #header>
        <h2>注册 TokenProxy</h2>
      </template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0" @submit.prevent="handleRegister">
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" size="large" prefix-icon="Message" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码（至少6位）" size="large" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" size="large" prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" style="width:100%" :loading="loading" native-type="submit">
            注册（赠送10元体验金）
          </el-button>
        </el-form-item>
      </el-form>
      <div class="auth-footer">
        已有账号？ <router-link to="/login">立即登录</router-link>
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

const form = ref({ email: '', password: '', confirmPassword: '' });

const rules = {
  email: [{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }],
  password: [{ required: true, message: '请输入密码' }, { min: 6, message: '密码至少6位' }],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) callback(new Error('两次密码不一致'));
        else callback();
      },
    },
  ],
};

async function handleRegister() {
  const valid = await formRef.value?.validate().catch(() => false);
  if (!valid) return;
  loading.value = true;
  try {
    const { data } = await api.post('/auth/register', {
      email: form.value.email,
      password: form.value.password,
    });
    userStore.setAuth(data.token, data.user);
    ElMessage.success('注册成功，已赠送10元体验金！');
    router.push('/dashboard');
  } catch (err) {
    ElMessage.error(err.response?.data?.error || '注册失败');
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.auth-card { width: 400px; }
.auth-card h2 { text-align: center; margin: 0; }
.auth-footer { text-align: center; margin-top: 8px; font-size: 14px; color: #666; }
.auth-footer a { color: #409eff; text-decoration: none; }
</style>
