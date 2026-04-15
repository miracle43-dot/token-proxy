# TokenProxy 落地页设计规范 v2

> **设计方向：方向B — 终端风（Terminal Dark）**
>
> 选型理由：TokenProxy 是开发者工具，用户是工程师、技术创业者。终端风直接呼应产品本质——用代码工作的群体对 terminal、命令行、代码编辑器有天然的亲近感。这不是装饰，是身份认同。风格语言：黑底 + 品牌紫 + monospace，营造"你的工具链多了一个趁手兵器"的气场。

---

## 1. 视觉规范

### 1.1 色彩系统

| Token | 色值 | 用途 |
|---|---|---|
| `--bg-base` | `#0D0D0F` | 页面主背景 |
| `--bg-surface` | `#141416` | 卡片/区块背景 |
| `--bg-elevated` | `#1C1C1F` | 悬浮/高亮区块 |
| `--border` | `#2A2A2F` | 边框/分割线 |
| `--border-bright` | `#3D3D44` | 强调边框 |
| `--purple-primary` | `#7C3AED` | 品牌主色（按钮、强调） |
| `--purple-light` | `#A78BFA` | 次级紫色（图标、标签） |
| `--purple-dim` | `#4C1D95` | 暗紫（背景渐变） |
| `--text-primary` | `#F4F4F5` | 主文字 |
| `--text-secondary` | `#A1A1AA` | 次文字/说明 |
| `--text-muted` | `#52525B` | 占位/禁用文字 |
| `--green-accent` | `#22C55E` | 成功/在线状态 |
| `--red-accent` | `#EF4444` | 错误/告警 |

### 1.2 字体系统

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

- **Hero 标题**：Inter，Bold，72px（桌面）/ 40px（移动），字重 700
- **正文**：Inter，Regular，16px，行高 1.6
- **代码/终端元素**：JetBrains Mono，14px
- **标签/小字**：Inter，Medium，12px，全大写字母间距 0.08em

### 1.3 间距与网格

- **基础单位**：8px
- **容器最大宽度**：1200px
- **区块间距**：120px（桌面）/ 80px（移动）
- **卡片内边距**：32px
- **栅格**：12 列，24px 槽

### 1.4 圆角与阴影

- **按钮/小卡片**：`border-radius: 8px`
- **大卡片/面板**：`border-radius: 12px`
- **悬浮阴影**：`box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15)`

### 1.5 动效哲学

> 克制、有目的。动效是反馈，不是装饰。

- **入场动画**：元素从 `opacity: 0, translateY: 16px` 渐入，交错间隔 80ms
- **Hover 态**：边框亮度提升 + 阴影扩散，200ms ease-out
- **按钮 Click**：scale 0.98，80ms
- **Terminal 光标**：blink 动画 1s step-end infinite
- **整体风格**：避免弹跳/弹性过度，以线性为主

---

## 2. 页面结构与区块

### 2.1 全局导航栏（Nav）

```
[Logo: TokenProxy ●_ ]         [功能] [定价] [文档]         [登录] [开始使用]
```

- 高度：64px，深色背景 `#0D0D0F`，底部 1px border `--border`
- 滚动后：`background: rgba(13,13,15,0.85)` + backdrop-filter blur
- Logo 左侧带一个紫色圆点作为终端光标视觉元素
- CTA 按钮：`background: --purple-primary`，圆角 8px

### 2.2 Hero 区块

**视觉核心**：全屏高度的 Hero，背景纯黑，中心左对齐排布，右侧或下方嵌入一个模拟终端窗口。

#### 左区（60%宽度）
- **Pre-title**：一行小标签 `// AI API Proxy — No VPN Required`
- **主标题**：两行大字，最大字号，Inter Bold
  ```
  Build Faster.
  Ship Without Limits.
  ```
- **副标题**：一行说明文字，`--text-secondary`，16-18px
  `One API key. Access OpenAI, Claude & Gemini — from China, without compromise.`
