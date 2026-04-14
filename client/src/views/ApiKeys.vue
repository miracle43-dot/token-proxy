<template>
  <div>
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center">
      <div>
        <h1>API Keys</h1>
        <p>管理你的API密钥，用于调用AI接口</p>
      </div>
      <button class="btn btn-primary" @click="showCreateModal = true">+ 创建新Key</button>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">我的密钥 ({{ apiKeys.length }})</div>
      </div>

      <div v-if="apiKeys.length" class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>名称</th>
              <th>Key</th>
              <th>余额</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="key in apiKeys" :key="key.id">
              <td>{{ key.name }}</td>
              <td><code style="font-size:12px;background:#f3f4f6;padding:2px 6px;border-radius:4px">{{ key.key_preview }}</code></td>
              <td>¥{{ key.balance.toFixed(4) }}</td>
              <td><span :class="['badge', key.is_active ? 'badge-success' : 'badge-danger']">{{ key.is_active ? '启用' : '禁用' }}</span></td>
              <td>{{ new Date(key.created_at).toLocaleString() }}</td>
              <td>
                <button class="btn btn-sm btn-outline" @click="toggleKey(key)">{{ key.is_active ? '禁用' : '启用' }}</button>
                <button class="btn btn-sm btn-danger" @click="deleteKey(key)" style="margin-left:6px">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <div class="empty-state-icon">🔑</div>
        <p>还没有API Key</p>
        <p style="margin-top:8px"><button class="btn btn-primary btn-sm" @click="showCreateModal = true">创建第一个Key</button></p>
      </div>
    </div>

    <!-- 创建Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <h2 class="modal-title">创建新的API Key</h2>
        <form @submit.prevent="createKey">
          <div class="form-group">
            <label class="form-label">密钥名称（可选）</label>
            <input v-model="newKeyName" type="text" class="form-input" placeholder="例如：我的GPT Key" />
          </div>
          <div style="display:flex;gap:12px;margin-top:24px">
            <button type="button" class="btn btn-outline" @click="showCreateModal = false" style="flex:1">取消</button>
            <button type="submit" class="btn btn-primary" style="flex:1" :disabled="creating">创建</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 成功Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click.self="showSuccessModal = false">
      <div class="modal">
        <h2 class="modal-title">✅ API Key 创建成功</h2>
        <div class="api-key-warning">⚠️ 安全提示：请妥善保管此Key，只显示这一次！</div>
        <div class="api-key-box">{{ newCreatedKey }}</div>
        <button class="btn btn-primary" @click="copyKey" style="width:100%;margin-top:12px">复制到剪贴板</button>
        <button class="btn btn-outline" @click="showSuccessModal = false" style="width:100%;margin-top:8px">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const showToast = inject('showToast')
const apiKeys = ref([])
const showCreateModal = ref(false)
const showSuccessModal = ref(false)
const newKeyName = ref('')
const creating = ref(false)
const newCreatedKey = ref('')

onMounted(() => fetchKeys())

async function fetchKeys() {
  const res = await authStore.api.get('/api-keys')
  apiKeys.value = res.data.apiKeys || []
}

async function createKey() {
  creating.value = true
  try {
    const res = await authStore.api.post('/api-keys', { name: newKeyName.value })
    newCreatedKey.value = res.data.apiKey.key
    showCreateModal.value = false
    showSuccessModal.value = true
    newKeyName.value = ''
    await fetchKeys()
  } catch (e) {
    showToast(e.response?.data?.error || '创建失败', 'error')
  } finally {
    creating.value = false
  }
}

async function toggleKey(key) {
  try {
    await authStore.api.patch(`/api-keys/${key.id}/toggle`)
    showToast(`${key.is_active ? '禁用' : '启用'}成功`)
    await fetchKeys()
  } catch (e) {
    showToast(e.response?.data?.error || '操作失败', 'error')
  }
}

async function deleteKey(key) {
  if (!confirm(`确定要删除 Key "${key.name}" 吗？此操作不可恢复。`)) return
  try {
    await authStore.api.delete(`/api-keys/${key.id}`)
    showToast('删除成功')
    await fetchKeys()
  } catch (e) {
    showToast(e.response?.data?.error || '删除失败', 'error')
  }
}

function copyKey() {
  navigator.clipboard.writeText(newCreatedKey.value)
  showToast('已复制到剪贴板')
}
</script>
