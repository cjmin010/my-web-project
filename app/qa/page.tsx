'use client';

import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { qaData, getQAByCategory, getFrequentQA, searchQA, QAItem } from '@/data/qa';

const QAPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [expandedItems, setExpandedItems] = useState<number[]>([]);
    const [showFrequentOnly, setShowFrequentOnly] = useState(false);

    // 카테고리 목록
    const categories = ['전체', '주문/결제', '배송', '반품/교환', '상품문의', '회원정보', '기타'];

    // 필터링된 Q&A 데이터
    const getFilteredQA = () => {
        let filtered = qaData;

        // 카테고리 필터링
        if (selectedCategory !== '전체') {
            filtered = getQAByCategory(selectedCategory);
        }

        // 자주 묻는 질문만 보기
        if (showFrequentOnly) {
            filtered = filtered.filter(qa => qa.isFrequent);
        }

        // 검색 필터링
        if (searchKeyword.trim()) {
            filtered = searchQA(searchKeyword);
        }

        return filtered;
    };

    // 아이템 확장/축소 토글
    const toggleExpanded = (id: number) => {
        setExpandedItems(prev => 
            prev.includes(id) 
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };

    const filteredQA = getFilteredQA();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 페이지 제목 */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">자주 묻는 질문</h1>
                <p className="text-muted-foreground">고객님들이 자주 묻는 질문들을 모았습니다</p>
            </div>

            {/* 검색 및 필터 */}
            <div className="mb-8 space-y-4">
                {/* 검색창 */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="궁금한 내용을 검색해보세요..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* 카테고리 필터 */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                            className="text-sm"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* 자주 묻는 질문만 보기 토글 */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={showFrequentOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowFrequentOnly(!showFrequentOnly)}
                        className="text-sm"
                    >
                        <Star className="h-4 w-4 mr-1" />
                        자주 묻는 질문만
                    </Button>
                </div>
            </div>

            {/* Q&A 목록 */}
            <div className="space-y-4">
                {filteredQA.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-muted-foreground">검색 결과가 없습니다.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredQA.map((qa) => (
                        <Card key={qa.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {qa.category}
                                            </Badge>
                                            {qa.isFrequent && (
                                                <Badge variant="default" className="text-xs">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    자주 묻는 질문
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle 
                                            className="text-lg cursor-pointer hover:text-blue-600 transition-colors"
                                            onClick={() => toggleExpanded(qa.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="flex-1">{qa.question}</span>
                                                {expandedItems.includes(qa.id) ? (
                                                    <ChevronUp className="h-5 w-5 ml-2" />
                                                ) : (
                                                    <ChevronDown className="h-5 w-5 ml-2" />
                                                )}
                                            </div>
                                        </CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            {expandedItems.includes(qa.id) && (
                                <CardContent className="pt-0">
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {qa.answer}
                                        </p>
                                        <div className="mt-3 text-xs text-muted-foreground">
                                            등록일: {qa.date}
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))
                )}
            </div>

            {/* 결과 개수 표시 */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
                총 {filteredQA.length}개의 질문이 있습니다.
            </div>

            {/* 추가 문의 안내 */}
            <Card className="mt-8">
                <CardContent className="text-center py-6">
                    <h3 className="text-lg font-semibold mb-2">더 궁금한 점이 있으신가요?</h3>
                    <p className="text-muted-foreground mb-4">
                        위에서 찾지 못한 답변이 있으시면 언제든지 문의해주세요.
                    </p>
                    <Button asChild>
                        <a href="/contact">1:1 문의하기</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default QAPage; 