import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT } from '../middleware/auth.js';
import db from '../db.js';

const router = Router();
router.use(authenticateJWT);

// GET /api/recharge/orders - 充值订单列表
router.get('/orders', (req, res) => {
  const userId = req.user.id;
  const orders = db.prepare(`
    SELECT id, order_id, amount, status, created_at, completed_at
    FROM recharge_orders
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId);

  res.json({ data: orders });
});

// POST /api/recharge/create - 创建充值订单（预留）
router.post('/create', (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // 金额必须是整数或0.5的倍数（预留）
  const orderId = `recharge_${Date.now()}_${uuidv4().slice(0, 8)}`;

  const result = db.prepare(
    'INSERT INTO recharge_orders (user_id, order_id, amount, status) VALUES (?, ?, ?, ?)'
  ).run(userId, orderId, parseFloat(amount), 'pending');

  res.status(201).json({
    order_id: orderId,
    amount: parseFloat(amount),
    status: 'pending',
    // 预留支付链接，实际接入支付时填充
    pay_url: null,
    message: 'Order created. Payment integration pending.',
  });
});

// POST /api/recharge/callback - 支付回调（预留）
router.post('/callback', (req, res) => {
  // 实际接入支付时实现
  const { order_id, status } = req.body;

  if (status === 'completed') {
    const order = db.prepare('SELECT * FROM recharge_orders WHERE order_id = ? AND status = ?')
      .get(order_id, 'pending');

    if (order) {
      db.prepare('UPDATE recharge_orders SET status = ?, completed_at = datetime("now") WHERE id = ?')
        .run('completed', order.id);

      // 增加余额
      db.prepare('UPDATE users SET balance = balance + ?, updated_at = datetime("now") WHERE id = ?')
        .run(order.amount, order.user_id);

      // 记录余额变动
      const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(order.user_id);
      db.prepare(`
        INSERT INTO balance_logs (user_id, type, amount, balance_before, balance_after, remark)
        VALUES (?, 'recharge', ?, ?, ?, ?)
      `).run(order.user_id, order.amount, user.balance - order.amount, user.balance, `充值订单: ${order_id}`);

      return res.json({ message: 'ok' });
    }
  }

  res.json({ message: 'ignored' });
});

export default router;
