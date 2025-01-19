import React, {useEffect, useState, useContext, useRef} from "react";
// import PropTypes from 'prop-types'
import { Link , useLocation } from "react-router-dom";
// import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';


const Navbar = ({updateNews}) => {
  let location = useLocation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isAuthenticated = localStorage.getItem('token');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

   // Add this to check authentication status
   console.log("Auth status:", isAuthenticated);
  
   // Add this inside click handler
   const handleProfileClick = () => {
     console.log("Profile clicked, current state:", showDropdown);
     setShowDropdown(!showDropdown);
   };

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
        {isAuthenticated ? (
          <>
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
        
            <form className="d-flex search-container" role="search" onSubmit={handleSearch}>
        <div className={`search-wrapper ${searchFocused ? 'focused' : ''}`}>
          <input
            className="search-input"
            type="search"
            placeholder="Search news..."
            aria-label="Search"
            value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
            <button className="search-button" type="submit" disabled={!searchTerm} >
            <i className="fas fa-search"></i>
          </button>
        </div>
      </form>
      <div className="profile-dropdown" ref={dropdownRef}>
            <div className="profile-icon ms-3" onClick={handleProfileClick}>
              <i className="fas fa-user-circle fa-lg"></i>
            </div>
            {showDropdown && (
              <div className="dropdown-menu show">
                  <Link to="/profile" className="dropdown-item">
                    <i className="fas fa-user"></i> Profile
                  </Link>
                  <Link to="/bookmarks" className="dropdown-item">
                    <i className="fas fa-bookmark"></i> Bookmarks
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <i className="fas fa-cog"></i> Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item text-danger"
                    onClick={() => {
                      localStorage.removeItem('token');
                      window.location.reload();
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
              </div>
              </div>
          </>
        ) : (
          <div className="ms-auto">
            <Link to="/login" className="login-btn">
              <i className="fas fa-sign-in-alt"></i> Login
            </Link>
          </div>
        )}
      </div>
        </div>
      {/* </div> */}
    </nav>
  );
};

export default Navbar;
