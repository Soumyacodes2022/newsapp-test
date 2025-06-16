import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from "../context/ThemeContext";
import { useAI } from '../hooks/useAi';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import MarkdownRenderer from './MarkdownRenderer';

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
  
  // Enhanced features states
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null); // Track which emoji picker is open

  //ai generation states
  const [aiContent, setAiContent] = useState(null);
const [loadingAI, setLoadingAI] = useState(false);
const { processArticle } = useAI();
const { speak, stop, isPlaying, isPaused, pause, resume, isSupported, currentText } = useTextToSpeech();

const handleAIProcess = async () => {
  if (aiContent || loadingAI) return;
  
  setLoadingAI(true);
  try {
    const result = await processArticle(URL, description, title);
    setAiContent(result);
    showNotification(
      `AI Summary Generated! ${result.scraped ? 'Full article analyzed' : 'Using available content'}`, 
      'success'
    );
  } catch (error) {
    console.error('AI processing failed:', error);
    showNotification('Failed to generate AI summary. Using original content.', 'error');
    // Set fallback content
    setAiContent({
      summary: description,
      fullContent: description,
      source: 'fallback'
    });
  } finally {
    setLoadingAI(false);
  }
};


const TTSControls = ({ text, label, className = "" }) => {
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState(false);
  
  // Check if this specific text is currently playing
  useEffect(() => {
    setIsCurrentlyPlaying(isPlaying && currentText.includes(cleanTextForSpeech(text)));
  }, [isPlaying, currentText, text]);

  const cleanTextForSpeech = (text) => {
    return text
      .replace(/[#*_`]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  if (!isSupported) {
    return (
      <div className={`flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg opacity-50 ${className}`}>
        <i className="fas fa-volume-mute text-gray-400"></i>
        <span className="text-sm text-gray-500">Text-to-speech not supported in this browser</span>
      </div>
    );
  }

  const handlePlay = () => {
    // If something else is playing, stop it first
    if (isPlaying && !isCurrentlyPlaying) {
      stop();
    }
    speak(text, { rate: 0.85, pitch: 1, volume: 0.9 });
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm ${className}`}>
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-full transition-all duration-300 ${
          isCurrentlyPlaying 
            ? 'bg-blue-500 animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}>
          <i className="fas fa-volume-up text-white"></i>
        </div>
        <div>
          <span className="text-sm font-bold text-blue-900 dark:text-blue-100">{label}</span>
          <p className="text-xs text-blue-600 dark:text-blue-300 flex items-center space-x-1">
            {isCurrentlyPlaying ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{isPaused ? 'Paused' : 'Playing news...'}</span>
              </>
            ) : (
              <>
                <i className="fas fa-play text-xs"></i>
                <span>Ready to play</span>
              </>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {!isCurrentlyPlaying ? (
          <button
            onClick={handlePlay}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
            title="Play news summary"
          >
            <i className="fas fa-play text-sm"></i>
            <span>Play News</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
                        {!isPaused ? (
              <button
                onClick={pause}
                className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors shadow-md"
                title="Pause"
              >
                <i className="fas fa-pause"></i>
              </button>
            ) : (
              <button
                onClick={resume}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-md"
                title="Resume"
              >
                <i className="fas fa-play"></i>
              </button>
            )}
            <button
              onClick={stop}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-md"
              title="Stop"
            >
              <i className="fas fa-stop"></i>
            </button>
            
            {/* Progress indicator */}
            <div className="flex items-center space-x-1 px-2">
              <div className="w-1 h-4 bg-blue-400 rounded animate-pulse"></div>
              <div className="w-1 h-6 bg-blue-500 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-4 bg-blue-400 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



  
  const isAuthenticated = localStorage.getItem('token');
  const apiURL = process.env.REACT_APP_BASE_URL_API;

  // Enhanced emoji data with categories
  const emojiCategories = {
    faces: ['😀', '😂', '😍', '🤔', '😢', '😡', '😎', '🤗', '😱', '🤯'],
    gestures: ['👍', '👎', '👏', '🤝', '🙏', '💪', '✌️', '🤞', '👌', '🔥'],
    hearts: ['❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎', '💯'],
    objects: ['🎉', '⭐', '💎', '🏆', '🎯', '📰', '💡', '🚀', '⚡', '🌟']
  };

  const allEmojis = Object.values(emojiCategories).flat();

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
        setIsLiked(data.data?.liked || false);
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
        
        // Fetch comment likes for authenticated users
        if (isAuthenticated && data.data?.length > 0) {
          const allCommentIds = [];
          data.data.forEach(comment => {
            allCommentIds.push(comment._id);
            if (comment.replies) {
              comment.replies.forEach(reply => allCommentIds.push(reply._id));
            }
          });
          fetchCommentLikes(allCommentIds);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchCommentLikes = async (commentIds) => {
    try {
      const response = await fetch(`${apiURL}/comments/likes/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ commentIds })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCommentLikes(data.data || {});
      }
    } catch (error) {
      console.error('Error fetching comment likes:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark articles');
      return;
    }

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
        showNotification('Article bookmarked successfully!', 'success');
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
      showNotification('Failed to bookmark article', 'error');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert('Please login to like articles');
      return;
    }

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
          setLikesCount(prev => Math.max(0, prev - 1));
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
          setLikesCount(prev => prev + 1);
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
          content: newComment,
          parentId: replyingTo
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (replyingTo) {
          // Add as reply
          setComments(comments.map(comment => 
            comment._id === replyingTo 
              ? { ...comment, replies: [...(comment.replies || []), data.data] }
              : comment
          ));
          setReplyingTo(null);
          setReplyText('');
        } else {
          // Add as new comment
          setComments([data.data, ...comments]);
        }
        
        setNewComment('');
        showNotification('Comment posted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      showNotification('Failed to post comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) return;
    
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`${apiURL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Remove comment or reply from state
        setComments(comments.map(comment => {
          if (comment._id === commentId) {
            return null; // Will be filtered out
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply._id !== commentId)
            };
          }
          return comment;
        }).filter(Boolean));
        
        showNotification('Comment deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      showNotification('Failed to delete comment', 'error');
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!isAuthenticated) {
      alert('Please login to like comments');
      return;
    }

    try {
      const isLiked = commentLikes[commentId]?.isLiked;
      const response = await fetch(`${apiURL}/comments/${commentId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: {
            count: data.data.count,
            isLiked: !isLiked
          }
        }));
      }
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleShare = async (platform) => {
    const shareData = {
      title: title,
      text: description,
      url: URL
    };

    try {
      switch (platform) {
        case 'copy':
          await navigator.clipboard.writeText(URL);
          showNotification('Link copied to clipboard!', 'success');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(URL)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(URL)}`, '_blank');
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + URL)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(URL)}`, '_blank');
          break;
        case 'reddit':
          window.open(`https://reddit.com/submit?url=${encodeURIComponent(URL)}&title=${encodeURIComponent(title)}`, '_blank');
          break;
        case 'native':
          if (navigator.share) {
            await navigator.share(shareData);
          } else {
            handleShare('copy');
          }
          break;
      }
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
      if (error.name !== 'AbortError') {
        showNotification('Failed to share', 'error');
      }
    }
  };

  const insertEmoji = (emoji) => {
    const isReply = replyingTo !== null;
    const textareaId = isReply ? `reply-textarea-${replyingTo}` : 'comment-textarea';
    const textarea = document.getElementById(textareaId);
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = isReply ? replyText : newComment;
      const newText = text.substring(0, start) + emoji + text.substring(end);
      
      if (isReply) {
        setReplyText(newText);
      } else {
        setNewComment(newText);
      }
      
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
    
    setActiveEmojiPicker(null);
  };

  const showNotification = (message, type = 'info') => {
    // Simple notification - you can replace with a proper toast library
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
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

    if (!aiContent && !loadingAI) {
    handleAIProcess();
  }
  };

  const closeSlider = () => {
    setShowSlider(false);
    setIsFullScreen(false);
    setShowComments(false);
    setActiveEmojiPicker(null);
    setShowShareModal(false);
    setReplyingTo(null);
    setReplyText('');
    document.body.style.overflow = 'unset';
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);

    // Auto-process when entering fullscreen if not already processed
  if (!isFullScreen && !aiContent && !loadingAI) {
    handleAIProcess();
  }
  };

  const renderEmojiPicker = (pickerId) => (
    <div className={`absolute z-50 p-4 rounded-lg shadow-xl border ${
      isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
    }`} style={{ bottom: '100%', right: '0' }}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-sm">Add Emoji</h4>
        <button
          onClick={() => setActiveEmojiPicker(null)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      {Object.entries(emojiCategories).map(([category, emojis]) => (
        <div key={category} className="mb-3">
          <h5 className="text-xs font-medium text-gray-500 mb-2 capitalize">{category}</h5>
          <div className="grid grid-cols-5 gap-1">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200 text-lg"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderShareModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Share Article</h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {navigator.share && (
            <button
              onClick={() => handleShare('native')}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <i className="fas fa-share text-blue-500"></i>
              <span>Share</span>
            </button>
          )}
          
          <button
            onClick={() => handleShare('copy')}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-copy text-gray-500"></i>
            <span>Copy Link</span>
          </button>
          
          <button
            onClick={() => handleShare('twitter')}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fab fa-twitter text-blue-400"></i>
            <span>Twitter</span>
          </button>
          
          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fab fa-facebook text-blue-600"></i>
            <span>Facebook</span>
          </button>
          
          <button
            onClick={() => handleShare('whatsapp')}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fab fa-whatsapp text-green-500"></i>
            <span>WhatsApp</span>
          </button>
          
          <button
            onClick={() => handleShare('linkedin')}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fab fa-linkedin text-blue-700"></i>
            <span>LinkedIn</span>
          </button>
          
          <button
            onClick={() => handleShare('reddit')}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fab fa-reddit text-orange-500"></i>
            <span>Reddit</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderComment = (comment, isReply = false) => (
    <div key={comment._id} className={`${isReply ? 'ml-8 mt-3' : ''} ${
      isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
    } p-4 rounded-lg transition-all duration-300 border ${
      isDarkMode ? 'border-gray-700' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
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
      
      <p className={`leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {comment.content}
      </p>
      
      {/* Comment Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleCommentLike(comment._id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-all duration-200 ${
              commentLikes[comment._id]?.isLiked
                ? 'text-red-500 bg-red-100 dark:bg-red-900/30'
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
            disabled={!isAuthenticated}
          >
            <i className="fas fa-heart"></i>
            <span>{commentLikes[comment._id]?.count || 0}</span>
          </button> 
          
{!isReply && isAuthenticated && (
  <button
    onClick={() => {
      setReplyingTo(comment._id);
      setReplyText(`@${comment.user?.name} `);
      // Scroll to reply form
      setTimeout(() => {
        const replyForm = document.getElementById(`reply-form-${comment._id}`);
        if (replyForm) {
          replyForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }}
    className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
  >
    <i className="fas fa-reply"></i>
    <span>Reply</span>
  </button>
)}

          
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
          >
            <i className="fas fa-share"></i>
            <span>Share</span>
          </button>
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <i className="fas fa-reply"></i>
            <span>{comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}</span>
          </div>
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
      
      {/* Reply Form */}
{replyingTo === comment._id && (
  <div id={`reply-form-${comment._id}`} className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
    <form onSubmit={handleCommentSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          id={`reply-textarea-${comment._id}`}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Write a thoughtful reply..."
          className={`w-full p-3 pr-12 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
          rows="3"
          maxLength={500}
        />
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          <span className="text-xs text-gray-400">{replyText.length}/500</span>
          <button
            type="button"
            onClick={() => setActiveEmojiPicker(activeEmojiPicker === `reply-${comment._id}` ? null : `reply-${comment._id}`)}
            className="p-1 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
          >
            <i className="fas fa-smile"></i>
          </button>
        </div>
        
        {/* Emoji Picker for Reply */}
        {activeEmojiPicker === `reply-${comment._id}` && (
          <div className="relative right-16 top-72">
            {renderEmojiPicker(`reply-${comment._id}`)}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setReplyingTo(null);
            setReplyText('');
            setActiveEmojiPicker(null);
          }}
          className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleCommentSubmit}
          disabled={!replyText.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
        >
          <i className="fas fa-reply mr-2"></i>
          Reply
        </button>
      </div>
    </form>
  </div>
)}

    </div>
  );

  const AISummaryCard = ({ aiContent, loadingAI }) => {
  if (loadingAI) {
    return (
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <div className="p-2 bg-purple-500 rounded-full animate-pulse">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          </div>
          <div>
            <h4 className="font-semibold text-purple-900 dark:text-purple-100">AI Processing...</h4>
            <p className="text-sm text-purple-600 dark:text-purple-300">Analyzing article content</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-sm text-purple-600 dark:text-purple-400 ml-2">Scraping content...</span>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded animate-pulse"></div>
            <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-purple-200 dark:bg-purple-700 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!aiContent) return null;

  return (
    <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <i className="fas fa-robot text-white"></i>
            </div>
            {aiContent.scraped && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <i className="fas fa-check text-white text-xs"></i>
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-purple-900 dark:text-purple-100 flex items-center space-x-2">
              <span>AI Summary</span>
              <i className="fas fa-sparkles text-yellow-500 text-sm"></i>
            </h4>
            <p className="text-xs text-purple-600 dark:text-purple-300 flex items-center space-x-1">
              {aiContent.scraped ? (
                <>
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span>Full article analyzed</span>
                </>
              ) : (
                <>
                  <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                  <span>Limited content analyzed</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            aiContent.scraped 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
          }`}>
            {aiContent.scraped ? 'Enhanced' : 'Basic'}
          </span>
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
        <MarkdownRenderer 
          content={aiContent.summary}
          className="text-gray-800 dark:text-gray-200"
        />
      </div>
      
      {/* TTS Controls for Summary */}
      <TTSControls 
        text={aiContent.summary} 
        label="🎧 Listen to Summary"
        className="mb-3"
      />
      
      <div className="flex items-center justify-between text-xs">
        {aiContent.originalLength && (
          <span className="text-purple-500 dark:text-purple-400 font-medium">
            {Math.round(aiContent.originalLength / 1000)}k chars analyzed
          </span>
        )}
      </div>
    </div>
  );
};



  return (
    <>
      {/* News Card */}
      <div className={`group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Source Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            {source}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex space-x-2">
          {isAuthenticated && !isBookmarkPage && (
            <button 
              onClick={handleBookmark}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-300 backdrop-blur-sm"
              title="Bookmark article"
            >
              <i className={`fas fa-bookmark text-white ${isBookmarked ? 'text-yellow-400' : ''}`}></i>
            </button>
          )}
          
          {isBookmarkPage && (
            <button 
              onClick={onDelete}
              className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 transition-all duration-300"
              title="Remove bookmark"
            >
              <i className="fas fa-trash text-white"></i>
                        </button>
          )}
          
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-300 backdrop-blur-sm"
            title="Share article"
          >
            <i className="fas fa-share text-white"></i>
          </button>
        </div>

        {/* Image Container */}
        <div className="relative h-48 overflow-hidden cursor-pointer" onClick={openSlider}>
          <img 
            src={imageURL || "https://demofree.sirv.com/nope-not-here.jpg"} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-white font-semibold flex items-center space-x-2">
              <i className="fas fa-eye"></i>
              <span>View Article</span>
            </span>
          </div>
          {/* Add this: Direct link to original article button */}
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
    <a 
      href={URL} 
      target="_blank" 
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()} // Prevent opening slider
      className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
    >
      <i className="fas fa-external-link-alt"></i>
      <span>Read Original</span>
    </a>
  </div>
        </div>

        {/* Content */}
        <div className="p-4">
           <div className="flex items-center justify-between mb-2">
    <h5 className={`font-bold text-lg line-clamp-2 cursor-pointer hover:text-blue-500 transition-colors ${
      isDarkMode ? 'text-white' : 'text-gray-900'
    }`} onClick={openSlider}>
      {title}
    </h5>
    
    {/* AI Processing Indicator */}
    {loadingAI && (
      <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
        <i className="fas fa-robot text-purple-500 text-xs animate-pulse"></i>
        <span className="text-xs text-purple-600 dark:text-purple-400">AI</span>
      </div>
    )}
    
    {/* AI Ready Indicator */}
    {aiContent && (
      <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
        <i className="fas fa-sparkles text-green-500 text-xs"></i>
        <span className="text-xs text-green-600 dark:text-green-400">Enhanced</span>
      </div>
    )}
  </div>

          
          
          <p className={`text-sm mb-4 line-clamp-3 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between mb-4">
            <span className={`text-xs flex items-center space-x-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <i className="fas fa-clock"></i>
              <span>
                {new Date(publishedAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </span>
            <button 
              onClick={openSlider}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm transition-colors flex items-center space-x-1"
            >
              <span>Read More</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {/* Social Interactions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button 
                className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
                  isLiked 
                    ? 'bg-red-100 text-red-500 dark:bg-red-900/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleLike}
                disabled={!isAuthenticated}
                title={isAuthenticated ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
              >
                <i className={`fas fa-heart ${isLiked ? 'text-red-500' : ''}`}></i>
                <span className="text-sm font-medium">{likesCount}</span>
              </button>
              
              <button 
                className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                onClick={openSlider}
                title="View comments"
              >
                <i className="fas fa-comment"></i>
                <span className="text-sm font-medium">{comments.length}</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              title="Share article"
            >
              <i className="fas fa-share text-gray-500"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && renderShareModal()}

      {/* Slider Overlay */}
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
                  title="Close"
                >
                  <i className="fas fa-times"></i>
                </button>
                <span className="font-semibold">Article Details</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Share"
                >
                  <i className="fas fa-share"></i>
                </button>
                <button 
                  onClick={toggleFullScreen}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Toggle Fullscreen"
                >
                  <i className={`fas ${isFullScreen ? 'fa-compress' : 'fa-expand'}`}></i>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="h-full overflow-y-auto pb-20">
              {isFullScreen ? (
  <div className="flex h-full">
    {/* Left: Article */}
<div className="w-1/2 p-6 overflow-y-auto">
  {/* Article Image - keep existing */}
  
  <h1 className="text-2xl font-bold mb-4">{title}</h1>
  
  {/* AI Content Display */}
  {loadingAI ? (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3 mb-3">
        <i className="fas fa-robot text-purple-500 animate-pulse"></i>
        <span className="text-sm font-medium">AI is analyzing the full article...</span>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/5"></div>
      </div>
    </div>
  ) : aiContent ? (
    <div className="mb-6">
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center space-x-2">
          <i className="fas fa-sparkles text-blue-500"></i>
          <span>AI Enhanced Content</span>
        </h3>
        <MarkdownRenderer 
    content={aiContent.fullContent}
    className="prose-headings:text-blue-900 dark:prose-headings:text-blue-100"
  />
      </div>
      
      {/* TTS for Full Content */}
      <TTSControls 
        text={aiContent.fullContent} 
        label="Listen to Full Analysis"
        className="mb-4"
      />
    </div>
  ) : (
    <div className="mb-6">
      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{description}</p>
      <button 
        onClick={handleAIProcess}
        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all duration-200"
      >
        <i className="fas fa-robot"></i>
        <span>Enhance with AI</span>
      </button>
    </div>
  )}
  
  {/* Source and date info */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-4">
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

    {/* Add this: Prominent read original button */}
  <a 
    href={URL} 
    target="_blank" 
    rel="noreferrer"
    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
  >
    <i className="fas fa-newspaper"></i>
    <span>Read Full Article</span>
    <i className="fas fa-external-link-alt text-sm"></i>
  </a>
  </div>
</div>

    
    {/* Right: Community */}
    <div className={`w-1/2 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
      <div className="h-full flex flex-col">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <i className="fas fa-users text-blue-500"></i>
          <span>Community Discussion</span>
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
          <div className="flex-1 overflow-y-auto mb-4">
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => renderComment(comment))}
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
              <div className="relative">
                <textarea
                  id="comment-textarea"
                  className={`w-full p-3 pr-12 rounded-lg border resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
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
                <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-400">{newComment.length}/500</span>
                  <button
                    type="button"
                    onClick={() => setActiveEmojiPicker(activeEmojiPicker === 'main' ? null : 'main')}
                    className="p-1 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                  >
                    <i className="fas fa-smile"></i>
                  </button>
                </div>
                
                {/* Emoji Picker */}
                {activeEmojiPicker === 'main' && (
                  <div className="relative bottom-full right-28 mb-2">
                    {renderEmojiPicker('main')}
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 flex items-center space-x-1">
                  <i className="fas fa-lightbulb"></i>
                  <span>Be respectful and constructive</span>
                </span>
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  disabled={!newComment.trim()}
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>Post</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <a href="/login" className="text-blue-500 hover:text-blue-600 font-semibold flex items-center justify-center space-x-2">
                <i className="fas fa-sign-in-alt"></i>
                <span>Login to join the discussion</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
) : (
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
                        className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                      >
                        <i className="fas fa-external-link-alt"></i>
                        <span>View Original Article</span>
                      </a>
                    </div>
                  </div>

                  {/* AI Summary Card */}
  <AISummaryCard aiContent={aiContent} loadingAI={loadingAI} />
                  
                  {/* Article Content */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                        {source}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center space-x-1">
                        <i className="fas fa-clock"></i>
                        <span>
                          {new Date(publishedAt).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
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
                    <div className="flex items-center space-x-4">
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
                    
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                    >
                      <i className="fas fa-share"></i>
                      <span>Share</span>
                    </button>
                  </div>
                  
                  {/* Comments Section */}
                  <div className="mt-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                      <i className="fas fa-comments text-blue-500"></i>
                      <span>Comments</span>
                    </h3>
                    
                    {/* Comments List */}
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {comments.length > 0 ? (
                        comments.map((comment) => renderComment(comment))
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
                            id="comment-textarea"
                            className={`w-full p-4 pr-16 rounded-lg border-2 resize-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                            <span className="text-xs text-gray-400">{newComment.length}/500</span>
                            <button
                              type="button"
                              onClick={() => setActiveEmojiPicker(activeEmojiPicker === 'main' ? null : 'main')}
                              className="p-2 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
                              title="Add emoji"
                            >
                              <i className="fas fa-smile text-lg"></i>
                            </button>
                          </div>
                          
                          {/* Emoji Picker */}
                          {activeEmojiPicker === 'main' && (
                            <div className="absolute bottom-full right-0 mb-2">
                              {renderEmojiPicker('main')}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <i className="fas fa-lightbulb"></i>
                              <span>Be respectful and constructive</span>
                            </span>
                          </div>
                          <button 
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                            disabled={!newComment.trim()}
                          >
                            <i className="fas fa-paper-plane"></i>
                            <span>Post Comment</span>
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
                          className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 space-x-2"
                        >
                          <i className="fas fa-sign-in-alt"></i>
                          <span>Login to Comment</span>
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
