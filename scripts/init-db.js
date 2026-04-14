/**
 * 数据库初始化脚本
 * 运行: cd backend && npm run init-db
 */
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'backend', 'data', 'token-proxy.db');

console.log('Initializing database at:', dbPath);

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// 建表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    balance REAL DEFAULT 0,
    is_admin INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    key TEXT UNIQUE NOT NULL,
    name TEXT DEFAULT '',
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS usage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    api_key_id INTEGER NOT NULL,
    model TEXT NOT NULL,
    prompt_tokens INTEGER DEFAULT 0,
    completion_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    cost REAL DEFAULT 0,
    latency_ms INTEGER DEFAULT 0,
    request_time TEXT DEFAULT (datetime('now')),
    request_body TEXT,
    response_status INTEGER DEFAULT 200,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    input_price REAL NOT NULL,
    output_price REAL NOT NULL,
    enabled INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS balance_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL,
    balance_before REAL NOT NULL,
    balance_after REAL NOT NULL,
    remark TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS recharge_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_id TEXT UNIQUE NOT NULL,
    amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// 插入模型配置
const models = [
  { model_id: 'gpt-4o',           name: 'GPT-4o',            provider: 'openai',   input_price: 10,   output_price: 30,   sort_order: 1 },
  { model_id: 'gpt-4o-mini',      name: 'GPT-4o Mini',      provider: 'openai',   input_price: 1.5,  output_price: 6,    sort_order: 2 },
  { model_id: 'gpt-4-turbo',      name: 'GPT-4 Turbo',      provider: 'openai',   input_price: 30,   output_price: 90,   sort_order: 3 },
  { model_id: 'gpt-3.5-turbo',    name: 'GPT-3.5 Turbo',    provider: 'openai',   input_price: 0.5,  output_price: 1.5,  sort_order: 4 },
  { model_id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', input_price: 7,   output_price: 21,   sort_order: 5 },
  { model_id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'anthropic', input_price: 0.8,  output_price: 4,    sort_order: 6 },
  { model_id: 'gemini-1.5-pro',   name: 'Gemini 1.5 Pro',   provider: 'google',   input_price: 5,    output_price: 15,   sort_order: 7 },
  { model_id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'google',   input_price: 0.25, output_price: 0.75, sort_order: 8 },
];

const insertModel = db.prepare(`
  INSERT OR IGNORE INTO models (model_id, name, provider, input_price, output_price, sort_order)
  VALUES (@model_id, @name, @provider, @input_price, @output_price, @sort_order)
`);

for (const m of models) insertModel.run(m);

// 创建测试用户
const existingAdmin = db.prepare("SELECT id FROM users WHERE email = 'admin@tokenproxy.local'").get();
if (!existingAdmin) {
  const hash = bcrypt.hashSync('admin123', 12);
  db.prepare("INSERT INTO users (email, password_hash, balance, is_admin) VALUES (?, ?, ?, 1)")
    .run('admin@tokenproxy.local', hash, 1000);
  console.log('Admin user created: admin@tokenproxy.local / admin123');
}

console.log('Database initialized successfully!');
console.log('Models seeded:', models.length);

db.close();
