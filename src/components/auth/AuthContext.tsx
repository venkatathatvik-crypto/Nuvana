
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, authService } from '@/lib/auth';
import { toast } from 'sonner';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, role: UserRole) => Promise<void>;
    signup: (name: string, email: string, role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = authService.getUser();
                if (storedUser) {
                    setUser(storedUser);
                }
            } catch (error) {
                console.error('Auth initialization failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, role: UserRole) => {
        try {
            const user = await authService.login(email, role);
            setUser(user);
            toast.success(`Welcome back, ${user.name}!`);
        } catch (error) {
            toast.error('Login failed. Please try again.');
            throw error;
        }
    };

    const signup = async (name: string, email: string, role: UserRole) => {
        try {
            const user = await authService.signup(name, email, role);
            setUser(user);
            toast.success(`Welcome to Nuvana360, ${user.name}!`);
        } catch (error) {
            toast.error('Signup failed. Please try again.');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
