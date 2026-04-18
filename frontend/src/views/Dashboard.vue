<template>
  <div class="dashboard">
    <el-row :gutter="16" class="stat-cards">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card balance-card">
          <div class="stat-label">账户余额</div>
          <div class="stat-value">¥{{ stats.balance?.toFixed(2) ?? '—' }}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-label">累计消费</div>
          <div class="stat-value">¥{{ stats.total?.total_cost?.toFixed(4) ?? '—' }}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-label">总调用次数</div>
          <div class="stat-value">{{ stats.total?.total_calls ?? 0 }}</div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-label">累计 Tokens</div>
          <div class="stat-value">{{ (stats.total?.total_tokens ?? 0).toLocaleString() }}</div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="dark-card">
          <template #header><span class="card-title">近30天概览</span></template>
          <div class="month-stats">
            <div class="month-item">
              <span class="month-label">调用次数</span>
              <span class="month-value">{{ stats.last_30_days?.calls ?? 0 }}</span>
            </div>
            <div class="month-item">
              <span class="month-label">消耗 Tokens</span>
              <span class="month-value">{{ (stats.last_30_days?.tokens ?? 0).toLocaleString() }}</span>
            </div>
            <div class="month-item">
              <span class="month-label">消费金额</span>
              <span class="month-value">¥{{ stats.last_30_days?.cost?.toFixed(4) ?? '—' }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12">
        <el-card class="dark-card">
          <template #header><span class="card-title">快速开始</span></template>
          <el-space direction="vertical" style="width:100%">
            <el-alert type="info" :closable="false" class="dark-alert">
              <template #title>
                <span>API Key 格式兼容 OpenAI</span>
              </template>
              <template #default>
                在代码中使用我们的 API 替换 OpenAI API 地址即可：
                <code class="inline-code">https://api.tokenproxy.com/v1</code>
              </template>
            </el-alert>
            <div style="margin-top:8px">
              <el-button type="primary" @click="$router.push('/keys')">创建 API Key</el-button>
              <el-button @click="$router.push('/playground')">打开调试台</el-button>
            </div>
          </el-space>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 16px;">
      <el-col :xs="24" :sm="24" :md="24">
        <el-card class="dark-card">
          <template #header><span class="card-title">各模型消费排名</span></template>
          <el-table :data="stats.by_model || []" class="dark-table">
            <el-table-column prop="model" label="模型" />
            <el-table-column prop="calls" label="调用次数" />
            <el-table-column prop="tokens" label="Tokens" :formatter="(row) => row.tokens?.toLocaleString()" />
            <el-table-column prop="cost" label="消费金额" :formatter="(row) => '¥' + (row.cost?.toFixed(4) ?? '—')" />
          </el-table>
          <el-empty v-if="!stats.by_model?.length" description="暂无数据" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/index.js';

const stats = ref({});

onMounted(async () => {
  try {
    const { data } = await api.get('/user/balance');
    stats.value = data;
  } catch (e) {
    // silent fail
  }
});
</script>

<style scoped>
.dashboard {}

/* Stat Cards */
.stat-cards { margin-bottom: 0; }

.stat-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px;
  transition: all var(--duration-normal) var(--ease-out);
}

.stat-card:hover {
  border-color: var(--border-default);
  transform: translateY(-2px);
  box-shadow: var(--shadow-dark-2);
}

.balance-card {
  background: var(--brand-gradient);
  border-color: transparent;
  position: relative;
  overflow: hidden;
}

.balance-card::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
}

.balance-card .stat-label {
  color: rgba(255, 255, 255, 0.75);
}

.balance-card .stat-value {
  color: #fff;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

/* Dark Card */
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

.card-title {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--text-primary);
}

/* Month Stats */
.month-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.month-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-subtle);
}
.month-item:last-child { border-bottom: none; }
.month-label { color: var(--text-secondary); font-size: var(--text-sm); }
.month-value {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
}

/* Alert */
:deep(.dark-alert) {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
}
:deep(.dark-alert .el-alert__title) {
  color: var(--text-primary);
}
:deep(.dark-alert .el-alert__description) {
  color: var(--text-secondary);
}

/* Inline code */
.inline-code {
  background: var(--key-bg);
  color: var(--key-visible);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 12px;
  border: 1px solid var(--key-border);
}

/* Dark Table */
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
:deep(.dark-table .el-table__body-wrapper tr) {
  background: transparent;
  color: var(--text-primary);
}
:deep(.dark-table .el-table__row:hover > td) {
  background: var(--bg-elevated) !important;
}
:deep(.dark-table td) {
  border-bottom: 1px solid var(--border-subtle) !important;
}

/* ============================================================
   Mobile Responsive
   ============================================================ */
@media (max-width: 767px) {
  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: var(--text-xl);
  }

  .main-stats {
    gap: 12px;
  }

  .month-item {
    padding: 6px 0;
  }

  .month-value {
    font-size: var(--text-base);
  }
}
</style>
