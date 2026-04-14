# Token Proxy Platform MVP - SPEC.md

## 1. 项目概述

- **项目名称**: TokenProxy (AI Token 代理销售平台)
- **项目类型**: 前后端分离的全栈应用
- **核心商业模式**: 用户注册充值 → 获得 API Key → 通过代理调用 OpenAI/Claude 等 API → 平台赚取差价
- **参考**: evolai.cn
- **启动日期**: 2026-04-14

---

## 2. 技术栈

| 层级 | 技术选型 |
|------|---------|
| 前端 | Vue3 + Vite + Element Plus + Axios |
| 后端 | Node.js + Express + better-sqlite3 |
| 数据库 | SQLite (users, api_keys, usage_logs, balance_logs, models, recharge_orders) |
| 代理核心 | Express 中间件 + axios 反向代理 |
| 认证 | JWT (JSON Web Token) |
| 密码加密 | bcryptjs |

---

## 3. 数据库结构

### users
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增 |
| email | TEXT UNIQUE | 邮箱 |
| password_hash | TEXT | bcrypt 加密密码 |
| balance | REAL | 余额（单位：元） |
| created_at | TEXT | 创建时间 ISO8601 |
| updated_at | TEXT | 更新时间 |

### api_keys
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增 |
| user_id | INTEGER FK | 所属用户 |
| key | TEXT UNIQUE | sk-proxy-xxx 格式 |
| name | TEXT | Key 名称/备注 |
| status | TEXT | active / disabled |
| created_at | TEXT | 创建时间 |

### usage_logs
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增 |
| user_id | INTEGER FK | 用户 |
| api_key_id | INTEGER FK | 关联 Key |
| model | TEXT | 调用的模型 |
| prompt_tokens | INTEGER | 输入 tokens |
| completion_tokens | INTEGER | 输出 tokens |
| total_tokens | INTEGER | 总 tokens |
| cost | REAL | 本次费用（元） |
| latency_ms | INTEGER | 延迟 ms |
| request_time | TEXT | 请求时间 |
| request_body | TEXT | 请求体（JSON） |
| response_status | INTEGER | 响应状态码 |

### models
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增 |
| model_id | TEXT | 模型标识符 (如 gpt-4o) |
| name | TEXT | 显示名称 |
| provider | TEXT | 提供商 (openai/anthropic/google) |
| input_price | REAL | 输入价格（元/1M tokens） |
| output_price | REAL | 输出价格（元/1M tokens） |
| enabled | INTEGER | 是否启用 0/1 |
| sort_order | INTEGER | 排序 |

### balance_logs
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增 |
| user_id | INTEGER FK | 用户 |
| type | TEXT | recharge/refund/deduct |
| amount | REAL | 变动金额 |
| balance_before | REAL | 变动前余额 |
| balance_after | REAL | 变动后余额 |
| remark | TEXT | 备注 |
| created_at | TEXT | 时间 |

### recharge_orders
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增 |
| user_id | INTEGER FK | 用户 |
| order_id | TEXT UNIQUE | 订单号 |
| amount | REAL | 充值金额 |
| status | TEXT | pending/completed/failed |
| created_at | TEXT | 创建时间 |
| completed_at | TEXT | 完成时间 |

---

## 4. API 设计

### 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 注册 | 否 |
| POST | /api/auth/login | 登录 | 否 |
| GET | /api/auth/me | 获取当前用户信息 | JWT |

### 用户接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/user/balance | 获取余额和用量统计 | JWT |
| GET | /api/user/usage | 用量明细列表（分页） | JWT |

### API Key 接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/keys | 创建 API Key | JWT |
| GET | /api/keys | 列出用户所有 Key | JWT |
| DELETE | /api/keys/:id | 删除 Key | JWT |

### 模型接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/models | 列出可用模型 | 否 |
| GET | /api/models/pricing | 模型价格表 | 否 |

### 充值接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/recharge/orders | 充值订单列表 | JWT |
| POST | /api/recharge/create | 创建充值订单（预留） | JWT |
| POST | /api/recharge/callback | 支付回调（预留） | - |

### 代理接口（OpenAI 兼容）

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /v1/chat/completions | ChatGPT 兼容接口 | API Key |
| GET | /v1/models | 模型列表 | API Key |
| GET | /v1/models/:model | 特定模型信息 | API Key |

### 管理接口（预留）

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/admin/users | 用户列表 | Admin |
| GET | /api/admin/stats | 全局统计 | Admin |

---

## 5. 代理核心逻辑

### API Key 认证中间件
1. 从请求头 `Authorization: Bearer sk-proxy-xxx` 提取 key
2. 查询数据库验证 key 存在且状态为 active
3. 关联用户，检查余额 > 0
4. 将 user_id, api_key_id 挂载到 req

