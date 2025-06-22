'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingCart } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, isCartReady } = useCart();
  const router = useRouter();

  if (!isCartReady) {
    return <div className="container mx-auto px-4 py-8 text-center">장바구니 정보를 불러오는 중입니다...</div>;
  }

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">장바구니</h1>
      
      {cart.length === 0 ? (
        <Card className="text-center py-20">
          <CardContent>
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-600">장바구니가 비어 있습니다.</p>
            <p className="mt-2 text-gray-500">관심 있는 상품을 담아보세요!</p>
            <Button asChild className="mt-6">
              <Link href="/">쇼핑 계속하기</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <ul role="list" className="divide-y divide-gray-200">
                  {cart.map((product) => (
                    <li key={product.id} className="flex flex-col sm:flex-row p-4 sm:p-6">
                      <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden relative">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 flex flex-1 flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            <Link href={`/?productId=${product.id}`}>{product.name}</Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                          <p className="mt-2 text-lg font-bold text-gray-900">₩{product.price.toLocaleString()}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center justify-between">
                          <div className="flex items-center">
                            <label htmlFor={`quantity-${product.id}`} className="sr-only">
                              수량
                            </label>
                            <Input
                              id={`quantity-${product.id}`}
                              name={`quantity-${product.id}`}
                              type="number"
                              className="w-20"
                              min={1}
                              max={product.stock}
                              value={product.quantity}
                              onChange={(e) => updateQuantity(product.id, parseInt(e.target.value, 10))}
                            />
                             <p className="ml-3 text-sm text-gray-500">재고: {product.stock}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(product.id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">삭제</span>
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1 sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>상품 총액</span>
                  <span>₩{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>₩0</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span>₩{cartTotal.toLocaleString()}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Button className="w-full" onClick={handleCheckout}>
                  결제하기
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">쇼핑 계속하기</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 