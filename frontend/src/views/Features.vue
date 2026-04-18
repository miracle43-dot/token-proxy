<template>
  <div class="features-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          <span class="mono">v2.4.1-stable</span>
          <span style="color: var(--text-muted)">·</span>
          <span class="mono">99.98% uptime</span>
        </div>
        <h1 class="hero-title">
          <span class="mono">$ cat </span><span class="hero-title-accent">features.md</span>
        </h1>
        <p class="hero-sub">
          聚合多路AI大厂API，统一出口，毫秒计费。<br />
          <span class="mono" style="color: var(--accent-cyan)">一行代码</span>接入OpenAI · Claude · Gemini · DeepSeek
        </p>
        <div class="hero-actions">
          <a href="#" class="btn-glow">
            <span>快速接入</span>
            <span class="mono">→</span>
          </a>
          <a href="#" class="btn-outline">
            <span>查看文档</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="stats-bar">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <span class="stat-value mono">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Features -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <p class="section-title">// core modules</p>
          <h2 class="section-heading">核心能力</h2>
          <p class="section-sub">为高并发场景设计的API网关，稳定可靠，毫秒级响应</p>
        </div>

        <div class="grid-3 feature-cards">
          <div class="feature-card terminal-card" v-for="f in coreFeatures" :key="f.title">
            <div class="feature-icon" :style="{ color: f.color }">{{ f.icon }}</div>
            <h3 class="feature-title mono">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
            <div class="feature-tags">
              <span class="feature-tag" v-for="tag in f.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- API providers -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <p class="section-title">// supported providers</p>
          <h2 class="section-heading">支持的模型</h2>
          <p class="section-sub">一个密钥，畅行所有主流大厂API</p>
        </div>

        <div class="provider-grid">
          <div class="provider-card terminal-card" v-for="p in providers" :key="p.name">
            <div class="provider-header">
              <span class="provider-name mono">{{ p.name }}</span>
              <span class="badge" :class="'badge-' + p.status">
                <span class="badge-dot" v-if="p.status === 'online'"></span>
                {{ p.statusText }}
              </span>
            </div>
            <p class="provider-models">{{ p.models }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Code demo -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <p class="section-title">// quick start</p>
          <h2 class="section-heading">一行代码接入</h2>
          <p class="section-sub">替换BASE_URL即可，无缝迁移，无感知切换</p>
        </div>

        <div class="code-demo terminal-card">
          <div class="code-header">
            <div class="code-dots">
              <span style="background:#ef4444"></span>
              <span style="background:#eab308"></span>
              <span style="background:#22c55e"></span>
            </div>
            <span class="mono" style="color: var(--text-muted); font-size: 0.75rem;">python · openai-proxy.py</span>
          </div>
          <pre class="code-body"><code><span style="color:#a855f7">import</span> <span style="color:#00d4ff">openai</span>

client = openai.<span style="color:#00ff9d">OpenAI</span>(
    api_key=<span style="color:#f97316">"ak-your-key-here"</span>,
    base_url=<span style="color:#f97316">"https://api.aiapiproxy.com/v1"</span>  <span style="color:#4a5568"># ← 只需换这个</span>
)

resp = client.chat.completions.create(
    model=<span style="color:#f97316">"gpt-4o"</span>,
    messages=[{<span style="color:#f97316">"role"</span>: <span style="color:#f97316">"user"</span>, <span style="color:#f97316">"content"</span>: <span style="color:#f97316">"你好"</span>}]
)
<span style="color:#4a5568"># ✅ 自动路由 · 毫秒计费 · 无感切换</span></code></pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const stats = [
  { value: '4', label: 'API Provider' },
  { value: '50+', label: '可用模型' },
  { value: '12ms', label: '平均延迟' },
  { value: '99.98%', label: '服务可用性' },
]

