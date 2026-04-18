<template>
  <div class="recharge-page">

    <!-- ====== 顶部：余额 + 用量预估 ====== -->
    <div class="balance-banner">
      <div class="balance-info">
        <span class="balance-label">当前余额</span>
        <span class="balance-amount">¥{{ balance.toFixed(2) }}</span>
      </div>
      <div class="balance-divider" />
      <div class="usage-estimator">
        <span class="estimator-label">用量预估</span>
        <div class="estimator-result">
          <span class="estimator-value">{{ estimatedTokens }}</span>
          <span class="estimator-unit">tokens</span>
          <span class="estimator-note">（基于 GPT-4o 输入价格）</span>
        </div>
      </div>
    </div>

    <!-- ====== 左侧：充值区 ====== -->
    <div class="recharge-main">

      <!-- 套餐卡片区 -->
      <el-card class="dark-card section-card">
        <template #header>
          <div class="section-header">
            <span class="card-title">选择充值套餐</span>
            <span class="balance-hint">余额 ¥{{ balance.toFixed(2) }}</span>
          </div>
        </template>

        <!-- 套餐网格 -->
        <div class="package-grid">
          <div
            v-for="pkg in packages"
            :key="pkg.id"
            class="package-card"
            :class="{
              'package-card--selected': selectedPkg?.id === pkg.id,
              'package-card--recommended': pkg.recommended
            }"
            @click="selectPackage(pkg)"
          >
            <div v-if="pkg.recommended" class="recommended-tag">推荐</div>
            <div class="pkg-price">¥{{ pkg.price }}</div>
            <div class="pkg-name">{{ pkg.name }}</div>
            <div class="pkg-tokens">{{ pkg.tokensLabel }}</div>
            <div v-if="pkg.bonus" class="pkg-bonus">+ ¥{{ pkg.bonus }} 赠送</div>
            <div v-if="selectedPkg?.id === pkg.id" class="pkg-check">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- 自定义金额卡片 -->
          <div
            class="package-card package-card--custom"
            :class="{ 'package-card--selected': isCustomAmount }"
            @click="enterCustomMode"
          >
            <div class="pkg-price">自定义</div>
            <div class="pkg-name">输入金额</div>
            <div class="pkg-tokens">任意充值</div>
          </div>
        </div>

        <!-- 自定义金额输入 -->
        <div v-if="isCustomMode" class="custom-amount-row">
          <span class="custom-yen">¥</span>
          <el-input-number
            v-model="customAmount"
            :min="1"
            :max="10000"
            :step="10"
            controls-position="right"
            class="custom-input"
            @change="onCustomAmountChange"
          />
          <span class="custom-tip">最低 ¥1，无上限</span>
        </div>

        <!-- 分隔线 -->
        <el-divider class="dark-divider" />

        <!-- 支付方式 -->
        <div class="pay-method-section">
          <div class="section-subtitle">支付方式</div>
          <div class="pay-methods">
            <div
              class="pay-method-btn"
              :class="{ 'pay-method-btn--active': payMethod === 'wechat' }"
              @click="payMethod = 'wechat'"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="pay-icon">
                <path d="M8.5 3.5C5.5 3.5 3 5.8 3 8.5C3 11.5 5.5 14 8.5 14C9.1 14 9.7 13.9 10.2 13.7L9 17H12L13.5 13.5C14.5 13.7 15.5 13.7 16.5 13.5C19.5 13.5 22 11.2 22 8.5C22 5.8 19.5 3.5 16.5 3.5H8.5Z" fill="#07C160"/>
              </svg>
              <span>微信支付</span>
              <div v-if="payMethod === 'wechat'" class="method-check">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L4.5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <div
              class="pay-method-btn"
              :class="{ 'pay-method-btn--active': payMethod === 'alipay' }"
              @click="payMethod = 'alipay'"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="pay-icon">
                <path d="M10.5 2C8 2 5.5 3.5 4 6L2 9.5C1.5 10.5 2 11.5 3 11.5H5L4 15C3.8 16 4.5 17 5.5 17H7C8 17 8.5 16.5 8.5 15.5L8 12H13L13.5 15.5C13.5 16.5 14 17 15 17H17C18 17 18.5 16 18 15L16 9C15.5 7 14 5 12 4C11.5 3.5 11 3 10.5 2Z" fill="#1677FF"/>
              </svg>
              <span>支付宝</span>
              <div v-if="payMethod === 'alipay'" class="method-check">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L4.5 8.5L9.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- 充值按钮 -->
        <div class="recharge-action">
          <el-button
            type="primary"
            size="large"
            class="recharge-btn"
            :disabled="!canRecharge"
            :loading="creatingOrder"
            @click="createOrder"
          >
            <span v-if="!creatingOrder">
              立即充值 {{ selectedDisplayAmount ? `¥${selectedDisplayAmount}` : '' }}
            </span>
            <span v-else>正在创建订单…</span>
          </el-button>

          <div class="security-note">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="lock-icon">
              <path d="M6 1L2 3V6C2 8.2 3.8 10.3 6 11C8.2 10.3 10 8.2 10 6V3L6 1Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            资金安全由 Stripe 保障
          </div>
        </div>

        <!-- 联系客服提示 -->
        <div class="contact-tip">
          大额充值或对公转账，请
          <span class="contact-link" @click="contactSupport">联系客服</span>
        </div>
      </el-card>

      <!-- 充值说明 -->
      <el-card class="dark-card tips-card">
        <template #header><span class="card-title">充值说明</span></template>
        <ul class="tips-list">
          <li>充值金额即时到账</li>
          <li>余额可全额用于 API 调用</li>
          <li>余额永不过期</li>
          <li>如需大额充值或对公转账，请联系客服</li>
        </ul>
      </el-card>
    </div>

    <!-- ====== 右侧：充值记录 ====== -->
    <div class="recharge-sidebar">
      <el-card class="dark-card">
        <template #header><span class="card-title">充值记录</span></template>

        <!-- 支付状态提示 -->
        <transition name="status-slide">
          <div v-if="payStatus" class="pay-status-banner" :class="`pay-status-banner--${payStatus.type}`">
            <div class="status-icon">
              <svg v-if="payStatus.type === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="payStatus.type === 'cancel'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 5V8.5M8 11H8.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="status-content">
              <div class="status-title">{{ payStatus.title }}</div>
              <div class="status-desc">{{ payStatus.desc }}</div>
            </div>
            <div v-if="payStatus.type === 'failed'" class="retry-btn" @click="retryPay">重新支付</div>
          </div>
        </transition>

        <el-table :data="orders" class="dark-table" stripe>
          <el-table-column prop="order_id" label="订单号" min-width="160" />
          <el-table-column prop="amount" label="金额" width="80">
            <template #default="{ row }"> ¥{{ row.amount }} </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
              <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="时间" width="100" :formatter="(r) => r.created_at?.slice(0, 10)" />
        </el-table>
        <el-empty v-if="!orders.length" description="暂无充值记录" />
      </el-card>
    </div>

    <!-- ====== 支付中间页 Dialog ====== -->
    <el-dialog
      v-model="payDialogVisible"
      title="扫码支付"
      width="420px"
      :close-on-click-modal="false"
      class="pay-dialog"
    >
      <div v-if="currentOrder" class="qr-content">
        <div class="qr-order-info">
          <span>订单号：{{ currentOrder.order_id }}</span>
          <span class="qr-amount">¥{{ currentOrder.amount }}</span>
        </div>
        <div class="qr-box">
          <!-- 二维码占位：实际由后端返回 qr_code_url -->
          <div class="qr-placeholder">
            <div class="qr-loading" v-if="!qrCodeUrl">
              <div class="spinner" />
              <span>生成支付二维码…</span>
            </div>
            <img v-else :src="qrCodeUrl" alt="支付二维码" class="qr-image" />
          </div>
        </div>
        <div class="qr-tip">
          <span v-if="payMethod === 'wechat'">请使用微信扫码支付</span>
          <span v-else>请使用支付宝扫码支付</span>
        </div>
        <div class="qr-countdown">
          <el-progress :percentage="qrCountdownPct" :show-text="false" :stroke-width="3" />
          <span class="countdown-text">{{ qrCountdown }}秒后二维码失效，请尽快支付</span>
        </div>
        <div class="qr-actions">
          <el-button size="small" @click="cancelPay">取消支付</el-button>
          <el-button size="small" type="primary" :loading="checkingPayStatus" @click="checkPayStatus">
            已支付，查看余额
          </el-button>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../api/index.js';

