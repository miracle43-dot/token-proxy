<template>
  <div class="landing">
    <!-- ===================== Navigation Bar ===================== -->
    <header class="nav-bar" :class="{ scrolled: isScrolled }">
      <div class="nav-inner">
        <div class="nav-logo">
          <span class="logo-icon">⚡</span>
          <span class="logo-text">TokenProxy</span>
        </div>
        <nav class="nav-links" :class="{ open: menuOpen }">
          <a href="#features" class="nav-link" @click="menuOpen = false">Features</a>
          <a href="#pricing" class="nav-link" @click="menuOpen = false">Pricing</a>
          <a href="#quickstart" class="nav-link" @click="menuOpen = false">Docs</a>
          <a href="#faq" class="nav-link" @click="menuOpen = false">FAQ</a>
          <a href="/auth/login" class="nav-link nav-signin" @click="menuOpen = false">Sign In</a>
          <a href="/auth/register" class="btn-primary nav-cta" @click="menuOpen = false">Get Started ▶</a>
        </nav>
        <button class="hamburger" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <!-- ===================== Hero Section ===================== -->
    <section class="hero">
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <div class="hero-content">
          <h1 class="hero-title">
            让 AI 调用<br />像呼吸一样简单
          </h1>
          <p class="hero-sub">
            无需翻墙、稳定快速、按量计费——一个 API Key，<br class="br-desktop" />
            连接 OpenAI · Claude · Gemini 全模型
          </p>
          <div class="hero-actions">
            <a href="/auth/register" class="btn-primary btn-lg">Get Started Free ▶</a>
            <a href="#pricing" class="btn-secondary btn-lg">View Pricing ↓</a>
          </div>
        </div>
        <div class="hero-screenshot">
          <div class="window-chrome">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
            <span class="window-title">TokenProxy Dashboard</span>
          </div>
          <div class="terminal">
            <pre class="terminal-code"><span class="t-keyword">import</span> <span class="t-var">openai</span>

client = openai.<span class="t-fn">OpenAI</span>(
    api_key=<span class="t-str">"tkp_xxxxxxxxxxxx"</span>,
    base_url=<span class="t-str">"https://api.tokenproxy.com/v1"</span>
)

