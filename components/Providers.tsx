'use client';

import React from 'react';
import { UserProvider } from '@/context/UserContext';
import { ProductProvider } from '@/context/ProductContext';
import { CartProvider } from '@/context/CartContext';
import { AudioProvider } from '@/context/AudioContext';
import PageTracker from '@/components/PageTracker';
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';
import { AudioPlayer } from '@/components/AudioPlayer';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <PageTracker />
      <AudioProvider>
        <ProductProvider>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <AudioPlayer />
          </CartProvider>
        </ProductProvider>
      </AudioProvider>
    </UserProvider>
  );
} 