import type { CartItem } from '../types/restaurant';

export const API_URL = import.meta.env.VITE_API_URL || '/api';

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type Order = {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  distanceKm: number;
  notes: string;
  paymentMethod: 'cod' | 'esewa';
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: { id: string; name: string; price: number; quantity: number; lineTotal: number }[];
};

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
}

export function createOrder(payload: { customerName: string; phone: string; address: string; distanceKm: number; notes: string; paymentMethod: string; items: CartItem[] }) {
  return request<{ orderId: number; total: number; message: string }>('/orders', { method: 'POST', body: JSON.stringify(payload) });
}

export function loginAdmin(email: string, password: string) {
  return request<{ token: string; admin: { id: number; email: string } }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function getOrders(token: string, status = '') {
  return request<Order[]>(`/orders?limit=200${status ? `&status=${encodeURIComponent(status)}` : ''}`, {}, token);
}

export function getStats(token: string) {
  return request<{ totalOrders: number; pendingOrders: number; activeOrders: number; grossSales: number }>('/dashboard/stats', {}, token);
}

export function updateOrderStatus(token: string, id: number, status: OrderStatus) {
  return request<{ message: string }>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token);
}

export function updatePaymentStatus(token: string, id: number, paymentStatus: PaymentStatus) {
  return request<{ message: string }>(`/orders/${id}/payment`, { method: 'PATCH', body: JSON.stringify({ paymentStatus }) }, token);
}
