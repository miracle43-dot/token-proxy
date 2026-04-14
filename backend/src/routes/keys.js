import { Router } from 'express';
import crypto from 'crypto';
import { authenticateJWT } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();
router.use(authenticateJWT);

// POST /api/keys - 创建 API Key
router.post('/', (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  const key = `sk-proxy-${crypto.randomBytes(32).toString('hex')}`;
  const keyName = name ? String(name).slice(0, 100) : `Key-${Date.now()}`;

  const result = db.prepare(
    'INSERT INTO api_keys (user_id, key, name) VALUES (?, ?, ?)'
  ).run(userId, key, keyName);

  res.status(201).json({
    id: result.lastInsertRowid,
    key,
    name: keyName,
    status: 'active',
    created_at: new Date().toISOString(),
  });
});

// GET /api/keys - 列出用户所有 Key
router.get('/', (req, res) => {
  const userId = req.user.id;

  const keys = db.prepare(`
    SELECT ak.id, ak.name, ak.status, ak.created_at,
      (SELECT COUNT(*) FROM usage_logs WHERE api_key_id = ak.id) as call_count,
      (SELECT COALESCE(SUM(cost), 0) FROM usage_logs WHERE api_key_id = ak.id) as total_cost,
      (SELECT COALESCE(SUM(total_tokens), 0) FROM usage_logs WHERE api_key_id = ak.id) as total_tokens
    FROM api_keys ak
    WHERE ak.user_id = ?
    ORDER BY ak.created_at DESC
  `).all(userId);

  res.json({ data: keys });
});

// DELETE /api/keys/:id - 删除 Key
router.delete('/:id', (req, res) => {
  const userId = req.user.id;
  const keyId = parseInt(req.params.id);

  const key = db.prepare('SELECT * FROM api_keys WHERE id = ? AND user_id = ?')
    .get(keyId, userId);

  if (!key) {
    return res.status(404).json({ error: 'API key not found' });
  }

  db.prepare('DELETE FROM api_keys WHERE id = ?').run(keyId);

  res.json({ message: 'API key deleted' });
});

// PATCH /api/keys/:id - 更新 Key (如改名/禁用)
router.patch('/:id', (req, res) => {
  const userId = req.user.id;
  const keyId = parseInt(req.params.id);
  const { name, status } = req.body;

  const key = db.prepare('SELECT * FROM api_keys WHERE id = ? AND user_id = ?')
    .get(keyId, userId);

  if (!key) {
    return res.status(404).json({ error: 'API key not found' });
  }

  const updates = [];
  const params = [];

  if (name !== undefined) {
    updates.push('name = ?');
    params.push(String(name).slice(0, 100));
  }

  if (status !== undefined && ['active', 'disabled'].includes(status)) {
    updates.push('status = ?');
    params.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  db.prepare(`UPDATE api_keys SET ${updates.join(', ')} WHERE id = ?`)
    .run(...params, keyId);

  const updated = db.prepare('SELECT * FROM api_keys WHERE id = ?').get(keyId);
  res.json(updated);
});

export default router;
