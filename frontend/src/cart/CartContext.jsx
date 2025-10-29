import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cart`);
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();
      setCart(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, qty = 1) => {
    const res = await fetch(`/api/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty })
    });
    if (!res.ok) throw new Error("Failed to add to cart");
    const data = await res.json();
    setCart(data);
  }, []);

  const updateQty = useCallback(async (productId, qty) => {
    const res = await fetch(`/api/cart/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qty })
    });
    if (!res.ok) throw new Error("Failed to update item");
    setCart(await res.json());
  }, []);

  const removeFromCart = useCallback(async (productId) => {
    const res = await fetch(`/api/cart/${productId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to remove item");
    setCart(await res.json());
  }, []);

  const value = useMemo(() => ({ cart, loading, error, fetchCart, addToCart, updateQty, removeFromCart }), [cart, loading, error, fetchCart, addToCart, updateQty, removeFromCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