### 用量计费中间件
1. 调用上游 API 成功后，解析响应体获取 usage
2. 根据模型配置计算费用：`cost = (prompt_tokens * input_price + completion_tokens * output_price) / 1_000_000`
3. 扣除用户余额，记录 usage_log
4. 如果余额不足，返回 402 Payment Required

### 代理路由
- 所有 `/v1/*` 请求经过上述中间件
- 替换请求头中的 Authorization，转发到上游（上游 baseURL 可配置）
- 返回上游响应，保留流式响应（stream: true）支持

---

## 6. 前端页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 登录 | /login | 邮箱 + 密码 |
| 注册 | /register | 邮箱 + 密码 + 确认密码 |
| 控制台 | /dashboard | 余额、用量概览、快速入口 |
| API Keys | /keys | Key 管理（列表/创建/删除） |
| 用量明细 | /usage | 调用记录列表 |
| 模型价格 | /pricing | 价格表展示 |
| 充值 | /recharge | 充值页面（预留支付） |
| API 调试台 | /playground | 类似 Playground 的调试界面 |
| 文档 | /docs | API 使用文档 |

---

## 7. 初始化数据

### 默认模型配置
```json
[
  {"model_id": "gpt-4o", "name": "GPT-4o", "provider": "openai", "input_price": 10, "output_price": 30},
  {"model_id": "gpt-4o-mini", "name": "GPT-4o Mini", "provider": "openai", "input_price": 1.5, "output_price": 6},
  {"model_id": "gpt-4-turbo", "name": "GPT-4 Turbo", "provider": "openai", "input_price": 30, "output_price": 90},
  {"model_id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "provider": "openai", "input_price": 0.5, "output_price": 1.5},
  {"model_id": "claude-3-5-sonnet", "name": "Claude 3.5 Sonnet", "provider": "anthropic", "input_price": 7, "output_price": 21},
  {"model_id": "claude-3-5-haiku", "name": "Claude 3.5 Haiku", "provider": "anthropic", "input_price": 0.8, "output_price": 4},
  {"model_id": "gemini-1.5-pro", "name": "Gemini 1.5 Pro", "provider": "google", "input_price": 5, "output_price": 15},
  {"model_id": "gemini-1.5-flash", "name": "Gemini 1.5 Flash", "provider": "google", "input_price": 0.25, "output_price": 0.75}
]
```

### 上游 API 配置
- OPENAI_BASE_URL: https://api.openai.com (默认)
- ANTHROPIC_BASE_URL: https://api.anthropic.com (默认)
- GOOGLE_BASE_URL: https://generativelanguage.googleapis.com (默认)

---

## 8. 安全考虑

1. API Key 前缀 `sk-proxy-` 便于识别
2. Key 值使用 crypto.randomBytes(32).toString('hex') 足够长
3. JWT 有效期 7 天
4. 密码使用 bcrypt（salt rounds = 12）
5. 代理请求超时统一设置为 120s
6. 单次请求最大 tokens 上限 128k（防止异常消耗）

---

## 9. MVP 完成标准

- [x] SPEC.md 完成
- [ ] 后端项目结构搭建完成
- [ ] 数据库初始化脚本完成
- [ ] 用户注册/登录 API 完成
- [ ] API Key CRUD 完成
- [ ] 代理转发 /v1/chat/completions 完成（含计费）
- [ ] 代理转发 /v1/models 完成
- [ ] 用量日志记录完成
- [ ] 余额管理完成
- [ ] 前端项目搭建完成
- [ ] 登录/注册页面完成
- [ ] 控制台/Keys/用量页面完成
- [ ] Playground 页面完成
- [ ] 价格展示页面完成
- [ ] 充值页面（预留）完成
- [ ] 初始化数据脚本完成

---

## 10. 目录结构

```
token-proxy/
├── SPEC.md
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── index.js          # 入口
│   │   ├── config.js          # 配置
│   │   ├── db.js              # SQLite 初始化
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── user.js
│   │   │   ├── keys.js
│   │   │   ├── models.js
│   │   │   ├── recharge.js
│   │   │   └── proxy.js       # 代理核心
│   │   └── middleware/
│   │       ├── auth.js        # JWT 认证
│   │       ├── apikey.js      # API Key 认证
│   │       └── billing.js      # 计费中间件
│   └── data/                  # SQLite 数据目录
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router/
│       ├── views/
│       ├── components/
│       ├── api/
│       └── stores/
└── scripts/
    └── init-db.js             # 初始化数据库和种子数据
```
