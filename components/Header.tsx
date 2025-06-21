"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Menu, Search, X } from "lucide-react";

interface HeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export default function Header({ searchTerm, setSearchTerm }: HeaderProps) {
    const { cart, updateQuantity, removeFromCart, cartTotal, cartItemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden mr-4">
                            <Menu />
                        </button>
                        <Link href="/" className="text-2xl font-bold text-gray-900">MINI 스토어</Link>
                    </div>
                    <nav className={`md:flex md:items-center md:space-x-8 ${isMenuOpen ? 'absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 p-4' : 'hidden'}`}>
                        <Link href="/info" className="text-gray-600 hover:text-gray-900">Info</Link>
                        <Link href="/" className="text-gray-600 hover:text-gray-900">Shop</Link>
                        <Link href="#" className="text-gray-600 hover:text-gray-900">About</Link>
                        <Link href="#" className="text-gray-600 hover:text-gray-900">Contact</Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <ShoppingCart />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Shopping Cart</SheetTitle>
                                </SheetHeader>
                                <div className="py-4">
                                    {cart.length === 0 ? (
                                        <p>Your cart is empty.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {cart.map(item => (
                                                <div key={item.id} className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-4">
                                                        <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md" />
                                                        <div>
                                                            <h4 className="font-semibold">{item.name}</h4>
                                                            <p className="text-sm text-gray-500">₩{item.price.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                            className="w-16 text-center"
                                                        />
                                                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <SheetFooter>
                                    <div className="w-full">
                                        <Separator className="my-4" />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span>₩{cartTotal.toLocaleString()}</span>
                                        </div>
                                        <Button className="w-full mt-4">Checkout</Button>
                                    </div>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
} 