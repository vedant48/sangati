// Auth Context & Session Provider

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Profile } from '../types';
import {
  getCurrentProfile,
  signOut as authSignOut,
  updateProfile as updateProfileService,
  signInWithEmail,
  signUpWithEmail,
} from '../services/authService';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<any>;
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
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await getCurrentProfile(session.user.id);
        if (profile) {
          setUser(profile);
        } else {
          const userMeta = session.user.user_metadata || {};
          setUser({
            id: session.user.id,
            full_name: userMeta.full_name || session.user.email?.split('@')[0] || 'User',
            username: userMeta.username || session.user.email?.split('@')[0] || `user_${session.user.id.slice(0, 6)}`,
            avatar_url: userMeta.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
            phone: userMeta.phone || session.user.phone || null,
            bio: '',
            gender: null,
            date_of_birth: null,
            rating: 5.0,
            total_ratings: 0,
            total_trips: 0,
            is_phone_verified: Boolean(session.user.phone_confirmed_at),
            is_identity_verified: false,
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const profile = await signInWithEmail(email, password);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const res = await signUpWithEmail(email, password, fullName);
      if (res.profile) {
        setUser(res.profile);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authSignOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
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
        signup,
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

