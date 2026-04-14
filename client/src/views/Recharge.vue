<template>
  <div>
    <div class="page-header">
      <h1>充值中心</h1>
      <p>当前余额：<strong style="color:var(--success)">¥{{ balance.toFixed(4) }}</strong></p>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">选择充值金额</div>
      </div>
      <div class="recharge-packages">
        <div v-for="pkg in packages" :key="pkg.amount"
          :class="['recharge-package', selectedAmount === pkg.amount ? 'selected' : '']"
          @click="selectedAmount = pkg.amount">
          <div class="recharge-amount">¥{{ pkg.amount }}</div>
          <div v-if="pkg.bonus > 0" class="recharge-bonus">送 ¥{{ pkg.bonus }}</div>
          <div v-else style="height:20px"></div>
        </div>
      </div>

      <div style="margin-top:24px">
        <button class="btn btn-primary" :disabled="!selectedAmount || processing" @click="createOrder">
          {{ processing ? '创建订单中...' : `立即充值 ¥${selectedAmount}` }}
        </button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">充值说明</div>
      </div>
      <ul style="font-size:14px;color:var(--text-secondary);padding-left:20px;line-height:2">
        <li>充值实时到账，无延迟</li>
        <li>余额永久有效，支持查看充值记录</li>
        <li>支付渠道：微信支付、支付宝（对接中）</li>
        <li>如有充值问题，请联系客服</li>
      </ul>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">充值记录</div>
      </div>
      <table class="table">
        <thead>
          <tr><th>订单号</th><th>金额</th><th>状态</th><th>时间</th></tr>
        </thead>
        <tbody>
          <tr v-for="t in transactions.filter(t => t.type === 'recharge')" :key="t.id">
            <td><code style="font-size:12px">{{ t.description?.match(/ORD[A-Z0-9]+/)?.[0] || '-' }}</code></td>
            <td style="color:var(--success)">+¥{{ t.amount.toFixed(2) }}</td>
            <td><span class="badge badge-success">已完成</span></td>
            <td>{{ new Date(t.created_at).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!transactions.filter(t => t.type === 'recharge').length" class="empty-state">暂无充值记录</div>
    </div>

    <!-- 开发测试: 模拟支付成功 -->
    <div class="card" style="border:2px dashed var(--warning)">
      <div class="card-header">
        <div class="card-title">🔧 开发测试</div>
      </div>
      <p style="font-size:14px;color:var(--text-secondary);margin-bottom:12px">点击下方按钮模拟支付成功（仅开发环境可用）</p>
      <button class="btn btn-outline" @click="mockCallback" :disabled="!pendingOrderId">
        {{ pendingOrderId ? `模拟支付订单 ${pendingOrderId}` : '无待支付订单' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()
const showToast = inject('showToast')
const packages = ref([])
const selectedAmount = ref(null)
const processing = ref(false)
const transactions = ref([])
const pendingOrderId = ref(null)

onMounted(async () => {
  await authStore.fetchUser()
  balance.value = authStore.user?.balance || 0
  const res = await authStore.api.get('/api/recharge/packages')
  packages.value = res.data.packages || []
  const txRes = await authStore.api.get('/api/user/transactions')
  transactions.value = txRes.data.transactions || []
})

const balance = ref(0)

async function createOrder() {
  processing.value = true
  try {
    const res = await authStore.api.post('/api/recharge/orders', { amount: selectedAmount.value })
    pendingOrderId.value = res.data.order_id
    // 暂时模拟支付
    await mockCallback()
  } catch (e) {
    showToast(e.response?.data?.error || '创建订单失败', 'error')
  } finally {
    processing.value = false
  }
}

async function mockCallback() {
  if (!pendingOrderId.value) return
  try {
    const res = await authStore.api.post(`/api/recharge/orders/${pendingOrderId.value}/mock-callback`)
    showToast(`充值成功！当前余额：¥${res.data.balance.toFixed(4)}`)
    balance.value = res.data.balance
    pendingOrderId.value = null
    const txRes = await authStore.api.get('/api/user/transactions')
    transactions.value = txRes.data.transactions || []
  } catch (e) {
    showToast(e.response?.data?.error || '模拟支付失败', 'error')
  }
}
</script>
