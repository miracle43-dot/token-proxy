<template>
  <div>
    <el-card class="dark-card">
      <template #header>
        <div class="header-row">
          <span class="card-title">系统状态</span>
          <el-tag :type="overallStatus.type" size="small">
            {{ overallStatus.label }}
          </el-tag>
        </div>
      </template>

      <div class="status-summary">
        <div class="summary-item">
          <span class="summary-label">API 可用性</span>
          <span class="summary-value success">99.9%</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">平均响应</span>
          <span class="summary-value">320ms</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">今日请求</span>
          <span class="summary-value">{{ formatNumber(stats.todayRequests) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">最近更新</span>
          <span class="summary-value">{{ stats.lastUpdated }}</span>
        </div>
      </div>

      <el-divider />

      <el-table :data="providerStatus" class="dark-table">
        <el-table-column label="提供商">
          <template #default="{ row }">
            <div class="provider-cell">
              <span class="provider-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="模型">
          <template #default="{ row }">
            <span class="model-names">{{ row.models }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'operational' ? 'success' : 'danger'" size="small">
              {{ row.status === 'operational' ? '正常' : '故障' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="延迟" width="100">
          <template #default="{ row }">
            <span class="latency" :class="row.latency > 1000 ? 'latency-high' : ''">
              {{ row.latency }}ms
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const stats = ref({
  todayRequests: 128493,
  lastUpdated: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
});

const providerStatus = ref([
  { name: 'OpenAI', models: 'GPT-4o, GPT-4-Turbo, GPT-3.5-Turbo', status: 'operational', latency: 280 },
  { name: 'Anthropic', models: 'Claude-3.5-Sonnet, Claude-3-Opus', status: 'operational', latency: 350 },
  { name: 'Google', models: 'Gemini-2.0-Flash, Gemini-1.5-Pro', status: 'operational', latency: 420 },
]);

const overallStatus = computed(() => {
  const allOk = providerStatus.value.every(p => p.status === 'operational');
  return allOk
    ? { type: 'success', label: '全部正常' }
    : { type: 'danger', label: '部分异常' };
});

const formatNumber = (num) => {
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w';
  return num.toLocaleString();
};
</script>

<style scoped>
.card-title {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--text-primary);
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dark-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
}

:deep(.dark-card .el-card__header) {
  border-bottom: 1px solid var(--border-subtle);
  padding: 16px 20px;
}

:deep(.dark-card .el-card__body) {
  padding: 20px;
}

.status-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.summary-value {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text-primary);
}

.summary-value.success {
  color: #10b981;
}

.provider-name {
  font-weight: 600;
  color: var(--text-primary);
}

.model-names {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.latency {
  font-size: var(--text-xs);
  color: #10b981;
}

.latency-high {
  color: #f59e0b;
}

:deep(.dark-table) {
  background: transparent;
  color: var(--text-primary);
}

:deep(.dark-table .el-table__header-wrapper th) {
  background: var(--bg-elevated) !important;
  color: var(--text-secondary);
  font-weight: 600;
  border-bottom: 1px solid var(--border-default) !important;
}

:deep(.dark-table .el-table__row:hover > td) {
  background: var(--bg-elevated) !important;
}

:deep(.dark-table td) {
  border-bottom: 1px solid var(--border-subtle) !important;
}
</style>
