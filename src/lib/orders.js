// Order storage using localStorage.

const ORDERS_KEY = "shizuka.orders";

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function addOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
  return order;
}

export function getLatestOrder() {
  return getOrders()[0] || null;
}