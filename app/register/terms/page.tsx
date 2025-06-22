'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const TermsAndConditionsPage = () => {
    const router = useRouter();
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [agreedPrivacy, setAgreedPrivacy] = useState(false);

    const handleAgreeAll = (checked: boolean) => {
        setAgreedTerms(checked);
        setAgreedPrivacy(checked);
    };

    const handleContinue = () => {
        if (agreedTerms && agreedPrivacy) {
            sessionStorage.setItem('agreedToTerms', 'true');
            router.push('/register');
        } else {
            alert('모든 필수 약관에 동의해야 회원가입을 진행할 수 있습니다.');
        }
    };

    const allAgreed = agreedTerms && agreedPrivacy;

    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-2xl">서비스 이용 약관 동의</CardTitle>
                    <CardDescription>회원가입을 위해 아래 서비스 이용약관과 개인정보 처리방침에 동의해주세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="p-4 border rounded-md max-h-40 overflow-y-auto text-sm bg-muted/50">
                            <h3 className="font-semibold mb-2 text-base">서비스 이용약관</h3>
                            <p className="text-muted-foreground">
                                제1조 (목적) 이 약관은 [회사명] (이하 '회사')가 제공하는 모든 서비스의 이용조건 및 절차, 회원과 회사 간의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
                                <br /><br />
                                제2조 (용어의 정의) 본 약관에서 사용하는 용어의 정의는 다음과 같습니다. <br />
                                1. '서비스'라 함은 회사가 제공하는 모든 제반 서비스를 의미합니다. <br />
                                2. '회원'이라 함은 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 말합니다.
                                <br /><br />
                                제3조 (약관의 효력과 변경) ① 회사는 이 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. ② 회사는 '약관의규제에관한법률', '정보통신망이용촉진및정보보호등에관한법률(이하 정보통신망법)' 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="agreeTerms" 
                                checked={agreedTerms}
                                onCheckedChange={(checked) => setAgreedTerms(checked as boolean)}
                            />
                            <Label htmlFor="agreeTerms">서비스 이용약관에 동의합니다. (필수)</Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="p-4 border rounded-md max-h-40 overflow-y-auto text-sm bg-muted/50">
                            <h3 className="font-semibold mb-2 text-base">개인정보 수집 및 이용 동의</h3>
                            <p className="text-muted-foreground">
                                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                                <br /><br />
                                1. 수집 항목: [필수] 아이디, 비밀번호, 이름, 이메일, 휴대전화번호. [선택] 주소 <br />
                                2. 수집 및 이용 목적: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지, 각종 고지·통지, 고충처리, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.
                                <br /><br />
                                3. 보유 및 이용기간: 회원 탈퇴 시까지. 단, 관계 법령 위반에 따른 수사, 조사 등이 진행 중인 경우에는 해당 수사, 조사 종료 시까지 보관합니다.
                            </p>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="agreePrivacy"
                                checked={agreedPrivacy}
                                onCheckedChange={(checked) => setAgreedPrivacy(checked as boolean)}
                            />
                            <Label htmlFor="agreePrivacy">개인정보 수집 및 이용에 동의합니다. (필수)</Label>
                        </div>
                    </div>
                    
                    <div className="border-t pt-6">
                         <div className="flex items-center space-x-2">
                             <Checkbox 
                                id="agreeAll" 
                                checked={allAgreed} 
                                onCheckedChange={(checked) => handleAgreeAll(checked as boolean)}
                            />
                            <Label htmlFor="agreeAll" className="font-semibold text-base">전체 약관에 동의합니다.</Label>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        className="w-full" 
                        onClick={handleContinue}
                        disabled={!allAgreed}
                        size="lg"
                    >
                        동의하고 회원가입 계속하기
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default TermsAndConditionsPage; 