import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const Signup = ({ apiURL }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Please choose a stronger password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${apiURL}/auth/google`;
  };

  const handleFacebookSignup = () => {
    window.location.href = `${apiURL}/auth/facebook`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    if (error) setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-purple-500' : 'bg-purple-200'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-blue-500' : 'bg-blue-200'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 ${
          isDarkMode ? 'bg-green-500' : 'bg-green-200'
        }`}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-user-plus text-white text-2xl"></i>
            </div>
          </div>
          <h2 className={`mt-6 text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Join TaazaNEWS
          </h2>
          <p className={`mt-2 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Create your account and stay informed
          </p>
        </div>

        {/* Main Form Card */}
        <div className={`rounded-2xl shadow-2xl p-8 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' 
            : 'bg-white/80 backdrop-blur-xl border border-white/20'
        }`}>
          
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleSignup}
              className={`w-full flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } shadow-lg hover:shadow-xl`}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            <button
              onClick={handleFacebookSignup}
              className={`w-full flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } shadow-lg hover:shadow-xl`}
            >
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Sign up with Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className={`absolute inset-0 flex items-center ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`}>
              <div className={`w-full border-t ${
                isDarkMode ? 'border-gray-600' : 'border-gray-300'
              }`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${
                isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
              }`}>
                Or create account with email
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={userData.name}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-3 pl-12 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } shadow-lg focus:shadow-xl`}
                  placeholder="Enter your full name"
                />
                <i className={`fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}></i>
              </div>
            </div>

            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={userData.email}
                  onChange={handleInputChange}
                                    className={`w-full px-6 py-3 pl-12 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } shadow-lg focus:shadow-xl`}
                  placeholder="Enter your email address"
                />
                <i className={`fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}></i>
              </div>
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={userData.password}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-3 pl-12 pr-12 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } shadow-lg focus:shadow-xl`}
                  placeholder="Create a strong password"
                />
                <i className={`fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}></i>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  } transition-colors`}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {userData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Password strength
                    </span>
                    <span className={`text-xs font-medium ${
                      passwordStrength >= 4 ? 'text-green-600' : 
                      passwordStrength >= 3 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${
                    isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className={`mt-1 text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Use 8+ characters with uppercase, lowercase, numbers & symbols
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-6 py-3 pl-12 pr-12 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } shadow-lg focus:shadow-xl ${
                    userData.confirmPassword && userData.password !== userData.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : userData.confirmPassword && userData.password === userData.confirmPassword
                      ? 'border-green-500 focus:ring-green-500'
                      : ''
                  }`}
                  placeholder="Confirm your password"
                />
                <i className={`fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}></i>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  } transition-colors`}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {userData.confirmPassword && (
                <div className="mt-2 flex items-center">
                  {userData.password === userData.confirmPassword ? (
                    <>
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                      <span className="text-green-600 text-xs">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-times-circle text-red-500 mr-2"></i>
                      <span className="text-red-600 text-xs">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className={`ml-3 text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                I agree to the{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || userData.password !== userData.confirmPassword || passwordStrength < 3}
              className={`w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                loading || userData.password !== userData.confirmPassword || passwordStrength < 3
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus mr-2"></i>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div className={`rounded-2xl p-6 transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/30 backdrop-blur-xl border border-gray-700' 
            : 'bg-white/60 backdrop-blur-xl border border-white/20'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            What you'll get
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <i className="fas fa-newspaper text-blue-600 text-sm"></i>
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Latest News
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <i className="fas fa-bookmark text-purple-600 text-sm"></i>
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Save Articles
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <i className="fas fa-comments text-green-600 text-sm"></i>
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Join Discussions
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <i className="fas fa-heart text-red-600 text-sm"></i>
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Like & Share
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
