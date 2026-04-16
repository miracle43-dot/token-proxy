import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'data', 'token-proxy.db');

export const db = new Database(dbPath);

// 启用外键
db.pragma('foreign_keys = ON');

export function initDB() {
  // 创建版本跟踪表（如果不存在）
  db.exec(`
    CREATE TABLE IF NOT EXISTS _schema_version (
      version INTEGER PRIMARY KEY,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // 获取当前版本
  const row = db.prepare('SELECT MAX(version) as v FROM _schema_version').get();
  const currentVersion = row?.v || 0;

  const migrations = [
    // v1: 初始完整 schema
    () => db.exec(`
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
        sub_key_id INTEGER,
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

      CREATE INDEX IF NOT EXISTS idx_usage_user ON usage_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_usage_time ON usage_logs(request_time);
      CREATE INDEX IF NOT EXISTS idx_apikeys_user ON api_keys(user_id);
      CREATE INDEX IF NOT EXISTS idx_apikeys_key ON api_keys(key);
      CREATE INDEX IF NOT EXISTS idx_balance_user ON balance_logs(user_id);
    `),

    // v2: sub_keys 表
    () => db.exec(`
      CREATE TABLE IF NOT EXISTS sub_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_key_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        sub_key TEXT UNIQUE NOT NULL,
        name TEXT DEFAULT '',
        quota_limit REAL DEFAULT 0,
        quota_used REAL DEFAULT 0,
        allowed_models TEXT DEFAULT '[]',
        status TEXT DEFAULT 'active',
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (parent_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_subkeys_key ON sub_keys(sub_key);
      CREATE INDEX IF NOT EXISTS idx_subkeys_parent ON sub_keys(parent_key_id);
      CREATE INDEX IF NOT EXISTS idx_subkeys_user ON sub_keys(user_id);
    `),

    // v3: usage_logs 新增 sub_key_id 列（兼容已存在的表）
    () => {
      try {
        db.exec('ALTER TABLE usage_logs ADD COLUMN sub_key_id INTEGER');
      } catch (e) {
        // 列已存在，忽略
      }
    },
  ];

  for (let v = currentVersion + 1; v <= migrations.length; v++) {
    migrations[v - 1]();
    db.prepare('INSERT INTO _schema_version (version) VALUES (?)').run(v);
  }
}

export default db;
