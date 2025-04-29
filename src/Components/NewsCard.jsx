import React, { useState } from 'react';

const NewsItem = (props) => {
  const { title, description, imageURL, URL, publishedAt, source, sourceUrl, isBookmarkPage, onDelete } = props;
  // console.log(sourceUrl)

  const [isBookmarked, setIsBookmarked] = useState(false);
  const isAuthenticated = localStorage.getItem('token');

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
          source:{
            name: source,
            url: sourceUrl
          }
        })
      }
      // console.log(bookMarkPayload.body)
      const response = await fetch(`${process.env.REACT_APP_BASE_URL_API}/bookmarks`, bookMarkPayload);
      console.log(response)

      if (response.ok) {
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
    }
  };

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
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
