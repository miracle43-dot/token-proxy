# TokenProxy 落地页设计规范 v3

> **设计方向：超干净白底 + 字体巨大醒目 + 数据信任背书**
>
> 选型理由：v2 是深色终端风，v3 需要充分差异化。经过对 Linear、Stripe、Supabase、Render、Outline 的研究，我们发现最成功的开发者工具落地页有一个共同点：**呼吸感极强，白底大字，让产品截图自己说话**。这次我们做减法——Less is More。
>
> 核心风格参考：Linear 的留白 + Stripe 的数据感 + Render 的极简三步曲

---

## 1. 视觉规范

### 1.1 色彩系统

| Token | 色值 | 用途 |
|---|---|---|
| `--bg-base` | `#FFFFFF` | 页面主背景 |
| `--bg-subtle` | `#F8FAFC` | 区块背景（Social Proof / FAQ） |
| `--bg-dark-shell` | `#18181B` | 终端/Mac 窗口外壳（深色嵌块） |
| `--bg-dark-inner` | `#09090B` | 终端内部背景 |
| `--border` | `#E4E4E7` | 边框/分割线 |
| `--border-strong` | `#D4D4D8` | 强调边框 |
| `--purple-primary` | `#7C3AED` | 品牌主色（按钮、强调） |
| `--purple-light` | `#A78BFA` | 次级紫色（代码关键字） |
| `--text-primary` | `#0F172A` | 主文字（非纯黑） |
| `--text-secondary` | `#64748B` | 次文字/说明 |
| `--text-muted` | `#94A3B8` | 占位/禁用文字 |
| `--green-accent` | `#10B981` | 成功/在线状态 |
| `--red-accent` | `#EF4444` | 错误/告警 |

### 1.2 字体系统

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

| 用途 | 字体 | 字号 | 字重 | 行高 |
|---|---|---|---|---|
| Hero 主标题 | Inter | 64px（桌面）/ 40px（移动） | 700 | 1.1 |
| Hero 副标题 | Inter | 20px | 400 | 1.4 |
| Section 标题 | Inter | 48px（桌面）/ 32px（移动） | 700 | 1.2 |
| Section 副标题 | Inter | 18px | 400 | 1.5 |
| 卡片标题 | Inter | 18px | 600 | 1.3 |
| 正文 | Inter | 16px | 400 | 1.6 |
| 小标签 | Inter | 12px | 500 | 1.4 |
| 代码 | JetBrains Mono | 14px | 400 | 1.5 |

### 1.3 间距与网格

- **基础单位**：8px
- **容器最大宽度**：1280px（留白更多，呼吸感更强）
- **区块垂直间距**：120px（桌面）/ 80px（移动）
- **容器水平 padding**：64px（桌面）/ 24px（移动）
- **卡片内边距**：32px
- **栅格**：12 列，32px 槽

### 1.4 圆角与阴影

- **按钮**：`border-radius: 8px`
- **小卡片**：`border-radius: 12px`
- **大卡片**：`border-radius: 16px`
- **终端/Mac 外壳**：`border-radius: 12px`（顶部），`border-radius: 0`（底部）
- **阴影**：
  - 卡片悬浮：`box-shadow: 0 4px 24px rgba(0,0,0,0.08)`
  - 终端外壳：`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)`

### 1.5 动效哲学

> 极度克制。无动画胜于多动画。

- **Hover 态**：边框变紫 `border-color: --purple-primary`，200ms ease-out
- **按钮 Click**：`scale(0.98)`，80ms
- **滚动行为**：`scroll-behavior: smooth`（仅 html）
- **禁止**：弹跳动画、入场渐变、漂浮效果

---

## 2. 页面结构与区块

### 2.1 全局导航栏（Nav）

```
TokenProxy                         功能   定价   文档                    登录  立即开始 →
```

- 高度：72px
- 背景：`--bg-base`，底部 1px border `--border`
- Logo：文字 `TokenProxy`，Inter Bold 20px，颜色 `--text-primary`，右侧带一个小紫色圆点 ●
- 链接：Inter Regular 14px，颜色 `--text-secondary`，hover 时变 `--text-primary`
- CTA 按钮：背景 `--purple-primary`，白色文字，圆角 8px，padding 10px 20px
- **禁止**：渐变背景、透明毛玻璃、Logo 动画

### 2.2 Hero Section（最重要）

**核心思路**：左文字右截图，字体超大，呼吸感极强。

#### 左区（55%宽度）

```
// 无需翻墙，接入全球 AI 模型
```

