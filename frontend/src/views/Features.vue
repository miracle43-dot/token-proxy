<template>
  <div>
    <el-card class="dark-card">
      <template #header>
        <span class="card-title">功能介绍</span>
      </template>

      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-item">
          <div class="feature-icon">
            <span v-html="feature.icon"></span>
          </div>
          <div class="feature-content">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const features = [
  {
    icon: '<svg width="24" height="24" fill="none" stroke="#3b82f6" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    title: '多模型聚合',
    desc: '支持 OpenAI、Anthropic、Google 等多家主流大模型，一个 API Key 轻松切换。',
  },
  {
    icon: '<svg width="24" height="24" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v20M2 12h20"/></svg>',
    title: '按量计费',
    desc: '精确到 Token 的计费方式，用多少付多少，无套餐捆绑，支持随时充值。',
  },
  {
    icon: '<svg width="24" height="24" fill="none" stroke="#8b5cf6" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    title: 'API Key 管理',
    desc: '在线生成、删除、查看用量，完整审计日志，Key 安全可控。',
  },
  {
    icon: '<svg width="24" height="24" fill="none" stroke="#f59e0b" stroke-width="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    title: '用量统计',
    desc: '实时查看各模型的调用量、费用消耗，清晰了解每一分钱的去向。',
  },
  {
    icon: '<svg width="24" height="24" fill="none" stroke="#ef4444" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    title: '低延迟转发',
    desc: '自建高速转发通道，99.9% 可用性保障，响应速度与官方源基本一致。',
  },
  {
    icon: '<svg width="24" height="24" fill="none" stroke="#06b6d4" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    title: '开发者友好',
    desc: '兼容 OpenAI API 格式，只需替换 Endpoint，无缝迁移现有应用。',
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.feature-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: border-color 0.2s;
}

.feature-item:hover {
  border-color: var(--border-default);
}

.feature-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  border-radius: var(--radius-sm);
}

.feature-content h3 {
  margin: 0 0 8px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.feature-content p {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
