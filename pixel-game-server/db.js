const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'quiz.db');

// 確保 data 目錄存在
const fs = require('fs');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// 啟用 WAL 模式（提高併發效能）
db.pragma('journal_mode = WAL');

// 建立資料表
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    answer TEXT NOT NULL CHECK(answer IN ('A','B','C','D'))
  );

  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    attempts INTEGER DEFAULT 0,
    last_score INTEGER DEFAULT 0,
    high_score INTEGER DEFAULT 0,
    first_pass_score INTEGER,
    pass_attempts INTEGER,
    last_played_at TEXT
  );
`);

module.exports = db;
