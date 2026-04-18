<template>
  <div class="keys-page">
    <el-card class="dark-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">API Keys</span>
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><Plus /></el-icon> 创建新 Key
          </el-button>
        </div>
      </template>

      <div v-if="keys.length" class="keys-list">
        <div v-for="key in keys" :key="key.id" class="key-card">
          <div class="key-header">
            <span class="key-name">{{ key.name }}</span>
            <el-tag
              :type="key.status === 'active' || key._status === 'active' ? 'success' : 'danger'"
              size="small"
              class="key-status-tag"
            >
              {{ key.status === 'active' || key._status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </div>

          <div class="key-row">
            <div class="key-display">
              <code class="key-value">
                {{ key.status === 'shown' || key._status === 'shown' ? key.key : maskKey(key.key) }}
              </code>
              <div class="key-actions">
                <el-button
                  size="small"
                  class="icon-btn"
                  @click="toggleShow(key)"
                  :icon="key.status === 'shown' || key._status === 'shown' ? 'Hide' : 'View'"
                  circle
                />
                <el-button
                  size="small"
                  class="icon-btn copy-btn"
                  @click="copyKey(key)"
                  icon="Copy"
                  circle
                />
              </div>
            </div>
          </div>

          <div class="key-meta">
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ key.created_at?.slice(0, 19).replace('T', ' ') }}
            </span>
            <span class="meta-item">
              <el-icon><DataLine /></el-icon>
              {{ (key.call_count || 0).toLocaleString() }} 次调用
            </span>
            <span class="meta-item">
              <el-icon><Coin /></el-icon>
              ¥{{ (key.total_cost || 0).toFixed(4) }}
            </span>
          </div>

          <div class="key-footer">
            <el-popconfirm
              title="确定删除此 Key？删除后不可恢复。"
              @confirm="deleteKey(key.id)"
              confirm-button-text="删除"
              cancel-button-text="取消"
              :confirm-button-type="'danger'"
            >
              <template #reference>
                <el-button type="danger" size="small" plain class="delete-btn">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>

      <el-empty v-if="!loading && !keys.length" description="暂无 API Key，点击上方按钮创建" />
    </el-card>

    <!-- Create Key Dialog -->
    <el-dialog v-model="showCreateDialog" title="创建 API Key" width="500px" class="dark-dialog">
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

    <!-- Key Result Dialog -->
    <el-dialog v-model="showKeyResult" title="API Key 创建成功" width="500px" class="dark-dialog">
      <el-alert type="warning" :closable="false" show-icon class="warning-alert">
        <template #title>请立即复制保存，关闭后将无法再次查看完整 Key</template>
      </el-alert>
      <div style="margin-top:16px">
        <el-input v-model="newKey" readonly class="key-result-input">
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

function maskKey(key) {
  if (!key) return '—';
  return key.slice(0, 12) + '••••••••' + key.slice(-4);
}

async function fetchKeys() {
  loading.value = true;
  try {
    const { data } = await api.get('/keys');
    keys.value = data.data.map(k => ({ ...k, status: 'hidden', _status: 'hidden' }));
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
    keys.value.unshift({ ...data, status: 'shown', _status: 'shown' });
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
  const shown = row.status === 'shown' || row._status === 'shown';
  row.status = shown ? 'hidden' : 'shown';
  row._status = shown ? 'hidden' : 'shown';
}

function copyKey(row) {
  navigator.clipboard.writeText(row.key).then(() => ElMessage.success('已复制'));
}

onMounted(fetchKeys);
</script>

<style scoped>
.keys-page {}

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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--text-primary);
}

/* Keys List */
.keys-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.key-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  transition: all var(--duration-fast) var(--ease-out);
}

.key-card:hover {
  border-color: var(--border-default);
}

.key-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.key-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--text-base);
}

.key-status-tag {
  font-size: 11px;
}

/* Key Display */
.key-row {
  margin-bottom: 12px;
}

.key-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--key-bg);
  border: 1px solid var(--key-border);
  border-radius: var(--radius-md);
  padding: 8px 12px;
}

.key-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--key-visible);
  white-space: nowrap;
}

.key-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--border-default);
  color: var(--text-secondary);
  transition: all var(--duration-fast) var(--ease-out);
}

.icon-btn:hover {
  background: rgba(124, 58, 237, 0.1);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.copy-btn:hover {
  background: rgba(124, 58, 237, 0.15);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

/* Key Meta */
.key-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.meta-item .el-icon {
  font-size: 12px;
}

/* Key Footer */
.key-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--border-subtle);
  padding-top: 12px;
}

.delete-btn {
  font-size: var(--text-sm);
}

/* Dialog */
:deep(.dark-dialog) {
  background: var(--bg-elevated);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
}
:deep(.dark-dialog .el-dialog__header) {
  border-bottom: 1px solid var(--border-subtle);
}
:deep(.dark-dialog .el-dialog__title) {
  color: var(--text-primary);
  font-weight: 600;
}
:deep(.dark-dialog .el-dialog__body) {
  padding: 20px;
}
:deep(.dark-dialog .el-dialog__footer) {
  border-top: 1px solid var(--border-subtle);
}

.warning-alert {
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.08);
}

:deep(.key-result-input .el-input__wrapper) {
  background: var(--key-bg);
  border-color: var(--key-border);
  box-shadow: none;
}
:deep(.key-result-input .el-input__inner) {
  font-family: var(--font-mono);
  color: var(--key-visible);
}

/* ============================================================
   Mobile Responsive
   ============================================================ */
@media (max-width: 767px) {
  .key-card {
    padding: 12px;
  }

  .key-display {
    flex-wrap: wrap;
  }


  .key-value {
    font-size: 11px;
    flex: 1 1 100%;
  }


  .key-actions {
    flex: 1 1 auto;
  }

  .key-meta {
    gap: 12px;
  }

  .card-header {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
