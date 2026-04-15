<template>
  <el-container class="layout">
    <el-aside width="220px" class="sidebar">
      <div class="logo">TokenProxy</div>
      <el-menu
        :default-active="$route.name"
        router
        class="sidebar-menu"
        :background-color="'transparent'"
        :text-color="vars.textSecondary"
        :active-text-color="vars.brandPrimary"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>控制台</span>
        </el-menu-item>
        <el-menu-item index="/keys">
          <el-icon><Key /></el-icon>
          <span>API Keys</span>
        </el-menu-item>
        <el-menu-item index="/usage">
          <el-icon><DataLine /></el-icon>
          <span>用量明细</span>
        </el-menu-item>
        <el-menu-item index="/pricing">
          <el-icon><PriceTag /></el-icon>
          <span>价格表</span>
        </el-menu-item>
        <el-menu-item index="/playground">
          <el-icon><Monitor /></el-icon>
          <span>API 调试台</span>
        </el-menu-item>
        <el-menu-item index="/recharge">
          <el-icon><Coin /></el-icon>
          <span>充值</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="page-title">{{ $route.name }}</span>
        </div>
        <div class="header-right">
          <el-tag class="balance-tag" size="large">
            <el-icon><Coin /></el-icon>
            余额: ¥{{ user?.balance?.toFixed(2) ?? '—' }}
          </el-tag>
          <el-dropdown @command="handleCommand">
            <el-button class="user-btn" plain>
              {{ user?.email }} <el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="toggle-theme">切换主题</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.js';

const router = useRouter();
const userStore = useUserStore();
const user = computed(() => userStore.user);

const vars = {
  brandPrimary: 'var(--brand-primary)',
  textSecondary: 'var(--text-secondary)',
};

onMounted(() => {
  userStore.fetchMe().catch(() => {});
});

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

function handleCommand(cmd) {
  if (cmd === 'logout') {
    userStore.logout();
    router.push('/login');
  } else if (cmd === 'toggle-theme') {
    toggleTheme();
  }
}
</script>

<style scoped>
.layout { min-height: 100vh; }

/* Sidebar */
.sidebar {
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  height: 100vh;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  color: var(--brand-primary);
  border-bottom: 1px solid var(--border-subtle);
  letter-spacing: -0.5px;
}

.sidebar-menu {
  background: transparent;
  border: none;
}

:deep(.sidebar-menu .el-menu-item) {
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  margin: 4px 8px;
  width: calc(100% - 16px);
  transition: all var(--duration-fast) var(--ease-out);
}

:deep(.sidebar-menu .el-menu-item:hover) {
  background: rgba(124, 58, 237, 0.1);
  color: var(--brand-primary-light);
}

:deep(.sidebar-menu .el-menu-item.is-active) {
  background: rgba(124, 58, 237, 0.15);
  color: var(--brand-primary);
}

:deep(.sidebar-menu .el-menu-item .el-icon) {
  margin-right: 8px;
}

/* Header */
.header {
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
  padding: 0 24px;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  text-transform: capitalize;
}

.balance-tag {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--color-success);
  font-weight: 500;
}

.user-btn {
  border-color: var(--border-default);
  color: var(--text-secondary);
  background: transparent;
  transition: all var(--duration-fast) var(--ease-out);
}

.user-btn:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

/* Main */
.main {
  padding: 24px 32px;
  background: var(--bg-base);
  min-height: calc(100vh - 60px);
}
</style>
