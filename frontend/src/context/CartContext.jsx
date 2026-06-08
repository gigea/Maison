import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, size, color, qty = 1) => {
    setItems(prev => {
      const key = `${product._id}-${size}-${color}`;
      const existing = prev.find(i => i.key === key);
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key, product, size, color, qty }];
    });
  }, []);

  const removeItem  = useCallback((key) => setItems(prev => prev.filter(i => i.key !== key)), []);
  const updateQty   = useCallback((key, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  }, []);
  const clearCart   = useCallback(() => setItems([]), []);

  const totalItems  = items.reduce((s, i) => s + i.qty, 0);
  const subtotal    = items.reduce((s, i) => s + (i.product.salePrice || i.product.price) * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
