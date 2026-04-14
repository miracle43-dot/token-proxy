import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();

router.use(authenticateJWT);

// GET /api/user/balance - 获取余额和用量概览
router.get('/balance', (req, res) => {
  const userId = req.user.id;

  // 实时余额
  const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId);

  // 总用量统计
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_calls,
      COALESCE(SUM(prompt_tokens), 0) as total_prompt_tokens,
      COALESCE(SUM(completion_tokens), 0) as total_completion_tokens,
      COALESCE(SUM(total_tokens), 0) as total_tokens,
      COALESCE(SUM(cost), 0) as total_cost
    FROM usage_logs
    WHERE user_id = ?
  `).get(userId);

  // 近30天用量
  const monthStats = db.prepare(`
    SELECT
      COUNT(*) as calls,
      COALESCE(SUM(total_tokens), 0) as tokens,
      COALESCE(SUM(cost), 0) as cost
    FROM usage_logs
    WHERE user_id = ? AND request_time >= datetime('now', '-30 days')
  `).get(userId);

  // 各模型调用统计
  const modelStats = db.prepare(`
    SELECT model, COUNT(*) as calls, SUM(total_tokens) as tokens, SUM(cost) as cost
    FROM usage_logs
    WHERE user_id = ?
    GROUP BY model
    ORDER BY cost DESC
    LIMIT 10
  `).all(userId);

  res.json({
    balance: user.balance,
    total: stats,
    last_30_days: monthStats,
    by_model: modelStats,
  });
});

// GET /api/user/usage - 用量明细列表
router.get('/usage', (req, res) => {
  const userId = req.user.id;
  const { page = 1, page_size = 20, model, start_date, end_date } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(page_size);

  let where = 'WHERE user_id = ?';
  const params = [userId];

  if (model) {
    where += ' AND model = ?';
    params.push(model);
  }

  if (start_date) {
    where += ' AND request_time >= ?';
    params.push(start_date);
  }

  if (end_date) {
    where += ' AND request_time <= ?';
    params.push(end_date);
  }

  const total = db.prepare(`SELECT COUNT(*) as count FROM usage_logs ${where}`).get(...params).count;

  const rows = db.prepare(`
    SELECT id, model, prompt_tokens, completion_tokens, total_tokens,
           cost, latency_ms, request_time, response_status
    FROM usage_logs
    ${where}
    ORDER BY request_time DESC
    LIMIT ? OFFSET ?
  `).all(...params, parseInt(page_size), offset);

  res.json({
    total,
    page: parseInt(page),
    page_size: parseInt(page_size),
    pages: Math.ceil(total / parseInt(page_size)),
    data: rows,
  });
});

export default router;
