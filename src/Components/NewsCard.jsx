import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from "../context/ThemeContext";

const NewsItem = (props) => {
  const { title, description, imageURL, URL, publishedAt, source, sourceUrl, isBookmarkPage, onDelete, fullArticle } = props;
  const { isDarkMode } = useContext(ThemeContext);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showSlider, setShowSlider] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const isAuthenticated = localStorage.getItem('token');
  const apiURL = process.env.REACT_APP_BASE_URL_API;

  useEffect(() => {
    if (URL) {
      fetchLikesCount();
      if (isAuthenticated) {
        checkUserLike();
      }
    }
  }, [URL, isAuthenticated]);

  useEffect(() => {
    if (showComments && URL) {
      fetchComments();
    }
  }, [showComments, URL]);

  const fetchLikesCount = async () => {
    try {
      const response = await fetch(`${apiURL}/likes/count?article=${encodeURIComponent(URL)}`);
      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.data?.count || 0);
      }
    } catch (error) {
      console.error('Error fetching likes count:', error);
    }
  };

  const checkUserLike = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch(`${apiURL}/likes/check?article=${encodeURIComponent(URL)}`, {
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

  const fetchComments = async () => {
    try {
      const response = await fetch(`${apiURL}/comments?article=${encodeURIComponent(URL)}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) return;

    try {
      const bookMarkPayload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          description,
          content: description,
          url: URL,
          image: imageURL,
          publishedAt,
          source: {
            name: source,
            url: sourceUrl
          }
        })
      }
      const response = await fetch(`${apiURL}/bookmarks`, bookMarkPayload);

      if (response.ok) {
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) return;

    try {
      if (isLiked) {
        const response = await fetch(`${apiURL}/likes?article=${encodeURIComponent(URL)}`, {
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
            article: URL
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

    try {
      const response = await fetch(`${apiURL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          article: URL,
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
    setShowSlider(true);
    setShowComments(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSlider = () => {
    setShowSlider(false);
    setIsFullScreen(false);
    setShowComments(false);
    document.body.style.overflow = 'unset';
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      {/* News Card */}
      <div className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Source Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {source}
          </span>
        </div>

        {/* Bookmark/Delete Icon */}
        {isAuthenticated && !isBookmarkPage && (
          <button 
            onClick={handleBookmark}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-300"
          >
            <i className={`fas fa-bookmark text-white ${isBookmarked ? 'text-yellow-400' : ''}`}></i>
          </button>
        )}
        
        {isBookmarkPage && (
          <button 
            onClick={onDelete}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-red-500/80 hover:bg-red-500 transition-all duration-300"
          >
            <i className="fas fa-trash text-white"></i>
          </button>
        )}

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden cursor-pointer" onClick={openSlider}>
          <img 
            src={imageURL || "https://demofree.sirv.com/nope-not-here.jpg"} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-white font-semibold">View Article</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h5 className={`font-bold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-blue-500 transition-colors ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`} onClick={openSlider}>
            {title}
          </h5>
          
          <p className={`text-sm mb-4 line-clamp-3 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
                        {description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(publishedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <button 
              onClick={openSlider}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm transition-colors"
            >
              Read More →
            </button>
          </div>

          {/* Social Interactions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <button 
              className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                isLiked 
                  ? 'bg-red-100 text-red-500 dark:bg-red-900/30' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleLike}
              disabled={!isAuthenticated}
            >
              <i className={`fas fa-heart ${isLiked ? 'text-red-500' : ''}`}></i>
              <span className="text-sm">{likesCount}</span>
            </button>
            
            <button 
              className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              onClick={openSlider}
            >
              <i className="fas fa-comment"></i>
              <span className="text-sm">{comments.length}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slider Overlay - Fixed positioning and z-index */}
      {showSlider && (
        <div className="fixed inset-0 z-[9999] flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSlider}
          ></div>
          
          {/* Slider Content */}
          <div className={`relative ml-auto h-full transition-all duration-500 ease-out ${
            isFullScreen ? 'w-full' : 'w-full md:w-2/3 lg:w-1/2'
          } ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl transform ${
            showSlider ? 'translate-x-0' : 'translate-x-full'
          }`}>
            
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
                <span className="font-semibold">Article Details</span>
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
                    <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                      <img 
                        src={imageURL || "https://demofree.sirv.com/nope-not-here.jpg"} 
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <a 
                          href={URL} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300"
                        >
                          View Original Article
                        </a>
                      </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold mb-4">{title}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                          {source}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Community */}
                  <div className={`w-1/2 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
                    <div className="h-full flex flex-col">
                      <h3 className="text-xl font-bold mb-4">Community Discussion</h3>
                      
                      {/* Social Stats */}
                      <div className="flex items-center space-x-6 mb-6">
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
                          <span>{likesCount} Likes</span>
                        </button>
                        
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <i className="fas fa-comment"></i>
                          <span>{comments.length} Comments</span>
                        </div>
                      </div>
                      
                      {/* Comments Section */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex-1 overflow-y-auto mb-4">
                          {comments.length > 0 ? (
                            <div className="space-y-4">
                              {comments.map((comment) => (
                                <div key={comment._id} className={`p-4 rounded-lg ${
                                  isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                                }`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-sm">
                                      {comment.user?.name || 'Anonymous'}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-xs text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                      </span>
                                      {currentUserId && currentUserId === comment.user?._id && (
                                        <button 
                                          className="text-red-500 hover:text-red-600 text-xs"
                                          onClick={() => handleDeleteComment(comment._id)}
                                        >
                                          <i className="fas fa-trash-alt"></i>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <i className="fas fa-comments text-3xl mb-2 opacity-50"></i>
                              <p>No comments yet. Start the conversation!</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Comment Form */}
                        {isAuthenticated ? (
                          <form onSubmit={handleCommentSubmit} className="space-y-3">
                            <textarea
                              className={`w-full p-3 rounded-lg border resize-none ${
                                isDarkMode 
                                  ? 'bg-gray-800 border-gray-600 text-white' 
                                  : 'bg-white border-gray-300'
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
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                              >
                                Post Comment
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="text-center py-4">
                            <a href="/login" className="text-blue-500 hover:text-blue-600 font-semibold">
                              Login to add a comment
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
                      src={imageURL || "https://demofree.sirv.com/nope-not-here.jpg"} 
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <a 
                        href={URL} 
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
                        {source}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(publishedAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h1 className={`text-2xl font-bold mb-4 leading-tight ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {title}
                    </h1>
                    
                    <p className={`text-lg leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {description}
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
                    <h3 className="text-xl font-bold mb-4">Comments</h3>
                    
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
                                    {(comment.user?.name || 'A').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold text-sm">
                                    {comment.user?.name || 'Anonymous'}
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
                              
                              {currentUserId && currentUserId === comment.user?._id && (
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
                            placeholder="Share your thoughts on this article..."
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

export default NewsItem;