// ========== 套餐定义 ==========
const packages = [
  { id: 'pkg_10', price: 10,  name: '入门套餐',  tokensLabel: '10万 tokens', bonus: null,    recommended: false },
  { id: 'pkg_50', price: 50,  name: '标准套餐',  tokensLabel: '50万 tokens', bonus: null,    recommended: true  },
  { id: 'pkg_200', price: 200, name: '进阶套餐', tokensLabel: '210万 tokens', bonus: 10,     recommended: false },
  { id: 'pkg_500', price: 500, name: '专业套餐', tokensLabel: '550万 tokens', bonus: 50,     recommended: false },
];

// GPT-4o 输入价格参考：$0.005 / 1K tokens ≈ ¥0.036 / 1K tokens
// 这里用简化的换算：¥1 ≈ 2.7万 tokens
const YUAN_TO_TOKENS = 27000;

const balance = ref(0);
const selectedPkg = ref(packages[1]); // 默认选"标准套餐"
const isCustomMode = ref(false);
const customAmount = ref(50);
const payMethod = ref('alipay');
const orders = ref([]);
const creatingOrder = ref(false);
const isCustomAmount = ref(false);

// 支付中间页
const payDialogVisible = ref(false);
const currentOrder = ref(null);
const qrCodeUrl = ref('');
const qrCountdown = ref(300); // 5分钟
let qrCountdownTimer = null;

