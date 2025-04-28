import React, { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import NewsItem from "./NewsCard";
import Navbar from "./Navbar";
import { ThemeContext } from "../context/ThemeContext";

const News = (props) => {
  const [results, setResults] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [page, setPage] = useState(1);
  const carouselRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async (searchTerm='') => {
    props.setProgress(15);
    let url = `https://gnews.io/api/v4/top-headlines?${searchTerm ? `q=${searchTerm}&` : ``}category=${props.category}&lang=en&country=${props.country}&apikey=${props.apiKey}&max=100`;
    let data = await fetch(url);
    console.log(data);
    // let data = {
    //   articles: [
    //     {
    //       title: "Demi Moore won't go quietly",
    //       description:
    //         "Coralie Fargeat’s ‘The Substance’ challenges Demi Moore and gives her the spotlight",
    //       content:
    //         "“Gage then makes his big offer: a million bucks for a night with Diana—no aftermath, no strings. ‘It’s just my body,’ Diana explains. ‘It’s not my mind.’ I was glad to have that cleared up, though it does raise an interesting question: How much would... [4493 chars]",
    //       url: "https://www.livemint.com/mint-lounge/art-and-culture/demi-moore-the-substance-margaret-qualley-coralie-fargeat-film-11737133220282.html",
    //       image:
    //         "https://www.livemint.com/lm-img/img/2025/01/19/1600x900/Golden-Globe-Nominations-0_1737270776896_1737270812327.jpg",
    //       publishedAt: "2025-01-19T07:19:17Z",
    //       source: {
    //         name: "Mint",
    //         url: "https://www.livemint.com",
    //       },
    //     },
    //     {
    //       "title": "Indian scientists develop wearable device that mimics pain to detect stress",
    //       "description": "Scientists from JNCASR have developed a device that senses strain, mimics pain perception and adapts its response. The device has been developed using silver wire network on a stretchable material. Read on to know more.",
    //       "content": "Follow us on Image Source : FREEPIK Indian scientists develop wearable device to detect stress\nThe scientists from the Jawaharlal Nehru Centre for Advanced Scientific Research (JNCASR), Bengaluru have developed a device that senses strain, mimics pai... [2025 chars]",
    //       "url": "https://www.indiatvnews.com/health/indian-scientists-develop-wearable-device-that-mimics-pain-to-detect-stress-2025-01-19-972030",
    //       "image": "https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2025/01/stress-1-1737269952.jpg",
    //       "publishedAt": "2025-01-19T07:04:11Z",
    //       "source": {
    //           "name": "India TV News",
    //           "url": "https://www.indiatvnews.com"
    //       }
    //   },
    //   {
    //       "title": "R.G. Kar doctor rape-murder case: I have three daughters, can feel the anguish of victim’s mother, says Sanjay Roy’s mother",
    //       "description": "Mother of convicted man accepts his punishment as destiny, willing to face consequences if guilty.",
    //       "content": "The mother of Sanjay Roy, who was convicted for the rape and murder of the medic of R.G. Kar Medical College and Hospital, on Sunday (January 19, 2025) said if her son is guilty then he should get the punishment he deserves, even if it means hanging.... [3132 chars]",
    //       "url": "https://www.thehindu.com/news/cities/kolkata/rg-kar-doctor-rape-murder-case-sanjay-roys-mother-says-he-should-get-the-punishment-he-deserves/article69115604.ece",
    //       "image": "https://th-i.thgim.com/public/incoming/pns5xr/article69115625.ece/alternates/LANDSCAPE_1200/IMG_Sanjay_Roy_produced__2_1_20DHR3OS.jpg",
    //       "publishedAt": "2025-01-19T06:51:00Z",
    //       "source": {
    //           "name": "The Hindu",
    //           "url": "https://www.thehindu.com"
    //       }
    //   },
    //   {
    //       "title": "India allows 1 mt sugar export amid limited surplus",
    //       "description": "Government allows export of 1 million tonnes of sugar to help mills amid falling prices, with permits required for control.",
    //       "content": "The government has allowed export of 1 million tonnes (mt) of sugar, sources said, to help mills realise better rates amid falling prices in the domestic market. Both the Indian Sugar and Bio-Energy Manufacturers Association (ISMA) and the National F... [1902 chars]",
    //       "url": "https://www.thehindubusinessline.com/economy/agri-business/india-allows-1-mt-sugar-export-amid-limited-surplus/article69115571.ece",
    //       "image": "https://bl-i.thgim.com/public/incoming/smeie6/article69115592.ece/alternates/LANDSCAPE_1200/CCI_UDHindu_KSL_UEI5DGC2F_R1549895395_0_176b1e7e-f0ec-4073-bacb-3bc95bab4fdc.jpg",
    //       "publishedAt": "2025-01-19T06:35:34Z",
    //       "source": {
    //           "name": "BusinessLine",
    //           "url": "https://www.thehindubusinessline.com"
    //       }
    //   },
    //   {
    //       "title": "Bigg Boss 18 winner will be Karan Veer Mehra: HT readers give their verdict",
    //       "description": "Bigg Boss 18 contestant Vivian Dsena secured the second spot after Karan Veer Mehra. Check out the positions of other contestants in the HT poll. | Web Series",
    //       "content": "The grand finale of the reality show Bigg Boss 18 will take place on Sunday evening. The top six contestants are Karan Veer Mehra, Vivian Dsena, Chum Darang, Eisha Singh, Avinash Mishra, and Rajat Dalal. Recently, HT conducted a poll to find out who ... [1909 chars]",
    //       "url": "https://www.hindustantimes.com/entertainment/web-series/bigg-boss-18-winner-will-be-karan-veer-mehra-ht-readers-give-their-verdict-101737265707201.html",
    //       "image": "https://www.hindustantimes.com/ht-img/img/2025/01/19/1600x900/rajat_1736929886843_1737268047335.jpg",
    //       "publishedAt": "2025-01-19T06:34:29Z",
    //       "source": {
    //           "name": "Hindustan Times",
    //           "url": "https://www.hindustantimes.com"
    //       }
    //   },
    //   {
    //       "title": "Amazon Great Republic Day sale ends tonight: Up to 40% off on premium washing machines from brands like Samsung, LG",
    //       "description": "The Amazon Great Republic Day sale ends tonight! Don’t miss out on exclusive deals with up to 40% off on premium washing machines from top brands like Samsung and LG. Shop now to grab the best discounts!",
    //       "content": "The Amazon Great Republic Day sale ends tonight, and it's the perfect time to grab unbeatable deals on premium washing machines from top brands like Samsung and LG.\nWith up to 40% off, you can enjoy a high-performance laundry experience at a fraction... [10457 chars]",
    //       "url": "https://www.livemint.com/technology/gadgets/amazon-great-republic-day-sale-ends-tonight-up-to-40-off-on-premium-washing-machines-from-brands-like-samsung-lg-11737103687819.html",
    //       "image": "https://www.livemint.com/lm-img/img/2025/01/17/1600x900/washing-machine_1737104174078_1737104186693.png",
    //       "publishedAt": "2025-01-19T06:30:05Z",
    //       "source": {
    //           "name": "Mint",
    //           "url": "https://www.livemint.com"
    //       }
    //   },
    //   {
    //       "title": "Islam Makhachev mauls Renato Moicano, finishes with first-round D’arce choke in UFC 311 main event",
    //       "description": "Islam Makhachev didn’t blink with a new opponent at UFC 311 as he made quick work of Renato Moicano after slapping on a D’arce choke to get the tap in the first round.",
    //       "content": "Islam Makhachev never backs down from a challenge and he proved that once again after accepting an opponent change on just 24 hours’ notice in the UFC 311 main event.\nBarely four minutes after the fight started, Makhachev made history with his fourth... [2856 chars]",
    //       "url": "https://www.mmafighting.com/2025/1/19/24347059/islam-makhachev-mauls-renato-moicano-finishes-first-round-darce-choke-in-ufc-311-main-event",
    //       "image": "https://cdn.vox-cdn.com/thumbor/IL0LpICW1vqOBl21jwy1euXm4Ls=/0x246:6786x3799/fit-in/1200x630/cdn.vox-cdn.com/uploads/chorus_asset/file/25837442/2194651858.jpg",
    //       "publishedAt": "2025-01-19T06:19:56Z",
    //       "source": {
    //           "name": "MMA Fighting",
    //           "url": "https://www.mmafighting.com"
    //       }
    //   },
    //   {
    //       "title": "The EXCITING 2025 Space Odyssey milestones that will shape the Universe",
    //       "description": "NASA’s Artemis III mission, which was expected to return astronauts to the Moon for the first time since 1972, has been delayed. Originally planned for 2025, the historic mission has now been pushed - The EXCITING 2025 Space Odyssey milestones that will shape the Universe",
    //       "content": "Home\nNews\nThe EXCITING 2025 Space Odyssey milestones that will shape the Universe\nThe EXCITING 2025 Space Odyssey milestones that will shape the Universe\nNASA’s Artemis III mission, which was expected to return astronauts to the Moon for the first ti... [8072 chars]",
    //       "url": "https://www.india.com/news/india/the-exciting-2025-space-odyssey-milestones-that-will-shape-the-universe-7549348/",
    //       "image": "https://static.india.com/wp-content/uploads/2025/01/title-2025-01-19T114111.014.jpg",
    //       "publishedAt": "2025-01-19T06:12:32Z",
    //       "source": {
    //           "name": "India.com",
    //           "url": "https://www.india.com"
    //       }
    //   },
    //   {
    //       "title": "Samsung Galaxy S25 Ultra Launch Date, Camera, Design, Specs, Price In India, Pre-booking, All We Know So Far",
    //       "description": "Samsung Galaxy S25 Ultra launches on January 22, 2025, at Galaxy Unpacked. With a titanium build, 200MP camera, and Snapdragon 8 Elite processor, the phone is available for pre-booking in India., Gadgets News - Times Now",
    //       "content": "Samsung Galaxy S25 Ultra render (Source: Gizmochina)\nSamsung’s highly anticipated Galaxy S25 Ultra is gearing up for a grand reveal at the Galaxy Unpacked event on January 22, 2025. Pre-bookings have already opened in India, with early buyers enjoyin... [1894 chars]",
    //       "url": "https://www.timesnownews.com/technology-science/gadgets/samsung-galaxy-s25-ultra-launch-date-camera-design-specs-price-in-india-pre-booking-all-we-know-so-far-article-117367662",
    //       "image": "https://static.tnn.in/thumb/msid-117367635,thumbsize-510544,width-1280,height-720,resizemode-75/117367635.jpg",
    //       "publishedAt": "2025-01-19T05:45:00Z",
    //       "source": {
    //           "name": "Times Now",
    //           "url": "https://www.timesnownews.com"
    //       }
    //   },
    //   {
    //       "title": "Israel-Hamas ceasefire LIVE: Netanyahu warns Gaza ceasefire will not begin without a list of hostages",
    //       "description": "Ceasefire in Gaza between Israel and Hamas set to begin, with potential end to 15-month war. Stay updated for more.",
    //       "content": "Aceasefire in Gaza between Israel and Hamas is set to come into effect on Sunday (January 19, 2025) morning with a hostage release to follow hours later, opening the way to a possible end to a 15-month war that has upended the Middle East.\nRead More:... [791 chars]",
    //       "url": "https://www.thehindu.com/news/international/israel-hamas-gaza-ceasefire-hostage-release-netanyahu-live-updates-january-19-2024/article69115403.ece",
    //       "image": "https://th-i.thgim.com/public/incoming/3d3zmr/article69115703.ece/alternates/LANDSCAPE_1200/image%206.jpg",
    //       "publishedAt": "2025-01-19T05:28:00Z",
    //       "source": {
    //           "name": "The Hindu",
    //           "url": "https://www.thehindu.com"
    //       }
    //   }
    //   ],
    // };
    props.setProgress(30);
    // let parsedData = await data.json();
    let parsedData = await data.json();
    props.setProgress(50);
    setResults(parsedData.articles);
    props.setProgress(100);
  };
  // console.log(updateNews(), "updateNews");

  // const updateNewsSearch = async(searchTerm='') => {
  //   props.setProgress(15);
  //   let url = `https://gnews.io/api/v4/top-headlines?${searchTerm ? `q=${searchTerm}&` : ''}category=${props.category}&lang=en&country=${props.country}&apikey=${props.apiKey}&max=100`;
    
  //   let data = await fetch(url);
  //   let parsedData = await data.json();
    
  //   props.setProgress(50);
  //   setResults(parsedData.articles);
  //   props.setProgress(100);
  // }

  useEffect(() => {
    updateNews();
  }, []);

  // const fetchMoreData = async () => {
  //   setPage(page + 1);
  //   const url = `https://gnews.io/api/v4/search?q=${props.category}&lang=en&country=${props.country}&apikey=${props.apiKey}`;
  //   const data = await fetch(url);
  //   const parsedData = await data.json();
  //   setResults(results.concat(parsedData.results));
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 3 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="news-container" data-theme={isDarkMode ? "dark" : "light"}>
      <Navbar updateNews={updateNews} />
      <div className="news-container">
        <div
          className="header-section"
          data-theme={isDarkMode ? "dark" : "light"}
        >
          <h1 className="main-title" data-theme={isDarkMode ? "dark" : "light"}>
            TaazaNEWS
            <span
              className="category-title"
              data-theme={isDarkMode ? "dark" : "light"}
            >
              Top Headlines on{" "}
              {props.category === "top"
                ? "General"
                : capitalizeFirstLetter(props.category)}
            </span>
          </h1>
        </div>
        {results && results.length > 0 ? (
        <div className="news-grid-container">
          <div className="news-grid">
            {results &&
              results.map((item, index) => (
                <div className="grid-item" key={index}>
                  <NewsItem
                    title={item.title ? item.title.slice(0, 67) : ""}
                    description={
                      item.description ? item.description.slice(0, 103) : ""
                    }
                    imageURL={item.image}
                    URL={item.url}
                    publishedAt={item.publishedAt}
                    source={item.source.name}
                    sourceUrl={item.source.url}
                  />
                </div>
              ))}
          </div>
        </div>
        ) : (
          <div className="empty-news">
            <i className="fas fa-newspaper empty-icon"></i>
            <h2>No News Found</h2>
            <p>Try adjusting your search or check back later for fresh updates!</p>
            <button onClick={() => updateNews()} className="refresh-btn">
              <i className="fas fa-sync-alt"></i> Refresh News
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

News.defaultProps = {
  country: "in",
  category: "general",
  pageSize: 12,
};

News.propTypes = {
  country: PropTypes.string,
  category: PropTypes.string,
  pageSize: PropTypes.number,
};

export default News;
