import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'anime-tracking.db');

// Ensure the database directory exists (handles edge cases on first run)
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Singleton connection — better-sqlite3 is synchronous; one connection is sufficient
export const db = new Database(dbPath);

// WAL mode: better concurrent reads; safe for single-writer local apps
db.pragma('journal_mode = WAL');
// Foreign key enforcement (OFF by default in SQLite, must be set per connection)
db.pragma('foreign_keys = ON');

// Auto-initialize schema on first run when the database file is new/empty
const tableExists = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='user_library'")
  .get();

if (!tableExists) {
  console.log('[db] Initializing SQLite schema from schema-sqlite.sql...');
  const schemaPath = path.resolve(process.cwd(), 'schema-sqlite.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    console.log('[db] Schema initialized successfully.');
  } else {
    console.warn(`[db] Schema file not found at ${schemaPath}. Tables might be missing!`);
  }
}

// ---------------------------------------------------------------------------
// Auto-migration: add is_favorite column on existing databases
// Runs every time the app starts — safe to re-run (idempotent check)
// ---------------------------------------------------------------------------
const columns = db.prepare("PRAGMA table_info(user_library)").all() as Array<{ name: string }>;
const hasFavoriteColumn = columns.some(col => col.name === 'is_favorite');

if (!hasFavoriteColumn) {
  db.exec(`ALTER TABLE user_library ADD COLUMN is_favorite INTEGER NOT NULL DEFAULT 0 CHECK (is_favorite IN (0, 1))`);
  console.log('[db] Migration applied: added is_favorite column');
}
