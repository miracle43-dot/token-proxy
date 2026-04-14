import jwt from 'jsonwebtoken';
import { queryOne } from '../db/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'token-proxy-secret-key-change-in-production';

export function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: '无效或过期的令牌' });
  }
}

export function apiKeyAuth(req, res, next) {
  const apiKeyHeader = req.headers['x-api-key'] || req.query.api_key;
  if (!apiKeyHeader) {
    return res.status(401).json({ error: '未提供API Key' });
  }

  const keyRecord = queryOne(`
    SELECT ak.*, u.id as user_id, u.balance as user_balance, u.username
    FROM api_keys ak
    JOIN users u ON ak.user_id = u.id
    WHERE ak.key = ? AND ak.is_active = 1
  `, [apiKeyHeader]);

  if (!keyRecord) {
    return res.status(401).json({ error: '无效的API Key' });
  }

  req.apiKey = keyRecord;
  req.user = { id: keyRecord.user_id, username: keyRecord.username, balance: keyRecord.user_balance };
  next();
}
