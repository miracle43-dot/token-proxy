<template>
  <div class="subkeys-page">
    <el-card class="dark-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">Sub-keys 管理</span>
          <el-button type="primary" @click="showCreateDialog = true" :disabled="!parentKeys.length">
            <el-icon><Plus /></el-icon> 创建子密钥
          </el-button>
        </div>
      </template>

      <div v-if="!parentKeys.length" class="no-parent-key">
        <el-alert type="info" :closable="false" show-icon>
          <template #title>请先创建一个 API Key，再创建 Sub-keys</template>
        </el-alert>
        <div style="margin-top: 16px; text-align: center;">
          <el-button type="primary" @click="$router.push('/keys')">去创建 API Key</el-button>
        </div>
      </div>

      <div v-else-if="loading && !subkeys.length" class="loading-state">
        <el-skeleton :rows="3" animated />
      </div>

      <div v-else-if="!subkeys.length && !loading" class="empty-state">
        <el-empty description="暂无子密钥，点击上方按钮创建" />
      </div>

      <div v-else class="subkeys-list">
        <div v-for="sk in subkeys" :key="sk.id" class="subkey-card">
          <div class="subkey-header">
            <div class="subkey-title">
              <span class="subkey-name">{{ sk.name }}</span>
              <span class="parent-key-tag">父 Key: {{ sk.parent_key_name || sk.parent_key_id }}</span>
            </div>
            <div class="subkey-status-row">
              <el-tag
                :type="sk.status === 'active' ? 'success' : 'danger'"
                size="small"
              >
                {{ sk.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
              <el-switch
                v-model="sk.status"
                active-value="active"
                inactive-value="disabled"
                @change="updateSubkey(sk, 'status', sk.status)"
                :loading="sk._loading"
              />
            </div>
          </div>

          <!-- 额度信息 -->
          <div class="quota-section">
            <div class="quota-info">
              <div class="quota-stat">
                <span class="quota-label">已用 / 额度</span>
                <span class="quota-value" :class="{ 'quota-warning': isQuotaWarning(sk), 'quota-exceeded': isQuotaExceeded(sk) }">
                  {{ sk.quota_used.toFixed(4) }} / {{ sk.quota_limit === 0 ? '不限' : sk.quota_limit.toFixed(2) }}
                </span>
              </div>
              <div v-if="sk.quota_limit > 0" class="quota-bar-wrapper">
                <el-progress
                  :percentage="Math.min(100, (sk.quota_used / sk.quota_limit) * 100)"
                  :color="quotaColor(sk)"
                  :show-text="false"
                  :stroke-width="6"
                />
              </div>
            </div>
          </div>

          <!-- 允许的模型 -->
          <div v-if="sk.allowed_models && sk.allowed_models.length" class="models-section">
            <span class="section-label">允许模型:</span>
            <div class="model-tags">
              <el-tag
                v-for="m in sk.allowed_models"
                :key="m"
                size="small"
                type="info"
                class="model-tag"
              >{{ m }}</el-tag>
            </div>
          </div>

          <!-- Key 显示 -->
          <div class="subkey-key-display">
            <code class="subkey-key-value">
              {{ sk._shown ? sk.sub_key : maskKey(sk.sub_key) }}
            </code>
            <div class="subkey-key-actions">
              <el-button
                size="small"
                class="icon-btn"
                @click="toggleShow(sk)"
                circle
              >
                <el-icon><View v-if="!sk._shown" /><Hide v-else /></el-icon>
              </el-button>
              <el-button
                size="small"
                class="icon-btn copy-btn"
                @click="copyKey(sk)"
                circle
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </div>
          </div>

          <div class="subkey-footer">
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ sk.created_at?.slice(0, 19).replace('T', ' ') }}
            </span>
            <div class="footer-actions">
              <el-button size="small" plain @click="openEditDialog(sk)">编辑</el-button>
              <el-popconfirm
                title="确定删除此子密钥？"
                @confirm="deleteSubkey(sk.id)"
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
      </div>
    </el-card>

    <!-- Create Sub-key Dialog -->
    <el-dialog v-model="showCreateDialog" title="创建子密钥" width="520px" class="dark-dialog">
      <el-form :model="createForm" label-width="90px" require-asterisk-position="right">
        <el-form-item label="所属父 Key" prop="parent_key_id" :rules="[{ required: true, message: '请选择父 Key' }]">
          <el-select v-model="createForm.parent_key_id" placeholder="选择父 Key" style="width: 100%">
            <el-option
              v-for="pk in parentKeys"
              :key="pk.id"
              :label="pk.name"
              :value="pk.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="createForm.name" placeholder="如：AI助手项目" maxlength="100" />
        </el-form-item>
        <el-form-item label="额度上限" prop="quota_limit">
          <el-input-number
            v-model="createForm.quota_limit"
            :min="0"
            :step="1"
            :precision="2"
            placeholder="0 = 不限制"
            style="width: 100%"
          />
          <div class="form-tip">设为 0 表示不限制额度</div>
        </el-form-item>
        <el-form-item label="允许模型" prop="allowed_models">
          <el-select
            v-model="createForm.allowed_models"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="留空则不限制模型"
            style="width: 100%"
          >
            <el-option
              v-for="m in availableModels"
              :key="m.model_id"
              :label="m.name"
              :value="m.model_id"
            />
          </el-select>
          <div class="form-tip">留空表示不限制模型，可多选或输入自定义模型 ID</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" :loading="creating" @click="createSubkey">创建</el-button>
      </template>
    </el-dialog>

    <!-- Key Result Dialog -->
    <el-dialog v-model="showKeyResult" title="子密钥创建成功" width="500px" class="dark-dialog">
      <el-alert type="warning" :closable="false" show-icon>
        <template #title>请立即复制保存，关闭后将无法再次查看完整密钥</template>
      </el-alert>
      <div style="margin-top:16px">
        <el-input v-model="newSubKey" readonly class="key-result-input">
          <template #append>
            <el-button @click="copyToClipboard(newSubKey)">复制</el-button>
          </template>
        </el-input>
      </div>
      <template #footer>
        <el-button type="primary" @click="showKeyResult = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- Edit Sub-key Dialog -->
    <el-dialog v-model="showEditDialog" title="编辑子密钥" width="520px" class="dark-dialog">
      <el-form :model="editForm" label-width="90px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" placeholder="子密钥名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="额度上限">
          <el-input-number
            v-model="editForm.quota_limit"
            :min="0"
            :step="1"
            :precision="2"
            placeholder="0 = 不限制"
            style="width: 100%"
          />
          <div class="form-tip">设为 0 表示不限制额度</div>
        </el-form-item>
        <el-form-item label="允许模型">
          <el-select
            v-model="editForm.allowed_models"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="留空则不限制模型"
            style="width: 100%"
          >
            <el-option
              v-for="m in availableModels"
              :key="m.model_id"
              :label="m.name"
              :value="m.model_id"
            />
          </el-select>
          <div class="form-tip">留空表示不限制模型</div>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="editForm.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="disabled">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { View, Hide, Copy, Clock, Plus } from '@element-plus/icons-vue';
