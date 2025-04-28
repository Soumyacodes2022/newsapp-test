import React, { useContext } from 'react';
import Navbar from './Navbar';
import poushil from '../assets/poushil.jpg'
import rajprakash from '../assets/rajprakash.jpg'
import saikat from '../assets/saikat.jpg'
import soumya from '../assets/soumya.jpg'
import priyanshu from '../assets/priyanshu.png'
import { ThemeContext } from '../context/ThemeContext';

const AboutUs = () => {
  const { isDarkMode } = useContext(ThemeContext);
  console.log(isDarkMode);
  const teamMembers = [
    {
      name: "Soumya Ganguly",
      role: "Full Stack Developer",
      github: "https://github.com/Soumyacodes2022",
      linkedin: "https://www.linkedin.com/in/soumya-ganguly-752992234/",
      image:soumya
    },
    {
      name: "Poushil Dhali",
      role: "Database Engineer",
      linkedin: "https://www.linkedin.com/in/poushil-dhali-8a2472239",
      github: "https://github.com/poushildhali",
      image:poushil
    },
    {
      name: "Rajprakash Behera",
      role: "Frontend Developer",
      github: "https://github.com/rajprakash112B?tab=overview&from=2025-01-01&to=2025-01-17",
      linkedin: "https://www.linkedin.com/in/rajprakash-behera-8b6909283/",
      image:rajprakash
    },
    {
      name: "Priyanshu Prasad Gupta",
      role: "Backend Developer",
      github: "https://github.com/priyanshu2k3 ",
      linkedin: "https://www.linkedin.com/in/priyanshuprasadgupta/",
      image:priyanshu
    },
    {
      name: "Saikat Karmakar",
      role: "UI/UX Designer",
      github: "https://github.com/Saikatkarmakar670",
      linkedin: "https://www.linkedin.com/in/saikat-karmakar-b151b6318/",
      image:saikat
    }
  ];

  return (
    <div className="about-container" data-theme={isDarkMode ? 'dark' : 'light'}>
    <Navbar/>
    {/* <div className="about-container"> */}
      <div className="about-header">
        <h1>Meet Our Team</h1>
        <p className="project-description">
          TaazaNews: A Modern News Aggregation Platform
        </p>
      </div>

      <div className="project-info">
        <h2>About The Project</h2>
        <p>
          TaazaNews is a cutting-edge news aggregation platform developed as part of our final year engineering project. 
          Our platform leverages modern web technologies to deliver real-time news updates across various categories, 
          providing users with a seamless and intuitive news browsing experience.
        </p>
        
        <div className="tech-stack">
          <h3>Technologies Used</h3>
          <div className="tech-tags">
            <span>React.js</span>
            <span>Next.js</span>
            <span>GNews API</span>
            <span>Bootstrap</span>
            <span>CSS3</span>
            <span>Git</span>
          </div>
        </div>
      </div>

      <div className="team-grid">
  {teamMembers.map((member, index) => (
    <div className="team-member" key={index}>
      {member.image ? (
        <img 
          src={member.image} 
          alt={member.name}
          className="member-image"
        />
      ) : (
        <div className="member-avatar">
          {member.name.charAt(0)}
        </div>
      )}
      <h3>{member.name}</h3>
      <p>{member.role}</p>
      <div className="social-links">
        <a href={member.github} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i>
        </a>
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
    </div>
  ))}
</div>


      <div className="project-features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature">
            <i className="fas fa-sync"></i>
            <h3>Real-time Updates</h3>
            <p>Get the latest news as it happens</p>
          </div>
          <div className="feature">
            <i className="fas fa-search"></i>
            <h3>Smart Search</h3>
            <p>Find relevant news quickly</p>
          </div>
          <div className="feature">
            <i className="fas fa-mobile-alt"></i>
            <h3>Responsive Design</h3>
            <p>Seamless experience across all devices</p>
          </div>
          <div className="feature">
            <i className="fas fa-bookmark"></i>
            <h3>News Bookmarks</h3>
            <p>Access Bookmarked News Anytime/Anywhere</p>
          </div>
        </div>
      </div>
    {/* </div> */}
    </div>
  );
};

export default AboutUs;
