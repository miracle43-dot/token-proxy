# TokenProxy 品牌设计规范

> 版本：v1.0 | 更新：2026-04-15 | 设计师：小美

---

## 1. 设计哲学

TokenProxy 的设计语言融合 **Linear 的极简克制** 与 **Vercel 的技术感**。

- **开发者优先**：界面即工具，每一个像素都为提高开发效率服务
- **深色为默认**：开发者工具天然倾向深色，减少眼部疲劳
- **数据驱动**：核心数据（余额、调用量、费用）永远是第一可见层
- **克制装饰**：用空白说话，用对齐建立秩序，用颜色传递状态

---

## 2. 色彩系统

### 2.1 品牌主色（Brand Primary）

| 名称 | 色值 | 用途 |
|------|------|------|
| 品牌紫（Core） | `#7C3AED` | 主要按钮、Logo、品牌元素高亮 |
| 品牌紫亮（Core Light） | `#8B5CF6` | 悬停态、选中态、次要强调 |
| 品牌紫暗（Core Dark） | `#6D28D9` | 按下态、深色背景中的品牌元素 |
| 渐变起点 | `#7C3AED` | 登录页背景渐变起点 |
| 渐变终点 | `#4F46E5` | 登录页背景渐变终点（蓝紫色调） |

### 2.2 深色模式配色（Dark Mode）— 默认主题

```
背景层：
  --bg-base:      #0A0A0F   /* 最底层背景（App level） */
  --bg-surface:   #111118   /* 卡片、侧边栏背景 */
  --bg-elevated:  #1C1C26   /* 弹窗、下拉菜单、hover 层 */
  --bg-overlay:  #252530   /* Modal、tooltip 背景 */

边框层：
  --border-subtle: #1E1E2A   /* 极细边框、分割线 */
  --border-default:#2A2A3A   /* 默认边框 */
  --border-strong: #3D3D52   /* 强调边框 */

文字层：
  --text-primary:   #F5F5F7  /* 主要文字 */
  --text-secondary: #9898A6  /* 次要文字、标签 */
  --text-tertiary:  #5C5C6E  /* 占位符、禁用文字 */
  --text-inverse:   #0A0A0F  /* 深色背景上的文字 */

语义色（Dark Mode）：
  --color-success:  #10B981   /* 成功（翡翠绿） */
  --color-warning:  #F59E0B   /* 警告（琥珀） */
  --color-error:    #EF4444   /* 错误（红） */
  --color-info:     #3B82F6   /* 信息（蓝） */

状态色：
  --status-active:  #10B981
  --status-disabled:#EF4444
  --status-pending: #F59E0B
```

### 2.3 浅色模式配色（Light Mode）

```
背景层：
  --bg-base:      #FFFFFF
  --bg-surface:   #F9FAFB
  --bg-elevated:  #FFFFFF
  --bg-overlay:   #FFFFFF

边框层：
  --border-subtle: #F3F4F6
  --border-default:#E5E7EB
  --border-strong: #D1D5DB

文字层：
  --text-primary:   #111827
  --text-secondary: #6B7280
  --text-tertiary:  #9CA3AF
  --text-inverse:   #FFFFFF

语义色（Light Mode）：
  --color-success:  #059669
  --color-warning:  #D97706
  --color-error:    #DC2626
  --color-info:     #2563EB
```

### 2.4 功能色详细定义

#### 成功（Success）
- **Dark**：`#10B981`（背景 rgba(16, 185, 129, 0.12)）
- **Light**：`#059669`
- 使用场景：余额充足、Key 启用状态、成功提示、活跃状态

#### 警告（Warning）
- **Dark**：`#F59E0B`
- **Light**：`#D97706`
- 使用场景：余额低于警戒（< ¥5）、Key 复制提示、处理中状态

#### 错误（Error）
- **Dark**：`#EF4444`
- **Light**：`#DC2626`
- 使用场景：余额不足、Key 禁用、删除确认、API 错误响应

#### 信息（Info）
- **Dark**：`#3B82F6`
- **Light**：`#2563EB`
- 使用场景：系统提示、帮助信息、模型说明

### 2.5 Key 值展示专用色（代码/Hash 高亮）

```
--key-masked:  #6B6B8D   /* Key 被隐藏时的占位符 */
--key-visible:#A5B4FC   /* Key 明文展示时的文字色（淡紫，便于识别为代码） */
--key-bg:     #1C1C2E   /* Key 展示背景（深紫灰） */
--key-border: #2E2E45   /* Key 框边框 */
```

---

## 3. 字体系统

### 3.1 中文字体

| 用途 | 字体 | 回退 |
|------|------|------|
| 界面主字体 | `PingFang SC`（macOS/iOS） | `Microsoft YaHei`（Windows） | `Noto Sans SC`（Android） |
| 等宽字体（代码、Key） | `JetBrains Mono` | `Fira Code` | `monospace` |

> 注意：引入 Google Fonts `Noto Sans SC:wght@400;500;600` + `JetBrains Mono:wght@400;500`

### 3.2 英文字体

| 用途 | 字体 |
|------|------|
| 界面主字体 | `Inter` |
| 等宽字体 | `JetBrains Mono` |