const coreFeatures = [
  {
    icon: '🔄',
    color: 'var(--accent-cyan)',
    title: '智能路由',
    desc: '自动识别模型，最优路径分发。支持模型降级、熔断、重试策略，保障业务连续性。',
    tags: ['智能路由', '熔断降级', '自动重试']
  },
  {
    icon: '💰',
    color: 'var(--accent-green)',
    title: '精确计费',
    desc: '按token精确计费，实时余额监控。支持多级用量预警，防止意外超支。',
    tags: ['Token级', '实时监控', '超支预警']
  },
  {
    icon: '🚀',
    color: 'var(--accent-purple)',
    title: '高速缓存',
    desc: 'Semantic Cache智能识别重复请求，相同问题秒级返回，最高节省70%费用。',
    tags: ['语义缓存', '节省70%', '零延迟']
  },
  {
    icon: '🔐',
    color: 'var(--accent-orange)',
    title: '安全加固',
    desc: '请求加密、IP白名单、调用频次限制。多重防护保障API安全。',
    tags: ['AES加密', 'IP白名单', 'QPS限制']
  },
  {
    icon: '📊',
    color: 'var(--accent-yellow)',
    title: '用量分析',
    desc: '多维度用量报表，模型/用户/时间多角度拆解。数据驱动优化成本。',
    tags: ['实时报表', '多维分析', '导出CSV']
  },
  {
    icon: '🌏',
    color: 'var(--accent-red)',
    title: '全球加速',
    desc: '多区域边缘节点，就近接入。亚太/北美/欧洲全覆盖，延迟最低5ms。',
    tags: ['边缘节点', '就近接入', '5ms延迟']
  },
]

const providers = [
  { name: 'OpenAI', status: 'online', statusText: '运行中', models: 'GPT-4o · GPT-4o-mini · GPT-4 Turbo · GPT-3.5 · TTS · DALL-E 3' },
  { name: 'Anthropic', status: 'online', statusText: '运行中', models: 'Claude 3.5 Sonnet · Claude 3 Opus · Claude 3 Haiku · Claude 3.5 Haiku' },
  { name: 'Google', status: 'online', statusText: '运行中', models: 'Gemini 2.0 Pro · Gemini 2.0 Flash · Gemini 1.5 Pro · Gemini 1.5 Flash' },
  { name: 'DeepSeek', status: 'online', statusText: '运行中', models: 'DeepSeek V3 · DeepSeek R1 · DeepSeek Chat · DeepSeek Coder' },
]
</script>

<style scoped>
.features-page {
  padding-bottom: 80px;
}

/* Hero */
.hero {
  padding: 100px 0 60px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 255, 157, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 100px;
  margin-bottom: 24px;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.hero-title {
  font-family: var(--font-mono);
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.hero-title-accent {
  color: var(--accent-green);
}

.hero-sub {
  font-size: 1.15rem;
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.btn-outline:hover {
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
  background: rgba(0, 212, 255, 0.05);
}

/* Stats bar */
.stats-bar {
  padding: 32px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg-secondary);
  margin-bottom: 80px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-green);
  text-shadow: var(--glow-green);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Section */
.section {
  margin-bottom: 80px;
}

.section-header {
  margin-bottom: 48px;
}

.section-header .section-title {
  margin-bottom: 8px;
}

/* Feature cards */
.feature-card {
  padding: 28px;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: var(--border-bright);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.feature-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: 16px;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-tag {
  padding: 3px 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* Provider grid */
.provider-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.provider-card {
  padding: 20px 24px;
}

.provider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.provider-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.badge-online .badge-dot {
  background: var(--accent-green);
  box-shadow: 0 0 6px var(--accent-green);
}

.badge-online {
  color: var(--accent-green);
}

.provider-models {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Code demo */
.code-demo {
  overflow: hidden;
}

.code-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
}

.code-dots {
  display: flex;
  gap: 6px;
}

.code-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
}

.code-body {
  padding: 24px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.8;
  overflow-x: auto;
  background: var(--bg-primary);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .provider-grid {
    grid-template-columns: 1fr;
  }
}
</style>
