import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NewsItem from './NewsItem'
import Spinner from './spinner'


export class News extends Component {
  static defaultProps={
    country:'in',
    category:'general'
  }
  static propTypes={
    country: PropTypes.string,
    category: PropTypes.string
  }
  constructor(){
    super()
    this.state={
      articles: [],
      loading:false,
      page:1,
      pageSize:12,
    }
  }
  async componentDidMount(){
    let url= `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=30902fd75edf4c87884bfde019a7c36e&page=1&pageSize=${this.state.pageSize}`;
    this.setState({loading:true})

    let data= await fetch(url)
    let parsedData= await data.json()
    this.setState({articles: parsedData.articles,
                   pageSize: this.state.pageSize,
                   totalResults: parsedData.totalResults,
      loading:false

                  })
  }
  handlePrevClick= async()=>{
    console.log("previous")
    let url= `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=30902fd75edf4c87884bfde019a7c36e&page=${this.state.page-1}&pageSize=${this.state.pageSize}`;
    this.setState({loading:true})

    let data= await fetch(url)
    let parsedData= await data.json()

    this.setState({
      page:this.state.page-1,
      articles: parsedData.articles,
      pageSize: this.state.pageSize,
      loading:false

    })
  }
  handleNextClick= async() =>{
    
    let url= `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=30902fd75edf4c87884bfde019a7c36e&page=${this.state.page+1}&pageSize=${this.state.pageSize}`;
    this.setState({loading:true})
    let data= await fetch(url)
    let parsedData= await data.json()

    this.setState({
      page:this.state.page+1,
      articles: parsedData.articles,
      pageSize: this.state.pageSize,
      loading:false
    })
  }

  render() {
    return (
      <div className="container my-3">
        <h1 className="mb-4 text-center">TaazaNEWS - Top Headlines</h1>
        {this.state.loading && <Spinner/>}
          <div className="row">
            {!this.state.loading && this.state.articles.map((elem)=>{
              return <div className='col-md-4' key={elem.url}>
                      <NewsItem title={elem.title ? elem.title.slice(0,67) : ""} description={elem.description ? elem.description.slice(0,103) : ""} imageURL={elem.urlToImage} URL={elem.url} author={elem.author} publishedAt={elem.publishedAt} source={elem.source.name}/>
                      </div>
                      })}
          <div className="container d-flex justify-content-between">
          <div className="container d-flex justify-content-between">
          <button  style={{display: this.state.page<=1 ? 'none':'flex'}} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
          </div>
          <div className="container d-flex justify-content-end">
          <button  style={{display: this.state.page+1 > Math.ceil(this.state.totalResults/this.state.pageSize) ? 'none':'flex'}} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
          </div>
          </div>
          
          </div>
      </div>
    )
  }
}

export default News
