import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import AnalyticsDashboard from './AnalyticsDashboard';
import Bookmarks from './BookMarks';

const DashboardLayout = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    {
      id: 'analytics',
      name: 'Analytics',
      icon: 'fas fa-chart-bar',
      description: 'View your reading statistics'
    },
    {
      id: 'bookmarks',
      name: 'Bookmarks',
      icon: 'fas fa-bookmark',
      description: 'Manage saved articles'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'bookmarks':
        return <Bookmarks />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className={`min-h-screen pt-20 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-xl border-r ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        } fixed left-0 top-20 bottom-0 z-40`}>
          
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div>
                  <h2 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Dashboard
                  </h2>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Manage your news experience
                  </p>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
              </button>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activeTab === item.id
                    ? 'bg-white/20'
                    : isDarkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                }`}>
                  <i className={`${item.icon} ${
                    activeTab === item.id ? 'text-white' : 'text-blue-500'
                  }`}></i>
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs opacity-75 ${
                      activeTab === item.id ? 'text-white' : ''
                    }`}>
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          {!sidebarCollapsed && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => navigate('/')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <i className="fas fa-home text-blue-500"></i>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Back to News</div>
                  <div className="text-xs opacity-75">Return to main feed</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className={`flex-1 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        } transition-all duration-300`}>
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* Mobile sidebar would go here - simplified for this example */}
      </div>
    </div>
  );
};

export default DashboardLayout;
