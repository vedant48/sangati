// 1-on-1 Realtime Chat Detail Screen

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Avatar } from '../../components/common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { getMatchMessages, sendMessage, subscribeToMatchMessages } from '../../services/chatService';
import { Message } from '../../types';
import { formatTimeOnly } from '../../utils/formatters';

export const ChatDetailScreen = ({ route, navigation }: any) => {
  const { match } = route.params;
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  const isDriver = user && match.driver_id === user.id;
  const companion = isDriver ? match.passenger : match.driver;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // 1. Fetch initial message history
    getMatchMessages(match.id).then((history) => {
      setMessages(history);
    });

    // 2. Subscribe to realtime messages channel
    const unsubscribe = subscribeToMatchMessages(match.id, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      unsubscribe();
    };
  }, [match.id]);

  const handleSend = async () => {
    if (!inputText.trim() || !user) return;
    const text = inputText;
    setInputText('');
    setSending(true);

    try {
      const created = await sendMessage({
        matchId: match.id,
        senderId: user.id,
        messageText: text,
      });

      // Optimistically add to message list if not in Realtime mode
      setMessages((prev) => {
        if (prev.some((m) => m.id === created.id)) return prev;
        return [...prev, created];
      });
    } catch (e) {
      console.warn('Send error:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {/* Companion Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Avatar url={companion?.avatar_url} name={companion?.full_name} size={38} />
        <View style={styles.headerInfo}>
          <Text style={styles.companionName}>{companion?.full_name || 'Companion'}</Text>
          <Text style={styles.headerSubtitle}>
            {isDriver ? 'Passenger' : 'Driver'} • Matched Ride
          </Text>
        </View>
      </View>

      {/* Safety Notice Banner */}
      <View style={styles.safetyNotice}>
        <Text style={styles.safetyNoticeText}>
          🔒 Private 1-on-1 chat. Coordinate pickup spots and timing respectfully.
        </Text>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMyMessage = item.sender_id === user?.id;

          return (
            <View
              style={[
                styles.bubbleWrapper,
                isMyMessage ? styles.myBubbleWrapper : styles.theirBubbleWrapper,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isMyMessage ? styles.myBubble : styles.theirBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMyMessage ? styles.myMessageText : styles.theirMessageText,
                  ]}
                >
                  {item.message}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    isMyMessage ? styles.myTimeText : styles.theirTimeText,
                  ]}
                >
                  {formatTimeOnly(item.created_at)}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Message Input Box */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
          style={[
            styles.sendButton,
            !inputText.trim() ? styles.sendButtonDisabled : null,
          ]}
        >
          <Text style={styles.sendButtonIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    marginRight: Spacing.sm,
    padding: Spacing.xs,
  },
  backText: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  headerInfo: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  companionName: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  safetyNotice: {
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  safetyNoticeText: {
    ...Typography.caption,
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  messagesList: {
    padding: Spacing.md,
    paddingBottom: Spacing.md,
  },
  bubbleWrapper: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  myBubbleWrapper: {
    alignSelf: 'flex-end',
  },
  theirBubbleWrapper: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.lg,
  },
  myBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    ...Typography.body,
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: Colors.textInverse,
  },
  theirMessageText: {
    color: Colors.textPrimary,
  },
  timeText: {
    ...Typography.caption,
    fontSize: 10,
    marginTop: 4,
  },
  myTimeText: {
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
  },
  theirTimeText: {
    color: Colors.textMuted,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    maxHeight: 100,
    ...Typography.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.borderStrong,
  },
  sendButtonIcon: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
});