- Pre-title：Inter Medium 14px，颜色 `--text-muted`，前面带 `//` 表示注释风格

```
3 步接入
GPT-4 / Claude / Gemini
```

- 主标题：Inter Bold 72px，颜色 `--text-primary`，分两行，第二行是模型名
- 行高极紧：1.1

```
一个 API Key，访问所有主流大模型。
稳定、简单、无隐藏费用。
```

- 副标题：Inter Regular 18px，颜色 `--text-secondary`，两行
- 下方留白 48px

```
[ 立即开始 → ]    [ 查看文档 ]
```

- 主按钮：背景 `--purple-primary`，白色，padding 16px 32px，圆角 8px，Inter Semibold 16px
- 次按钮：无填充，紫边框 `--purple-primary`，文字 `--purple-primary`，padding 16px 32px

#### 右区（45%宽度）— 产品截图

```
┌──────────────────────────────────────┐
│  ● ● ●  api.tokenproxy.dev          │  ← Mac 窗口外壳，顶部圆角 12px
├──────────────────────────────────────┤
│                                      │
│  TokenProxy Console                  │  ← 标题，白色
│  ─────────────────────────────────   │
│                                      │
│  > connected ✓                       │
│  > model: gpt-4o                     │
│                                      │
│  {                                   │
│    "model": "gpt-4o",               │
│    "usage": {                       │
│      "prompt_tokens": 128,          │
│      "completion_tokens": 256       │
│    },                               │
│    "cost": "$0.0042"                │  ← 绿色突出费用
│  }                                   │
│                                      │
│  ─────────────────────────────────   │
│  Balance: $12.34  |  Today: 1,247k   │  ← 底部状态条
└──────────────────────────────────────┘
```

- 窗口外壳：背景 `--bg-dark-shell`，圆角 12px（顶部），底部直角
- 外壳阴影：`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)`
- 标题栏高度：40px，背景略深 `#27272A`
- 三个圆点：红 `#EF4444`、黄 `#F59E0B`、绿 `#22C55E`，直径 12px
- 内容区：背景 `--bg-dark-inner`，padding 24px
- 代码字体：JetBrains Mono 14px
- 颜色：代码关键字 `--purple-light`，字符串 `--green-accent`，数字 `--text-primary`

### 2.3 Social Proof Bar

**核心思路**：Stripe 那种大数字数据感，横排 4 个。

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│   12,000+   │   1.2 亿   │   180 天    │    15+      │
│  已服务开发者 │  API 调用   │  稳定运行    │  支持模型    │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

- 背景：`-bg-subtle`（`#F8FAFC`）
- 上下 padding：48px
- 容器内水平排列，**平均分布**
- 每个数据块：
  - 数字：Inter Bold 48px，颜色 `--text-primary`
  - 说明：Inter Regular 14px，颜色 `--text-muted`
  - 上下排列，间距 8px
- **禁止**：渐变背景、图标、emoji

### 2.4 核心卖点

**标题**：空一行，直接上标题

```
为什么选择 TokenProxy
```

- Inter Bold 48px，颜色 `--text-primary`
- 下方留白 48px

**三列卡片**（横排）：

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│                  │  │                  │  │                  │
│    ⚡ 无需 VPN   │  │    🔒 稳定直连   │  │    💰 透明定价   │
│                  │  │                  │  │                  │
│    国内直连       │  │    99.9% 可用率  │  │    按量计费      │
│    无需任何       │  │    多区域         │  │    无月费无门槛   │
│    网络配置       │  │    智能路由       │  │    明码标价       │
│                  │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

- 卡片背景：`--bg-base`，border `1px --border`，圆角 12px
- Hover：border 变 `--purple-primary`
- 图标：SVG，32px，颜色 `--purple-primary`
- 标题：Inter Semibold 18px，颜色 `--text-primary`
- 描述：Inter Regular 14px，颜色 `--text-secondary`，3 行
- 上下 padding：40px，左右 32px
- 卡片间距：32px
- **禁止**：背景渐变、阴影、emoji（用 SVG 图标）

### 2.5 产品展示（Playground）

**标题**：

```
Playground
在线调试，所见即所得
```

- Inter Bold 48px，颜色 `--text-primary`
- 副标题：Inter Regular 18px，颜色 `--text-secondary`

