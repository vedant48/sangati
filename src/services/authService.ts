// Authentication Service

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_PROFILE_KEY = '@companion_ride_mock_user';

export const DEFAULT_DEMO_USER: Profile = {
  id: '11111111-1111-1111-1111-111111111111',
  full_name: 'Rahul Kumar',
  username: 'rahulk',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  phone: '+91 9876543210',
  bio: 'Daily tech commuter. Quiet rides, punctual, fond of classic rock.',
  gender: 'male',
  rating: 4.9,
  total_ratings: 24,
  total_trips: 38,
  is_phone_verified: true,
  is_identity_verified: true,
  emergency_contact_name: 'Amit Kumar',
  emergency_contact_phone: '+91 9811223344',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function getCurrentProfile(userId?: string): Promise<Profile | null> {
  const cached = await AsyncStorage.getItem(MOCK_PROFILE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore JSON parse errors
    }
  }

  if (!isSupabaseConfigured) {
    return DEFAULT_DEMO_USER;
  }

  try {
    const uid = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Profile;
  } catch (err) {
    console.warn('Error fetching profile:', err);
    return null;
  }
}

export async function updateProfile(profileUpdates: Partial<Profile>): Promise<Profile> {
  if (!isSupabaseConfigured) {
    const current = (await getCurrentProfile()) || DEFAULT_DEMO_USER;
    const updated = { ...current, ...profileUpdates, updated_at: new Date().toISOString() };
    await AsyncStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  }

  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    const current = (await getCurrentProfile()) || DEFAULT_DEMO_USER;
    const updated = { ...current, ...profileUpdates, updated_at: new Date().toISOString() };
    await AsyncStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ ...profileUpdates, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function signInWithEmail(email: string, password: string): Promise<Profile> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        const profile = await getCurrentProfile(data.user.id);
        if (profile) {
          await AsyncStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));
          return profile;
        }
      }
    } catch (err) {
      console.warn('Supabase auth failed, using demo session:', err);
    }
  }

  // Fallback demo user session
  const cleanName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const mock: Profile = {
    ...DEFAULT_DEMO_USER,
    full_name: cleanName || DEFAULT_DEMO_USER.full_name,
    username: email.split('@')[0],
  };
  await AsyncStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(mock));
  return mock;
}

export async function signUpWithEmail(email: string, password: string, fullName: string): Promise<Profile> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: email.split('@')[0],
          },
        },
      });

      if (!error && data?.user) {
        const profile = await getCurrentProfile(data.user.id);
        if (profile) {
          await AsyncStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(profile));
          return profile;
        }
      }
    } catch (err) {
      console.warn('Supabase sign-up fallback:', err);
    }
  }

  const mock: Profile = {
    ...DEFAULT_DEMO_USER,
    id: `user_${Date.now()}`,
    full_name: fullName,
    username: email.split('@')[0],
  };
  await AsyncStorage.setItem(MOCK_PROFILE_KEY, JSON.stringify(mock));
  return mock;
}

export async function resetPasswordForEmail(email: string) {
  if (!isSupabaseConfigured) {
    return { success: true };
  }
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  } catch {
    // Ignore in demo
  }
  return { success: true };
}

export async function signOut() {
  await AsyncStorage.removeItem(MOCK_PROFILE_KEY);
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors
    }
  }
}
