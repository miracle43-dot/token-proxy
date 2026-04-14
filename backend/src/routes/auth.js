import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import config from '../config.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const result = db.prepare(
      'INSERT INTO users (email, password_hash, balance) VALUES (?, ?, ?)'
    ).run(email, password_hash, 10); // 新用户送10元体验金

    // 记录初始余额变动
    db.prepare(`
      INSERT INTO balance_logs (user_id, type, amount, balance_before, balance_after, remark)
      VALUES (?, 'recharge', ?, 0, ?, '新用户注册赠送')
    `).run(result.lastInsertRowid, 10, 10);

    const token = jwt.sign({ userId: result.lastInsertRowid }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.status(201).json({
      token,
      user: { id: result.lastInsertRowid, email, balance: 10 },
    });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, balance: user.balance, is_admin: !!user.is_admin },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = auth.slice(7);
    const payload = jwt.verify(token, config.jwtSecret);
    const user = db.prepare('SELECT id, email, balance, is_admin, created_at FROM users WHERE id = ?')
      .get(payload.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: { ...user, is_admin: !!user.is_admin } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