```
┌──────────────────────────────────────────────────────────────┐
│  ● ● ●  api.tokenproxy.dev — Playground                   │
├───────────────┬────────────────────────────────────────────┤
│ API Keys      │  Model: [GPT-4o                     ▾]     │
│ ───────────── │  ────────────────────────────────────────── │
│ ● key_sk_liv…│  Request                                 │
│ ○ key_sk_…   │  POST /v1/chat/completions               │
│ ○ key_sk_…   │  Body:                                   │
│               │  {                                       │
│ Usage         │    "model": "gpt-4o",                   │
│ ───────────── │    "messages": [...]                    │
│ Today: 12,847 │  }                                       │
│ Balance: $12  │                                           │
│               │  Response: 200 OK ✓                      │
│               │  ↳ tokens: 1,247 | latency: 213ms        │
│               │  ↳ cost: $0.0042                         │
└───────────────┴────────────────────────────────────────────┘
```

- 整体：Mac 窗口外壳，深色嵌在白底页面里
- 外壳：背景 `--bg-dark-shell`，圆角 12px（顶部），底部直角
- 外壳阴影：`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)`
- 左侧边栏宽度：200px
- 上下 padding：48px，左右居中

### 2.6 价格透明

**标题**：

```
价格透明，按量计费
```

- Inter Bold 48px，颜色 `--text-primary`

```
┌─────────────────────────────────────────────────────────────────────────┐
│  模型              │ 输入成本          │ 输出成本          │ 单位       │
├─────────────────────────────────────────────────────────────────────────┤
│  GPT-4o            │ $2.50 / M tokens  │ $10.00 / M tokens │ 官方 8 折  │
│  GPT-4o-mini       │ $0.15 / M tokens  │ $0.60 / M tokens  │ 官方 8 折  │
│  Claude 3.5 Sonnet │ $3.00 / M tokens  │ $15.00 / M tokens │ 官方 9 折  │
│  Claude 3.5 Haiku  │ $0.80 / M tokens  │ $4.00 / M tokens  │ 官方 9 折  │
│  Gemini 1.5 Pro    │ $1.25 / M tokens  │ $5.00 / M tokens  │ 官方 9 折  │
└─────────────────────────────────────────────────────────────────────────┘
```

- 表格：边框 `1px --border`
- 表头：背景 `--bg-subtle`，Inter Semibold 14px，颜色 `--text-primary`
- 表格内容：Inter Regular 14px，颜色 `--text-secondary`
- 第一列：Inter Medium 14px，颜色 `--text-primary`
- 最后一列折扣标签：背景 `#F0FDF4`，文字 `#16A34A`，padding 4px 8px，圆角 4px
- 表格内 padding：16px 24px
- **禁止**：3 列套餐卡片（我们按量付费，不做订阅套餐）

### 2.7 快速开始

**标题**：

```
3 步开始
```

- Inter Bold 48px，颜色 `--text-primary`
- 副标题：Inter Regular 18px，颜色 `--text-secondary`，"注册 → 创建 Key → 开始调用"

**三列布局**：

```
[ 01 ]                           [ 02 ]                           [ 03 ]
注册账号                          创建 Key                         开始调用
免费创建账号，                    一键生成，                      一个请求
无需信用卡                       立即生效                        验证效果
```

- 步骤编号：Inter Bold 32px，颜色 `--purple-primary`
- 步骤标题：Inter Semibold 20px，颜色 `--text-primary`
- 步骤描述：Inter Regular 14px，颜色 `--text-secondary`

**代码示例**（下方横排 3 个代码块）：

```
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  $ curl -X POST \    │  │  $ curl -X POST \    │  │  import openai       │
│    https://api...   │  │    https://api...    │  │  openai.api_key =    │
│    -H "Auth..."     │  │    -H "Auth..."     │  │    'sk_live_xxx'     │
│                      │  │  { "name": "MyKey" } │  │  openai.Chat...      │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

- 代码块：背景 `--bg-dark-shell`，圆角 8px，padding 20px
- 代码字体：JetBrains Mono 13px，颜色 `--text-secondary`
- 关键字：`--purple-light`
- 区块间距：48px

### 2.8 FAQ

**标题**：

```
常见问题
```

- Inter Bold 48px，颜色 `--text-primary`

**Accordion（折叠面板）**：

```
┌─────────────────────────────────────────────────────────────────┐
│  TokenProxy 和直接调用官方 API 有什么区别？                        │
│  核心区别是**无需翻墙**。TokenProxy 在中国大陆部署了直连节点，    │
│  无需任何代理工具即可稳定访问 OpenAI/Claude/Gemini。              │
├─────────────────────────────────────────────────────────────────┤
│  费用如何计算？是否有隐藏费用？                            [▾]   │
├─────────────────────────────────────────────────────────────────┤
│  支持哪些模型？                                          [▾]   │
└─────────────────────────────────────────────────────────────────┘
```

- 每个问题：上边框 `1px --border`，padding 20px 0
- 问题文字：Inter Medium 16px，颜色 `--text-primary`
- 展开图标：右侧，`--text-muted`
- 展开内容：Inter Regular 14px，颜色 `--text-secondary`，padding 16px 0
- 展开动画：高度过渡，200ms ease-out
- **禁止**：背景色、图标装饰

### 2.9 Footer CTA

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  立即开始                                                        │
│  无需信用卡，注册即送 $5 体验金                                   │
│                                                                 │
│  [ 立即开始 → ]                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

- 背景：`-bg-subtle`（`#F8FAFC`）
- 上下 padding：120px
- 标题：Inter Bold 48px，颜色 `--text-primary`
- 副标题：Inter Regular 18px，颜色 `--text-secondary`
- 按钮：背景 `--purple-primary`，白色，padding 18px 40px，圆角 8px

