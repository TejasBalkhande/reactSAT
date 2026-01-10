// App.jsx - UPDATED WITH PERSISTENT LEADERBOARD DATA
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import { 
  FaPenAlt, 
  FaChartBar, 
  FaUniversity, 
  FaBook, 
  FaGamepad, 
  FaUsers,
  FaTrophy,
  FaCrown,
  FaMedal,
  FaUserCircle,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import './App.css'

import { HelmetProvider } from 'react-helmet-async';

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

// Import StudyPlan component
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
import Game from './game';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// FIXED LEADERBOARD DATA - This will not change on refresh
const FIXED_LEADERBOARD_DATA = [
  { rank: 1, username: "AlexJohnson42", fullName: "Alex Johnson", country: "USA", score: 1580, progress: 95, improvement: "+25" },
  { rank: 2, username: "TaylorSmith7", fullName: "Taylor Smith", country: "Canada", score: 1565, progress: 93, improvement: "+18" },
  { rank: 3, username: "MorganLee23", fullName: "Morgan Lee", country: "UK", score: 1550, progress: 91, improvement: "+32" },
  { rank: 4, username: "CaseyBrown89", fullName: "Casey Brown", country: "Australia", score: 1540, progress: 89, improvement: "+12" },
  { rank: 5, username: "RileyWilliams31", fullName: "Riley Williams", country: "USA", score: 1535, progress: 88, improvement: "+8" },
  { rank: 6, username: "QuinnDavis56", fullName: "Quinn Davis", country: "India", score: 1525, progress: 87, improvement: "-5" },
  { rank: 7, username: "DakotaMiller12", fullName: "Dakota Miller", country: "Germany", score: 1515, progress: 85, improvement: "+15" },
  { rank: 8, username: "SkylerRodriguez78", fullName: "Skyler Rodriguez", country: "France", score: 1505, progress: 84, improvement: "+22" },
  { rank: 9, username: "AveryMartinez34", fullName: "Avery Martinez", country: "Japan", score: 1495, progress: 83, improvement: "+10" },
  { rank: 10, username: "CameronGarcia91", fullName: "Cameron Garcia", country: "South Korea", score: 1485, progress: 81, improvement: "+5" }

];

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
  const [leaderboardData, setLeaderboardData] = useState(FIXED_LEADERBOARD_DATA)
  const [userRank, setUserRank] = useState(25) // Fixed user rank

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
        date: '2026-01-20',
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80',
        slug: 'digital-sat-score-ivy-league-2026-good-score-range'
      },
      {
        id: 2,
        title: 'SAT vs. ACT in 2026: The Ultimate Guide to Choosing the Right Test for You',
        description: 'Struggling to choose between the SAT and ACT in 2026? Our comprehensive guide compares the digital SAT vs. ACT\'s format, content, scoring, and helps you pick the best test for your strengths.',
        date: '2026-01-18',
        image: 'https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=1193&auto=format&fit=crop&w=800&q=80',
        slug: 'sat-vs-act-2026-which-test-easier-choice-guide'
      },
      {
        id: 3,
        title: 'The Ultimate Guide to Mastering Desmos for the Digital SAT: Boost Your Score by 100+ Points',
        description: 'Stop using Desmos like a basic calculator! Our ultimate guide reveals the 7 essential skills and step-by-step strategies to solve SAT math problems faster and boost your score. Click to learn the secrets.',
        date: '2026-01-15',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
        slug: 'ultimate-guide-master-desmos-digital-sat'
      }
    ]

    setBlogPosts(mockBlogPosts)
    setIsLoading(false)

    // Always use fixed leaderboard data
    setLeaderboardData(FIXED_LEADERBOARD_DATA)
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
    setLeaderboardData(FIXED_LEADERBOARD_DATA)
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
    navigate('/study-plan')
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
      {/* Navigation */}
      <nav className="navbar sat-navbar">
        <div className="nav-container">
          {/* Logo on leftmost side */}
          <div className="logo sat-logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          {/* Navigation links and Account button on rightmost side */}
          <div className="nav-links sat-nav-links">
            
            <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link">
              RoadMap
            </Link>
            <Link to="/mock-practice" className="nav-link sat-nav-link mock-practice-link">
              Mocks
            </Link>
            <Link to="/courses" className="nav-link sat-nav-link courses-link">
              Courses
            </Link>
            <Link to="/game" className="nav-link sat-nav-link game-link">
              Game
            </Link>
            <Link to="/blogs" className="nav-link sat-nav-link blogs-link">
              Blogs
            </Link>
            
            {/* UPDATED ACCOUNT BUTTON - Shows Profile when logged in */}
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

      {/* Hero Section */}
      <section className="hero-section sat-hero">
        <div className="hero-overlay sat-hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title sat-hero-title">
            AI - Powered SAT Prep Made Simple.
          </h1>
          <p className="hero-subtitle sat-hero-subtitle">
            From instant AI Tutor support to your personalized AI Roadmap, prep smarter and score higher.
          </p>
          <div className="hero-buttons">
            <button 
              className="hero-btn primary sat-hero-btn"
              onClick={handleStartMockTest}
            >
              Start a Mock Test
            </button>
            <button className="hero-btn secondary sat-hero-btn-secondary" onClick={handleStartMockTest}>
              
              View Study Plans
            </button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section sat-features">
        <h2 className="features-title sat-features-title">Why Choose Mock SAT Exam?</h2>
        <p className="features-subtitle sat-features-subtitle">
          Our proven approach helps students achieve their target scores
        </p>
        
        <div className="features-grid sat-features-grid">
          <div className="feature-card sat-feature-card">
            <div className="sat-feature-icon-circle">
              <AssignmentIcon />
            </div>
            <h3>Full-Length Mock Tests</h3>
            <p>Simulate real SAT exam conditions with timed, realistic tests that mirror the actual testing experience</p>
          </div>
          
          <div className="feature-card sat-feature-card">
            <div className="sat-feature-icon-circle">
              <TimelineIcon />
            </div>
            <h3>Personalized Roadmaps</h3>
            <p>Free Courses and custom learning paths based on your strengths and weaknesses to maximize your study efficiency</p>
          </div>
          
          <div className="feature-card sat-feature-card">
            <div className="sat-feature-icon-circle">
              <PsychologyIcon />
            </div>
            <h3>AI Tutor Guidance</h3>
            <p>Targeted practice for Math, Reading, and Writing sections with AI Tutor for guidance</p>
          </div>
          
          <div className="feature-card sat-feature-card">
            <div className="sat-feature-icon-circle">
              <AnalyticsIcon />
            </div>
            <h3>Performance Analytics</h3>
            <p>Track progress, accuracy, speed, and improvement trends with comprehensive dashboards</p>
          </div>
        </div>
      </section>

      {/* UPDATED: Blog Section - Static Grid for Desktop, Stacked for Mobile */}
      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-header">
            <h2>Latest Blog Posts</h2>
            <p>Stay updated with the latest SAT prep tips and strategies</p>
          </div>
          
          {isLoading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {/* DESKTOP: Static Grid (3 posts side by side) */}
              <div className="blog-grid-desktop">
                {blogPosts.map((post) => (
                  <div className="blog-card" key={post.id}>
                    <div 
                      className="blog-card-image"
                      style={{ backgroundImage: `url(${post.image})` }}
                    ></div>
                    <div className="blog-card-content">
                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-desc">{post.description}</p>
                      <div className="blog-card-meta">
                        <span className="blog-card-date">
                          <CalendarTodayIcon style={{ fontSize: '16px' }} />
                          {formatDate(post.date)}
                        </span>
                        <button 
                          onClick={() => handleReadMore(post.slug)}
                          className="blog-card-read-more"
                        >
                          Read More <ArrowForwardIcon style={{ fontSize: '16px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* MOBILE: Stacked Layout (2 posts one above the other) */}
              <div className="blog-mobile-stack">
                {blogPosts.slice(0, 2).map((post) => (
                  <div className="blog-card" key={post.id}>
                    <div 
                      className="blog-card-image"
                      style={{ backgroundImage: `url(${post.image})` }}
                    ></div>
                    <div className="blog-card-content">
                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-desc">{post.description}</p>
                      <div className="blog-card-meta">
                        <span className="blog-card-date">
                          <CalendarTodayIcon style={{ fontSize: '16px' }} />
                          {formatDate(post.date)}
                        </span>
                        <button 
                          onClick={() => handleReadMore(post.slug)}
                          className="blog-card-read-more"
                        >
                          Read More <ArrowForwardIcon style={{ fontSize: '16px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="blog-cta">
                <button 
                  className="blog-view-all-btn"
                  onClick={handleViewAllBlogs}
                >
                  View All Blog Posts <ArrowForwardIcon style={{ fontSize: '20px' }} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* UPDATED RANKING SECTION WITH LEADERBOARD */}
      <section className="ranking-section sat-ranking">
        
        <div className="ranking-content">
          {/* Left Column: Competition Info */}
          <div className="ranking-left">
            <div className="ranking-header-compact">
              <h2>Global Ranking Test</h2>
              <p className="ranking-subtitle">Compete with students worldwide and climb the leaderboard</p>
            </div>
            
            <div className="ranking-details-grid">
              <div className="detail-item-compact">
                <span className="detail-icon-compact">⏱️</span>
                <span className="detail-text-compact">60 Min Duration</span>
              </div>
              <div className="detail-item-compact">
                <span className="detail-icon-compact">📋</span>
                <span className="detail-text-compact">30 MCQs</span>
              </div>
              <div className="detail-item-compact">
                <span className="detail-icon-compact">🎯</span>
                <span className="detail-text-compact">Intermediate+ Level</span>
              </div>
              <div className="detail-item-compact">
                <span className="detail-icon-compact">📅</span>
                <span className="detail-text-compact">Weekly Saturday</span>
              </div>
            </div>
            
            <div className="ranking-stats-compact">
              <div className="stat-item-compact">
                <div className="stat-value-compact">2.8K+</div>
                <div className="stat-label-compact">Participants</div>
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
              <button className="ranking-cta-compact ranking-cta-primary">
                Join Competition →
              </button>
              <button 
                className="ranking-cta-compact ranking-cta-secondary"
                onClick={handleViewLeaderboard}
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
                  <span>🔥</span>
                  <span>LIVE NOW • JOIN BEFORE IT ENDS</span>
                </div>
                <h3 className="live-title">Ranking Test is Live!</h3>
                <p className="live-subtitle">Compete in real-time with students worldwide</p>
                <div className="live-timer-compact">
                  <span>⏰</span>
                  <span>Ends in {rankingCountdown.hours}h {rankingCountdown.minutes}m</span>
                </div>
                <button className="ranking-cta-compact ranking-cta-primary" style={{ marginTop: '1.5rem' }}>
                  Join Live Test Now →
                </button>
              </div>
            ) : (
              <div className="countdown-compact">
                <div className="countdown-header">
                  <div className="countdown-label-compact">NEXT TEST STARTS IN</div>
                  <h3 className="countdown-title">Global Ranking #42</h3>
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
                  <div className="timer-dot"></div>
                  <div className="timer-dot"></div>
                  <div className="timer-dot"></div>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: 'auto' }}>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    Next test in 2 weeks
                  </p>
                  <button className="ranking-cta-compact ranking-cta-secondary" style={{ width: '100%' }}>
                    ⏰ Set Reminder
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* LEADERBOARD SECTION */}
        {showLeaderboard && (
          <div className="leaderboard-container">
            <div className="leaderboard-header">
              <h3><FaTrophy /> Global SAT Leaderboard</h3>
              <p className="leaderboard-subtitle">Top 20 performers from Global Ranking Test #41</p>
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
                  {leaderboardData.map((student) => (
                    <tr key={student.rank} className={student.rank <= 3 ? 'top-three' : ''}>
                      <td className="rank-cell">
                        <div className="rank-display">
                          {getRankIcon(student.rank)}
                        </div>
                      </td>
                      <td className="user-cell">
                        <div className="user-info">
                          <div className="user-avatar">
                            <FaUserCircle />
                          </div>
                          <div className="user-details">
                            <div className="user-name">{student.fullName}</div>
                            <div className="user-username">@{student.username}</div>
                            <div className="user-country">
                              <span className="country-flag">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> {student.country}
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
                  <div className="stat-label">Total Participants</div>
                </div>
                <div className="stat">
                  <div className="stat-value">1,420</div>
                  <div className="stat-label">Average Score</div>
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

      {/* Quick Navigation */}
      <section className="quick-nav-section sat-quick-nav">
        <h2>Quick Navigation</h2>
        <p>Access key features in one click</p>
        
        <div className="quick-nav-grid">
          <div className="nav-tile sat-nav-tile">
            <div className="nav-tile-icon">
              <FaPenAlt className="icon" />
            </div>
            <div className="nav-tile-label">Practice Questions</div>
          </div>
          
          <div className="nav-tile sat-nav-tile">
            <div className="nav-tile-icon">
              <FaChartBar className="icon" />
            </div>
            <div className="nav-tile-label">Mock Exams</div>
          </div>
          
          
          <div className="nav-tile sat-nav-tile">
            <div className="nav-tile-icon">
              <FaGamepad className="icon" />
            </div>
            <div className="nav-tile-label">SAT Game</div>
          </div>
        </div>
      </section>

      {/* Progress Tracker */}
      <section className="progress-section sat-progress">
        <h2>Track Your Progress</h2>
        <p>Sign up to unlock personalized study plans, progress tracking, and score analytics</p>
        <div className="progress-buttons">
          <button 
            className="progress-btn sat-progress-btn"
            onClick={() => navigate(isLoggedIn ? '/profile' : '/signup')}
          >
            {isLoggedIn ? 'Go to Profile' : 'Create Account'}
          </button>
          {!isLoggedIn && (
            <button 
              className="progress-btn-secondary"
              onClick={() => navigate('/login')}
            >
              Already have an account? Log in
            </button>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section sat-testimonials">
        <h2>Success Stories</h2>
        <p>Hear from students who achieved their dream scores</p>
        
        <div className="testimonials-grid">
          <div className="testimonial-card sat-testimonial-card">
            <div className="testimonial-quote">"SAT Prep Pro helped me increase my score by 250 points! The mock tests were incredibly realistic."</div>
            <div className="testimonial-author">Emily R.</div>
            <div className="testimonial-score">Scored: 1550</div>
          </div>
          
          <div className="testimonial-card sat-testimonial-card">
            <div className="testimonial-quote">"The personalized study plan identified my weak areas and helped me focus my efforts efficiently."</div>
            <div className="testimonial-author">Michael T.</div>
            <div className="testimonial-score">Scored: 1480</div>
          </div>
          
          <div className="testimonial-card sat-testimonial-card">
            <div className="testimonial-quote">"The expert strategies for time management completely changed how I approached the exam."</div>
            <div className="testimonial-author">Sophia K.</div>
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
      <footer className="footer sat-footer">
        <div className="footer-content">
          <div className="footer-columns">
            <div className="footer-column">
              <h3>Company</h3>
              <Link to="/info#company">About Us</Link>
              <Link to="/info#company">Careers</Link>
              <Link to="/info#company">Press</Link>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <Link to="/info#resources">Pricing/Plans</Link>
              <Link to="/info#resources">Study Materials</Link>
              <Link to="/info#resources">FAQs</Link>
            </div>
            
            <div className="footer-column">
              <h3>Support</h3>
              <Link to="/info#support">Contact Us</Link>
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
            <p>© 2025 SAT Prep Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu">
          {/* ADD THIS HEADER SECTION WITH LOGO */}
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <img src="/logo.png" alt="Logo" className="mobile-logo-img" />
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
            
            <Link to="/mock-practice" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
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
  )
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study-plan" element={<StudyPlan />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/courses" element={<CoursesScreen/>} />
          <Route path="/courses/:id" element={<CoursesPlaylistScreen />} />
          <Route path="/roadmap" element={ <Roadmap/>  }/>
          <Route path="/roadmap-level" element={ <RoadmapLevel/>  }/>
          <Route path="/mock-practice" element={<StudyPlan/>} />
          <Route path="/mock-test/:mockTestId" element={<MockTestScreen />} />
          <Route path="/game" element={<Game/>} />
          <Route path="/info" element={<Info />} />
          <Route path="/blogs" element={<BlogsList />} />
          <Route path="/blog/digital-sat-score-ivy-league-2026-good-score-range" element={<Blog1 />} />
          <Route path="/blog/sat-vs-act-2026-which-test-easier-choice-guide" element={<Blog2 />} />
          <Route path="/blog/ultimate-guide-master-desmos-digital-sat" element={<Blog3 />} />          
          <Route path="/blog/:slug" element={<SingleBlog />} />
          <Route path="/admin/create-blog" element={<CreateBlog />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileScreen />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </HelmetProvider>
    
  )
}

export default App