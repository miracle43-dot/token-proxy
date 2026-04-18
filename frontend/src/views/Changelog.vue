<template>
  <div class="changelog-page">
    <section class="page-header">
      <div class="container">
        <p class="section-title">// release history</p>
        <h1 class="section-heading">更新日志</h1>
        <p class="section-sub">所有版本更新内容，持续迭代中</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="timeline">
          <div class="timeline-item" v-for="entry in changelog" :key="entry.version">
            <div class="timeline-marker">
              <span class="timeline-dot" :class="'dot-' + entry.type"></span>
              <span class="timeline-line"></span>
            </div>
            <div class="timeline-content terminal-card">
              <div class="entry-header">
                <div class="entry-meta">
                  <span class="entry-version mono">v{{ entry.version }}</span>
                  <span class="badge" :class="'badge-' + entry.type">
                    <span class="badge-dot" v-if="entry.type === 'major' || entry.type === 'minor'"></span>
                    {{ entry.typeLabel }}
                  </span>
                  <span class="mono entry-date">{{ entry.date }}</span>
                </div>
                <h3 class="entry-title">{{ entry.title }}</h3>
              </div>
              <ul class="entry-changes">
                <li v-for="change in entry.changes" :key="change" :class="'change-' + change.type">
                  <span class="change-prefix">{{ change.prefix }}</span>
                  {{ change.text }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const changelog = [
  {
    version: '2.4.1',
    type: 'minor',
    typeLabel: '补丁版本',
    date: '2026-04-17',
    title: '缓存命中率优化 + 稳定性修复',
    changes: [
      { type: 'improvement', prefix: '↑', text: 'Semantic Cache 命中率提升 23%，重复请求自动识别' },
      { type: 'bugfix', prefix: '🐛', text: '修复 DeepSeek R1 模型响应超时的重试逻辑' },
      { type: 'bugfix', prefix: '🐛', text: '修复用量报表时区显示不正确的问题' },
      { type: 'improvement', prefix: '↑', text: 'API 响应头增加 X-Cache-Hit 标识，方便调试' },
    ]
  },
  {
    version: '2.4.0',
    type: 'minor',
    typeLabel: '功能更新',
    date: '2026-04-15',
    title: 'DeepSeek 全模型上线 + Gemini 2.0 全面支持',
    changes: [
      { type: 'feature', prefix: '✨', text: '新增 DeepSeek V3 / R1 / Chat / Coder 四个模型' },
      { type: 'feature', prefix: '✨', text: 'Gemini 2.0 Pro / Flash / 1.5 系列支持' },
      { type: 'improvement', prefix: '↑', text: '路由层增加模型可用性探测，故障节点自动摘除' },
      { type: 'improvement', prefix: '↑', text: 'Dashboard 新增「模型分布」图表' },
    ]
  },
  {
    version: '2.3.0',
    type: 'minor',
    typeLabel: '功能更新',
    date: '2026-04-10',
    title: '团队权限系统 + API Key 分级',
    changes: [
      { type: 'feature', prefix: '✨', text: '团队成员管理：Owner / Admin / Member 三级权限' },
      { type: 'feature', prefix: '✨', text: 'API Key 标签管理 + 独立用量统计' },
      { type: 'feature', prefix: '✨', text: 'IP 白名单功能上线' },
      { type: 'bugfix', prefix: '🐛', text: '修复 Safari 浏览器下 Dashboard 图表显示异常' },
    ]
  },
  {
    version: '2.2.0',
    type: 'minor',
    typeLabel: '功能更新',
    date: '2026-04-06',
    title: '订阅套餐上线 + 自动充值',
    changes: [
      { type: 'feature', prefix: '✨', text: 'Hobby / Pro / Team 三档订阅套餐' },
      { type: 'feature', prefix: '✨', text: '余额自动充值，阈值自定义' },
      { type: 'improvement', prefix: '↑', text: '缓存策略升级：按语义相似度缓存，节省更多' },
    ]
  },
  {
    version: '2.1.0',
    type: 'minor',
    typeLabel: '功能更新',
    date: '2026-04-03',
    title: '用量告警系统',
    changes: [
      { type: 'feature', prefix: '✨', text: '多级用量告警：50% / 80% / 95% / 100%' },
      { type: 'feature', prefix: '✨', text: '邮件 + 飞书机器人通知' },
      { type: 'improvement', prefix: '↑', text: 'Dashboard 加载速度优化，首屏时间降低 40%' },
    ]
  },
  {
    version: '2.0.0',
    type: 'major',
    typeLabel: '重大更新',
    date: '2026-03-28',
    title: 'API v2 全新架构上线',
    changes: [
      { type: 'feature', prefix: '🚀', text: '全新 v2 API：RESTful + Streaming 全面支持' },
      { type: 'feature', prefix: '🚀', text: '全球边缘节点部署，亚太延迟 < 10ms' },
      { type: 'feature', prefix: '🚀', text: 'WebSocket 长连接模式，支持实时推送' },
      { type: 'improvement', prefix: '↑', text: '计费引擎重写，精确到 Token 级别' },
      { type: 'breaking', prefix: '⚠️', text: 'v1 API 将于 2026-06-01 停用，请尽快迁移' },
    ]
  },
  {
    version: '1.5.0',
    type: 'minor',
    typeLabel: '功能更新',
    date: '2026-03-15',
    title: 'Claude 3 系列全面支持',
    changes: [
      { type: 'feature', prefix: '✨', text: 'Claude 3.5 Sonnet / Opus / Haiku 全模型上线' },
      { type: 'improvement', prefix: '↑', text: 'Anthropic API 路由优化，错误率降低 60%' },
    ]
  },
]
</script>

<style scoped>
.changelog-page {
  padding-bottom: 80px;
}

.page-header {
  padding: 80px 0 60px;
}

.page-header .section-title {
  margin-bottom: 8px;
}

.section {
  margin-bottom: 80px;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 24px;
  padding-bottom: 32px;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 28px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: var(--bg-primary);
  flex-shrink: 0;
}

.dot-major {
  border-color: var(--accent-purple);
  background: var(--accent-purple);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
}

.dot-minor {
  border-color: var(--accent-cyan);
  background: var(--accent-cyan);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.dot-patch {
  border-color: var(--text-muted);
}

.timeline-line {
  width: 1px;
  flex: 1;
  background: var(--border);
  margin-top: 8px;
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-content {
  flex: 1;
  padding: 24px;
}

.entry-header {
  margin-bottom: 16px;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.entry-version {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
}

.entry-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: auto;
}

.entry-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.entry-changes {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.entry-changes li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.change-prefix {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.change-feature .change-prefix { color: var(--accent-cyan); }
.change-improvement .change-prefix { color: var(--accent-green); }
.change-bugfix .change-prefix { color: var(--accent-yellow); }
.change-breaking .change-prefix { color: var(--accent-red); }

/* Badge types */
.badge-major {
  border-color: var(--accent-purple);
  color: var(--accent-purple);
}

.badge-major .badge-dot {
  background: var(--accent-purple);
  box-shadow: 0 0 6px var(--accent-purple);
}

.badge-minor {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.badge-minor .badge-dot {
  background: var(--accent-cyan);
  box-shadow: 0 0 6px var(--accent-cyan);
}

.badge-patch {
  border-color: var(--text-muted);
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .timeline-marker {
    display: none;
  }

  .entry-meta {
    flex-wrap: wrap;
  }

  .entry-date {
    margin-left: 0;
    width: 100%;
  }
}
</style>
