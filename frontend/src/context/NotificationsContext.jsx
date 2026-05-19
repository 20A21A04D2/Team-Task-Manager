import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications', error);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for real-time update mock
    let interval;
    if (user) {
      interval = setInterval(fetchNotifications, 30000);
    }
    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Error marking notification read', error);
    }
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, fetchNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
