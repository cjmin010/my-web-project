import { hashPassword, verifyPassword } from '@/lib/crypto';
import { getSecuritySettings } from '@/lib/security';

export interface User {
    id: string;
    password: string; // SHA256 해시된 비밀번호
    name: string;
    email: string;
    phone: string;
    address: string;
    addressDetail: string;
    zipCode: string;
    role: 'user' | 'admin';
    createdAt: string;
    isActive: boolean;
    isRejected: boolean; // 거절된 회원가입 신청 여부
    failedLoginAttempts: number;
    isLocked: boolean;
    mustChangePassword?: boolean; // 사용자가 다음 로그인 시 비밀번호를 변경해야 하는지 여부
}

// 초기 사용자 데이터 (비밀번호는 앱 시작 시 해싱됩니다)
const initialUsersData: (Partial<User> & { id: string; password?: string, role: 'user' | 'admin' })[] = [
    {
        id: 'admin',
        password: 'admin',
        name: '관리자',
        email: 'admin@example.com',
        phone: '010-0000-0000',
        address: '서울특별시 강남구',
        addressDetail: '테헤란로 123',
        zipCode: '06123',
        role: 'admin',
        createdAt: '2024-01-01',
        isActive: true,
        isRejected: false,
    },
    {
        id: 'aaa',
        password: 'aaa',
        name: '김철수',
        email: 'aaa@example.com',
        phone: '010-1111-1111',
        address: '서울특별시 서초구',
        addressDetail: '강남대로 456',
        zipCode: '06611',
        role: 'user',
        createdAt: '2024-01-15',
        isActive: true,
    },
    {
        id: 'bbb',
        password: 'bbb',
        name: '이영희',
        email: 'bbb@example.com',
        phone: '010-2222-2222',
        address: '서울특별시 마포구',
        addressDetail: '홍대로 789',
        zipCode: '04039',
        role: 'user',
        createdAt: '2024-01-20',
        isActive: true,
    },
    {
        id: 'ccc',
        password: 'ccc',
        name: '씨씨씨',
        email: 'ccc@example.com',
        phone: '010-3333-3333',
        address: '주소 미입력',
        role: 'user',
        createdAt: '2024-05-25',
        isActive: false, // 회원가입 승인 대기
    }
];

// 로컬 스토리지 키
const USERS_STORAGE_KEY = 'mini_store_users';
const CURRENT_USER_KEY = 'mini_store_current_user';
const USERS_VERSION_KEY = 'mini_store_users_version';
const CURRENT_VERSION = '1.10'; // 데이터 구조 변경 시 이 버전을 올립니다.

// 메모리 내 사용자 캐시
let usersCache: User[] | null = null;

// 초기 사용자 데이터를 동기적으로 생성 (서버 사이드 및 초기 클라이언트 렌더링용)
// 비밀번호 해싱과 같은 비동기 작업은 포함하지 않음
const getInitialUsersSynchronously = (): User[] => {
    return initialUsersData.map(user => ({
        id: user.id,
        password: user.password || '', // 초기에는 해싱되지 않은 값 또는 빈 문자열
        name: user.name || 'N/A',
        email: user.email || 'N/A',
        phone: user.phone || 'N/A',
        address: user.address || 'N/A',
        addressDetail: user.addressDetail || '',
        zipCode: user.zipCode || '',
        role: user.role,
        createdAt: user.createdAt || new Date().toISOString().split('T')[0],
        isActive: user.isActive === undefined ? true : user.isActive,
        isRejected: user.isRejected === undefined ? false : user.isRejected,
        failedLoginAttempts: 0,
        isLocked: false,
        mustChangePassword: false,
    }));
};

// 사용자 데이터 초기화 함수 (클라이언트 사이드 비동기)
const initializeUsers = async (): Promise<User[]> => {
    const hashedUsers = await Promise.all(
        initialUsersData.map(async (user) => {
            const hashedPassword = await hashPassword(user.password || '');
            return {
                id: user.id,
                password: hashedPassword,
                name: user.name || 'N/A',
                email: user.email || 'N/A',
                phone: user.phone || 'N/A',
                address: user.address || 'N/A',
                addressDetail: user.addressDetail || '',
                zipCode: user.zipCode || '',
                role: user.role,
                createdAt: user.createdAt || new Date().toISOString().split('T')[0],
                isActive: user.isActive === undefined ? true : user.isActive,
                isRejected: user.isRejected === undefined ? false : user.isRejected,
                failedLoginAttempts: 0,
                isLocked: false,
                mustChangePassword: false,
            };
        })
    );
    saveUsers(hashedUsers);
    return hashedUsers;
};

