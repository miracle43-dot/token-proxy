<template>
  <el-container class="layout">
    <el-aside width="220px" class="sidebar">
      <div class="logo">TokenProxy</div>
      <el-menu :default-active="$route.name" router class="sidebar-menu">
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
          <el-tag type="success" size="large">
            <el-icon><Coin /></el-icon>
            余额: ¥{{ user?.balance?.toFixed(2) ?? '—' }}
          </el-tag>
          <el-dropdown @command="handleCommand">
            <el-button plain>
              {{ user?.email }} <el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
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

onMounted(() => {
  userStore.fetchMe().catch(() => {});
});

function handleCommand(cmd) {
  if (cmd === 'logout') {
    userStore.logout();
    router.push('/login');
  }
}
</script>

<style scoped>
.layout { min-height: 100vh; }
.sidebar {
  background: #1a1a2e;
  color: #fff;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
  border-bottom: 1px solid #2a2a4e;
}
.sidebar-menu {
  background: transparent;
  border: none;
}
.sidebar-menu .el-menu-item {
  color: #ccc;
}
.sidebar-menu .el-menu-item.is-active {
  background: #667eea;
  color: #fff;
}
.header {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 0 24px;
}
.header-right { display: flex; align-items: center; gap: 12px; }
.page-title { font-size: 18px; font-weight: 600; color: #333; }
.main { padding: 24px; background: #f5f7fa; }
</style>
