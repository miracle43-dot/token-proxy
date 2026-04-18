<template>
  <div class="settings-page">
    <div class="page-header">
      <h2>设置</h2>
    </div>

    <div class="settings-section">
      <h3>主题</h3>
      <div class="setting-row">
        <span>深色模式</span>
        <el-switch v-model="isDark" @change="toggleTheme" />
      </div>
    </div>

    <div class="settings-section">
      <h3>账户</h3>
      <div class="setting-row" v-if="user">
        <span>邮箱</span>
        <span class="value">{{ user.email }}</span>
      </div>
      <div class="setting-row" v-if="user">
        <span>注册时间</span>
        <span class="value">{{ formatDate(user.created_at) }}</span>
      </div>
    </div>

    <div class="settings-section">
      <h3>关于</h3>
      <div class="setting-row">
        <span>版本</span>
        <span class="value">v1.0.0</span>
      </div>
    </div>

    <div class="settings-section danger-zone">
      <h3>危险区域</h3>
      <el-button type="danger" plain @click="handleLogout">退出登录</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.js';

const router = useRouter();
const userStore = useUserStore();
const user = computed(() => userStore.user);

const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark');

function toggleTheme(val) {
  const theme = val ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts * 1000).toLocaleDateString('zh-CN');
}

function handleLogout() {
  userStore.logout();
  router.push('/auth/login');
}
</script>

<style scoped>
.settings-page { max-width: 600px; }

.page-header { margin-bottom: 24px; }
.page-header h2 {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
}

.settings-section {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  margin-bottom: 16px;
}

.settings-section h3 {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
  font-size: var(--text-base);
}

.setting-row:last-child { border-bottom: none; }
.setting-row .value { color: var(--text-secondary); }

.danger-zone { border-color: rgba(239, 68, 68, 0.3); }
.danger-zone h3 { color: var(--color-danger); }
</style>
