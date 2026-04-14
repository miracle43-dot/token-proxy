<template>
  <div>
    <div class="page-header">
      <h1>用量统计</h1>
      <p>查看API调用记录和消费明细</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">总调用次数</div>
        <div class="stat-value">{{ summary.total_calls?.toLocaleString() || 0 }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">输入Tokens</div>
        <div class="stat-value">{{ formatTokens(summary.total_input_tokens) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">输出Tokens</div>
        <div class="stat-value">{{ formatTokens(summary.total_output_tokens) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">总消费</div>
        <div class="stat-value" style="color:var(--danger)">¥{{ summary.total_cost?.toFixed(4) || '0.0000' }}</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">调用明细</div>
        <div style="display:flex;gap:12px;align-items:center">
          <select v-model="filterModel" class="form-input" style="width:auto" @change="fetchLogs">
            <option value="">全部模型</option>
            <option v-for="m in models" :key="m.model" :value="m.model">{{ m.model }}</option>
          </select>
          <input v-model="filterDate" type="date" class="form-input" style="width:140px" @change="fetchLogs" />
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>模型</th>
            <th>端点</th>
            <th>输入Tokens</th>
            <th>输出Tokens</th>
            <th>费用</th>
            <th>耗时</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td>{{ new Date(log.created_at).toLocaleString() }}</td>
            <td><code style="font-size:12px">{{ log.model }}</code></td>
            <td>{{ log.endpoint }}</td>
            <td>{{ log.input_tokens?.toLocaleString() }}</td>
            <td>{{ log.output_tokens?.toLocaleString() }}</td>
            <td style="color:var(--danger)">¥{{ log.cost.toFixed(4) }}</td>
            <td>{{ log.response_time }}ms</td>
            <td><span :class="['badge', log.status_code < 400 ? 'badge-success' : 'badge-danger']">{{ log.status_code }}</span></td>
          </tr>
        </tbody>
      </table>
      <div v-if="!logs.length" class="empty-state">暂无数据</div>

      <div v-if="total > pageSize" style="margin-top:16px;display:flex;justify-content:center;gap:8px">
        <button class="btn btn-sm btn-outline" :disabled="page <= 1" @click="page--;fetchLogs()">上一页</button>
        <span style="padding:6px 12px;font-size:13px">第 {{ page }} / {{ Math.ceil(total/pageSize) }} 页</span>
        <button class="btn btn-sm btn-outline" :disabled="page >= Math.ceil(total/pageSize)" @click="page++;fetchLogs()">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const logs = ref([])
const summary = ref({})
const models = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 30
const filterModel = ref('')
const filterDate = ref('')

onMounted(async () => {
  await fetchStats()
  await fetchLogs()
})

async function fetchStats() {
  const res = await authStore.api.get('/api/usage/stats')
  summary.value = res.data.summary || {}
  models.value = res.data.byModel || []
}

async function fetchLogs() {
  const params = { page: page.value, page_size: pageSize }
  if (filterModel.value) params.model = filterModel.value
  if (filterDate.value) params.start_date = filterDate.value
  const res = await authStore.api.get('/api/usage/logs', { params })
  logs.value = res.data.logs || []
  total.value = res.data.total || 0
}

function formatTokens(n) {
  if (!n) return '0'
  if (n >= 1000000) return (n/1000000).toFixed(2) + 'M'
  if (n >= 1000) return (n/1000).toFixed(1) + 'K'
  return n.toString()
}
</script>
