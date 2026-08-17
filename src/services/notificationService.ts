// Push & In-App Notification Service

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NotificationItem } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_NOTIFICATIONS_KEY = '@companion_ride_mock_notifs';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    user_id: '11111111-1111-1111-1111-111111111111',
    type: 'request_accepted',
    title: 'Ride Request Accepted! 🎉',
    body: 'Priya Sharma accepted your request for the ride to Whitefield.',
    data: { match_id: 'bbbb1111-1111-1111-1111-111111111111' },
    read: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif_2',
    user_id: '11111111-1111-1111-1111-111111111111',
    type: 'trip_reminder',
    title: 'Upcoming Ride in 45 Mins',
    body: 'Your ride with Priya Sharma is scheduled for departure soon.',
    data: { ride_id: 'aaaa2222-2222-2222-2222-222222222222' },
    read: true,
    created_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
];

export async function getUserNotifications(userId: string): Promise<NotificationItem[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data as NotificationItem[];
  }

  const stored = await getStoredNotifications();
  return stored.filter((n) => n.user_id === userId);
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  if (isSupabaseConfigured) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    return;
  }

  const stored = await getStoredNotifications();
  const target = stored.find((n) => n.id === notificationId);
  if (target) {
    target.read = true;
    await AsyncStorage.setItem(MOCK_NOTIFICATIONS_KEY, JSON.stringify(stored));
  }
}

export async function createNotification(params: {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}): Promise<NotificationItem> {
  if (isSupabaseConfigured) {
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

    if (error) throw error;
    return data as NotificationItem;
  }

  const newNotif: NotificationItem = {
    id: `notif_${Date.now()}`,
    user_id: params.userId,
    type: params.type,
    title: params.title,
    body: params.body,
    data: params.data,
    read: false,
    created_at: new Date().toISOString(),
  };

  const stored = await getStoredNotifications();
  await AsyncStorage.setItem(MOCK_NOTIFICATIONS_KEY, JSON.stringify([newNotif, ...stored]));
  return newNotif;
}

async function getStoredNotifications(): Promise<NotificationItem[]> {
  try {
    const json = await AsyncStorage.getItem(MOCK_NOTIFICATIONS_KEY);
    if (json) return JSON.parse(json);
  } catch (e) {
    // fallback
  }
  return INITIAL_NOTIFICATIONS;
}