- **CTA 按钮组**：
  - 主按钮：`开始使用 →`（填充紫，hover 亮紫）
  - 次按钮：`查看文档`（ghost 样式，紫边框+透明底）

#### 右区（40%宽度）— 终端模拟窗口

```
┌──────────────────────────────────┐
│ ● ● ●  TokenProxy Console        │
├──────────────────────────────────┤
│ $ pip install tokenproxy-sdk     │
│ ─────────────────────────────────│
│ > connecting...                  │
│ > auth ✓                        │
│ > ready @ api.tokenproxy.dev    │
│                                    │
│ $ curl -X POST https://api...    │
│   -H "Authorization: Bearer $KEY"│
│   -H "Content-Type: application" │
│                                    │
│ { "model": "gpt-4o",             │
│   "usage": { "tokens": 128 } }   │
└──────────────────────────────────┘
```

- 窗口外壳：深灰 `#141416`，标题栏带三个彩色圆点（红/黄/绿）
- 内容区：JetBrains Mono 14px，`--text-secondary`
- 代码关键字（`curl`、`POST`、路径）：`--purple-light`
- 字符串：`--green-accent`
- 最底部有一行闪烁的 `_` 光标

---

### 2.3 核心卖点（Feature Cards）

**标题**：`Why Developers Choose TokenProxy`

三列/四列网格，每列一个卡片：

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   ⚡ No VPN      │ │   🔒 Stable      │ │   💰 Clear       │ │   🚀 Instant     │
│                  │ │                  │ │   Pricing        │ │   Access         │
│  直连无需配置     │ │  99.9% 可用率    │ │  按量计费无隐藏   │ │  注册即用 3秒    │
│  无需任何额外     │ │  多区域智能路由   │ │  费用清晰无套路   │ │  接入门槛低     │
│  网络配置         │ │  自动容灾         │ │  明码标价         │ │  支持主流SDK    │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └──────────────────┘
```

**设计细节**：
- 卡片背景：`--bg-surface`，border `1px --border`，hover 时 border 变 `---border-bright`
- 图标：纯文字 emoji 或 SVG，32px
- 标题：Inter Bold 18px，`--text-primary`
- 描述：Inter Regular 14px，`--text-secondary`

---

### 2.4 Playground / 产品截图展示

**标题**：`Live Playground — Try It Now`

嵌入一个模拟 Dashboard UI 的静态截图，展示：
- 左侧边栏（API Keys 列表，选中态高亮紫）
- 主内容区（模型选择下拉 + 请求日志 + 响应展示）
- 底部一行 Usage 统计（tokens 消耗、剩余额度）

整体放在一个深色 Mac 窗口外壳内，带阴影效果：
```
┌────────────────────────────────────────────────────────┐
│ ● ● ●  api.tokenproxy.dev — Playground                │
├────────────┬───────────────────────────────────────────┤
│ API Keys   │  Model: [GPT-4o        ▾]                │
│ ─────────  │  ─────────────────────────────────        │
│ ● key_sk_…│  Request:                              │
│ ○ key_sk_…│  POST /v1/chat/completions              │
│ ○ key_sk_…│  Body: { "model": "gpt-4o", ... }      │
│            │                                           │
│ Usage      │  Response: 200 OK  ✓                    │
│ ─────────  │  ↳ tokens: 1,247 | latency: 213ms       │
│ Today: 12k │  ↳ cache hit: true                      │
│ Balance: $│                                           │
└────────────┴───────────────────────────────────────────┘
```

---

### 2.5 价格展示

**标题**：`Simple, Transparent Pricing`

三列定价卡片：

| Free | Pro | Enterprise |
|---|---|---|
| **$0** / forever | **$29** / month | Custom |
| 100k tokens/mo | 10M tokens/mo | Unlimited |
| 基础模型 | 全模型 + 优先队列 | SLA + 专属支持 |
| 1 个 API Key | 5 个 API Keys | 无限制 |
| Community support | Email support | 专属 Slack |
| [开始使用] | [立即升级] | [联系我们] |

**设计细节**：
- Pro 卡片：`border: 2px solid --purple-primary`，背景微紫渐变
- Free/Enterprise 卡片：`--bg-surface`
- CTA 按钮与 Hero 风格一致

---

### 2.6 快速开始（3步）

**标题**：`Up and Running in 60 Seconds`

步骤编号用品牌紫大号数字，横向三步：

```
[01]                [02]                [03]
注册账号             获取 Key             开始调用
免费创建账号，       仪表盘一键生成        一个请求就能验证
无需信用卡           立即生效            效果，用完即充
```

每步下方嵌入一行代码示例：
```bash
# Step 1: Sign up
→ 打开 tokenproxy.dev，注册账号

