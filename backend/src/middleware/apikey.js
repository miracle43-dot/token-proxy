import db from '../db.js';

/**
 * 验证 API Key 的中间件
 * 从 Authorization: Bearer sk-proxy-xxx 头提取 key
 * 挂载 req.apiKey 和 req.user
 */
export function authenticateApiKey(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const key = auth.slice(7);
  if (!key.startsWith('sk-proxy-')) {
    return res.status(401).json({ error: 'Invalid API key format' });
  }

  const record = db.prepare(`
    SELECT ak.id as key_id, ak.user_id, ak.status, ak.name,
           u.email, u.balance, u.is_admin
    FROM api_keys ak
    JOIN users u ON u.id = ak.user_id
    WHERE ak.key = ?
  `).get(key);

  if (!record) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  if (record.status !== 'active') {
    return res.status(403).json({ error: 'API key is disabled' });
  }

  if (record.balance <= 0) {
    return res.status(402).json({ error: 'Insufficient balance. Please recharge.' });
  }

  req.apiKey = { id: record.key_id, name: record.name };
  req.user = { id: record.user_id, email: record.email, balance: record.balance };
  next();
}
