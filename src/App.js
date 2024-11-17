import logo from './logo.svg';
import './App.css';
import {useEffect,useState} from 'react';
function App() {
  const [news, setNews] = useState([]); // State to store fetched news
  const [error, setError] = useState(null);
  const newNews = async()=>{
    const apiKey = '426c03e1761fa71c52a555e287cc2ccf';
    console.log(apiKey)
    if (!apiKey) {
      setError('API key is missing');
      return;
    }
    const url = `https://gnews.io/api/v4/search?q=example&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data) // Assuming `data.response.results` contains the news articles
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    newNews();
  }, [])
  
  return (
    <div className="App">
      <button onClick={newNews}>Test API</button>
      {error && <p>Error: {error}</p>}
      {news.length > 0 ? (
        <ul>
          {news.map((item, index) => (
            <li key={index}>{item.webTitle}</li>
          ))}
        </ul>
      ) : (
        !error && <p>Loading news...</p>
      )}
    </div>
  );
}

export default App;