// 支付状态 banner
const payStatus = ref(null);

// ========== 计算属性 ==========
const effectiveAmount = computed(() => {
  if (isCustomMode.value) return customAmount.value;
  return selectedPkg.value?.price ?? 0;
});

const selectedDisplayAmount = computed(() => effectiveAmount.value > 0 ? effectiveAmount.value : null);

const estimatedTokens = computed(() => {
  const t = Math.floor(effectiveAmount.value * YUAN_TO_TOKENS);
  if (t >= 10000) return `${(t / 10000).toFixed(1)}万`;
  return t.toLocaleString();
});

const canRecharge = computed(() => effectiveAmount.value > 0 && payMethod.value && !creatingOrder.value);

const qrCountdownPct = computed(() => (qrCountdown.value / 300) * 100);

// ========== 交互方法 ==========
function selectPackage(pkg) {
  selectedPkg.value = pkg;
  isCustomMode.value = false;
  isCustomAmount.value = false;
}

function enterCustomMode() {
  isCustomMode.value = true;
  isCustomAmount.value = true;
  selectedPkg.value = null;
}

function onCustomAmountChange() {
  isCustomMode.value = true;
  isCustomAmount.value = true;
  selectedPkg.value = null;
}

async function fetchBalance() {
  try {
    const { data } = await api.get('/user/balance');
    balance.value = data.balance ?? 0;
  } catch (e) { /* ignore */ }
}

async function fetchOrders() {
  try {
    const { data } = await api.get('/recharge/orders');
    orders.value = data.data ?? [];
  } catch (e) { /* ignore */ }
}

async function createOrder() {
  if (!canRecharge.value) return;
  creatingOrder.value = true;
  payStatus.value = null;

  try {
    const { data } = await api.post('/recharge/create', {
      amount: effectiveAmount.value,
      pay_method: payMethod.value,
    });

    currentOrder.value = data.order;
    qrCodeUrl.value = data.qr_code_url ?? '';
    qrCountdown.value = 300;
    startQrCountdown();

    payDialogVisible.value = true;
    ElMessage.info('订单已创建，请在 5 分钟内完成支付');
  } catch (e) {
    ElMessage.error(e.response?.data?.message ?? '创建订单失败，请重试');
  } finally {
    creatingOrder.value = false;
  }
}

function startQrCountdown() {
  clearInterval(qrCountdownTimer);
  qrCountdownTimer = setInterval(() => {
    if (qrCountdown.value <= 0) {
      clearInterval(qrCountdownTimer);
      payStatus.value = {
        type: 'failed',
        title: '支付超时',
        desc: '二维码已失效，请重新发起支付',
      };
      payDialogVisible.value = false;
      fetchOrders();
    } else {
      qrCountdown.value--;
    }
  }, 1000);
}

