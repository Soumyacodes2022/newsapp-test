import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import NewsItem from "./NewsCard";
import Navbar from "./Navbar";
import NewsSlider from "./NewsSlider";
import { ThemeContext } from "../context/ThemeContext";

const News = (props) => {
  const [results, setResults] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [page, setPage] = useState(1);
  const carouselRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async (searchTerm='') => {
    props.setProgress(15);
    let url = `https://gnews.io/api/v4/top-headlines?${searchTerm ? `q=${searchTerm}&` : ``}category=${props.category}&lang=en&country=${props.country}&apikey=${props.apiKey}&max=100`;
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(50);
    setResults(parsedData.articles);
    props.setProgress(100);
  };

  useEffect(() => {
    updateNews();
  }, []);

  // Auto-slide for header carousel
  useEffect(() => {
    if (results.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.min(4, results.length));
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [results]);

  const topNews = results.slice(0, 4);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navbar updateNews={updateNews} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Top News Slider - Only show if we have news */}
        {topNews.length > 0 && (
          <div className="mb-8">
            <NewsSlider news={topNews} />
          </div>
        )}

        {/* Category Title */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Latest in {props.category === "top" ? "General" : capitalizeFirstLetter(props.category)}
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* News Grid */}
        {results && results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item, index) => (
              <NewsItem
                key={index}
                title={item.title ? item.title.slice(0, 67) : ""}
                description={item.description ? item.description.slice(0, 103) : ""}
                imageURL={item.image}
                URL={item.url}
                publishedAt={item.publishedAt}
                source={item.source.name}
                sourceUrl={item.source.url}
                fullArticle={item}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-16 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <i className="fas fa-newspaper text-6xl mb-4 opacity-50"></i>
            <h2 className="text-2xl font-bold mb-2">No News Found</h2>
            <p className="mb-6">Try adjusting your search or check back later for fresh updates!</p>
            <button 
              onClick={() => updateNews()} 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <i className="fas fa-sync-alt mr-2"></i> Refresh News
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

News.defaultProps = {
  country: "in",
  category: "general",
  pageSize: 12,
};

News.propTypes = {
  country: PropTypes.string,
  category: PropTypes.string,
  pageSize: PropTypes.number,
};

export default News;
