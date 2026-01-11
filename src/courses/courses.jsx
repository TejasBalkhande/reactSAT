import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './courses.css';

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

// CourseCard component
const CourseCard = ({ course, navigate }) => {
  const handleCourseClick = () => {
    navigate(`/courses/${course.id}`, { state: { course } });
  };

  return (
    <div className="course-card" onClick={handleCourseClick}>
      {/* Thumbnail section */}
      <div className="course-thumbnail">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="thumbnail-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x225?text=Course+Thumbnail';
          }}
        />
        <div className="thumbnail-overlay"></div>
        
        {/* Category badge */}
        <div className="category-badge">
          <span className="material-icons">
            {course.category === 'Math' ? 'calculate' : 
             course.category === 'Reading' ? 'menu_book' : 'edit_note'}
          </span>
          <span>{course.category}</span>
        </div>
        
        {/* Premium badge */}
        {course.isPremium && (
          <div className="premium-badge">
            <span className="material-icons">lock</span>
            <span>PRO</span>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="play-button-overlay">
          <div className="play-button">
            <span className="material-icons">play_arrow</span>
          </div>
        </div>
      </div>
      
      {/* Course content */}
      <div className="course-content">
        {/* Title */}
        <h3 className="course-title">{course.title}</h3>
        
        {/* Description */}
        <p className="course-description">{course.description}</p>
        
        {/* Stats row */}
        <div className="course-stats">
          <div className="stat-item">
            <span className="material-icons">access_time</span>
            <span>{course.duration}</span>
          </div>
          <div className="stat-item">
            <span className="material-icons">video_library</span>
            <span>{course.videoCount} videos</span>
          </div>
        </div>
        
        {/* Level and rating row */}
        <div className="course-meta">
          <div className="level-badge">{course.level}</div>
          <div className="rating">
            <span className="material-icons">star</span>
            <span>{course.rating}</span>
          </div>
        </div>
        
        {/* Action button */}
        <button className="start-course-btn">
          <span className="material-icons">play_arrow</span>
          <span>{course.isPremium ? 'Start Pro Course' : 'Start Course'}</span>
        </button>
      </div>
    </div>
  );
};

