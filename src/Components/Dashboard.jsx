import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const Dashboard = ({ 
  visitorsData = [], 
  newsPreferencesData = [], 
  dailyVisitsData = [], 
  categoryEngagementData = [],
  totalVisitors = 0,
  activeUsers = 0,
  totalArticlesRead = 0,
  averageSessionTime = 0
}) => {
  const { isDarkMode } = false;

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  // Theme-based styling
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textColor} mb-2`}>Analytics Dashboard</h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Monitor your news app performance and user engagement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${cardBg} ${borderColor} border rounded-lg p-6 shadow-sm`}>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Visitors</p>
                <p className={`text-2xl font-semibold ${textColor}`}>{totalVisitors.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} ${borderColor} border rounded-lg p-6 shadow-sm`}>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Users</p>
                <p className={`text-2xl font-semibold ${textColor}`}>{activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} ${borderColor} border rounded-lg p-6 shadow-sm`}>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Articles Read</p>
                <p className={`text-2xl font-semibold ${textColor}`}>{totalArticlesRead.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className={`${cardBg} ${borderColor} border rounded-lg p-6 shadow-sm`}>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg. Session</p>
                <p className={`text-2xl font-semibold ${textColor}`}>{averageSessionTime}m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Visits Chart */}
          <div className={`${cardBg} ${borderColor} border rounded-lg p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Daily Visits</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyVisitsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                  }}
                />
                <Area type="monotone" dataKey="visits" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* News Preferences Pie Chart */}
          <div className={`${cardBg} ${borderColor} border rounded-lg p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>News Category Preferences</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={newsPreferencesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {newsPreferencesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full Width Charts */}
        <div className="grid grid-cols-1 gap-6">
          {/* Visitors by Demographics */}
          <div className={`${cardBg} ${borderColor} border rounded-lg p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Visitor Demographics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={visitorsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="demographic" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                  }}
                />
                <Legend />
                <Bar dataKey="visitors" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Engagement */}
          <div className={`${cardBg} ${borderColor} border rounded-lg p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Category Engagement Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={categoryEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="month" stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`,
                    color: isDarkMode ? '#FFFFFF' : '#000000'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="business" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="technology" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="sports" stroke="#ffc658" strokeWidth={2} />
                <Line type="monotone" dataKey="entertainment" stroke="#ff7300" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;