import React, { Component } from 'react'
// import PropTypes from 'prop-types'

export class NewsItem extends Component {
  

  render() {
    let { title, description,imageURL,author,URL,publishedAt,source} = this.props
    return (
      <div>

        <div className="card mb-5" >
        <span className="position-absolute top-0  translate-middle badge rounded-pill bg-danger" style={{left:"90%", zIndex:"1"}}>
    {source}
    
  </span>
          <img src={!imageURL?"https://demofree.sirv.com/nope-not-here.jpg": imageURL} className="card-img-top" style={{height:"200px"}}  alt="..." />
          <div className="card-body " style={{height:'300px'}}>
            <h5 className="card-title">{title}...</h5>
            <p className="card-text">{description}...</p>
            <p className="card-text "><small className="text-body-danger text-danger">By {!author? "Unknown": author},published at {new Date(publishedAt).toGMTString()}</small></p>
            <a href= {URL} rel="noreferrer" target="_blank" className="btn btn-sm btn-dark">Read More</a>
          </div>
        </div>
      </div>
    )
  }
}

export default NewsItem
