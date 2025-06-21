"use client"

import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from "@/context/ProductContext";
import Header from '@/components/layout/Header';
import Footer from '@/components/Footer';
import { AudioPlayer } from '@/components/AudioPlayer';
import { AudioProvider } from '@/context/AudioContext';

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Modern E-Commerce",
//   description: "A modern e-commerce website built with Next.js and Shadcn/UI",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} pb-28`}>
        <AudioProvider>
          <ProductProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <AudioPlayer />
            </CartProvider>
          </ProductProvider>
        </AudioProvider>
      </body>
    </html>
  );
} 