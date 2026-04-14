import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/models - 列出可用模型
router.get('/', (req, res) => {
  const models = db.prepare(`
    SELECT model_id, name, provider, input_price, output_price
    FROM models WHERE enabled = 1
    ORDER BY sort_order, name
  `).all();

  res.json({ data: models });
});

// GET /api/models/pricing - 价格表
router.get('/pricing', (req, res) => {
  const models = db.prepare(`
    SELECT model_id, name, provider, input_price, output_price,
           ROUND(input_price / 1, 4) as input_price_per_1k,
           ROUND(output_price / 1, 4) as output_price_per_1k
    FROM models WHERE enabled = 1
    ORDER BY provider, sort_order
  `).all();

  // 按提供商分组
  const byProvider = models.reduce((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {});

  res.json({ data: models, by_provider: byProvider });
});

export default router;
