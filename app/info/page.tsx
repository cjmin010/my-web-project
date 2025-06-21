"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageWithFallback from '@/components/ImageWithFallback';

export default function InfoPage() {
    return (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">MINI 스토어 이야기</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/3 flex justify-center">
                            <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-lg">
                                <ImageWithFallback 
                                    src="https://upload.wikimedia.org/wikipedia/commons/0/09/Flag_of_South_Korea.svg"
                                    alt="대한민국 국기"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 space-y-4">
                            <h3 className="text-2xl font-bold">MINI 스토어 대표입니다.</h3>
                            <p className="text-muted-foreground">
                                저희 MINI 스토어는 최신 트렌드를 선도하는 독창적이고 세련된 패션 아이템을 제공합니다.
                                고객님의 일상을 더욱 특별하게 만들어 줄 최고의 제품들을 만나보세요.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4 text-gray-700 leading-loose">
                        <h3 className="text-xl font-semibold border-b pb-2">우리의 약속</h3>
                        <p>
                            <strong>품질 우선:</strong> MINI 스토어의 모든 상품은 최고의 품질 기준을 충족합니다. 저희는 내구성이 뛰어나고, 디자인이 우수하며, 실용적인 제품만을 선보입니다.
                        </p>
                        <p>
                            <strong>고객 만족:</strong> 고객님의 만족이 저희의 최우선 과제입니다. 쇼핑 경험 전반에 걸쳐 최고의 서비스를 제공하기 위해 노력하며, 궁금한 점이나 문제가 있을 시 언제나 신속하게 도와드리겠습니다.
                        </p>
                        <p>
                            <strong>지속 가능성:</strong> 우리는 환경을 생각합니다. 가능한 한 친환경적인 포장재를 사용하고, 지속 가능한 방식으로 생산된 제품을 우선적으로 소싱하여 우리 사회와 지구에 긍정적인 영향을 미치고자 합니다.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
} 