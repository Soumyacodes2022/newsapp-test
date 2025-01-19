import React, {useEffect, useState, useContext} from "react";
// import PropTypes from 'prop-types'
import { Link , useLocation } from "react-router-dom";
// import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';


const Navbar = ({updateNews}) => {
  let location = useLocation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isAuthenticated = localStorage.getItem('token');

  const handleSearch = (e) => {
    e.preventDefault();
    updateNews(searchTerm);
  };
  return (
<nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          TaazaNEWS
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* <button onClick={toggleTheme} className="theme-toggle">
  {isDarkMode ? <i className="fas fa-sun"/> : <i className="fas fa-moon"/>}
</button> */}


        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : "" }`} aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/business" ? "active" : "" }`} to="/business">
                Business{" "}
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/entertainment" ? "active" : "" }`} to="/entertainment">
                Entertainment
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/health" ? "active" : "" }`} to="/health">
                Health
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/science" ? "active" : "" }`} to="/science">
                Science
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/sports" ? "active" : "" }`} to="/sports">
                Sports
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/technology" ? "active" : "" }`} to="/technology">
                Technology{" "}
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/about" ? "active" : "" }`} to="/about">
                About Us
              </Link>
            </li>
          </ul>
          <div className="ms-auto d-flex align-items-center">
        {isAuthenticated ? (
          <>
            <form className="d-flex search-container" role="search">
              {/* Existing search form */}
            </form>
            <div className="profile-icon ms-3">
              <i className="fas fa-user-circle fa-lg"></i>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-outline-light">
            Login
          </Link>
        )}
      </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
