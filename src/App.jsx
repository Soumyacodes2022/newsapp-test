// import logo from './logo.svg';
// import './App.css';
import React, { useState } from "react";
import News from "./Components/News";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import AboutUs from "./Components/AboutUs";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";
import Bookmark from "./Components/Bookmark";
// import PropTypes from 'prop-types'

const App = () => {
  // const apiKey = 'pub_3188391b3fa0ba9978a80ebacdd56390f5a98';
  const apiKey = process.env.REACT_APP_NEWS_API;
  console.log(apiKey);
  const apiURL = process.env.REACT_APP_BASE_URL_API;
  console.log(apiURL);
  const isAuthenticated = localStorage.getItem('token');
  const [progress, setProgress] = useState(0);

  return (
    <ThemeProvider>
    <Router>
      <LoadingBar
        color="#f11946"
        progress={progress}
        // onLoaderFinished={() => setProgress(0)}
      />

      <div>
      <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <News setProgress={setProgress} apiKey={apiKey} key="general" country="in" category="top" />
          } />

          {/* Protected routes */}
          {isAuthenticated && (
            <>
              <Route path="/business" element={
                <News setProgress={setProgress} apiKey={apiKey} key="business" country="in" category="business" />
              } />
              <Route path="/entertainment" element={
                <News setProgress={setProgress} apiKey={apiKey} key="entertainment" country="in" category="entertainment" />
              } />
              <Route path="/science" element={
                <News setProgress={setProgress} apiKey={apiKey} key="science" country="in" category="science" />
              } />
              <Route path="/health" element={
                <News setProgress={setProgress} apiKey={apiKey} key="health" country="in" category="health" />
              } />
              <Route path="/sports" element={
                <News setProgress={setProgress} apiKey={apiKey} key="sports" country="in" category="sports" />
              } />
              <Route path="/technology" element={
                <News setProgress={setProgress} apiKey={apiKey} key="technology" country="in" category="technology" />
              } />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/bookmarks" element={<Bookmark setProgress={setProgress} apiURL={apiURL} />} />
            </>
          )}
        </Routes>
        {/* Your existing routes */}
        {
          !isAuthenticated && (
            <Routes>
            <Route path="/login" element={<Login apiURL={apiURL} />} />
            <Route path="/signup" element={<Signup apiURL={apiURL} />} />
      </Routes>
          )
        }
        {/* <Route path="/login" element={<Login apiURL={apiURL} />} />  */}
      </div>
    </Router>
    </ThemeProvider>

  );
};
export default App;
