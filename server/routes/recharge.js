import express from 'express';
import { queryOne, queryAll, execute, saveDb } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { generateOrderId } from '../utils/key.js';

const router = express.Router();

const RECHARGE_PACKAGES = [
  { amount: 10, bonus: 0, label: '¥10' },
  { amount: 50, bonus: 2.5, label: '¥50 (送¥2.5)' },
  { amount: 100, bonus: 10, label: '¥100 (送¥10)' },
  { amount: 500, bonus: 75, label: '¥500 (送¥75)' },
  { amount: 1000, bonus: 200, label: '¥1000 (送¥200)' },
];

router.get('/packages', (req, res) => {
  res.json({ packages: RECHARGE_PACKAGES });
});

router.post('/orders', authMiddleware, (req, res) => {
  try {
    const { amount } = req.body;
    const pkg = RECHARGE_PACKAGES.find(p => p.amount === parseFloat(amount));

    if (!pkg) {
      return res.status(400).json({ error: '无效的充值金额' });
    }

    const orderId = generateOrderId();
    execute(
      'INSERT INTO recharge_orders (user_id, order_id, amount) VALUES (?, ?, ?)',
      [req.user.id, orderId, pkg.amount]
    );

    res.json({
      order_id: orderId,
      amount: pkg.amount,
      bonus: pkg.bonus,
      total: pkg.amount + pkg.bonus,
      status: 'pending',
      payment_url: null,
      message: '支付渠道对接中，请稍后'
    });
  } catch (err) {
    console.error('Create recharge order error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.post('/orders/:orderId/mock-callback', authMiddleware, (req, res) => {
  try {
    const { orderId } = req.params;

    const order = queryOne(
      'SELECT * FROM recharge_orders WHERE order_id = ? AND user_id = ?',
      [orderId, req.user.id]
    );

    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ error: '订单已处理' });
    }

    const pkg = RECHARGE_PACKAGES.find(p => p.amount === order.amount);
    const bonus = pkg?.bonus || 0;
    const total = order.amount + bonus;

    execute(
      "UPDATE recharge_orders SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE order_id = ?",
      [orderId]
    );

    const userBefore = queryOne('SELECT balance FROM users WHERE id = ?', [req.user.id]);
    execute('UPDATE users SET balance = balance + ? WHERE id = ?', [total, req.user.id]);
    const userAfter = queryOne('SELECT balance FROM users WHERE id = ?', [req.user.id]);

    execute(`
      INSERT INTO transactions (user_id, type, amount, balance_before, balance_after, description)
      VALUES (?, 'recharge', ?, ?, ?, ?)
    `, [req.user.id, total, userBefore.balance, userAfter.balance, `充值¥${order.amount}${bonus > 0 ? ` (送¥${bonus})` : ''}`]);

    saveDb();
    res.json({ message: '充值成功', balance: userAfter.balance });
  } catch (err) {
    console.error('Mock callback error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.get('/orders/:orderId', authMiddleware, (req, res) => {
  try {
    const { orderId } = req.params;
    const order = queryOne(
      'SELECT * FROM recharge_orders WHERE order_id = ? AND user_id = ?',
      [orderId, req.user.id]
    );
    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }
    res.json({ order });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
