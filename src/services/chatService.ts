// Realtime Chat Service

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Message } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_MESSAGES_KEY = '@companion_ride_mock_messages';

const INITIAL_MOCK_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    match_id: 'bbbb1111-1111-1111-1111-111111111111',
    sender_id: '11111111-1111-1111-1111-111111111111',
    message: 'Hi Priya! I will be waiting near the 100ft road Starbucks.',
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg_2',
    match_id: 'bbbb1111-1111-1111-1111-111111111111',
    sender_id: '22222222-2222-2222-2222-222222222222',
    message: 'Perfect Rahul! I am in a silver i20, see you in 15 mins.',
    created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    read_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
];

export async function getMatchMessages(matchId: string): Promise<Message[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, sender:profiles(*)')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) return [];
    return data as Message[];
  }

  const all = await getStoredMockMessages();
  return all.filter((m) => m.match_id === matchId);
}

export async function sendMessage(params: {
  matchId: string;
  senderId: string;
  messageText: string;
}): Promise<Message> {
  const clean = params.messageText.trim();
  if (!clean) throw new Error('Message cannot be empty');

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: params.matchId,
        sender_id: params.senderId,
        message: clean,
      })
      .select('*, sender:profiles(*)')
      .single();

    if (error) throw error;
    return data as Message;
  }

  const newMsg: Message = {
    id: `msg_${Date.now()}`,
    match_id: params.matchId,
    sender_id: params.senderId,
    message: clean,
    created_at: new Date().toISOString(),
  };

  const all = await getStoredMockMessages();
  const updated = [...all, newMsg];
  await AsyncStorage.setItem(MOCK_MESSAGES_KEY, JSON.stringify(updated));
  return newMsg;
}

export function subscribeToMatchMessages(
  matchId: string,
  onNewMessage: (msg: Message) => void
) {
  if (!isSupabaseConfigured) {
    return () => {};
  }

  const channel = supabase
    .channel(`match_messages_${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

async function getStoredMockMessages(): Promise<Message[]> {
  try {
    const json = await AsyncStorage.getItem(MOCK_MESSAGES_KEY);
    if (json) return JSON.parse(json);
  } catch (e) {
    // fallback
  }
  return INITIAL_MOCK_MESSAGES;
}
