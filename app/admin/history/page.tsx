'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { getLogs, LogEntry } from '@/data/logs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const AdminHistoryPage = () => {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);
    const [searchUserId, setSearchUserId] = useState('');
    const [searchAction, setSearchAction] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
        } else if (user) {
            // getLogs()는 모든 로그를 반환하므로, 최신순으로 정렬합니다.
            setLogs(getLogs().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
    }, [user, isLoading, router]);
    
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const userIdMatch = searchUserId ? log.userId.toLowerCase().includes(searchUserId.toLowerCase()) : true;
            const actionMatch = searchAction === 'all' || log.action === searchAction;
            
            const logDate = new Date(log.timestamp);
            const start = startDate ? new Date(startDate) : null;
            if (start) start.setHours(0, 0, 0, 0);

            const end = endDate ? new Date(endDate) : null;
            if (end) end.setHours(23, 59, 59, 999);

            const dateMatch = (!start || logDate >= start) && (!end || logDate <= end);

            return userIdMatch && actionMatch && dateMatch;
        });
    }, [logs, searchUserId, searchAction, startDate, endDate]);

    // Pagination logic
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentLogs = filteredLogs.slice(startIndex, endIndex);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value));
        setCurrentPage(1);
    };
    
    const handleSearchActionChange = (value: string) => {
        setSearchAction(value);
        setCurrentPage(1);
    };

    if (isLoading || !user) {
        return <div>Loading...</div>;
    }

    const formatTimestamp = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };
    
    const getActionText = (action: 'login' | 'logout' | 'page_view') => {
        switch(action) {
            case 'login': return '로그인';
            case 'logout': return '로그아웃';
            case 'page_view': return '페이지 이동';
            default: return action;
        }
    }


    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>사용자 활동 이력</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4 mb-4">
                        <div className="flex items-center space-x-4">
                            <Input
                                placeholder="사용자 ID로 검색..."
                                value={searchUserId}
                                onChange={(e) => {
                                    setSearchUserId(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="max-w-sm"
                            />
                            <Select onValueChange={handleSearchActionChange} defaultValue={searchAction}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="활동 유형" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">모든 활동</SelectItem>
                                    <SelectItem value="login">로그인</SelectItem>
                                    <SelectItem value="logout">로그아웃</SelectItem>
                                    <SelectItem value="page_view">페이지 이동</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <label htmlFor="start-date">시작일:</label>
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={e => {
                                    setStartDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-[180px]"
                            />
                            <label htmlFor="end-date">종료일:</label>
                             <Input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={e => {
                                    setEndDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-[180px]"
                            />
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>일시</TableHead>
                                <TableHead>사용자 ID</TableHead>
                                <TableHead>활동</TableHead>
                                <TableHead>상세 정보</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentLogs.length > 0 ? (
                                currentLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                                        <TableCell>{log.userId}</TableCell>
                                        <TableCell>{getActionText(log.action)}</TableCell>
                                        <TableCell>{log.details}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        검색 결과가 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                            <Select onValueChange={handleItemsPerPageChange} defaultValue={String(itemsPerPage)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="표시할 개수" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">30개씩 보기</SelectItem>
                                    <SelectItem value="50">50개씩 보기</SelectItem>
                                    <SelectItem value="100">100개씩 보기</SelectItem>
                                    <SelectItem value="200">200개씩 보기</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                이전
                            </Button>
                            <span>
                                {currentPage} / {totalPages > 0 ? totalPages : 1}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                다음
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminHistoryPage; 