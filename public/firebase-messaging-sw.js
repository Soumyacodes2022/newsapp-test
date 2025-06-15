// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Initialize Firebase in service worker
// Note: We can't use process.env in service worker, so we'll pass config differently
const firebaseConfig = {
  apiKey: "AIzaSyAPTXQ2vOk41lZTzv8X_0PmbMBM-lxC51E", // Replace with your actual key
  authDomain: "taazanews-fcm.firebaseapp.com",
  projectId: "taazanews-fcm",
  storageBucket: "taazanews-fcm.firebasestorage.app",
  messagingSenderId: "758572753521",
  appId: "1:758572753521:web:85fc6fa083a4b6c29f31d0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'NewsMonkey Update';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/favicon.ico', // Use favicon as fallback
    badge: '/favicon.ico',
    image: payload.notification?.image,
    data: payload.data || {},
    tag: payload.data?.newsId || 'news-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'open',
        title: 'Read Now'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'open') {
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(urlToOpen));
  } else if (event.action === 'dismiss') {
    return;
  } else {
    const urlToOpen = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(urlToOpen));
  }
});
