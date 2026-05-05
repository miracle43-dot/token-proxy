<template>
  <div class="lp">

    <!-- ===================== Nav ===================== -->
    <header class="nav">
      <div class="nav-inner">
        <a href="/" class="nav-logo">
          <img src="/src/assets/avatar_final.png" alt="Logo" class="nav-avatar" />
          <span class="logo-text">TokenProxy</span>
        </a>
        <nav class="nav-links">
          <a href="#features" class="nav-link">功能</a>
          <a href="#pricing" class="nav-link">定价</a>
          <a href="#" class="nav-link">文档</a>
          <a href="/auth/login" class="nav-link">登录</a>
          <a href="/auth/register" class="btn-primary">免费注册，送 ¥10 体验金 →</a>
        </nav>
        <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu" v-if="menuOpen">
        <a href="#features" class="mobile-link" @click="menuOpen = false">功能</a>
        <a href="#pricing" class="mobile-link" @click="menuOpen = false">定价</a>
        <a href="#" class="mobile-link" @click="menuOpen = false">文档</a>
        <a href="/auth/login" class="mobile-link" @click="menuOpen = false">登录</a>
        <a href="/auth/register" class="mobile-link mobile-link-cta" @click="menuOpen = false">立即开始 →</a>
      </div>
    </header>

    <!-- ===================== Hero ===================== -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-left">
          <div class="hero-pretitle">// 中文市场 · 稳定低价 AI API 代理</div>
          <h1 class="hero-title">
            稳定 · 低价 · 快速<br />
            <span class="hero-title-accent">接入全球顶尖 AI 模型</span>
          </h1>
          <p class="hero-sub">
            无需翻墙，一个 API Key 直连 OpenAI · Claude · DeepSeek · Gemini<br />
            官方价格 <strong>8 折起</strong>，国内直连，秒级响应
          </p>
          <div class="hero-actions">
            <a href="/auth/register" class="btn-primary btn-lg">立即开始 →</a>
            <a href="#pricing" class="btn-ghost btn-lg">查看价格</a>
          </div>
          <div class="hero-trust">
            <span class="trust-item"><span class="trust-dot"></span>国内直连</span>
            <span class="trust-item"><span class="trust-dot"></span>1.2亿次/月调用</span>
            <span class="trust-item"><span class="trust-dot"></span>99.9% 可用率</span>
          </div>
        </div>
        <div class="hero-right">
          <!-- Model logos -->
          <div class="model-showcase">
            <div class="model-header">
              <span class="model-header-title">支持的模型</span>
              <span class="model-header-count">15+ 模型</span>
            </div>
            <div class="model-grid">
              <div class="model-chip" v-for="m in modelLogos" :key="m.name">
                <span class="model-logo" v-html="m.logo"></span>
                <span class="model-name">{{ m.name }}</span>
                <span class="model-price">{{ m.price }}</span>
              </div>
            </div>
          </div>
          <!-- Terminal window -->
          <div class="mac-window hero-mac">
            <div class="mac-titlebar">
              <div class="mac-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
              </div>
              <span class="mac-title">api.tokenproxy.dev</span>
            </div>
            <div class="mac-body">
              <div class="t-line"><span class="t-comment">// 连接状态</span></div>
              <div class="t-line"><span class="t-prompt">&gt;</span> <span class="t-green">connected</span> <span class="t-green">✓</span></div>
              <div class="t-line"><span class="t-prompt">&gt;</span> <span class="t-key">model:</span> <span class="t-val">gpt-4o</span></div>
              <div class="t-line">&nbsp;</div>
              <div class="t-line"><span class="t-comment">// 响应结果</span></div>
              <div class="t-line"><span class="t-punc">{</span></div>
              <div class="t-line t-ind1"><span class="t-key">"model"</span><span class="t-punc">:</span> <span class="t-str">"gpt-4o"</span><span class="t-punc">,</span></div>
              <div class="t-line t-ind1"><span class="t-key">"usage"</span><span class="t-punc">:</span> <span class="t-punc">{</span></div>
              <div class="t-line t-ind2"><span class="t-key">"prompt_tokens"</span><span class="t-punc">:</span> <span class="t-num">128</span><span class="t-punc">,</span></div>
              <div class="t-line t-ind2"><span class="t-key">"completion_tokens"</span><span class="t-punc">:</span> <span class="t-num">256</span></div>
              <div class="t-line t-ind1"><span class="t-punc">}</span><span class="t-punc">,</span></div>
              <div class="t-line t-ind1"><span class="t-key">"cost"</span><span class="t-punc">:</span> <span class="t-green">"$0.0042"</span></div>
              <div class="t-line"><span class="t-punc">}</span></div>
              <div class="t-divider"></div>
              <div class="t-statusbar">
                <span>Balance: <span class="t-green">$12.34</span></span>
                <span class="t-sep">|</span>
                <span>Today: <span class="t-num">1,247k</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Three core advantages -->
      <div class="hero-advantages">
        <div class="advantage-item" v-for="adv in advantages" :key="adv.title">
          <span class="advantage-icon" v-html="adv.icon"></span>
          <div class="advantage-text">
            <span class="advantage-title">{{ adv.title }}</span>
            <span class="advantage-sub">{{ adv.sub }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Social Proof Bar ===================== -->
    <section class="proof-bar">
      <div class="proof-inner">
        <div class="proof-item" v-for="item in proofItems" :key="item.label">
          <div class="proof-number">{{ item.number }}</div>
          <div class="proof-label">{{ item.label }}</div>
        </div>
        <div class="proof-item proof-item-payment">
          <div class="proof-payment-icons">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#07C160"/>
              <path d="M8 14.5c0-2.5 2-4.5 4.5-4.5S17 12 17 14.5c0 2-1.5 3.5-3.5 3.5h-1v-4h1c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2H9c0 2.5 2 4.5 4.5 4.5S18 17 18 14.5 16 10 13.5 10 9 12 9 14.5" fill="white"/>
            </svg>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill="#1677FF"/>
              <path d="M8 10.5h8a3 3 0 0 1 0 6H8m0 0h8a3 3 0 0 1 0 6H8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="proof-label">支持微信 / 支付宝</div>
        </div>
      </div>
    </section>

    <!-- ===================== 核心卖点 ===================== -->
    <section class="features" id="features">
      <div class="section-inner">
        <h2 class="section-title">为什么选择 TokenProxy</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="f in features" :key="f.title">
            <div class="feature-icon" v-html="f.icon"></div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Playground ===================== -->
    <section class="playground" id="playground">
      <div class="section-inner">
        <h2 class="section-title">Playground<br /><span class="title-sub">选择一个模型，输入问题，立即获得 AI 回答</span></h2>
        <div class="mac-window pg-window">
          <div class="mac-titlebar">
            <div class="mac-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="mac-title">api.tokenproxy.dev — Playground</span>
          </div>
          <div class="pg-body">
            <div class="pg-sidebar">
              <div class="pg-sidebar-section">
                <div class="pg-sidebar-label">API Keys</div>
                <div class="pg-key pg-key-active">
                  <span class="pg-key-dot"></span>
                  <span>key_sk_liv…7f2a</span>
                </div>
                <div class="pg-key">
                  <span class="pg-key-dot pg-key-dot-off"></span>
                  <span>key_sk_tes…3b1c</span>
                </div>
              </div>
              <div class="pg-sidebar-section">
                <div class="pg-sidebar-label">Usage</div>
                <div class="pg-usage-row">
                  <span class="pg-usage-key">Today</span>
                  <span class="pg-usage-val">12,847</span>
                </div>
                <div class="pg-usage-row">
                  <span class="pg-usage-key">Balance</span>
                  <span class="pg-usage-val pg-usage-green">$12.34</span>
                </div>
              </div>
            </div>
            <div class="pg-main">
              <div class="pg-row">
                <span class="pg-label">Model:</span>
                <span class="pg-select">GPT-4o <span class="pg-arrow">▾</span></span>
              </div>
              <div class="pg-divider"></div>
              <div class="pg-section-label">Request</div>
              <div class="pg-req-line"><span class="t-method">POST</span> /v1/chat/completions</div>
              <div class="pg-req-body">
                <span class="t-key">Body:</span> { <span class="t-key">"model"</span>: <span class="t-str">"gpt-4o"</span>, <span class="t-key">"messages"</span>: [...] }
              </div>
              <div class="pg-divider"></div>
              <div class="pg-section-label">Response: <span class="t-green">200 OK ✓</span></div>
              <div class="pg-resp-line">↳ tokens: <span class="t-num">1,247</span> | latency: <span class="t-num">213ms</span></div>
              <div class="pg-resp-line">↳ cost: <span class="t-green">$0.0042</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== 价格 ===================== -->
    <section class="pricing" id="pricing">
      <div class="section-inner">
        <h2 class="section-title">价格透明，按量计费</h2>
        <div class="price-table-wrap">
          <table class="price-table">
            <thead>
              <tr>
                <th>模型</th>
                <th>输入成本</th>
                <th>输出成本</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pricingRows" :key="row.model" :class="{ 'tr-recommended': row.recommended }">
                <td class="td-model">
                  <span v-if="row.recommended" class="recommended-badge">推荐</span>
                  {{ row.model }}
                </td>
                <td>{{ row.input }}</td>
                <td>{{ row.output }}</td>
                <td><span class="tag">{{ row.tag }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ===================== 快速开始 ===================== -->
    <section class="quickstart" id="quickstart">
      <div class="section-inner">
        <h2 class="section-title">3 步开始<br /><span class="title-sub">注册 → 创建 Key → 开始调用</span></h2>
        <div class="steps-grid">
          <div class="step-item" v-for="step in steps" :key="step.num">
            <div class="step-num">{{ step.num }}</div>
            <div class="step-title">{{ step.title }}</div>
            <div class="step-desc">{{ step.desc }}</div>
          </div>
        </div>
        <div class="code-grid">
          <div class="code-block" v-for="code in codeBlocks" :key="code.label">
            <div class="code-label">{{ code.label }}</div>
            <pre class="code-pre" v-html="code.code"></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== FAQ ===================== -->
    <section class="faq" id="faq">
      <div class="section-inner">
        <h2 class="section-title">常见问题</h2>
        <div class="faq-list">
          <div
            class="faq-item"
            v-for="(item, i) in faqItems"
            :key="i"
            :class="{ open: openFaq === i }"
            @click="toggleFaq(i)"
          >
            <div class="faq-q">
              <span>{{ item.q }}</span>
              <span class="faq-icon">{{ openFaq === i ? '−' : '+' }}</span>
            </div>
            <div class="faq-a" v-if="openFaq === i">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Footer CTA ===================== -->
    <section class="footer-cta">
      <div class="cta-inner">
        <h2 class="cta-title">立即开始</h2>
        <p class="cta-sub">首发体验官招募中 · 注册送 ¥10</p>
        <a href="/auth/register" class="btn-primary btn-xl">免费注册，送 ¥10 体验金 →</a>
      </div>
    </section>

    <!-- ===================== Footer ===================== -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="/" class="footer-logo">
            <span class="logo-dot">●</span>
            <span class="logo-text">TokenProxy</span>
          </a>
          <p class="footer-tagline">直连全球 AI 模型</p>
        </div>
        <div class="footer-cols">
          <div class="footer-col" v-for="col in footerCols" :key="col.title">
            <div class="footer-col-title">{{ col.title }}</div>
            <a v-for="link in col.links" :key="link" href="#" class="footer-link">{{ link }}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 TokenProxy. Built for developers.</span>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const openFaq = ref(null)

function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i
}

const proofItems = [
  { number: '12,000+', label: '活跃开发者' },
  { number: '1.2 亿次/月', label: 'API 调用' },
  { number: '99.9%', label: 'SLA 可用率' },
  { number: '15+', label: '支持模型' },
]

const modelLogos = [
  {
    name: 'OpenAI',
    price: 'GPT-4o 8折',
    logo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073z" fill="#10A37F"/></svg>`,
  },
  {
    name: 'Claude',
    price: 'Claude 3.5 9折',
    logo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#CC785C"/><path d="M12 6C8.686 6 6 8.686 6 12s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="white"/></svg>`,
  },
  {
    name: 'DeepSeek',
    price: 'DeepSeek 8折',
    logo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#1A1A2E"/><path d="M12 7l5 9H7l5-9z" fill="#00D4FF"/><circle cx="12" cy="14" r="3" fill="#00D4FF"/></svg>`,
  },
  {
    name: 'Gemini',
    price: 'Gemini 9折',
    logo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#8E1FC3"/><path d="M7 12h10M12 7v10" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    name: 'Groq',
    price: '极速推理',
    logo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#2D2D2D"/><path d="M6 12h12M12 8v8" stroke="#FF6B35" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    name: 'Mistral',
    price: '欧洲最强',
    logo: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#FF6B35"/><text x="5" y="17" font-size="12" font-weight="700" fill="white" font-family="sans-serif">M</text></svg>`,
  },
]

const advantages = [
  {
    title: '国内直连',
    sub: '无需 VPN，开箱即用',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  },
  {
    title: '低价透明',
    sub: '官方价格 8 折起',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  },
  {
    title: '秒级响应',
    sub: '多节点智能路由',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
]

const features = [
  {
    title: '无需 VPN',
    desc: '国内直连，无需任何网络配置，替换 endpoint 即可使用',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  },
  {
    title: '稳定直连',
    desc: '99.9% 可用率，多区域智能路由，自动容灾切换',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  },
  {
    title: '透明定价',
    desc: '按量计费，无月费无门槛，明码标价，用多少付多少',
    icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  },
]

const pricingRows = [
  { model: 'GPT-4o', input: '$2.50 / M tokens', output: '$10.00 / M tokens', tag: '官方 8 折' },
  { model: 'GPT-4o-mini', input: '$0.15 / M tokens', output: '$0.60 / M tokens', tag: '推荐 · 官方 8 折', recommended: true },
  { model: 'Claude 3.5 Sonnet', input: '$3.00 / M tokens', output: '$15.00 / M tokens', tag: '官方 9 折' },
  { model: 'Claude 3.5 Haiku', input: '$0.80 / M tokens', output: '$4.00 / M tokens', tag: '官方 9 折' },
  { model: 'Gemini 1.5 Pro', input: '$1.25 / M tokens', output: '$5.00 / M tokens', tag: '官方 9 折' },
]

const steps = [
  { num: '01', title: '注册账号', desc: '免费创建账号，无需信用卡' },
  { num: '02', title: '创建 Key', desc: '仪表盘一键生成，立即生效' },
  { num: '03', title: '开始调用', desc: '一个请求验证效果' },
]

const codeBlocks = [
  {
    label: 'Step 1 — 注册',
    code: `<span class="t-comment"># 打开官网注册账号</span>
<span class="t-url">https://tokenproxy.dev</span>`,
  },
  {
    label: 'Step 2 — 获取 Key',
    code: `<span class="t-comment"># 一键生成 API Key</span>
<span class="t-method">POST</span> <span class="t-url">/keys</span>
-H <span class="t-str">"Authorization: Bearer $TOKEN"</span>
{ <span class="t-key">"name"</span>: <span class="t-str">"MyKey"</span> }`,
  },
  {
    label: 'Step 3 — 调用',
    code: `<span class="t-comment"># 开始调用</span>
<span class="t-method">POST</span> <span class="t-url">/v1/chat/completions</span>
-H <span class="t-str">"Authorization: Bearer sk_live_xxx"</span>
{ <span class="t-key">"model"</span>: <span class="t-str">"gpt-4o"</span>, <span class="t-key">"messages"</span>: [...] }`,
  },
]

const faqItems = [
  {
    q: 'TokenProxy 和直接调用官方 API 有什么区别？',
    a: '核心区别是无需翻墙。TokenProxy 在中国大陆部署了直连节点，无需任何代理工具即可稳定访问 OpenAI / Claude / Gemini。同时提供智能路由、自动重试、用量统计，一个平台搞定所有。',
  },
  {
    q: '费用如何计算？是否有隐藏费用？',
    a: '无隐藏费用。按实际 token 消耗计费，费用与直接调用官方 API 一致（部分模型甚至更低）。明码标价，无订阅陷阱，随时可取消。',
  },
  {
    q: '支持哪些模型？',
    a: '目前支持 OpenAI 全模型（GPT-4o、GPT-4o-mini 等）、Claude 3.5 全系列、Gemini Pro/Flash。仪表盘实时展示最新可用模型列表。',
  },
]

const footerCols = [
  { title: '产品', links: ['功能介绍', '定价', '更新日志', '状态页'] },
  { title: '开发者', links: ['API 文档', 'SDK 下载', '快速开始'] },
  { title: '公司', links: ['关于我们', '联系方式', '隐私政策'] },
]
</script>

<style scoped>
/* ==================== Variables ==================== */
.lp {
  --bg: #FFFFFF;
  --bg-subtle: #F8FAFC;
  --bg-dark-shell: #18181B;
  --bg-dark-inner: #09090B;
  --border: #E4E4E7;
  --purple: #7C3AED;
  --purple-light: #A78BFA;
  --green: #10B981;
  --red: #EF4444;
  --text: #0F172A;
  --text-sec: #64748B;
  --text-muted: #94A3B8;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
a { text-decoration: none; color: inherit; }

/* ==================== Nav ==================== */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1280px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 64px;
  gap: 40px;
}
.nav-logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.nav-avatar { width: 32px; height: 32px; border-radius: 8px; object-fit: contain; }
.logo-dot { font-size: 10px; color: var(--brand-primary); line-height: 1; }
.logo-text { font-size: 20px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.3px; }
.nav-links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.nav-link { font-size: 14px; font-weight: 400; color: var(--text-sec); padding: 8px 14px; border-radius: 6px; transition: color 200ms ease-out; }
.nav-link:hover { color: var(--text-primary); }
.btn-primary {
  display: inline-flex; align-items: center;
  background: var(--brand-primary); color: #fff;
  border-radius: 8px; font-weight: 600; font-size: 14px;
  padding: 10px 20px; cursor: pointer;
  transition: background 200ms ease-out; white-space: nowrap;
}
.btn-primary:hover { background: #1E40AF; }
.btn-primary:active { transform: scale(0.98); }
.btn-lg { padding: 16px 32px; font-size: 16px; }
.btn-xl { padding: 18px 40px; font-size: 16px; }
.btn-ghost {
  display: inline-flex; align-items: center;
  background: transparent; color: var(--brand-primary);
  border: 1.5px solid var(--brand-primary); border-radius: 8px;
  font-weight: 600; font-size: 16px; padding: 16px 32px;
  cursor: pointer; transition: border-color 200ms ease-out;
}
.btn-ghost:hover { border-color: #6D28D9; }
.btn-ghost:active { transform: scale(0.98); }

.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer;
  padding: 8px; margin-left: auto;
}
.hamburger span { display: block; width: 22px; height: 2px; background: var(--text-primary); border-radius: 2px; transition: all 200ms ease; }
.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
.mobile-menu { display: flex; flex-direction: column; padding: 16px 24px 24px; border-top: 1px solid var(--border); background: var(--bg); }
.mobile-link { font-size: 16px; font-weight: 400; color: var(--text-sec); padding: 12px 0; border-bottom: 1px solid var(--border); }
.mobile-link-cta { margin-top: 16px; color: var(--brand-primary); font-weight: 600; border: none; }

/* ==================== Hero ==================== */
.hero {
  padding: 160px 64px 0;
  max-width: 1280px;
  margin: 0 auto;
}
.hero-inner { display: grid; grid-template-columns: 55fr 45fr; gap: 80px; align-items: start; }
.hero-pretitle { font-family: var(--font-mono); font-size: 14px; color: var(--text-muted); font-weight: 500; margin-bottom: 24px; }
.hero-title { font-size: 68px; font-weight: 700; color: var(--text-primary); line-height: 1.15; margin-bottom: 24px; letter-spacing: -2px; }
.hero-title-accent { color: var(--brand-primary); }
.hero-sub { font-size: 18px; line-height: 1.6; color: var(--text-sec); margin-bottom: 36px; }
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }

/* Trust strip */
.hero-trust { display: flex; gap: 20px; flex-wrap: wrap; }
.trust-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted); font-weight: 500; }
.trust-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

