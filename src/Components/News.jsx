import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NewsItem from "./NewsItem";
import InfiniteScroll from "react-infinite-scroll-component";
import Navbar from './Navbar';


const News = (props) => {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  // document.title = `TaazaNews-${capitalizeFirstLetter(props.category)}`

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(15);
    // let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    let url = `https://newsdata.io/api/1/latest?apiKey=${props.apiKey}&country=${props.country}&category=${props.category}`;
    // if (value) {
    //   url += `&q=${value}`
    // }

    let data = await fetch(url);
    props.setProgress(30);

    let parsedData = await data.json();
    console.log(parsedData)

    props.setProgress(50);
    setResults(parsedData.results);
    props.setProgress(100);
  };
  useEffect(() => {
    updateNews();
  }, []);

  const fetchMoreData = async () => {
    setPage(page + 1);

    // const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    const url = `https://newsdata.io/api/1/latest?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&nextPage=nextPage`;

    const data = await fetch(url);
    const parsedData = await data.json();
    console.log(parsedData)
    setResults(results.concat(parsedData.results));
  };

  return (
    <>
            <Navbar updateNews={updateNews} />

      <h1 className="mb-4 text-center"style={{marginTop:'102px'}}>
        TaazaNEWS - Top Headlines on {capitalizeFirstLetter(props.category)}
      </h1>

      
        <div className="container my-3">
          <div className="row">
            {results && results.map((item, index) => {
              return (
                <div className="col-md-4" key={index}>
                  <NewsItem
                    title={item.title ? item.title.slice(0, 67) : ""}
                    description={
                      item.description ? item.description.slice(0, 103) : ""
                    }
                    imageURL={item.image_url}
                    URL={item.url}
                    author={item.creator}
                    publishedAt={item.pubDate}
                    source={item.source_name}
                  />
                </div>
              );
            })}
          </div>
        </div>
    </>
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
