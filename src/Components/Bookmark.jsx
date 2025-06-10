import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Bookmark = ({apiURL, setProgress}) => {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const fetchHeaders = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    try {
      setProgress(15);
      const response = await fetch(`${apiURL}/bookmarks`, fetchHeaders);
      setProgress(50);
      const data = await response.json();
      setProgress(100);
      setBookmarks(data.bookmarks || data.data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setProgress(100);
    }
  };

  const handleDelete = async (bookmarkId) => {
    try {
      const response = await fetch(`${apiURL}/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    
      if (response.ok) {
        setBookmarks(bookmarks.filter(bookmark => bookmark._id !== bookmarkId));
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="bookmarks-container">
        <div className="header-section">
          <h1 className="main-title">Your bookmarks</h1>
        </div>
        {
          bookmarks.length > 0 ? (
            <div className="news-grid-container">
              <div className="news-grid">
                {bookmarks.map((item, index) => (
                  <div className="grid-item" key={index}>
                    <NewsCard
                      title={item.title}
                      description={item.description}
                      imageURL={item.image}
                      URL={item.url}
                      publishedAt={item.publishedAt}
                      source={item.source.name}
                      sourceUrl={item.source.url}
                      isBookmarkPage={true}
                      onDelete={() => handleDelete(item._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-bookmarks">
              <i className="fas fa-bookmark empty-icon"></i>
              <h2>No Bookmarks Yet</h2>
              <p>Start saving your favorite news articles by clicking the bookmark icon!</p>
              <Link to="/" className="browse-news-btn">
                Browse News <i className="fas fa-arrow-right"></i>
              </Link>
            </div> 
          )
        }
      </div>
    </>
  );
};

export default Bookmark;
