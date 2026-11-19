/**
 * Context para manejo global de autenticación
 * Unificado con dev-clase-2, dev-clase-4 y dev-clase-6
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { User, UpdateUserData } from '../types/user';
import * as authApi from '../api/auth.api';
import { saveAccessToken, saveRefreshToken, getAccessToken, clearTokens } from '../utils/storage';
import { handleApiError, ApiError } from '../utils/errorHandler';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    studentData?: {
      nombre?: string;
      apellido_paterno?: string;
      apellido_materno?: string;
      matricula?: string;
    }
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const token = await getAccessToken();
      if (!token || token === 'undefined' || token === 'null') {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      setLoading(true);
      const currentUser = await authApi.getCurrentUser();
      if (currentUser && currentUser.id) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });
      const accessToken = response.accessToken || response.token;

      if (accessToken) {
        await saveAccessToken(accessToken);
      }
      if (response.refreshToken) {
        await saveRefreshToken(response.refreshToken);
      }

      const userData = response.user || { id: 1, email };
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      studentData?: {
        nombre?: string;
        apellido_paterno?: string;
        apellido_materno?: string;
        matricula?: string;
      }
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await authApi.register({
          email,
          password,
          rol_id: 1,
          ...studentData,
        });
        return await login(email, password);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignorar errores de logout
    } finally {
      await clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...userData } : (userData as User)));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    clearError,
  }), [user, loading, error, isAuthenticated, login, register, logout, updateUser, checkAuth, clearError]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
