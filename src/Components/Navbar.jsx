import React, {useEffect, useState, useContext, useRef} from "react";
import { Link , useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({updateNews}) => {
  let location = useLocation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [trendingNews, setTrendingNews] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  
  const dropdownRef = useRef(null);
  const searchModalRef = useRef(null);
  const searchInputRef = useRef(null);
  const isAuthenticated = localStorage.getItem('token');
  const navigate = useNavigate();

  // Mock trending news data - replace with actual API call
  const mockTrendingNews = [
    { id: 1, title: "Breaking: Major tech breakthrough announced", category: "Technology", time: "2h ago" },
    { id: 2, title: "Global climate summit reaches historic agreement", category: "Environment", time: "4h ago" },
    { id: 3, title: "Stock markets hit record highs amid economic recovery", category: "Business", time: "6h ago" },
    { id: 4, title: "New archaeological discovery rewrites history", category: "Science", time: "8h ago" },
    { id: 5, title: "Championship finals draw massive viewership", category: "Sports", time: "12h ago" }
  ];

  const trendingSearches = [
    "AI Revolution", "Climate Change", "Cryptocurrency", "Space Exploration", 
    "Electric Vehicles", "Quantum Computing", "Renewable Energy", "Biotechnology"
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (searchModalRef.current && !searchModalRef.current.contains(event.target)) {
        setShowSearchModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearchModal) {
      setTrendingNews(mockTrendingNews);
      searchInputRef.current?.focus();
    }
  }, [showSearchModal]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const performSearch = async (query) => {
    setIsSearching(true);
    // Mock search results - replace with actual API call
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: `${query} in Technology: Latest developments`, category: "Technology" },
        { id: 2, title: `${query} impacts global markets`, category: "Business" },
        { id: 3, title: `Scientists discover ${query} breakthrough`, category: "Science" }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleProtectedRouteClick = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowSignInModal(true);
    }
  };

  const handleSearch = (query) => {
    if (updateNews && query.trim()) {
      updateNews(query);
      setShowSearchModal(false);
      setSearchTerm('');
    }
  };

  const handleTrendingClick = (trending) => {
    setSearchTerm(trending);
    handleSearch(trending);
  };

  const navigationItems = [
    { path: '/business', icon: 'fas fa-briefcase', name: 'Business', color: 'text-blue-500' },
    { path: '/entertainment', icon: 'fas fa-film', name: 'Entertainment', color: 'text-purple-500' },
    { path: '/health', icon: 'fas fa-heartbeat', name: 'Health', color: 'text-red-500' },
    { path: '/science', icon: 'fas fa-flask', name: 'Science', color: 'text-green-500' },
    { path: '/sports', icon: 'fas fa-futbol', name: 'Sports', color: 'text-orange-500' },
    { path: '/technology', icon: 'fas fa-microchip', name: 'Technology', color: 'text-indigo-500' },
    { path: '/about', icon: 'fas fa-info-circle', name: 'About', color: 'text-gray-500' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-800' 
          : 'bg-white/95 backdrop-blur-xl border-b border-gray-200'
      } shadow-xl`}>
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <Link 
              to="/" 
              className={`flex items-center space-x-3 text-2xl font-bold transition-all duration-300 hover:scale-105 ${
                isDarkMode ? 'text-white hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-newspaper text-white text-lg"></i>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <span className="hidden sm:block">
                Taaza<span className="text-blue-500">NEWS</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link 
                to="/" 
                className={`group relative px-4 py-2 rounded-xl transition-all duration-300 ${
                  location.pathname === "/" 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                <i className="fas fa-home mr-2"></i>
                <span>Home</span>
                {location.pathname === "/" && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>

              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleProtectedRouteClick(e, item.path)}
                  className={`group relative px-4 py-2 rounded-xl transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <i className={`${item.icon} mr-2 ${location.pathname === item.path ? 'text-white' : item.color}`}></i>
                  <span>{item.name}</span>
                  {location.pathname === item.path && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Search Button */}
              {isAuthenticated && (
                <button
                  onClick={() => setShowSearchModal(true)}
                  className={`group relative flex items-center space-x-3 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    isDarkMode
                      ? 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                      : 'bg-gray-50/50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                  } shadow-lg hover:shadow-xl backdrop-blur-sm`}
                >
                  <i className="fas fa-search text-blue-500"></i>
                  <span className="hidden md:block text-sm">Search news...</span>
                  <div className="hidden md:flex items-center space-x-1 text-xs opacity-60">
                  </div>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-gray-800/20 text-gray-700 hover:bg-gray-800/30'
                } shadow-lg hover:shadow-xl backdrop-blur-sm`}
                title="Toggle theme"
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg transition-transform duration-300 ${isDarkMode ? 'rotate-180' : 'rotate-0'}`}></i>
              </button>

              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                      isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                    } shadow-lg hover:shadow-xl backdrop-blur-sm`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <i className="fas fa-user text-white text-sm"></i>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    </div>
                    <i className={`fas fa-chevron-down text-xs transition-transform duration-300 ${
                      showDropdown ? 'rotate-180' : ''
                    }`}></i>
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {showDropdown && (
                    <div className={`absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl border transition-all duration-300 transform origin-top-right ${
                      isDarkMode
                        ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl'
                        : 'bg-white/95 border-gray-200 backdrop-blur-xl'
                    }`}>
                      <div className="p-4">
                        <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <i className="fas fa-user text-white"></i>
                          </div>
                          <div>
                            <p className="font-semibold">Welcome back!</p>
                            <p className="text-sm opacity-60">Premium Member</p>
                          </div>
                        </div>
                        
                        <Link
                          to="/bookmarks"
                          className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                            isDarkMode
                              ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                          onClick={() => setShowDropdown(false)}
                        >
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <i className="fas fa-bookmark text-blue-500 text-sm"></i>
                          </div>
                          <div>
                            <span className="font-medium">Bookmarks</span>
                            <p className="text-xs opacity-60">Saved articles</p>
                          </div>
                        </Link>
                        
                        <div className="my-3 border-t border-gray-200 dark:border-gray-700"></div>
                        
                                                <button
                          onClick={() => {
                            localStorage.removeItem('token');
                            setShowDropdown(false);
                            window.location.reload();
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                            isDarkMode
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                              : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          }`}
                        >
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                            <i className="fas fa-sign-out-alt text-red-500 text-sm"></i>
                          </div>
                          <div className="text-left">
                            <span className="font-medium">Sign Out</span>
                            <p className="text-xs opacity-60">See you later!</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl transform"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`lg:hidden p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/50'
                } shadow-lg hover:shadow-xl backdrop-blur-sm`}
              >
                <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'} text-lg transition-transform duration-300`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className={`lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl shadow-2xl border transition-all duration-300 ${
              isDarkMode
                ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl'
                : 'bg-white/95 border-gray-200 backdrop-blur-xl'
            }`}>
              <div className="p-6 space-y-4">
                <Link
                  to="/"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    location.pathname === "/"
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : isDarkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <i className="fas fa-home text-lg"></i>
                  <span className="font-medium">Home</span>
                </Link>

                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={(e) => {
                      handleProtectedRouteClick(e, item.path);
                      setShowMobileMenu(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`${item.icon} text-lg ${location.pathname === item.path ? 'text-white' : item.color}`}></i>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowSearchModal(false)}
          ></div>
          
          {/* Search Modal */}
          <div 
            ref={searchModalRef}
            className={`relative w-full max-w-2xl rounded-2xl shadow-2xl border transition-all duration-300 transform ${
              isDarkMode
                ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl'
                : 'bg-white/95 border-gray-200 backdrop-blur-xl'
            }`}
          >
            {/* Search Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 text-lg"></i>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search breaking news, trending topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  {isSearching && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className={`p-3 rounded-xl transition-all duration-200 hover:scale-110 ${
                    isDarkMode
                      ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
            </div>

            {/* Search Content */}
            <div className="max-h-96 overflow-y-auto">
              {searchTerm.trim() ? (
                // Search Results
                <div className="p-6">
                  <h3 className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <i className="fas fa-search-plus mr-2 text-blue-500"></i>
                    Search Results
                  </h3>
                  {searchResults.length > 0 ? (
                    <div className="space-y-3">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearch(result.title)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                            isDarkMode
                              ? 'hover:bg-gray-700/50 border border-gray-700'
                              : 'hover:bg-gray-50 border border-gray-200'
                          } shadow-lg hover:shadow-xl`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className={`font-medium mb-1 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {result.title}
                              </h4>
                              <span className="text-sm text-blue-500 font-medium">
                                {result.category}
                              </span>
                            </div>
                            <i className="fas fa-arrow-right text-gray-400 ml-4"></i>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : !isSearching ? (
                    <div className="text-center py-8">
                      <i className="fas fa-search text-4xl mb-4 opacity-30"></i>
                      <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        No results found
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Try different keywords or check trending topics below
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                // Trending Content
                <div className="p-6 space-y-6">
                  {/* Trending Searches */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <i className="fas fa-fire mr-2 text-red-500"></i>
                      Trending Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((trend, index) => (
                        <button
                          key={index}
                          onClick={() => handleTrendingClick(trend)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                            isDarkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                          } shadow-md hover:shadow-lg`}
                        >
                          <i className="fas fa-hashtag mr-1 text-xs opacity-60"></i>
                          {trend}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending News */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <i className="fas fa-chart-line mr-2 text-green-500"></i>
                      Trending News
                    </h3>
                    <div className="space-y-3">
                      {trendingNews.map((news, index) => (
                        <button
                          key={news.id}
                          onClick={() => handleSearch(news.title)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                            isDarkMode
                              ? 'hover:bg-gray-700/50 border border-gray-700'
                              : 'hover:bg-gray-50 border border-gray-200'
                          } shadow-lg hover:shadow-xl group`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  index < 3 
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' 
                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                                }`}>
                                  {news.category}
                                </span>
                                <span className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {news.time}
                                </span>
                              </div>
                              <h4 className={`font-medium group-hover:text-blue-500 transition-colors ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {news.title}
                              </h4>
                            </div>
                            <div className="ml-4 flex items-center">
                              {index < 3 && (
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
                                  <span className="text-white text-xs font-bold">{index + 1}</span>
                                </div>
                              )}
                              <i className="fas fa-arrow-right text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <i className="fas fa-bolt mr-2 text-yellow-500"></i>
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                                           <button
                        onClick={() => handleTrendingClick('breaking news')}
                        className={`p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                          isDarkMode
                            ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30 border border-red-800'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        } shadow-lg hover:shadow-xl`}
                      >
                        <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
                        <div className="text-sm font-medium">Breaking News</div>
                      </button>
                      
                      <button
                        onClick={() => handleTrendingClick('latest updates')}
                        className={`p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                          isDarkMode
                            ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 border border-blue-800'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                        } shadow-lg hover:shadow-xl`}
                      >
                        <i className="fas fa-clock text-2xl mb-2"></i>
                        <div className="text-sm font-medium">Latest Updates</div>
                      </button>
                      
                      <button
                        onClick={() => handleTrendingClick('top stories')}
                        className={`p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                          isDarkMode
                            ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30 border border-green-800'
                            : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                        } shadow-lg hover:shadow-xl`}
                      >
                        <i className="fas fa-star text-2xl mb-2"></i>
                        <div className="text-sm font-medium">Top Stories</div>
                      </button>
                      
                      <button
                        onClick={() => handleTrendingClick('world news')}
                        className={`p-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                          isDarkMode
                            ? 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/30 border border-purple-800'
                            : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200'
                        } shadow-lg hover:shadow-xl`}
                      >
                        <i className="fas fa-globe text-2xl mb-2"></i>
                        <div className="text-sm font-medium">World News</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Footer */}
            <div className={`p-4 border-t ${
              isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'
            } rounded-b-2xl`}>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className={`flex items-center space-x-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">↵</kbd>
                    <span>to search</span>
                  </span>
                  <span className={`flex items-center space-x-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">ESC</kbd>
                    <span>to close</span>
                  </span>
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Powered by TaazaNEWS
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowSignInModal(false)}
          ></div>
          
          <div className={`relative max-w-md w-full rounded-2xl shadow-2xl border transition-all duration-300 transform ${
            isDarkMode
              ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl'
              : 'bg-white/95 border-gray-200 backdrop-blur-xl'
          }`}>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className="fas fa-lock text-white text-2xl"></i>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Premium Feature
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Sign in to access exclusive news categories, bookmarks, and personalized content!
                </p>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <i className="fas fa-crown text-yellow-500 mr-2"></i>
                    What you'll get:
                  </h4>
                  <ul className={`space-y-2 text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Access to all news categories
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Bookmark your favorite articles
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Personalized news feed
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      Comment and engage with community
                    </li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSignInModal(false)}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => {
                      setShowSignInModal(false);
                      navigate('/login');
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign In Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      <div className="hidden">
        {/* Add keyboard event listeners */}
        {typeof window !== 'undefined' && (
          <KeyboardShortcuts 
            onSearchOpen={() => setShowSearchModal(true)}
            onSearchClose={() => setShowSearchModal(false)}
          />
        )}
      </div>
    </>
  );
};

// Keyboard Shortcuts Component
const KeyboardShortcuts = ({ onSearchOpen, onSearchClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Cmd/Ctrl + K to open search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onSearchOpen();
      }
      
      // Escape to close search
      if (event.key === 'Escape') {
        onSearchClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearchOpen, onSearchClose]);

  return null;
};

export default Navbar;