async function checkPayStatus() {
  if (!currentOrder.value) return;
  checkingPayStatus.value = true;
  try {
    const { data } = await api.get(`/recharge/order/${currentOrder.value.order_id}/status`);
    if (data.status === 'completed') {
      payDialogVisible.value = false;
      clearInterval(qrCountdownTimer);
      payStatus.value = {
        type: 'success',
        title: '支付成功',
        desc: `¥${currentOrder.value.amount} 已到账`,
      };
      await fetchBalance();
      await fetchOrders();
      ElMessage.success(`¥${currentOrder.value.amount} 已到账，当前余额 ¥${balance.value.toFixed(2)}`);
    } else if (data.status === 'pending') {
      ElMessage.info('支付确认中，请稍候…');
    } else {
      payStatus.value = {
        type: 'failed',
        title: '支付失败',
        desc: data.message ?? '支付未成功，请重试',
      };
      payDialogVisible.value = false;
    }
  } catch (e) {
    ElMessage.error('查询支付状态失败');
  } finally {
    checkingPayStatus.value = false;
  }
}

const checkingPayStatus = ref(false);

async function cancelPay() {
  payDialogVisible.value = false;
  clearInterval(qrCountdownTimer);
  payStatus.value = {
    type: 'cancel',
    title: '支付已取消',
    desc: '金额未扣除，可重新发起支付',
  };
  // 保留原订单，下次可以重试
  await fetchOrders();
}

async function retryPay() {
  payStatus.value = null;
  if (currentOrder.value) {
    // 用原订单重新唤起支付
    payDialogVisible.value = true;
    qrCodeUrl.value = '';
    qrCountdown.value = 300;
    startQrCountdown();
    // 重新获取二维码
    try {
      const { data } = await api.post('/recharge/qr', { order_id: currentOrder.value.order_id });
      qrCodeUrl.value = data.qr_code_url ?? '';
    } catch (e) {
      ElMessage.error('刷新支付二维码失败');
    }
  }
}

function contactSupport() {
  ElMessage.info('请添加客服微信：tokenproxy001');
}

function statusType(s) {
  return { pending: 'warning', completed: 'success', failed: 'danger' }[s] ?? 'info';
}

function statusText(s) {
  return { pending: '处理中', completed: '已完成', failed: '失败' }[s] ?? s;
}

onMounted(() => {
  fetchBalance();
  fetchOrders();
});

onUnmounted(() => {
  clearInterval(qrCountdownTimer);
});
</script>

<style scoped>
/* ====== 页面布局 ====== */
.recharge-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

/* ====== 余额 Banner ====== */
.balance-banner {
  display: flex;
  align-items: center;
  gap: 24px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px 28px;
  margin-bottom: 4px;
}

