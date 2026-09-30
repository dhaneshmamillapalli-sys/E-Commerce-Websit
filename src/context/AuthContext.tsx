import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/index.js';
import API from '../services/api.js';
import { useToast } from './ToastContext.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) => Promise<boolean>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'signup';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const { showToast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/me');
      if (res.data.user) {
        setUser(res.data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await API.post('/auth/login', { email, password });
      setUser(res.data.user);
      showToast('Welcome back!', `Signed in as ${res.data.user.name}`, 'success');
      closeAuthModal();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      showToast('Login Failed', msg, 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role = 'USER'): Promise<boolean> => {
    try {
      const res = await API.post('/auth/register', { name, email, password, role });
      setUser(res.data.user);
      showToast('Account Created!', `Welcome to ApexMart, ${res.data.user.name}`, 'success');
      closeAuthModal();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed.';
      showToast('Registration Error', msg, 'error');
      return false;
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
      setUser(null);
      showToast('Logged Out', 'You have been successfully logged out.', 'info');
    } catch {
      setUser(null);
    }
  };

  const updateProfile = async (data: { name?: string; phone?: string; avatar?: string }): Promise<boolean> => {
    try {
      const res = await API.put('/auth/profile', data);
      setUser(res.data.user);
      showToast('Profile Updated', 'Your user information has been saved.', 'success');
      return true;
    } catch (err: any) {
      showToast('Update Failed', err.response?.data?.message || 'Could not update profile', 'error');
      return false;
    }
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
