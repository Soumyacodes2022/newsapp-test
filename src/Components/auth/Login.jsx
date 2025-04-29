import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({apiURL}) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();

//   const API_URL = process.env.REACT_APP_BASE_URL_API;
//   console.log(API_URL);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${apiURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
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
        <h2>Login to TaazaNews</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
          </div>
          <button type="submit" className="auth-button">Login</button>
          <div className="auth-redirect">
  <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
</div>
        </form>
      </div>
    </div>
  );
};

export default Login;
