import { useState, useCallback } from 'react';

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiURL = process.env.REACT_APP_BASE_URL_API;

  const processArticle = useCallback(async (url, description, title) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiURL}/ai/process-article`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, description, title })
      });

      if (!response.ok) {
        throw new Error('Failed to process article');
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiURL]);

  return { processArticle, loading, error };
};
