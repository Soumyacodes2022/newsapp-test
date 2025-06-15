import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import usePushNotifications from '../hooks/usePushNotifications';
import Navbar from './Navbar';

const NotificationSettings = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const {
    isSupported,
    permission,
    token,
    error,
    requestPermission,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  } = usePushNotifications();

  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [loading, setLoading] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('settings');
  const [stats, setStats] = useState({
    totalReceived: 0,
    todayReceived: 0,
    lastReceived: null
  });

  const categories = [
    { id: 'all', label: 'All News', icon: '📰', color: 'bg-blue-500', description: 'Get notifications from all categories' },
    { id: 'health', label: 'Health', icon: '🏥', color: 'bg-red-500', description: 'Medical news and health updates' },
    { id: 'sports', label: 'Sports', icon: '⚽', color: 'bg-green-500', description: 'Sports news and match updates' },
    { id: 'technology', label: 'Technology', icon: '💻', color: 'bg-purple-500', description: 'Tech news and innovations' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'bg-pink-500', description: 'Movies, music, and celebrity news' },
    { id: 'business', label: 'Business', icon: '💼', color: 'bg-yellow-500', description: 'Market news and business updates' },
    { id: 'science', label: 'Science', icon: '🔬', color: 'bg-indigo-500', description: 'Scientific discoveries and research' }
  ];

  useEffect(() => {
    // Check if user is already subscribed
    const storedToken = localStorage.getItem('fcmToken');
    const storedCategories = localStorage.getItem('notificationCategories');
    const history = JSON.parse(localStorage.getItem('notificationHistory') || '[]');
    
    setIsEnabled(!!storedToken && permission === 'granted');
    
    if (storedCategories) {
      setSelectedCategories(JSON.parse(storedCategories));
    }
    
    setNotificationHistory(history);
    
    // Calculate stats
    const today = new Date().toDateString();
    const todayNotifications = history.filter(n => 
      new Date(n.timestamp).toDateString() === today
    );
    
    setStats({
      totalReceived: history.length,
      todayReceived: todayNotifications.length,
      lastReceived: history.length > 0 ? history[0].timestamp : null
    });
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
          showToast('Notifications disabled successfully', 'success');
        }
      } else {
        // Subscribe
        const permissionGranted = permission === 'granted' || await requestPermission();
        
        if (permissionGranted) {
          const success = await subscribeToNotifications(selectedCategories);
          if (success) {
            setIsEnabled(true);
            showToast('Notifications enabled successfully! 🎉', 'success');
          }
        } else {
          showToast('Permission denied. Please enable notifications in browser settings.', 'error');
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      showToast('Failed to update notification settings', 'error');
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
        await subscribeToNotifications(newCategories);
        showToast('Preferences updated successfully', 'success');
      } catch (error) {
        console.error('Error updating preferences:', error);
        showToast('Failed to update preferences', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const sendTestNotification = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: 'Test Notification 🧪',
          body: 'This is a test notification from TaazaNEWS!',
          category: selectedCategories[0] || 'all'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showToast('Test notification sent successfully! Check your notifications.', 'success');
      } else {
        showToast('Failed to send test notification', 'error');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      showToast('Error sending test notification', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearNotificationHistory = () => {
    localStorage.removeItem('notificationHistory');
    setNotificationHistory([]);
    setStats({ totalReceived: 0, todayReceived: 0, lastReceived: null });
    showToast('Notification history cleared', 'success');
  };

  const showToast = (message, type = 'info') => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `fixed top-24 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm max-w-sm transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    }`;
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  if (!isSupported) {
    return (
      <>
        <Navbar />
        <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 py-8">
            <div className={`max-w-2xl mx-auto rounded-2xl shadow-xl p-8 text-center ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="text-6xl mb-4">🚫</div>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Push Notifications Not Supported
              </h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your browser doesn't support push notifications. Please try using a modern browser like Chrome, Firefox, or Safari.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className={`rounded-2xl shadow-xl p-8 mb-8 ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    🔔 Notification Settings
                  </h1>
                  <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Manage your news notification preferences and stay updated with the latest stories
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isEnabled 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {isEnabled ? '🟢 Active' : '🔴 Inactive'}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 text-lg">⚠️</span>
                    <p className="text-red-700 dark:text-red-300 font-medium">Error: {error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className={`rounded-2xl shadow-xl overflow-hidden ${
              isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'settings' && (
                  <div className="space-y-8">
                    {/* Main Toggle */}
                    <div className={`p-6 rounded-xl border-2 ${
                      permission === 'denied' 
                        ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                        : isDarkMode 
                          ? 'border-gray-600 bg-gray-700/50' 
                          : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className={`text-xl font-semibold mb-2 flex items-center space-x-2 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            <span className="text-2xl">🔔</span>
                            <span>Push Notifications</span>
                          </h3>
                          <p className={`text-sm ${
                            permission === 'denied' 
                              ? 'text-red-600 dark:text-red-400'
                              : isDarkMode 
                                ? 'text-gray-300' 
                                : 'text-gray-600'
                          }`}>
                            {permission === 'denied' 
                              ? '❌ Notifications are blocked. Please enable them in your browser settings and refresh the page.'
                              : isEnabled
                                ? '✅ You will receive notifications for breaking news and updates from your selected categories.'
                                : '📱 Enable notifications to stay updated with the latest news that matters to you.'
                            }
                          </p>
                        </div>
                        <div className="ml-6">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={handleToggleNotifications}
                              disabled={loading || permission === 'denied'}
                              className="sr-only peer"
                            />
                            <div className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                              isEnabled 
                                ? 'bg-blue-600' 
                                : isDarkMode 
                                  ? 'bg-gray-600' 
                                  : 'bg-gray-300'
                            } ${loading || permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                                isEnabled ? 'transform translate-x-6' : ''
                              } ${loading ? 'animate-pulse' : ''}`}>
                                {loading && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Categories Selection */}
                    {isEnabled && (
                      <div>
                        <h3 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          <span className="text-2xl">📂</span>
                          <span>News Categories</span>
                        </h3>
                        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Choose which types of news you want to receive notifications for. You can select multiple categories or choose "All News" to receive everything.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categories.map(category => (
                            <div
                              key={category.id}
                              onClick={() => handleCategoryChange(category.id)}
                              className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                                selectedCategories.includes(category.id)
                                  ? isDarkMode
                                    ? 'border-blue-500 bg-blue-900/20 shadow-lg shadow-blue-500/20'
                                    : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                                  : isDarkMode
                                    ? 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${category.color} shadow-lg`}>
                                  {category.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {category.label}
                                  </h4>
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {category.description}
                                  </p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                  selectedCategories.includes(category.id)
                                    ? 'border-blue-500 bg-blue-500'
                                    : isDarkMode
                                      ? 'border-gray-500'
                                      : 'border-gray-300'
                                }`}>
                                  {selectedCategories.includes(category.id) && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              
                              {/* Selection indicator */}
                              {selectedCategories.includes(category.id) && (
                                <div className="absolute top-2 right-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Selected categories summary */}
                        <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            📋 Selected Categories ({selectedCategories.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCategories.map(categoryId => {
                              const category = categories.find(c => c.id === categoryId);
                              return (
                                <span
                                  key={categoryId}
                                  className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                                    isDarkMode
                                      ? 'bg-blue-900 text-blue-200 border border-blue-700'
                                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}
                                >
                                  <span>{category?.icon}</span>
                                  <span>{category?.label}</span>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Settings */}
                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <h3 className={`text-lg font-semibold mb-4 flex items-center space-x-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        <span className="text-xl">ℹ️</span>
                        <span>How Notifications Work</span>
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <strong>Real-time Updates:</strong> Receive notifications instantly when breaking news happens in your selected categories.
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <strong>Background Delivery:</strong> Notifications work even when the app is closed or your device is locked.
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <strong>Smart Filtering:</strong> Our AI ensures you only get the most important and relevant news updates.
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <strong>Privacy First:</strong> Your notification preferences are stored securely and you can disable them anytime.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-semibold flex items-center space-x-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        <span className="text-2xl">📜</span>
                        <span>Notification History</span>
                      </h3>
                      {notificationHistory.length > 0 && (
                        <button
                          onClick={clearNotificationHistory}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                            isDarkMode
                              ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-800'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                          }`}
                        >
                          🗑️ Clear History
                        </button>
                      )}
                    </div>

                    {notificationHistory.length === 0 ? (
                      <div className={`text-center py-12 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <div className="text-6xl mb-4">📭</div>
                        <h4 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          No Notifications Yet
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          When you receive notifications, they'll appear here for easy reference.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {notificationHistory.map((notification, index) => (
                          <div
                            key={notification.id || index}
                            className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                              isDarkMode
                                ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            } shadow-sm hover:shadow-md`}
                          >
                            <div className="flex items-start space-x-4">
                              {notification.image ? (
                                <img
                                  src={notification.image}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="text-white text-lg">📰</span>
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {notification.title}
                                  </h4>
                                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                                    isDarkMode
                                      ? 'bg-blue-900 text-blue-200'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {notification.source || 'TaazaNEWS'}
                                  </span>
                                </div>
                                
                                <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {notification.body}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      📅 {new Date(notification.timestamp).toLocaleDateString()}
                                    </span>
                                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                      ⏰ {new Date(notification.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                  
                                  {notification.data?.url && (
                                    <button
                                      onClick={() => window.open(notification.data.url, '_blank')}
                                      className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
                                        isDarkMode
                                          ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30'
                                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                      }`}
                                    >
                                      🔗 Read Article
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'test' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        <span className="text-2xl">🧪</span>
                        <span>Test Notifications</span>
                      </h3>
                      <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Send a test notification to make sure everything is working correctly. The notification will be sent to this device.
                      </p>
                    </div>

                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isEnabled 
                              ? 'bg-green-500' 
                              : 'bg-gray-400'
                          }`}>
                            <span className="text-white text-lg">
                              {isEnabled ? '✅' : '❌'}
                            </span>
                          </div>
                          <div>
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Notification Status
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {isEnabled 
                                ? '🟢 Ready to receive notifications'
                                : '🔴 Notifications are disabled'
                              }
                            </p>
                          </div>
                        </div>

                        {isEnabled && (
                          <div className="space-y-4">
                            <div className={`p-4 rounded-lg border ${
                              isDarkMode 
                                ? 'border-blue-600 bg-blue-900/20' 
                                : 'border-blue-200 bg-blue-50'
                            }`}>
                              <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                📋 Test Configuration
                              </h5>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Selected Categories:
                                  </span>
                                  <div className="mt-1">
                                    {selectedCategories.map(categoryId => {
                                      const category = categories.find(c => c.id === categoryId);
                                      return (
                                        <span
                                          key={categoryId}
                                          className={`inline-block mr-2 mb-1 px-2 py-1 rounded text-xs ${
                                            isDarkMode
                                              ? 'bg-blue-800 text-blue-200'
                                              : 'bg-blue-100 text-blue-800'
                                          }`}
                                        >
                                          {category?.icon} {category?.label}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div>
                                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Device Type:
                                  </span>
                                  <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {/Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? '📱 Mobile' : '💻 Desktop'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={sendTestNotification}
                              disabled={loading}
                              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                                loading
                                  ? 'bg-gray-400 text-white cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl'
                              } shadow-lg`}
                            >
                              {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Sending Test...</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center space-x-2">
                                  <span className="text-xl">🚀</span>
                                  <span>Send Test Notification</span>
                                </div>
                              )}
                            </button>

                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                              <div className="flex items-start space-x-2">
                                <span className="text-yellow-500 text-lg flex-shrink-0">💡</span>
                                <div>
                                  <h5 className={`font-medium mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                                    Testing Tips
                                  </h5>
                                  <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                                    <li>• The test notification should appear within a few seconds</li>
                                    <li>• Check your browser's notification settings if you don't see it</li>
                                    <li>• Make sure this tab is not muted in your browser</li>
                                    <li>• Test notifications work even when the app is in the background</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {!isEnabled && (
                          <div className={`p-4 rounded-lg text-center ${
                            isDarkMode 
                              ? 'bg-red-900/20 border border-red-800' 
                              : 'bg-red-50 border border-red-200'
                          }`}>
                            <span className="text-4xl mb-2 block">🚫</span>
                            <p className={`font-medium mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                              Testing Not Available
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                              Please enable notifications first to test the functionality.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSettings;
