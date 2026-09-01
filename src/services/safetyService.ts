// Pure Supabase Safety, Moderation, and Rating Service

import { supabase } from '../lib/supabase';
import { Rating, Report, ReportReason, BlockedUser } from '../types';

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

  if (error) {
    throw new Error(error.message);
  }

  return data as Rating;
}

export async function reportUser(params: {
  reporterId: string;
  reportedUserId: string;
  rideId?: string;
  reason: ReportReason;
  description?: string;
}): Promise<Report> {
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

  if (error) {
    throw new Error(error.message);
  }

  return data as Report;
}

export async function blockUser(blockerId: string, blockedUserId: string): Promise<BlockedUser> {
  if (blockerId === blockedUserId) {
    throw new Error('You cannot block yourself.');
  }

  const { data, error } = await supabase
    .from('blocked_users')
    .insert({
      blocker_id: blockerId,
      blocked_user_id: blockedUserId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as BlockedUser;
}

export async function unblockUser(blockerId: string, blockedUserId: string): Promise<void> {
  const { error } = await supabase
    .from('blocked_users')
    .delete()
    .eq('blocker_id', blockerId)
    .eq('blocked_user_id', blockedUserId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getBlockedUsers(blockerId: string): Promise<BlockedUser[]> {
  const { data, error } = await supabase
    .from('blocked_users')
    .select('*, blocked_user:profiles!blocked_user_id(*)')
    .eq('blocker_id', blockerId);

  if (error) {
    console.warn('Error fetching blocked users:', error.message);
    return [];
  }

  return (data || []) as BlockedUser[];
}
