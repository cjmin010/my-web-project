"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Product } from '@/data/products';

export type CartItem = Product & { quantity: number };

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  cartTotal: number;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prevCart =>
      prevCart
        .map(item => (item.id === productId ? { ...item, quantity } : item))
        .filter(item => item.quantity > 0)
    );
  };
  
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const cartTotal = useMemo(() =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );
  
  const cartItemCount = useMemo(() =>
      cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 