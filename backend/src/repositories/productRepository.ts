import db from "../db/sqlite.js";
import type { Product } from "../types/index.js";

interface ProductRow {
  id: string; name: string; price: number; stock: number; image_url: string | null; created_at: string;
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id, name: row.name, price: row.price, stock: row.stock,
    imageUrl: row.image_url ?? undefined,
    createdAt: row.created_at,
  };
}

function nextId(): string {
  const { m } = db.prepare("SELECT COALESCE(MAX(CAST(SUBSTR(id,6) AS INTEGER)),0) as m FROM products").get() as { m: number };
  return `prod_${m + 1}`;
}

const stmts = {
  all:    db.prepare("SELECT * FROM products ORDER BY id"),
  byId:   db.prepare<[string]>("SELECT * FROM products WHERE id = ?"),
  insert: db.prepare("INSERT INTO products (id,name,price,stock,image_url,created_at) VALUES (?,?,?,?,?,?)"),
  update: db.prepare("UPDATE products SET name=?,price=?,stock=? WHERE id=?"),
  delete: db.prepare<[string]>("DELETE FROM products WHERE id=?"),
};

export const productRepository = {
  findAll(): Product[] {
    return (stmts.all.all() as ProductRow[]).map(toProduct);
  },

  findById(id: string): Product | undefined {
    const row = stmts.byId.get(id) as ProductRow | undefined;
    return row ? toProduct(row) : undefined;
  },

  create(data: { name: string; price: number; stock: number }): Product {
    const id = nextId();
    stmts.insert.run(id, data.name, data.price, data.stock, null, new Date().toISOString());
    return productRepository.findById(id)!;
  },

  update(id: string, data: Partial<{ name: string; price: number; stock: number }>): Product | undefined {
    const existing = productRepository.findById(id);
    if (!existing) return undefined;
    stmts.update.run(data.name ?? existing.name, data.price ?? existing.price, data.stock ?? existing.stock, id);
    return productRepository.findById(id)!;
  },

  delete(id: string): boolean {
    const result = stmts.delete.run(id);
    return result.changes > 0;
  },
};
