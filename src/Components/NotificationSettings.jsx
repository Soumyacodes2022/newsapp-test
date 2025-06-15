import React, { useState, useEffect } from 'react';
import usePushNotifications from '../hooks/usePushNotifications';
import './NotificationSettings.css';

const NotificationSettings = () => {
  const {
    isSupported,
    permission,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    updatePreferences
  } = usePushNotifications();

  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All News', icon: '📰' },
    { id: 'health', label: 'Health', icon: '🏥' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'international', label: 'International', icon: '🌍' },
    { id: 'politics', label: 'Politics', icon: '🏛️' }
  ];

  useEffect(() => {
    // Check if user is already subscribed
    const storedToken = localStorage.getItem('fcmToken');
    const storedCategories = localStorage.getItem('notificationCategories');
    
    setIsEnabled(!!storedToken && permission === 'granted');
    
    if (storedCategories) {
      setSelectedCategories(JSON.parse(storedCategories));
    }
  }, [permission]);

  const handleToggleNotifications = async () => {
    setLoading(true);
    
    try {
      if (isEnabled) {
        // Unsubscribe
        const success = await unsubscribeFromNotifications();
        if (success) {
          setIsEnabled(false);
          setSelectedCategories(['all']);
        }
      } else {
        // Subscribe
        const permissionGranted = permission === 'granted' || await requestPermission();
        
        if (permissionGranted) {
          const success = await subscribeToNotifications(selectedCategories);
          if (success) {
            setIsEnabled(true);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    let newCategories;
    
    if (categoryId === 'all') {
      newCategories = ['all'];
    } else {
      newCategories = selectedCategories.includes('all') 
        ? [categoryId]
        : selectedCategories.includes(categoryId)
          ? selectedCategories.filter(cat => cat !== categoryId)
          : [...selectedCategories.filter(cat => cat !== 'all'), categoryId];
      
      if (newCategories.length === 0) {
        newCategories = ['all'];
      }
    }
    
    setSelectedCategories(newCategories);
    
    if (isEnabled) {
      setLoading(true);
      try {
        await updatePreferences(newCategories);
      } catch (error) {
        console.error('Error updating preferences:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const sendTestNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test notification from your News App!',
          category: 'all'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Test notification sent successfully!');
      } else {
        alert('Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Error sending test notification');
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="notification-settings">
        <div className="not-supported">
          <h3>🚫 Push Notifications Not Supported</h3>
          <p>Your browser doesn't support push notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h2>🔔 Notification Settings</h2>
        <p>Stay updated with the latest news that matters to you</p>
      </div>

      <div className="notification-toggle">
        <div className="toggle-section">
          <div className="toggle-info">
            <h3>Push Notifications</h3>
            <p>
              {permission === 'denied' 
                ? 'Notifications are blocked. Please enable them in your browser settings.'
                : 'Get instant notifications for breaking news and updates'
              }
            </p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggleNotifications}
              disabled={loading || permission === 'denied'}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {isEnabled && (
        <div className="categories-section">
          <h3>📂 News Categories</h3>
          <p>Choose which types of news you want to receive notifications for:</p>
          
          <div className="categories-grid">
            {categories.map(category => (
              <div
                key={category.id}
                className={`category-item ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => {}}
                  className="category-checkbox"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {isEnabled && (
        <div className="test-section">
          <button
            className="test-button"
            onClick={sendTestNotification}
            disabled={loading}
          >
            {loading ? '⏳ Sending...' : '🧪 Send Test Notification'}
          </button>
        </div>
      )}

      <div className="notification-info">
        <h4>ℹ️ About Notifications</h4>
        <ul>
          <li>Notifications work even when the app is closed</li>
          <li>You can customize which categories you want to receive</li>
          <li>Breaking news notifications are sent immediately</li>
          <li>You can disable notifications anytime</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationSettings;
