import express from 'express';
import { queryOne, queryAll } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authMiddleware, (req, res) => {
  try {
    const user = queryOne('SELECT id, username, balance, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/balance', authMiddleware, (req, res) => {
  try {
    const user = queryOne('SELECT balance FROM users WHERE id = ?', [req.user.id]);
    res.json({ balance: user.balance });
  } catch (err) {
    console.error('Get balance error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/transactions', authMiddleware, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 20;
    const offset = (page - 1) * pageSize;

    const transactions = queryAll(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [req.user.id, pageSize, offset]
    );
    const total = queryOne('SELECT COUNT(*) as count FROM transactions WHERE user_id = ?', [req.user.id]).count;

    res.json({ transactions, total, page, pageSize });
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
