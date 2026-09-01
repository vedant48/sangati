// Pure Supabase Realtime Chat Service

import { supabase } from '../lib/supabase';
import { Message } from '../types';

export async function getMatchMessages(matchId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:profiles(*)')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });

  if (error) {
    console.warn('Error fetching match messages:', error.message);
    return [];
  }

  return (data || []) as Message[];
}

export async function sendMessage(params: {
  matchId: string;
  senderId: string;
  messageText: string;
}): Promise<Message> {
  const clean = params.messageText.trim();
  if (!clean) throw new Error('Message cannot be empty');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      match_id: params.matchId,
      sender_id: params.senderId,
      message: clean,
    })
    .select('*, sender:profiles(*)')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Message;
}

export function subscribeToMatchMessages(
  matchId: string,
  onNewMessage: (msg: Message) => void
) {
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
      async (payload) => {
        const newRecord = payload.new as any;
        // Fetch sender profile details for the incoming message
        if (newRecord?.sender_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newRecord.sender_id)
            .maybeSingle();

          onNewMessage({
            ...newRecord,
            sender: profile || undefined,
          } as Message);
        } else {
          onNewMessage(newRecord as Message);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
