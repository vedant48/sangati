// Auth Context & Session Provider

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '../types';
import { getCurrentProfile, signOut as authSignOut, updateProfile as updateProfileService } from '../services/authService';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<Profile>) => Promise<Profile>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const profile = await getCurrentProfile();
      setUser(profile);
    } catch (err) {
      console.warn('Failed to load user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const profile = await getCurrentProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authSignOut();
    setUser(null);
  };

  const updateUser = async (updates: Partial<Profile>) => {
    const updated = await updateProfileService(updates);
    setUser(updated);
    return updated;
  };

  const refreshUser = async () => {
    const profile = await getCurrentProfile();
    setUser(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
