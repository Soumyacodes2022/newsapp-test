// import logo from './logo.svg';
// import './App.css';
import React, { useState } from "react";
import News from "./Components/News";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import AboutUs from "./Components/AboutUs";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./Components/auth/Login";
// import PropTypes from 'prop-types'

const App = () => {
  // const apiKey = 'pub_3188391b3fa0ba9978a80ebacdd56390f5a98';
  const apiKey = process.env.REACT_APP_NEWS_API;
  console.log(apiKey);
  const apiURL = process.env.REACT_APP_BASE_URL_API;
  console.log(apiURL);

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
          <Route
            exact
            path="/"
            index
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                key="general"
                country="in"
                category="top"
              />
            }
          />
          <Route
            exact
            path="/business"
            index
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                key="business"
                country="in"
                category="business"
              />
            }
          />
          <Route
            exact
            path="/entertainment"
            index
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                key="entertainment"
                country="in"
                category="entertainment"
              />
            }
          />
          <Route
            exact
            path="/science"
            index
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                key="science"
                country="in"
                category="science"
              />
            }
          />
          <Route
            exact
            path="/health"
            index
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                key="health"
                country="in"
                category="health"
              />
            }
          />
          <Route
            exact
            path="/sports"
            index
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                key="sports"
                country="in"
                category="sports"
              />
            }
          />
          <Route
            exact
            path="/technology"
            index
            element={
              <News
                setProgress={setProgress}
                apiKey={apiKey}
                key="technology"
                country="in"
                category="technology"
              />
            }

          />
            <Route path="/about" element={<AboutUs />} />
        </Routes>
        <Routes>
        {/* Your existing routes */}
        <Route path="/login" element={<Login apiURL={apiURL} />} /> 
      </Routes>
      </div>
    </Router>
    </ThemeProvider>

  );
};
export default App;
