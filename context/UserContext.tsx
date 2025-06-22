'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, setCurrentUser, loginUser, logoutUser as logoutUserFunc } from '@/data/users';
import { addLog } from '@/data/logs';

interface UserContextType {
    user: User | null;
    login: (id: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 페이지 로드 시 저장된 사용자 정보 복원
        const savedUser = getCurrentUser();
        setUser(savedUser);
        setIsLoading(false);
    }, []);

    const login = async (id: string, password: string) => {
        try {
            const result = await loginUser(id, password);
            if (result.success && result.user) {
                setUser(result.user);
                setCurrentUser(result.user);
                addLog(result.user.id, 'login');
            }
            return { success: result.success, message: result.message };
        } catch (error) {
            const message = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.';
            return { success: false, message };
        }
    };

    const logout = () => {
        if (user) {
            addLog(user.id, 'logout');
        }
        setUser(null);
        logoutUserFunc();
    };

    const value = {
        user,
        login,
        logout,
        isLoading
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}; 