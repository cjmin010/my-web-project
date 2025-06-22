'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Search, Trash2, UserCheck, UserX, KeyRound, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getUsers, deleteUser, updateUser } from '@/data/users';

const AdminUsersPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = (userId: string) => {
        if (userId === 'admin') {
            alert('관리자 계정은 삭제할 수 없습니다.');
            return;
        }

        if (confirm('정말로 이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            deleteUser(userId);
            loadUsers();
            alert('사용자가 삭제되었습니다.');
        }
    };

    const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
        if (userId === 'admin') {
            alert('관리자 계정은 비활성화할 수 없습니다.');
            return;
        }
        await updateUser(userId, { isActive: !currentStatus });
        loadUsers();
        alert(`사용자가 ${!currentStatus ? '활성화' : '비활성화'}되었습니다.`);
    };

    const handleUnlockUser = async (userId: string) => {
        if (confirm('이 사용자의 계정 잠금을 해제하시겠습니까?')) {
            try {
                await updateUser(userId, { isLocked: false, failedLoginAttempts: 0 });
                loadUsers();
                alert('사용자 계정이 잠금 해제되었습니다.');
            } catch (error) {
                 console.error("잠금 해제 실패:", error);
                alert("잠금 해제 중 오류가 발생했습니다.");
            }
        }
    };

    const handleResetPassword = async (user: any) => {
        const newPassword = Math.random().toString(36).slice(2, 11);
        if (confirm(`'${user.name}(${user.id})' 님의 비밀번호를 재설정하시겠습니까?\n\n새 임시 비밀번호: ${newPassword}\n\n이 작업은 즉시 적용되며, 사용자는 다음 로그인 시 비밀번호를 변경해야 합니다.`)) {
            try {
                await updateUser(user.id, { password: newPassword, mustChangePassword: true });
                alert(`임시 비밀번호가 성공적으로 설정되었습니다. '${user.email}' (으)로 통지되었습니다 (시뮬레이션).`);
            } catch (error) {
                console.error("비밀번호 재설정 실패:", error);
                alert("비밀번호 재설정 중 오류가 발생했습니다.");
            }
        }
    };

    const filteredUsers = users
        .filter(u => {
            if (filterStatus === 'active') return u.isActive && !u.isLocked;
            if (filterStatus === 'inactive') return !u.isActive && !u.isLocked;
            if (filterStatus === 'locked') return u.isLocked;
            return true;
        })
        .filter(u => 
            u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">회원 관리</h1>
                <p className="text-muted-foreground">전체 회원을 관리할 수 있습니다.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-grow">
                            <CardTitle>회원 목록</CardTitle>
                            <CardDescription>
                                총 {filteredUsers.length}명의 회원이 조회되었습니다.
                            </CardDescription>
                        </div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
                            <div className="flex space-x-2">
                                <Button onClick={() => setFilterStatus('all')} variant={filterStatus === 'all' ? 'default' : 'outline'} size="sm">전체</Button>
                                <Button onClick={() => setFilterStatus('active')} variant={filterStatus === 'active' ? 'default' : 'outline'} size="sm">활성</Button>
                                <Button onClick={() => setFilterStatus('inactive')} variant={filterStatus === 'inactive' ? 'default' : 'outline'} size="sm">비활성</Button>
                                <Button onClick={() => setFilterStatus('locked')} variant={filterStatus === 'locked' ? 'destructive' : 'outline'} size="sm">잠김</Button>
                            </div>
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="회원 검색 (ID, 이름, 이메일)"
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
                         <div className="text-center py-8">
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
                                        <th className="text-left p-4 font-semibold">역할</th>
                                        <th className="text-left p-4 font-semibold">상태</th>
                                        <th className="text-left p-4 font-semibold">가입일</th>
                                        <th className="text-center p-4 font-semibold">관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedUsers.map((u) => (
                                        <tr key={u.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4 font-mono text-sm">{u.id}</td>
                                            <td className="p-4">{u.name}</td>
                                            <td className="p-4">{u.email}</td>
                                            <td className="p-4">
                                                <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                                                    {u.role === 'admin' ? '관리자' : '일반회원'}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={u.isLocked ? 'destructive' : u.isActive ? 'default' : 'secondary'}>
                                                    {u.isLocked ? '잠김' : u.isActive ? '활성' : '비활성'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {u.createdAt}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center space-x-2">
                                                    {u.isLocked ? (
                                                        <Button variant="outline" size="sm" onClick={() => handleUnlockUser(u.id)} title="잠금 해제">
                                                            <Unlock className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <Button variant="outline" size="sm" onClick={() => handleToggleUserStatus(u.id, u.isActive)} disabled={u.id === 'admin'} title={u.isActive ? '비활성화' : '활성화'}>
                                                            {u.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                                        </Button>
                                                    )}
                                                    <Button variant="outline" size="sm" onClick={() => handleResetPassword(u)} disabled={u.id === 'admin'} title="비밀번호 재설정">
                                                        <KeyRound className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(u.id)} disabled={u.id === 'admin'} title="사용자 삭제">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                     {paginatedUsers.length === 0 && !isLoading && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">표시할 회원이 없습니다.</p>
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
                                {[30, 50, 100].map((pageSize) => (
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

export default AdminUsersPage;