### 2.10 Footer

```
TokenProxy                                    产品         开发者        公司
● 直连全球 AI 模型                            功能介绍      API 文档      关于我们
                                              定价         SDK 下载      联系方式
                                              更新日志      状态页        隐私政策

© 2026 TokenProxy. Built for developers.
```

- 上边框：`1px --border`
- 上下 padding：48px
- Logo 区域：文字 `TokenProxy`，Inter Bold 18px，`+` 小紫点
- 链接分组：Inter Regular 14px，颜色 `--text-secondary`
- 分组标题：Inter Medium 14px，颜色 `--text-primary`
- 底部一行：Inter Regular 12px，颜色 `--text-muted`

---

## 3. 响应式断点

| 断点 | 布局变化 |
|---|---|
| ≥1024px | 全量：Hero 左右分栏，Social Proof 4 列横排，Feature Cards 3 列，表格全列 |
| 768–1023px | Hero 单列纵向（文字在上，截图在下），Social Proof 2x2，Feature Cards 2 列，表格水平滚动 |
| <768px | Hero 单列，Social Proof 2x2，Feature Cards 单列，表格只显示模型名和价格 2 列，代码块单列 |

---

## 4. 组件清单

| 组件 | 状态 |
|---|---|
| Nav | Default，Scroll（背景加 backdrop-blur） |
| Button Primary | Default，Hover（背景加亮），Active（scale 0.98），Disabled（opacity 0.5） |
| Button Ghost | Default，Hover（边框变紫），Active，Disabled |
| Feature Card | Default，Hover（边框变紫） |
| Code Block | Static（无交互状态） |
| Accordion Item | Collapsed，Expanded |
| Table | Static（无排序交互） |
| Mac Window Shell | Static |

---

## 5. 技术实现建议

- **框架**：Next.js / Tailwind CSS
- **字体**：Google Fonts Inter（预连接）+ JetBrains Mono（预连接）
- **图标**：Lucide React（stroke width 1.5，与 Linear 一致）
- **代码高亮**：Shiki，主题：自定义浅色 + 紫色关键字
- **图片**：产品截图使用深色 Terminal Mockup，直接嵌入 PNG/SVG
- **CSS**：Tailwind CSS + CSS Variables（与品牌规范一致）

---

## 6. 禁止事项

- ❌ 任何深色渐变背景
- ❌ 超过 2 种主色调
- ❌ 大段英文说明文字（要精炼中文）
- ❌ 花哨动画（弹跳、旋转、漂浮）
- ❌ emoji（统一用 SVG 图标）
- ❌ 弹窗/Modal
- ❌ 侧边栏固定

---

## 7. 与 v2 的核心差异

| 维度 | v2 | v3 |
|---|---|---|
| 背景 | 深色 `#0D0D0F` | 白底 `#FFFFFF` |
| 风格 | 终端风、黑客感 | 呼吸感、大字留白 |
| Hero | 文字为主 | 截图怼正中央 |
| 价格 | 3 列套餐卡片 | 透明价格表格 |
| 卖点 | 4 列卡片 | 3 列卡片 |
| 动效 | 入场渐变、交错动画 | 无动画，极度克制 |
| 装饰 | 终端窗口内的光标闪烁 | 零装饰 |

---

*设计版本：v3 | 设计方向：超干净白底 + 字体巨大 + 数据信任背书 | 更新日期：2026-04-15 | 设计师：小美*
