// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { ThemeContext } from '../../context/ThemeContext';

// const Login = ({ apiURL }) => {
//   const [credentials, setCredentials] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const { isDarkMode } = useContext(ThemeContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch(`${apiURL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(credentials)
//       });

//       const data = await response.json();

//       if (response.ok && data.token) {
//         localStorage.setItem('token', data.token);
//         navigate('/');
//       } else {
//         setError(data.message || 'Login failed. Please try again.');
//       }
//     } catch (error) {
//       setError('Network error. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     // Redirect to Google OAuth
//     window.location.href = `${apiURL}/auth/google`;
//   };

//   const handleFacebookLogin = () => {
//     // Redirect to Facebook OAuth
//     window.location.href = `${apiURL}/auth/facebook`;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({ ...prev, [name]: value }));
//     if (error) setError(''); // Clear error when user starts typing
//   };

//   return (
//     <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
//       isDarkMode 
//         ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
//         : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
//     }`}>
//       {/* Background Pattern */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
//           isDarkMode ? 'bg-blue-500' : 'bg-blue-200'
//         }`}></div>
//         <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
//           isDarkMode ? 'bg-purple-500' : 'bg-purple-200'
//         }`}></div>
//       </div>

//       <div className="max-w-md w-full space-y-8 relative z-10">
//         {/* Header */}
//         <div className="text-center">
//           <div className="flex justify-center">
//             <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//               <i className="fas fa-newspaper text-white text-2xl"></i>
//             </div>
//           </div>
//           <h2 className={`mt-6 text-3xl font-bold ${
//             isDarkMode ? 'text-white' : 'text-gray-900'
//           }`}>
//             Welcome back
//           </h2>
//           <p className={`mt-2 text-sm ${
//             isDarkMode ? 'text-gray-400' : 'text-gray-600'
//           }`}>
//             Sign in to your TaazaNEWS account
//           </p>
//         </div>

//         {/* Main Form Card */}
//         <div className={`rounded-2xl shadow-2xl p-8 transition-all duration-300 ${
//           isDarkMode 
//             ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' 
//             : 'bg-white/80 backdrop-blur-xl border border-white/20'
//         }`}>
          
//           {/* OAuth Buttons */}
//           <div className="space-y-3 mb-6">
//             <button
//               onClick={handleGoogleLogin}
//               className={`w-full flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
//                 isDarkMode
//                   ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
//                   : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//               } shadow-lg hover:shadow-xl`}
//             >
//               <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
//                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Continue with Google
//             </button>

//             <button
//               onClick={handleFacebookLogin}
//               className={`w-full flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
//                 isDarkMode
//                   ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
//                   : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//               } shadow-lg hover:shadow-xl`}
//             >
//               <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
//                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//               </svg>
//               Continue with Facebook
//             </button>
//           </div>

//           {/* Divider */}
//           <div className="relative my-6">
//             <div className={`absolute inset-0 flex items-center ${
//               isDarkMode ? 'text-gray-600' : 'text-gray-400'
//             }`}>
//               <div className={`w-full border-t ${
//                 isDarkMode ? 'border-gray-600' : 'border-gray-300'
//               }`}></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className={`px-4 ${
//                 isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
//               }`}>
//                 Or continue with email
//               </span>
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center">
//               <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
//               <span className="text-red-700 text-sm">{error}</span>
//             </div>
//           )}

//           {/* Login Form */}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
//                 isDarkMode ? 'text-gray-300' : 'text-gray-700'
//               }`}>
//                 Email address
//               </label>
//               <div className="relative">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={credentials.email}
//                   onChange={handleInputChange}
//                   className={`w-full px-6 py-3 pl-12 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     isDarkMode
//                       ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
//                       : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
//                   } shadow-lg focus:shadow-xl`}
//                   placeholder="Enter your email"
//                 />
//                 <i className={`fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 ${
//                   isDarkMode ? 'text-gray-400' : 'text-gray-500'
//                 }`}></i>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
//                 isDarkMode ? 'text-gray-300' : 'text-gray-700'
//               }`}>
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="current-password"
//                   required
//                   value={credentials.password}
//                   onChange={handleInputChange}
//                   className={`w-full px-6 py-3 pl-12 pr-12 border rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     isDarkMode
//                       ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
//                       : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
//                   } shadow-lg focus:shadow-xl`}
//                   placeholder="Enter your password"
//                 />
//                 <i className={`fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 ${
//                   isDarkMode ? 'text-gray-400' : 'text-gray-500'
//                 }`}></i>
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
//                     isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
//                   } transition-colors`}
//                 >
//                   <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className={`ml-2 block text-sm ${
//                   isDarkMode ? 'text-gray-300' : 'text-gray-700'
//                 }`}>
//                   Remember me
//                 </label>
//               </div>

//               <div className="text-sm">
//                 <a href="#" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
//                   Forgot password?
//                 </a>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
//                 loading
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl'
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                                     Signing in...
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-sign-in-alt mr-2"></i>
//                   Sign in
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Sign up link */}
//           <div className="mt-6 text-center">
//             <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//               Don't have an account?{' '}
//               <Link 
//                 to="/signup" 
//                 className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//               >
//                 Create one now
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center">
//           <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
//             By signing in, you agree to our{' '}
//             <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
//             {' '}and{' '}
//             <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { useOAuth } from '../../hooks/useOAuth';

const Login = ({ apiURL }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  
  // OAuth hook
  const { 
    loading: oauthLoading, 
    error: oauthError, 
    signInWithGoogle, 
    signInWithFacebook,
    setError: setOAuthError
  } = useOAuth();

  // Load Google API
  useEffect(() => {
    const loadGoogleAPI = () => {
      if (!window.gapi) {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('auth2', () => {
            // Google API loaded
          });
        };
        document.head.appendChild(script);
      }
    };

    loadGoogleAPI();
  }, []);

  // Clear OAuth errors when component errors change
  useEffect(() => {
    if (error) {
      setOAuthError('');
    }
  }, [error, setOAuthError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOAuthError('');

    try {
      const response = await fetch(`${apiURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle(false);
  };

  const handleFacebookLogin = async () => {
    await signInWithFacebook(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (oauthError) setOAuthError('');
  };

  const currentError = error || oauthError;
  const isLoading = loading || oauthLoading;

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-blue-500' : 'bg-blue-200'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          isDarkMode ? 'bg-purple-500' : 'bg-purple-200'
        }`}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-newspaper text-white text-2xl"></i>
            </div>
          </div>
          <h2 className={`mt-6 text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back
          </h2>
          <p className={`mt-2 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sign in to your TaazaNEWS account
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
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } shadow-lg hover:shadow-xl`}
            >
              {oauthLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  <span>Connecting to Google...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
                            className={`w-full flex items-center justify-center px-4 py-3 border rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                isLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } shadow-lg hover:shadow-xl`}
            >
              {oauthLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span>Connecting to Facebook...</span>
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continue with Facebook
                </>
              )}
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
                Or continue with email
              </span>
            </div>
          </div>

          {/* Error Display */}
          {currentError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center space-x-2">
                <i className="fas fa-exclamation-circle text-red-500"></i>
                <span className="text-red-700 dark:text-red-300 text-sm">{currentError}</span>
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your email"
                />
                <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
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
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter your password"
                />
                <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className={`ml-2 block text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
