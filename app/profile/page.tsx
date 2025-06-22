'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Eye, EyeOff, Edit, Save, X, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateUser, validateEmail, validatePhone } from '@/data/users';

const ProfilePage = () => {
    const { user, logout } = useUser();
    const router = useRouter();
    
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        addressDetail: '',
        zipCode: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            addressDetail: user.addressDetail,
            zipCode: user.zipCode,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
    }, [user, router]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해주세요.';
        }

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const phoneError = validatePhone(formData.phone);
        if (phoneError) newErrors.phone = phoneError;

        if (!formData.address.trim()) {
            newErrors.address = '주소를 입력해주세요.';
        }

        if (formData.newPassword || formData.confirmNewPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
            } else if (formData.currentPassword !== user?.password) {
                newErrors.currentPassword = '현재 비밀번호가 올바르지 않습니다.';
            }

            if (formData.newPassword && formData.newPassword.length < 6) {
                newErrors.newPassword = '새 비밀번호는 6자 이상이어야 합니다.';
            }

            if (formData.newPassword !== formData.confirmNewPassword) {
                newErrors.confirmNewPassword = '새 비밀번호가 일치하지 않습니다.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const updates: any = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                addressDetail: formData.addressDetail,
                zipCode: formData.zipCode
            };

            if (formData.newPassword) {
                updates.password = formData.newPassword;
            }

            await updateUser(user!.id, updates);
            
            alert('정보가 성공적으로 업데이트되었습니다.');
            setIsEditing(false);
            
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }));
            
        } catch (error) {
            alert('정보 업데이트 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setErrors({});
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                addressDetail: user.addressDetail,
                zipCode: user.zipCode,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }));
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">내 정보</h1>
                    <p className="text-muted-foreground">회원 정보를 확인하고 수정할 수 있습니다.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="h-12 w-12 text-blue-600" />
                                </div>
                                <CardTitle>{user.name}</CardTitle>
                                <CardDescription>{user.id}</CardDescription>
                                <div className="flex items-center justify-center text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    가입일: {user.createdAt}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm">
                                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{user.phone}</span>
                                    </div>
                                    <div className="flex items-start text-sm">
                                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                                        <span>{user.address}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>주문 관리</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full" asChild>
                                    <a href="/profile/orders">주문 현황 보기</a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>회원 정보 수정</CardTitle>
                                        <CardDescription>
                                            {isEditing ? '정보를 수정하고 저장하세요.' : '수정하려는 항목을 클릭하세요.'}
                                        </CardDescription>
                                    </div>
                                    {!isEditing ? (
                                        <Button onClick={() => setIsEditing(true)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            수정
                                        </Button>
                                    ) : (
                                        <div className="flex space-x-2">
                                            <Button variant="outline" onClick={handleCancel}>
                                                <X className="h-4 w-4 mr-2" />
                                                취소
                                            </Button>
                                            <Button type="submit" form="profile-form" disabled={isLoading}>
                                                <Save className="h-4 w-4 mr-2" />
                                                저장
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">이름 *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                disabled={!isEditing || isLoading}
                                                className={errors.name ? 'border-red-500' : ''}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">이메일 *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                disabled={!isEditing || isLoading}
                                                className={errors.email ? 'border-red-500' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">전화번호 *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            disabled={!isEditing || isLoading}
                                            className={errors.phone ? 'border-red-500' : ''}
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="zipCode">우편번호</Label>
                                                <Input
                                                    id="zipCode"
                                                    type="text"
                                                    value={formData.zipCode}
                                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                                    disabled={!isEditing || isLoading}
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="address">주소 *</Label>
                                                <Input
                                                    id="address"
                                                    type="text"
                                                    value={formData.address}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                    disabled={!isEditing || isLoading}
                                                    className={errors.address ? 'border-red-500' : ''}
                                                />
                                                {errors.address && (
                                                    <p className="text-sm text-red-600">{errors.address}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="addressDetail">상세주소</Label>
                                            <Textarea
                                                id="addressDetail"
                                                value={formData.addressDetail}
                                                onChange={(e) => handleInputChange('addressDetail', e.target.value)}
                                                disabled={!isEditing || isLoading}
                                                rows={2}
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="border-t pt-6">
                                            <h3 className="text-lg font-semibold mb-4">비밀번호 변경</h3>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword">현재 비밀번호</Label>
                                                    <Input
                                                        id="currentPassword"
                                                        type="password"
                                                        value={formData.currentPassword}
                                                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                                        disabled={isLoading}
                                                        className={errors.currentPassword ? 'border-red-500' : ''}
                                                    />
                                                    {errors.currentPassword && (
                                                        <p className="text-sm text-red-600">{errors.currentPassword}</p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="newPassword">새 비밀번호</Label>
                                                        <div className="relative">
                                                            <Input
                                                                id="newPassword"
                                                                type={showPassword ? "text" : "password"}
                                                                value={formData.newPassword}
                                                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                                                disabled={isLoading}
                                                                className={errors.newPassword ? 'border-red-500' : ''}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                disabled={isLoading}
                                                            >
                                                                {showPassword ? (
                                                                    <EyeOff className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                        {errors.newPassword && (
                                                            <p className="text-sm text-red-600">{errors.newPassword}</p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
                                                        <Input
                                                            id="confirmNewPassword"
                                                            type="password"
                                                            value={formData.confirmNewPassword}
                                                            onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
                                                            disabled={isLoading}
                                                            className={errors.confirmNewPassword ? 'border-red-500' : ''}
                                                        />
                                                        {errors.confirmNewPassword && (
                                                            <p className="text-sm text-red-600">{errors.confirmNewPassword}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>계정 관리</CardTitle>
                                <CardDescription>계정 관련 작업을 수행할 수 있습니다.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4">
                                    <Button variant="outline" onClick={logout}>
                                        로그아웃
                                    </Button>
                                    <Button variant="destructive">
                                        회원 탈퇴
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 