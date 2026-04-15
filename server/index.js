import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { initDatabase } from './db/index.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import apiKeysRoutes from './routes/apiKeys.js';
import proxyRoutes from './routes/proxy.js';
import modelsRoutes from './routes/models.js';
import usageRoutes from './routes/usage.js';
import rechargeRoutes from './routes/recharge.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path !== '/health') {
      console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/recharge', rechargeRoutes);
app.use('/v1', proxyRoutes);
app.use('/api/models', modelsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(express.static(join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/v1')) {
    res.sendFile(join(__dirname, '../frontend/dist/index.html'));
  }
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动前初始化数据库
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅ Token Proxy Server running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health\n`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
