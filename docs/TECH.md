# TokenProxy Tech - 技术架构文档

> 版本：v1.0 | 撰写日期：2026-04-15 | 状态：**MVP已完成**

---

## 1. 系统架构

### 1.1 技术栈总览

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端 | Vue3 + Vite + Element Plus + Axios | 前后端分离 |
| 后端 | Node.js + Express + better-sqlite3 | 轻量、够用 |
| 数据库 | SQLite（sql.js / better-sqlite3）| 单文件，适合MVP |
| 代理转发 | axios 反向代理 | 支持流式响应 |
| 认证 | JWT（jsonwebtoken）+ bcryptjs | 7天有效期 |
| 部署 | Railway + Nginx | 一键部署 |

### 1.2 架构图

```
                    ┌─────────────────┐
                    │   用户浏览器     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   Railway 部署   │
                    │  ┌───────────┐  │
                    │  │   Nginx   │  │
                    │  │  (反向代理) │  │
                    │  └─────┬─────┘  │
                    │        │        │
              ┌─────▼────────▼──────┐ │
              │    Express Server  │ │
              │                    │ │
              │  ┌──────────────┐  │ │
              │  │  认证中间件   │  │ │
              │  │  API Key校验  │  │ │
              │  │  计费中间件   │  │ │
              │  └──────┬───────┘  │ │
              │         │          │ │
              │  ┌──────▼───────┐  │ │
              │  │  SQLite DB   │  │ │
              │  └──────────────┘  │ │
              └────────────────────┘ │
                             │
              ┌──────────────┴──────────────┐
              │         上游 API           │
              │  OpenAI / Anthropic / ...  │
              └───────────────────────────┘
```

### 1.3 目录结构

```
token-proxy/
├── SPEC.md                    # 产品规格书
├── README.md                   # 项目说明
├── railway.json                # Railway 部署配置
├── docs/                       # 文档目录
│   ├── PRD.md                  # 产品需求文档
│   ├── DESIGN.md               # UI/UX 设计文档
│   └── TECH.md                 # 本文档
├── backend/                    # 后端（实际运行的服务）
│   ├── package.json
│   └── src/
│       ├── index.js            # Express 入口
│       ├── config.js           # 环境配置
│       ├── db.js               # SQLite 初始化
│       ├── routes/
│       │   ├── auth.js         # 注册/登录
│       │   ├── user.js         # 用户信息
│       │   ├── keys.js         # API Key CRUD
│       │   ├── models.js       # 模型列表
│       │   ├── recharge.js     # 充值（预留）
│       │   └── proxy.js        # ★ 代理核心
│       └── middleware/
│           ├── auth.js         # JWT 验证
│           ├── apikey.js       # API Key 验证
│           └── billing.js      # ★ 计费中间件
├── frontend/                   # 前端（Vue3）
│   ├── package.json
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── api/index.js        # API 调用封装
│       ├── router/index.js     # 路由配置
│       ├── stores/user.js      # Pinia 状态
│       └── views/              # 页面组件
│           ├── Login.vue
│           ├── Register.vue
│           ├── Dashboard.vue
│           ├── Keys.vue
│           ├── Usage.vue
│           ├── Pricing.vue
│           ├── Recharge.vue
│           └── Playground.vue
└── scripts/
    └── init-db.js              # 数据库初始化脚本
```

---

## 2. 核心模块详解

### 2.1 代理核心（proxy.js）

**职责：** 接收用户请求，验证后转发给上游 API，返回响应并记录用量。

**请求流程：**
```
用户 POST /v1/chat/completions
    ↓
authenticateApiKey 中间件（验证 Key 是否有效）
    ↓
检查模型是否启用
    ↓
根据模型前缀选择上游（openai/anthropic/google）
    ↓
axios 转发请求到上游
    ↓
recordUsage 计费中间件（计算费用、扣减余额）
    ↓
返回响应给用户
```

**关键实现：**
```javascript
// 流式响应处理
if (requestBody.stream) {
  res.setHeader('Content-Type', 'text/event-stream');
  upstreamRes.data.pipe(res);  // 直接pipe，不缓冲
}
```

### 2.2 计费中间件（billing.js）

**计费公式：**
```
cost = (prompt_tokens × input_price + completion_tokens × output_price) / 1,000,000
```