import api from '../api/index.js';

const subkeys = ref([]);
const parentKeys = ref([]);
const availableModels = ref([]);
const loading = ref(false);
const showCreateDialog = ref(false);
const showKeyResult = ref(false);
const showEditDialog = ref(false);
const creating = ref(false);
const saving = ref(false);
const newSubKey = ref('');

const createForm = ref({
  parent_key_id: null,
  name: '',
  quota_limit: 0,
  allowed_models: [],
});

const editForm = ref({
  id: null,
  name: '',
  quota_limit: 0,
  allowed_models: [],
  status: 'active',
});

function maskKey(key) {
  if (!key) return '—';
  return key.slice(0, 12) + '••••••••' + key.slice(-4);
}

function isQuotaWarning(sk) {
  if (sk.quota_limit === 0) return false;
  const pct = sk.quota_used / sk.quota_limit;
  return pct >= 0.8 && pct < 1.0;
}

function isQuotaExceeded(sk) {
  if (sk.quota_limit === 0) return false;
  return sk.quota_used >= sk.quota_limit;
}

function quotaColor(sk) {
  if (isQuotaExceeded(sk)) return '#f56c6c';
  if (isQuotaWarning(sk)) return '#e6a23c';
  return '#67c23a';
}

async function fetchParentKeys() {
  try {
    const { data } = await api.get('/keys');
    parentKeys.value = data.data || [];
    if (parentKeys.value.length && !createForm.value.parent_key_id) {
      createForm.value.parent_key_id = parentKeys.value[0].id;
    }
  } catch (e) {
    // ignore
  }
}

async function fetchModels() {
  try {
    const { data } = await api.get('/models');
    availableModels.value = data.data || [];
  } catch (e) {
    availableModels.value = [];
  }
}

