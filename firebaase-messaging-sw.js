importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/icons/news-icon-192x192.png',
    badge: '/icons/news-badge-72x72.png',
    image: payload.notification.image,
    data: payload.data,
    actions: [
      {
        action: 'read',
        title: 'Read Now',
        icon: '/icons/read-icon.png'
      },
      {
        action: 'save',
        title: 'Save Later',
        icon: '/icons/save-icon.png'
      }
    ],
    requireInteraction: true,
    tag: payload.data?.newsId || 'news-notification'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'read') {
    // Open the news article
    const url = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(url));
  } else if (event.action === 'save') {
    // Save for later (you can implement this logic)
    console.log('Save for later clicked');
  } else {
    // Default action - open the app
    const url = event.notification.data?.url || '/';
    event.waitUntil(clients.openWindow(url));
  }
});
