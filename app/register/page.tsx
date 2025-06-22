'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { Eye, EyeOff, UserPlus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addUser, validateUserId, validatePassword, validateEmail, validatePhone } from '@/data/users';

// Daum 우편번호 API 타입 정의
declare global {
    interface Window {
        daum: any;
    }
}

function RegisterPage() {
    const router = useRouter();
    
    useEffect(() => {
        // 클라이언트 사이드에서만 실행되도록 보장
        if (typeof window !== 'undefined') {
            const agreed = sessionStorage.getItem('agreedToTerms');
            if (agreed !== 'true') {
                alert('약관에 먼저 동의해주세요.');
                router.push('/register/terms');
            }
        }
    }, [router]);

    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        addressDetail: '',
        zipCode: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);
    const [idCheckMessage, setIdCheckMessage] = useState<string | null>(null);


    useEffect(() => {
        if (formData.id.trim() === '') {
            setErrors(prev => ({ ...prev, id: '' }));
            setIdCheckMessage(null);
            return;
        }

        const handler = setTimeout(async () => {
            const idValidationError = validateUserId(formData.id);
            if (idValidationError) {
                setErrors(prev => ({ ...prev, id: idValidationError }));
                setIdCheckMessage(null);
                return;
            }

            try {
                const res = await fetch(`/api/users/check-id?id=${formData.id}`);
                const data = await res.json();
                if (data.exists) {
                    setErrors(prev => ({ ...prev, id: '이미 사용 중인 ID입니다.' }));
                    setIdCheckMessage(null);
                } else {
                    setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.id;
                        return newErrors;
                    });
                    setIdCheckMessage('사용 가능한 ID입니다.');
                }
            } catch (error) {
                console.error('ID 중복 체크 실패:', error);
                setIdCheckMessage('ID 확인 중 오류가 발생했습니다.');
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [formData.id]);

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            const newErrors = { ...errors };
            delete newErrors[field];
            setErrors(newErrors);
        }
        if (field === 'id') {
            setIdCheckMessage(null);
        }
    };

    const handleSearchAddress = () => {
        new window.daum.Postcode({
            oncomplete: function(data: any) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                let addr = ''; // 주소 변수
                let extraAddr = ''; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else { // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if(data.userSelectedType === 'R'){
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if(extraAddr !== ''){
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    // 조합된 참고항목을 주소에 추가한다.
                    addr += extraAddr;
                
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                setFormData(prev => ({
                    ...prev,
                    zipCode: data.zonecode,
                    address: addr,
                }));

                // 커서를 상세주소 필드로 이동시킨다.
                document.getElementById('addressDetail')?.focus();
            }
        }).open();
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (errors.id) newErrors.id = errors.id;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }
        if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요.';
        
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const phoneError = validatePhone(formData.phone);
        if (phoneError) newErrors.phone = phoneError;

        if (!formData.address.trim()) newErrors.address = '주소를 입력해주세요.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await addUser({
                ...formData,
                role: 'user',
                isActive: false, // 승인 대기
                isRejected: false,
            });
            
            setSuccess(true);
            sessionStorage.removeItem('agreedToTerms');
            setTimeout(() => router.push('/login'), 2000);

        } catch (error) {
            setErrors(prev => ({ ...prev, general: error instanceof Error ? error.message : '회원가입 중 오류 발생' }));
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-md mx-auto">
                    <CardContent className="text-center py-8">
                        <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">회원가입 신청 완료</h2>
                        <p className="text-muted-foreground">관리자 승인 후 로그인이 가능합니다.<br />잠시 후 로그인 페이지로 이동합니다.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <Script
                src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
                strategy="lazyOnload"
            />
            <div className="container mx-auto px-4 py-8">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
                        <CardDescription>MINI 스토어의 회원이 되어 다양한 혜택을 받아보세요</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* ID Input */}
                            <div className="space-y-2">
                                <Label htmlFor="id">아이디 *</Label>
                                <Input id="id" value={formData.id} onChange={(e) => handleInputChange('id', e.target.value)} className={errors.id ? 'border-red-500' : (idCheckMessage ? 'border-green-500' : '')} />
                                {errors.id && <p className="text-sm text-red-600 flex items-center"><X className="h-3 w-3 mr-1" />{errors.id}</p>}
                                {idCheckMessage && <p className="text-sm text-green-600 flex items-center"><Check className="h-3 w-3 mr-1" />{idCheckMessage}</p>}
                            </div>

                            {/* Other inputs... */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                         <Label htmlFor="name">이름 *</Label>
                                         <Input id="name" type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={errors.name ? 'border-red-500' : ''} />
                                         {errors.name && <p className="text-sm text-red-600 flex items-center"><X className="h-3 w-3 mr-1" />{errors.name}</p>}
                                     </div>
                                 </div>
     
                                 {/* 비밀번호 */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                         <Label htmlFor="password">비밀번호 *</Label>
                                         <div className="relative">
                                             <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className={errors.password ? 'border-red-500' : ''} />
                                             <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}><Eye className="h-4 w-4" /></Button>
                                         </div>
                                         {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                                     </div>
     
                                     <div className="space-y-2">
                                         <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
                                          <div className="relative">
                                             <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className={errors.confirmPassword ? 'border-red-500' : ''} />
                                             <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowConfirmPassword(!showConfirmPassword)}><Eye className="h-4 w-4" /></Button>
                                         </div>
                                         {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                                     </div>
                                 </div>
     
                                 {/* 연락처 정보 */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                         <Label htmlFor="email">이메일 *</Label>
                                         <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={errors.email ? 'border-red-500' : ''} />
                                         {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                     </div>
     
                                     <div className="space-y-2">
                                         <Label htmlFor="phone">전화번호 *</Label>
                                         <Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={errors.phone ? 'border-red-500' : ''} />
                                         {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                                     </div>
                                 </div>
     
                                 {/* 주소 정보 */}
                                 <div className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                          <div className="space-y-2">
                                              <Label htmlFor="zipCode">우편번호 *</Label>
                                              <Input 
                                                  id="zipCode" 
                                                  type="text" 
                                                  value={formData.zipCode} 
                                                  onChange={(e) => handleInputChange('zipCode', e.target.value)} 
                                                  readOnly 
                                                  className={errors.address ? 'border-red-500' : ''}
                                              />
                                          </div>
                                          <div className="md:col-span-2">
                                              <Button type="button" variant="secondary" onClick={handleSearchAddress} className="w-full">
                                                  주소 검색
                                              </Button>
                                          </div>
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor="address">주소 *</Label>
                                          <Input 
                                              id="address" 
                                              type="text" 
                                              value={formData.address} 
                                              onChange={(e) => handleInputChange('address', e.target.value)} 
                                              readOnly 
                                              className={errors.address ? 'border-red-500' : ''}
                                          />
                                          {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor="addressDetail">상세주소</Label>
                                          <Input 
                                              id="addressDetail" 
                                              type="text" 
                                              value={formData.addressDetail} 
                                              onChange={(e) => handleInputChange('addressDetail', e.target.value)} 
                                          />
                                      </div>
                                  </div>

                            {errors.general && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{errors.general}</p>}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? '회원가입 중...' : '회원가입'}
                            </Button>
                        </form>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">이미 계정이 있으신가요? <Link href="/login" className="font-semibold text-primary hover:underline">로그인하기</Link></p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
} 