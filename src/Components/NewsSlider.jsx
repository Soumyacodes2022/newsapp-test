import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import './NewsSlider.css';

const NewsSlider = ({ news }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const isAuthenticated = localStorage.getItem('token');
  const apiURL = process.env.REACT_APP_BASE_URL_API;

  // Auto slide functionality - pause when comments are shown
  useEffect(() => {
    if (showComments) return; // Don't auto-slide when comments are shown
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, news, showComments]);

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
        if (showComments) {
          fetchComments(articleUrl);
        }
      }
    }
  }, [currentIndex, showComments, isAuthenticated]);

  const fetchLikesCount = async (articleUrl) => {
    try {
      const response = await fetch(`${apiURL}/likes/count?article=${encodeURIComponent(articleUrl)}`);
      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.count);
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
        setComments(data.comments || []);
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
        // Unlike the article
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
        // Like the article
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

  // Get user ID from token for permission checks
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

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments && news && news.length > 0) {
      const currentNews = news[currentIndex];
      fetchComments(currentNews.URL || currentNews.url);
    }
  };

  const nextSlide = () => {
    if (!news || news.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    if (showComments) setShowComments(false);
  };

  const prevSlide = () => {
    if (!news || news.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
    if (showComments) setShowComments(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (showComments) setShowComments(false);
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
      // Swipe left
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      prevSlide();
    }
  };

  if (!news || news.length === 0) {
    return <div className="news-slider-container">No news available</div>;
  }

  const currentNews = news[currentIndex];

  return (
    <div 
      className="news-slider-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slider-title">
        <h2>Top Stories</h2>
      </div>
      
      <div className={`slider-content ${showComments ? 'with-comments' : ''}`}>
        {!showComments && (
          <button className="slider-arrow prev" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        
        <div className="slider-view">
          {news.map((item, index) => (
            <div 
              key={index} 
              className={`slide ${index === currentIndex ? 'active' : ''}`}
              style={{ transform: `translateX(${100 * (index - currentIndex)}%)` }}
            >
              <div className={`slide-main-content ${showComments ? 'with-comments' : ''}`}>
                <div className="slide-image-container">
                  <img 
                    src={item.imageURL || item.image || "https://demofree.sirv.com/nope-not-here.jpg"} 
                    alt={item.title} 
                    className="slide-image"
                  />
                  <div className="slide-source-badge">
                    <span>{item.source || (item.source && item.source.name) || 'News'}</span>
                  </div>
                </div>
                
                <div className="slide-content">
                  <h3 className="slide-title">{item.title}</h3>
                  <p className="slide-description">{item.description}</p>
                  <div className="slide-footer">
                    <span className="slide-date">
                      {new Date(item.publishedAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <a 
                      href={item.URL || item.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="slide-read-more"
                    >
                      Read More <i className="fas fa-arrow-right"></i>
                    </a>
                  </div>
                  
                  {/* Social interaction section */}
                  <div className="social-interactions">
                    <div className="like-section">
                      <button 
                        className={`like-button ${isLiked ? 'liked' : ''}`} 
                        onClick={handleLike}
                        disabled={!isAuthenticated}
                        title={isAuthenticated ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
                      >
                        <i className={`fas fa-heart ${isLiked ? 'liked' : ''}`}></i>
                        <span>{likesCount}</span>
                      </button>
                    </div>
                    
                    <div className="comment-section">
                      <button className="comment-toggle" onClick={toggleComments}>
                        <i className="fas fa-comment"></i>
                        <span>{comments.length} Comments</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comments section - only shown for current slide when showComments is true */}
              {showComments && index === currentIndex && (
                <div className="slide-comments">
                  <div className="comments-header">
                    <h4>Comments</h4>
                    <button className="close-comments" onClick={toggleComments}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  {comments.length > 0 ? (
                    <div className="comments-list">
                      {comments.map((comment) => (
                        <div key={comment._id || Math.random()} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-author">
                              {comment.user && comment.user.username ? comment.user.username : 'Anonymous'}
                            </span>
                            <span className="comment-date">
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                          
                          {/* Show delete button only for user's own comments */}
                          {currentUserId && comment.user && currentUserId === comment.user._id && (
                            <button 
                              className="delete-comment-btn" 
                              onClick={() => handleDeleteComment(comment._id)}
                              title="Delete comment"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                  )}
                  
                  {isAuthenticated ? (
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                      <textarea
                        className="comment-input"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        maxLength={500}
                        required
                      />
                      <div className="comment-form-footer">
                        <span className="char-count">{newComment.length}/500</span>
                        <button type="submit" className="comment-submit">Post</button>
                      </div>
                    </form>
                  ) : (
                    <p className="login-to-comment">
                      <a href="/login">Login</a> to add a comment
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!showComments && (
          <button className="slider-arrow next" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
      
      {!showComments && (
        <div className="slider-indicators">
          {news.map((_, index) => (
            <button 
              key={index} 
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default NewsSlider;