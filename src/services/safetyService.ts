// Safety, Moderation, and Rating Service

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Rating, Report, ReportReason, BlockedUser } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_BLOCKED_KEY = '@companion_ride_mock_blocked';
const MOCK_RATINGS_KEY = '@companion_ride_mock_ratings';
const MOCK_REPORTS_KEY = '@companion_ride_mock_reports';

export async function submitRating(params: {
  rideId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  review?: string;
}): Promise<Rating> {
  if (params.fromUserId === params.toUserId) {
    throw new Error('You cannot rate yourself.');
  }
  if (params.rating < 1 || params.rating > 5) {
    throw new Error('Rating must be between 1 and 5 stars.');
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('ratings')
      .insert({
        ride_id: params.rideId,
        from_user_id: params.fromUserId,
        to_user_id: params.toUserId,
        rating: params.rating,
        review: params.review,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Rating;
  }

  const newRating: Rating = {
    id: `rate_${Date.now()}`,
    ride_id: params.rideId,
    from_user_id: params.fromUserId,
    to_user_id: params.toUserId,
    rating: params.rating,
    review: params.review,
    created_at: new Date().toISOString(),
  };

  const cached = await getStoredRatings();
  await AsyncStorage.setItem(MOCK_RATINGS_KEY, JSON.stringify([newRating, ...cached]));
  return newRating;
}

export async function reportUser(params: {
  reporterId: string;
  reportedUserId: string;
  rideId?: string;
  reason: ReportReason;
  description?: string;
}): Promise<Report> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        reporter_id: params.reporterId,
        reported_user_id: params.reportedUserId,
        ride_id: params.rideId,
        reason: params.reason,
        description: params.description,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data as Report;
  }

  const newReport: Report = {
    id: `rep_${Date.now()}`,
    reporter_id: params.reporterId,
    reported_user_id: params.reportedUserId,
    ride_id: params.rideId,
    reason: params.reason,
    description: params.description,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  const reports = await getStoredReports();
  await AsyncStorage.setItem(MOCK_REPORTS_KEY, JSON.stringify([newReport, ...reports]));
  return newReport;
}

export async function blockUser(blockerId: string, blockedUserId: string): Promise<BlockedUser> {
  if (blockerId === blockedUserId) {
    throw new Error('You cannot block yourself.');
  }

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('blocked_users')
      .insert({
        blocker_id: blockerId,
        blocked_user_id: blockedUserId,
      })
      .select()
      .single();

    if (error) throw error;
    return data as BlockedUser;
  }

  const newBlocked: BlockedUser = {
    id: `blk_${Date.now()}`,
    blocker_id: blockerId,
    blocked_user_id: blockedUserId,
    created_at: new Date().toISOString(),
  };

  const blockedList = await getBlockedUsers(blockerId);
  await AsyncStorage.setItem(MOCK_BLOCKED_KEY, JSON.stringify([newBlocked, ...blockedList]));
  return newBlocked;
}

export async function unblockUser(blockerId: string, blockedUserId: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase
      .from('blocked_users')
      .delete()
      .eq('blocker_id', blockerId)
      .eq('blocked_user_id', blockedUserId);
    return;
  }

  const list = await getBlockedUsers(blockerId);
  const filtered = list.filter((b) => b.blocked_user_id !== blockedUserId);
  await AsyncStorage.setItem(MOCK_BLOCKED_KEY, JSON.stringify(filtered));
}

export async function getBlockedUsers(blockerId: string): Promise<BlockedUser[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('blocked_users')
      .select('*, blocked_user:profiles!blocked_user_id(*)')
      .eq('blocker_id', blockerId);

    if (error) return [];
    return data as BlockedUser[];
  }

  try {
    const json = await AsyncStorage.getItem(MOCK_BLOCKED_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
}

async function getStoredRatings(): Promise<Rating[]> {
  try {
    const json = await AsyncStorage.getItem(MOCK_RATINGS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
}

async function getStoredReports(): Promise<Report[]> {
  try {
    const json = await AsyncStorage.getItem(MOCK_REPORTS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
}