/* Model showcase */
.model-showcase {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}
.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}
.model-header-title { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.model-header-count { font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); }
.model-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); }
.model-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: var(--bg);
  cursor: default;
  transition: background 200ms ease;
}
.model-chip:hover { background: #FAF5FF; }
.model-logo { display: flex; align-items: center; justify-content: center; }
.model-name { font-size: 12px; font-weight: 600; color: var(--text-primary); }
.model-price { font-size: 11px; color: var(--green); font-family: var(--font-mono); }

/* Hero mac window */
.hero-mac { margin-top: 0; }

/* Mac Window */
.mac-window { background: var(--bg-dark-shell); border-radius: 12px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
.mac-titlebar { background: #27272A; height: 40px; display: flex; align-items: center; padding: 0 16px; gap: 12px; }
.mac-dots { display: flex; gap: 8px; align-items: center; }
.dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.dot-red { background: var(--red); }
.dot-yellow { background: #F59E0B; }
.dot-green { background: var(--green); }
.mac-title { font-family: var(--font-mono); font-size: 13px; color: #71717A; margin-left: 4px; }
.mac-body { background: var(--bg-dark-inner); padding: 24px; font-family: var(--font-mono); font-size: 14px; line-height: 1.5; }

.t-line { display: block; }
.t-comment { color: #52525B; }
.t-prompt { color: var(--purple-light); margin-right: 8px; }
.t-green { color: var(--green); }
.t-key { color: var(--purple-light); }
.t-val { color: #E4E4E7; }
.t-str { color: #86EFAC; }
.t-num { color: #FCD34D; }
.t-punc { color: #71717A; }
.t-ind1 { padding-left: 24px; }
.t-ind2 { padding-left: 48px; }
.t-divider { border-top: 1px solid #27272A; margin: 16px 0; }
.t-statusbar { display: flex; gap: 16px; font-size: 13px; color: #71717A; }
.t-sep { color: #3F3F46; }

/* Hero advantages bar */
.hero-advantages {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 48px;
  margin-bottom: 0;
}
.advantage-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  background: var(--bg);
  transition: background 200ms ease;
}
.advantage-item:hover { background: #FAF5FF; }
.advantage-icon { color: var(--brand-primary); flex-shrink: 0; }
.advantage-text { display: flex; flex-direction: column; gap: 2px; }
.advantage-title { font-size: 14px; font-weight: 600; color: var(--text-primary); }
.advantage-sub { font-size: 12px; color: var(--text-muted); }
.proof-bar { background: var(--bg-subtle); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 48px 64px; }
.proof-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(5, 1fr); }
.proof-item { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 0 24px; border-right: 1px solid var(--border); }
.proof-item:last-child { border-right: none; }
.proof-number { font-size: 48px; font-weight: 700; color: var(--text-primary); font-family: var(--font-mono); letter-spacing: -1px; }
.proof-label { font-size: 14px; color: var(--text-muted); }
.proof-item-payment { border-right: none !important; }
.proof-payment-icons { display: flex; gap: 8px; align-items: center; justify-content: center; }

/* ==================== Section Shared ==================== */
.section-inner { max-width: 1280px; margin: 0 auto; padding: 0 64px; }
.section-title { font-size: 48px; font-weight: 700; color: var(--text-primary); letter-spacing: -1.5px; line-height: 1.2; margin-bottom: 48px; }
.title-sub { font-size: 18px; font-weight: 400; color: var(--text-sec); letter-spacing: 0; line-height: 1.5; display: block; margin-top: 8px; }

/* ==================== Features ==================== */
.features { padding: 120px 0; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.feature-card { border: 1px solid var(--border); border-radius: 12px; padding: 40px 32px; transition: border-color 200ms ease-out; }
.feature-card:hover { border-color: var(--brand-primary); }
.feature-icon { margin-bottom: 20px; }
.feature-title { font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 10px; }
.feature-desc { font-size: 14px; color: var(--text-sec); line-height: 1.6; }

/* ==================== Playground ==================== */
.playground { padding: 120px 0; background: var(--bg-subtle); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.pg-body { display: grid; grid-template-columns: 200px 1fr; min-height: 360px; }
.pg-sidebar { background: #1C1C1F; padding: 16px; border-right: 1px solid #27272A; display: flex; flex-direction: column; gap: 24px; }
.pg-sidebar-section { display: flex; flex-direction: column; gap: 4px; }
.pg-sidebar-label { font-size: 11px; font-weight: 500; color: #52525B; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 8px; font-family: var(--font-mono); }
.pg-key { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 6px; font-size: 12px; font-family: var(--font-mono); color: #71717A; cursor: pointer; }
.pg-key:hover { background: #27272A; }
.pg-key-active { background: rgba(124, 58, 237, 0.15); color: #D4D4D8; }
.pg-key-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
.pg-key-dot-off { background: #3F3F46; }
.pg-usage-row { display: flex; justify-content: space-between; padding: 4px 8px; font-size: 12px; font-family: var(--font-mono); }
.pg-usage-key { color: #52525B; }
.pg-usage-val { color: #71717A; }
.pg-usage-green { color: var(--green); }
.pg-main { background: var(--bg-dark-inner); padding: 24px; font-family: var(--font-mono); font-size: 13px; line-height: 1.8; color: #A1A1AA; }
.pg-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.pg-label { color: #52525B; }
.pg-select { background: #27272A; border: 1px solid #3F3F46; border-radius: 6px; padding: 4px 12px; color: #D4D4D8; font-size: 13px; }
.pg-arrow { margin-left: 8px; color: #52525B; }
.pg-divider { border-top: 1px solid #27272A; margin: 12px 0; }
.pg-section-label { font-size: 11px; color: #52525B; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
.pg-req-line { color: #71717A; margin-bottom: 6px; }
.pg-req-body { color: #71717A; }
.pg-resp-line { display: block; }
.t-method { color: var(--purple-light); }
.t-url { color: #86A3EF; }

/* ==================== Pricing ==================== */
.pricing { padding: 120px 0; }
.price-table-wrap { overflow-x: auto; }
.price-table { width: 100%; border-collapse: collapse; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.price-table th { background: var(--bg-subtle); font-size: 14px; font-weight: 600; color: var(--text-primary); padding: 16px 24px; text-align: left; border-bottom: 1px solid var(--border); }
.price-table td { padding: 16px 24px; font-size: 14px; color: var(--text-sec); border-bottom: 1px solid var(--border); }
.price-table tr:last-child td { border-bottom: none; }
.price-table tr:hover td { background: #FAFAFA; }
.tr-recommended td { background: #FAF5FF; }
.tr-recommended:hover td { background: #EDE9FE !important; }
.recommended-badge {
  display: inline-block;
  background: var(--brand-primary);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 6px;
  vertical-align: middle;
  letter-spacing: 0.03em;
}
.td-model { font-weight: 500; color: var(--text-primary) !important; }
.tag { background: #F0FDF4; color: #16A34A; font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 500; }

/* ==================== Quick Start ==================== */
.quickstart { padding: 120px 0; background: var(--bg-subtle); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; margin-bottom: 48px; }
.step-item { display: flex; flex-direction: column; }
.step-num { font-size: 32px; font-weight: 700; color: var(--brand-primary); font-family: var(--font-mono); margin-bottom: 16px; letter-spacing: -1px; }
.step-title { font-size: 20px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
.step-desc { font-size: 14px; color: var(--text-sec); }
.code-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.code-block { background: var(--bg-dark-shell); border-radius: 8px; overflow: hidden; }
.code-label { background: #27272A; padding: 10px 16px; font-size: 12px; font-family: var(--font-mono); color: #71717A; border-bottom: 1px solid #3F3F46; }
.code-pre { padding: 16px 20px; font-family: var(--font-mono); font-size: 13px; line-height: 1.8; color: #A1A1AA; margin: 0; white-space: pre-wrap; word-break: break-all; }

/* ==================== FAQ ==================== */
.faq { padding: 120px 0; }
.faq-list { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; }
.faq-item { border-top: 1px solid var(--border); cursor: pointer; }
.faq-item:last-child { border-bottom: 1px solid var(--border); }
.faq-q { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; font-size: 16px; font-weight: 500; color: var(--text-primary); gap: 16px; }
.faq-item.open .faq-q { color: var(--brand-primary); }
.faq-icon { font-size: 22px; color: var(--text-muted); flex-shrink: 0; font-weight: 400; line-height: 1; }
.faq-a { padding-bottom: 20px; font-size: 15px; line-height: 1.7; color: var(--text-sec); }

/* ==================== Footer CTA ==================== */
.footer-cta { padding: 120px 64px; text-align: center; background: var(--bg-subtle); border-top: 1px solid var(--border); }
.cta-inner { max-width: 600px; margin: 0 auto; }
.cta-title { font-size: 48px; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; letter-spacing: -1.5px; }
.cta-sub { font-size: 18px; color: var(--text-sec); margin-bottom: 40px; }

/* ==================== Footer ==================== */
.footer { border-top: 1px solid var(--border); padding: 48px 64px; }
.footer-inner { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1fr 2fr; gap: 64px; margin-bottom: 32px; }
.footer-brand { display: flex; flex-direction: column; gap: 10px; }
.footer-logo { display: flex; align-items: center; gap: 8px; }
.footer-tagline { font-size: 14px; color: var(--text-muted); }
.footer-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.footer-col { display: flex; flex-direction: column; gap: 12px; }
.footer-col-title { font-size: 14px; font-weight: 500; color: var(--text-primary); margin-bottom: 4px; }
.footer-link { font-size: 14px; color: var(--text-muted); transition: color 200ms ease-out; }
.footer-link:hover { color: var(--text-primary); }
.footer-bottom { max-width: 1280px; margin: 0 auto; padding-top: 24px; border-top: 1px solid var(--border); font-size: 12px; color: var(--text-muted); }

/* ==================== Responsive ==================== */
@media (max-width: 1024px) {
  .hero-inner { grid-template-columns: 1fr; gap: 40px; }
  .hero { padding: 140px 48px 0; }
  .hero-title { font-size: 52px; }
  .hero-right { order: -1; }
  .model-grid { grid-template-columns: repeat(6, 1fr); }
  .hero-advantages { grid-template-columns: repeat(3, 1fr); }
  .proof-bar { padding: 40px 48px; }
  .section-inner { padding: 0 48px; }
  .proof-inner { grid-template-columns: repeat(3, 1fr); row-gap: 32px; }
  .proof-item:nth-child(2) { border-right: 1px solid var(--border); }
  .proof-item:nth-child(3) { border-right: none; }
  .proof-item:nth-child(3), .proof-item:nth-child(4), .proof-item:nth-child(5) { border-top: 1px solid var(--border); }
  .proof-item:nth-child(5) { border-right: none; }
  .pg-body { grid-template-columns: 1fr; }
  .pg-sidebar { flex-direction: row; flex-wrap: wrap; border-right: none; border-bottom: 1px solid #27272A; }
  .pg-sidebar-section { flex-direction: row; flex-wrap: wrap; gap: 8px; align-items: center; }
  .pg-sidebar-label { width: auto; padding: 0; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .steps-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .code-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .nav-inner { padding: 0 24px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .hero { padding: 120px 24px 0; }
  .hero-title { font-size: 38px; }
  .hero-left { order: 1; }
  .hero-right { order: 2; }
  .model-grid { grid-template-columns: repeat(3, 1fr); }
  .hero-advantages { grid-template-columns: 1fr; gap: 0; }
  .advantage-item { padding: 16px 20px; }
  .proof-bar { padding: 40px 24px; }
  .proof-number { font-size: 36px; }
  .section-inner { padding: 0 24px; }
  .section-title { font-size: 32px; }
  .features { padding: 80px 0; }
  .features-grid { grid-template-columns: 1fr; }
  .playground { padding: 80px 0; }
  .pricing { padding: 80px 0; }
  .quickstart { padding: 80px 0; }
  .steps-grid { grid-template-columns: 1fr; gap: 32px; }
  .code-grid { grid-template-columns: 1fr; }
  .faq { padding: 80px 0; }
  .footer-cta { padding: 80px 24px; }
  .cta-title { font-size: 32px; }
  .footer { padding: 48px 24px; }
  .footer-inner { grid-template-columns: 1fr; gap: 40px; }
  .footer-cols { grid-template-columns: repeat(2, 1fr); }
  .hero-actions { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 480px) {
  .model-grid { grid-template-columns: repeat(2, 1fr); }
  .proof-inner { grid-template-columns: repeat(2, 1fr); }
  .proof-item { border-right: none !important; border-top: 1px solid var(--border) !important; }
  .proof-item:nth-child(1), .proof-item:nth-child(2) { border-top: none !important; }
  .proof-item:nth-child(5) { border-right: none !important; }
  .footer-cols { grid-template-columns: 1fr; }
}
</style>
