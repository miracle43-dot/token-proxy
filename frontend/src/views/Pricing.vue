<template>
  <div>
    <el-card class="dark-card">
      <template #header>
        <span class="card-title">模型价格表</span>
      </template>
      <el-alert type="info" :closable="false" class="dark-alert" style="margin-bottom:16px">
        <template #title>计费说明</template>
        <template #default>费用 = (输入 Tokens × 输入单价 + 输出 Tokens × 输出单价) / 1,000,000。单次请求封顶消费 ¥10。</template>
      </el-alert>

      <el-tabs v-model="activeProvider">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="OpenAI" name="openai" />
        <el-tab-pane label="Anthropic" name="anthropic" />
        <el-tab-pane label="Google" name="google" />
      </el-tabs>

      <el-table :data="filteredModels" class="dark-table" stripe>
        <el-table-column prop="name" label="模型" />
        <el-table-column prop="model_id" label="模型 ID" />
        <el-table-column prop="provider" label="提供商" />
        <el-table-column label="输入价格">
          <template #default="{ row }">
            ¥{{ row.input_price }}/1M Tokens<br/>
            <span class="price-sub">约 ¥{{ (row.input_price / 1000).toFixed(4) }}/1K</span>
          </template>
        </el-table-column>
        <el-table-column label="输出价格">
          <template #default="{ row }">
            ¥{{ row.output_price }}/1M Tokens<br/>
            <span class="price-sub">约 ¥{{ (row.output_price / 1000).toFixed(4) }}/1K</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api/index.js';

const models = ref([]);
const activeProvider = ref('all');

const filteredModels = computed(() => {
  if (activeProvider.value === 'all') return models.value;
  return models.value.filter(m => m.provider === activeProvider.value);
});

onMounted(async () => {
  try {
    const { data } = await api.get('/models/pricing');
    models.value = data.data;
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
.card-title {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--text-primary);
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

.dark-alert {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
}

:deep(.dark-alert .el-alert__title) {
  color: var(--text-primary);
}

:deep(.dark-alert .el-alert__description) {
  color: var(--text-secondary);
}

.price-sub {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
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
</style>
