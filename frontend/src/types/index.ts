// ─── Auth ────────────────────────────────────────────────────────────────────

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserProfile;
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus = "processing" | "shipped" | "delivered";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
}

export interface PaymentInfo {
  last4: string;
  status: string;
}

export interface Order {
  orderId: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderSummary {
  orderId: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminOrderSummary extends OrderSummary {
  customerName: string;
}

export interface PaginatedOrders<T extends OrderSummary = OrderSummary> {
  orders: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface StatsBlock {
  revenue: number;
  orders: number;
}

export interface SalesDataPoint {
  label: string;
  revenue: number;
}

export interface Bestseller {
  name: string;
  price: number;
  units_sold: number;
  revenue: number;
}

export interface DashboardData {
  stats: {
    today: StatsBlock;
    last_week: StatsBlock;
    last_month: StatsBlock;
  };
  sales_overview: {
    weekly: SalesDataPoint[];
    yearly: SalesDataPoint[];
  };
  bestsellers: Bestseller[];
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  quantity: number;
}