# Step 2: Get your key
$ curl https://api.tokenproxy.dev/keys \
  -H "Authorization: Bearer $YOUR_TOKEN"

# Step 3: Make your first call
$ curl -X POST https://api.tokenproxy.dev/v1/chat/completions \
  -H "Authorization: Bearer sk_live_xxxx" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"Hi"}]}'
```

---

### 2.7 FAQ

**标题**：`Common Questions`

Accordion 展开式 FAQ，2-3 条：

**Q: TokenProxy 和直接调用官方 API 有什么区别？**
A: 核心区别是**无需翻墙**。TokenProxy 在中国大陆部署了直连节点，你不需要任何代理工具即可稳定访问 OpenAI/Claude/Gemini。同时我们提供智能路由、自动重试、用量统计，一个平台搞定所有。

**Q: 费用如何计算？是否有隐藏费用？**
A: 无隐藏费用。按实际 token 消耗计费，费用与你直接调官方 API 一致（部分模型甚至更低）。Pro 套餐明码标价，无订阅陷阱，随时可取消。

**Q: 支持哪些模型？**
A: 目前支持 OpenAI 全模型（GPT-4o、GPT-4o-mini 等）、Claude 3.5 全系列、Gemini Pro/Flash，后续持续接入新模型。仪表盘实时展示最新可用模型列表。

**展开/收起动画**：高度 0 → auto，200ms ease-out，紫色列标题

---

### 2.8 Footer CTA + Footer

**Footer CTA**（在 FAQ 下方，Page Bottom）：
```
[紫色渐变矩形区块]

Get Started Free →
注册即送 $5 体验金，无需信用卡
```

**Footer**：
```
[Logo + 一句话描述]    [Product]      [Developers]    [Company]
                        功能介绍        API 文档         关于我们
                        定价           SDK 下载         联系方式
                        更新日志       状态页           隐私政策

© 2026 TokenProxy. Built for developers.
```

---

## 3. 响应式断点

| 断点 | 布局 |
|---|---|
| ≥1200px | 全量 12 列，Hero 左右分栏 |
| 768–1199px | Hero 左右分栏保持，Feature Cards 2列 |
| <768px | Hero 单列纵向，Feature Cards 单列，Terminal窗口隐藏或缩小 |

---

## 4. 技术实现建议

- **框架**：Next.js / Tailwind CSS（推荐，便于 dark mode 和组件化）
- **动画**：Framer Motion（入场动画、Accordion）
- **Terminal 窗口**：用 CSS Grid 模拟，支持响应式缩放
- **代码高亮**：Prism.js 或 Shiki，主题定制为深色 + 紫色高亮
- **图标**：Lucide React（线性风格，stroke weight 统一）
- **字体**：Google Fonts Inter + JetBrains Mono（预加载）

---

## 5. 禁止事项

- ❌ 任何 evolai.cn 的设计元素（渐变背景、圆胖字体、软色配色）
- ❌ 彩色渐变背景（紫→蓝等）
- ❌ 超过 2 种主色调
- ❌ 过于圆润（border-radius > 16px）的元素
- ❌ 水群式的 emoji 滥用（设计要克制）

---

*设计版本：v2 | 设计方向：终端风（Terminal Dark）| 更新日期：2026-04-15*
