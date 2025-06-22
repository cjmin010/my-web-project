'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Search, Check, X, Clock, UserPlus, Calendar, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUsers, updateUser } from '@/data/users';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminRegistrationsPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(30);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/login');
            return;
        }

        loadUsers();
    }, [user, router]);

    const loadUsers = () => {
        setIsLoading(true);
        try {
            const allUsers = getUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error("Failed to load users:", error);
            // 사용자에게 에러를 알리는 UI를 추가할 수 있습니다.
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveUser = async (userId: string) => {
        await updateUser(userId, { isActive: true });
        loadUsers();
        alert('회원가입이 승인되었습니다.');
    };

    const handleRejectUser = async (userId: string) => {
        if (confirm('정말로 이 회원가입 신청을 거절하시겠습니까?')) {
            await updateUser(userId, { isRejected: true });
            loadUsers();
            alert('회원가입 신청이 거절되었습니다.');
        }
    };

    const getFilteredUsers = () => {
        let filtered = users;

        if (filterStatus === 'pending') {
            filtered = filtered.filter(user => !user.isActive && !user.isRejected);
        } else if (filterStatus === 'approved') {
            filtered = filtered.filter(user => user.isActive);
        } else if (filterStatus === 'rejected') {
            filtered = filtered.filter(user => user.isRejected);
        }

        if (searchTerm) {
            filtered = filtered.filter(user => 
                user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredUsers = getFilteredUsers();
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    const pendingCount = users.filter(user => !user.isActive && !user.isRejected).length;
    const approvedCount = users.filter(user => user.isActive).length;
    const rejectedCount = users.filter(user => user.isRejected).length;
    const totalCount = pendingCount + approvedCount + rejectedCount;

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">회원가입 신청 현황</h1>
                <p className="text-muted-foreground">새로운 회원가입 신청을 관리할 수 있습니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UserPlus className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">전체 신청</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">대기 중</p>
                                <p className="text-2xl font-bold">{pendingCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">승인됨</p>
                                <p className="text-2xl font-bold">{approvedCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <X className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-muted-foreground">거절됨</p>
                                <p className="text-2xl font-bold">{rejectedCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-grow">
                            <CardTitle>신청 목록</CardTitle>
                            <CardDescription>
                                총 {filteredUsers.length}건의 신청이 조회되었습니다.
                            </CardDescription>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                            <div className="flex space-x-2">
                                <Button variant={filterStatus === 'all' ? 'default' : 'outline'} size="sm" onClick={() => { setFilterStatus('all'); setCurrentPage(1); }}>전체</Button>
                                <Button variant={filterStatus === 'pending' ? 'default' : 'outline'} size="sm" onClick={() => { setFilterStatus('pending'); setCurrentPage(1); }}>대기 중</Button>
                                <Button variant={filterStatus === 'approved' ? 'default' : 'outline'} size="sm" onClick={() => { setFilterStatus('approved'); setCurrentPage(1); }}>승인됨</Button>
                                <Button variant={filterStatus === 'rejected' ? 'default' : 'outline'} size="sm" onClick={() => { setFilterStatus('rejected'); setCurrentPage(1); }}>거절됨</Button>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="검색 (ID, 이름, 이메일)"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-muted-foreground">로딩 중...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4 font-semibold">ID</th>
                                        <th className="text-left p-4 font-semibold">이름</th>
                                        <th className="text-left p-4 font-semibold">이메일</th>
                                        <th className="text-left p-4 font-semibold">전화번호</th>
                                        <th className="text-left p-4 font-semibold">주소</th>
                                        <th className="text-left p-4 font-semibold">상태</th>
                                        <th className="text-left p-4 font-semibold">신청일</th>
                                        <th className="text-left p-4 font-semibold">관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4 font-mono text-sm">{user.id}</td>
                                            <td className="p-4">{user.name}</td>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4">{user.phone}</td>
                                            <td className="p-4">
                                                <div className="max-w-xs truncate" title={`${user.address} ${user.addressDetail}`}>
                                                    {user.address} {user.addressDetail}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={user.isActive ? 'default' : user.isRejected ? 'destructive' : 'secondary'}>
                                                    {user.isActive ? '승인됨' : user.isRejected ? '거절됨' : '대기 중'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    {user.createdAt}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {!user.isActive && !user.isRejected ? (
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleApproveUser(user.id)}
                                                            disabled={user.id === 'admin'}
                                                        >
                                                            <Check className="h-4 w-4 mr-1" />
                                                            승인
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleRejectUser(user.id)}
                                                            disabled={user.id === 'admin'}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            거절
                                                        </Button>
                                                    </div>
                                                ) : user.isActive ? (
                                                    <span className="text-sm text-muted-foreground">승인 완료</span>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">거절 완료</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {paginatedUsers.length === 0 && !isLoading && (
                        <div className="text-center py-16">
                            <p className="text-muted-foreground">표시할 신청 내역이 없습니다.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex items-center justify-end space-x-4 py-4">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">페이지 당 행</p>
                        <Select
                            value={`${rowsPerPage}`}
                            onValueChange={(value) => {
                                setRowsPerPage(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={rowsPerPage} />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 30, 50, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {currentPage} / {totalPages} 페이지
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            이전
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                        >
                            다음
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AdminRegistrationsPage; 