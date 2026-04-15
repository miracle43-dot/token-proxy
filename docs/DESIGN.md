# TokenProxy 页面与组件设计规范

> 版本：v1.0 | 更新：2026-04-15 | 设计师：小美

---

## 目录

1. [全局布局](#1-全局布局)
2. [登录 / 注册页](#2-登录注册页)
3. [控制台 Dashboard](#3-控制台-dashboard)
4. [API Keys 页面](#4-api-keys-页面)
5. [Playground（API 调试台）](#5-playgroundapi-调试台)
6. [用量明细页面](#6-用量明细页面)
7. [充值页面](#7-充值页面)
8. [价格表页面](#8-价格表页面)
9. [通用组件规范](#9-通用组件规范)
10. [空状态设计](#10-空状态设计)

---

## 1. 全局布局

### 1.1 整体结构

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content Area        │
│  ┌───────────────────┐  │  ┌─────────────────────┐  │
│  │  Logo: TokenProxy │  │  │  Header (56px)       │  │
│  │                   │  │  │  页面标题 + 余额Tag  │  │
│  │  Nav Menu          │  │  └─────────────────────┘  │
│  │  · 控制台          │  │  ┌─────────────────────┐  │
│  │  · API Keys        │  │  │                     │  │
│  │  · 用量明细        │  │  │  Page Content        │  │
│  │  · 价格表          │  │  │  (padding: 32px)     │  │
│  │  · API 调试台      │  │  │                     │  │
│  │  · 充值            │  │  │                     │  │
│  │                   │  │  │                     │  │
│  │  ─────────────── │  │  │                     │  │
│  │  底部：用户信息    │  │  └─────────────────────┘  │
│  └───────────────────┘  │                            │
└─────────────────────────────────────────────────────┘
```

### 1.2 侧边栏（Sidebar）

**背景**：`#111118`（深色） | `#FFFFFF`（浅色）

**Logo 区域**：
- 高度：60px
- 内边距：0 20px
- 文字：TokenProxy，16px，font-weight: 700，品牌紫 `#7C3AED`

**导航菜单**：
- 菜单项高度：40px
- 图标尺寸：20px，右侧留白 12px
- 文字：14px，font-weight: 500
- 选中态：左侧 3px 品牌紫边框，背景 `rgba(124,58,237,0.12)`，文字 `#7C3AED`
- 悬停态：背景 `rgba(255,255,255,0.04)`
- 间距：菜单项之间 2px

### 1.3 Header（顶部栏）

- 高度：56px
- 背景：与主内容区背景一致（`#0A0A0F` / `#FFFFFF`）
- 底部边框：`1px solid var(--border-subtle)`
- 左侧：页面标题，16px，font-weight: 600
- 右侧：余额 Tag + 用户下拉菜单
- 内边距：0 32px

### 1.4 主内容区

- 背景：`#0A0A0F`（深色） | `#F9FAFB`（浅色）
- 内边距：32px
- 最大内容宽度：无限制（撑满）

---

## 2. 登录 / 注册页

### 2.1 布局

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│           背景：渐变 #0A0A0F → #1C1C2E               │
│           + 细微网格纹理（15px，opacity 0.03）        │
│                                                      │
│     ┌────────────────────────────────────┐           │
│     │                                    │           │
│     │  [Logo: TokenProxy]               │           │
│     │  构建可靠 AI 调用基础设施           │           │
│     │                                    │           │
│     │  ┌────────────────────────────┐  │           │
│     │  │ Email 输入框               │  │           │
│     │  └────────────────────────────┘  │           │
│     │  ┌────────────────────────────┐  │           │
│     │  │ Password 输入框            │  │           │
│     │  └────────────────────────────┘  │           │
│     │                                    │           │
│     │  [    登录 Button (主色)    ]      │           │
│     │                                    │           │
│     │  还没有账号？立即注册 →             │           │
│     └────────────────────────────────────┘           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 2.2 视觉规格

**整体卡片**：
- 宽度：420px（最大），响应式居中
- 背景：`#111118`（半透明毛玻璃效果：backdrop-filter: blur(20px)）
- 边框：`1px solid rgba(255,255,255,0.08)`
- 圆角：16px
- 内边距：40px 48px
- 阴影：`--shadow-dark-glow`（品牌紫光晕）

**背景**：
- 主色渐变：从左上 `#7C3AED opacity 0.08` 到右下 `#4F46E5 opacity 0.05`
- 网格：CSS background-image 生成的 32px 网格线，`rgba(255,255,255,0.02)`

**Logo 区域**：
- TokenProxy 文字：24px，font-weight: 700，品牌紫 `#7C3AED`
- 副标题：14px，颜色 `var(--text-secondary)`，"构建可靠 AI 调用基础设施"

**输入框**：
- 高度：48px
- 背景：`#1C1C26`
- 边框：`1px solid var(--border-default)`，聚焦态 `#7C3AED`
- 圆角：8px
- 字号：15px
- 内边距：0 16px
- 聚焦态：边框颜色过渡 200ms，品牌紫边框 + 外发光 `0 0 0 3px rgba(124,58,237,0.2)`

**主按钮（登录/注册）**：
- 高度：48px
- 背景：渐变 `linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)`
- 圆角：8px
- 字号：15px，font-weight: 600，白色文字
- 悬停：scale(1.02)，阴影增强，200ms
- 点击：scale(0.98)，150ms
- 禁用：opacity 0.5，cursor: not-allowed

**链接文字**：
- "还没有账号？立即注册 →"
- 字号：14px，颜色 `#7C3AED`，hover 下划线

### 2.3 注册页附加规格

- 注册按钮文字："注册（赠送 10 元体验金）"
- 额外字段：确认密码（与密码字段完全一致）
- 奖励 Tag：在按钮旁显示 `+¥10` 徽章，品牌紫底

---

## 3. 控制台 Dashboard

### 3.1 整体布局

```
┌────────────────────────────────────────────────────────────┐
│  控制台                                                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [余额卡片]  [累计消费]  [调用次数]  [Tokens总计]            │
│   ¥88.00     ¥12.34      1,234       999,999               │
│   余额        累计消费    总调用       Tokens               │
│                                                            │
│  ┌─────────────────────────┐  ┌──────────────────────────┐│
│  │ 近30天消费趋势（折线图） │  │ 快速开始                  ││
│  │  ECharts 面积图          │  │                          ││
│  │  #7C3AED 渐变填充        │  │  API Key 格式兼容 OpenAI   ││
│  │                          │  │  https://api.tokenproxy  ││
│  │                          │  │                          ││
│  │                          │  │  [创建 API Key] [调试台]   ││
│  └─────────────────────────┘  └──────────────────────────┘│
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 各模型消费排名（表格）                                  │ │
│  │ 模型    │ 调用次数 │ Tokens    │ 消费金额            │ │
│  │─────────│──────────│───────────│───────────────────│  │
│  │ gpt-4o  │ 500      │ 5,000,000 │ ¥8.00              │  │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### 3.2 统计卡片（Stat Cards）

**布局**：4列 grid，间距 16px

**卡片样式**：
- 背景：`var(--bg-surface)`
- 边框：`1px solid var(--border-subtle)`
- 圆角：12px
- 内边距：24px
- 悬停：边框变为 `var(--border-default)`，`translateY(-2px)`，`shadow-2`

**数据展示**：
- 标签：13px，颜色 `var(--text-tertiary)`，居上
- 数值：28px，font-weight: 700，颜色 `var(--text-primary)`
- 变化趋势（可选）：在数值后加 ↑/↓ 12px 文字，颜色用 success/warning

### 3.3 消费趋势图（ECharts）

**容器**：
- 背景：`var(--bg-surface)`
- 边框：`1px solid var(--border-subtle)`
- 圆角：12px
- 内边距：24px
- 标题：16px，font-weight: 600，距底部 16px

**图表配置**：
- 类型：面积折线图
- 线条颜色：`#7C3AED`
- 填充：渐变 `rgba(124,58,237,0.15)` → `rgba(124,58,237,0)`
- X 轴：日期，颜色 `var(--text-tertiary)`
- Y 轴：金额（¥），颜色 `var(--text-tertiary)`
- 网格线：`rgba(255,255,255,0.04)`
- 悬停提示：背景 `var(--bg-elevated)`，圆角 8px

### 3.4 快速开始卡片

**内边距**：24px

**信息提示框**：
- 背景：`rgba(124,58,237,0.08)`
- 边框：`1px solid rgba(124,58,237,0.2)`
- 圆角：8px
- 内边距：12px 16px
- 图标：info，brand 紫
- 代码段：`JetBrains Mono`，12px，背景 `var(--bg-base)`，padding 4px 8px，圆角 4px

**按钮组**：
- "创建 API Key"：主按钮样式
- "打开调试台"：次按钮（ghost 样式，边框按钮）

---

## 4. API Keys 页面

### 4.1 整体布局

```
┌──────────────────────────────────────────────────────────────┐
│  API Keys                                          [+ 新建] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 名称        Key                      状态  │调用次数│消费│ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 我的项目A   tp_sk_•••••••••••••••••d4f3  [启用]  1,234  ¥8 │ │
│  │ 我的项目B   tp_sk_•••••••••••••••••a9c1  [启用]    500  ¥3 │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  [空状态：当 keys 为空时]                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 表格样式

**表头**：
- 背景：`var(--bg-surface)`
- 文字：13px，font-weight: 600，颜色 `var(--text-secondary)`
- 高度：44px
- 内边距：0 16px
- 底部边框：`1px solid var(--border-subtle)`

**表格行**：
- 高度：56px
- 背景：透明
- 悬停：`var(--bg-elevated)`
- 底部边框：`1px solid var(--border-subtle)`

**Key 列**：
- Key 展示：等宽字体，`JetBrains Mono`，13px
- 隐藏态：`••••••••••••••••d4f3`，颜色 `var(--key-masked)`
- 显示态：明文，颜色 `var(--key-visible)`
- 操作按钮组（紧右）：
  - 眼睛图标（显示/隐藏）
  - 复制图标：点击后变绿勾 1s
- 背景框：`var(--key-bg)`，padding 6px 12px，圆角 6px

**状态标签**：
- 启用：翡翠绿 `#10B981`，背景 `rgba(16,185,129,0.12)`，圆角 4px
- 禁用：红 `#EF4444`，背景 `rgba(239,68,68,0.12)`

**删除按钮**：
- 文字按钮，危险色，hover 填充背景
- 前置确认弹窗

### 4.3 新建 Key 对话框

**宽度**：480px

**内边距**：32px

**标题**：18px，font-weight: 600

**表单**：
- 标签：13px，颜色 `var(--text-secondary)`
- 输入框：高度 44px，背景 `var(--bg-base)`，边框 `var(--border-default)`
- 聚焦：边框 `#7C3AED`

**底部按钮**：
- 取消：ghost 按钮
- 创建：主按钮，渐变紫

### 4.4 Key 创建成功对话框

**警告提示**：
- 背景：`rgba(245,158,11,0.12)`，边框 `#F59E0B`
- 图标：感叹号，琥珀色
- 文字：14px，颜色 `var(--color-warning)`

**Key 展示框**：
- 背景：`var(--key-bg)`
- 边框：`1px solid var(--key-border)`
- 圆角：8px
- 字体：`JetBrains Mono`，14px，颜色 `var(--key-visible)`
- 复制按钮：`Append` 区域，hover 变品牌紫

---

## 5. Playground（API 调试台）

### 5.1 整体布局

```
┌──────────────────────────────────────────────────────────────────┐
│  API 调试台                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────┐ ┌───────────────────────────┐ │
│  │ 模型选择  [▼ GPT-4o-mini   ] │ │  请求参数                   │ │
│  │ [✓] 流式输出                  │ │                             │ │
│  │                               │ │  Temperature ─────────●── │ │
│  ├───────────────────────────────┤ │  Max Tokens   [ 2048   ] │ │
│  │                               │ │  Top P        ──────●──── │ │
│  │  消息列表区域（可滚动）        │ │                             │ │
│  │                               │ │  [清空对话]                 │ │
│  │  你：Hello, how are you?      │ ├───────────────────────────┤ │
│  │                               │ │  本次预估                   │ │
│  │  AI：I'm doing great!        │ │  模型：gpt-4o-mini         │ │
│  │                               │ │  Tokens：~2,500             │ │
│  │                               │ │  费用：~¥0.004              │ │
│  │                               │ ├───────────────────────────┤ │
│  ├───────────────────────────────┤ │  代码示例                   │ │
│  │ 输入框                        │ │  baseURL: api.tokenproxy   │ │
│  │ [textarea]                   │ │                             │ │
│  │                  [发送 ▶]    │ │                             │ │
│  └───────────────────────────────┘ └───────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 5.2 左栏（消息区）

**容器**：
- 背景：`var(--bg-surface)`
- 边框：`1px solid var(--border-subtle)`
- 圆角：12px
- 内边距：0

**头部配置栏**：
- 内边距：16px
- 边框底部：`1px solid var(--border-subtle)`
- 模型下拉：宽度 240px，高度 36px，背景 `var(--bg-elevated)`
- Checkbox：品牌紫选中态

**消息列表**：
- 最大高度：calc(100vh - 380px)，滚动
- 内边距：20px 24px

**用户消息（右侧气泡）**：
- 背景：渐变 `linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)`
- 文字：白色，14px，圆角 16px（左下/右下直角）
- 最大宽度：70%
- 距底部：12px

**AI 消息（左侧气泡）**：
- 背景：`var(--bg-elevated)`
- 文字：`var(--text-primary)`，14px
- 边框：`1px solid var(--border-default)`
- 圆角：16px

**时间戳/Token 计数**：
- 文字：11px，颜色 `var(--text-tertiary)`
- 出现在气泡下方

**输入区**：
- 边框-top：`1px solid var(--border-subtle)`
- 内边距：16px 20px
- Textarea：宽度 100%，行高 1.6，resize: none，背景透明
- 发送按钮：48px × 36px，主按钮样式，右对齐

### 5.3 右栏（参数 + 预估）

**请求参数卡片**：
- 内边距：20px
- 表单项间距：16px
- Slider：品牌紫轨道，悬停显示数值
- NumberInput：宽度 100%

**预估卡片**：
- 分隔线：`--border-subtle`
- 表格布局：label 70% + value 30%
- 费用数值：16px，font-weight: 600，品牌紫

**代码示例卡片**：
- 背景：`var(--bg-base)`
- 圆角：8px
- 字体：`JetBrains Mono`，12px
- 关键词高亮：baseURL `#7C3AED`，字符串 `#10B981`

---

## 6. 用量明细页面

### 6.1 筛选栏

- 模型筛选下拉：宽度 200px
- 时间范围选择器（可选）
- 内边距：0 0 16px 0

### 6.2 表格

**列定义**：
| 列 | 宽度策略 | 字号 |
|---|---|---|
| 时间 | 170px | 13px |
| 模型 | 自适应 | 14px |
| 输入 Tokens | 110px | 13px，等宽 |
| 输出 Tokens | 110px | 13px，等宽 |
| 总 Tokens | 100px | 13px，等宽 |
| 费用 | 90px | 14px，font-weight: 600 |
| 延迟 | 90px | 13px |
| 状态码 | 80px | 13px |

**状态码标签**：
- 2xx：`success` 类型，翡翠绿
- 4xx：`warning` 类型，琥珀
- 5xx：`error` 类型，红色

**分页器**：
- 居中，间距 16px
- 圆角按钮样式

---

## 7. 充值页面

### 7.1 布局：左右 50/50

### 7.2 左侧：充值表单

**充值金额选择器**：
- 预设按钮组：¥10、¥50、¥100、¥500、自定义
- 预设按钮：高度 40px，min-width 80px
- 选中态：背景 `#7C3AED`，白色文字
- 悬停：背景 `rgba(124,58,237,0.1)`

**自定义金额**：
- NumberInput，宽度 160px

**支付方式**：
- 卡片列表选择（微信、支付宝）
- 未支持时灰显 + "即将支持" 标签

**确认充值按钮**：
- 主按钮，宽度 100%

### 7.3 右侧：充值记录

- 表格：订单号、时间、金额、状态
- 状态标签同用量页面

---

## 8. 价格表页面

### 8.1 Tab 导航

- 支持按 Provider 筛选：全部 / OpenAI / Anthropic / Google
- Tab 样式：下划线选中态，2px 品牌紫

### 8.2 价格表格

| 列 | 宽度 | 说明 |
|---|---|---|
| 模型名称 | 自适应 | 16px 名称 + 12px ID |
| 提供商 | 100px | Tag 样式 |
| 输入价格 | 120px | ¥/1M Tokens + 换算 /1K |
| 输出价格 | 120px | 同上 |

**模型名称列**：
- 名称：font-weight: 500
- ID：13px，颜色 `var(--text-tertiary)`

**价格列**：
- 主价格：14px
- 换算价格：12px，`var(--text-tertiary)`

---

## 9. 通用组件规范

### 9.1 按钮（Button）

**主按钮（Primary）**：
```css
background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
color: #FFFFFF;
height: 36px;          /* 标准 */
padding: 0 20px;
font-size: 14px;
font-weight: 600;
border-radius: 8px;
border: none;
cursor: pointer;
transition: all 200ms ease-out;
box-shadow: 0 1px 2px rgba(0,0,0,0.2);
```
- Hover：`scale(1.02)`，`box-shadow: 0 4px 12px rgba(124,58,237,0.4)`
- Active：`scale(0.98)`
- Disabled：`opacity: 0.5`，`cursor: not-allowed`

**次按钮（Secondary / Ghost）**：
```css
background: transparent;
color: var(--text-primary);
border: 1px solid var(--border-default);
height: 36px;
padding: 0 20px;
font-size: 14px;
font-weight: 500;
border-radius: 8px;
```
- Hover：背景 `var(--bg-elevated)`，边框 `var(--border-strong)`

**危险按钮（Danger）**：
```css
background: rgba(239, 68, 68, 0.12);
color: #EF4444;
border: 1px solid rgba(239, 68, 68, 0.3);
```
- Hover：背景 `#EF4444`，白色文字

**尺寸变体**：
- `size="small"`：height 28px，padding 0 12px，font-size 12px
- `size="large"`：height 44px，padding 0 24px，font-size 15px

### 9.2 卡片容器（Card）

**标准卡片**：
```css
background: var(--bg-surface);
border: 1px solid var(--border-subtle);
border-radius: 12px;
padding: 24px;
```
- Hover：border-color → `var(--border-default)`，`translateY(-2px)`

**卡片 Header**：
- 高度：24px（内容）+ 上下 padding
- 内边距：0 0 16px 0
- 标题：16px，font-weight: 600，`var(--text-primary)`
- 右侧操作区：flex，gap 8px

### 9.3 表格（Table）

```css
/* 表头 */
.el-table__header th {
  background: var(--bg-surface) !important;
  color: var(--text-secondary) !important;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-subtle) !important;
  padding: 12px 16px;
}

/* 行 */
.el-table__row {
  transition: background 100ms;
}
.el-table__row:hover td {
  background: var(--bg-elevated) !important;
}

/* 单元格 */
.el-table__body td {
  border-bottom: 1px solid var(--border-subtle) !important;
  padding: 16px 16px;
  font-size: 14px;
}
```

### 9.4 表单输入（Input）

```css
.el-input__wrapper {
  background: var(--bg-base) !important;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  box-shadow: none !important;
  padding: 0 16px;
  height: 40px;
  transition: border-color 200ms, box-shadow 200ms;
}

.el-input__wrapper:hover {
  border-color: var(--border-strong);
}

.el-input__wrapper.is-focus {
  border-color: #7C3AED !important;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15) !important;
}

.el-input__inner {
  color: var(--text-primary);
  font-size: 14px;
}

.el-input__inner::placeholder {
  color: var(--text-tertiary);
}
```

### 9.5 徽章 / 标签（Badge / Tag）

**成功**：
```css
background: rgba(16, 185, 129, 0.12);
color: #10B981;
border: 1px solid rgba(16, 185, 129, 0.3);
border-radius: 4px;
padding: 2px 8px;
font-size: 12px;
font-weight: 500;
```

**警告**：
```css
background: rgba(245, 158, 11, 0.12);
color: #F59E0B;
border: 1px solid rgba(245, 158, 11, 0.3);
border-radius: 4px;
```

**错误**：
```css
background: rgba(239, 68, 68, 0.12);
color: #EF4444;
border: 1px solid rgba(239, 68, 68, 0.3);
border-radius: 4px;
```

**信息**：
```css
background: rgba(59, 130, 246, 0.12);
color: #3B82F6;
border: 1px solid rgba(59, 130, 246, 0.3);
border-radius: 4px;
```

### 9.6 下拉菜单（Select）

```css
.el-select__wrapper {
  background: var(--bg-base) !important;
  border: 1px solid var(--border-default);
  border-radius: 8px;
  box-shadow: none !important;
  min-height: 40px;
}

.el-select__wrapper:hover {
  border-color: var(--border-strong);
}

.el-select__wrapper.is-focus {
  border-color: #7C3AED !important;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15) !important;
}
```

---

## 10. 空状态设计

### 10.1 通用空状态

```
┌──────────────────────────────────────────────────┐
│                                                  │
│           [图标：40px, opacity 0.3]              │
│           例如：Key 图标、图表空白、文档图标        │
│                                                  │
│           主标题（14px，font-weight: 600）        │
│           描述文字（13px，var(--text-tertiary)）  │
│                                                  │
│           [操作按钮，可选]                         │
│                                                  │
└──────────────────────────────────────────────────┘
```

### 10.2 各页面空状态文案

| 页面 | 图标 | 主标题 | 描述 | 操作按钮 |
|------|------|--------|------|----------|
| Keys | Key | 还没有 API Key | 创建你的第一个 Key，开始调用 AI 模型 | "创建 API Key" 主按钮 |
| Dashboard 表格 | BarChart | 暂无调用数据 | 开始使用 API 即可在此查看消费统计 | "去调试台" 次按钮 |
| 用量明细 | DataLine | 暂无用量记录 | 完成首次 API 调用后即可查看明细 | "去调试" 次按钮 |
| 充值记录 | Coin | 暂无充值记录 | 充值后可在此处查看充值历史 | "去充值" 次按钮 |
| Playground | Message | 开始对话 | 输入消息与 AI 对话，费用从余额中扣除 | — |

---

## 附录：CSS 变量速查表

```css
/* Dark Mode (默认) */
:root,
[data-theme="dark"] {
  --bg-base:       #0A0A0F;
  --bg-surface:    #111118;
  --bg-elevated:   #1C1C26;
  --bg-overlay:    #252530;

  --border-subtle: #1E1E2A;
  --border-default:#2A2A3A;
  --border-strong: #3D3D52;

  --text-primary:   #F5F5F7;
  --text-secondary: #9898A6;
  --text-tertiary:  #5C5C6E;

  --color-brand:    #7C3AED;
  --color-brand-light: #8B5CF6;
  --color-brand-dark:  #6D28D9;

  --color-success:  #10B981;
  --color-warning:  #F59E0B;
  --color-error:    #EF4444;
  --color-info:     #3B82F6;

  --key-visible: #A5B4FC;
  --key-masked:  #6B6B8D;
  --key-bg:      #1C1C2E;
}

/* Light Mode */
[data-theme="light"] {
  --bg-base:       #FFFFFF;
  --bg-surface:    #F9FAFB;
  --bg-elevated:   #FFFFFF;
  --bg-overlay:    #FFFFFF;

  --border-subtle: #F3F4F6;
  --border-default:#E5E7EB;
  --border-strong: #D1D5DB;

  --text-primary:   #111827;
  --text-secondary: #6B7280;
  --text-tertiary:  #9CA3AF;

  --color-brand:    #7C3AED;
  --color-brand-light: #8B5CF6;
  --color-brand-dark:  #6D28D9;

  --color-success:  #059669;
  --color-warning:  #D97706;
  --color-error:    #DC2626;
  --color-info:     #2563EB;
}
```
