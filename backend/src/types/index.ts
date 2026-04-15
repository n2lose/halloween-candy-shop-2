// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface AccessTokenPayload {
  sub: number;
  email: string;
  name: string;
}

export interface RefreshTokenPayload {
  sub: number;
  type: "refresh";
}

// ─── Products ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  emoji: string;
  price: number;
  stock: number;
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
  status: "succeeded";
}

export interface Order {
  orderId: string;
  userId: number;
  items: OrderItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
  total: number;
  status: OrderStatus;
  createdAt: string;
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

export interface DashboardResponse {
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

// ─── API Request / Response shapes ───────────────────────────────────────────

export interface PaginatedOrdersResponse {
  orders: Array<{
    orderId: string;
    total: number;
    status: OrderStatus;
    createdAt: string;
  }>;
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CreatePaymentIntentRequest {
  items: Array<{ productId: string; quantity: number }>;
}

export interface CreateOrderRequest {
  paymentIntentId: string;
  customer: ShippingInfo;
  items: Array<{ productId: string; quantity: number }>;
}
