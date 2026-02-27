import React, { createContext, useState, useEffect, useContext } from 'react';
import type { User } from '../types';
import { Role } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    isAdmin: boolean;
    isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        return (savedUser && token) ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Just verify if token is still valid if needed, otherwise stay false
        setLoading(false);
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const isAdmin = user?.role === Role.ADMIN;
    const isStudent = user?.role === Role.STUDENT;

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isStudent }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
