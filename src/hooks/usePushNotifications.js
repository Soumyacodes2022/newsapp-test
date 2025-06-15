import { useState, useEffect } from 'react';
import { messaging, getToken, onMessage, initializeFirebase } from '../config/firebase';

const usePushNotifications = () => {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState('default');
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        // Check basic support
        const basicSupport = 'serviceWorker' in navigator && 
                           'PushManager' in window && 
                           'Notification' in window;
        
        setIsSupported(basicSupport);
        setPermission(Notification.permission);
        
        if (basicSupport) {
          // Initialize Firebase
          await initializeFirebase();
          setIsInitialized(true);
          
          // Try to get existing token
          const existingToken = localStorage.getItem('fcmToken');
          if (existingToken && Notification.permission === 'granted') {
            setToken(existingToken);
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
        setError(error.message);
      }
    };

    initializeNotifications();
  }, []);

  const requestPermission = async () => {
    try {
      setError(null);
      
      if (!isSupported) {
        throw new Error('Push notifications are not supported in this browser');
      }

      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        const token = await generateToken();
        return !!token;
      } else if (permission === 'denied') {
        setError('Notification permission denied');
        return false;
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setError(error.message);
      return false;
    }
  };

  const generateToken = async () => {
    try {
      if (!messaging) {
        console.warn('Firebase messaging not initialized, using fallback');
        // Create a development token for testing
        if (process.env.REACT_APP_NODE_ENV === 'development') {
          const mockToken = `dev_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          setToken(mockToken);
          localStorage.setItem('fcmToken', mockToken);
          console.log('Using development token:', mockToken);
          return mockToken;
        }
        throw new Error('Firebase messaging not initialized');
      }

      // Register service worker
      let registration;
      try {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-cloud-messaging-push-scope',
        });
        console.log('Service worker registered successfully');
        
      } catch (swError) {
        console.warn('Service worker registration failed, trying alternative approach:', swError);
        
        // Fallback: try to register without specific scope
        try {
          registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
          await navigator.serviceWorker.ready;
        } catch (fallbackError) {
          console.error('Service worker registration completely failed:', fallbackError);
          
          // Use development mode fallback
          if (process.env.REACT_APP_NODE_ENV === 'development') {
            const mockToken = `dev_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setToken(mockToken);
            localStorage.setItem('fcmToken', mockToken);
            console.log('Using development fallback token:', mockToken);
            return mockToken;
          }
          
          throw fallbackError;
        }
      }

      const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
      console.log(vapidKey)
      
      const currentToken = await getToken(messaging, {
        vapidKey: vapidKey,
        serviceWorkerRegistration: registration
      });

      if (currentToken) {
        console.log('FCM Token generated:', currentToken);
        setToken(currentToken);
        localStorage.setItem('fcmToken', currentToken);
        return currentToken;
      } else {
        console.log('No registration token available.');
        
        // Development fallback
        if (process.env.REACT_APP_NODE_ENV === 'development') {
          const mockToken = `dev_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          setToken(mockToken);
          localStorage.setItem('fcmToken', mockToken);
          console.log('Using development fallback token:', mockToken);
          return mockToken;
        }
        
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
      setError(error.message);
      
      // Development fallback
      if (process.env.REACT_APP_NODE_ENV === 'development') {
        const mockToken = `dev_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setToken(mockToken);
        localStorage.setItem('fcmToken', mockToken);
        console.log('Using development fallback token due to error:', mockToken);
        return mockToken;
      }
      
      return null;
    }
  };

  const subscribeToNotifications = async (categories = ['all'], userId = null) => {
    try {
      setError(null);
      
      let currentToken = token;
      if (!currentToken) {
        currentToken = await generateToken();
        if (!currentToken) {
          throw new Error('Failed to generate FCM token');
        }
      }

      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
      };

      const subscriptionData = {
        fcmToken: currentToken,
        userId,
        categories,
        deviceInfo,
        timestamp: new Date().toISOString()
      };
      console.log(subscriptionData)

      // Always store locally for development
      localStorage.setItem('notificationSubscription', JSON.stringify(subscriptionData));
      localStorage.setItem('notificationCategories', JSON.stringify(categories));
      console.log('Subscription stored locally:', subscriptionData);
      console.log(process.env.REACT_APP_BASE_URL_API)
      console.log(process.env.REACT_APP_NODE_ENV === 'development')
      console.log(localStorage.getItem('token'))
      // Try to send to backend if available
      if (process.env.REACT_APP_BASE_URL_API) {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/notifications/subscribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(subscriptionData),
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Backend subscription successful:', result);
          }
        } catch (backendError) {
          console.warn('Backend subscription failed, using local storage only:', backendError);
        }
      }

      return true;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      setError(error.message);
      return false;
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      setError(null);
      
      const storedToken = localStorage.getItem('fcmToken') || token;
      
      if (!storedToken) return true;

      // Clear local storage
      localStorage.removeItem('fcmToken');
      localStorage.removeItem('notificationCategories');
      localStorage.removeItem('notificationSubscription');
      setToken(null);
      console.log('Unsubscribed locally');

      // Try to notify backend if available
      if (process.env.REACT_APP_BASE_URL_API) {
        try {
          const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/notifications/unsubscribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              fcmToken: storedToken
            }),
          });

          if (response.ok) {
            console.log('Backend unsubscription successful');
          }
        } catch (backendError) {
          console.warn('Backend unsubscription failed:', backendError);
        }
      }

      return true;
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      setError(error.message);
      return false;
    }
  };

  // Listen for foreground messages
  useEffect(() => {
    if (!messaging || !isInitialized) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      const notificationData = {
        title: payload.notification?.title,
        body: payload.notification?.body,
        image: payload.notification?.image,
        data: payload.data,
        timestamp: Date.now()
      };

      setNotification(notificationData);

      // Add to notification history
      const historyItem = {
        id: Date.now(),
        title: payload.notification?.title || 'News Update',
        body: payload.notification?.body,
        image: payload.notification?.image,
        data: payload.data,
        timestamp: new Date().toISOString(),
        source: payload.data?.source || 'NewsMonkey',
        type: 'news',
        read: false
      };

      const history = JSON.parse(localStorage.getItem('notificationHistory') || '[]');
      const updatedHistory = [historyItem, ...history].slice(0, 50);
      localStorage.setItem('notificationHistory', JSON.stringify(updatedHistory));

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        const browserNotification = new Notification(notificationData.title || 'News Update', {
          body: notificationData.body,
          icon: '/favicon.png',
          image: notificationData.image,
          data: notificationData.data,
          tag: notificationData.data?.newsId || 'news-notification'
        });

        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }
    });

    return () => unsubscribe();
  }, [messaging, isInitialized]);

  // Development notification simulator
  // useEffect(() => {
  //   if (process.env.REACT_APP_NODE_ENV === 'development' && token && permission === 'granted') {
  //     console.log('Starting development notification simulator');
      
  //     const interval = setInterval(() => {
  //       const mockNotifications = [
  //         {
  //           notification: {
  //                           title: "🚨 Breaking News",
  //             body: "Major development in technology sector",
  //             image: "https://via.placeholder.com/300x200"
  //           },
  //           data: {
  //             source: "Tech News",
  //             category: "technology",
  //             url: "https://example.com/tech-news",
  //             newsId: "tech_" + Date.now()
  //           }
  //         },
  //         {
  //           notification: {
  //             title: "⚽ Sports Update",
  //             body: "Championship match results are in",
  //             image: "https://via.placeholder.com/300x200"
  //           },
  //           data: {
  //             source: "Sports Central",
  //             category: "sports",
  //             url: "https://example.com/sports-news",
  //             newsId: "sports_" + Date.now()
  //           }
  //         },
  //         {
  //           notification: {
  //             title: "💼 Business Alert",
  //             body: "Stock market shows significant movement",
  //             image: "https://via.placeholder.com/300x200"
  //           },
  //           data: {
  //             source: "Business Today",
  //             category: "business",
  //             url: "https://example.com/business-news",
  //             newsId: "business_" + Date.now()
  //           }
  //         }
  //       ];

  //       const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        
  //       // Check if user is subscribed to this category
  //       const subscription = JSON.parse(localStorage.getItem('notificationSubscription') || '{}');
  //       const subscribedCategories = subscription.categories || [];
        
  //       if (subscribedCategories.includes('all') || subscribedCategories.includes(randomNotification.data.category)) {
  //         console.log('Simulating notification:', randomNotification.notification.title);
          
  //         // Simulate receiving the notification
  //         setNotification({
  //           title: randomNotification.notification.title,
  //           body: randomNotification.notification.body,
  //           image: randomNotification.notification.image,
  //           data: randomNotification.data,
  //           timestamp: Date.now()
  //         });

  //         // Show browser notification
  //         if (Notification.permission === 'granted') {
  //           const browserNotification = new Notification(randomNotification.notification.title, {
  //             body: randomNotification.notification.body,
  //             icon: '/favicon.svg',
  //             image: randomNotification.notification.image,
  //             data: randomNotification.data,
  //             tag: randomNotification.data.newsId
  //           });

  //           setTimeout(() => {
  //             browserNotification.close();
  //           }, 5000);
  //         }
  //       }
  //     }, 30000); // Every 30 seconds in development

  //     return () => clearInterval(interval);
  //   }
  // }, [token, permission]);

  return {
    token,
    notification,
    isSupported,
    permission,
    error,
    isInitialized,
    requestPermission,
    generateToken,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    clearNotification: () => setNotification(null)
  };
};

export default usePushNotifications;

