export interface QAItem {
    id: number;
    category: '주문/결제' | '배송' | '반품/교환' | '상품문의' | '회원정보' | '기타';
    question: string;
    answer: string;
    date: string;
    isFrequent: boolean; // 자주 묻는 질문 여부
}

export const qaData: QAItem[] = [
    // 주문/결제 관련 (5개)
    {
        id: 1,
        category: '주문/결제',
        question: '주문 후 결제 방법을 변경할 수 있나요?',
        answer: '주문 후 결제 방법 변경은 주문 완료 후 1시간 이내에만 가능합니다. 고객센터로 연락주시면 도움드리겠습니다.',
        date: '2024-01-15',
        isFrequent: true
    },
    {
        id: 2,
        category: '주문/결제',
        question: '무이자 할부는 몇 개월까지 가능한가요?',
        answer: '현재 3개월, 6개월, 12개월 무이자 할부를 제공하고 있습니다. 단, 일부 상품은 할부가 제한될 수 있습니다.',
        date: '2024-01-10',
        isFrequent: true
    },
    {
        id: 3,
        category: '주문/결제',
        question: '주문 취소는 언제까지 가능한가요?',
        answer: '상품 출고 전까지 언제든지 주문 취소가 가능합니다. 출고 후에는 반품 신청을 해주세요.',
        date: '2024-01-08',
        isFrequent: false
    },
    {
        id: 4,
        category: '주문/결제',
        question: '포인트나 쿠폰을 중복 사용할 수 있나요?',
        answer: '포인트와 쿠폰은 중복 사용이 가능합니다. 단, 동일한 종류의 쿠폰은 중복 사용이 불가능합니다.',
        date: '2024-01-05',
        isFrequent: false
    },
    {
        id: 5,
        category: '주문/결제',
        question: '해외 배송도 가능한가요?',
        answer: '현재는 국내 배송만 제공하고 있습니다. 해외 배송 서비스는 추후 준비 중입니다.',
        date: '2024-01-03',
        isFrequent: false
    },

    // 배송 관련 (4개)
    {
        id: 6,
        category: '배송',
        question: '배송은 얼마나 걸리나요?',
        answer: '일반 배송은 2-3일, 빠른 배송은 1-2일 소요됩니다. 단, 도서산간 지역은 추가 1-2일이 소요될 수 있습니다.',
        date: '2024-01-12',
        isFrequent: true
    },
    {
        id: 7,
        category: '배송',
        question: '배송 조회는 어떻게 하나요?',
        answer: '마이페이지 > 주문내역에서 주문번호를 클릭하시면 실시간 배송 조회가 가능합니다.',
        date: '2024-01-09',
        isFrequent: false
    },
    {
        id: 8,
        category: '배송',
        question: '부재 시 택배는 어떻게 되나요?',
        answer: '1차 배송 실패 시 2회 재시도 후, 3일간 보관됩니다. 보관 기간 내 수령하지 않으시면 자동 반송됩니다.',
        date: '2024-01-07',
        isFrequent: false
    },
    {
        id: 9,
        category: '배송',
        question: '배송비는 얼마인가요?',
        answer: '3만원 이상 구매 시 무료배송, 3만원 미만 구매 시 3,000원의 배송비가 부과됩니다.',
        date: '2024-01-04',
        isFrequent: true
    },

    // 반품/교환 관련 (4개)
    {
        id: 10,
        category: '반품/교환',
        question: '반품/교환 기간은 얼마인가요?',
        answer: '상품 수령 후 7일 이내에 반품/교환이 가능합니다. 단, 상품의 상태가 구매 시와 동일해야 합니다.',
        date: '2024-01-14',
        isFrequent: true
    },
    {
        id: 11,
        category: '반품/교환',
        question: '반품 배송비는 누가 부담하나요?',
        answer: '단순 변심의 경우 고객 부담, 상품 하자의 경우 저희가 부담합니다. 반품 사유에 따라 다릅니다.',
        date: '2024-01-11',
        isFrequent: true
    },
    {
        id: 12,
        category: '반품/교환',
        question: '교환 시 사이즈 변경도 가능한가요?',
        answer: '네, 가능합니다. 단, 원하시는 사이즈의 재고가 있어야 하며, 교환 신청 시 재고 확인 후 진행됩니다.',
        date: '2024-01-06',
        isFrequent: false
    },
    {
        id: 13,
        category: '반품/교환',
        question: '반품 신청은 어떻게 하나요?',
        answer: '마이페이지 > 주문내역에서 반품 신청 버튼을 클릭하시거나, 고객센터로 연락주시면 도움드리겠습니다.',
        date: '2024-01-02',
        isFrequent: false
    },

    // 상품문의 관련 (3개)
    {
        id: 14,
        category: '상품문의',
        question: '상품의 재질이 궁금합니다.',
        answer: '각 상품 상세 페이지에서 재질 정보를 확인하실 수 있습니다. 추가 문의사항이 있으시면 상품 문의를 이용해주세요.',
        date: '2024-01-13',
        isFrequent: false
    },
    {
        id: 15,
        category: '상품문의',
        question: '상품의 사이즈 가이드가 있나요?',
        answer: '네, 각 상품 페이지 하단에 상세한 사이즈 가이드를 제공하고 있습니다. 측정 방법도 함께 안내드립니다.',
        date: '2024-01-08',
        isFrequent: false
    },
    {
        id: 16,
        category: '상품문의',
        question: '재고가 없는데 언제 입고되나요?',
        answer: '재고 입고 일정은 상품마다 다릅니다. 관심 상품으로 등록하시면 입고 시 알림을 받으실 수 있습니다.',
        date: '2024-01-05',
        isFrequent: false
    },

    // 회원정보 관련 (2개)
    {
        id: 17,
        category: '회원정보',
        question: '비밀번호를 잊어버렸어요.',
        answer: '로그인 페이지의 "비밀번호 찾기"를 이용하시거나, 고객센터로 연락주시면 도움드리겠습니다.',
        date: '2024-01-10',
        isFrequent: false
    },
    {
        id: 18,
        category: '회원정보',
        question: '회원 탈퇴는 어떻게 하나요?',
        answer: '마이페이지 > 회원정보 수정에서 회원 탈퇴가 가능합니다. 탈퇴 시 모든 정보가 삭제되니 신중히 결정해주세요.',
        date: '2024-01-07',
        isFrequent: false
    },

    // 기타 (2개)
    {
        id: 19,
        category: '기타',
        question: '개인정보 보호 정책은 어떻게 되나요?',
        answer: '고객의 개인정보는 엄격하게 보호되며, 수집 목적 외에는 사용하지 않습니다. 자세한 내용은 개인정보처리방침을 참고해주세요.',
        date: '2024-01-09',
        isFrequent: false
    },
    {
        id: 20,
        category: '기타',
        question: '제휴 문의는 어떻게 하나요?',
        answer: '제휴 문의는 고객센터 이메일로 연락주시거나, 홈페이지 하단의 "제휴 문의" 메뉴를 이용해주세요.',
        date: '2024-01-04',
        isFrequent: false
    }
];

// 카테고리별 필터링 함수
export const getQAByCategory = (category: string) => {
    if (category === '전체') return qaData;
    return qaData.filter(qa => qa.category === category);
};

// 자주 묻는 질문 필터링 함수
export const getFrequentQA = () => {
    return qaData.filter(qa => qa.isFrequent);
};

// 검색 함수
export const searchQA = (keyword: string) => {
    return qaData.filter(qa => 
        qa.question.toLowerCase().includes(keyword.toLowerCase()) ||
        qa.answer.toLowerCase().includes(keyword.toLowerCase())
    );
}; 