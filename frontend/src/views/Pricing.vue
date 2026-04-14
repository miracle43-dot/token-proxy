<template>
  <div>
    <el-card>
      <template #header>
        <span>模型价格表</span>
      </template>
      <el-alert type="info" :closable="false" style="margin-bottom:16px">
        <template #title>计费说明</template>
        <template #default>费用 = (输入 Tokens × 输入单价 + 输出 Tokens × 输出单价) / 1,000,000。单次请求封顶消费 ¥10。</template>
      </el-alert>

      <el-tabs v-model="activeProvider">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="OpenAI" name="openai" />
        <el-tab-pane label="Anthropic" name="anthropic" />
        <el-tab-pane label="Google" name="google" />
      </el-tabs>

      <el-table :data="filteredModels" stripe>
        <el-table-column prop="name" label="模型" />
        <el-table-column prop="model_id" label="模型 ID" />
        <el-table-column prop="provider" label="提供商" />
        <el-table-column label="输入价格">
          <template #default="{ row }">
            ¥{{ row.input_price }}/1M Tokens<br/>
            <span style="font-size:12px;color:#888">约 ¥{{ (row.input_price / 1000).toFixed(4) }}/1K</span>
          </template>
        </el-table-column>
        <el-table-column label="输出价格">
          <template #default="{ row }">
            ¥{{ row.output_price }}/1M Tokens<br/>
            <span style="font-size:12px;color:#888">约 ¥{{ (row.output_price / 1000).toFixed(4) }}/1K</span>
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
