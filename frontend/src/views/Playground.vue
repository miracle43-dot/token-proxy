<template>
  <div>
    <el-alert type="info" :closable="false" style="margin-bottom:16px">
      <template #title>API 调试台</template>
      <template #default>
        选择模型、输入消息，即可调用 AI。调用会从您的余额中扣除费用。
      </template>
    </el-alert>

    <el-row :gutter="16">
      <!-- 左侧：配置和消息 -->
      <el-col :span="16">
        <el-card style="margin-bottom:16px">
          <template #header>
            <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
              <span style="font-weight:600">模型</span>
              <el-select v-model="config.model" style="width:220px" placeholder="选择模型">
                <el-option v-for="m in models" :key="m.model_id" :label="`${m.name} (${m.model_id})`" :value="m.model_id" />
              </el-select>
              <el-checkbox v-model="config.stream" label="流式输出 (stream)" />
            </div>
          </template>

          <!-- 消息列表 -->
          <div class="messages" ref="messagesEl">
            <div v-for="(msg, i) in messages" :key="i" class="message" :class="msg.role">
              <div class="msg-role">{{ msg.role === 'user' ? '你' : 'AI' }}</div>
              <div class="msg-content">{{ msg.content }}</div>
            </div>
            <div v-if="aiResponse" class="message assistant">
              <div class="msg-role">AI</div>
              <div class="msg-content">{{ aiResponse }}</div>
            </div>
          </div>

          <!-- 输入区 -->
          <div class="input-area">
            <el-input
              v-model="userInput"
              type="textarea"
              :rows="3"
              placeholder="输入你的问题... (Shift+Enter 换行，Enter 发送)"
              @keydown.enter.exact.prevent="sendMessage"
              :disabled="loading"
            />
            <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
              <span style="font-size:12px;color:#888">
                {{ loading ? 'AI 正在思考...' : 'Enter 发送，Shift+Enter 换行' }}
              </span>
              <el-button type="primary" :loading="loading" @click="sendMessage" :disabled="!userInput.trim()">
                发送
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：参数配置 -->
      <el-col :span="8">
        <el-card style="margin-bottom:16px">
          <template #header><span>请求参数</span></template>
          <el-form label-width="80px" size="small">
            <el-form-item label="Temperature">
              <el-slider v-model="config.temperature" :min="0" :max="2" :step="0.1" show-input />
            </el-form-item>
            <el-form-item label="Max Tokens">
              <el-input-number v-model="config.max_tokens" :min="1" :max="128000" :step="100" />
            </el-form-item>
            <el-form-item label="Top P">
              <el-slider v-model="config.top_p" :min="0" :max="1" :step="0.05" show-input />
            </el-form-item>
            <el-form-item>
              <el-button @click="clearMessages" size="small">清空对话</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 费用预估 -->
        <el-card>
          <template #header><span>本次请求预估</span></template>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="模型">{{ config.model }}</el-descriptions-item>
            <el-descriptions-item label="历史 Tokens">
              ~{{ totalTokens.toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="预估费用">
              ~¥{{ estimatedCost.toFixed(4) }}
            </el-descriptions-item>
          </el-descriptions>

          <el-divider />

          <h4>使用你的 API Key</h4>
          <p style="font-size:13px;color:#666;line-height:1.6">
            在代码中调用，将 baseURL 替换为：
            <code style="background:#f5f5f5;padding:2px 4px;border-radius:3px">{{ apiBaseUrl }}</code>
          </p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user.js';
import api from '../api/index.js';

const userStore = useUserStore();
const models = ref([]);
const messagesEl = ref();
const messages = ref([]);
const userInput = ref('');
const aiResponse = ref('');
const loading = ref(false);

const config = ref({
  model: 'gpt-4o-mini',
  temperature: 0.7,
  max_tokens: 2048,
  top_p: 1,
  stream: true,
});

const apiBaseUrl = computed(() => {
  return window.location.hostname === 'localhost'
    ? 'http://localhost:3001/v1'
    : `${window.location.origin}/v1`;
});

const totalTokens = computed(() => {
  return messages.value.reduce((acc, m) => {
    return acc + (m._tokens || 0);
  }, 0);
});

const estimatedCost = computed(() => {
  const model = models.value.find(m => m.model_id === config.value.model);
  if (!model) return 0;
  const tokens = totalTokens.value + (config.value.max_tokens || 2048);
  return (tokens * model.input_price) / 1_000_000;
});

function clearMessages() {
  messages.value = [];
  aiResponse.value = '';
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight;
    }
  });
}

async function sendMessage() {
  const content = userInput.value.trim();
  if (!content || loading.value) return;

  const userMsg = { role: 'user', content };
  messages.value.push(userMsg);
  userInput.value = '';
  aiResponse.value = '';
  loading.value = true;
  scrollToBottom();

  const token = userStore.token;
  const body = {
    model: config.value.model,
    messages: messages.value.map(({ role, content }) => ({ role, content })),
    temperature: config.value.temperature,
    max_tokens: config.value.max_tokens,
    top_p: config.value.top_p,
    stream: config.value.stream,
  };

  try {
    if (config.value.stream) {
      // 流式响应
      const response = await fetch('/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: { message: '请求失败' } }));
        ElMessage.error(err.error?.message || `错误 ${response.status}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      aiResponse.value = '';
      messages.value.push({ role: 'assistant', content: '' });
      const lastIdx = messages.value.length - 1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || '';
              if (delta) {
                messages.value[lastIdx].content += delta;
                aiResponse.value += delta;
                scrollToBottom();
              }
            } catch { /* ignore parse errors */ }
          }
        }
      }
    } else {
      // 非流式
      const { data } = await api.post('/chat/completions', body, {
        baseURL: '/v1',
        headers: { Authorization: `Bearer ${token}` },
      });

      const reply = data.choices?.[0]?.message?.content || '';
      messages.value.push({ role: 'assistant', content: reply });
      aiResponse.value = reply;
      scrollToBottom();
    }
  } catch (err) {
    ElMessage.error(err.response?.data?.error?.message || err.message || '调用失败');
    messages.value.pop(); // 移除 user message
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/models');
    models.value = data.data;
    if (models.value.length && !config.value.model) {
      config.value.model = models.value[0].model_id;
    }
  } catch (e) { /* ignore */ }
});
</script>

<style scoped>
.messages {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
  padding: 8px 0;
}
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}
.msg-role {
  min-width: 40px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  padding-top: 2px;
}
.msg-content {
  flex: 1;
  background: #f5f5f5;
  padding: 10px 14px;
  border-radius: 8px;
  white-space: pre-wrap;
  font-size: 14px;
  line-height: 1.6;
  max-width: 85%;
}
.message.user { flex-direction: row-reverse; }
.message.user .msg-content { background: #e8f0fe; }
.message.assistant .msg-content { background: #f0f0f0; }
</style>
