import { useState, useEffect } from 'react';
import { messaging, getToken, onMessage } from '../config/firebase';

const usePushNotifications = () => {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check if push notifications are supported
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await generateToken();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const generateToken = async () => {
    try {
      if (!messaging) {
        console.error('Firebase messaging not initialized');
        return null;
      }

      const currentToken = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });

      if (currentToken) {
        console.log('FCM Token generated:', currentToken);
        setToken(currentToken);
        return currentToken;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
      return null;
    }
  };

  const subscribeToNotifications = async (categories = ['all'], userId = null) => {
    try {
      if (!token) {
        const newToken = await generateToken();
        if (!newToken) return false;
      }

      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
      };

      const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/api/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fcmToken: token,
          userId,
          categories,
          deviceInfo
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('fcmToken', token);
        localStorage.setItem('notificationCategories', JSON.stringify(categories));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return false;
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      const storedToken = localStorage.getItem('fcmToken') || token;
      
      if (!storedToken) return true;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/api/notifications/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fcmToken: storedToken
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.removeItem('fcmToken');
        localStorage.removeItem('notificationCategories');
        setToken(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      return false;
    }
  };

  const updatePreferences = async (categories) => {
    try {
      const storedToken = localStorage.getItem('fcmToken') || token;
      
      if (!storedToken) return false;

      const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/api/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fcmToken: storedToken,
          categories
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        localStorage.setItem('notificationCategories', JSON.stringify(categories));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  };

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      setNotification({
        title: payload.notification?.title,
        body: payload.notification?.body,
        image: payload.notification?.image,
        data: payload.data,
        timestamp: Date.now()
      });

      // Show browser notification even when app is in foreground
      if (Notification.permission === 'granted') {
        new Notification(payload.notification?.title || 'News Update', {
          body: payload.notification?.body,
          icon: '/icons/news-icon-192x192.png',
          image: payload.notification?.image,
          data: payload.data,
          tag: payload.data?.newsId || 'news-notification'
        });
      }
    });

    return () => unsubscribe();
  }, [messaging]);

  return {
    token,
    notification,
    isSupported,
    permission,
    requestPermission,
    generateToken,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    updatePreferences,
    clearNotification: () => setNotification(null)
  };
};

export default usePushNotifications;
