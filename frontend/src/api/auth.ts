import client from "./client";
import type { AuthResponse, UserProfile } from "../types/index";

export const register = (data: { name: string; email: string; password: string }) =>
  client.post<AuthResponse>("/auth/register", data);

export const login = (data: { email: string; password: string }) =>
  client.post<AuthResponse>("/auth/login", data);

export const getMe = () =>
  client.get<UserProfile>("/auth/me");
