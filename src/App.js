// import logo from './logo.svg';
// import './App.css';
import React, { Component } from 'react'
import News from './Components/News';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoadingBar from 'react-top-loading-bar';
// import PropTypes from 'prop-types'


export default class App extends Component {
  state={
    progress:0
  }
  setProgress=(progress)=>{
    this.setState({progress:progress})
  }

  render() {
    return (
      <Router>
        <LoadingBar
        color='#f11946'
        progress={this.state.progress}
        // onLoaderFinished={() => setProgress(0)}
      />
          
          <div>
          <Routes>
            <Route exact path="/"  index element={<News setProgress={this.setProgress} key="general" country="in" category="general" />} />
            <Route exact path="/business"  index element={<News setProgress={this.setProgress} key="business" country="in" category="business" />} />
            <Route exact path="/entertainment"  index element={<News setProgress={this.setProgress} key="entertainment" country="in" category="entertainment" />} />
            <Route exact path="/science"  index element={<News setProgress={this.setProgress} key="science" country="in" category="science" />} />
            <Route exact path="/health"  index element={<News setProgress={this.setProgress} key="health" country="in" category="health" />} />
            <Route exact path="/sports"  index element={<News setProgress={this.setProgress} key="sports" country="in" category="sports" />} />
            <Route exact path="/technology" index element={<News setProgress={this.setProgress} key="technology" country="in" category="technology" />} />





          </Routes>
          </div>  
        </Router>
    )
  }
}
