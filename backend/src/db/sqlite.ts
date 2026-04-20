import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH   = path.join(__dirname, "../../database.sqlite");

const db = new Database(DB_PATH);
db.exec("PRAGMA foreign_keys = ON");
db.exec("PRAGMA journal_mode = WAL");

// Create tables immediately so all module-level db.prepare() calls in
// repositories succeed regardless of ESM import order.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    role        TEXT CHECK(role IN ('admin','customer')) NOT NULL DEFAULT 'customer',
    created_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    price       REAL NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id                TEXT PRIMARY KEY,
    user_id           TEXT NOT NULL REFERENCES users(id),
    customer_name     TEXT NOT NULL,
    customer_email    TEXT NOT NULL,
    address           TEXT NOT NULL,
    total             REAL NOT NULL,
    status            TEXT NOT NULL DEFAULT 'processing',
    payment_intent_id TEXT UNIQUE NOT NULL,
    payment_last4     TEXT NOT NULL,
    created_at        TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id    TEXT NOT NULL REFERENCES orders(id),
    product_id  TEXT NOT NULL,
    name        TEXT NOT NULL,
    quantity    INTEGER NOT NULL,
    price       REAL NOT NULL
  );
`);

export default db;
