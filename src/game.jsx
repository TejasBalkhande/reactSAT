import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Game.css';

// Import Material-UI icons for navigation
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MapIcon from '@mui/icons-material/Map';
import QuizIcon from '@mui/icons-material/Quiz';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArticleIcon from '@mui/icons-material/Article';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

// Import icons for features
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import SchoolIcon from '@mui/icons-material/School';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';

function Game() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="app sat-app">
      {/* Navigation */}
      <nav className="navbar sat-navbar">
        <div className="nav-container">
          {/* Logo on leftmost side */}
          <div className="logo sat-logo" onClick={(e) => {
            e.stopPropagation();   // important!
            navigate('/');
          }}>
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          {/* Navigation links and Account button on rightmost side */}
          <div className="nav-links sat-nav-links">
            <Link to="/" className="nav-link sat-nav-link home-link">
              Home
            </Link>
            <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link">
              RoadMap
            </Link>
            <Link to="/digital-sat-practice-questions" className="nav-link sat-nav-link digital-sat-practice-questions-link">
               Mocks
            </Link>
            <Link to="/courses" className="nav-link sat-nav-link courses-link">
               Courses
            </Link>
            <Link to="/blogs" className="nav-link sat-nav-link blogs-link">
              Blogs
            </Link>
            
            {/* Account Button */}
            <button 
              onClick={handleAccountClick}
              className="nav-link sat-nav-link community-link account-button"
            >
            {isLoggedIn ? 'Profile' : 'Account'}
            </button>
          </div>
          
          {/* Mobile menu toggle */}
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>
      </nav>

      {/* Main Game Content */}
      <main className="game-main">
        {/* Hero Section with Character */}
        <section className="game-hero">
          <div className="game-hero-content">
            <div className="game-character-container">
              <img 
                src="/RIGHT.png" 
                alt="SAT Game Character" 
                className="game-character"
              />
            </div>
            
            <div className="game-message">
              <h1 className="game-title">SAT Prep Games</h1>
              <p className="game-subtitle">Learning SAT has never been this fun!</p>
              <div className="coming-soon-badge">
                <VideogameAssetIcon className="game-icon" />
                <span>Game Coming Soon</span>
              </div>
              <p className="game-description">
                We're building an exciting game-based learning platform that will transform your SAT preparation 
                into an adventure. Earn points, unlock levels, and compete with friends while mastering SAT concepts!
              </p>
              
              <div className="game-cta">
                
                <button className="game-back-btn" onClick={() => navigate('/')}>
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </section>

        
      </main>

      

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <img src="/logo.png" alt="Logo" className="mobile-logo-img" />
              <span className="mobile-logo-text">Mock SAT Exam</span>
            </div>
            <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
          </div>
          
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/courses" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Courses
            </Link>
            <Link to="/roadmap" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              RoadMap
            </Link>
            <Link to="/digital-sat-practice-questions" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Mocks
            </Link>
            <Link to="/game" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Game
            </Link>
            <Link to="/blogs" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Blogs
            </Link>
            <button 
              onClick={() => {
                handleAccountClick();
                setIsMenuOpen(false);
              }}
              className="mobile-menu-link"
            >
               {isLoggedIn ? 'Profile' : 'Account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;