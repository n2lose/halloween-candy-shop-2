import { Product } from "../types/index.js";

const now = new Date().toISOString();

export const products: Product[] = [
  { id: "prod_1",  name: "Pumpkin Spice Lollipop",    price: 2.99, stock: 120, createdAt: now },
  { id: "prod_2",  name: "Witch Finger Gummy",         price: 3.49, stock: 85,  createdAt: now },
  { id: "prod_3",  name: "Skull Chocolate Bar",        price: 4.99, stock: 60,  createdAt: now },
  { id: "prod_4",  name: "Spider Web Cotton Candy",    price: 1.99, stock: 200, createdAt: now },
  { id: "prod_5",  name: "Ghost Marshmallow",          price: 2.49, stock: 150, createdAt: now },
  { id: "prod_6",  name: "Cauldron Caramel Apple",     price: 5.99, stock: 50,  createdAt: now },
  { id: "prod_7",  name: "Vampire Fang Candy Corn",    price: 1.99, stock: 180, createdAt: now },
  { id: "prod_8",  name: "Black Cat Licorice",         price: 3.99, stock: 75,  createdAt: now },
  { id: "prod_9",  name: "Frankenstein Fudge",         price: 4.49, stock: 55,  createdAt: now },
  { id: "prod_10", name: "Zombie Brain Gummy",         price: 3.29, stock: 90,  createdAt: now },
];

export function getAllProducts(): Product[] {
  return products;
}

export function findProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
