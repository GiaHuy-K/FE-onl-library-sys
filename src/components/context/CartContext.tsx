/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';


const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (book: any) => {
    if (cart.find(item => item.bookId === book.bookId)) {
      message.warning("Cuốn này có trong danh sách rồi nè!");
      return;
    }
    if (cart.length >= 3) {
      message.error("Tối đa 3 cuốn thôi anh Huy ơi!");
      return;
    }
    setCart([...cart, book]);
    message.success(`Đã thêm "${book.title}" vào phiếu mượn`);
  };

  const removeFromCart = (bookId: number) => {
    setCart(cart.filter(item => item.bookId !== bookId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};