import bcrypt from "bcryptjs";
import { User } from "../types/index.js";

const seedPassword = process.env.SEED_USER_PASSWORD ?? "dev-seed-only";
const freddyHash = bcrypt.hashSync(seedPassword, 10);

export const users: User[] = [
  { id: 1, name: "Freddy", email: "freddy@halloween.shop", password: freddyHash },
];

let nextId = 2;

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email.toLowerCase());
}

export function findUserById(id: number): User | undefined {
  return users.find((u) => u.id === id);
}

export function addUser(name: string, email: string, hashedPassword: string): User {
  const user: User = { id: nextId++, name, email: email.toLowerCase(), password: hashedPassword };
  users.push(user);
  return user;
}