**余额扣除（事务）：**
```javascript
const updateBalance = db.transaction(() => {
  const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId);
  const newBalance = user.balance - cost;
  db.prepare('UPDATE users SET balance = ? WHERE id = ?').run(newBalance, userId);
  // 记录流水
  db.prepare('INSERT INTO balance_logs ...').run(...);
});
updateBalance();
```

**封顶机制：** 单次请求最高消费 10 元（防止异常）

### 2.3 API Key 认证（apikey.js）

**Key 格式：** `sk-proxy-` + 32位随机hex
**验证流程：**
1. 从 `Authorization: Bearer sk-proxy-xxx` 提取 Key
2. 数据库查询是否存在且状态为 `active`
3. 检查用户余额 > 0
4. 挂载 `req.user` 和 `req.apiKey`

---

## 3. 数据库设计

### 3.1 ER 关系

```
users (1) ──── (N) api_keys
users (1) ──── (N) usage_logs
users (1) ──── (N) balance_logs
users (1) ──── (N) recharge_orders
api_keys (1) ──── (N) usage_logs
models (N) ──── (1) usage_logs (通过model字段)
```

### 3.2 索引策略

```sql
CREATE INDEX idx_usage_user ON usage_logs(user_id);
CREATE INDEX idx_usage_key ON usage_logs(api_key_id);
CREATE INDEX idx_usage_time ON usage_logs(request_time);
CREATE INDEX idx_keys_key ON api_keys(key);
CREATE INDEX idx_balance_user ON balance_logs(user_id);
```

---

## 4. API 接口设计

### 4.1 认证方式

| 接口类型 | 认证方式 |
|---------|---------|
| 管理接口（/api/*） | JWT Bearer Token |
| 代理接口（/v1/*） | API Key Bearer Token |

### 4.2 JWT Token 结构

```json
{
  "userId": 1,
  "email": "user@example.com",
  "iat": 1713000000,
  "exp": 1713600000
}
```

### 4.3 核心 API 列表

#### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 当前用户

#### 用户
- `GET /api/user/balance` - 余额 + 统计

#### API Keys
- `POST /api/keys` - 创建 Key
- `GET /api/keys` - 列表
- `DELETE /api/keys/:id` - 删除

#### 用量
- `GET /api/user/usage` - 用量明细（分页）

#### 模型
- `GET /api/models` - 可用模型列表
- `GET /api/models/pricing` - 价格表

#### 充值（预留）
- `POST /api/recharge/create` - 创建订单
- `POST /api/recharge/callback` - 支付回调

#### 代理（OpenAI 兼容）
- `POST /v1/chat/completions` - **核心接口**
- `GET /v1/models` - 模型列表

---

## 5. 安全设计

| 安全点 | 实现方式 |
|-------|---------|
| 密码存储 | bcryptjs，salt rounds = 12 |
| API Key 生成 | crypto.randomBytes(32)，足够随机 |
| JWT 安全 | 7天过期，HTTP-only Cookie（规划） |
| 请求限流 | 单次请求最大 128k tokens |
| 代理超时 | 统一 120s 超时 |
| 错误隐藏 | 上游错误不直接暴露给用户 |

---

## 6. 部署架构（Railway）

### 6.1 环境变量

| 变量名 | 说明 | 示例 |
|-------|------|------|
| PORT | 服务端口 | 3001 |
| JWT_SECRET | JWT 密钥 | random-string |
| UPSTREAM_OPENAI_KEY | 上游 OpenAI Key | sk-xxx |
| UPSTREAM_BASE_URL | 上游地址 | https://api.openai.com |

### 6.2 Nginx 配置（railway.toml）

- 反向代理 `/*` → `localhost:3001`
- 静态文件缓存头
- Gzip 压缩

---

## 7. 性能优化

| 优化点 | 当前状态 | 改进方向 |
|-------|---------|---------|
| 数据库 | SQLite 单文件 | 未来迁移 PostgreSQL |
| 流式响应 | pipe 直接返回 | 已优化，不占用内存 |
| 连接池 | 无（SQLite特性） | 足够支撑中小规模 |
| CDN | 无 | 静态资源可上 CDN |
| 缓存 | 无 | Redis 缓存模型列表 |

---

## 8. 监控与日志

### 8.1 当前日志

```javascript
console.error('Proxy error:', err.message);
```

### 8.2 规划中的监控

- [ ] 请求量和响应时间统计
- [ ] 错误率告警
- [ ] 用户余额不足提醒
- [ ] 异常调用检测（如大量失败请求）

---

_本文档随产品迭代持续更新_
