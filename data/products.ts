export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: 'clothing' | 'electronics' | 'books';
    rating: number;
    stock: number;
}

export const products: Product[] = [
    // 의류
    { id: 1, name: '남성용 클래식 티셔츠', description: '부드러운 면 소재로 제작된 클래식한 디자인의 티셔츠입니다. 어떤 스타일에도 잘 어울립니다.', price: 25000, image: 'https://picsum.photos/seed/classic-t-shirt/400/400', category: 'clothing', rating: 4.5, stock: 0 },
    { id: 2, name: '여성용 스키니진', description: '신축성이 뛰어나고 몸매를 잡아주는 편안한 착용감의 스키니진입니다.', price: 78000, image: 'https://picsum.photos/seed/skinny-jeans/400/400', category: 'clothing', rating: 4.8, stock: 10 },
    { id: 3, name: '유니섹스 후드티', description: '기모 안감으로 따뜻하며, 넉넉한 핏으로 남녀 모두에게 사랑받는 아이템입니다.', price: 55000, image: 'https://picsum.photos/seed/hoodie/400/400', category: 'clothing', rating: 4.6, stock: 10 },
    { id: 4, name: '스포츠 양말 (3팩)', description: '땀 흡수와 통기성이 뛰어난 기능성 스포츠 양말 세트입니다. 발목을 안정적으로 잡아줍니다.', price: 15000, image: 'https://picsum.photos/seed/sports-socks/400/400', category: 'clothing', rating: 4.2, stock: 10 },
    { id: 5, name: '가죽 벨트', description: '고급 천연 가죽으로 제작되어 내구성이 좋고 클래식한 멋을 더해주는 벨트입니다.', price: 42000, image: 'https://picsum.photos/seed/leather-belt/400/400', category: 'clothing', rating: 4.9, stock: 10 },
    { id: 6, name: '여름용 린넨 셔츠', description: '시원하고 가벼운 린넨 소재로 제작되어 여름철에도 쾌적하게 착용할 수 있습니다.', price: 62000, image: 'https://picsum.photos/seed/linen-shirt/400/400', category: 'clothing', rating: 4.7, stock: 10 },
    { id: 7, name: '겨울 패딩 점퍼', description: '가볍지만 보온성이 뛰어난 충전재를 사용하여 한겨울에도 따뜻함을 유지해줍니다.', price: 180000, image: 'https://picsum.photos/seed/padding-jumper/400/400', category: 'clothing', rating: 4.9, stock: 10 },
    // 전자제품
    { id: 8, name: '최신형 스마트폰', description: '선명한 디스플레이와 강력한 성능을 자랑하는 최신 스마트폰. 최고의 사용자 경험을 제공합니다.', price: 1200000, image: 'https://picsum.photos/seed/smartphone/400/400', category: 'electronics', rating: 4.9, stock: 10 },
    { id: 9, name: '노이즈캔슬링 헤드폰', description: '주변 소음을 완벽하게 차단하여 몰입감 있는 사운드를 즐길 수 있는 헤드폰입니다.', price: 350000, image: 'https://picsum.photos/seed/headphones/400/400', category: 'electronics', rating: 4.8, stock: 10 },
    { id: 10, name: '4K 울트라 HD TV', description: '생생한 화질과 풍부한 색감으로 현실감 넘치는 시청 경험을 선사하는 4K TV입니다.', price: 2500000, image: 'https://picsum.photos/seed/4k-tv/400/400', category: 'electronics', rating: 4.9, stock: 10 },
    { id: 11, name: '게이밍 노트북', description: '고성능 그래픽 카드와 빠른 처리 속도로 최상의 게임 환경을 제공하는 노트북입니다.', price: 1800000, image: 'https://picsum.photos/seed/gaming-laptop/400/400', category: 'electronics', rating: 4.7, stock: 10 },
    { id: 12, name: '스마트 워치', description: '건강 관리부터 일정 관리까지, 당신의 일상을 더욱 스마트하게 만들어 줄 파트너입니다.', price: 450000, image: 'https://picsum.photos/seed/smart-watch/400/400', category: 'electronics', rating: 4.6, stock: 10 },
    { id: 13, name: '블루투스 스피커', description: '작지만 강력한 사운드를 자랑하는 휴대용 블루투스 스피커. 어디서나 풍부한 음악을 즐기세요.', price: 120000, image: 'https://picsum.photos/seed/bluetooth-speaker/400/400', category: 'electronics', rating: 4.5, stock: 10 },
    { id: 14, name: '태블릿 PC', description: '업무와 여가를 한번에 즐길 수 있는 다재다능한 태블릿. 선명한 화면과 긴 배터리 수명.', price: 850000, image: 'https://picsum.photos/seed/tablet-pc/400/400', category: 'electronics', rating: 4.7, stock: 10 },
    // 책
    { id: 15, name: 'JavaScript 마스터하기', description: '자바스크립트의 핵심 개념부터 실전 활용까지, 개발자 필독서. 코딩 실력을 한 단계 업그레이드하세요.', price: 32000, image: 'https://picsum.photos/seed/js-book/400/400', category: 'books', rating: 4.9, stock: 10 },
    { id: 16, name: '요리 초보를 위한 레시피', description: '누구나 쉽게 따라 할 수 있는 기본 레시피부터 특별한 날을 위한 요리까지. 요리의 즐거움을 느껴보세요.', price: 22000, image: 'https://picsum.photos/seed/recipe-book/400/400', category: 'books', rating: 4.7, stock: 10 },
    { id: 17, name: '미스터리 소설: 그림자 살인', description: '손에 땀을 쥐게 하는 반전과 치밀한 구성이 돋보이는 미스터리 스릴러. 마지막 페이지까지 긴장을 놓을 수 없다.', price: 18000, image: 'https://picsum.photos/seed/mystery-novel/400/400', category: 'books', rating: 4.5, stock: 10 },
    { id: 18, name: 'SF 대서사시: 은하수를 넘어서', description: '광활한 우주를 배경으로 펼쳐지는 장대한 모험과 감동적인 이야기. 상상력의 한계를 뛰어넘는 작품.', price: 21000, image: 'https://picsum.photos/seed/sf-novel/400/400', category: 'books', rating: 4.8, stock: 10 },
    { id: 19, name: '아이들을 위한 동화책', description: '교훈과 재미를 동시에 선사하는 아름다운 그림과 따뜻한 이야기가 담긴 동화책 모음.', price: 15000, image: 'https://picsum.photos/seed/kids-book/400/400', category: 'books', rating: 4.6, stock: 10 },
    { id: 20, name: '세계사 완전정복', description: '복잡한 세계사를 쉽고 재미있게 풀어낸 역사 필독서. 전체 흐름을 꿰뚫는 통찰력을 얻을 수 있습니다.', price: 45000, image: 'https://picsum.photos/seed/history-book/400/400', category: 'books', rating: 4.9, stock: 10 },
    // 추가 상품
    { id: 21, name: '캐주얼 데님 자켓', description: '어떤 옷에도 잘 어울리는 스타일리시한 데님 자켓입니다. 사계절 내내 활용하기 좋습니다.', price: 89000, image: 'https://picsum.photos/seed/denim-jacket/400/400', category: 'clothing', rating: 4.7, stock: 15 },
    { id: 22, name: '무선 충전 패드', description: '케이블 없이 간편하게 스마트폰을 충전하세요. 고속 충전을 지원합니다.', price: 29000, image: 'https://picsum.photos/seed/wireless-charger/400/400', category: 'electronics', rating: 4.6, stock: 20 },
    { id: 23, name: '여행 에세이: 낯선 곳에서 나를 만나다', description: '세계를 여행하며 겪은 감동적인 순간과 깨달음을 담은 에세이집입니다.', price: 16000, image: 'https://picsum.photos/seed/travel-essay/400/400', category: 'books', rating: 4.8, stock: 12 },
    { id: 24, name: '코튼 블렌드 스웨터', description: '부드러운 촉감의 코튼 스웨터로, 간절기에 입기 좋은 데일리 아이템입니다.', price: 65000, image: 'https://picsum.photos/seed/cotton-sweater/400/400', category: 'clothing', rating: 4.5, stock: 18 },
    { id: 25, name: '휴대용 미니 빔프로젝터', description: '언제 어디서나 나만의 영화관을 만들어보세요. 작지만 선명한 화질을 자랑합니다.', price: 280000, image: 'https://picsum.photos/seed/mini-projector/400/400', category: 'electronics', rating: 4.7, stock: 8 },
]; 