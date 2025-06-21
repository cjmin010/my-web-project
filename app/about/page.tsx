"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageWithFallback from '@/components/ImageWithFallback';
import { Separator } from '@/components/ui/separator';
import { Truck, PackageOpen } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">About MINI 스토어</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                            alt="About Us"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <h2 className="text-4xl font-bold text-white">우리의 비전</h2>
                        </div>
                    </div>
                    <div className="text-lg text-gray-700 leading-relaxed text-center">
                        <p>
                            MINI 스토어는 단순한 쇼핑 공간을 넘어, 개성과 스타일을 발견하는 즐거움을 드리는 곳입니다.
                            우리는 전 세계의 숨겨진 보석 같은 아이템들을 발굴하여 고객 여러분의 일상에 특별함을 더하고자 합니다.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">독창적인 디자인</h3>
                            <p className="text-muted-foreground">
                                평범함을 거부하는 특별한 디자인의 제품들을 선보입니다.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">엄선된 품질</h3>
                            <p className="text-muted-foreground">
                                오랫동안 당신의 곁을 지킬 수 있도록, 품질 좋은 제품만을 고집합니다.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">글로벌 소싱</h3>
                            <p className="text-muted-foreground">
                                전 세계의 다양한 문화와 트렌드를 반영한 유니크한 상품을 제공합니다.
                            </p>
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="max-w-4xl mx-auto mt-12 bg-gray-50 p-8 rounded-lg">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                <ImageWithFallback
                                    src="https://images.unsplash.com/photo-1586528116311-06924151d145?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                                    alt="Shipping"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-semibold flex items-center gap-2">
                                    <Truck className="w-6 h-6" />
                                    배송 안내
                                </h3>
                                <div className="text-muted-foreground space-y-2">
                                    <p><strong>배송 업체:</strong> OO배송</p>
                                    <p><strong>배송 지역:</strong> 대한민국 전 지역</p>
                                    <p><strong>배송비:</strong> 5,000원 (50,000원 이상 구매 시 무료배송)</p>
                                    <p><strong>배송 기간:</strong> 주문일로부터 2~5 영업일 이내 (주말, 공휴일 제외)</p>
                                    <p className="text-sm">도서/산간 지역은 별도의 추가 금액이 발생할 수 있으며, 배송이 다소 지연될 수 있습니다.</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="my-12" />

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-4 md:order-2">
                                <h3 className="text-2xl font-semibold flex items-center gap-2">
                                    <PackageOpen className="w-6 h-6" />
                                    반품 및 교환 안내
                                </h3>
                                <div className="text-muted-foreground space-y-2">
                                    <p>상품 수령일로부터 7일 이내에 고객센터로 접수해주시면, 절차를 안내해 드립니다.</p>
                                    <p className="text-sm">단순 변심에 의한 반품/교환의 경우, 왕복 배송비는 고객 부담입니다.</p>
                                    <p className="font-semibold mt-3">반품/교환 불가 사유:</p>
                                    <ul className="list-disc list-inside text-sm">
                                        <li>상품 택(tag) 제거 또는 개봉으로 상품 가치가 훼손된 경우</li>
                                        <li>사용 또는 일부 소비에 의해 상품 가치가 현저히 감소한 경우</li>
                                        <li>시간 경과로 재판매가 곤란할 정도로 가치가 감소한 경우</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="relative w-full h-64 rounded-lg overflow-hidden md:order-1">
                                <ImageWithFallback
                                    src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                                    alt="Returns"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
} 