async function fetchSubkeys() {
  loading.value = true;
  try {
    const { data } = await api.get('/subkeys');
    subkeys.value = (data.data || []).map(sk => ({ ...sk, _shown: false, _loading: false }));
  } catch (e) {
    ElMessage.error('获取子密钥列表失败');
  } finally {
    loading.value = false;
  }
}

async function createSubkey() {
  if (!createForm.value.parent_key_id) {
    ElMessage.warning('请选择父 Key');
    return;
  }
  creating.value = true;
  try {
    const { data } = await api.post('/subkeys', {
      parent_key_id: createForm.value.parent_key_id,
      name: createForm.value.name,
      quota_limit: createForm.value.quota_limit,
      allowed_models: createForm.value.allowed_models,
    });
    newSubKey.value = data.sub_key;
    showCreateDialog.value = false;
    showKeyResult.value = true;
    createForm.value = { parent_key_id: parentKeys.value[0]?.id || null, name: '', quota_limit: 0, allowed_models: [] };
    subkeys.value.unshift({ ...data, _shown: false, _loading: false });
  } catch (e) {
    ElMessage.error('创建失败');
  } finally {
    creating.value = false;
  }
}

async function updateSubkey(sk, field, value) {
  sk._loading = true;
  try {
    await api.patch(`/subkeys/${sk.id}`, { [field]: value });
    ElMessage.success('已更新');
  } catch (e) {
    // revert
    if (field === 'status') {
      sk.status = sk.status === 'active' ? 'disabled' : 'active';
    }
    ElMessage.error('更新失败');
  } finally {
    sk._loading = false;
  }
}

function openEditDialog(sk) {
  editForm.value = {
    id: sk.id,
    name: sk.name,
    quota_limit: sk.quota_limit,
    allowed_models: [...(sk.allowed_models || [])],
    status: sk.status,
  };
  showEditDialog.value = true;
}

async function saveEdit() {
  saving.value = true;
  try {
    const updated = await api.patch(`/subkeys/${editForm.value.id}`, {
      name: editForm.value.name,
      quota_limit: editForm.value.quota_limit,
      allowed_models: editForm.value.allowed_models,
      status: editForm.value.status,
    });
    const idx = subkeys.value.findIndex(sk => sk.id === editForm.value.id);
    if (idx !== -1) {
      subkeys.value[idx] = { ...subkeys.value[idx], ...updated.data, _shown: subkeys.value[idx]._shown };
    }
    showEditDialog.value = false;
    ElMessage.success('已保存');
  } catch (e) {
    ElMessage.error('保存失败');
  } finally {
    saving.value = false;
  }
}

async function deleteSubkey(id) {
  try {
    await api.delete(`/subkeys/${id}`);
    subkeys.value = subkeys.value.filter(sk => sk.id !== id);
    ElMessage.success('已删除');
  } catch (e) {
    ElMessage.error('删除失败');
  }
}

function toggleShow(sk) {
  sk._shown = !sk._shown;
}

function copyKey(sk) {
  navigator.clipboard.writeText(sk.sub_key).then(() => ElMessage.success('已复制'));
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => ElMessage.success('已复制'));
}

onMounted(() => {
  fetchParentKeys();
  fetchModels();
  fetchSubkeys();
});
</script>

<style scoped>
.subkeys-page {}

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

/* Subkeys List */
.subkeys-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subkey-card {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px;
  transition: all var(--duration-fast) var(--ease-out);
}

.subkey-card:hover {
  border-color: var(--border-default);
}

.subkey-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.subkey-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subkey-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: var(--text-base);
}

.parent-key-tag {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.subkey-status-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

/* Quota */
.quota-section {
  margin-bottom: 12px;
}

.quota-info {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 10px 14px;
}

.quota-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.quota-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.quota-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.quota-value.quota-warning {
  color: #e6a23c;
}

.quota-value.quota-exceeded {
  color: #f56c6c;
}

.quota-bar-wrapper {
  margin-top: 4px;
}

/* Models */
.models-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.section-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  flex-shrink: 0;
  line-height: 24px;
}

.model-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.model-tag {
  font-size: 11px;
}

/* Key Display */
.subkey-key-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--key-bg);
  border: 1px solid var(--key-border);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  margin-bottom: 12px;
}

.subkey-key-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--key-visible);
  white-space: nowrap;
}

.subkey-key-actions {
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

/* Footer */
.subkey-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-subtle);
  padding-top: 12px;
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

.footer-actions {
  display: flex;
  gap: 8px;
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

.form-tip {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
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
</style>
