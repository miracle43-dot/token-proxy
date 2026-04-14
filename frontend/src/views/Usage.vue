<template>
  <div>
    <el-card>
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>用量明细</span>
          <el-select v-model="filterModel" placeholder="筛选模型" clearable style="width:200px" @change="fetchUsage">
            <el-option v-for="m in models" :key="m.model_id" :label="m.name" :value="m.model_id" />
          </el-select>
        </div>
      </template>

      <el-table :data="rows" stripe v-loading="loading" :pagination="true">
        <el-table-column prop="request_time" label="时间" width="170">
          <template #default="{ row }">
            {{ row.request_time?.slice(0, 19).replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column prop="model" label="模型" />
        <el-table-column prop="prompt_tokens" label="输入 Tokens" :formatter="(r) => r.prompt_tokens?.toLocaleString()" />
        <el-table-column prop="completion_tokens" label="输出 Tokens" :formatter="(r) => r.completion_tokens?.toLocaleString()" />
        <el-table-column prop="total_tokens" label="总 Tokens" :formatter="(r) => r.total_tokens?.toLocaleString()" />
        <el-table-column prop="cost" label="费用" :formatter="(r) => '¥' + (r.cost?.toFixed(4) ?? '—')" />
        <el-table-column prop="latency_ms" label="延迟(ms)" :formatter="(r) => r.latency_ms + 'ms'" />
        <el-table-column prop="response_status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.response_status < 400 ? 'success' : 'danger'" size="small">
              {{ row.response_status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top:16px;display:flex;justify-content:center">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="fetchUsage"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/index.js';

const rows = ref([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const filterModel = ref('');
const models = ref([]);

async function fetchUsage() {
  loading.value = true;
  try {
    const params = { page: page.value, page_size: pageSize.value };
    if (filterModel.value) params.model = filterModel.value;
    const { data } = await api.get('/user/usage', { params });
    rows.value = data.data;
    total.value = data.total;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

async function fetchModels() {
  try {
    const { data } = await api.get('/models');
    models.value = data.data;
  } catch (e) { /* ignore */ }
}

onMounted(() => { fetchUsage(); fetchModels(); });
</script>
