import express from 'express';
import bcrypt from 'bcryptjs';
import { queryOne, execute } from '../db/index.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }
    if (username.length < 3 || username.length > 32) {
      return res.status(400).json({ error: '用户名长度需在3-32个字符之间' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少6个字符' });
    }

    const existing = queryOne('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) {
      return res.status(409).json({ error: '用户名已存在' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = execute('INSERT INTO users (username, password_hash, balance) VALUES (?, ?, 0)', [username, passwordHash]);

    const user = { id: result.lastInsertRowid, username };
    const token = generateToken(user);

    res.json({ message: '注册成功', token, user: { id: user.id, username: user.username, balance: 0 } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const user = queryOne('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: { id: user.id, username: user.username, balance: user.balance }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
