import { Router } from 'express';
import crypto from 'crypto';
import { authenticateJWT } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();
router.use(authenticateJWT);

// POST /api/subkeys - 创建子密钥
router.post('/', (req, res) => {
  const userId = req.user.id;
  const { parent_key_id, name, quota_limit, allowed_models } = req.body;

  // 验证父 Key 存在且属于当前用户
  const parentKey = db.prepare(
    'SELECT * FROM api_keys WHERE id = ? AND user_id = ?'
  ).get(parent_key_id, userId);

  if (!parentKey) {
    return res.status(404).json({ error: 'Parent API key not found' });
  }

  // 生成 sk-sub- 开头的密钥
  const subKey = `sk-sub-${crypto.randomBytes(24).toString('hex')}`;
  const subName = name ? String(name).slice(0, 100) : `SubKey-${Date.now()}`;
  const quota = parseFloat(quota_limit) || 0;
  const models = Array.isArray(allowed_models) ? allowed_models : [];

  const result = db.prepare(`
    INSERT INTO sub_keys (parent_key_id, user_id, sub_key, name, quota_limit, allowed_models)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(parent_key_id, userId, subKey, subName, quota, JSON.stringify(models));

  res.status(201).json({
    id: result.lastInsertRowid,
    sub_key: subKey,
    parent_key_id,
    name: subName,
    quota_limit: quota,
    quota_used: 0,
    allowed_models: models,
    status: 'active',
    created_at: new Date().toISOString(),
  });
});

// GET /api/subkeys - 列出当前用户的所有子密钥
router.get('/', (req, res) => {
  const userId = req.user.id;

  const subkeys = db.prepare(`
    SELECT
      sk.id,
      sk.parent_key_id,
      sk.sub_key,
      sk.name,
      sk.quota_limit,
      sk.quota_used,
      sk.allowed_models,
      sk.status,
      sk.created_at,
      ak.name as parent_key_name
    FROM sub_keys sk
    JOIN api_keys ak ON ak.id = sk.parent_key_id
    WHERE sk.user_id = ?
    ORDER BY sk.created_at DESC
  `).all(userId);

  res.json({
    data: subkeys.map(sk => ({
      ...sk,
      allowed_models: JSON.parse(sk.allowed_models || '[]'),
      quota_used: parseFloat(sk.quota_used || 0),
      quota_limit: parseFloat(sk.quota_limit || 0),
    })),
  });
});

// DELETE /api/subkeys/:id - 删除子密钥
router.delete('/:id', (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);

  const subkey = db.prepare('SELECT * FROM sub_keys WHERE id = ? AND user_id = ?')
    .get(id, userId);

  if (!subkey) {
    return res.status(404).json({ error: 'Sub-key not found' });
  }

  db.prepare('DELETE FROM sub_keys WHERE id = ?').run(id);

  res.json({ message: 'Sub-key deleted' });
});

// PATCH /api/subkeys/:id - 更新子密钥
router.patch('/:id', (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);
  const { name, quota_limit, allowed_models, status } = req.body;

  const subkey = db.prepare('SELECT * FROM sub_keys WHERE id = ? AND user_id = ?')
    .get(id, userId);

  if (!subkey) {
    return res.status(404).json({ error: 'Sub-key not found' });
  }

  const updates = [];
  const params = [];

  if (name !== undefined) {
    updates.push('name = ?');
    params.push(String(name).slice(0, 100));
  }

  if (quota_limit !== undefined) {
    updates.push('quota_limit = ?');
    params.push(parseFloat(quota_limit));
  }

  if (allowed_models !== undefined) {
    updates.push('allowed_models = ?');
    params.push(JSON.stringify(Array.isArray(allowed_models) ? allowed_models : []));
  }

  if (status !== undefined && ['active', 'disabled'].includes(status)) {
    updates.push('status = ?');
    params.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  db.prepare(`UPDATE sub_keys SET ${updates.join(', ')} WHERE id = ?`)
    .run(...params, id);

  const updated = db.prepare(`
    SELECT sk.*, ak.name as parent_key_name
    FROM sub_keys sk
    JOIN api_keys ak ON ak.id = sk.parent_key_id
    WHERE sk.id = ?
  `).get(id);

  res.json({
    ...updated,
    allowed_models: JSON.parse(updated.allowed_models || '[]'),
    quota_used: parseFloat(updated.quota_used || 0),
    quota_limit: parseFloat(updated.quota_limit || 0),
  });
});

export default router;
