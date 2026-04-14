/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
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

export function CartProvider({ children, userId }: { children: ReactNode; userId: string | null }) {
  const storageKey = userId ? `cart_${userId}` : null;

  const loadCart = (): CartItem[] => {
    if (!storageKey) return [];
    try { return JSON.parse(localStorage.getItem(storageKey) ?? "[]"); }
    catch { return []; }
  };

  const [items, setItems] = useState<CartItem[]>(loadCart);

  const save = useCallback((next: CartItem[]) => {
    setItems(next);
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
  }, [storageKey]);

  const addItem = (productId: string) => {
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      save(items.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      save([...items, { productId, quantity: 1 }]);
    }
  };

  const removeItem = (productId: string) =>
    save(items.filter((i) => i.productId !== productId));

  const updateQty = (productId: string, quantity: number) => {
    if (quantity < 1) return removeItem(productId);
    save(items.map((i) => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => save([]);

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