// 사용자 데이터 관리 함수들
export const getUsers = (): User[] => {
    // 서버 사이드 (API 라우트 등)
    if (typeof window === 'undefined') {
        if (usersCache) {
            return usersCache;
        }
        // 서버에서는 항상 동기적으로 초기 사용자 목록을 반환
        usersCache = getInitialUsersSynchronously();
        return usersCache;
    }

    // 클라이언트 사이드
    if (usersCache) {
        return usersCache;
    }

    const storedVersion = localStorage.getItem(USERS_VERSION_KEY);
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

    if (!storedUsers || storedVersion !== CURRENT_VERSION) {
        console.log("Initializing or updating user data in localStorage.");
        const initialUsers = getInitialUsersSynchronously();
        usersCache = initialUsers; // 먼저 동기 데이터로 캐시 채우기

        // 백그라운드에서 비동기 해싱 및 저장
        initializeUsers().then(hashedUsers => {
            usersCache = hashedUsers; // 해싱된 데이터로 캐시 업데이트
        });
        
        return initialUsers; // 동기적으로 초기 데이터 우선 반환
    }
    
    try {
        const parsedUsers: User[] = JSON.parse(storedUsers);
        usersCache = parsedUsers;
        return parsedUsers;
    } catch (error) {
        console.error("로컬 스토리지에서 사용자 정보를 파싱하는 데 실패했습니다.", error);
        localStorage.removeItem(USERS_STORAGE_KEY);
        // 비동기 초기화 실행
        initializeUsers().then(hashedUsers => {
            usersCache = hashedUsers;
        });
        // 일단 빈 배열 반환, UI는 Context에 따라 리렌더링 될 것
        return [];
    }
};

export const saveUsers = (users: User[]) => {
    // 메모리 캐시 업데이트
    usersCache = users;

    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(USERS_VERSION_KEY, CURRENT_VERSION);
};

export const addUser = async (userData: Omit<User, 'createdAt' | 'failedLoginAttempts' | 'isLocked' | 'mustChangePassword'>) => {
    const users = getUsers();

    if (users.some(u => u.id === userData.id)) {
        throw new Error('이미 존재하는 ID입니다.');
    }

    const hashedPassword = await hashPassword(userData.password);

    const newUser: User = {
        ...userData,
        password: hashedPassword,
        createdAt: new Date().toISOString().split('T')[0],
        failedLoginAttempts: 0,
        isLocked: false,
        mustChangePassword: false,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    return newUser;
};

export const updateUser = async (id: string, updates: Partial<User>) => {
    let users = getUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        throw new Error('사용자를 찾을 수 없습니다.');
    }

    const updatedUser = { ...users[userIndex], ...updates };

    if (updates.password && updates.password !== users[userIndex].password) {
        updatedUser.password = await hashPassword(updates.password);
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;
    
    saveUsers(updatedUsers);
    return updatedUser;
};

export const deleteUser = (id: string) => {
    const users = getUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    saveUsers(filteredUsers);
};

export const loginUser = async (id: string, password: string): Promise<{ success: boolean; message: string; user?: User | null }> => {
    const users = getUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) {
        return { success: false, message: 'ID 또는 비밀번호가 올바르지 않습니다.' };
    }
    
    if (!user.isActive) {
        return { success: false, message: '비활성화된 계정입니다.' };
    }

    if (user.isLocked) {
        return { success: false, message: '계정이 잠겼습니다. 관리자에게 문의하세요.' };
    }

    const settings = getSecuritySettings();
    const isValidPassword = await verifyPassword(password, user.password);

    if (isValidPassword) {
        const updatedUser = { ...user, failedLoginAttempts: 0 };
        await updateUser(id, { failedLoginAttempts: 0 });
        return { success: true, message: '로그인 성공', user: updatedUser };
    } else {
        const newAttempts = user.failedLoginAttempts + 1;
        let message = `ID 또는 비밀번호가 올바르지 않습니다. (남은 시도: ${settings.maxLoginAttempts - newAttempts}회)`;
        let isLocked: boolean = user.isLocked;

        if (newAttempts >= settings.maxLoginAttempts) {
            isLocked = true;
            message = `로그인 시도 횟수를 초과하여 계정이 잠겼습니다. (${settings.maxLoginAttempts}회 초과)`;
        }
        
        await updateUser(id, { failedLoginAttempts: newAttempts, isLocked });
        return { success: false, message: message };
    }
};

export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    try {
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

export const setCurrentUser = (user: User | null) => {
    if (typeof window === 'undefined') return;
    
    if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(CURRENT_USER_KEY);
    }
};

export const logoutUser = () => {
    setCurrentUser(null);
};

export const validateUserId = (id: string): string | null => {
    if (id.length < 4) return 'ID는 4자 이상이어야 합니다.';
    if (id.length > 20) return 'ID는 20자 이하여야 합니다.';
    if (!/^[a-zA-Z0-9_]+$/.test(id)) return 'ID는 영문, 숫자, 언더스코어만 사용 가능합니다.';
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (password.length < 4) return '비밀번호는 4자 이상이어야 합니다.';
    // 정규식: 최소 8자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수 문자
    // if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
    //     return '비밀번호는 최소 8자, 하나 이상의 문자, 숫자, 특수문자를 포함해야 합니다.';
    // }
    return null;
};

export const validateEmail = (email: string): string | null => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '유효하지 않은 이메일 주소입니다.';
    return null;
};

export const validatePhone = (phone: string): string | null => {
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) return '유효하지 않은 전화번호 형식입니다. (예: 010-1234-5678)';
    return null;
}; 