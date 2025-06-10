import React, { useState, useEffect } from 'react';

const NewsItem = (props) => {
  const { title, description, imageURL, URL, publishedAt, source, sourceUrl, isBookmarkPage, onDelete } = props;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  console.log(comments)
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const isAuthenticated = localStorage.getItem('token');
  const apiURL = process.env.REACT_APP_BASE_URL_API;

  // Fetch likes and comments when component mounts or URL changes
  useEffect(() => {
    if (URL) {
      fetchLikesCount();
      if (isAuthenticated) {
        checkUserLike();
      }
    }
  }, [URL, isAuthenticated]);

  // Fetch comments when comments section is opened
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
        console.log(data)
        setLikesCount(data.data.count);
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
        // Unlike the article
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
        // Like the article
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
        console.log(data)
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

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Get user ID from token for permission checks
  const getUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // This is a simple way to extract the payload from JWT
      // In a production app, you might want to use a proper JWT library
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

  return (
    <div className="news-card-container">
      <div className="news-card">
        <div className="source-badge">
          <span className="badge-text">{source}</span>
        </div>
        {isAuthenticated && !isBookmarkPage && (
          <div className="bookmark-icon" onClick={handleBookmark}>
            <i className={`fas fa-bookmark ${isBookmarked ? 'bookmarked' : ''}`}></i>
          </div>
        )}
        {isBookmarkPage && (
          <div className="delete-icon" onClick={onDelete}>
            <i className="fas fa-trash"></i>
          </div>
        )}
        <div className="image-container">
          <img 
            src={!imageURL ? "https://demofree.sirv.com/nope-not-here.jpg" : imageURL} 
            alt={title}
            className="card-image"
          />
        </div>

        <div className="card-content">
          <h5 className="card-title">{title}...</h5>
          <p className="card-description">{description}...</p>
          
          <div className="card-footer">
            <p className="publish-date">
              {new Date(publishedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
            <a href={URL} rel="noreferrer" target="_blank" className="read-more-btn">
              Read More
              <span className="arrow">→</span>
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

          {/* Comments section */}
          {showComments && (
            <div className="comments-container">
              <h6>Comments</h6>
              
              {comments.length > 0 ? (
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">
                          {comment.user.name || 'Anonymous'}
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
                      {currentUserId && currentUserId === comment.user._id && (
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
      </div>
    </div>
  );
};

export default NewsItem;