.balance-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.balance-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.balance-amount {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.balance-divider {
  width: 1px;
  height: 48px;
  background: var(--border-default);
}

.usage-estimator {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.estimator-label {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.estimator-result {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.estimator-value {
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--brand-primary-light);
  font-family: var(--font-mono);
}

.estimator-unit {
  font-size: var(--text-base);
  color: var(--text-secondary);
}

.estimator-note {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

/* ====== 双栏布局 ====== */
.recharge-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.recharge-sidebar {
  flex: 0 0 340px;
}

/* ====== 通用卡片 ====== */
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

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.balance-hint {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.card-title {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--text-primary);
}

/* ====== 套餐网格 ====== */
.package-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.package-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border: 1.5px solid var(--border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 200ms var(--ease-out);
  background: var(--bg-elevated);
  text-align: center;
  gap: 4px;
}

.package-card:hover {
  border-color: var(--brand-primary-light);
  background: rgba(124, 58, 237, 0.06);
  transform: translateY(-2px);
}

.package-card--selected {
  border-color: var(--brand-primary) !important;
  background: rgba(124, 58, 237, 0.12) !important;
  box-shadow: 0 0 0 1px var(--brand-primary), var(--shadow-dark-glow);
}

.package-card--recommended {
  border-color: rgba(124, 58, 237, 0.4);
}

.package-card--custom {
  border-style: dashed;
}

.recommended-tag {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--brand-gradient);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.pkg-price {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.pkg-name {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.pkg-tokens {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: 2px;
}

.pkg-bonus {
  font-size: 10px;
  color: var(--color-success);
  font-weight: 600;
  margin-top: 2px;
}

.pkg-check {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  background: var(--brand-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

/* ====== 自定义金额 ====== */
.custom-amount-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.custom-yen {
  font-size: var(--text-lg);
  color: var(--text-primary);
  font-weight: 600;
}

.custom-input {
  width: 160px;
}

.custom-tip {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

:deep(.custom-input .el-input__wrapper) {
  background: var(--bg-elevated);
  border-color: var(--border-default);
}

:deep(.custom-input .el-input__inner) {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: var(--text-lg);
}

/* ====== 支付方式 ====== */
.pay-method-section {
  margin-bottom: 20px;
}

.section-subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: 12px;
  font-weight: 500;
}

.pay-methods {
  display: flex;
  gap: 12px;
}

.pay-method-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1.5px solid var(--border-default);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 200ms var(--ease-out);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: var(--bg-elevated);
  position: relative;
  flex: 1;
}

.pay-method-btn:hover {
  border-color: var(--brand-primary-light);
  color: var(--text-primary);
}

.pay-method-btn--active {
  border-color: var(--brand-primary);
  background: rgba(124, 58, 237, 0.1);
  color: var(--text-primary);
}

.pay-icon {
  flex-shrink: 0;
}

.method-check {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 18px;
  height: 18px;
  background: var(--brand-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

/* ====== 充值按钮 ====== */
.recharge-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.recharge-btn {
  width: 100%;
  height: 48px;
  font-size: var(--text-lg);
  font-weight: 600;
  background: var(--brand-gradient) !important;
  border: none !important;
  border-radius: var(--radius-md);
  color: #fff !important;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  transition: all 200ms var(--ease-out);
}

.recharge-btn:not(:disabled):hover {
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.5);
  transform: translateY(-1px);
}

.recharge-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.security-note {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.lock-icon {
  color: var(--text-tertiary);
}

.contact-tip {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-tertiary);
}

.contact-link {
  color: var(--brand-primary-light);
  cursor: pointer;
  text-decoration: underline;
}

/* ====== 充值说明 ====== */
.tips-card {
  margin-top: 0;
}

.tips-list {
  padding-left: 20px;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: 2;
  margin: 0;
}

/* ====== 支付状态 Banner ====== */
.pay-status-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  margin-bottom: 16px;
  border: 1px solid;
}

.pay-status-banner--success {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--color-success);
}

.pay-status-banner--cancel {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: var(--color-warning);
}

.pay-status-banner--failed {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: var(--color-error);
}

.status-content {
  flex: 1;
}

.status-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: inherit;
}

.status-desc {
  font-size: var(--text-xs);
  opacity: 0.8;
  margin-top: 2px;
}

.retry-btn {
  font-size: var(--text-xs);
  color: var(--color-error);
  cursor: pointer;
  text-decoration: underline;
}

/* 状态切换动画 */
.status-slide-enter-active,
.status-slide-leave-active {
  transition: all 300ms var(--ease-out);
}

.status-slide-enter-from,
.status-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ====== 二维码 Dialog ====== */
.qr-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.qr-order-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  padding: 0 4px;
}

.qr-amount {
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-lg);
}

.qr-box {
  width: 220px;
  height: 220px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  width: 100%;
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qr-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border-default);
  border-top-color: var(--brand-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.qr-tip {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.qr-countdown {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.countdown-text {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-align: center;
}

.qr-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

/* ====== 分隔线 ====== */
.dark-divider {
  border-color: var(--border-subtle);
}

/* ====== 表格 ====== */
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

:deep(.dark-table .el-table__empty__text) {
  color: var(--text-tertiary);
}

/* ====== Dialog ====== */
:deep(.pay-dialog .el-dialog) {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
}

:deep(.pay-dialog .el-dialog__header) {
  border-bottom: 1px solid var(--border-subtle);
  padding: 16px 20px;
}

:deep(.pay-dialog .el-dialog__title) {
  color: var(--text-primary);
  font-weight: 600;
}

:deep(.pay-dialog .el-dialog__body) {
  padding: 24px;
}

:deep(.pay-dialog .el-dialog__footer) {
  border-top: 1px solid var(--border-subtle);
  padding: 16px 20px;
}
</style>
