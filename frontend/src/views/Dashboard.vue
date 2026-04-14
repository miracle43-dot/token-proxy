<template>
  <div>
    <el-row :gutter="16" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">账户余额</div>
          <div class="stat-value">¥{{ stats.balance?.toFixed(2) ?? '—' }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">累计消费</div>
          <div class="stat-value">¥{{ stats.total?.total_cost?.toFixed(4) ?? '—' }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">总调用次数</div>
          <div class="stat-value">{{ stats.total?.total_calls ?? 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-label">累计 Tokens</div>
          <div class="stat-value">{{ (stats.total?.total_tokens ?? 0).toLocaleString() }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px;">
      <el-col :span="12">
        <el-card>
          <template #header><span>近30天概览</span></template>
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
      <el-col :span="12">
        <el-card>
          <template #header><span>快速开始</span></template>
          <el-space direction="vertical" style="width:100%">
            <el-alert type="info" :closable="false">
              <template #title>
                <span>API Key 格式兼容 OpenAI</span>
              </template>
              <template #default>
                在代码中使用我们的 API 替换 OpenAI API 地址即可：
                <code>https://api.tokenproxy.com/v1</code>
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
      <el-col :span="24">
        <el-card>
          <template #header><span>各模型消费排名</span></template>
          <el-table :data="stats.by_model || []" stripe>
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
    console.error(e);
  }
});
</script>

<style scoped>
.stat-cards { margin-bottom: 0; }
.stat-label { font-size: 13px; color: #888; margin-bottom: 8px; }
.stat-value { font-size: 28px; font-weight: 700; color: #333; }
.month-stats { display: flex; flex-direction: column; gap: 16px; }
.month-item { display: flex; justify-content: space-between; align-items: center; }
.month-label { color: #666; }
.month-value { font-size: 18px; font-weight: 600; }
code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
