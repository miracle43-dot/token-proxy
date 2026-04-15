<template>
  <div class="landing">
    <!-- ===================== Navigation Bar ===================== -->
    <header class="nav" :class="{ scrolled: isScrolled }">
      <div class="nav-inner">
        <a href="/" class="nav-logo">
          <span class="logo-dot"></span>
          <span class="logo-text">TokenProxy</span>
        </a>
        <nav class="nav-links" :class="{ open: menuOpen }">
          <a href="#features" class="nav-link" @click="menuOpen = false">功能</a>
          <a href="#pricing" class="nav-link" @click="menuOpen = false">定价</a>
          <a href="#quickstart" class="nav-link" @click="menuOpen = false">快速开始</a>
          <a href="#faq" class="nav-link" @click="menuOpen = false">FAQ</a>
          <a href="/auth/login" class="nav-link nav-signin" @click="menuOpen = false">登录</a>
          <a href="/auth/register" class="btn-primary nav-cta" @click="menuOpen = false">开始使用 →</a>
        </nav>
        <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }" aria-label="菜单">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <!-- ===================== Hero ===================== -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <div class="hero-pretitle">// AI API Proxy — No VPN Required</div>
          <h1 class="hero-title">
            Build Faster.<br />Ship Without Limits.
          </h1>
          <p class="hero-sub">
            One API key. Access OpenAI, Claude &amp; Gemini —<br class="br-desktop" />
            from China, without compromise.
          </p>
          <div class="hero-actions">
            <a href="/auth/register" class="btn-primary btn-lg">开始使用 →</a>
            <a href="#quickstart" class="btn-outline btn-lg">查看文档</a>
          </div>
        </div>
        <div class="hero-terminal">
          <div class="terminal-window">
            <div class="terminal-titlebar">
              <span class="t-dot t-red"></span>
              <span class="t-dot t-yellow"></span>
              <span class="t-dot t-green"></span>
              <span class="t-title">TokenProxy Console</span>
            </div>
            <div class="terminal-body">
              <div class="t-line"><span class="t-prompt">$</span> <span class="t-cmd">pip install tokenproxy-sdk</span></div>
              <div class="t-line t-muted">─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─</div>
              <div class="t-line t-success">&gt; connecting...</div>
              <div class="t-line t-success">&gt; auth ✓</div>
              <div class="t-line t-success">&gt; ready @ api.tokenproxy.dev</div>
              <div class="t-line">&nbsp;</div>
              <div class="t-line"><span class="t-prompt">$</span> <span class="t-cmd">curl -X POST https://api...</span></div>
              <div class="t-line t-indent">-H <span class="t-str">"Authorization: Bearer $KEY"</span></div>
              <div class="t-line t-indent">-H <span class="t-str">"Content-Type: application/json"</span></div>
              <div class="t-line">&nbsp;</div>
              <div class="t-line">{ <span class="t-key">"model"</span>: <span class="t-str">"gpt-4o"</span>,</div>
              <div class="t-line t-indent2"><span class="t-key">"usage"</span>: { <span class="t-key">"tokens"</span>: <span class="t-num">128</span> }</div>
              <div class="t-line">}</div>
              <div class="t-cursor-line"><span class="t-cursor">_</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Social Proof ===================== -->
    <section class="proof">
      <div class="proof-inner">
        <div class="proof-item" v-for="item in proofItems" :key="item.label">
          <span class="proof-num">{{ item.number }}</span>
          <span class="proof-label">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <!-- ===================== Features ===================== -->
    <section class="features" id="features">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">Why Developers Choose TokenProxy</h2>
          <p class="section-sub">专为开发者打造的 AI API 代理服务</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="f in features" :key="f.title">
            <div class="feature-icon-wrap">
              <span class="feature-icon" v-html="f.icon"></span>
            </div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
            <p class="feature-sub">{{ f.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Playground ===================== -->
    <section class="playground" id="playground">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">Live Playground — Try It Now</h2>
          <p class="section-sub">一个请求就能验证效果</p>
        </div>
        <div class="playground-window">
          <div class="terminal-titlebar">
            <span class="t-dot t-red"></span>
            <span class="t-dot t-yellow"></span>
            <span class="t-dot t-green"></span>
            <span class="t-title">api.tokenproxy.dev — Playground</span>
          </div>
          <div class="playground-body">
            <div class="pg-sidebar">
              <div class="pg-sidebar-title">API Keys</div>
              <div class="pg-key pg-key-active">
                <span class="pg-key-dot"></span>
                <span>key_sk_...7f2a</span>
              </div>
              <div class="pg-key">
                <span class="pg-key-dot pg-key-dot-inactive"></span>
                <span>key_sk_...3b1c</span>
              </div>
              <div class="pg-key">
                <span class="pg-key-dot pg-key-dot-inactive"></span>
                <span>key_sk_...9e4d</span>
              </div>
              <div class="pg-sidebar-title pg-usage-title">Usage</div>
              <div class="pg-usage-row">
                <span class="pg-usage-label">Today</span>
                <span class="pg-usage-val">12,847</span>
              </div>
              <div class="pg-usage-row">
                <span class="pg-usage-label">Balance</span>
                <span class="pg-usage-val pg-usage-money">$24.80</span>
              </div>
            </div>
            <div class="pg-main">
              <div class="pg-model-row">
                <span class="pg-label">Model:</span>
                <span class="pg-model-select">GPT-4o <span class="pg-select-arrow">▾</span></span>
              </div>
              <div class="pg-divider"></div>
              <div class="pg-section-label">Request:</div>
              <div class="pg-code pg-code-req">
                <span class="t-key">POST</span> /v1/chat/completions<br>
                Body: { <span class="t-key">"model"</span>: <span class="t-str">"gpt-4o"</span>, ... }
              </div>
              <div class="pg-divider"></div>
              <div class="pg-section-label">Response: <span class="t-success pg-status">200 OK ✓</span></div>
              <div class="pg-code">
                ↳ tokens: <span class="t-num">1,247</span> | latency: <span class="t-num">213ms</span><br>
                ↳ cache hit: <span class="t-success">true</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Pricing ===================== -->
    <section class="pricing" id="pricing">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">Simple, Transparent Pricing</h2>
          <p class="section-sub">无月费、无最低消费，充值多少用多少</p>
        </div>
        <div class="pricing-grid">
          <div class="pricing-card" v-for="plan in pricingPlans" :key="plan.name" :class="{ recommended: plan.recommended }">
            <div v-if="plan.recommended" class="badge-recommended">推荐</div>
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">
              <span class="price-num">{{ plan.price }}</span>
              <span v-if="plan.priceSuffix" class="price-suffix">{{ plan.priceSuffix }}</span>
            </div>
            <div class="plan-desc">{{ plan.desc }}</div>
            <ul class="plan-features">
              <li v-for="feat in plan.features" :key="feat">{{ feat }}</li>
            </ul>
            <a :href="plan.ctaLink" class="btn-block" :class="plan.recommended ? 'btn-primary' : 'btn-outline'">
              {{ plan.cta }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Quick Start ===================== -->
    <section class="quickstart" id="quickstart">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">Up and Running in 60 Seconds</h2>
          <p class="section-sub">3 步完成接入，零学习成本</p>
        </div>
        <div class="steps">
          <div class="step-item" v-for="(step, i) in steps" :key="i">
            <div class="step-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="step-body">
              <div class="step-icon" v-html="step.icon"></div>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
            <div class="step-code">
              <pre class="step-code-block"><span class="t-comment">{{ step.codeComment }}</span></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== FAQ ===================== -->
    <section class="faq" id="faq">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">Common Questions</h2>
        </div>
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
              <span class="faq-toggle">{{ openFaq === i ? '−' : '+' }}</span>
            </div>
            <div class="faq-a" v-show="openFaq === i">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Footer CTA ===================== -->
    <section class="footer-cta">
      <div class="cta-inner">
        <h2 class="cta-title">Ready to ship?</h2>
        <p class="cta-sub">注册即送 $5 体验金，无需信用卡</p>
        <a href="/auth/register" class="btn-primary btn-lg">开始使用 →</a>
      </div>
    </section>

    <!-- ===================== Footer ===================== -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="/" class="footer-logo">
            <span class="logo-dot"></span>
            <span class="logo-text">TokenProxy</span>
          </a>
          <p class="footer-tagline">让 AI 调用像呼吸一样简单</p>
        </div>
        <div class="footer-links">
          <div class="footer-col" v-for="col in footerCols" :key="col.title">
            <h4 class="footer-col-title">{{ col.title }}</h4>
            <ul>
              <li v-for="link in col.links" :key="link.label">
                <a :href="link.href" class="footer-link">{{ link.label }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 TokenProxy. Built for developers.</span>
        <div class="footer-legal">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const menuOpen = ref(false);
const openFaq = ref(null);

const proofItems = [
  { number: '12,000+', label: '开发者' },
  { number: '99.9%', label: '可用率' },
  { number: '50M+', label: 'API 调用量' },
  { number: '4.9/5', label: '用户评分' },
];

const features = [
  {
    icon: '&#9889;',
    title: 'No VPN',
    desc: '国内直连，无需任何额外网络配置',
    sub: '替换 endpoint 即可，零门槛接入',
  },
  {
    icon: '&#128274;',
    title: 'Stable',
    desc: '99.9% 可用率，多区域智能路由',
    sub: '自动容灾切换，保障业务连续性',
  },
  {
    icon: '&#128176;',
    title: 'Clear Pricing',
    desc: '按量计费无隐藏费用，明码标价',
    sub: '费用清晰无套路，用多少付多少',
  },
  {
    icon: '&#128640;',
    title: 'Instant Access',
    desc: '注册即用，3秒完成 API Key 获取',
    sub: '支持 OpenAI SDK，零学习成本',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    priceSuffix: ' / forever',
    desc: '体验全部功能',
    features: [
      '100k tokens / 月',
      '基础模型支持',
      '1 个 API Key',
      'Community support',
    ],
    cta: '开始使用',
    ctaLink: '/auth/register',
    recommended: false,
  },
  {
    name: 'Pro',
    price: '$29',
    priceSuffix: ' / month',
    desc: '适合个人开发者',
    features: [
      '10M tokens / 月',
      '全模型 + 优先队列',
      '5 个 API Keys',
      'Email support',
    ],
    cta: '立即升级',
    ctaLink: '/auth/register',
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceSuffix: '',
    desc: '适合企业级用户',
    features: [
      'Unlimited tokens',
      'SLA 99.99%',
      '无限制 API Keys',
      '专属 Slack 支持',
    ],
    cta: '联系我们',
    ctaLink: '/auth/register',
    recommended: false,
  },
];

const steps = [
  {
    title: '注册账号',
    desc: '免费创建账号，30秒完成，无需信用卡',
    icon: '&#128100;',
    codeComment: '# Step 1: Sign up → 打开 tokenproxy.dev，注册账号',
  },
  {
    title: '获取 Key',
    desc: '仪表盘一键生成 API Key，立即生效',
    icon: '&#128273;',
    codeComment: '# Step 2: Get your key\n$ curl https://api.tokenproxy.dev/keys \\\n  -H "Authorization: Bearer $YOUR_TOKEN"',
  },
  {
    title: '开始调用',
    desc: '一个请求就能验证效果，用完即充',
    icon: '&#128640;',
    codeComment: '# Step 3: Make your first call\n$ curl -X POST https://api.tokenproxy.dev/v1/chat \\\n  -H "Authorization: Bearer sk_live_xxxx" \\\n  -d \'{"model":"gpt-4o","messages":[{"role":"user","content":"Hi"}]}\'',
  },
];

const faqItems = [
  {
    q: 'TokenProxy 和直接调用官方 API 有什么区别？',
    a: '核心区别是**无需翻墙**。TokenProxy 在中国大陆部署了直连节点，你不需要任何代理工具即可稳定访问 OpenAI/Claude/Gemini。同时我们提供智能路由、自动重试、用量统计，一个平台搞定所有。',
  },
  {
    q: '费用如何计算？是否有隐藏费用？',
    a: '无隐藏费用。按实际 token 消耗计费，费用与你直接调官方 API 一致（部分模型甚至更低）。Pro 套餐明码标价，无订阅陷阱，随时可取消。',
  },
  {
    q: '支持哪些模型？',
    a: '目前支持 OpenAI 全模型（GPT-4o、GPT-4o-mini 等）、Claude 3.5 全系列、Gemini Pro/Flash，后续持续接入新模型。仪表盘实时展示最新可用模型列表。',
  },
];

const footerCols = [
  {
    title: 'Product',
    links: [
      { label: '功能介绍', href: '#features' },
      { label: '定价', href: '#pricing' },
      { label: '更新日志', href: '#' },
      { label: '状态页', href: '#' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { label: 'API 文档', href: '#' },
      { label: 'SDK 下载', href: '#' },
      { label: '快速开始', href: '#quickstart' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: '关于我们', href: '#' },
      { label: '联系方式', href: '#' },
      { label: '隐私政策', href: '#' },
    ],
  },
];

function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}

function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* ==================== CSS Variables ==================== */
.landing {
  --bg: #FFFFFF;
  --bg-subtle: #F8FAFC;
  --bg-surface: #FFFFFF;
  --bg-hover: #F1F5F9;
  --border: #E2E8F0;
  --border-bright: #CBD5E1;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --purple: #7C3AED;
  --purple-light: #A78BFA;
  --purple-dim: #EDE9FE;
  --green: #22C55E;
  --red: #EF4444;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Menlo', monospace;
  background: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-sans);
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }

/* ==================== Nav Bar ==================== */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 64px;
  background: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid var(--border);
  transition: box-shadow 200ms ease;
}

.nav.scrolled {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--border);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 32px;
  gap: 40px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--purple);
  display: inline-block;
  flex-shrink: 0;
}

