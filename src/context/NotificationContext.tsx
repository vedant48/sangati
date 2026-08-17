// Notification Context

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NotificationItem } from '../types';
import { getUserNotifications, markNotificationAsRead } from '../services/notificationService';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const items = await getUserNotifications(user.id);
      setNotifications(items);
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [user]);

  const markAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications: fetchNotifs,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
