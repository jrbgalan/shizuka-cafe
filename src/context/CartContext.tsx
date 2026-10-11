import React, { createContext, useContext, useMemo, useState, useEffect, useCallback, ReactNode } from "react";
import { promoCodes } from "@/data/site";
import type { Product, CartItem } from "@/types";

export type CartLineItem = CartItem;

export interface AppliedPromo {
  code: string;
  discount: number;
  label?: string;
  description?: string;
  [key: string]: unknown;
}

export interface AddItemOptions {
  grind?: string;
  size?: string;
  qty?: number;
  price?: number;
}

export interface CartContextValue {
  items: CartLineItem[];
  addItem: (product: Partial<Product> & { id: string; name: string; price: number }, options?: AddItemOptions) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  count: number;
  promo: AppliedPromo | null;
  applyPromo: (code: string) => { ok: boolean; label: string };
  removePromo: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "shizuka.cart";
const WISH_KEY = "shizuka.wishlist";
const PROMO_KEY = "shizuka.promo";

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartLineItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(WISH_KEY) || '[]'); } catch { return []; }
  });
  const [promo, setPromo] = useState<AppliedPromo | null>(() => {
    try { return JSON.parse(localStorage.getItem(PROMO_KEY) || 'null'); } catch { return null; }
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* ignore */ } }, [items]);
  useEffect(() => { try { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); } catch { /* ignore */ } }, [wishlist]);
  useEffect(() => { try { localStorage.setItem(PROMO_KEY, JSON.stringify(promo)); } catch { /* ignore */ } }, [promo]);

  const lineKey = (item: { id: string; grind?: string; size?: string }) => `${item.id}|${item.grind || "Whole Bean"}|${item.size || "250g"}`;

  const addItem = useCallback((product: Partial<Product> & { id: string; name: string; price: number }, { grind = "Whole Bean", size = "250g", qty = 1, price }: AddItemOptions = {}) => {
    const key = lineKey({ id: product.id, grind, size });
    setItems((prev) => {
      const existing = prev.find((i) => lineKey(i) === key);
      if (existing) {
        return prev.map((i) => (lineKey(i) === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          jp: product.jp,
          price: price ?? product.price,
          grind,
          size,
          qty,
          imageLabel: product.imageLabel
        }
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => lineKey(i) !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) => (lineKey(i) === key ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => { setItems([]); setPromo(null); }, []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const discount = useMemo(() => (promo ? Math.round(subtotal * promo.discount) : 0), [promo, subtotal]);
  const shipping = useMemo(() => (subtotal === 0 || subtotal - discount >= 1500 ? 0 : 120), [subtotal, discount]);
  const total = useMemo(() => Math.max(0, subtotal - discount) + shipping, [subtotal, discount, shipping]);

  const applyPromo = useCallback((code: string) => {
    const found = (promoCodes as Record<string, { discount: number; label: string }>)[code.toUpperCase()];
    if (found) { setPromo({ code: code.toUpperCase(), ...found }); return { ok: true, label: found.label }; }
    return { ok: false, label: "That code isn't recognised." };
  }, []);

  const removePromo = useCallback(() => setPromo(null), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }, []);
  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const value = useMemo<CartContextValue>(
    () => ({
      items, addItem, removeItem, updateQty, clear,
      subtotal, discount, shipping, total, count,
      promo, applyPromo, removePromo,
      wishlist, toggleWishlist, isWishlisted,
      isOpen, setIsOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false)
    }),
    [items, subtotal, discount, shipping, total, count, promo, wishlist, isOpen, addItem, removeItem, updateQty, clear, applyPromo, removePromo, toggleWishlist, isWishlisted]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
