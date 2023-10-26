import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NewsItem from './NewsItem';
import Spinner from './spinner';
import Navbar from './Navbar';
import InfiniteScroll from 'react-infinite-scroll-component';




export class News extends Component {

  static defaultProps = {
    country: 'in',
    category: 'general',
    pageSize: 12,
  }
  static propTypes = {
    country: PropTypes.string,
    category: PropTypes.string,
    pageSize: PropTypes.number
  }
  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      
     
      totalResults: 0

    }
    this.fetchMoreData=this.fetchMoreData.bind(this)
    document.title = `TaazaNews-${this.capitalizeFirstLetter(this.props.category)}`
  }
 

  async updateNews() {
    this.props.setProgress(15)
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=34c3f198d5164069a8063ebb5543093e&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    // if (value) {
    //   url += `&q=${value}`
    // }

    this.setState({ loading: true })
    
      let data = await fetch(url)
      this.props.setProgress(30)

      let parsedData = await data.json()
      this.props.setProgress(50)

      this.setState({

        articles: parsedData.articles,
        loading: false,
        
        totalResults: parsedData.totalResults

      })
      this.props.setProgress(100)
  }
  async componentDidMount() {
    this.updateNews()
  }
  // async handlePrevClick() {
  //   this.setState({
  //     page: this.state.page - 1,
  //   })
  //   this.updateNews("")
  // }



  // async handleNextClick() {

  //   this.setState({
  //     page: this.state.page + 1,
  //   })
  //   this.updateNews("")

  // }
  // async fetchMoreData () {

  //   this.setState({
  //     page: this.state.page + 1,
  //   })
    
  //   const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=34c3f198d5164069a8063ebb5543093e&page=${this.state.page}&pageSize=${this.props.pageSize}`;


  //   this.setState({ loading: true })

  //   const data = await fetch(url)
  //   const parsedData = await data.json()

  //   this.setState({
  //     articles: this.state.articles.concat(parsedData.articles),
  //     totalResults: parsedData.totalResults,
  //     loading: false,
  //   })
  
  // }
  async fetchMoreData() {
    this.setState({
      page: this.state.page + 1,
    });
  
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=34c3f198d5164069a8063ebb5543093e&page=${this.state.page}&pageSize=${this.props.pageSize}`;
  
    this.setState({ loading: true });
  
    try {
      const data = await fetch(url);
      const parsedData = await data.json();
  
      this.setState({
        articles: this.state.articles.concat(parsedData.articles),
        totalResults: parsedData.totalResults,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching more data:", error);
      this.setState({ loading: false });
    }
  }





  render() {

    return (
      <>
        <Navbar updateNews={this.updateNews} />
        
        
          <h1 className="mb-4 text-center">TaazaNEWS - Top Headlines on {this.capitalizeFirstLetter(this.props.category)}</h1>
          

          <InfiniteScroll
            dataLength={this.state.articles.length}
            next={this.fetchMoreData}
            hasMore={this.state.articles.length < this.state.totalResults}
            loader={<Spinner />}
          >
            <div className="container my-3">
              <div className="row">

                {this.state.articles.map((item,index) => {

                  return <div className='col-md-4' key={index}>
                    <NewsItem title={item.title ? item.title.slice(0, 67) : ""} description={item.description ? item.description.slice(0, 103) : ""} imageURL={item.urlToImage} URL={item.url} author={item.author} publishedAt={item.publishedAt} source={item.source.name} />
                  </div>

                })}
              </div>
            </div>
          </InfiniteScroll>


        
      </>
    )
  }
}

export default News
