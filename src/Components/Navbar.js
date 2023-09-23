import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {Link}from 'react-router-dom'



export class Navbar extends Component {
  constructor(){
    super()
    this.state={
      
      input:""
    }
  }
  handleChange=(event)=>{
    this.setState({input: event.target.value})
    
}
handleSearch=(e)=>{
  e.preventDefault()
  this.props.updateNews(this.state.input)
}

  render() {
    

    
    return (
        
        <nav className="navbar navbar-expand-lg  navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">TaazaNEWS</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item"><Link className="nav-link" to="/business">Business </Link></li>
              <li className="nav-item"><Link className="nav-link" to="/entertainment">Entertainment</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/health">Health</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/science">Science</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/sports">Sports</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/technology">Technology </Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>
                
              
                 
              
            </ul>
            <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" value={this.state.input} onChange={this.handleChange} placeholder="Search" aria-label="Search"/>
              <button className="btn btn-outline-light" onClick={this.handleSearch} type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
      
    )
  }
}

export default Navbar
