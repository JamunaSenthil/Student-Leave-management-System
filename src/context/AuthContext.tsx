import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, StudentRegisterData } from '../services/authService.ts';

export type UserRole = 'student' | 'hod' | 'warden';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  hostel?: string;
  registerNumber?: string;
  phone?: string;
  roomNumber?: string;
  year?: string;
  section?: string;
  officeRoom?: string;
  block?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => Promise<void>;
  updateUser: (updatedData: Partial<UserProfile>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('slms_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('slms_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (newToken: string, newUser: UserProfile) => {
    localStorage.setItem('slms_token', newToken);
    localStorage.setItem('slms_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout API call finished with:', e);
    } finally {
      localStorage.removeItem('slms_token');
      localStorage.removeItem('slms_user');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('slms_user', JSON.stringify(merged));
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('slms_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('slms_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('slms_user', JSON.stringify(res.user));
          } else {
            localStorage.removeItem('slms_token');
            localStorage.removeItem('slms_user');
            setUser(null);
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem('slms_token');
          localStorage.removeItem('slms_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
