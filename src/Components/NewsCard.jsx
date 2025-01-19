import React from 'react';

const NewsItem = (props) => {
  const { title, description, imageURL, URL, publishedAt, source } = props;

  return (
    <div className="news-card-container">
      <div className="news-card">
        <div className="source-badge">
          <span className="badge-text">{source}</span>
        </div>
        
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
