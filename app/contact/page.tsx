"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '알 수 없는 오류가 발생했습니다.');
            }

            setStatus({ type: 'success', message: '메시지가 성공적으로 전송되었습니다!' });
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '메시지 전송에 실패했습니다.';
            setStatus({ type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(null), 5000);
        }
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>문의하기</CardTitle>
                    <CardDescription>
                        궁금한 점이나 피드백이 있으신가요? 아래 양식을 작성하여 문의해 주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">이름</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="이름을 입력하세요"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">이메일</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@example.com"
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">메시지</Label>
                            <Textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                                required
                                className="min-h-[150px]"
                                disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? '전송 중...' : '메시지 보내기'}
                        </Button>
                        {status && (
                            <p className={`text-center mt-4 ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                {status.message}
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </main>
    );
} 