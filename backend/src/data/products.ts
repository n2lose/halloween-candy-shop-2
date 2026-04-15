import { Product } from "../types/index.js";

export const products: Product[] = [
  { id: "prod_1",  name: "Pumpkin Spice Lollipop",    emoji: "🎃", price: 2.99, stock: 120 },
  { id: "prod_2",  name: "Witch Finger Gummy",         emoji: "🧙", price: 3.49, stock: 85  },
  { id: "prod_3",  name: "Skull Chocolate Bar",        emoji: "💀", price: 4.99, stock: 60  },
  { id: "prod_4",  name: "Spider Web Cotton Candy",    emoji: "🕸️", price: 1.99, stock: 200 },
  { id: "prod_5",  name: "Ghost Marshmallow",          emoji: "👻", price: 2.49, stock: 150 },
  { id: "prod_6",  name: "Cauldron Caramel Apple",     emoji: "🍎", price: 5.99, stock: 50  },
  { id: "prod_7",  name: "Vampire Fang Candy Corn",    emoji: "🧛", price: 1.99, stock: 180 },
  { id: "prod_8",  name: "Black Cat Licorice",         emoji: "🐱", price: 3.99, stock: 75  },
  { id: "prod_9",  name: "Frankenstein Fudge",         emoji: "🟩", price: 4.49, stock: 55  },
  { id: "prod_10", name: "Zombie Brain Gummy",         emoji: "🧠", price: 3.29, stock: 90  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function findProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
