import bcrypt from "bcryptjs";
import db from "./sqlite.js";

type Row = Record<string, unknown>;

function daysAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function monthsAgo(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(10);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

const PRODUCTS = [
  { id: "prod_1",  name: "Pumpkin Spice Lollipop",    price: 2.99, stock: 100, imageUrl: "https://images.unsplash.com/photo-1587822409291-ae8bc7239a6e?w=400&q=80" },
  { id: "prod_2",  name: "Witch Finger Gummy",         price: 3.49, stock: 85,  imageUrl: "https://images.unsplash.com/photo-1666595162324-df6f452108e7?w=400&q=80" },
  { id: "prod_3",  name: "Skull Chocolate Bar",        price: 4.99, stock: 60,  imageUrl: "https://images.unsplash.com/photo-1600231409360-e58ed635543a?w=400&q=80" },
  { id: "prod_4",  name: "Spider Web Cotton Candy",    price: 1.99, stock: 120, imageUrl: "https://images.unsplash.com/photo-1740135756200-edc70f515775?w=400&q=80" },
  { id: "prod_5",  name: "Ghost Marshmallow",          price: 2.49, stock: 90,  imageUrl: "https://images.unsplash.com/photo-1697546671079-d84c3fb37644?w=400&q=80" },
  { id: "prod_6",  name: "Cauldron Caramel Apple",     price: 5.99, stock: 45,  imageUrl: "https://images.unsplash.com/photo-1643450046169-4fe45bb5d29b?w=400&q=80" },
  { id: "prod_7",  name: "Vampire Fang Candy Corn",    price: 1.99, stock: 150, imageUrl: "https://images.unsplash.com/photo-1764570208257-f9a5fc9ed702?w=400&q=80" },
  { id: "prod_8",  name: "Black Cat Licorice",         price: 3.99, stock: 75,  imageUrl: "https://images.unsplash.com/photo-1682663754530-053de1dc5637?w=400&q=80" },
  { id: "prod_9",  name: "Frankenstein Fudge",         price: 4.49, stock: 55,  imageUrl: "https://images.unsplash.com/photo-1638258682206-0a95e15e4030?w=400&q=80" },
  { id: "prod_10", name: "Zombie Brain Gummy",         price: 3.29, stock: 80,  imageUrl: "https://images.unsplash.com/photo-1709651669999-57741c9bf085?w=400&q=80" },
];

interface SeedOrderItem { productId: string; quantity: number }
interface SeedOrder {
  id: string; paymentIntentId: string; status: string; createdAt: string;
  items: SeedOrderItem[];
}

function pad(n: number) { return String(n).padStart(4, "0"); }

const SEED_ORDERS: SeedOrder[] = [
  { id: `ORD-${pad(1)}`,  paymentIntentId: "pi_seed_001", status: "processing", createdAt: daysAgo(0, 8),  items: [{ productId: "prod_1", quantity: 3 }] },
  { id: `ORD-${pad(2)}`,  paymentIntentId: "pi_seed_002", status: "processing", createdAt: daysAgo(0, 9),  items: [{ productId: "prod_4", quantity: 5 }] },
  { id: `ORD-${pad(3)}`,  paymentIntentId: "pi_seed_003", status: "processing", createdAt: daysAgo(0, 10), items: [{ productId: "prod_3", quantity: 2 }] },
  { id: `ORD-${pad(4)}`,  paymentIntentId: "pi_seed_004", status: "processing", createdAt: daysAgo(0, 11), items: [{ productId: "prod_5", quantity: 4 }, { productId: "prod_7", quantity: 2 }] },
  { id: `ORD-${pad(5)}`,  paymentIntentId: "pi_seed_005", status: "processing", createdAt: daysAgo(0, 13), items: [{ productId: "prod_2", quantity: 3 }] },
  { id: `ORD-${pad(6)}`,  paymentIntentId: "pi_seed_006", status: "processing", createdAt: daysAgo(0, 14), items: [{ productId: "prod_9", quantity: 2 }] },
  { id: `ORD-${pad(7)}`,  paymentIntentId: "pi_seed_007", status: "processing", createdAt: daysAgo(1, 9),  items: [{ productId: "prod_1", quantity: 5 }] },
  { id: `ORD-${pad(8)}`,  paymentIntentId: "pi_seed_008", status: "shipped",    createdAt: daysAgo(1, 11), items: [{ productId: "prod_6", quantity: 2 }] },
  { id: `ORD-${pad(9)}`,  paymentIntentId: "pi_seed_009", status: "shipped",    createdAt: daysAgo(1, 14), items: [{ productId: "prod_10", quantity: 4 }] },
  { id: `ORD-${pad(10)}`, paymentIntentId: "pi_seed_010", status: "shipped",    createdAt: daysAgo(2, 10), items: [{ productId: "prod_4", quantity: 8 }] },
  { id: `ORD-${pad(11)}`, paymentIntentId: "pi_seed_011", status: "delivered",  createdAt: daysAgo(2, 15), items: [{ productId: "prod_3", quantity: 3 }] },
  { id: `ORD-${pad(12)}`, paymentIntentId: "pi_seed_012", status: "delivered",  createdAt: daysAgo(3, 9),  items: [{ productId: "prod_2", quantity: 4 }] },
  { id: `ORD-${pad(13)}`, paymentIntentId: "pi_seed_013", status: "delivered",  createdAt: daysAgo(4, 11), items: [{ productId: "prod_5", quantity: 6 }] },
  { id: `ORD-${pad(14)}`, paymentIntentId: "pi_seed_014", status: "delivered",  createdAt: daysAgo(5, 10), items: [{ productId: "prod_8", quantity: 3 }] },
  { id: `ORD-${pad(15)}`, paymentIntentId: "pi_seed_015", status: "delivered",  createdAt: daysAgo(6, 13), items: [{ productId: "prod_1", quantity: 6 }] },
  { id: `ORD-${pad(16)}`, paymentIntentId: "pi_seed_016", status: "delivered",  createdAt: monthsAgo(1),   items: [{ productId: "prod_6", quantity: 5 }] },
  { id: `ORD-${pad(17)}`, paymentIntentId: "pi_seed_017", status: "delivered",  createdAt: monthsAgo(1),   items: [{ productId: "prod_3", quantity: 4 }] },
  { id: `ORD-${pad(18)}`, paymentIntentId: "pi_seed_018", status: "delivered",  createdAt: monthsAgo(2),   items: [{ productId: "prod_9", quantity: 6 }] },
  { id: `ORD-${pad(19)}`, paymentIntentId: "pi_seed_019", status: "delivered",  createdAt: monthsAgo(2),   items: [{ productId: "prod_2", quantity: 5 }] },
  { id: `ORD-${pad(20)}`, paymentIntentId: "pi_seed_020", status: "delivered",  createdAt: monthsAgo(3),   items: [{ productId: "prod_10", quantity: 5 }] },
  { id: `ORD-${pad(21)}`, paymentIntentId: "pi_seed_021", status: "delivered",  createdAt: monthsAgo(3),   items: [{ productId: "prod_4", quantity: 10 }] },
  { id: `ORD-${pad(22)}`, paymentIntentId: "pi_seed_022", status: "delivered",  createdAt: monthsAgo(4),   items: [{ productId: "prod_5", quantity: 8 }] },
  { id: `ORD-${pad(23)}`, paymentIntentId: "pi_seed_023", status: "delivered",  createdAt: monthsAgo(5),   items: [{ productId: "prod_8", quantity: 4 }] },
  { id: `ORD-${pad(24)}`, paymentIntentId: "pi_seed_024", status: "delivered",  createdAt: monthsAgo(6),   items: [{ productId: "prod_1", quantity: 7 }] },
  { id: `ORD-${pad(25)}`, paymentIntentId: "pi_seed_025", status: "delivered",  createdAt: monthsAgo(7),   items: [{ productId: "prod_7", quantity: 8 }] },
  { id: `ORD-${pad(26)}`, paymentIntentId: "pi_seed_026", status: "delivered",  createdAt: monthsAgo(8),   items: [{ productId: "prod_6", quantity: 4 }] },
  { id: `ORD-${pad(27)}`, paymentIntentId: "pi_seed_027", status: "delivered",  createdAt: monthsAgo(9),   items: [{ productId: "prod_3", quantity: 3 }] },
  { id: `ORD-${pad(28)}`, paymentIntentId: "pi_seed_028", status: "delivered",  createdAt: monthsAgo(10),  items: [{ productId: "prod_2", quantity: 6 }] },
  { id: `ORD-${pad(29)}`, paymentIntentId: "pi_seed_029", status: "delivered",  createdAt: monthsAgo(11),  items: [{ productId: "prod_10", quantity: 4 }] },
  { id: `ORD-${pad(30)}`, paymentIntentId: "pi_seed_030", status: "delivered",  createdAt: monthsAgo(12),  items: [{ productId: "prod_5", quantity: 9 }] },
];

const insertUser    = db.prepare("INSERT INTO users (id,name,email,password,role,created_at) VALUES (?,?,?,?,?,?)");
const insertProduct = db.prepare("INSERT INTO products (id,name,price,stock,image_url,created_at) VALUES (?,?,?,?,?,?)");
const insertOrder   = db.prepare("INSERT INTO orders (id,user_id,customer_name,customer_email,address,total,status,payment_intent_id,payment_last4,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)");
const insertItem    = db.prepare("INSERT INTO order_items (order_id,product_id,name,quantity,price) VALUES (?,?,?,?,?)");

const seedAll = db.transaction(() => {
  // gitguard-ignore
  const adminHash    = bcrypt.hashSync("Halloween2024!", 10);
  const customerHash = bcrypt.hashSync(process.env.SEED_USER_PASSWORD ?? "dev-seed-only", 10);
  const now          = new Date().toISOString();

  insertUser.run("usr_1", "Admin",  "admin@halloween.shop",  adminHash,    "admin",    now);
  insertUser.run("usr_2", "Freddy", "freddy@halloween.shop", customerHash, "customer", now);

  for (const p of PRODUCTS) {
    insertProduct.run(p.id, p.name, p.price, p.stock, p.imageUrl ?? null, now);
  }

  const productMap = new Map(PRODUCTS.map((p) => [p.id, p]));

  for (const o of SEED_ORDERS) {
    const total = Math.round(
      o.items.reduce((sum, item) => {
        const p = productMap.get(item.productId)!;
        return sum + p.price * item.quantity;
      }, 0) * 100
    ) / 100;

    insertOrder.run(o.id, "usr_2", "Freddy", "freddy@halloween.shop", "13 Elm St, Springfield", total, o.status, o.paymentIntentId, "4242", o.createdAt);

    for (const item of o.items) {
      const p = productMap.get(item.productId)!;
      insertItem.run(o.id, item.productId, p.name, item.quantity, p.price);
    }
  }
});

export function seedDb(): void {
  const { c } = db.prepare("SELECT COUNT(*) as c FROM users").get() as Row;
  if ((c as number) > 0) return;
  seedAll();
}