### 3.3 字号规范

```
--text-xs:    11px   /* 极小标签、辅助说明 */
--text-sm:    13px   /* 次要文字、表格内容、表格头 */
--text-base:  14px   /* 界面正文（默认） */
--text-md:    15px   /* 稍大正文 */
--text-lg:    16px   /* 页面小标题 */
--text-xl:    18px   /* 页面大标题 */
--text-2xl:   22px   /* Dashboard 数字（大数据展示） */
--text-3xl:   28px   /* 登录页大标题 */
--text-4xl:   36px   /* Landing 页面 Hero */

--leading-tight:  1.25   /* 紧凑行高（标题） */
--leading-normal: 1.5    /* 默认行高 */
--leading-loose: 1.75   /* 宽松行高（正文块） */
```

### 3.4 字重规范

```
--font-normal:   400
--font-medium:   500
--font-semibold: 600
--font-bold:     700
```

---

## 4. 空间系统（Spacing）

### 4.1 基础间距单位

基于 **4px 网格**：

```
--space-0:   0
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
```

### 4.2 组件内间距

```
组件内边距（小）：  12px  /* 紧凑卡片、表格单元格 */
组件内边距（中）：  16px  /* 标准卡片、标准表单 */
组件内边距（大）：  24px  /* 页面内大卡片、弹窗内容 */
组件内边距（超大）：32px  /* 页面容器 padding */
```

### 4.3 组件间间距

```
组件间距（紧凑）： 8px   /* 同一功能组内的元素 */
组件间距（标准）： 16px  /* 卡片内不同区块 */
组件间距（宽松）： 24px  /* 页面内不同模块 */
组件间距（页面）： 32px  /* 主要内容区块之间 */
```

---

## 5. 圆角与阴影

### 5.1 圆角规范

```
--radius-sm:   4px    /* 小标签、badge、checkbox */
--radius-md:   8px    /* 按钮、输入框、下拉框、卡片 */
--radius-lg:   12px   /* 大卡片、弹窗 */
--radius-xl:   16px   /* 大容器、特殊强调 */
--radius-full: 9999px /* 胶囊按钮、圆形头像 */
```

### 5.2 阴影规范

```
阴影-1（极淡）：0 1px 2px rgba(0,0,0,0.05)
阴影-2（淡）： 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
阴影-3（中）： 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
阴影-4（强）： 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)
阴影-5（最强）：0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)

// Dark Mode 专用阴影
--shadow-dark-1: 0 1px 3px rgba(0,0,0,0.4)
--shadow-dark-2: 0 4px 12px rgba(0,0,0,0.5)
--shadow-dark-glow: 0 0 20px rgba(124, 58, 237, 0.3)  /* 品牌色光晕 */
```

---

## 6. 动效规范

### 6.1 时长规范

```
--duration-fast:   100ms  /* 微交互：hover、press */
--duration-normal: 200ms  /* 常规过渡：展开、下落 */
--duration-slow:   300ms  /* 大型过渡：弹窗、滑入 */
--duration-slower: 500ms  /* 页面切换、加载动画 */
```

### 6.2 缓动曲线

```
--ease-out:    cubic-bezier(0.16, 1, 0.3, 1)   /* 自然减速（弹出、展开） */
--ease-in:     cubic-bezier(0.7, 0, 0.84, 0)   /* 自然加速 */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)  /* 对称过渡 */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) /* 弹性动效（按钮点击） */
```

### 6.3 典型动效场景

- **按钮悬停**：scale(1.02)，100ms，ease-out
- **按钮点击**：scale(0.98)，100ms，ease-spring
- **卡片悬停**：阴影加深 + translateY(-2px)，200ms，ease-out
- **弹窗出现**：opacity 0→1 + scale 0.96→1，200ms，ease-out
- **侧边栏展开**：width 变化，200ms，ease-out
- **加载动画**：品牌紫脉冲光晕，1.5s，循环

---

## 7. 图标规范

- **图标库**：Lucide Icons（线性风格，stroke-width: 1.5）
- **图标尺寸**：16px（紧凑）、20px（标准）、24px（大）
- **图标颜色**：默认跟随文字色（currentColor）

---

## 8. 深浅模式切换策略

- **默认：深色模式**（localStorage 记录用户偏好）
- **CSS 变量实现**：根元素 `data-theme="dark" | "light"`
- **首次访问**：检测系统偏好 `prefers-color-scheme`
- **无闪烁**：CSS 在 `<head>` 内联 `script` 标签中即时注入主题

---

## 9. Logo 与品牌标识

### 9.1 Logo 文字

```
Font: Inter / PingFang SC, Font-weight: 700
文字：TokenProxy
品牌色：#7C3AED
```

### 9.2 Logo 图标（可选）

简洁的"T"变形——两个矩形交叉，代表 Token（代币/令牌）的抽象图形。
配色：渐变 #7C3AED → #4F46E5

### 9.3 使用规范

- 深色背景：Logo 颜色 #7C3AED（品牌紫）
- 浅色背景：Logo 颜色 #7C3AED（保持一致，深浅背景均使用品牌紫）
- 最小可读尺寸：Logo 区域高度 ≥ 32px
