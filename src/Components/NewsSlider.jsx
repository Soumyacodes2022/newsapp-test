import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from "../context/ThemeContext";

const NewsSlider = ({ news }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  
  const isAuthenticated = localStorage.getItem('token');
  const apiURL = process.env.REACT_APP_BASE_URL_API;

  // Auto slide functionality - pause when slider is shown
  useEffect(() => {
    if (showSlider) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, news, showSlider]);

  // Fetch likes and comments when current slide changes
  useEffect(() => {
    if (news && news.length > 0) {
      const currentNews = news[currentIndex];
      const articleUrl = currentNews.URL || currentNews.url;
      
      if (articleUrl) {
        fetchLikesCount(articleUrl);
        if (isAuthenticated) {
          checkUserLike(articleUrl);
        }
      }
    }
  }, [currentIndex, isAuthenticated]);

  const fetchLikesCount = async (articleUrl) => {
    try {
      const response = await fetch(`${apiURL}/likes/count?article=${encodeURIComponent(articleUrl)}`);
      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.data?.count || 0);
      }
    } catch (error) {
      console.error('Error fetching likes count:', error);
    }
  };

  const checkUserLike = async (articleUrl) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch(`${apiURL}/likes/check?article=${encodeURIComponent(articleUrl)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error('Error checking user like:', error);
    }
  };

  const fetchComments = async (articleUrl) => {
    try {
      const response = await fetch(`${apiURL}/comments?article=${encodeURIComponent(articleUrl)}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;

    const currentNews = news[currentIndex];
    const articleUrl = currentNews.URL || currentNews.url;
    
    try {
      if (isLiked) {
        const response = await fetch(`${apiURL}/likes?article=${encodeURIComponent(articleUrl)}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setIsLiked(false);
          setLikesCount(likesCount - 1);
        }
      } else {
        const response = await fetch(`${apiURL}/likes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            article: articleUrl
          })
        });

        if (response.ok) {
          setIsLiked(true);
          setLikesCount(likesCount + 1);
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !newComment.trim()) return;

    const currentNews = news[currentIndex];
    const articleUrl = currentNews.URL || currentNews.url;
    
    try {
      const response = await fetch(`${apiURL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          article: articleUrl,
          content: newComment
        })
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
                setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${apiURL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment._id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload).id;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  const currentUserId = getUserId();

  const openSlider = () => {
    const currentNews = news[currentIndex];
    const articleUrl = currentNews.URL || currentNews.url;
    
    setShowSlider(true);
    fetchComments(articleUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeSlider = () => {
    setShowSlider(false);
    setIsFullScreen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const nextSlide = () => {
    if (!news || news.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
  };

  const prevSlide = () => {
    if (!news || news.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  if (!news || news.length === 0) {
    return (
      <div className={`rounded-xl p-8 text-center ${
        isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600'
      }`}>
        <i className="fas fa-newspaper text-4xl mb-4 opacity-50"></i>
        <p>No news available</p>
      </div>
    );
  }

  const currentNews = news[currentIndex];

  return (
    <>
      {/* Main Slider */}
      <div 
        className={`relative overflow-hidden rounded-2xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header */}
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <i className="fas fa-fire text-red-500 mr-2"></i>
              Trending Stories
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentIndex + 1} of {news.length}
              </span>
            </div>
          </div>
        </div>
        
        {/* Slider Content */}
        <div className="relative h-96 md:h-[500px]">
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          
          {/* Slides */}
          <div className="relative h-full overflow-hidden">
            {news.map((item, index) => (
              <div 
                key={index} 
                className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${
                  index === currentIndex 
                    ? 'opacity-100 transform translate-x-0' 
                    : index < currentIndex 
                      ? 'opacity-0 transform -translate-x-full'
                      : 'opacity-0 transform translate-x-full'
                }`}
                onClick={openSlider}
              >
                <div className="relative h-full group">
                  <img 
                    src={item.imageURL || item.image || "https://demofree.sirv.com/nope-not-here.jpg"} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="max-w-4xl">
                      {/* Source Badge */}
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {item.source?.name || item.source || 'News'}
                        </span>
                        <span className="text-gray-300 text-sm">
                          {new Date(item.publishedAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <h3 className="text-xl md:text-3xl font-bold text-white mb-3 leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      
                      <p className="text-gray-200 text-sm md:text-base mb-4 line-clamp-2">
                        {item.description}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button 
                            className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                              isLiked 
                                ? 'bg-red-500/80 text-white' 
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike();
                            }}
                            disabled={!isAuthenticated}
                          >
                            <i className={`fas fa-heart ${isLiked ? 'text-white' : ''}`}></i>
                            <span className="text-sm">{likesCount}</span>
                          </button>
                          
                          <button 
                            className="flex items-center space-x-2 px-3 py-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              openSlider();
                            }}
                          >
                            <i className="fas fa-comment"></i>
                            <span className="text-sm">{comments.length}</span>
                          </button>
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                            Click to read more
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {news.map((_, index) => (
            <button 
              key={index} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Detailed Slider Overlay */}
      {showSlider && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeSlider}
          ></div>
          
          {/* Slider Content */}
          <div className={`relative ml-auto h-full transition-all duration-500 ease-out transform ${
            showSlider ? 'translate-x-0' : 'translate-x-full'
          } ${
            isFullScreen ? 'w-full' : 'w-full md:w-2/3 lg:w-1/2'
          } ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}>
            
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={closeSlider}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
                <span className="font-semibold">Story Details</span>
              </div>
              
              <button 
                onClick={toggleFullScreen}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Toggle Fullscreen"
              >
                <i className={`fas ${isFullScreen ? 'fa-compress' : 'fa-expand'}`}></i>
              </button>
            </div>

            {/* Content */}
            <div className="h-full overflow-y-auto pb-20">
              {isFullScreen ? (
                // Full Screen Split View
                <div className="flex h-full">
                  {/* Left: Article */}
                  <div className="w-1/2 p-6 overflow-y-auto">
                    <div className="relative h-64 mb-6 rounded-lg overflow-hidden group">
                      <img 
                        src={currentNews.imageURL || currentNews.image || "https://demofree.sirv.com/nope-not-here.jpg"} 
                        alt={currentNews.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <a 
                          href={currentNews.URL || currentNews.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
                        >
                          <i className="fas fa-external-link-alt mr-2"></i>
                          View Original
                        </a>
                      </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold mb-4">{currentNews.title}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {currentNews.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                          {currentNews.source?.name || currentNews.source}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(currentNews.publishedAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Community Discussion */}
                                    <div className={`w-1/2 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
                    <div className="h-full flex flex-col">
                      <h3 className="text-xl font-bold mb-4">
                        <i className="fas fa-users mr-2 text-blue-500"></i>
                        Community Discussion
                      </h3>
                      
                      {/* Social Stats */}
                      <div className="flex items-center space-x-6 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <button 
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                            isLiked 
                              ? 'bg-red-100 text-red-500 dark:bg-red-900/30' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          onClick={handleLike}
                          disabled={!isAuthenticated}
                        >
                          <i className={`fas fa-heart ${isLiked ? 'text-red-500' : ''}`}></i>
                          <span className="font-semibold">{likesCount} Likes</span>
                        </button>
                        
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <i className="fas fa-comment"></i>
                          <span className="font-semibold">{comments.length} Comments</span>
                        </div>
                      </div>
                      
                      {/* Comments Section */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                          {comments.length > 0 ? (
                            comments.map((comment) => (
                              <div key={comment._id} className={`p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
                                isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-sm font-bold">
                                        {(comment.user?.name || comment.user?.username || 'A').charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-sm">
                                        {comment.user?.name || comment.user?.username || 'Anonymous'}
                                      </span>
                                      <p className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                          day: 'numeric',
                                          month: 'short',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {currentUserId && comment.user && currentUserId === comment.user._id && (
                                    <button 
                                      className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300"
                                      onClick={() => handleDeleteComment(comment._id)}
                                      title="Delete comment"
                                    >
                                      <i className="fas fa-trash-alt text-xs"></i>
                                    </button>
                                  )}
                                </div>
                                <p className="text-sm leading-relaxed">{comment.content}</p>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-12">
                              <i className="fas fa-comments text-4xl mb-4 opacity-30"></i>
                              <p className="text-gray-500 mb-2">No comments yet</p>
                              <p className="text-sm text-gray-400">Start the conversation!</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Comment Form */}
                        {isAuthenticated ? (
                          <form onSubmit={handleCommentSubmit} className="space-y-3">
                            <textarea
                              className={`w-full p-3 rounded-lg border resize-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                isDarkMode 
                                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                  : 'bg-white border-gray-300 placeholder-gray-500'
                              }`}
                              placeholder="Share your thoughts..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              maxLength={500}
                              rows={3}
                              required
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{newComment.length}/500</span>
                              <button 
                                type="submit"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                disabled={!newComment.trim()}
                              >
                                <i className="fas fa-paper-plane mr-2"></i>
                                Post
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="text-center py-4">
                            <a href="/login" className="text-blue-500 hover:text-blue-600 font-semibold">
                              Login to join the discussion
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Regular Slider View
                <div className="p-6">
                  {/* Article Image */}
                  <div className="relative h-64 mb-6 rounded-lg overflow-hidden group">
                    <img 
                      src={currentNews.imageURL || currentNews.image || "https://demofree.sirv.com/nope-not-here.jpg"} 
                      alt={currentNews.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <a 
                        href={currentNews.URL || currentNews.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                      >
                        <i className="fas fa-external-link-alt mr-2"></i>
                        View Original Article
                      </a>
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                        {currentNews.source?.name || currentNews.source}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(currentNews.publishedAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h1 className={`text-2xl font-bold mb-4 leading-tight ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentNews.title}
                    </h1>
                    
                    <p className={`text-lg leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {currentNews.description}
                    </p>
                  </div>
                  
                  {/* Social Interactions */}
                  <div className={`flex items-center justify-between py-4 border-y ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <button 
                      className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 ${
                        isLiked 
                          ? 'bg-red-100 text-red-500 dark:bg-red-900/30' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleLike}
                      disabled={!isAuthenticated}
                    >
                      <i className={`fas fa-heart text-lg ${isLiked ? 'text-red-500' : ''}`}></i>
                      <span className="font-semibold">{likesCount} Likes</span>
                    </button>
                    
                    <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                      <i className="fas fa-comment text-lg"></i>
                      <span className="font-semibold">{comments.length} Comments</span>
                    </div>
                  </div>
                  
                  {/* Comments Section */}
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4">
                      <i className="fas fa-comments mr-2 text-blue-500"></i>
                      Comments
                    </h3>
                    
                    {/* Comments List */}
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment._id} className={`p-4 rounded-lg transition-all duration-300 hover:shadow-md ${
                            isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">
                                    {(comment.user?.name || comment.user?.username || 'A').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold text-sm">
                                    {comment.user?.name || comment.user?.username || 'Anonymous'}
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              
                              {currentUserId && comment.user && currentUserId === comment.user._id && (
                                <button 
                                  className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300"
                                  onClick={() => handleDeleteComment(comment._id)}
                                  title="Delete comment"
                                >
                                  <i className="fas fa-trash-alt text-sm"></i>
                                </button>
                              )}
                            </div>
                            <p className={`leading-relaxed ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {comment.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <i className="fas fa-comments text-4xl mb-4 opacity-30"></i>
                          <p className="text-gray-500 mb-2">No comments yet</p>
                          <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Comment Form */}
                    {isAuthenticated ? (
                      <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <div className="relative">
                          <textarea
                            className={`w-full p-4 rounded-lg border-2 resize-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              isDarkMode 
                                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                : 'bg-white border-gray-300 placeholder-gray-500'
                            }`}
                            placeholder="Share your thoughts on this story..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            maxLength={500}
                            rows={4}
                            required
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {newComment.length}/500
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>💡 Be respectful and constructive</span>
                          </div>
                          <button 
                            type="submit"
                                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            disabled={!newComment.trim()}
                          >
                            <i className="fas fa-paper-plane mr-2"></i>
                            Post Comment
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className={`text-center py-8 rounded-lg border-2 border-dashed ${
                        isDarkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50'
                      }`}>
                        <i className="fas fa-user-circle text-3xl mb-3 opacity-50"></i>
                        <p className="mb-3">Join the conversation!</p>
                        <a 
                          href="/login" 
                          className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                        >
                          <i className="fas fa-sign-in-alt mr-2"></i>
                          Login to Comment
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsSlider;
