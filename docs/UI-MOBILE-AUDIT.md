# TokenProxy UI/UX + 移动端适配 - 技术评审

> 小傻出品 | 日期：2026-04-18

---

## 一、现状评估

### 1.1 设计系统（已完成 ✅）

| 模块 | 状态 | 说明 |
|------|------|------|
| 色彩系统 | ✅ | BRAND.md v1.0 已定义，variables.scss 已实现 |
| 字体系统 | ✅ | Inter + PingFang + JetBrains Mono 已配置 |
| 间距/圆角/阴影 | ✅ | 4px 网格 + CSS 变量已建立 |
| 深色/浅色切换 | ✅ | data-theme 属性 + localStorage |
| Element Plus 主题 | ✅ | element-variables.scss 已覆盖 |
| Landing Page 响应式 | ✅ | 1024/768/480 三个断点已实现 |

### 1.2 移动端适配审计

| 页面 | 移动端状态 | 问题 |
|------|-----------|------|
| Landing.vue | ✅ 可用 | 响应式完整 |
| Layout.vue（外框） | ❌ 严重 | 侧边栏 sticky 100vh，手机上直接溢出 |
| Dashboard.vue | ⚠️ 需优化 | 4列 stat cards 在手机上堆叠 |
| Keys.vue | ⚠️ 需优化 | Key 值长字符串可能溢出 |
| Usage.vue | ⚠️ 需优化 | 表格横向滚动需验证 |
| Playground.vue | ⚠️ 需优化 | 左右布局在小屏上需折叠 |
| Recharge.vue | ⚠️ 需优化 | 卡片布局需验证 |
| Pricing.vue | ✅ 基本可用 | 表格有 overflow-x:auto |

### 1.3 UI/UX 改进机会

| 类别 | 问题 | 建议 |
|------|------|------|
| 交互 | Dashboard 无 ECharts 趋势图 | 当前是空白的占位卡片 |
| 交互 | Playground 消息气泡没有时间戳 | DESIGN.md 有但代码未实现 |
| 视觉 | 登录/注册页无背景网格纹理 | DESIGN.md 有但 Landing.vue 未实现 |
| 视觉 | 移动端侧边栏切换动画 | 需要 drawer 动效 |
| 体验 | Keys 页复制成功后反馈时间短 | 可加 2s success 状态 |

---

## 二、技术方案（待小美设计方案后补充）

### 2.1 移动端 Layout 重构方案

**方案选择：纯 CSS + 最小 JS**

```
Desktop (≥768px): 侧边栏 220px fixed + 内容区
Mobile (<768px):  顶部 bar + 汉堡菜单 → 右侧 drawer 滑入
```

**技术实现点：**
1. Layout.vue 添加响应式断点样式
2. 移动端侧边栏改为 el-drawer
3. 汉堡按钮显示逻辑
4. 侧边栏选中后自动关闭 drawer（移动端）

### 2.2 性能注意事项

- Element Plus 按需引入（已有）
- 无需引入额外 UI 库
- 动画使用 CSS transition，不引入动画库

---

## 三、等待小美确认

1. 颜色/字体/布局是否有新的优化方向？
2. 移动端菜单：汉堡折叠还是底部 Tab？
3. Dashboard ECharts 趋势图是否要实现？
4. 有无参考的 App/网站风格？

---

## 四、代码改动预估

| 页面 | 改动量 | 优先级 |
|------|--------|--------|
| Layout.vue 移动端 | ~100行 CSS + ~50行 JS | P0 |
| Dashboard.vue 移动端 | ~30行 CSS | P0 |
| Keys.vue 移动端 | ~20行 CSS | P1 |
| Playground.vue 移动端 | ~50行 CSS | P1 |
| Landing.vue UI增强 | 视小美方案定 | P2 |
