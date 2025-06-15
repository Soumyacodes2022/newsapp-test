import React, { useState, useEffect } from "react";
import News from "./Components/News";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import AboutUs from "./Components/AboutUs";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";
import Bookmark from "./Components/Bookmark";
import NotificationSettings from "./Components/NotificationSettings";
// import NotificationToast from "./Components/NotificationToast";
import usePushNotifications from "./hooks/usePushNotifications";
// import { debugFirebase } from "./utils/firebaseDebug";

const App = () => {
  const apiKey = process.env.REACT_APP_NEWS_API;
  const apiURL = process.env.REACT_APP_BASE_URL_API;
  const isAuthenticated = localStorage.getItem('token');
  
  const [progress, setProgress] = useState(0);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  
  // Initialize push notifications
  const {
    isSupported,
    permission,
    requestPermission,
    subscribeToNotifications,
    notification,
    clearNotification
  } = usePushNotifications();

  // Debug Firebase setup in development
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     debugFirebase();
  //   }
  // }, []);

  // Check notification permission on app load
  useEffect(() => {
    const checkNotificationStatus = () => {
      const hasSeenBanner = localStorage.getItem('notificationBannerSeen');
      const isSubscribed = localStorage.getItem('fcmToken');
      
      // Show banner if:
      // - Notifications are supported
      // - User hasn't seen banner before
      // - User is not already subscribed
      // - Permission is not denied
      if (isAuthenticated && isSupported && !hasSeenBanner && !isSubscribed && permission !== 'denied') {
        setShowNotificationBanner(true);
      }
    };

    checkNotificationStatus();
  }, [isSupported, permission]);

  // Auto-subscribe authenticated users to general notifications
  useEffect(() => {
    const autoSubscribeUser = async () => {
      if (isAuthenticated && permission === 'granted') {
        const isSubscribed = localStorage.getItem('fcmToken');
        
        if (!isSubscribed) {
          try {
            const userId = JSON.parse(localStorage.getItem('user'))?.id;
            await subscribeToNotifications(['all'], userId);
            console.log('User auto-subscribed to notifications');
          } catch (error) {
            console.error('Auto-subscription failed:', error);
          }
        }
      }
    };

    autoSubscribeUser();
  }, [isAuthenticated, permission, subscribeToNotifications]);

  const handleEnableNotifications = async () => {
    try {
      const granted = await requestPermission();
      console.log(granted)
      if (granted) {
        const userId = isAuthenticated ? JSON.parse(localStorage.getItem('user'))?.id : null;
        await subscribeToNotifications(['all'], userId);
        setShowNotificationBanner(false);
        localStorage.setItem('notificationBannerSeen', 'true');
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    }
  };

  const handleDismissBanner = () => {
    setShowNotificationBanner(false);
    localStorage.setItem('notificationBannerSeen', 'true');
  };

  // Handle notification click
  const handleNotificationClick = () => {
    if (notification?.data?.url) {
      window.open(notification.data.url, '_blank');
    }
    clearNotification();
  };

  return (
    <ThemeProvider>
      <Router>
        <LoadingBar
          color="#f11946"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />

        {/* Notification Permission Banner */}
        {showNotificationBanner && (
          <div className="notification-banner">
            <div className="banner-content">
              <div className="banner-icon">🔔</div>
              <div className="banner-text">
                <strong>Stay Updated!</strong>
                <p>Get instant notifications for breaking news and updates</p>
              </div>
              <div className="banner-actions">
                <button 
                  className="btn-enable" 
                  onClick={handleEnableNotifications}
                >
                  Enable Notifications
                </button>
                <button 
                  className="btn-dismiss" 
                  onClick={handleDismissBanner}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={
                <News 
                  setProgress={setProgress} 
                  apiKey={apiKey} 
                  key="general" 
                  country="in" 
                  category="top" 
                />
              } 
            />

            {/* Protected routes */}
            {isAuthenticated && (
              <>
                <Route 
                  path="/business" 
                  element={
                    <News 
                      setProgress={setProgress} 
                      apiKey={apiKey} 
                      key="business" 
                      country="in" 
                      category="business" 
                    />
                  } 
                />
                <Route 
                  path="/entertainment" 
                  element={
                    <News 
                      setProgress={setProgress} 
                      apiKey={apiKey} 
                      key="entertainment" 
                      country="in" 
                      category="entertainment" 
                    />
                  } 
                />
                <Route 
                  path="/science" 
                  element={
                    <News 
                      setProgress={setProgress} 
                      apiKey={apiKey} 
                      key="science" 
                      country="in" 
                      category="science" 
                    />
                  } 
                />
                <Route 
                  path="/health" 
                  element={
                    <News 
                      setProgress={setProgress} 
                      apiKey={apiKey} 
                      key="health" 
                      country="in" 
                      category="health" 
                    />
                  } 
                />
                <Route 
                  path="/sports" 
                  element={
                    <News 
                      setProgress={setProgress} 
                      apiKey={apiKey} 
                      key="sports" 
                      country="in" 
                      category="sports" 
                    />
                  } 
                />
                <Route 
                  path="/technology" 
                  element={
                    <News 
                      setProgress={setProgress} 
                      apiKey={apiKey} 
                      key="technology" 
                      country="in" 
                      category="technology" 
                    />
                  } 
                />
                <Route path="/about" element={<AboutUs />} />
                <Route 
                  path="/bookmarks" 
                  element={
                    <Bookmark 
                      setProgress={setProgress} 
                      apiURL={apiURL} 
                    />
                  } 
                />
                {/* Notification Settings Route */}
                <Route 
                  path="/notifications" 
                  element={<NotificationSettings />} 
                />
              </>
            )}
          </Routes>

          {/* Authentication routes for non-authenticated users */}
          {!isAuthenticated && (
            <Routes>
              <Route path="/login" element={<Login apiURL={apiURL} />} />
              <Route path="/signup" element={<Signup apiURL={apiURL} />} />
            </Routes>
          )}
        </div>

        {/* Notification Toast for foreground notifications */}
        {/* <NotificationToast 
          notification={notification}
          onNotificationClick={handleNotificationClick}
          onClose={clearNotification}
        /> */}

        {/* Notification Status Indicator */}
        {isAuthenticated && (
          <div className="notification-status">
            {permission === 'granted' && localStorage.getItem('fcmToken') && (
              <div className="status-indicator active">
                <span className="status-dot"></span>
                <span className="status-text">Notifications Active</span>
              </div>
            )}
            {permission === 'denied' && (
              <div className="status-indicator blocked">
                <span className="status-dot"></span>
                <span className="status-text">Notifications Blocked</span>
              </div>
            )}
          </div>
        )}
      </Router>

      {/* Global Styles for Notification Features */}
      <style jsx>{`
        .notification-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          z-index: 9999;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          animation: slideDown 0.3s ease-out;
        }

        .banner-content {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          max-width: 1200px;
          margin: 0 auto;
          gap: 16px;
        }

        .banner-icon {
          font-size: 24px;
          animation: pulse 2s infinite;
        }

        .banner-text {
          flex: 1;
          min-width: 0;
        }

        .banner-text strong {
          display: block;
          font-size: 16px;
          margin-bottom: 2px;
        }

        .banner-text p {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .banner-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .btn-enable {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .btn-enable:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }

        .btn-dismiss {
          background: transparent;
          color: rgba(255,255,255,0.8);
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-dismiss:hover {
          color: white;
          background: rgba(255,255,255,0.1);
        }

        .notification-status {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .status-indicator.active {
          background: rgba(76, 175, 80, 0.9);
          color: white;
        }

        .status-indicator.blocked {
          background: rgba(244, 67, 54, 0.9);
          color: white;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse 2s infinite;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @media (max-width: 768px) {
          .banner-content {
            padding: 10px 16px;
            gap: 12px;
          }

          .banner-text strong {
            font-size: 14px;
          }

          .banner-text p {
            font-size: 12px;
          }

          .banner-actions {
            flex-direction: column;
            gap: 4px;
          }

          .btn-enable, .btn-dismiss {
            padding: 6px 12px;
            font-size: 12px;
          }

          .notification-status {
            bottom: 10px;
            right: 10px;
          }

          .status-indicator {
            padding: 6px 10px;
            font-size: 11px;
          }
        }
      `}</style>
    </ThemeProvider>
  );
};
export default App;
