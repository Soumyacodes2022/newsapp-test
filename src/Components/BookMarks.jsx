import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Bookmarks = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');

  // Hardcoded bookmarks data
  const bookmarks = [
    {
      id: 1,
      title: "AI Revolution in Healthcare: How Machine Learning is Transforming Medical Diagnosis",
      description: "Explore the groundbreaking applications of artificial intelligence in healthcare, from early disease detection to personalized treatment plans.",
      category: "Technology",
      source: "TechNews",
      image: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=AI+Healthcare",
      bookmarkedAt: "2024-01-15",
      readTime: "8 min read",
      tags: ["AI", "Healthcare", "Machine Learning"],
      isRead: true
    },
    {
      id: 2,
      title: "Climate Change Solutions: Innovative Technologies Leading the Green Revolution",
      description: "Discover the latest breakthrough technologies that are helping combat climate change and create a sustainable future.",
      category: "Environment",
      source: "EcoDaily",
      image: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Climate+Tech",
      bookmarkedAt: "2024-01-14",
      readTime: "12 min read",
      tags: ["Climate", "Technology", "Sustainability"],
      isRead: false
    },
    {
      id: 3,
      title: "Cryptocurrency Market Analysis: Bitcoin and Ethereum Price Predictions for 2024",
      description: "In-depth analysis of cryptocurrency trends and expert predictions for major digital currencies in the coming year.",
      category: "Business",
      source: "CryptoInsider",
      image: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Crypto+Market",
      bookmarkedAt: "2024-01-13",
      readTime: "6 min read",
      tags: ["Cryptocurrency", "Bitcoin", "Investment"],
      isRead: true
    },
    {
      id: 4,
      title: "Space Exploration Breakthrough: NASA's Latest Mars Mission Discoveries",
      description: "Latest findings from NASA's Mars rover mission reveal new insights about the Red Planet's potential for past life.",
      category: "Science",
      source: "SpaceNews",
      image: "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Mars+Mission",
      bookmarkedAt: "2024-01-12",
      readTime: "10 min read",
      tags: ["Space", "NASA", "Mars"],
      isRead: false
    },
    {
      id: 5,
      title: "Mental Health in the Digital Age: Strategies for Maintaining Wellness",
      description: "Expert advice on managing mental health challenges in our increasingly connected world.",
      category: "Health",
      source: "HealthToday",
      image: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Mental+Health",
      bookmarkedAt: "2024-01-11",
      readTime: "7 min read",
      tags: ["Mental Health", "Wellness", "Digital"],
      isRead: true
    },
    {
      id: 6,
      title: "Electric Vehicle Revolution: Tesla's New Battery Technology",
      description: "Tesla announces breakthrough in battery technology that could revolutionize electric vehicle range and charging times.",
      category: "Technology",
      source: "AutoTech",
      image: "https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=EV+Battery",
      bookmarkedAt: "2024-01-10",
      readTime: "5 min read",
      tags: ["Electric Vehicles", "Tesla", "Battery"],
      isRead: false
    }
  ];

  const categories = ['all', 'Technology', 'Business', 'Science', 'Health', 'Environment'];

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory;
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
      case 'oldest':
        return new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleRemoveBookmark = (id) => {
    // In a real app, this would update the state/database
    console.log('Removing bookmark:', id);
  };

  const handleToggleRead = (id) => {
    // In a real app, this would update the read status
    console.log('Toggling read status:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            My Bookmarks
          </h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {bookmarks.length} saved articles • {bookmarks.filter(b => !b.isRead).length} unread
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`px-4 py-2 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-2 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedBookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className={`group rounded-2xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700 backdrop-blur-xl' 
                : 'bg-white/50 border-gray-200 backdrop-blur-xl'
            }`}
          >
            {/* Image */}
            <div className="relative overflow-hidden rounded-t-2xl">
              <img
                src={bookmark.image}
                alt={bookmark.title}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  bookmark.category === 'Technology' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  bookmark.category === 'Business' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  bookmark.category === 'Science' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  bookmark.category === 'Health' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {bookmark.category}
                </span>
              </div>
                           <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleToggleRead(bookmark.id)}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    bookmark.isRead
                      ? 'bg-green-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                  title={bookmark.isRead ? 'Mark as unread' : 'Mark as read'}
                >
                  <i className={`fas ${bookmark.isRead ? 'fa-check' : 'fa-eye'} text-sm`}></i>
                </button>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                  title="Remove bookmark"
                >
                  <i className="fas fa-trash text-sm"></i>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {bookmark.source}
                </span>
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {bookmark.readTime}
                </span>
              </div>

              <h3 className={`text-lg font-semibold mb-3 line-clamp-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {bookmark.title}
              </h3>

              <p className={`text-sm mb-4 line-clamp-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {bookmark.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {bookmark.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-lg text-xs ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                </span>
                <button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                  isDarkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
                  Read Article
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedBookmarks.length === 0 && (
        <div className="text-center py-12">
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <i className={`fas fa-bookmark text-3xl ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`}></i>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            No bookmarks found
          </h3>
          <p className={`${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Start bookmarking articles to see them here'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
