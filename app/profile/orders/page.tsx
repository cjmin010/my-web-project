'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderNumber: string;
  orderDate: string;
  total: number;
  items: OrderItem[];
  paymentStatus: '결제완료' | '결제대기' | '결제취소';
  shippingStatus: '배송준비중' | '배송중' | '배송완료' | '배송보류';
}

export default function OrderHistoryPage() {
  const { user, isLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      const ordersKey = `orders_${user.id}`;
      const storedOrders = localStorage.getItem(ordersKey);
      if (storedOrders) {
        // 최신 주문이 위로 오도록 정렬
        const parsedOrders: Order[] = JSON.parse(storedOrders);
        setOrders(parsedOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
      }
    }
  }, [user, isLoading, router]);

  const getStatusBadgeVariant = (status: Order['shippingStatus']) => {
    switch (status) {
      case '배송중':
        return 'default';
      case '배송완료':
        return 'secondary';
      case '배송보류':
        return 'destructive';
      case '배송준비중':
      default:
        return 'outline';
    }
  };

  if (isLoading || !user) {
    return <div className="container mx-auto px-4 py-8 text-center">주문 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Package className="mr-2 h-6 w-6" />
          주문 현황
        </h1>
        <Button asChild variant="outline">
          <Link href="/profile">내 정보로 돌아가기</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>내 주문 내역</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell">주문번호</TableHead>
                  <TableHead>주문일자</TableHead>
                  <TableHead>결제금액</TableHead>
                  <TableHead className="hidden sm:table-cell">결제상태</TableHead>
                  <TableHead>배송상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderNumber}>
                    <TableCell className="hidden sm:table-cell font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString('ko-KR')}</TableCell>
                    <TableCell>₩{order.total.toLocaleString()}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary">{order.paymentStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.shippingStatus)}>{order.shippingStatus}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>주문 내역이 없습니다.</p>
              <Button asChild className="mt-4">
                <Link href="/">쇼핑하러 가기</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 