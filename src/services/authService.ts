// Authentication Service

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';

export async function getCurrentProfile(userId?: string): Promise<Profile | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return null;
    }

    const authUser = userData.user;
    const uid = userId || authUser.id;
    const metadata = authUser.user_metadata || {};

    const fallbackProfile: Profile = {
      id: uid,
      full_name: metadata.full_name || authUser.email?.split('@')[0] || 'User',
      username: metadata.username || authUser.email?.split('@')[0] || `user_${uid.slice(0, 6)}`,
      avatar_url: metadata.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      phone: metadata.phone || authUser.phone || null,
      bio: '',
      gender: null,
      date_of_birth: null,
      rating: 5.0,
      total_ratings: 0,
      total_trips: 0,
      is_phone_verified: Boolean(authUser.phone_confirmed_at),
      is_identity_verified: false,
      created_at: authUser.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (!error && data) {
        return data as Profile;
      }

      // If profiles table exists and row is missing, attempt to upsert
      if (!error && !data) {
        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .upsert(fallbackProfile)
          .select()
          .single();

        if (!insertError && inserted) {
          return inserted as Profile;
        }
      }
    } catch (dbErr) {
      console.warn('Profiles table query failed, using auth profile:', dbErr);
    }

    return fallbackProfile;
  } catch (err) {
    console.warn('Error in getCurrentProfile:', err);
    return null;
  }
}

export async function updateProfile(profileUpdates: Partial<Profile>): Promise<Profile> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    throw new Error('Not authenticated');
  }

  // Update Supabase auth user_metadata
  try {
    await supabase.auth.updateUser({
      data: {
        full_name: profileUpdates.full_name,
        bio: profileUpdates.bio,
        gender: profileUpdates.gender,
        emergency_contact_name: profileUpdates.emergency_contact_name,
        emergency_contact_phone: profileUpdates.emergency_contact_phone,
      },
    });
  } catch (metaErr) {
    console.warn('Auth user metadata update failed:', metaErr);
  }

  // Attempt upserting to public.profiles table
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userData.user.id,
        ...profileUpdates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && data) {
      return data as Profile;
    }
  } catch (dbErr) {
    console.warn('Profiles table update failed, updating session profile:', dbErr);
  }

  const current = (await getCurrentProfile(userData.user.id)) || {
    id: userData.user.id,
    full_name: profileUpdates.full_name || 'User',
    username: userData.user.email?.split('@')[0] || `user_${userData.user.id.slice(0, 6)}`,
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    phone: profileUpdates.phone || null,
    bio: profileUpdates.bio || '',
    gender: profileUpdates.gender || null,
    date_of_birth: null,
    rating: 5.0,
    total_ratings: 0,
    total_trips: 0,
    is_phone_verified: false,
    is_identity_verified: false,
    emergency_contact_name: profileUpdates.emergency_contact_name || null,
    emergency_contact_phone: profileUpdates.emergency_contact_phone || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return { ...current, ...profileUpdates, updated_at: new Date().toISOString() };
}

export async function signInWithEmail(email: string, password: string): Promise<Profile> {
  const cleanEmail = email.trim();
  const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.user) {
    throw new Error('Unable to sign in. Please check your credentials.');
  }

  const profile = await getCurrentProfile(data.user.id);
  if (!profile) {
    const metadata = data.user.user_metadata || {};
    return {
      id: data.user.id,
      full_name: metadata.full_name || cleanEmail.split('@')[0],
      username: metadata.username || cleanEmail.split('@')[0],
      avatar_url: metadata.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
      phone: metadata.phone || data.user.phone || null,
      bio: '',
      gender: null,
      date_of_birth: null,
      rating: 5.0,
      total_ratings: 0,
      total_trips: 0,
      is_phone_verified: Boolean(data.user.phone_confirmed_at),
      is_identity_verified: false,
      created_at: data.user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  return profile;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string
): Promise<{ profile: Profile | null; session: any; user: any }> {
  const cleanEmail = email.trim();
  const cleanName = fullName.trim();
  const username = cleanEmail.split('@')[0];

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        full_name: cleanName,
        username,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  let profile: Profile | null = null;
  if (data?.user) {
    // Attempt creating or fetching profile
    profile = await getCurrentProfile(data.user.id);
  }

  return {
    profile,
    session: data.session,
    user: data.user,
  };
}

export async function resetPasswordForEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
  if (error) {
    throw new Error(error.message);
  }
  return { success: true };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.warn('Error signing out of Supabase:', error.message);
  }
}



