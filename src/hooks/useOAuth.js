import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import oauthService from '../services/oauthService';

export const useOAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOAuthSuccess = async (oauthData, isSignup = false) => {
    try {
      setLoading(true);
      setError('');
      
      const result = await oauthService.authenticateWithBackend(oauthData, isSignup);
      
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        navigate('/');
        return true;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (isSignup = false) => {
    try {
      setLoading(true);
      setError('');
      
      const oauthData = await oauthService.signInWithGoogle();
      return await handleOAuthSuccess(oauthData, isSignup);
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async (isSignup = false) => {
    try {
      setLoading(true);
      setError('');
      
      const oauthData = await oauthService.signInWithFacebook();
      return await handleOAuthSuccess(oauthData, isSignup);
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    signInWithGoogle,
    signInWithFacebook,
    setError
  };
};
