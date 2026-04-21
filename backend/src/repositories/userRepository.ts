import db from "../db/sqlite.js";
import type { User } from "../types/index.js";

interface UserRow {
  id: string; name: string; email: string;
  password: string; role: string; created_at: string;
}

function toUser(row: UserRow): User {
  return { id: row.id, name: row.name, email: row.email, password: row.password, role: row.role as User["role"], createdAt: row.created_at };
}

function nextId(): string {
  const { m } = db.prepare("SELECT COALESCE(MAX(CAST(SUBSTR(id,5) AS INTEGER)),0) as m FROM users").get() as { m: number };
  return `usr_${m + 1}`;
}

const stmts = {
  byEmail: db.prepare<[string]>("SELECT * FROM users WHERE email = ?"),
  byId:    db.prepare<[string]>("SELECT * FROM users WHERE id = ?"),
  insert:  db.prepare("INSERT INTO users (id,name,email,password,role,created_at) VALUES (?,?,?,?,?,?)"),
};

export const userRepository = {
  findByEmail(email: string): User | undefined {
    const row = stmts.byEmail.get(email) as UserRow | undefined;
    return row ? toUser(row) : undefined;
  },

  findById(id: string): User | undefined {
    const row = stmts.byId.get(id) as UserRow | undefined;
    return row ? toUser(row) : undefined;
  },

  create(data: { name: string; email: string; password: string; role?: User["role"] }): User {
    const id = nextId();
    const now = new Date().toISOString();
    stmts.insert.run(id, data.name, data.email, data.password, data.role ?? "customer", now);
    return userRepository.findById(id)!;
  },
};
