
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './profile_screen.css';
import '../App.css'; // Import App.css for navbar styles

// Import Material-UI icons for navbar
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MapIcon from '@mui/icons-material/Map';
import QuizIcon from '@mui/icons-material/Quiz';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArticleIcon from '@mui/icons-material/Article';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [loadingRoadmap, setLoadingRoadmap] = useState(true);
  
  // Stats based on currentLevel
  const [stats, setStats] = useState({
    practiceTests: 0,
    averageScore: 0,
    studyHours: 0,
    improvement: 0
  });
  
  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const API_URL = 'https://sat-blog-worker.tejasbalkhande221.workers.dev';

  // Fetch user roadmap data
  const fetchRoadmapData = async (email) => {
    try {
      setLoadingRoadmap(true);
      console.log('📊 Fetching roadmap data for email:', email);
      
      const response = await fetch(`${API_URL}/api/roadmap?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('📊 Roadmap API response:', data);
      
      if (data.success && data.exists) {
        const level = data.level || 0;
        setCurrentLevel(level);
        
        // Calculate stats based on current level
        setStats({
          practiceTests: level,
          averageScore: level * 150,
          studyHours: level * 0.75,
          improvement: level * 13
        });
        
        console.log('✅ Roadmap loaded. Level:', level);
      } else {
        // If no roadmap exists, use default level 0
        console.log('📭 No roadmap found for user, using default level 0');
        setCurrentLevel(0);
        setStats({
          practiceTests: 0,
          averageScore: 0,
          studyHours: 0,
          improvement: 0
        });
      }
    } catch (error) {
      console.error('❌ Error fetching roadmap:', error);
      // Fallback to default level 0 on error
      setCurrentLevel(0);
      setStats({
        practiceTests: 0,
        averageScore: 0,
        studyHours: 0,
        improvement: 0
      });
    } finally {
      setLoadingRoadmap(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.success) {
          setUserData(data.user);
          
          // Fetch roadmap data after getting user profile
          if (data.user.email) {
            await fetchRoadmapData(data.user.email);
          } else {
            // Use default stats if no email
            setStats({
              practiceTests: 0,
              averageScore: 0,
              studyHours: 0,
              improvement: 0
            });
            setLoadingRoadmap(false);
          }
        } else {
          setError(data.error || 'Failed to load profile');
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSubscriptionDate = (dateString) => {
    if (!dateString) return 'Free Account';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `Expires in ${diffDays} days`;
    } else if (diffDays === 0) {
      return 'Expires today';
    } else {
      return 'Expired';
    }
  };

  // Calculate progress percentage based on current level
  const calculateProgress = () => {
    const maxLevel = 29; // Assuming max level is 10
    return Math.min((currentLevel / maxLevel) * 100, 100);
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="app sat-app">
      {/* Navigation - Same as App page */}
      <nav className="navbar sat-navbar">
        <div className="nav-container">
          {/* Logo on leftmost side */}
          <div className="logo sat-logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          {/* Navigation links and Logout button on rightmost side */}
          <div className="nav-links sat-nav-links">
            <Link to="/" className="nav-link sat-nav-link community-link">
              Home
            </Link>
            <Link to="/courses" className="nav-link sat-nav-link courses-link">
              Courses
            </Link>
            <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link">
              RoadMap
            </Link>
            <Link to="/mock-practice" className="nav-link sat-nav-link mock-practice-link">
              Mocks
            </Link>
            <Link to="/game" className="nav-link sat-nav-link game-link">
              Game
            </Link>
            <Link to="/blogs" className="nav-link sat-nav-link blogs-link">
              Blogs
            </Link>
            
            {/* Logout Button instead of Account */}
            <button 
              onClick={handleLogout}
              className="nav-link sat-nav-link community-link logout-button"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <LogoutIcon style={{ fontSize: '1.3rem', marginRight: '0.2rem' }} />
              Logout
            </button>
          </div>
          
          {/* Mobile menu toggle */}
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu">
          <div className="mobile-menu-content">
            <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/courses" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Courses
            </Link>
            <Link to="/roadmap" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              RoadMap
            </Link>
            <Link to="/community" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Community
            </Link>
            <Link to="/mock-practice" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Mock Practice
            </Link>
            <Link to="/game" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Game
            </Link>
            <Link to="/blogs" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Blogs
            </Link>
            <button 
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="mobile-menu-link"
            >
              <LogoutIcon style={{ fontSize: '1.4rem', marginRight: '0.4rem' }} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Profile Content */}
      <div className="profile-container">
        <div className="profile-content">
          {/* Left Column - Profile Info */}
          <div className="profile-left-column">
            <div className="profile-card">
              <div className="profile-header-section">
                <div className="profile-avatar">
                  {userData?.profile_picture ? (
                    <img src={userData.profile_picture} alt={userData.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {userData?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="profile-basic-info">
                  <h2>{userData?.full_name || userData?.username}</h2>
                  <p className="profile-email">{userData?.email}</p>
                  <div className="account-badge">
                    <span className={`badge ${userData?.account_type}`}>
                      {userData?.account_type?.toUpperCase()}
                    </span>
                    <span className={`status-badge ${userData?.status}`}>
                      {userData?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">Current Level</span>
                  <span className="detail-value">
                    {loadingRoadmap ? (
                      <span style={{ color: '#4A7C59' }}>Loading...</span>
                    ) : (
                      <span style={{ 
                        color: '#4A7C59', 
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}>
                        Level {currentLevel}
                      </span>
                    )}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">
                    {formatDate(userData?.created_at)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Last Login</span>
                  <span className="detail-value">
                    {formatDate(userData?.last_login)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Account Status</span>
                  <span className="detail-value">
                    <span className={`status-indicator ${userData?.status}`}>
                      ●
                    </span>
                    {userData?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Subscription</span>
                  <span className="detail-value">
                    {formatSubscriptionDate(userData?.subscription_expiry)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email Verified</span>
                  <span className="detail-value">
                    {userData?.is_verified ? '✅ Verified' : '❌ Not Verified'}
                  </span>
                </div>
              </div>
            </div>

            <div className="study-plan-card">
              <h3>Study Plan Progress</h3>
              <div className="plan-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {loadingRoadmap ? 'Loading...' : `${Math.round(calculateProgress())}% Complete (Level ${currentLevel})`}
                </span>
              </div>
              <div className="plan-details">
                <p>Next level: Level {currentLevel + 1}</p>
                <p>Focus area: Continue with roadmap progression</p>
              </div>
              <button 
                className="plan-button"
                onClick={() => navigate('/roadmap')}
              >
                View Roadmap
              </button>
            </div>
          </div>

          {/* Right Column - Stats & Activities */}
          <div className="profile-right-column">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon practice">
                  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3>{loadingRoadmap ? '...' : stats.practiceTests}</h3>
                <p>Practice Tests Completed</p>
                
              </div>

              <div className="stat-card">
                <div className="stat-icon score">
                  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3>{loadingRoadmap ? '...' : stats.averageScore}</h3>
                <p>Average SAT Score</p>
                {!loadingRoadmap && currentLevel > 0 && (
                  <p style={{ fontSize: '12px', color: '#4A7C59', marginTop: '5px' }}>
                  </p>
                )}
              </div>

              <div className="stat-card">
                <div className="stat-icon hours">
                  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3>{loadingRoadmap ? '...' : stats.studyHours}</h3>
                <p>Study Hours</p>
                {!loadingRoadmap && currentLevel > 0 && (
                  <p style={{ fontSize: '12px', color: '#4A7C59', marginTop: '5px' }}>
                  </p>
                )}
              </div>

              <div className="stat-card">
                <div className="stat-icon improvement">
                  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
                <h3>{loadingRoadmap ? '...' : `+${stats.improvement}`}</h3>
                <p>Score Improvement</p>
                {!loadingRoadmap && currentLevel > 0 && (
                  <p style={{ fontSize: '12px', color: '#4A7C59', marginTop: '5px' }}>
                  </p>
                )}
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {currentLevel > 0 ? (
                  <>
                    <div className="activity-item">
                      <div className="activity-icon completed">
                        <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="activity-content">
                        <p>Reached Level {currentLevel} in Roadmap</p>
                        <span className="activity-time">Latest achievement</span>
                      </div>
                      <span className="activity-score">Level up!</span>
                    </div>

                    <div className="activity-item">
                      <div className="activity-icon study">
                        <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                      </svg>
                      </div>
                      <div className="activity-content">
                        <p>Completed {stats.practiceTests} practice tests</p>
                        <span className="activity-time">Total practice</span>
                      </div>
                      <span className="activity-time">{stats.studyHours} hrs</span>
                    </div>

                    <div className="activity-item">
                      <div className="activity-icon quiz">
                        <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="activity-content">
                        <p>Score improved by +{stats.improvement} points</p>
                        <span className="activity-time">Overall progress</span>
                      </div>
                      <span className="activity-score">+{stats.improvement}</span>
                    </div>
                  </>
                ) : (
                  <div className="activity-item">
                    <div className="activity-icon study">
                      <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    </div>
                    <div className="activity-content">
                      <p>Start your learning journey!</p>
                      <span className="activity-time">No activity yet</span>
                    </div>
                    <span className="activity-time">0</span>
                  </div>
                )}
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button 
                  className="quick-action-button"
                  onClick={() => navigate('/mock-practice')}
                >
                  <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  New Practice Test
                </button>
                <button 
                  className="quick-action-button"
                  onClick={() => navigate('/roadmap')}
                >
                  <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  View Roadmap
                </button>
                <button 
                  className="quick-action-button"
                  onClick={() => navigate('/courses')}
                >
                  <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Study Courses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
