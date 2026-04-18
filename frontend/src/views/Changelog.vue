<template>
  <div>
    <el-card class="dark-card">
      <template #header>
        <span class="card-title">更新日志</span>
      </template>

      <div class="timeline">
        <div v-for="entry in changelog" :key="entry.version" class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="version-row">
              <span class="version-tag">v{{ entry.version }}</span>
              <span class="version-date">{{ entry.date }}</span>
              <el-tag v-if="entry.type === 'major'" type="warning" size="small">大版本</el-tag>
              <el-tag v-else-if="entry.type === 'fix'" type="success" size="small">修复</el-tag>
              <el-tag v-else type="info" size="small">更新</el-tag>
            </div>
            <ul>
              <li v-for="(item, idx) in entry.changes" :key="idx">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const changelog = [
  {
    version: '1.2.0',
    date: '2026-04-18',
    type: 'major',
    changes: [
      '新增 Google Gemini 系列模型支持',
      '新增用量预警功能，可设置余额阈值提醒',
      '支持子 Key（SubKey）管理，适合多用户场景',
      '全新 Playground 页面，支持在线调试 API',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-04-14',
    type: 'update',
    changes: [
      '新增 Anthropic Claude 系列模型',
      '优化计费精度，支持小数点后6位',
      '改进仪表盘，展示更丰富的用量图表',
      '修复偶发的 Key 列表加载失败问题',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-04-12',
    type: 'major',
    changes: [
      '平台正式上线',
      '支持 OpenAI 全系列模型（GPT-4o、GPT-4-Turbo、GPT-3.5-Turbo 等）',
      '提供用户注册登录、API Key 管理、余额充值',
      '实现 Token 按量计费体系',
    ],
  },
];
</script>

<style scoped>
.card-title {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--text-primary);
}

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
  padding: 24px 20px;
}

.timeline {
  position: relative;
  padding-left: 24px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--border-subtle);
}

.timeline-item {
  position: relative;
  margin-bottom: 28px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -20px;
  top: 6px;
  width: 10px;
  height: 10px;
  background: var(--bg-elevated);
  border: 2px solid var(--border-default);
  border-radius: 50%;
}

.timeline-content {
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 16px 20px;
}

.version-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.version-tag {
  font-weight: 700;
  font-size: var(--text-sm);
  color: var(--text-primary);
}

.version-date {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.timeline-content ul {
  margin: 0;
  padding-left: 20px;
}

.timeline-content li {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 4px;
}

.timeline-content li:last-child {
  margin-bottom: 0;
}
</style>
