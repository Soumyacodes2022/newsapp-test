// import logo from './logo.svg';
// import './App.css';
import React, { useState } from "react";
import News from "./Components/News";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

// import PropTypes from 'prop-types'

const App = () => {
  const apiKey = process.env.API_KEY;

  const [progress, setProgress] = useState(0);

  return (
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
        </Routes>
      </div>
    </Router>
  );
};
export default App;
