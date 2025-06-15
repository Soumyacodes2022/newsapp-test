import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
let app = null;
let messaging = null;

const initializeFirebase = async () => {
  try {
    // Check if Firebase is already initialized
    if (!app) {
      app = initializeApp(firebaseConfig);
    }
    
    // Initialize messaging only if supported and in browser environment
    if (typeof window !== 'undefined' && !messaging) {
      const supported = await isSupported();
      if (supported) {
        messaging = getMessaging(app);
        console.log('Firebase messaging initialized successfully');
      } else {
        console.warn('Firebase messaging is not supported in this browser');
      }
    }
    
    return { app, messaging };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return { app: null, messaging: null };
  }
};

// Initialize immediately
initializeFirebase();

export { messaging, getToken, onMessage, initializeFirebase };
export default app;
