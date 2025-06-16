import React, { useState, useContext } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { ThemeContext } from '../context/ThemeContext';

const AnalyticsDashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);
  
  // Hardcoded analytics data
  const bookmarkData = [
    { month: 'Jan', bookmarks: 45, reads: 38 },
    { month: 'Feb', bookmarks: 52, reads: 41 },
    { month: 'Mar', bookmarks: 48, reads: 35 },
    { month: 'Apr', bookmarks: 61, reads: 52 },
    { month: 'May', bookmarks: 55, reads: 48 },
    { month: 'Jun', bookmarks: 67, reads: 58 }
  ];

  const categoryData = [
    { name: 'Technology', value: 35, color: '#3B82F6' },
    { name: 'Business', value: 25, color: '#10B981' },
    { name: 'Sports', value: 20, color: '#F59E0B' },
    { name: 'Health', value: 12, color: '#EF4444' },
    { name: 'Entertainment', value: 8, color: '#8B5CF6' }
  ];

  const engagementData = [
    { day: 'Mon', likes: 120, comments: 45, shares: 23 },
    { day: 'Tue', likes: 98, comments: 38, shares: 19 },
    { day: 'Wed', likes: 145, comments: 52, shares: 31 },
    { day: 'Thu', likes: 167, comments: 61, shares: 28 },
    { day: 'Fri', likes: 189, comments: 73, shares: 42 },
    { day: 'Sat', likes: 201, comments: 68, shares: 35 },
    { day: 'Sun', likes: 156, comments: 49, shares: 26 }
  ];

  const readingTimeData = [
    { hour: '6AM', sessions: 12 },
    { hour: '9AM', sessions: 45 },
    { hour: '12PM', sessions: 67 },
    { hour: '3PM', sessions: 52 },
    { hour: '6PM', sessions: 89 },
    { hour: '9PM', sessions: 134 },
    { hour: '12AM', sessions: 23 }
  ];

  const topArticles = [
    { title: 'AI Revolution in Healthcare', views: 2340, likes: 189, comments: 45 },
    { title: 'Climate Change Solutions', views: 1890, likes: 156, comments: 38 },
    { title: 'Cryptocurrency Market Update', views: 1654, likes: 134, comments: 52 },
    { title: 'Space Exploration Breakthrough', views: 1432, likes: 112, comments: 29 },
    { title: 'Tech Giants Quarterly Results', views: 1298, likes: 98, comments: 34 }
  ];

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:scale-105 ${
      isDarkMode 
        ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
        : 'bg-white/50 border-gray-200 backdrop-blur-xl'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </p>
          <p className={`text-sm mt-1 ${
            change > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            <i className={`fas fa-arrow-${change > 0 ? 'up' : 'down'} mr-1`}></i>
            {Math.abs(change)}% from last month
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <i className={`${icon} text-white text-xl`}></i>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Analytics Dashboard
          </h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Track your reading habits and engagement metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select className={`px-4 py-2 rounded-xl border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookmarks"
          value="328"
          change={12.5}
          icon="fas fa-bookmark"
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Articles Read"
          value="1,247"
          change={8.2}
          icon="fas fa-book-open"
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatCard
          title="Total Likes"
          value="2,156"
          change={15.3}
          icon="fas fa-heart"
          color="bg-gradient-to-r from-red-500 to-red-600"
        />
        <StatCard
          title="Comments Made"
          value="489"
          change={-2.1}
          icon="fas fa-comment"
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookmark Trends */}
        <div className={`p-6 rounded-2xl shadow-lg border ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white/50 border-gray-200 backdrop-blur-xl'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Bookmark & Reading Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={bookmarkData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="month" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '12px',
                  color: isDarkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="bookmarks" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="reads" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className={`p-6 rounded-2xl shadow-lg border ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white/50 border-gray-200 backdrop-blur-xl'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Reading Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '12px',
                  color: isDarkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Metrics */}
        <div className={`p-6 rounded-2xl shadow-lg border ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white/50 border-gray-200 backdrop-blur-xl'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Weekly Engagement
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="day" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '12px',
                  color: isDarkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Legend />
              <Bar dataKey="likes" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="comments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shares" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reading Time Distribution */}
        <div className={`p-6 rounded-2xl shadow-lg border ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
            : 'bg-white/50 border-gray-200 backdrop-blur-xl'
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Reading Sessions by Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={readingTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="hour" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '12px',
                  color: isDarkMode ? '#FFFFFF' : '#000000'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Articles Table */}
      <div className={`p-6 rounded-2xl shadow-lg border ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
          : 'bg-white/50 border-gray-200 backdrop-blur-xl'
      }`}>
        <h3 className={`text-xl font-semibold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Top Performing Articles
        </h3>
        <div className="overflow-x-auto">
                  <table className="w-full">
            <thead>
              <tr className={`border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <th className={`text-left py-3 px-4 font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Article Title
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Views
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Likes
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Comments
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Engagement
                </th>
              </tr>
            </thead>
            <tbody>
              {topArticles.map((article, index) => (
                <tr key={index} className={`border-b transition-colors hover:bg-opacity-50 ${
                  isDarkMode 
                    ? 'border-gray-700 hover:bg-gray-700' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <td className={`py-4 px-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium">{article.title}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {article.views.toLocaleString()}
                  </td>
                  <td className={`py-4 px-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-heart text-red-500"></i>
                      <span>{article.likes}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-comment text-blue-500"></i>
                      <span>{article.comments}</span>
                    </div>
                  </td>
                  <td className={`py-4 px-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-20 h-2 rounded-full ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          style={{ 
                            width: `${Math.min(((article.likes + article.comments) / article.views) * 100 * 10, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm">
                        {(((article.likes + article.comments) / article.views) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