.logo-text {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 8px 14px;
  border-radius: 6px;
  transition: color 150ms ease, background 150ms ease;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-signin { margin-left: 8px; }

.nav-cta {
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  margin-left: 8px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--purple);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 150ms ease, transform 80ms ease, box-shadow 150ms ease;
  white-space: nowrap;
}

.btn-primary:hover {
  background: #6D28D9;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
}

.btn-primary:active { transform: scale(0.98); }

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--text-secondary);
  border: 1.5px solid var(--border-bright);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 150ms ease, color 150ms ease, background 150ms ease;
}

.btn-outline:hover {
  border-color: var(--purple);
  color: var(--purple);
  background: var(--purple-dim);
}

.btn-lg {
  padding: 14px 28px;
  font-size: 15px;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: auto;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 200ms ease;
}

.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* ==================== Hero ==================== */
.hero {
  padding-top: 160px;
  padding-bottom: 120px;
  background: var(--bg);
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-pretitle {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--purple);
  margin-bottom: 20px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.hero-title {
  font-size: clamp(40px, 5vw, 60px);
  font-weight: 800;
  line-height: 1.08;
  color: var(--text-primary);
  margin-bottom: 24px;
  letter-spacing: -2px;
}

.hero-sub {
  font-size: 18px;
  line-height: 1.65;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.br-desktop { display: block; }

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

/* Terminal Window */
.hero-terminal { width: 100%; }

.terminal-window {
  background: #1E1E2E;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08);
}

.terminal-titlebar {
  background: #2A2A3C;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.t-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.t-red { background: #FF5F57; }
.t-yellow { background: #FFBD2E; }
.t-green { background: #28C840; }

.t-title {
  margin-left: 8px;
  font-size: 13px;
  color: #6B7280;
  font-family: var(--font-mono);
}

.terminal-body {
  padding: 20px 24px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.9;
  color: #D1D5DB;
}

.t-line { display: block; }
.t-prompt { color: var(--purple-light); margin-right: 8px; }
.t-cmd { color: #E5E7EB; }
.t-muted { color: #4B5563; font-size: 12px; }
.t-success { color: var(--green); }
.t-indent { padding-left: 20px; color: #9CA3AF; }
.t-indent2 { padding-left: 32px; }
.t-key { color: var(--purple-light); }
.t-str { color: #86EFAC; }
.t-num { color: #FCD34D; }
.t-cursor { color: var(--purple-light); animation: blink 1s step-end infinite; }
.t-cursor-line { margin-top: 4px; }

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ==================== Social Proof ==================== */
.proof {
  background: var(--bg-subtle);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 40px 32px;
}

.proof-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
}

.proof-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.proof-num {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.proof-label {
  font-size: 14px;
  color: var(--text-muted);
}

/* ==================== Section Shared ==================== */
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.section-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
  letter-spacing: -1px;
}

.section-sub {
  font-size: 17px;
  color: var(--text-secondary);
}

/* ==================== Features ==================== */
.features {
  padding: 120px 0;
  background: var(--bg);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.feature-card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-card:hover {
  border-color: var(--purple);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.1);
  transform: translateY(-2px);
}

.feature-icon-wrap {
  width: 48px;
  height: 48px;
  background: var(--purple-dim);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.feature-icon {
  font-size: 22px;
  line-height: 1;
}

.feature-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
}

.feature-desc {
  font-size: 14px;
  color: var(--purple);
  font-weight: 500;
  line-height: 1.5;
}

.feature-sub {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* ==================== Playground ==================== */
.playground {
  padding: 120px 0;
  background: var(--bg-subtle);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.playground-window {
  background: #1E1E2E;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.06);
}

.playground-body {
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 340px;
}

.pg-sidebar {
  background: #252536;
  padding: 20px 16px;
  border-right: 1px solid #2E2E42;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pg-sidebar-title {
  font-size: 11px;
  font-weight: 600;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 12px 8px 8px;
  font-family: var(--font-mono);
}

.pg-usage-title { margin-top: 16px; }

.pg-key {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  font-family: var(--font-mono);
  color: #9CA3AF;
  cursor: pointer;
  transition: background 150ms ease;
}

.pg-key:hover { background: #2E2E42; }

.pg-key-active {
  background: rgba(124, 58, 237, 0.2);
  color: #E5E7EB;
}

.pg-key-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
  flex-shrink: 0;
}

.pg-key-dot-inactive { background: #4B5563; }

.pg-usage-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  font-size: 13px;
  font-family: var(--font-mono);
}

.pg-usage-label { color: #6B7280; }
.pg-usage-val { color: #E5E7EB; }
.pg-usage-money { color: var(--green); }

.pg-main {
  padding: 20px 24px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.8;
  color: #D1D5DB;
}

.pg-model-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.pg-label { color: #6B7280; }

.pg-model-select {
  background: #2E2E42;
  border: 1px solid #3D3D52;
  border-radius: 6px;
  padding: 4px 12px;
  color: #E5E7EB;
  font-size: 13px;
}

.pg-select-arrow { margin-left: 8px; color: #6B7280; }

.pg-divider {
  border-top: 1px solid #2E2E42;
  margin: 12px 0;
}

.pg-section-label {
  color: #6B7280;
  margin-bottom: 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.pg-code {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.8;
  color: #D1D5DB;
  padding: 8px 0;
}

.pg-code-req { color: #9CA3AF; }

.pg-status { color: var(--green); }

/* ==================== Pricing ==================== */
.pricing {
  padding: 120px 0;
  background: var(--bg);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.pricing-card {
  background: var(--bg-surface);
  border: 1.5px solid var(--border);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
}

.pricing-card:hover {
  border-color: var(--border-bright);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.pricing-card.recommended {
  border: 2px solid var(--purple);
  background: linear-gradient(180deg, #FAF5FF 0%, #FFFFFF 100%);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.12);
}

.badge-recommended {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--purple);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 16px;
  border-radius: 20px;
  white-space: nowrap;
}

.plan-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
}

.plan-price {
  text-align: center;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}

.price-num {
  font-size: 44px;
  font-weight: 800;
  color: var(--text-primary);
  font-family: var(--font-mono);
  letter-spacing: -1px;
}

.price-suffix {
  font-size: 14px;
  color: var(--text-muted);
}

.plan-desc {
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.plan-features li {
  font-size: 14px;
  color: var(--text-secondary);
  padding-left: 20px;
  position: relative;
  line-height: 1.5;
}

.plan-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--green);
  font-size: 12px;
}

.btn-block {
  display: block;
  text-align: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 150ms ease;
  margin-top: auto;
}

/* ==================== Quick Start ==================== */
.quickstart {
  padding: 120px 0;
  background: var(--bg-subtle);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  max-width: 960px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step-num {
  font-size: 48px;
  font-weight: 800;
  color: var(--purple-dim);
  font-family: var(--font-mono);
  line-height: 1;
  margin-bottom: 16px;
  letter-spacing: -2px;
}

.step-body {
  margin-bottom: 20px;
}

.step-icon {
  font-size: 28px;
  margin-bottom: 10px;
  display: block;
}

.step-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.step-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.step-code-block {
  background: #1E1E2E;
  border-radius: 8px;
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.8;
  color: #9CA3AF;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

.t-comment { color: #6B7280; font-style: italic; }

/* ==================== FAQ ==================== */
.faq {
  padding: 120px 0;
  background: var(--bg);
}

.faq-list {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.faq-item {
  border-top: 1px solid var(--border);
  cursor: pointer;
  transition: background 150ms ease;
}

.faq-item:last-child { border-bottom: 1px solid var(--border); }
.faq-item:hover { background: var(--bg-hover); }

.faq-item:first-child { border-radius: 8px 8px 0 0; overflow: hidden; }
.faq-item:last-child { border-radius: 0 0 8px 8px; overflow: hidden; }

.faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  user-select: none;
  gap: 16px;
}

.faq-item.open .faq-q { color: var(--purple); }

.faq-toggle {
  font-size: 22px;
  color: var(--text-muted);
  flex-shrink: 0;
  font-weight: 400;
  line-height: 1;
}

.faq-a {
  padding-bottom: 20px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
  animation: fadeIn 200ms ease both;
}

/* ==================== Footer CTA ==================== */
.footer-cta {
  padding: 100px 32px;
  text-align: center;
  background: var(--bg-subtle);
  border-top: 1px solid var(--border);
}

.cta-inner { max-width: 600px; margin: 0 auto; }

.cta-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 14px;
  letter-spacing: -1.5px;
}

.cta-sub {
  font-size: 17px;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

/* ==================== Footer ==================== */
.footer {
  background: var(--bg-subtle);
  border-top: 1px solid var(--border);
  padding: 64px 32px 32px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 64px;
  margin-bottom: 48px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-tagline {
  font-size: 14px;
  color: var(--text-muted);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-col-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }

.footer-link {
  font-size: 14px;
  color: var(--text-muted);
  transition: color 150ms ease;
}

.footer-link:hover { color: var(--purple); }

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-muted);
  flex-wrap: wrap;
  gap: 12px;
}

.footer-legal { display: flex; gap: 24px; }
.footer-legal a { color: var(--text-muted); transition: color 150ms ease; }
.footer-legal a:hover { color: var(--text-secondary); }

/* ==================== Animations ==================== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ==================== Responsive ==================== */
@media (max-width: 1024px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .playground-body { grid-template-columns: 1fr; }
  .pg-sidebar { flex-direction: row; flex-wrap: wrap; border-right: none; border-bottom: 1px solid #2E2E42; padding: 12px; gap: 8px; }
  .pg-sidebar-title { padding: 4px 8px; width: auto; }
  .pg-key { padding: 4px 8px; }
  .pg-usage-title { margin-top: 0; }
  .pg-usage-row { padding: 4px 8px; }
}

@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; gap: 48px; padding-top: 120px; padding-bottom: 80px; }
  .hero-terminal { display: none; }
  .br-desktop { display: none; }
  .steps { grid-template-columns: 1fr; gap: 32px; }
  .pricing-grid { grid-template-columns: 1fr; max-width: 400px; }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(16px);
    flex-direction: column;
    padding: 20px 24px 24px;
    gap: 4px;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
  .nav-links.open { display: flex; }
  .hamburger { display: flex; }
  .nav-signin { margin-left: 0; }

  .proof-inner { grid-template-columns: repeat(2, 1fr); }
  .features { padding: 80px 0; }
  .features-grid { grid-template-columns: 1fr; }
  .playground { padding: 80px 0; }
  .pricing { padding: 80px 0; }
  .quickstart { padding: 80px 0; }
  .faq { padding: 80px 0; }
  .footer-cta { padding: 80px 32px; }
  .footer-inner { grid-template-columns: 1fr; gap: 40px; }
  .footer-links { grid-template-columns: repeat(2, 1fr); }
  .footer-bottom { flex-direction: column; text-align: center; gap: 8px; }
  .hero-title { font-size: 36px; }
  .hero-actions { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 480px) {
  .features-grid { grid-template-columns: 1fr; }
  .footer-links { grid-template-columns: 1fr; }
  .proof-inner { grid-template-columns: repeat(2, 1fr); }
}

</style>