// Main CoursesScreen component
const CoursesScreen = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Course data
  const courses = [
    {
      id: 'sat-reading-hacks',
      title: 'Must-Know SAT Reading Hacks',
      description: 'Master the SAT Reading section with proven hacks, strategies, and time-saving methods.',
      playlistUrl: 'https://www.youtube.com/watch?v=eCmWcSdjt7E&list=PLXmJvdMwHZJ-reading-hacks',
      playlistId: 'PLXmJvdMwHZJ-reading-hacks',
      thumbnail: 'https://i.ytimg.com/vi/eCmWcSdjt7E/maxresdefault.jpg',
      duration: '15+ hours',
      videoCount: 28,
      level: 'All Levels',
      category: 'Reading',
      topics: [
        'Active Reading Techniques',
        'Answer Elimination',
        'Passage Mapping',
        'Time Management',
        'Evidence-Based Questions',
        'Trap Answer Avoidance'
      ],
      features: [
        'Step-by-step passage breakdown',
        'High-yield strategies',
        'Proven time-saving hacks',
        'Common mistake analysis',
        'Score-boosting methods'
      ],
      isPremium: false,
      rating: 4.8,
      enrolled: 16240,
    },
    {
      id: 'digital-sat-math-speedruns',
      title: 'Digital SAT Math Speedruns',
      description: 'Master SAT Math with lightning-fast problem-solving techniques under time pressure.',
      playlistUrl: 'https://www.youtube.com/watch?v=uY-R7CQqZbc&list=PLXmJvdMwHZJ-6Mr5PjwFHk9iyj1Z81eux',
      playlistId: 'PLXmJvdMwHZJ-6Mr5PjwFHk9iyj1Z81eux',
      thumbnail: 'https://i.ytimg.com/vi/uY-R7CQqZbc/maxresdefault.jpg',
      duration: '25+ hours',
      videoCount: 50,
      level: 'Intermediate to Advanced',
      category: 'Math',
      topics: [
        'Algebra and Linear Equations',
        'Advanced Math Concepts',
        'Problem-Solving Strategies',
        'Geometry and Trigonometry',
        'Time Management Techniques',
        'Calculator and Non-Calculator sections'
      ],
      features: [
        'Step-by-step solutions',
        'Speed solving techniques',
        'Common mistake analysis',
        'Practice problems included',
        'Exam strategies'
      ],
      isPremium: false,
      rating: 4.8,
      enrolled: 15420,
    },
    {
      id: 'digital-sat-reading-writing',
      title: 'Digital SAT Reading and Writing',
      description: 'Comprehensive guide to mastering the Reading and Writing section of the Digital SAT.',
      playlistUrl: 'https://www.youtube.com/watch?v=Q1FOo9irGLg&list=PLXmJvdMwHZJ_S9vTPh3MjYhSPD5kD2Dks',
      playlistId: 'PLXmJvdMwHZJ_S9vTPh3MjYhSPD5kD2Dks',
      thumbnail: 'https://i.ytimg.com/vi/Q1FOo9irGLg/maxresdefault.jpg',
      duration: '30+ hours',
      videoCount: 45,
      level: 'Beginner to Advanced',
      category: 'Reading & Writing',
      topics: [
        'Reading Comprehension',
        'Vocabulary in Context',
        'Grammar and Usage',
        'Rhetorical Skills',
        'Text Analysis',
        'Writing Strategies'
      ],
      features: [
        'Passage analysis techniques',
        'Grammar rules explained',
        'Writing improvement tips',
        'Practice exercises',
        'Error identification strategies'
      ],
      isPremium: false,
      rating: 4.7,
      enrolled: 12350,
    },
    {
      id: 'digital-sat-math-tips-tricks',
      title: 'Digital SAT Math Tricks, and Strategies',
      description: 'Learn powerful shortcuts, insider tips, and proven strategies to excel in SAT Math.',
      playlistUrl: 'https://www.youtube.com/watch?v=oPuJG6AJOlQ&list=PLXmJvdMwHZJ-ho5po_VE-PNiCCJ_Xwavk',
      playlistId: 'PLXmJvdMwHZJ-ho5po_VE-PNiCCJ_Xwavk',
      thumbnail: 'https://i.ytimg.com/vi/oPuJG6AJOlQ/maxresdefault.jpg',
      duration: '20+ hours',
      videoCount: 35,
      level: 'All Levels',
      category: 'Math',
      topics: [
        'Mental Math Techniques',
        'Formula Shortcuts',
        'Pattern Recognition',
        'Elimination Strategies',
        'Time-Saving Methods',
        'Common Trap Questions'
      ],
      features: [
        'Quick calculation methods',
        'Memory techniques',
        'Strategy selection',
        'Error avoidance tips',
        'Score improvement focus'
      ],
      isPremium: false,
      rating: 4.9,
      enrolled: 18750,
    },
  ];

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle Account button click
  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="courses-screen">
      {/* Navigation - Using the same navbar from App.jsx */}
      <nav className="navbar sat-navbar">
        <div className="nav-container">
          {/* Logo on leftmost side */}
          <div className="logo sat-logo" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          {/* Navigation links and Account button on rightmost side */}
          <div className="nav-links sat-nav-links">
            <Link to="/" className="nav-link sat-nav-link courses-link">
              Home
            </Link>
            <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link">
              RoadMap
            </Link>
            <Link to="/digital-sat-practice-questions" className="nav-link sat-nav-link mock-practice-link">
              Mocks
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

      {/* Main content */}
      <main className="courses-content">
        {/* Header section */}
        <div className="courses-header">
          <h2>SAT Preparation Courses</h2>
          <p>
            Master the SAT with our comprehensive video courses. 
            Learn proven strategies and techniques from expert instructors.
          </p>
        </div>

        {/* Courses grid */}
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              navigate={navigate}
            />
          ))}
        </div>

        {/* Footer info */}
        <div className="courses-footer">
          <div className="footer-header">
            <span className="material-icons">info_outline</span>
            <h3>Course Information</h3>
          </div>
          <ul>
            <li>All courses are available for free on YouTube</li>
            <li>New videos added regularly</li>
            <li>Structured learning path for optimal results</li>
            <li>Expert instructors with proven track records</li>
            <li>Practice problems and real exam strategies</li>
          </ul>
        </div>
      </main>

      {/* Mobile Menu - Same as App.jsx */}
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu">
          {/* Header section with logo */}
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <span className="mobile-logo-text">Mock SAT Exam</span>
            </div>
            <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
          </div>
          
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/roadmap" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
               RoadMap
            </Link>
            <Link to="/digital-sat-practice-questions" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
               Mocks
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

      {/* Material Icons */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
};

export default CoursesScreen;