resp = client.chat.completions.<span class="t-fn">create</span>(
    model=<span class="t-str">"gpt-4o"</span>,
    messages=[{<span class="t-attr">"role"</span>: <span class="t-str">"user"</span>, <span class="t-attr">"content"</span>: <span class="t-str">"Hello!"</span>}]
)
<span class="t-comment"># → 响应时间: 142ms ✓</span></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Social Proof ===================== -->
    <section class="social-proof">
      <div class="proof-inner">
        <div class="proof-item" v-for="item in proofItems" :key="item.label">
          <span class="proof-number">{{ item.number }}</span>
          <span class="proof-label">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <!-- ===================== Features ===================== -->
    <section class="features" id="features">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">为什么选择 TokenProxy</h2>
          <p class="section-sub">专为开发者打造的 AI API 代理服务</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="f in features" :key="f.title">
            <div class="feature-icon">{{ f.icon }}</div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
            <p class="feature-sub">{{ f.sub }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Pricing ===================== -->
    <section class="pricing" id="pricing">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">透明定价，用多少付多少</h2>
          <p class="section-sub">无月费、无最低消费，充值多少用多少</p>
        </div>
        <div class="pricing-grid">
          <div class="pricing-card" v-for="plan in pricingPlans" :key="plan.name" :class="{ recommended: plan.recommended }">
            <div v-if="plan.recommended" class="badge-recommended">推荐</div>
            <div class="plan-name">{{ plan.name }}</div>
            <div class="plan-price">
              <span v-if="plan.price !== '定制'" class="price-yen">¥</span>
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

        <!-- 模型价格表 -->
        <div class="model-table">
          <h3 class="model-table-title">热门模型价格</h3>
          <div class="table-wrapper">
            <table class="model-pricing-table">
              <thead>
                <tr>
                  <th>模型</th>
                  <th>输入 (¥/1M Tokens)</th>
                  <th>输出 (¥/1M Tokens)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in modelPrices" :key="m.name">
                  <td>{{ m.name }}</td>
                  <td>¥{{ m.input }}</td>
                  <td>¥{{ m.output }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Quick Start ===================== -->
    <section class="quickstart" id="quickstart">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">3 步完成接入</h2>
          <p class="section-sub">替换一行代码，立即享受国内加速</p>
        </div>
        <div class="steps-layout">
          <div class="steps">
            <div class="step-item" v-for="(step, i) in steps" :key="i">
              <div class="step-num">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="step-content">
                <div class="step-icon">{{ step.icon }}</div>
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-desc">{{ step.desc }}</p>
              </div>
              <div v-if="i < steps.length - 1" class="step-arrow">→</div>
            </div>
          </div>
          <div class="code-block">
            <div class="code-header">
              <span class="code-lang">Python</span>
              <button class="copy-btn" @click="copyCode">Copy</button>
            </div>
            <pre class="code-body"><span class="t-keyword">import</span> <span class="t-var">openai</span>

client = openai.<span class="t-fn">OpenAI</span>(
    api_key=<span class="t-str">"tkp_xxxxxxxxxxxx"</span>,  <span class="t-comment"># ← 替换为你的 Key</span>
    base_url=<span class="t-str">"https://api.tokenproxy.com/v1"</span>  <span class="t-comment"># ← TokenProxy 端点</span>
)

response = client.chat.completions.<span class="t-fn">create</span>(
    model=<span class="t-str">"gpt-4o"</span>,
    messages=[{<span class="t-attr">"role"</span>: <span class="t-str">"user"</span>, <span class="t-attr">"content"</span>: <span class="t-str">"Hello!"</span>}]
)
<span class="t-comment"># 响应时间: P99 &lt; 200ms ✓</span></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== FAQ ===================== -->
    <section class="faq" id="faq">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">常见问题</h2>
        </div>
        <div class="faq-list">
          <div
            class="faq-item"
            v-for="(item, i) in faqItems"
            :key="i"
            :class="{ open: openFaq === i }"
            @click="toggleFaq(i)"
          >
            <div class="faq-question">
              <span>{{ item.q }}</span>
              <span class="faq-toggle">{{ openFaq === i ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" v-show="openFaq === i">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== Footer CTA ===================== -->
    <section class="footer-cta">
      <div class="cta-glow-left"></div>
      <div class="cta-glow-right"></div>
      <div class="cta-inner">
        <h2 class="cta-title">准备好了吗？</h2>
        <p class="cta-sub">立即开始，无需信用卡</p>
        <a href="/auth/register" class="btn-primary btn-lg btn-cta">Get Started Free ▶</a>
      </div>
    </section>

    <!-- ===================== Footer ===================== -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo">
            <span class="logo-icon">⚡</span>
            <span class="logo-text">TokenProxy</span>
          </div>
          <p class="footer-tagline">让 AI 调用像呼吸一样简单</p>
          <div class="footer-socials">
            <a href="#" class="social-link" title="GitHub">⎔</a>
            <a href="#" class="social-link" title="Twitter">✕</a>
            <a href="#" class="social-link" title="微信">💬</a>
          </div>
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
        <span>© 2026 TokenProxy. All rights reserved.</span>
        <div class="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Acceptable Use</a>
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
    icon: '⚡',
    title: '极速稳定',
    desc: '全模型专线接入',
    sub: 'P99 延迟 < 200ms，比官方更快',
  },
  {
    icon: '🌐',
    title: '无需翻墙',
    desc: '国内直连，零配置',
    sub: '替换官方 endpoint 即可使用',
  },
  {
    icon: '💰',
    title: '价格优惠',
    desc: '比官方更低的价格',
    sub: '按量计费，无最低消费',
  },
  {
    icon: '🔧',
    title: '简单易用',
    desc: '3 步完成接入',
    sub: '兼容 OpenAI SDK，零学习成本',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '免费',
    priceSuffix: '',
    desc: '体验全部功能',
    features: [
      '100 万 tokens 免费额度',
      '支持全部主流模型',
      '基础用量统计',
      '社区支持',
    ],
    cta: '免费开始',
    ctaLink: '/auth/register',
    recommended: false,
  },
  {
    name: 'Pro',
    price: '99',
    priceSuffix: '/月',
    desc: '适合个人开发者',
    features: [
      '1 亿 tokens/月',
      '全模型通用',
      'SLA 99.9%',
      '优先技术支持',
      '用量详细报表',
    ],
    cta: '立即购买',
    ctaLink: '/auth/register',
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: '定制',
    priceSuffix: '',
    desc: '适合企业级用户',
    features: [
      '不限用量',
      '私有部署支持',
      '专属客服',
      'SLA 99.99%',
      '定制化功能',
    ],
    cta: '联系我们',
    ctaLink: '/auth/register',
    recommended: false,
  },
];

const modelPrices = [
  { name: 'GPT-4o', input: '8', output: '24' },
  { name: 'GPT-4o-mini', input: '1.5', output: '6' },
  { name: 'Claude 3.5 Sonnet', input: '12', output: '36' },
  { name: 'Gemini 1.5 Pro', input: '8', output: '24' },
  { name: 'Gemini 2.0 Flash', input: '1', output: '4' },
];

const steps = [
  {
    icon: '👤',
    title: '注册账号',
    desc: '邮箱注册，30秒完成，无需手机号',
  },
  {
    icon: '💳',
    title: '充值余额',
    desc: '支付宝/微信/银行卡，按量计费',
  },
  {
    icon: '🚀',
    title: '开始调用',
    desc: '替换 API Base URL，立即使用',
  },
];

const faqItems = [
  {
    q: '支持哪些模型？',
    a: 'OpenAI GPT-4/4o/4o-mini、Claude 3.5/3 Opus、Gemini 1.5/2.0 等，后续持续更新。具体模型列表请参考价格页面。',
  },
  {
    q: '访问速度如何？',
    a: '全模型专线接入，国内延迟 P99 < 200ms，比官方更快。国内用户无需任何配置即可享受加速。',
  },
  {
    q: '如何计费？',
    a: '按实际使用的 tokens 数量计费，无月费、无最低消费。费用 = (输入 Tokens × 输入单价 + 输出 Tokens × 输出单价) / 1,000,000。',
  },
  {
    q: '有免费额度吗？',
    a: '新用户赠送 100 万 tokens 免费额度，可体验全部模型。无需信用卡，直接注册即可领取。',
  },
  {
    q: '数据安全吗？',
    a: '全程 HTTPS 加密传输，不存储用户对话内容，支持企业私有部署，保障数据主权。',
  },
];

const footerCols = [
  {
    title: '产品',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    title: '资源',
    links: [
      { label: 'Docs', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'SDK', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: '公司',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
];

function handleScroll() {
  isScrolled.value = window.scrollY > 20;
}

function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i;
}

function copyCode() {
  const code = `import openai

client = openai.OpenAI(
    api_key="tkp_xxxxxxxxxxxx",  # ← 替换为你的 Key
    base_url="https://api.tokenproxy.com/v1"  # ← TokenProxy 端点
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)`;
  navigator.clipboard.writeText(code).catch(() => {});
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* ==================== Base ==================== */
.landing {
  background: var(--bg-base, #0A0A0F);
  color: var(--text-primary, #F5F5F7);
  font-family: var(--font-sans, 'Inter', 'PingFang SC', sans-serif);
  overflow-x: hidden;
}

a { text-decoration: none; color: inherit; }

/* ==================== Nav Bar ==================== */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 72px;
  transition: background 200ms ease, box-shadow 200ms ease;
}

.nav-bar.scrolled {
  background: rgba(15, 15, 26, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 rgba(45, 45, 68, 0.6);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 48px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.logo-icon { font-size: 20px; }

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--brand-primary, #7C3AED);
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-left: auto;
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary, #9898A6);
  transition: color 200ms ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  right: 50%;
  height: 2px;
  background: var(--brand-primary, #7C3AED);
  transition: left 200ms ease, right 200ms ease;
}

.nav-link:hover { color: var(--text-primary, #F5F5F7); }
.nav-link:hover::after { left: 0; right: 0; }

.nav-signin { margin-left: 8px; }

.nav-cta {
  padding: 10px 20px;
  font-size: 14px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--brand-primary, #7C3AED);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
  white-space: nowrap;
}

.btn-primary:hover {
  background: var(--brand-primary-light, #8B5CF6);
  transform: scale(1.02);
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.35);
}

.btn-primary:active { transform: scale(0.98); }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--text-secondary, #9898A6);
  border: 1px solid var(--border-default, #2A2A3A);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-secondary:hover {
  border-color: var(--brand-primary, #7C3AED);
  color: var(--text-primary, #F5F5F7);
}

.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 10px;
}

.btn-outline {
  display: block;
  text-align: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  border: 1px solid var(--border-default, #2A2A3A);
  color: var(--text-secondary, #9898A6);
  transition: all 200ms ease;
  background: transparent;
}

.btn-outline:hover {
  border-color: var(--brand-primary, #7C3AED);
  color: var(--text-primary, #F5F5F7);
}

.btn-block {
  display: block;
  text-align: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  transition: all 200ms ease;
  margin-top: auto;
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
  background: var(--text-primary, #F5F5F7);
  border-radius: 2px;
  transition: all 200ms ease;
}

.hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* ==================== Hero ==================== */
.hero {
  position: relative;
  padding-top: 140px;
  padding-bottom: 96px;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  top: -100px;
  right: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%);
  pointer-events: none;
}

.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
}

.hero-content {
  text-align: center;
  max-width: 720px;
  animation: fadeInUp 0.6s ease both;
}

.hero-title {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-primary, #F5F5F7);
  margin-bottom: 24px;
  letter-spacing: -1.5px;
}

.hero-sub {
  font-size: 20px;
  line-height: 1.6;
  color: var(--text-secondary, #9898A6);
  margin-bottom: 40px;
}

.br-desktop { display: block; }

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-screenshot {
  width: 100%;
  max-width: 800px;
  animation: fadeInUp 0.6s 0.2s ease both;
}

.window-chrome {
  background: #1A1A2E;
  border: 1px solid var(--border-default, #2A2A3A);
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.dot-red { background: #EF4444; }
.dot-yellow { background: #F59E0B; }
.dot-green { background: #10B981; }

.window-title {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-tertiary, #5C5C6E);
  font-family: var(--font-mono, monospace);
}

.terminal {
  background: #12121F;
  border: 1px solid var(--border-default, #2A2A3A);
  border-radius: 0 0 12px 12px;
  padding: 24px;
  overflow-x: auto;
}

.terminal-code {
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-primary, #F5F5F7);
  white-space: pre;
}

/* ==================== Social Proof ==================== */
.social-proof {
  background: var(--bg-surface, #111118);
  border-top: 1px solid var(--border-subtle, #1E1E2A);
  border-bottom: 1px solid var(--border-subtle, #1E1E2A);
  padding: 32px 24px;
  animation: fadeInUp 0.6s 0.1s ease both;
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

.proof-number {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary, #F5F5F7);
  font-family: var(--font-mono, monospace);
}

.proof-label {
  font-size: 14px;
  color: var(--text-secondary, #9898A6);
}

/* ==================== Section Shared ==================== */
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.section-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: var(--text-primary, #F5F5F7);
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.section-sub {
  font-size: 18px;
  color: var(--text-secondary, #9898A6);
}

/* ==================== Features ==================== */
.features {
  padding: 96px 0;
  animation: fadeInUp 0.6s ease both;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.feature-card {
  background: var(--bg-surface, #111118);
  border: 1px solid var(--border-default, #2A2A3A);
  border-radius: 16px;
  padding: 32px;
  transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-card:hover {
  border-color: var(--brand-primary, #7C3AED);
  box-shadow: 0 4px 24px rgba(124, 58, 237, 0.15), 0 1px 4px rgba(0, 0, 0, 0.4);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.feature-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary, #F5F5F7);
}

.feature-desc {
  font-size: 16px;
  color: var(--brand-primary, #7C3AED);
  font-weight: 500;
}

.feature-sub {
  font-size: 14px;
  color: var(--text-secondary, #9898A6);
}

/* ==================== Pricing ==================== */
.pricing {
  padding: 96px 0;
  background: var(--bg-surface, #111118);
  border-top: 1px solid var(--border-subtle, #1E1E2A);
  border-bottom: 1px solid var(--border-subtle, #1E1E2A);
  animation: fadeInUp 0.6s ease both;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 56px;
}

.pricing-card {
  background: var(--bg-base, #0A0A0F);
  border: 1px solid var(--border-default, #2A2A3A);
  border-radius: 16px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.pricing-card.recommended {
  background: linear-gradient(145deg, #1E1E35, #1A1A2E);
  border: 1px solid var(--brand-primary, #7C3AED);
  box-shadow: 0 0 32px rgba(124, 58, 237, 0.2);
}

.badge-recommended {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--brand-primary, #7C3AED);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 16px;
  border-radius: 20px;
  white-space: nowrap;
}

.plan-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #F5F5F7);
  text-align: center;
}

.plan-price {
  text-align: center;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}

.price-yen {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary, #F5F5F7);
}

.price-num {
  font-size: 48px;
  font-weight: 700;
  color: var(--text-primary, #F5F5F7);
  font-family: var(--font-mono, monospace);
}

.price-suffix {
  font-size: 14px;
  color: var(--text-secondary, #9898A6);
}

.plan-desc {
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary, #9898A6);
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
  color: var(--text-secondary, #9898A6);
  padding-left: 20px;
  position: relative;
}

.plan-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success, #10B981);
  font-size: 12px;
}

/* Model table */
.model-table {
  border: 1px solid var(--border-default, #2A2A3A);
  border-radius: 16px;
  overflow: hidden;
}

.model-table-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #F5F5F7);
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-default, #2A2A3A);
}

.table-wrapper { overflow-x: auto; }

.model-pricing-table {
  width: 100%;
  border-collapse: collapse;
}

.model-pricing-table th {
  background: var(--bg-elevated, #1C1C26);
  color: var(--text-secondary, #9898A6);
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  padding: 14px 24px;
  border-bottom: 1px solid var(--border-default, #2A2A3A);
}

.model-pricing-table td {
  padding: 14px 24px;
  font-size: 14px;
  color: var(--text-primary, #F5F5F7);
  border-bottom: 1px solid var(--border-subtle, #1E1E2A);
  font-family: var(--font-mono, monospace);
}

.model-pricing-table tr:last-child td { border-bottom: none; }
.model-pricing-table tr:hover td { background: rgba(124, 58, 237, 0.04); }

/* ==================== Quick Start ==================== */
.quickstart {
  padding: 96px 0;
  animation: fadeInUp 0.6s ease both;
}

.steps-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
}

.step-num {
  font-size: 13px;
  font-weight: 700;
  color: var(--brand-primary, #7C3AED);
  font-family: var(--font-mono, monospace);
  min-width: 28px;
  padding-top: 4px;
}

.step-content {
  flex: 1;
  padding-bottom: 32px;
}

.step-icon { font-size: 28px; margin-bottom: 8px; }

.step-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary, #F5F5F7);
  margin-bottom: 6px;
}

.step-desc {
  font-size: 14px;
  color: var(--text-secondary, #9898A6);
}

.step-arrow {
  position: absolute;
  right: -44px;
  top: 8px;
  font-size: 20px;
  color: var(--border-strong, #3D3D52);
}

/* Code Block */
.code-block {
  background: #12121F;
  border: 1px solid var(--border-default, #2A2A3A);
  border-radius: 12px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-default, #2A2A3A);
}

.code-lang {
  font-size: 12px;
  color: var(--text-tertiary, #5C5C6E);
  font-family: var(--font-mono, monospace);
}

.copy-btn {
  font-size: 12px;
  background: rgba(124, 58, 237, 0.15);
  color: var(--brand-primary, #7C3AED);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
  font-family: var(--font-sans, sans-serif);
  transition: all 200ms ease;
}

.copy-btn:hover {
  background: rgba(124, 58, 237, 0.25);
}

.code-body {
  padding: 24px;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-primary, #F5F5F7);
  white-space: pre;
  overflow-x: auto;
  margin: 0;
}

/* Syntax Highlighting */
.t-keyword { color: #C792EA; }
.t-var { color: #82AAFF; }
.t-fn { color: #82AAFF; }
.t-str { color: #C3E88D; }
.t-attr { color: #FFCB6B; }
.t-comment { color: #546E7A; font-style: italic; }

/* ==================== FAQ ==================== */
.faq {
  padding: 96px 0;
  background: var(--bg-surface, #111118);
  border-top: 1px solid var(--border-subtle, #1E1E2A);
  border-bottom: 1px solid var(--border-subtle, #1E1E2A);
  animation: fadeInUp 0.6s ease both;
}

.faq-list {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.faq-item {
  border-top: 1px solid var(--border-default, #2A2A3A);
  cursor: pointer;
  transition: background 200ms ease;
}

.faq-item:last-child { border-bottom: 1px solid var(--border-default, #2A2A3A); }
.faq-item:hover { background: rgba(124, 58, 237, 0.03); }

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary, #F5F5F7);
  user-select: none;
}

.faq-item.open .faq-question { color: var(--brand-primary, #7C3AED); }

.faq-toggle {
  font-size: 20px;
  color: var(--text-tertiary, #5C5C6E);
  transition: transform 200ms ease;
  flex-shrink: 0;
  margin-left: 16px;
}

.faq-answer {
  padding-bottom: 20px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary, #9898A6);
  animation: fadeIn 200ms ease both;
}

/* ==================== Footer CTA ==================== */
.footer-cta {
  position: relative;
  padding: 96px 24px;
  text-align: center;
  overflow: hidden;
  border-top: 1px solid var(--border-subtle, #1E1E2A);
}

.cta-glow-left, .cta-glow-right {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  pointer-events: none;
}

.cta-glow-left {
  left: -100px;
  bottom: -100px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
}

.cta-glow-right {
  right: -100px;
  top: -100px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
}

.cta-inner { position: relative; z-index: 1; }

.cta-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  color: var(--text-primary, #F5F5F7);
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.cta-sub {
  font-size: 18px;
  color: var(--text-secondary, #9898A6);
  margin-bottom: 40px;
}

.btn-cta {
  padding: 18px 48px;
  font-size: 17px;
}

/* ==================== Footer ==================== */
.footer {
  background: var(--bg-base, #0A0A0F);
  border-top: 1px solid var(--border-default, #2A2A3A);
  padding: 64px 24px 32px;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 64px;
  margin-bottom: 48px;
}

.footer-brand { display: flex; flex-direction: column; gap: 16px; }

.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-tagline {
  font-size: 14px;
  color: var(--text-secondary, #9898A6);
  max-width: 200px;
}

.footer-socials {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.social-link {
  font-size: 20px;
  color: var(--text-secondary, #9898A6);
  transition: color 200ms ease;
}

.social-link:hover { color: var(--brand-primary, #7C3AED); }

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-col-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary, #F5F5F7);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }

.footer-link {
  font-size: 14px;
  color: var(--text-secondary, #9898A6);
  transition: color 200ms ease;
}

.footer-link:hover { color: var(--text-primary, #F5F5F7); }

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 24px;
  border-top: 1px solid var(--border-subtle, #1E1E2A);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-tertiary, #5C5C6E);
  flex-wrap: wrap;
  gap: 12px;
}

.footer-legal {
  display: flex;
  gap: 24px;
}

.footer-legal a {
  color: var(--text-tertiary, #5C5C6E);
  transition: color 200ms ease;
}

.footer-legal a:hover { color: var(--text-secondary, #9898A6); }

/* ==================== Animations ==================== */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== Responsive ==================== */
@media (max-width: 1024px) {
  .hero-inner { gap: 48px; }
  .pricing-grid { gap: 16px; }
  .steps-layout { grid-template-columns: 1fr; }
  .step-arrow { display: none; }
  .footer-inner { grid-template-columns: 1fr; gap: 40px; }
  .footer-links { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: rgba(10, 10, 15, 0.97);
    backdrop-filter: blur(16px);
    flex-direction: column;
    padding: 24px;
    gap: 20px;
    border-bottom: 1px solid var(--border-default, #2A2A3A);
  }

  .nav-links.open { display: flex; }

  .nav-signin { margin-left: 0; }
  .hamburger { display: flex; }

  .hero { padding-top: 120px; padding-bottom: 64px; }
  .hero-glow { width: 300px; height: 300px; right: -80px; }

  .hero-actions { flex-direction: column; align-items: center; }
  .btn-lg { padding: 14px 28px; font-size: 15px; }

  .br-desktop { display: none; }

  .proof-inner { grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .proof-number { font-size: 28px; }

  .features { padding: 64px 0; }
  .features-grid { grid-template-columns: 1fr; }

  .pricing { padding: 64px 0; }
  .pricing-grid { grid-template-columns: 1fr; max-width: 400px; margin-left: auto; margin-right: auto; }

  .quickstart { padding: 64px 0; }
  .steps-layout { grid-template-columns: 1fr; }

  .faq { padding: 64px 0; }

  .footer-cta { padding: 64px 24px; }

  .footer-links { grid-template-columns: repeat(2, 1fr); gap: 24px; }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .footer-links { grid-template-columns: 1fr; }
  .proof-inner { grid-template-columns: repeat(2, 1fr); }
}
</style>
