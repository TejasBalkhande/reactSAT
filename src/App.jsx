// App.jsx - UPDATED WITH NEW HERO SECTION
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { 
  FaPenAlt, 
  FaChartBar, 
  FaUniversity, 
  FaBook, 
  FaGamepad, 
  FaPlayCircle,
  FaUsers,
  FaTrophy,
  FaCrown,
  FaMedal,
  FaUserCircle,
  FaArrowUp,
  FaArrowDown,
  FaTimes,
  FaDownload
} from 'react-icons/fa';
import './App.css'

import { HelmetProvider, Helmet } from 'react-helmet-async';

// Import Material-UI icons
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MapIcon from '@mui/icons-material/Map';
import QuizIcon from '@mui/icons-material/Quiz';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArticleIcon from '@mui/icons-material/Article';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Import icons for feature cards
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Note from './pages/Note';
import StudyPlan from './StudyPlan';
import PracticePage from './PracticePage';
import BlogsList from './pages/BlogsList';
import CreateBlog from './pages/CreateBlog';
import SingleBlog from './pages/SingleBlog';
import LoginScreen from './account/LoginScreen';
import SignupScreen from './account/SignupScreen';
import ProfileScreen from './account/ProfileScreen';
import CoursesScreen from './courses/courses';
import CoursesPlaylistScreen from './courses/courses_playlist';
import Roadmap from './pages/Roadmap';
import RoadmapLevel from './pages/roadmap_level';
import MockTestScreen from './pages/mock_test_screen';
import Info from './pages/Info';
import Blog1 from './blogs/blog1';
import Blog2 from './blogs/blog2';
import Blog3 from './blogs/blog3';
import BannerAd from './banner';
// Import leaderboard data from JSON file
import leaderboardData from './assets/leaderboardData.json';


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [blogPosts, setBlogPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [rankingCountdown, setRankingCountdown] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 30,
    eventLive: false
  })
  
  // Track login state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  
  // Leaderboard state
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboardState, setLeaderboardState] = useState(leaderboardData)
  const [userRank, setUserRank] = useState(25) // Fixed user rank

  // Notification states
  const [showCompetitionNotification, setShowCompetitionNotification] = useState(false)
  const [showReminderNotification, setShowReminderNotification] = useState(false)

  // Use navigate for routing
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(user));
    }

    // UPDATED: New blog posts with proper images and navigation
    const mockBlogPosts = [
      {
        id: 1,
        title: 'Digital SAT Score Range: What is a \'Good\' Score for the Ivy League in 2026?',
        description: 'Aiming for the Ivy League in 2026? Get the essential Digital SAT score ranges, understand the new testing requirements, and learn how to build a winning application strategy.',
        date: '2026-01-25T08:00:00+00:00',
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
        author: 'Mock SAT Expert',
        slug: 'digital-sat-score-ivy-league-2026-good-score-range'
      },
      {
        id: 2,
        title: 'SAT vs. ACT in 2026: The Ultimate Guide to Choosing the Right Test for You',
        description: 'Struggling to choose between the SAT and ACT in 2026? Our comprehensive guide compares the digital SAT vs. ACT\'s format, content, scoring, and helps you pick the best test for your strengths.',
        date: '2026-01-25T08:00:00+00:00',
        image: 'https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1193&auto=format&fit=crop&w=800&q=80',
        author: 'Mock SAT Expert',
        slug: 'sat-vs-act-2026-which-test-easier-choice-guide'
      },
      {
        id: 3,
        title: 'The Ultimate Guide to Mastering Desmos for the Digital SAT: Boost Your Score by 100+ Points',
        description: 'Stop using Desmos like a basic calculator! Our ultimate guide reveals the 7 essential skills and step-by-step strategies to solve SAT math problems faster and boost your score. Click to learn the secrets.',
        date: '2026-01-25T08:00:00+00:00',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
        author: 'Mock SAT Expert',
        slug: 'ultimate-guide-master-desmos-digital-sat'
      }
    ]

    setBlogPosts(mockBlogPosts)
    setIsLoading(false)

    // Always use imported leaderboard data from JSON
    setLeaderboardState(leaderboardData)
    setUserRank(25)

    // Countdown timer setup
    const updateCountdown = () => {
      setRankingCountdown(prev => {
        let newSeconds = prev.seconds - 1
        let newMinutes = prev.minutes
        let newHours = prev.hours
        let newDays = prev.days
        
        if (newSeconds < 0) {
          newSeconds = 59
          newMinutes -= 1
        }
        
        if (newMinutes < 0) {
          newMinutes = 59
          newHours -= 1
        }
        
        if (newHours < 0) {
          newHours = 23
          newDays -= 1
        }
        
        return { 
          ...prev, 
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        }
      })
    }

    const countdownInterval = setInterval(updateCountdown, 1000)

    return () => {
      clearInterval(countdownInterval)
    }
  }, [])

  // Load fixed leaderboard data (no generation needed)
  const loadFixedLeaderboardData = () => {
    setLeaderboardState(leaderboardData)
    setUserRank(25)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Function to navigate to StudyPlan
  const handleStartMockTest = () => {
    navigate('/digital-sat-practice-questions')
  }
   const handleRoadmap = () => {
    navigate('/roadmap')
  }

  // Handle Account button click
  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  }

  // Handle View All Blogs
  const handleViewAllBlogs = () => {
    navigate('/blogs');
  }

  // Handle Read More click for individual blog posts
  const handleReadMore = (slug) => {
    navigate(`/blog/${slug}`);
  }

  // Handle View Leaderboard button click
  const handleViewLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
    loadFixedLeaderboardData();
  }

  // Handle Join Competition button click
  const handleJoinCompetition = () => {
    setShowCompetitionNotification(true);
    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowCompetitionNotification(false);
    }, 5000);
  }

  // Handle Set Reminder button click
  const handleSetReminder = () => {
    setShowReminderNotification(true);
    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowReminderNotification(false);
    }, 5000);
  }

  // Handle Download Notes button click
  const handleDownloadNotes = () => {
    navigate('/notes-question-bank');
  }

  // Get medal icon based on rank
  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <FaCrown className="rank-icon gold" />;
      case 2: return <FaMedal className="rank-icon silver" />;
      case 3: return <FaMedal className="rank-icon bronze" />;
      default: return <span className="rank-number">{rank}</span>;
    }
  }

  // Get improvement arrow
  const getImprovementIcon = (improvement) => {
    if (improvement.startsWith('+')) {
      return <FaArrowUp className="improvement-icon positive" />;
    } else if (improvement.startsWith('-')) {
      return <FaArrowDown className="improvement-icon negative" />;
    }
    return null;
  }

  return (
    <div className="app sat-app">
      <nav className="navbar sat-navbar">
        <div className="nav-container">
          <div className="logo sat-logo">
            <img src="/logo.png" alt="Mock SAT Exam Logo - Free Digital SAT Prep Platform" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          {/* Navigation links and Account button on rightmost side - ALWAYS VISIBLE ON DESKTOP */}
          <div className="nav-links sat-nav-links">
            
            <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link" aria-label="SAT Study Roadmap">
              RoadMap
            </Link>
            <Link to="/digital-sat-practice-questions" className="nav-link sat-nav-link digital-sat-practice-questions-link" aria-label="SAT Mock Practice Tests">
              Questions
            </Link>
            <Link to="/notes-question-bank" className="nav-link sat-nav-link roadmap-link" aria-label="SAT Study Roadmap">
              Qn.Bank
            </Link>
            <Link to="/courses" className="nav-link sat-nav-link courses-link" aria-label="Free SAT Courses">
              Courses
            </Link>
            <Link to="/blogs" className="nav-link sat-nav-link blogs-link" aria-label="SAT Blog Articles">
              Blogs
            </Link>
            
            {/* UPDATED ACCOUNT BUTTON - Shows Profile when logged in */}
            <button 
              onClick={handleAccountClick}
              className="nav-link sat-nav-link account-button"
              aria-label={isLoggedIn ? "View SAT Profile" : "SAT Account Login"}
            >
              {isLoggedIn ? 'Profile' : 'Account'}
            </button>
          </div>
          
          {/* Mobile menu toggle - VISIBLE ONLY ON TABLET/MOBILE (via CSS) */}
          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close SAT navigation menu" : "Open SAT navigation menu"}
            aria-expanded={isMenuOpen}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* UPDATED: Hero Section - Two Column Layout */}
      <section className="hero-section sat-hero " role="banner">
        <div className="sat-hero-overlay"></div>
        <div className="hero-container">
          {/* Left Column: Text and Buttons */}
          <div className="hero-left">
            <div className="hero-content">
              <h1 className="hero-title sat-hero-title">
                Boost Your 2026 Digital SAT Score with AI
              </h1>
              
              <p className="hero-subtitle sat-hero-subtitle">
                Start with a Free Full-Length Mock Test, get an instant score prediction, and let our AI tutor build your custom path to 1500+
              </p>
              
              {/* UPDATED: Two buttons in a row, download button below (centered for mobile) */}
              <div className="hero-buttons">
                <button 
                  className="hero-btn primary sat-hero-btn"
                  onClick={handleStartMockTest}
                  aria-label="Start Free SAT Mock Test"
                >
                  <FaPlayCircle aria-hidden="true" />
                  Mock Test
                </button>
                <button 
                  className="hero-btn secondary sat-hero-btn-secondary" 
                  onClick={handleRoadmap}
                  aria-label="View SAT Study Plans"
                >
                  <FaChartBar aria-hidden="true" />
                  Study Plans
                </button>
                
                {/* Download Notes Button - Takes full width below the two buttons */}
                <button 
                  className="download-notes-btn"
                  onClick={handleDownloadNotes}
                  aria-label="Download Free SAT Notes PDF"
                >
                  <FaDownload className="download-icon" aria-hidden="true" />
                  Notes/Question Bank
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column: Book Image */}
          <div className="hero-right">
            <img 
              src="/book.png" 
              alt="Digital SAT Study Book with transparent background - Free SAT Preparation Materials" 
              className="hero-book-image"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section sat-features" aria-labelledby="features-title">
        <h2 id="features-title" className="features-title sat-features-title">Why Choose Mock SAT Exam?</h2>
        <p className="features-subtitle sat-features-subtitle">
          Our proven approach helps students achieve their target SAT scores
        </p>
        
        <div className="features-grid sat-features-grid">
          <div className="feature-card sat-feature-card" itemScope itemType="https://schema.org/Service">
            <div className="sat-feature-icon-circle">
              <AssignmentIcon aria-hidden="true" />
            </div>
            <h3 itemProp="name">Full-Length Mock Tests</h3>
            <p itemProp="description">Simulate real SAT exam conditions with timed, realistic tests that mirror the actual Digital SAT testing experience</p>
          </div>
          
          <div className="feature-card sat-feature-card" itemScope itemType="https://schema.org/Service">
            <div className="sat-feature-icon-circle">
              <TimelineIcon aria-hidden="true" />
            </div>
            <h3 itemProp="name">Personalized Roadmaps</h3>
            <p itemProp="description">Free Courses and custom learning paths based on your strengths and weaknesses to maximize your SAT study efficiency</p>
          </div>
          
          <div className="feature-card sat-feature-card" itemScope itemType="https://schema.org/Service">
            <div className="sat-feature-icon-circle">
              <PsychologyIcon aria-hidden="true" />
            </div>
            <h3 itemProp="name">AI Tutor Guidance</h3>
            <p itemProp="description">Targeted practice for Math, Reading, and Writing sections with AI Tutor for personalized SAT guidance</p>
          </div>
          
          <div className="feature-card sat-feature-card" itemScope itemType="https://schema.org/Service">
            <div className="sat-feature-icon-circle">
              <AnalyticsIcon aria-hidden="true" />
            </div>
            <h3 itemProp="name">Performance Analytics</h3>
            <p itemProp="description">Track SAT progress, accuracy, speed, and improvement trends with comprehensive dashboards</p>
          </div>
        </div>
      </section>

      <BannerAd />

      {/* UPDATED: Blog Section - Static Grid for Desktop, Stacked for Mobile */}
      <section className="blog-section" aria-labelledby="blog-title">
        <div className="blog-container">
          
          <div className="blog-header">
            <h2 id="blog-title">Latest SAT Blog Posts</h2>
            <p>Stay updated with the latest Digital SAT prep tips and strategies for 2026</p>
          </div>
          
          {isLoading ? (
            <div className="loading-spinner" role="status" aria-label="Loading blog posts">Loading...</div>
          ) : (
            <>
              {/* DESKTOP: Static Grid (3 posts side by side) */}
              <div className="blog-grid-desktop" role="list">
                {blogPosts.map((post) => (
                  <article 
                    className="blog-card" 
                    key={post.id} 
                    role="listitem"
                    itemScope 
                    itemType="https://schema.org/Article"
                  >
                    <link itemProp="image" href={post.image} />
                    
                    <div 
                      className="blog-card-image"
                      style={{ backgroundImage: `url(${post.image})` }}
                      role="img"
                      aria-label={`Featured image for ${post.title}`}
                    ></div>
                    <div className="blog-card-content">
                      <h3 className="blog-card-title" itemProp="headline">{post.title}</h3>
                      <p className="blog-card-desc" itemProp="description">{post.description}</p>
                      <div className="blog-card-meta">
                        <time className="blog-card-date" itemProp="datePublished" dateTime={post.date}>
                          <CalendarTodayIcon style={{ fontSize: '16px' }} aria-hidden="true" />
                          {formatDate(post.date)}
                        </time>
                        <button 
                          onClick={() => handleReadMore(post.slug)}
                          className="blog-card-read-more"
                          aria-label={`Read more about ${post.title}`}
                        >
                          Read More <ArrowForwardIcon style={{ fontSize: '16px' }} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* MOBILE: Stacked Layout (2 posts one above the other) */}
              <div className="blog-mobile-stack" role="list">
                {blogPosts.slice(0, 2).map((post) => (
                  <article 
                    className="blog-card" 
                    key={post.id} 
                    role="listitem"
                    itemScope 
                    itemType="https://schema.org/Article"
                  >
                    <div 
                      className="blog-card-image"
                      style={{ backgroundImage: `url(${post.image})` }}
                      role="img"
                      aria-label={`Featured image for ${post.title}`}
                    ></div>
                    <div className="blog-card-content">
                      <h3 className="blog-card-title" itemProp="headline">{post.title}</h3>
                      <p className="blog-card-desc" itemProp="description">{post.description}</p>
                      <div className="blog-card-meta">
                        <time className="blog-card-date" itemProp="datePublished" dateTime={post.date}>
                          <CalendarTodayIcon style={{ fontSize: '16px' }} aria-hidden="true" />
                          {formatDate(post.date)}
                        </time>
                        <button 
                          onClick={() => handleReadMore(post.slug)}
                          className="blog-card-read-more"
                          aria-label={`Read more about ${post.title}`}
                        >
                          Read More <ArrowForwardIcon style={{ fontSize: '16px' }} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              <div className="blog-cta">
                <button 
                  className="blog-view-all-btn"
                  onClick={handleViewAllBlogs}
                  aria-label="View all SAT blog posts"
                >
                  View All Blog Posts <ArrowForwardIcon style={{ fontSize: '20px' }} aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* UPDATED RANKING SECTION WITH LEADERBOARD AND NOTIFICATIONS */}
      <section className="ranking-section sat-ranking" aria-labelledby="ranking-title">
        <div className="ranking-content">
          {/* Left Column: Competition Info */}
          <div className="ranking-left">
            <div className="ranking-header-compact">
              <h2 id="ranking-title">Global SAT Ranking Test</h2>
              <p className="ranking-subtitle">Compete with students worldwide and climb the SAT leaderboard</p>
            </div>
            
            <div className="ranking-details-grid">
              <div className="detail-item-compact">
                <span className="detail-icon-compact" aria-hidden="true">⏱️</span>
                <span className="detail-text-compact">60 Min Duration</span>
              </div>
              <div className="detail-item-compact">
                <span className="detail-icon-compact" aria-hidden="true">📋</span>
                <span className="detail-text-compact">30 MCQs</span>
              </div>
              <div className="detail-item-compact">
                <span className="detail-icon-compact" aria-hidden="true">🎯</span>
                <span className="detail-text-compact">Intermediate+ Level</span>
              </div>
              <div className="detail-item-compact">
                <span className="detail-icon-compact" aria-hidden="true">📅</span>
                <span className="detail-text-compact">Weekly Saturday</span>
              </div>
            </div>
            
            <div className="ranking-stats-compact">
              <div className="stat-item-compact">
                <div className="stat-value-compact">2.8K+</div>
                <div className="stat-label-compact">SAT Participants</div>
              </div>
              <div className="stat-item-compact">
                <div className="stat-value-compact">Top 50</div>
                <div className="stat-label-compact">Win Prizes</div>
              </div>
              <div className="stat-item-compact">
                <div className="stat-value-compact">$100+</div>
                <div className="stat-label-compact">Total Prizes</div>
              </div>
            </div>
            
            <div className="ranking-actions">
              <button 
                className="ranking-cta-compact ranking-cta-primary"
                onClick={handleJoinCompetition}
                aria-label="Join SAT Global Competition"
              >
                Join Competition →
              </button>
              <button 
                className="ranking-cta-compact ranking-cta-secondary"
                onClick={handleViewLeaderboard}
                aria-label="View SAT Leaderboard"
              >
                {showLeaderboard ? 'Hide Leaderboard' : 'View Leaderboard'}
              </button>
            </div>
          </div>
          
          {/* Right Column: Countdown Timer - HIDDEN ON MOBILE */}
          <div className="ranking-right">
            {rankingCountdown.eventLive ? (
              <div className="countdown-live-compact">
                <div className="live-badge-compact">
                  <span aria-hidden="true">🔥</span>
                  <span>LIVE NOW • JOIN BEFORE IT ENDS</span>
                </div>
                <h3 className="live-title">SAT Ranking Test is Live!</h3>
                <p className="live-subtitle">Compete in real-time with students worldwide on the Digital SAT</p>
                <div className="live-timer-compact">
                  <span aria-hidden="true">⏰</span>
                  <span>Ends in {rankingCountdown.hours}h {rankingCountdown.minutes}m</span>
                </div>
                <button className="ranking-cta-compact ranking-cta-primary" style={{ marginTop: '1.5rem' }}>
                  Join Live SAT Test Now →
                </button>
              </div>
            ) : (
              <div className="countdown-compact">
                <div className="countdown-header">
                  <div className="countdown-label-compact">NEXT SAT TEST STARTS IN</div>
                  <h3 className="countdown-title">Global SAT Ranking #42</h3>
                  <p className="countdown-schedule">Every Saturday • 8:00 AM (EST)</p>
                </div>
                
                <div className="timer-grid">
                  <div className="time-unit-compact">
                    <div className="time-value-compact">
                      {rankingCountdown.days.toString().padStart(2, '0')}
                    </div>
                    <div className="time-label-compact">Days</div>
                  </div>
                  <div className="time-unit-compact">
                    <div className="time-value-compact">
                      {rankingCountdown.hours.toString().padStart(2, '0')}
                    </div>
                    <div className="time-label-compact">Hours</div>
                  </div>
                  <div className="time-unit-compact">
                    <div className="time-value-compact">
                      {rankingCountdown.minutes.toString().padStart(2, '0')}
                    </div>
                    <div className="time-label-compact">Mins</div>
                  </div>
                  <div className="time-unit-compact">
                    <div className="time-value-compact">
                      {rankingCountdown.seconds.toString().padStart(2, '0')}
                    </div>
                    <div className="time-label-compact">Secs</div>
                  </div>
                </div>
                
                <div className="timer-separators">
                  <div className="timer-dot" aria-hidden="true"></div>
                  <div className="timer-dot" aria-hidden="true"></div>
                  <div className="timer-dot" aria-hidden="true"></div>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    Next SAT test in 2 weeks
                  </p>
                  <button 
                    className="ranking-cta-compact ranking-cta-secondary" 
                    style={{ width: '100%' }}
                    onClick={handleSetReminder}
                  >
                    ⏰ Set SAT Reminder
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* COMPETITION NOTIFICATION */}
        {showCompetitionNotification && (
          <div className="notification competition-notification">
            <div className="notification-content">
              <span className="notification-icon">📢</span>
              <span className="notification-text">Competition hasn't started yet. Please check back on Saturday at 8:00 AM EST.</span>
              <button 
                className="notification-close" 
                onClick={() => setShowCompetitionNotification(false)}
                aria-label="Close notification"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}
        
        {/* REMINDER NOTIFICATION */}
        {showReminderNotification && (
          <div className="notification reminder-notification">
            <div className="notification-content">
              <span className="notification-icon">✅</span>
              <span className="notification-text">Reminder set! You'll be notified when the SAT competition starts.</span>
              <button 
                className="notification-close" 
                onClick={() => setShowReminderNotification(false)}
                aria-label="Close notification"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}
        
        {/* LEADERBOARD SECTION */}
        {showLeaderboard && (
          <div className="leaderboard-container">
            <div className="leaderboard-header">
              <h3><FaTrophy aria-hidden="true" /> Global SAT Leaderboard</h3>
              <p className="leaderboard-subtitle">Top 20 performers from Global SAT Ranking Test #41</p>
            </div>
            
            <div className="leaderboard-table-container">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th className="rank-col">Rank</th>
                    <th className="user-col">Student</th>
                    <th className="score-col">SAT Score</th>
                    <th className="progress-col">Progress</th>
                    <th className="improvement-col">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardState.map((student) => (
                    <tr key={student.rank} className={student.rank <= 3 ? 'top-three' : ''}>
                      <td className="rank-cell">
                        <div className="rank-display">
                          {getRankIcon(student.rank)}
                        </div>
                      </td>
                      <td className="user-cell">
                        <div className="user-info">
                          <div className="user-avatar">
                            <FaUserCircle aria-hidden="true" />
                          </div>
                          <div className="user-details">
                            <div className="user-name">{student.fullName}</div>
                            <div className="user-username">@{student.username}</div>
                            <div className="user-country">
                              <span className="country-flag" aria-hidden="true">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> {student.country}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="score-cell">
                        <div className="score-display">
                          <span className="score-value">{student.score}</span>
                          <span className="score-max">/1600</span>
                        </div>
                      </td>
                      <td className="progress-cell">
                        <div className="progress-bar-container">
                          <div className="progress-bar-label">{student.progress}%</div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="improvement-cell">
                        <div className="improvement-display">
                          {getImprovementIcon(student.improvement)}
                          <span className={`improvement-value ${student.improvement.startsWith('+') ? 'positive' : student.improvement.startsWith('-') ? 'negative' : ''}`}>
                            {student.improvement}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="leaderboard-footer">
              <div className="leaderboard-stats">
                <div className="stat">
                  <div className="stat-value">2,847</div>
                  <div className="stat-label">Total SAT Participants</div>
                </div>
                <div className="stat">
                  <div className="stat-value">1,420</div>
                  <div className="stat-label">Average SAT Score</div>
                </div>
                <div className="stat">
                  <div className="stat-value">72</div>
                  <div className="stat-label">Countries</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <BannerAd />

      {/* Quick Navigation */}
      <section className="quick-nav-section sat-quick-nav" aria-labelledby="quick-nav-title">
        <h2 id="quick-nav-title">Quick SAT Navigation</h2>
        <p>Access key SAT prep features in one click</p>
        
        <div className="quick-nav-grid">
          {/* SAT Practice Questions - Links to Practice Questions */}
          <div 
            className="nav-tile sat-nav-tile" 
            role="button" 
            tabIndex="0"
            onClick={() => navigate('/digital-sat-practice-questions')}
            style={{ cursor: 'pointer' }}
          >
            <div className="nav-tile-icon">
              <FaPenAlt className="icon" aria-hidden="true" />
            </div>
            <div className="nav-tile-label">SAT Practice Questions</div>
          </div>
          
          {/* SAT RoadMap - Links to Roadmap */}
          <div 
            className="nav-tile sat-nav-tile" 
            role="button" 
            tabIndex="0"
            onClick={() => navigate('/roadmap')}
            style={{ cursor: 'pointer' }}
          >
            <div className="nav-tile-icon">
              <FaChartBar className="icon" aria-hidden="true" />
            </div>
            <div className="nav-tile-label">SAT RoadMap</div>
          </div>
          
          {/* SAT Courses - Links to Courses */}
          <div 
            className="nav-tile sat-nav-tile" 
            role="button" 
            tabIndex="0"
            onClick={() => navigate('/courses')}
            style={{ cursor: 'pointer' }}
          >
            <div className="nav-tile-icon">
              <FaPlayCircle className="icon" aria-hidden="true" />
            </div>
            <div className="nav-tile-label">SAT Courses</div>
          </div>
        </div>
      </section>

      {/* Progress Tracker */}
      <section className="progress-section sat-progress" aria-labelledby="progress-title">
        <h2 id="progress-title">Track Your SAT Progress</h2>
        <p>Sign up to unlock personalized SAT study plans, progress tracking, and score analytics</p>
        <div className="progress-buttons">
          <button 
            className="progress-btn sat-progress-btn"
            onClick={() => navigate(isLoggedIn ? '/profile' : '/signup')}
            aria-label={isLoggedIn ? "Go to SAT Profile" : "Create SAT Prep Account"}
          >
            {isLoggedIn ? 'Go to Profile' : 'Create SAT Account'}
          </button>
          {!isLoggedIn && (
            <button 
              className="progress-btn-secondary"
              onClick={() => navigate('/login')}
              aria-label="Login to SAT Account"
            >
              Already have an account? Log in
            </button>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section sat-testimonials" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title">SAT Success Stories</h2>
        <p>Hear from students who achieved their dream SAT scores</p>

        <div className="testimonials-grid">
          {/* Testimonial 1 */}
          <div className="testimonial-card sat-testimonial-card" itemScope itemType="https://schema.org/Review">
            <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Course">
              <meta itemProp="name" content="SAT Prep Service" />
              {/* FIXED: These must be INSIDE the Course div */}
              <meta itemProp="description" content="A comprehensive free digital SAT preparation platform featuring AI-driven mock tests, personalized study plans, and performance analytics." />
              <div itemProp="provider" itemScope itemType="https://schema.org/Organization">
                <meta itemProp="name" content="Mock SAT Exam" />
              </div>
            </div>
            <div className="testimonial-quote" itemProp="reviewBody">"Mock SAT helped me increase my score by 250 points! The mock tests were incredibly realistic for the Digital SAT."</div>
            <div className="testimonial-author" itemProp="author" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">Emily R.</span>
            </div>
            <div className="testimonial-score">Scored: 1550</div>
          </div>

          {/* Testimonial 2 */}
          <div className="testimonial-card sat-testimonial-card" itemScope itemType="https://schema.org/Review">
            <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Course">
              <meta itemProp="name" content="SAT Prep Service" />
              <meta itemProp="description" content="A comprehensive free digital SAT preparation platform featuring AI-driven mock tests, personalized study plans, and performance analytics." />
              <div itemProp="provider" itemScope itemType="https://schema.org/Organization">
                <meta itemProp="name" content="Mock SAT Exam" />
              </div>
            </div>
            <div className="testimonial-quote" itemProp="reviewBody">"The personalized SAT study plan identified my weak areas and helped me focus my efforts efficiently for the 2026 Digital SAT."</div>
            <div className="testimonial-author" itemProp="author" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">Michael T.</span>
            </div>
            <div className="testimonial-score">Scored: 1480</div>
          </div>

          {/* Testimonial 3 */}
          <div className="testimonial-card sat-testimonial-card" itemScope itemType="https://schema.org/Review">
            <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Course">
              <meta itemProp="name" content="SAT Prep Service" />
              <meta itemProp="description" content="A comprehensive free digital SAT preparation platform featuring AI-driven mock tests, personalized study plans, and performance analytics." />
              <div itemProp="provider" itemScope itemType="https://schema.org/Organization">
                <meta itemProp="name" content="Mock SAT Exam" />
              </div>
            </div>
            <div className="testimonial-quote" itemProp="reviewBody">"The expert SAT strategies for time management completely changed how I approached the Digital SAT exam."</div>
            <div className="testimonial-author" itemProp="author" itemScope itemType="https://schema.org/Person">
              <span itemProp="name">Sophia K.</span>
            </div>
            <div className="testimonial-score">Scored: 1520</div>
          </div>
        </div>

        <div className="trust-badges">
          <div className="trust-badge">College Board®</div>
          <div className="trust-badge">Princeton Review®</div>
          <div className="trust-badge">Forbes Education</div>
          <div className="trust-badge">US News</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer sat-footer" role="contentinfo">
        <div className="footer-content">
          <div className="footer-columns">
            <div className="footer-column">
              <h3>Company</h3>
              <Link to="/info#company">About SAT Prep</Link>
              <Link to="/info#company">Careers</Link>
              <Link to="/info#company">Press</Link>
            </div>
            
            <div className="footer-column">
              <h3>SAT Resources</h3>
              <Link to="/info#resources">Pricing/Plans</Link>
              <Link to="/info#resources">Study Materials</Link>
              <Link to="/info#resources">FAQs</Link>
            </div>
            
            <div className="footer-column">
              <h3>Support</h3>
              <Link to="/info#support">ContactHelp</Link>
              <Link to="/info#support">Help Center</Link>
              <Link to="/info#support">System Status</Link>
            </div>
            
            <div className="footer-column">
              <h3>Legal</h3>
              <Link to="/info#legal">Privacy Policy</Link>
              <Link to="/info#legal">Terms of Service</Link>
              <Link to="/info#legal">Cookie Policy</Link>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <p>© 2025 Mock SAT Exam. All rights reserved. Free Digital SAT Preparation Platform.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu" role="dialog" aria-label="SAT Navigation Menu" aria-modal="true">
          {/* Header with logo and close button */}
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <img src="/logo.png" alt="Mock SAT Exam" className="mobile-logo-img" />
              <span className="mobile-logo-text">Mock SAT Exam</span>
            </div>
            <button 
              className="close-menu" 
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close SAT menu"
            >
              ×
            </button>
          </div>
          
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/notes-question-bank" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Qn.Bank
            </Link>
            <Link to="/roadmap" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              RoadMap
            </Link>
            <Link to="/digital-sat-practice-questions" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Questions
            </Link>
            <Link to="/courses" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Courses
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
              aria-label={isLoggedIn ? "SAT Profile" : "SAT Account Login"}
            >
              <PersonIcon style={{ fontSize: '1.4rem' }} aria-hidden="true" />
              {isLoggedIn ? 'Profile' : 'Account'}
            </button>
            
          
          </div>
        </div>
      )}

    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/digital-sat-practice-questions" element={<StudyPlan />} /> 
          <Route path="/practice" element={<PracticePage />} />

          
          {/* Catch-all route for topic-based practice URLs */}
          <Route path="/math" element={<PracticePage />} />
          <Route path="/reading-and-writing" element={<PracticePage />} />
          <Route path="/roadmap" element={ <Roadmap/>  }/>
          <Route path="/roadmap-level" element={ <RoadmapLevel/>  }/>
          <Route path="/digital-sat-practice-questions" element={<StudyPlan/>} />
          <Route path="/courses" element={<CoursesScreen/>} />

          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          } />

          <Route path="/admin/create-blog" element={<CreateBlog />} />


          <Route path="/blogs" element={<BlogsList />} />
          <Route path="/blog/digital-sat-score-ivy-league-2026-good-score-range" element={<Blog1 />} />
          <Route path="/blog/sat-vs-act-2026-which-test-easier-choice-guide" element={<Blog2 />} />
          <Route path="/blog/ultimate-guide-master-desmos-digital-sat" element={<Blog3 />} />    
          <Route path="/info" element={<Info />} />


          <Route path="/:topicSlug" element={<PracticePage />} />
          <Route path="/:subdomainSlug/:topicSlug" element={<PracticePage />} />
          <Route path="/notes-question-bank" element={<Note />} />
          <Route path="/courses/:id" element={<CoursesPlaylistScreen />} />
          
          <Route path="/mock-test/:mockTestId" element={<MockTestScreen />} />
    
          <Route path="/blog/:slug" element={<SingleBlog />} />
          
        </Routes>
      </Router>
    </HelmetProvider>
    
  )
}

export default App