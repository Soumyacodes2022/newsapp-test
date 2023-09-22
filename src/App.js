// import logo from './logo.svg';
// import './App.css';
import React, { Component } from 'react'
import Navbar from './Components/Navbar';
import News from './Components/News';
import { HashRouter as Router, Route, Routes } from "react-router-dom";

export default class App extends Component {

  render() {
    return (
      <Router>
          <Navbar />
          <div>
          <Routes>
            <Route exact path="/"  index element={<News key="general" country="in" category="general" />} />
            <Route exact path="/business"  index element={<News key="business" country="in" category="business" />} />
            <Route exact path="/entertainment"  index element={<News key="entertainment" country="in" category="entertainment" />} />
            <Route exact path="/science"  index element={<News key="science" country="in" category="science" />} />
            <Route exact path="/health"  index element={<News key="health" country="in" category="health" />} />
            <Route exact path="/sports"  index element={<News key="sports" country="in" category="sports" />} />
            <Route exact path="/technology" index element={<News key="technology" country="in" category="technology" />} />





          </Routes>
          </div>  
        </Router>
    )
  }
}
