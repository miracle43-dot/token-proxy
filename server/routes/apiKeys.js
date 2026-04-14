import express from 'express';
import { queryAll, queryOne, execute } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateApiKey } from '../utils/key.js';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const keys = queryAll(
      'SELECT id, key, name, balance, is_active, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    const maskedKeys = keys.map(k => ({
      ...k,
      key: k.key.slice(0, 8) + '...' + k.key.slice(-4),
      key_preview: k.key.slice(0, 8) + '...' + k.key.slice(-4),
      is_active: Boolean(k.is_active)
    }));

    res.json({ apiKeys: maskedKeys });
  } catch (err) {
    console.error('Get api keys error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { name } = req.body;
    const key = generateApiKey();
    const keyName = name || `Key ${new Date().toLocaleDateString()}`;

    const result = execute(
      'INSERT INTO api_keys (user_id, key, name) VALUES (?, ?, ?)',
      [req.user.id, key, keyName]
    );

    res.json({
      apiKey: {
        id: result.lastInsertRowid,
        key,
        name: keyName,
        balance: 0,
        is_active: true
      }
    });
  } catch (err) {
    console.error('Create api key error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const result = execute('DELETE FROM api_keys WHERE id = ? AND user_id = ?', [id, req.user.id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'API Key不存在或无权删除' });
    }
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('Delete api key error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.patch('/:id/toggle', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const result = queryOne(
      'UPDATE api_keys SET is_active = NOT is_active WHERE id = ? AND user_id = ? RETURNING is_active',
      [id, req.user.id]
    );

    if (!result) {
      return res.status(404).json({ error: 'API Key不存在' });
    }
    res.json({ is_active: Boolean(result.is_active) });
  } catch (err) {
    console.error('Toggle api key error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
