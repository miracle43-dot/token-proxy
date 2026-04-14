import express from 'express';
import cors from 'cors';
import config from './config.js';
import { initDB } from './db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import keysRoutes from './routes/keys.js';
import modelsRoutes from './routes/models.js';
import rechargeRoutes from './routes/recharge.js';
import proxyRoutes from './routes/proxy.js';

// 初始化数据库
initDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/keys', keysRoutes);
app.use('/api/models', modelsRoutes);
app.use('/api/recharge', rechargeRoutes);

// OpenAI 兼容代理接口
app.use('/v1', proxyRoutes);

// 健康检查
app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// 404
app.use((_, res) => res.status(404).json({ error: 'Not found' }));

// 错误处理
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`TokenProxy backend running on http://localhost:${config.port}`);
});
