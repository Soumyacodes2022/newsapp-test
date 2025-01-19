import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = ({apiURL}) => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${apiURL}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      navigate('/');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              value={userData.firstName}
              onChange={(e) => setUserData({...userData, firstName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Last Name"
              value={userData.lastName}
              onChange={(e) => setUserData({...userData, lastName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={userData.password}
              onChange={(e) => setUserData({...userData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="auth-button">Sign Up</button>
          <div className="auth-redirect">
  <p>Already have an account? <Link to="/login" className="auth-link">Login</Link></p>
</div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
