import client from "./client";
import type { DashboardData } from "../types/index";

export const getDashboard = () =>
  client.get<DashboardData>("/dashboard");
