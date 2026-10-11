import type { Order } from "@/types";

// Order storage using localStorage.

const ORDERS_KEY = "shizuka.orders";

export function getOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]') || [];
  } catch {
    return [];
  }
}

export function addOrder(order: Order): Order {
  const orders = getOrders();
  orders.unshift(order);
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
  return order;
}

export function getLatestOrder(): Order | null {
  return getOrders()[0] || null;
}

