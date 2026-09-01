// Pure Supabase In-App Notification Service

import { supabase } from '../lib/supabase';
import { NotificationItem } from '../types';

export async function getUserNotifications(userId: string): Promise<NotificationItem[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Error fetching notifications:', error.message);
    return [];
  }

  return (data || []) as NotificationItem[];
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createNotification(params: {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}): Promise<NotificationItem> {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      body: params.body,
      data: params.data || {},
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as NotificationItem;
}
