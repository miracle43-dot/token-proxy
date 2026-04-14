<template>
  <div>
    <div class="page-header">
      <h1>控制台</h1>
      <p>欢迎回来，{{ authStore.user?.username }}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">账户余额</div>
        <div class="stat-value" style="color:var(--success)">¥{{ balance.toFixed(4) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">API Keys</div>
        <div class="stat-value">{{ apiKeyCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">累计调用</div>
        <div class="stat-value">{{ stats.total_calls?.toLocaleString() || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">累计消费</div>
        <div class="stat-value">¥{{ stats.total_cost?.toFixed(4) || '0.0000' }}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📈 近30天消费趋势</div>
        </div>
        <div v-if="stats.byDay?.length" style="overflow-x:auto">
          <div style="display:flex;align-items:flex-end;gap:4px;height:120px;padding:10px 0">
            <div v-for="day in stats.byDay.slice().reverse()" :key="day.date"
              :style="{ flex:1, height: getBarHeight(day.cost) + '%', background: 'var(--primary)', borderRadius:'4px 4px 0 0', minHeight:'4px' }"
              :title="`${day.date}: ¥${day.cost.toFixed(4)}`">
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-secondary);margin-top:8px">
            <span>{{ stats.byDay[stats.byDay.length-1]?.date }}</span>
            <span>{{ stats.byDay[0]?.date }}</span>
          </div>
        </div>
        <div v-else class="empty-state">暂无数据</div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🏆 模型使用排行</div>
        </div>
        <div v-if="stats.byModel?.length">
          <div v-for="(m, i) in stats.byModel.slice(0,5)" :key="m.model" style="padding:8px 0;border-bottom:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between">
              <span style="font-size:13px;font-weight:500">{{ m.model }}</span>
              <span style="font-size:13px;color:var(--text-secondary)">{{ m.calls }}次</span>
            </div>
            <div style="font-size:12px;color:var(--success)">¥{{ m.cost.toFixed(4) }}</div>
          </div>
        </div>
        <div v-else class="empty-state">暂无数据</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">💡 快速开始</div>
      </div>
      <div style="font-size:14px;color:var(--text-secondary);line-height:1.8">
        <p>1. 在 <router-link to="/api-keys" style="color:var(--primary)">API Keys</router-link> 创建你的第一个Key</p>
        <p>2. 复制Key，替换你的应用中的 API Key</p>
        <p>3. 将请求地址改为 <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:13px">{{ baseUrl }}/v1/chat/completions</code></p>
        <p style="margin-top:12px;background:#fef3c7;padding:12px;border-radius:8px;font-size:13px">
          <strong>示例代码（Python）：</strong><br>
          <code style="font-size:12px">
            client = OpenAI(api_key="sk-xxxxx...", base_url="{{ baseUrl }}/v1")<br>
            response = client.chat.completions.create(model="gpt-4o-mini", messages=[...])
          </code>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const balance = ref(0)
const apiKeyCount = ref(0)
const stats = ref({})
const baseUrl = window.location.origin

onMounted(async () => {
  try {
    await authStore.fetchUser()
    balance.value = authStore.user?.balance || 0

    const [keysRes, statsRes] = await Promise.all([
      authStore.api.get('/api-keys'),
      authStore.api.get('/api/usage/stats')
    ])
    apiKeyCount.value = keysRes.data.apiKeys?.length || 0
    stats.value = statsRes.data
  } catch (e) {
    console.error(e)
  }
})

function getBarHeight(cost) {
  if (!stats.value.byDay?.length) return 0
  const max = Math.max(...stats.value.byDay.map(d => d.cost || 0))
  if (!max) return 0
  return Math.max(5, (cost / max) * 100)
}
</script>
