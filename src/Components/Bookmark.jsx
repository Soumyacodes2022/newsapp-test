import React, { useState, useEffect } from 'react';
import NewsCard from './NewsCard';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Bookmark = ({apiURL, setProgress}) => {
  const [bookmarks, setBookmarks] = useState([]);
  console.log(apiURL)
  console.log(bookmarks);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchHeaders={
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
    const fetchbookmarks = async () => {
      setProgress(15);
      const response = await fetch(`${apiURL}/api/bookmark`, fetchHeaders);
      setProgress(50);
      const data = await response.json();
      setProgress(100);
      console.log(data)
      setBookmarks(data.bookmarks);
    };

    fetchbookmarks();
  }, []);

  const handleDelete = async (bookmarkId) => {
    const response = await fetch(`http://localhost:3000/api/bookmark?id=${bookmarkId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (response.ok) {
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
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
                source={item.sourceName}
                isBookmarkPage={true}
  onDelete={() => handleDelete(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
        ): (
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
