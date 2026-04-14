import express from 'express';
import { queryOne, queryAll } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authMiddleware, (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let whereClause = 'WHERE user_id = ?';
    const params = [req.user.id];

    if (start_date) {
      whereClause += ' AND created_at >= ?';
      params.push(start_date);
    }
    if (end_date) {
      whereClause += ' AND created_at <= ?';
      params.push(end_date + ' 23:59:59');
    }

    const summary = queryOne(`
      SELECT
        COUNT(*) as total_calls,
        COALESCE(SUM(input_tokens), 0) as total_input_tokens,
        COALESCE(SUM(output_tokens), 0) as total_output_tokens,
        COALESCE(SUM(cost), 0) as total_cost
      FROM usage_logs ${whereClause}
    `, params);

    const byModel = queryAll(`
      SELECT
        model,
        COUNT(*) as calls,
        COALESCE(SUM(input_tokens), 0) as input_tokens,
        COALESCE(SUM(output_tokens), 0) as output_tokens,
        COALESCE(SUM(cost), 0) as cost
      FROM usage_logs ${whereClause}
      GROUP BY model
      ORDER BY cost DESC
    `, params);

    const byDay = queryAll(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as calls,
        COALESCE(SUM(cost), 0) as cost
      FROM usage_logs ${whereClause}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `, params);

    res.json({ summary, byModel, byDay });
  } catch (err) {
    console.error('Get usage stats error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/logs', authMiddleware, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 50;
    const offset = (page - 1) * pageSize;
    const { model, start_date, end_date } = req.query;

    let whereClause = 'WHERE user_id = ?';
    const params = [req.user.id];

    if (model) {
      whereClause += ' AND model = ?';
      params.push(model);
    }
    if (start_date) {
      whereClause += ' AND created_at >= ?';
      params.push(start_date);
    }
    if (end_date) {
      whereClause += ' AND created_at <= ?';
      params.push(end_date + ' 23:59:59');
    }

    const logs = queryAll(`
      SELECT ul.*, ak.name as api_key_name
      FROM usage_logs ul
      LEFT JOIN api_keys ak ON ul.api_key_id = ak.id
      ${whereClause}
      ORDER BY ul.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, pageSize, offset]);

    const total = queryOne(`SELECT COUNT(*) as count FROM usage_logs ${whereClause}`, params).count;

    res.json({ logs, total, page, pageSize });
  } catch (err) {
    console.error('Get usage logs error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
