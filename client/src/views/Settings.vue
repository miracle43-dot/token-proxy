<template>
  <div>
    <div class="page-header">
      <h1>设置</h1>
      <p>管理你的账户信息</p>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">账户信息</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        <div>
          <div style="font-size:14px;color:var(--text-secondary)">用户名</div>
          <div style="font-size:16px;font-weight:500;margin-top:4px">{{ user?.username || '-' }}</div>
        </div>
        <div>
          <div style="font-size:14px;color:var(--text-secondary)">余额</div>
          <div style="font-size:16px;font-weight:500;margin-top:4px;color:var(--success)">¥{{ user?.balance?.toFixed(4) || '0.0000' }}</div>
        </div>
        <div>
          <div style="font-size:14px;color:var(--text-secondary)">注册时间</div>
          <div style="font-size:16px;font-weight:500;margin-top:4px">{{ user?.created_at ? new Date(user.created_at).toLocaleString() : '-' }}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">安全</div>
      </div>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px">
        密码修改功能开发中...
      </p>
      <button class="btn btn-outline" disabled>修改密码</button>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">登出</div>
      </div>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px">
        确定要退出登录吗？
      </p>
      <button class="btn btn-danger" @click="logout">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()
const user = ref({})

onMounted(async () => {
  user.value = await authStore.fetchUser()
})

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>
