<template>
  <div class="status-page">
    <section class="page-header">
      <div class="container">
        <p class="section-title">// system status</p>
        <div class="header-row">
          <h1 class="section-heading">服务状态</h1>
          <div class="overall-status" :class="'status-' + overallStatus">
            <span class="status-dot-large"></span>
            <span class="mono">{{ overallLabel }}</span>
          </div>
        </div>
        <p class="section-sub">实时监控系统运行状况，所有数据每30秒刷新</p>
      </div>
    </section>

    <!-- Overall uptime -->
    <section class="section">
      <div class="container">
        <div class="uptime-grid">
          <div class="uptime-card terminal-card" v-for="up in uptimeData" :key="up.label">
            <div class="uptime-label mono">{{ up.label }}</div>
            <div class="uptime-value" :style="{ color: up.color }">{{ up.value }}</div>
            <div class="uptime-bar">
              <div class="uptime-fill" :style="{ width: up.value, background: up.color }"></div>
            </div>
            <div class="uptime-sub mono">{{ up.sub }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Provider status -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <p class="section-title">// provider health</p>
          <h2 class="section-heading">各平台状态</h2>
        </div>

        <div class="provider-list">
          <div class="provider-row terminal-card" v-for="p in providers" :key="p.name">
            <div class="provider-info">
              <div class="provider-icon">{{ p.icon }}</div>
              <div>
                <div class="provider-name mono">{{ p.name }}</div>
                <div class="provider-models">{{ p.models }}</div>
              </div>
            </div>
            <div class="provider-stats">
              <div class="pstat">
                <span class="mono" :style="{ color: p.p99 < 100 ? 'var(--accent-green)' : p.p99 < 500 ? 'var(--accent-yellow)' : 'var(--accent-red)' }">{{ p.p99 }}ms</span>
                <span class="pstat-label">P99延迟</span>
              </div>
              <div class="pstat">
                <span class="mono" :style="{ color: p.uptime === '100%' ? 'var(--accent-green)' : 'var(--accent-yellow)' }">{{ p.uptime }}</span>
                <span class="pstat-label">可用率</span>
              </div>
              <div class="pstat">
                <span class="mono" :style="{ color: p.errors < 0.5 ? 'var(--accent-green)' : 'var(--accent-yellow)' }">{{ p.errors }}%</span>
                <span class="pstat-label">错误率</span>
              </div>
              <div class="provider-status-badge">
                <span class="badge-dot" :class="p.status === 'operational' ? '' : 'dot-warning'"></span>
                <span class="mono">{{ p.statusText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Incidents -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <p class="section-title">// incident history</p>
          <h2 class="section-heading">故障历史</h2>
        </div>

        <div class="incident-list">
          <div class="incident-item terminal-card" v-for="inc in incidents" :key="inc.id">
            <div class="incident-header">
              <div>
                <span class="incident-status mono" :class="'status-' + inc.severity">{{ inc.severity.toUpperCase() }}</span>
                <span class="incident-title">{{ inc.title }}</span>
              </div>
              <span class="mono incident-date">{{ inc.date }}</span>
            </div>
            <p class="incident-desc">{{ inc.desc }}</p>
            <div class="incident-timeline">
              <span class="mono" style="color: var(--accent-green)">✓</span>
              <span class="mono" style="color: var(--text-muted)">{{ inc.resolved }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- API endpoints -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <p class="section-title">// api endpoints</p>
          <h2 class="section-heading">API端点状态</h2>
        </div>

        <div class="endpoint-grid">
          <div class="endpoint-card terminal-card" v-for="ep in endpoints" :key="ep.path">
            <div class="endpoint-header">
              <span class="method-badge" :class="'method-' + ep.method">{{ ep.method }}</span>
              <span class="endpoint-path mono">{{ ep.path }}</span>
              <span class="badge badge-online">
                <span class="badge-dot"></span>{{ ep.status }}
              </span>
            </div>
            <div class="endpoint-stats">
              <span class="mono" style="color: var(--accent-green)">{{ ep.latency }}ms</span>
              <span style="color: var(--text-muted)">avg latency</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const overallStatus = ref('operational')
const overallLabel = computed(() => ({
  operational: 'All Systems Operational',
  degraded: 'Degraded Performance',
  partial: 'Partial Outage',
}[overallStatus.value]))

const uptimeData = [
  { label: 'API Gateway', value: '99.98%', color: 'var(--accent-green)', sub: '过去30天 · SLA目标: 99.9%' },
  { label: 'Auth Service', value: '100%', color: 'var(--accent-green)', sub: '过去30天 · SLA目标: 99.9%' },
  { label: 'Billing Engine', value: '99.99%', color: 'var(--accent-green)', sub: '过去30天 · SLA目标: 99.95%' },
  { label: 'Cache Layer', value: '99.97%', color: 'var(--accent-green)', sub: '过去30天 · Redis集群' },
]

const providers = [
  {
    name: 'OpenAI',
    icon: '🤖',
    models: 'GPT-4o · GPT-4o-mini · GPT-4 Turbo',
    p99: 87,
    uptime: '99.99%',
    errors: 0.01,
    status: 'operational',
    statusText: '正常'
  },
  {
    name: 'Anthropic',
    icon: '🧠',
    models: 'Claude 3.5 Sonnet · Claude 3 Opus · Claude 3.5 Haiku',
    p99: 124,
    uptime: '99.98%',
    errors: 0.02,
    status: 'operational',
    statusText: '正常'
  },
  {
    name: 'Google Gemini',
    icon: '💎',
    models: 'Gemini 2.0 Pro · Gemini 2.0 Flash · Gemini 1.5 Pro',
    p99: 56,
    uptime: '100%',
    errors: 0.00,
    status: 'operational',
    statusText: '正常'
  },
  {
    name: 'DeepSeek',
    icon: '🔮',
    models: 'DeepSeek V3 · DeepSeek R1 · DeepSeek Chat',
    p99: 203,
    uptime: '99.95%',
    errors: 0.05,
    status: 'operational',
    statusText: '正常'
  },
]

const incidents = [
  {
    id: 'INC-2026-0412',
    severity: 'warning',
    title: 'DeepSeek API 响应延迟升高',
    date: '2026-04-12 14:23',
    desc: 'DeepSeek 官方 API 出现区域性延迟升高，影响部分用户请求，平均响应时间从 200ms 升至 1200ms。已启动备用路由。',
    resolved: '2026-04-12 15:47 · 已解决'
  },
  {
    id: 'INC-2026-0405',
    severity: 'info',
    title: '计划内维护 - 缓存层升级',
    date: '2026-04-05 03:00',
    desc: 'Redis 集群从 6.x 升级到 7.4，提前完成，无用户受影响。',
    resolved: '2026-04-05 04:30 · 已解决'
  },
  {
    id: 'INC-2026-0328',
    severity: 'critical',
    title: 'API Gateway 短暂不可用',
    date: '2026-03-28 22:11',
    desc: '因上游 BGP 路由抖动，API Gateway 在 22:11-22:14 期间不可用，持续约3分钟。已增加多线 BGP 防护。',
    resolved: '2026-03-28 22:14 · 已解决'
  },
]

const endpoints = [
  { method: 'POST', path: '/v1/chat/completions', status: '可用', latency: 12 },
  { method: 'POST', path: '/v1/completions', status: '可用', latency: 14 },
  { method: 'POST', path: '/v1/embeddings', status: '可用', latency: 8 },
  { method: 'GET', path: '/v1/models', status: '可用', latency: 5 },
  { method: 'POST', path: '/v1/images/generations', status: '可用', latency: 340 },
  { method: 'POST', path: '/v1/audio/speech', status: '可用', latency: 210 },
]
</script>

<style scoped>
.status-page {
  padding-bottom: 80px;
}

.page-header {
  padding: 80px 0 60px;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.header-row .section-heading {
  margin-bottom: 0;
}

.overall-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 600;
}

.status-operational { color: var(--accent-green); border-color: rgba(0, 255, 157, 0.3); }
.status-degraded { color: var(--accent-yellow); border-color: rgba(234, 179, 8, 0.3); }
.status-partial { color: var(--accent-red); border-color: rgba(239, 68, 68, 0.3); }

.status-dot-large {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent-green);
  box-shadow: 0 0 8px var(--accent-green);
  animation: pulse-dot 2s ease-in-out infinite;
}

.section {
  margin-bottom: 80px;
}

.section-header {
  margin-bottom: 32px;
}

/* Uptime */
.uptime-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.uptime-card {
  padding: 24px;
}

.uptime-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.uptime-value {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.uptime-bar {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 8px;
}

.uptime-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s;
}

.uptime-sub {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* Provider list */
.provider-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.provider-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.provider-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.provider-icon {
  font-size: 1.8rem;
}

.provider-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.provider-models {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.provider-stats {
  display: flex;
  align-items: center;
  gap: 32px;
}

.pstat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.pstat .mono {
  font-size: 1rem;
  font-weight: 700;
}

.pstat-label {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.provider-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--accent-green);
}

.dot-warning {
  background: var(--accent-yellow) !important;
  box-shadow: 0 0 6px var(--accent-yellow) !important;
  animation: none !important;
}

/* Incidents */
.incident-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.incident-item {
  padding: 20px 24px;
}

.incident-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.incident-header > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.incident-status {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-critical {
  background: rgba(239, 68, 68, 0.15);
  color: var(--accent-red);
}

.status-warning {
  background: rgba(234, 179, 8, 0.15);
  color: var(--accent-yellow);
}

.status-info {
  background: rgba(0, 212, 255, 0.1);
  color: var(--accent-cyan);
}

.incident-title {
  font-weight: 600;
  color: var(--text-primary);
}

.incident-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.incident-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 8px;
}

.incident-timeline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
}

/* Endpoints */
.endpoint-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.endpoint-card {
  padding: 16px 20px;
}

.endpoint-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.method-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.method-POST {
  background: rgba(0, 255, 157, 0.15);
  color: var(--accent-green);
}

.method-GET {
  background: rgba(0, 212, 255, 0.15);
  color: var(--accent-cyan);
}

.endpoint-path {
  flex: 1;
  font-size: 0.85rem;
  color: var(--text-primary);
}

.endpoint-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.endpoint-stats .mono {
  font-weight: 700;
}

@media (max-width: 900px) {
  .uptime-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .endpoint-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .uptime-grid {
    grid-template-columns: 1fr;
  }

  .provider-stats {
    flex-wrap: wrap;
    gap: 16px;
  }

  .provider-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
