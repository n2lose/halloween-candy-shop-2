import client from "./client";
import type { TokenPair, UserProfile } from "../types/index";

export const register = (data: { name: string; email: string; password: string }) =>
  client.post<TokenPair>("/auth/register", data);

export const login = (data: { email: string; password: string }) =>
  client.post<TokenPair>("/auth/login", data);

export const getMe = () =>
  client.get<UserProfile>("/auth/me");
