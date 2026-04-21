/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "../types/index";

interface CartState {
  items: CartItem[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartState | null>(null);

function readCart(key: string | null): CartItem[] {
  if (!key) return [];
  try { return JSON.parse(localStorage.getItem(key) ?? "[]") as CartItem[]; }
  catch { return []; }
}

export function CartProvider({ children, userId }: { children: ReactNode; userId: string | null }) {
  const storageKey = useMemo(() => (userId ? `cart_${userId}` : null), [userId]);

  const [items, setItems] = useState<CartItem[]>(() => readCart(storageKey));

  // Reload cart whenever the user changes (login / logout)
  useEffect(() => {
    setItems(readCart(storageKey));
  }, [storageKey]);

  const save = useCallback((next: CartItem[]) => {
    setItems(next);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
  }, [storageKey]);

  const addItem = useCallback((productId: string) => {
    setItems(prev => {
      const existing = prev.find((i) => i.productId === productId);
      const next = existing
        ? prev.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { productId, quantity: 1 }];
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => {
      const next = prev.filter((i) => i.productId !== productId);
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, [storageKey]);

  const updateQty = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) { removeItem(productId); return; }
    setItems(prev => {
      const next = prev.map((i) => i.productId === productId ? { ...i, quantity } : i);
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }, [storageKey, removeItem]);

  const clearCart = useCallback(() => save([]), [save]);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      totalItems: items.reduce((s, i) => s + i.quantity, 0),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
