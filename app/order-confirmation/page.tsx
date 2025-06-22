'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface LastOrder {
  orderNumber: string;
  orderDate: string;
  total: number;
  items: OrderItem[];
  shippingInfo: {
    name: string;
    address: string;
    addressDetail: string;
    zipCode: string;
    phone: string;
  };
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
      // 보안을 위해 한 번 사용한 주문 정보는 삭제하는 것을 고려할 수 있습니다.
      // localStorage.removeItem('lastOrder'); 
    } else {
      // 주문 정보가 없으면 홈페이지로 리디렉션
      router.push('/');
    }
  }, [router]);

  if (!order) {
    return <div className="container mx-auto px-4 py-8 text-center">주문 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center bg-green-600 text-white rounded-t-lg py-8">
          <CheckCircle2 className="mx-auto h-16 w-16" />
          <CardTitle className="mt-4 text-3xl">주문이 성공적으로 완료되었습니다!</CardTitle>
          <p className="mt-2 text-green-100">주문해주셔서 감사합니다.</p>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-6">
            <div className="pb-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">주문 요약</h3>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>주문 번호:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>주문 일자:</span>
                  <span className="font-medium">{new Date(order.orderDate).toLocaleString('ko-KR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">총 결제 금액:</span>
                  <span className="font-bold text-lg text-gray-900">₩{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">주문 상품</h3>
              <ul className="mt-4 divide-y divide-gray-200 border-b">
                {order.items.map((item) => (
                  <li key={item.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">수량: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₩{(item.price * item.quantity).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">배송 정보</h3>
              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">받는 분:</span> {order.shippingInfo.name}</p>
                <p><span className="font-medium">연락처:</span> {order.shippingInfo.phone}</p>
                <p><span className="font-medium">주소:</span> ({order.shippingInfo.zipCode}) {order.shippingInfo.address} {order.shippingInfo.addressDetail}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-center">
            <Button asChild>
              <Link href="/">쇼핑 계속하기</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 