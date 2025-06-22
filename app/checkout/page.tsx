'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from 'lucide-react';

declare global {
  interface Window {
    daum: any;
  }
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, isCartReady } = useCart();
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    addressDetail: '',
    zipCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [orderProcessing, setOrderProcessing] = useState(false);

  const handleSearchPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function(data: any) {
        setShippingInfo(prev => ({
          ...prev,
          zipCode: data.zonecode,
          address: data.roadAddress || data.jibunAddress,
        }));
        // 상세 주소 필드로 포커스 이동
        document.getElementById('addressDetail')?.focus();
      }
    }).open();
  };

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
    if (user) {
      setShippingInfo({
        name: user.name,
        address: user.address,
        addressDetail: user.addressDetail,
        zipCode: user.zipCode,
        phone: user.phone,
      });
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (isCartReady && cart.length === 0 && !orderProcessing) {
      alert("장바구니가 비어있어 결제를 진행할 수 없습니다. 메인 페이지로 이동합니다.");
      router.push('/');
    }
  }, [isCartReady, cart, router, orderProcessing]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [id]: value }));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    setOrderProcessing(true);
    // 주문 처리 로직 (여기서는 시뮬레이션)
    console.log('Order placed:', {
      user: user?.id,
      shippingInfo,
      items: cart,
      total: cartTotal,
      paymentMethod,
    });
    
    // 주문 정보를 localStorage에 저장 (주문 완료 페이지에서 사용)
    const newOrder = {
      shippingInfo: {
        name: shippingInfo.name,
        address: shippingInfo.address,
        addressDetail: shippingInfo.addressDetail,
        zipCode: shippingInfo.zipCode,
        phone: shippingInfo.phone,
      },
      items: cart,
      total: cartTotal,
      paymentMethod,
      orderDate: new Date().toISOString(),
      orderNumber: `MINI-${Date.now()}`,
      paymentStatus: '결제완료',
      shippingStatus: '배송준비중',
    };

    // 마지막 주문 정보 저장 (주문 완료 페이지용)
    localStorage.setItem('lastOrder', JSON.stringify(newOrder));

    // 사용자별 주문 내역 저장
    if (user) {
      const ordersKey = `orders_${user.id}`;
      const existingOrdersJSON = localStorage.getItem(ordersKey);
      const existingOrders = existingOrdersJSON ? JSON.parse(existingOrdersJSON) : [];
      existingOrders.push(newOrder);
      localStorage.setItem(ordersKey, JSON.stringify(existingOrders));
    }

    clearCart();
    router.push('/order-confirmation');
  };

  if (isUserLoading || !isCartReady || !user) {
    return <div className="container mx-auto px-4 py-8 text-center">결제 정보를 준비 중입니다...</div>;
  }
  
  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">결제하기</h1>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로가기
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {/* 배송지 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>배송지 정보</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <Label htmlFor="name">받는 분</Label>
                  <Input id="name" value={shippingInfo.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="zipCode">우편번호</Label>
                  <div className="flex gap-2">
                    <Input id="zipCode" value={shippingInfo.zipCode} readOnly placeholder="검색 버튼을 눌러주세요"/>
                    <Button type="button" variant="outline" onClick={handleSearchPostcode}>우편번호 검색</Button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">주소</Label>
                  <Input id="address" value={shippingInfo.address} readOnly />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="addressDetail">상세주소</Label>
                  <Input id="addressDetail" value={shippingInfo.addressDetail} onChange={handleInputChange} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input id="phone" value={shippingInfo.phone} onChange={handleInputChange} />
                </div>
              </CardContent>
            </Card>
            
            {/* 결제 수단 */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>결제 수단</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card">신용/체크카드</Label>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">간편하고 빠른 결제</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer">무통장 입금</Label>
                    </div>
                     <p className="text-sm text-gray-500 ml-6">주문 완료 후 입금 계좌 안내</p>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile-payment" id="mobile-payment" />
                      <Label htmlFor="mobile-payment">휴대폰 결제</Label>
                    </div>
                     <p className="text-sm text-gray-500 ml-6">통신사 정책에 따라 한도 제한</p>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>최종 결제 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-200">
                  {cart.map(item => (
                    <li key={item.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">수량: {item.quantity}</p>
                      </div>
                      <p className="font-medium">₩{(item.price * item.quantity).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>상품 총액</span>
                    <span>₩{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>₩0</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>총 결제 금액</span>
                    <span>₩{cartTotal.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handlePlaceOrder}>
                  결제하기
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 