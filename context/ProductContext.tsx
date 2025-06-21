"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { products as initialProducts, Product } from '@/data/products';

interface ProductContextType {
  products: Product[];
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    setProducts(prevProducts => [
      ...prevProducts,
      { ...newProduct, id: Math.max(...prevProducts.map(p => p.id)) + 1, stock: newProduct.stock || 10 },
    ]);
  };

  const deleteProduct = (productId: number) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, updateProduct, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}; 