<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card>
          <template #header><span>在线充值（预留）</span></template>
          <el-form label-width="100px">
            <el-form-item label="充值金额">
              <el-input-number v-model="amount" :min="1" :max="10000" :step="10" />
            </el-form-item>
            <el-form-item label="支付方式">
              <el-select v-model="payMethod" placeholder="选择支付方式">
                <el-option label="微信支付（即将支持）" value="wechat" disabled />
                <el-option label="支付宝（即将支持）" value="alipay" disabled />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="true" @click="createOrder">
                创建充值订单
              </el-button>
              <span style="color:#999;font-size:12px;margin-left:12px">* 支付功能接入中，请联系客服充值</span>
            </el-form-item>
          </el-form>

          <el-divider />

          <div class="recharge-tips">
            <h4>充值说明</h4>
            <ul>
              <li>充值金额即时到账</li>
              <li>余额可全额用于 API 调用</li>
              <li>余额永不过期</li>
              <li>如需大额充值或对公转账，请联系客服</li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header><span>充值记录</span></template>
          <el-table :data="orders" stripe>
            <el-table-column prop="order_id" label="订单号" min-width="200" />
            <el-table-column prop="amount" label="金额">
              <template #default="{ row }"> ¥{{ row.amount }} </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="时间" :formatter="(r) => r.created_at?.slice(0, 10)" />
          </el-table>
          <el-empty v-if="!orders.length" description="暂无充值记录" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import api from '../api/index.js';

const amount = ref(100);
const payMethod = ref('');
const orders = ref([]);

async function fetchOrders() {
  try {
    const { data } = await api.get('/recharge/orders');
    orders.value = data.data;
  } catch (e) { /* ignore */ }
}

async function createOrder() {
  ElMessage.info('支付功能接入中，请联系客服充值');
}

function statusType(s) {
  return { pending: 'warning', completed: 'success', failed: 'danger' }[s] || 'info';
}

function statusText(s) {
  return { pending: '处理中', completed: '已完成', failed: '失败' }[s] || s;
}

onMounted(fetchOrders);
</script>

<style scoped>
.recharge-tips h4 { margin-bottom: 8px; font-size: 14px; }
.recharge-tips ul { padding-left: 20px; color: #666; font-size: 13px; line-height: 1.8; }
</style>
