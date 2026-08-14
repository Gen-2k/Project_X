import type { AuthResponseDto, LogoutResponseDto, UserDto } from '@project/shared';
import type { JSX, ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { apiClient, ApiError } from '../lib/api-client';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const userData = await apiClient.get<UserDto>('/auth/me');
      setUser(userData);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        setUser(null);
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<AuthResponseDto>('/auth/login', {
        email,
        password,
      });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string): Promise<void> => {
      setIsLoading(true);
      try {
        const response = await apiClient.post<AuthResponseDto>('/auth/register', {
          email,
          password,
          name,
        });
        setUser(response.user);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await apiClient.post<LogoutResponseDto>('/auth/logout');
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
