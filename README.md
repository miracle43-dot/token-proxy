# Token Proxy - AI API 代理平台

## 项目结构

```
token-proxy/
├── server/              # 后端 (Node.js + Express + SQLite)
│   ├── index.js         # 主入口
│   ├── db/index.js      # SQLite 数据库初始化
│   ├── middleware/
│   │   └── auth.js      # JWT & API Key 认证中间件
│   ├── routes/
│   │   ├── auth.js      # 注册/登录
│   │   ├── user.js      # 用户信息/余额/交易记录
│   │   ├── apiKeys.js   # API Key 管理
│   │   ├── proxy.js     # 代理核心（/v1/chat/completions）
│   │   ├── usage.js     # 用量统计
│   │   └── recharge.js  # 充值系统
│   └── utils/
│       ├── pricing.js   # 模型定价
│       └── key.js       # Key/订单号生成
├── client/              # 前端 (Vue3 + Vite)
│   ├── src/
│   │   ├── views/       # 页面组件
│   │   ├── stores/      # Pinia 状态管理
│   │   └── router/      # Vue Router
│   └── vite.config.js
└── README.md
```

## 快速启动

### 1. 安装依赖

```bash
cd server && npm install
cd ../client && npm install
```

### 2. 启动后端

```bash
cd server
node index.js
# 服务运行在 http://localhost:3001
```

### 3. 启动前端（开发模式）

```bash
cd client
npx vite
# 前端运行在 http://localhost:5173
```

### 4. 生产构建

```bash
cd client
npm run build
# 构建产物在 dist/
# 后端会服务静态文件，一行命令部署
```

## API 端点

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录

### 用户
- `GET /api/user/me` - 当前用户信息
- `GET /api/user/balance` - 余额查询
- `GET /api/user/transactions` - 交易记录

### API Keys
- `GET /api/api-keys` - 获取 Key 列表
- `POST /api/api-keys` - 创建新 Key
- `DELETE /api/api-keys/:id` - 删除 Key
- `PATCH /api/api-keys/:id/toggle` - 启用/禁用

### 用量
- `GET /api/usage/stats` - 用量统计
- `GET /api/usage/logs` - 用量明细

### 充值
- `GET /api/recharge/packages` - 充值套餐
- `POST /api/recharge/orders` - 创建充值订单
- `POST /api/recharge/orders/:orderId/mock-callback` - 模拟支付回调（开发用）

### 代理（API Key 认证）
- `POST /v1/chat/completions` - 代理 chat completions
- `GET /v1/models` - 获取模型列表

## 环境变量

```bash
# 后端 (.env)
PORT=3001
JWT_SECRET=your-secret-key
UPSTREAM_BASE_URL=https://api.openai.com  # 上游 API 地址
UPSTREAM_API_KEY=sk-xxx                    # 上游 API Key
DEFAULT_MODEL=gpt-4o-mini
```

## 技术说明

- 数据库使用 SQLite（sql.js），数据保存在 `server/db/token_proxy.db`
- API Key 兼容 OpenAI 格式（`sk-` 开头）
- 代理支持 token 预估扣费，实际用量后校正
- 定价模型可扩展，支持按模型配置价格

## 待完成

- [ ] 微信/支付宝支付对接
- [ ] 真实 token 计费（使用 tiktoken）
- [ ] 管理后台
- [ ] 邮件/短信通知（余额不足）
- [ ] 多用户配额管理
