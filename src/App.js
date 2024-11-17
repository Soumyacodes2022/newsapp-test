import logo from './logo.svg';
import './App.css';
import {useEffect,useState} from 'react';
function App() {
  const [news, setNews] = useState([]); // State to store fetched news
  const [error, setError] = useState(null);
  const newNews = async()=>{
    const url = `https://content.guardianapis.com/search?api-key=208ec3cc-f15f-4719-9ca5-cb034ba7e87f`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data) // Assuming `data.response.results` contains the news articles
    } catch (err) {
      setError(err);
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
