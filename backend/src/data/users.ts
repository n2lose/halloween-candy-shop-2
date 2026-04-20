import bcrypt from "bcryptjs";
import { User } from "../types/index.js";

const seedPassword = process.env.SEED_USER_PASSWORD ?? "dev-seed-only";
const freddyHash = bcrypt.hashSync(seedPassword, 10);
const now = new Date().toISOString();

export const users: User[] = [
  { id: "usr_1", name: "Freddy", email: "freddy@halloween.shop", password: freddyHash, role: "customer", createdAt: now },
];

let nextNum = 2;

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email.toLowerCase());
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function addUser(name: string, email: string, hashedPassword: string): User {
  const user: User = { id: `usr_${nextNum++}`, name, email: email.toLowerCase(), password: hashedPassword, role: "customer", createdAt: new Date().toISOString() };
  users.push(user);
  return user;
}
