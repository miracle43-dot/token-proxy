import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'token_proxy.db');

import initSqlJs from 'sql.js';
let db = null;

async function initSql() {
  if (db) return;
  await initSqlJs({ locateFile: f => new URL(`../node_modules/sql.js/dist/${f}`, import.meta.url).href });
}

// 同步初始化（启动时调用）
async function initDatabase() {
  const SQL = await initSqlJs({ locateFile: f => new URL(`../node_modules/sql.js/dist/${f}`, import.meta.url).href });

  if (existsSync(DB_PATH)) {
    try {
      const buffer = readFileSync(DB_PATH);
      db = new SQL.Database(buffer);
      console.log('✓ Loaded DB from', DB_PATH);
    } catch (e) {
      console.warn('  Creating new DB:', e.message);
      db = new SQL.Database();
    }
  } else {
    db = new SQL.Database();
    console.log('✓ Created new DB at', DB_PATH);
  }

  // 建表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      key TEXT UNIQUE NOT NULL,
      name TEXT DEFAULT 'Default Key',
      balance REAL DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS usage_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      api_key_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      model TEXT NOT NULL,
      input_tokens INTEGER DEFAULT 0,
      output_tokens INTEGER DEFAULT 0,
      cost REAL DEFAULT 0,
      endpoint TEXT NOT NULL,
      request_time INTEGER NOT NULL,
      response_time INTEGER NOT NULL,
      status_code INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      balance_before REAL NOT NULL,
      balance_after REAL NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS recharge_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      order_id TEXT UNIQUE NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  try {
    const data = db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
  } catch (e) {
    console.error('  Failed to save DB:', e.message);
  }
}

// 同步查询（sql.js API）
function queryAll(sql, params = []) {
  if (!db) throw new Error('Database not initialized');
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results[0] || null;
}

function execute(sql, params = []) {
  if (!db) throw new Error('Database not initialized');
  db.run(sql, params);
  const lastIdResult = db.exec('SELECT last_insert_rowid() as id');
  const lastId = lastIdResult[0]?.values[0]?.[0] ?? 0;
  const changes = db.getRowsModified();
  saveDb();
  return { lastInsertRowid: lastId, changes };
}

export { initDatabase, queryAll, queryOne, execute, saveDb, db as getDb };
export default { initDatabase, queryAll, queryOne, execute, saveDb };
