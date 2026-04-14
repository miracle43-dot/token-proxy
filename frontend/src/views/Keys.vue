<template>
  <div>
    <el-card>
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>API Keys</span>
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><Plus /></el-icon> 创建新 Key
          </el-button>
        </div>
      </template>
      <el-table :data="keys" stripe v-loading="loading">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="key" label="Key" min-width="300">
          <template #default="{ row }">
            <div style="display:flex;align-items:center;gap:8px">
              <code style="flex:1;overflow:hidden;text-overflow:ellipsis;font-size:12px">
                {{ row.status === 'shown' ? row.key : row.key.slice(0, 12) + '...' + row.key.slice(-4) }}
              </code>
              <el-button size="small" @click="toggleShow(row)" :icon="row.status === 'shown' ? 'Hide' : 'View'" circle />
              <el-button size="small" @click="copyKey(row)" icon="Copy" circle />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="call_count" label="调用次数" />
        <el-table-column prop="total_tokens" label="Tokens">
          <template #default="{ row }"> {{ (row.total_tokens || 0).toLocaleString() }} </template>
        </el-table-column>
        <el-table-column prop="total_cost" label="累计消费">
          <template #default="{ row }"> ¥{{ (row.total_cost || 0).toFixed(4) }} </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" :formatter="(r) => r.created_at?.slice(0, 19).replace('T', ' ')" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-popconfirm title="确定删除此 Key？" @confirm="deleteKey(row.id)">
              <template #reference>
                <el-button type="danger" size="small" plain>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && !keys.length" description="暂无 API Key，点击上方按钮创建" />
    </el-card>

    <!-- 创建 Key 对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建 API Key" width="500px">
      <el-form :model="createForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="createForm.name" placeholder="如：我的第一个项目" maxlength="100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="createKey">创建</el-button>
      </template>
    </el-dialog>

    <!-- 创建成功显示 Key -->
    <el-dialog v-model="showKeyResult" title="API Key 创建成功" width="500px">
      <el-alert type="warning" :closable="false" show-icon>
        <template #title>请立即复制保存，关闭后将无法再次查看完整 Key</template>
      </el-alert>
      <div style="margin-top:16px">
        <el-input v-model="newKey" readonly>
          <template #append>
            <el-button @click="copyKey({ key: newKey })" icon="Copy">复制</el-button>
          </template>
        </el-input>
      </div>
      <template #footer>
        <el-button type="primary" @click="showKeyResult = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../api/index.js';

const keys = ref([]);
const loading = ref(false);
const showCreateDialog = ref(false);
const showKeyResult = ref(false);
const creating = ref(false);
const newKey = ref('');
const createForm = ref({ name: '' });

async function fetchKeys() {
  loading.value = true;
  try {
    const { data } = await api.get('/keys');
    keys.value = data.data.map(k => ({ ...k, status: 'hidden' }));
  } catch (e) {
    ElMessage.error('获取 Key 列表失败');
  } finally {
    loading.value = false;
  }
}

async function createKey() {
  creating.value = true;
  try {
    const { data } = await api.post('/keys', { name: createForm.value.name });
    newKey.value = data.key;
    showCreateDialog.value = false;
    showKeyResult.value = true;
    createForm.value.name = '';
    keys.value.unshift({ ...data, status: 'shown' });
  } catch (e) {
    ElMessage.error('创建失败');
  } finally {
    creating.value = false;
  }
}

async function deleteKey(id) {
  try {
    await api.delete(`/keys/${id}`);
    keys.value = keys.value.filter(k => k.id !== id);
    ElMessage.success('已删除');
  } catch (e) {
    ElMessage.error('删除失败');
  }
}

function toggleShow(row) {
  row.status = row.status === 'shown' ? 'hidden' : 'shown';
}

function copyKey(row) {
  navigator.clipboard.writeText(row.key).then(() => ElMessage.success('已复制'));
}

onMounted(fetchKeys);
</script>
