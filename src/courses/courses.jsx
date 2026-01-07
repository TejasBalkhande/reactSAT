import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './courses.css';

// Import Material-UI icons
import HomeIcon from '@mui/icons-material/Home';
import ArticleIcon from '@mui/icons-material/Article';
import GroupsIcon from '@mui/icons-material/Groups';

// CourseCard component
const CourseCard = ({ course, isMobile, isTablet, isDesktop, isSkinnyMobile, navigate }) => {
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Math': return 'calculate';
      case 'Reading': return 'menu_book';
      case 'Reading & Writing': return 'edit_note';
      default: return 'school';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Math': return '#1976d2';
      case 'Reading': return '#2e7d32';
      case 'Reading & Writing': return '#7b1fa2';
      default: return '#4A7C59';
    }
  };

  const categoryColor = getCategoryColor(course.category);
  const categoryIcon = getCategoryIcon(course.category);

  // Determine responsive values
  const getContentPadding = () => {
    if (isSkinnyMobile) return '10px';
    if (isMobile) return '12px';
    return '16px';
  };

  const getTitleFontSize = () => {
    if (isSkinnyMobile) return '12px';
    if (isMobile) return '14px';
    return '16px';
  };

  const getDescriptionFontSize = () => {
    if (isSkinnyMobile) return '10px';
    if (isMobile) return '11px';
    return '12px';
  };

  const getDescriptionMaxLines = () => {
    if (isSkinnyMobile) return 2;
    if (isMobile) return 2;
    return 3;
  };

  const getIconSize = () => {
    if (isSkinnyMobile) return '12px';
    if (isMobile) return '14px';
    return '16px';
  };

  const getStatsFontSize = () => {
    if (isSkinnyMobile) return '9px';
    if (isMobile) return '10px';
    return '12px';
  };

  const getBadgePadding = () => {
    if (isSkinnyMobile) return '2px 5px';
    if (isMobile) return '3px 6px';
    return '4px 8px';
  };

  const getBadgeFontSize = () => {
    if (isSkinnyMobile) return '8px';
    if (isMobile) return '9px';
    return '10px';
  };

  const getRatingIconSize = () => {
    if (isSkinnyMobile) return '11px';
    if (isMobile) return '12px';
    return '14px';
  };

  const getRatingFontSize = () => {
    if (isSkinnyMobile) return '9px';
    if (isMobile) return '10px';
    return '12px';
  };

  const getButtonPadding = () => {
    if (isSkinnyMobile) return '8px';
    if (isMobile) return '10px';
    return '12px';
  };

  const getButtonIconSize = () => {
    if (isSkinnyMobile) return '14px';
    if (isMobile) return '16px';
    return '18px';
  };

  const getButtonFontSize = () => {
    if (isSkinnyMobile) return '11px';
    if (isMobile) return '12px';
    return '14px';
  };

  return (
    <div className="course-card">
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
        <div className="category-badge" style={{ backgroundColor: categoryColor }}>
          <span className="material-icons" style={{ fontSize: isSkinnyMobile || isMobile ? '12px' : '14px' }}>
            {categoryIcon}
          </span>
          <span style={{ 
            fontSize: (isSkinnyMobile || isMobile) ? '10px' : '12px',
            fontWeight: '600'
          }}>
            {course.category}
          </span>
        </div>
        
        {/* Premium badge */}
        {course.isPremium && (
          <div className="premium-badge">
            <span className="material-icons" style={{ fontSize: isSkinnyMobile || isMobile ? '12px' : '14px' }}>
              lock
            </span>
            <span style={{ 
              fontSize: (isSkinnyMobile || isMobile) ? '10px' : '12px',
              fontWeight: 'bold'
            }}>
              PRO
            </span>
          </div>
        )}
        
        {/* Play button overlay */}
        <div className="play-button-overlay">
          <div className="play-button">
            <span className="material-icons" style={{ 
              fontSize: (isSkinnyMobile || isMobile) ? '24px' : '30px',
              color: '#4A7C59'
            }}>
              play_arrow
            </span>
          </div>
        </div>
      </div>
      
      {/* Course content */}
      <div className="course-content" style={{ padding: getContentPadding() }}>
        {/* Title */}
        <h3 className="course-title" style={{ fontSize: getTitleFontSize() }}>
          {course.title}
        </h3>
        
        {/* Description */}
        <p className="course-description" style={{ 
          fontSize: getDescriptionFontSize(),
          WebkitLineClamp: getDescriptionMaxLines()
        }}>
          {course.description}
        </p>
        
        {/* Stats row */}
        <div className="course-stats">
          <div className="stat-item">
            <span className="material-icons" style={{ fontSize: getIconSize() }}>
              access_time
            </span>
            <span style={{ fontSize: getStatsFontSize() }}>{course.duration}</span>
          </div>
          <div className="stat-item">
            <span className="material-icons" style={{ fontSize: getIconSize() }}>
              video_library
            </span>
            <span style={{ fontSize: getStatsFontSize() }}>{course.videoCount} videos</span>
          </div>
        </div>
        
        {/* Level and rating row */}
        {!isSkinnyMobile && (
          <div className="course-meta">
            <div className="level-badge" style={{ 
              padding: getBadgePadding(),
              fontSize: getBadgeFontSize()
            }}>
              {course.level}
            </div>
            <div className="rating">
              <span className="material-icons" style={{ 
                fontSize: getRatingIconSize(),
                color: '#ffb300'
              }}>
                star
              </span>
              <span style={{ fontSize: getRatingFontSize() }}>{course.rating}</span>
            </div>
          </div>
        )}
        
        {/* Action button */}
        <button 
          className="start-course-btn"
          style={{ 
            backgroundColor: course.isPremium ? '#ff8f00' : '#4A7C59',
            padding: `${getButtonPadding()} 0`,
            fontSize: getButtonFontSize()
          }}
          onClick={() => navigate(`/courses/${course.id}`, { state: { course } })}
        >
          <span className="material-icons" style={{ fontSize: getButtonIconSize() }}>
            play_arrow
          </span>
          <span>{course.isPremium ? 'Start Pro Course' : 'Start Course'}</span>
        </button>
      </div>
    </div>
  );
};

// Main CoursesScreen component
const CoursesScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Course data
  const courses = [
    {
      id: 'sat-reading-hacks',
      title: 'Must-Know SAT Reading Hacks',
      description: 'Master the SAT Reading section with proven hacks, strategies, and time-saving methods. Learn how to approach passages, eliminate wrong answers, and maximize your reading score.',
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
      description: 'Master SAT Math with lightning-fast problem-solving techniques. Learn to solve complex math problems quickly and accurately under time pressure.',
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
      description: 'Comprehensive guide to mastering the Reading and Writing section of the Digital SAT. Build critical reading skills and writing proficiency.',
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
      description: 'Learn powerful shortcuts, insider tips, and proven strategies to excel in SAT Math. Perfect for students looking to boost their math scores significantly.',
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

  // Get user data from location state
  const userData = location.state?.userData;
  const loggedIn = userData != null;

  // Responsive breakpoints
  const isSkinnyMobile = windowWidth < 400;
  const isMobile = windowWidth >= 400 && windowWidth < 600;
  const isTablet = windowWidth >= 600 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Grid configuration
  const getCrossAxisCount = () => {
    if (isDesktop) return 4;
    if (isTablet) return 2;
    return 1;
  };

  const getChildAspectRatio = () => {
    if (isDesktop) return 0.75;
    if (isTablet) return 0.85;
    if (isMobile) return 1.1;
    return 1.1;
  };

  // Window resize effect
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation buttons
  const NavButton = ({ title, icon, route }) => (
    <button className="nav-button" onClick={() => navigate(route)}>
      <span className="material-icons">{icon}</span>
      <span>{title}</span>
    </button>
  );

  const AccountButton = () => (
    <button 
      className="account-button"
      onClick={() => navigate(loggedIn ? '/profile' : '/login', { state: { userData } })}
    >
      <span className="material-icons">account_circle</span>
      <span>Account</span>
    </button>
  );

  return (
    <div className="courses-screen">
      {/* App.jsx Navbar - INTEGRATED */}
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
            <Link to="/mock-practice" className="nav-link sat-nav-link mock-practice-link">
              Mocks
            </Link>
            <Link to="/game" className="nav-link sat-nav-link game-link">
              Game
            </Link>
            <Link to="/blogs" className="nav-link sat-nav-link blogs-link">
              Blogs
            </Link>
            <Link to="/community" className="nav-link sat-nav-link community-link">
              Community
            </Link>
            {/* UPDATED ACCOUNT BUTTON */}
            <Link to="/login" className="nav-link sat-nav-link community-link">
              Account
            </Link>
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
        <div 
          className="courses-grid"
          style={{
            '--grid-columns': getCrossAxisCount(),
            '--grid-ratio': getChildAspectRatio()
          }}
        >
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isMobile={isMobile}
              isTablet={isTablet}
              isDesktop={isDesktop}
              isSkinnyMobile={isSkinnyMobile}
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

      {/* Mobile Menu - FROM App.jsx */}
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu">
          <div className="mobile-menu-content">
            <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <HomeIcon />
              Home
            </Link>
            <Link to="/courses" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span className="material-icons">play_circle_fill</span>
              Courses
            </Link>
            <Link to="/roadmap" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span className="material-icons">add_road</span>
              RoadMap
            </Link>
            <Link to="/community" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <GroupsIcon />
              Community
            </Link>
            <Link to="/mock-practice" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span className="material-icons">assignment</span>
              Mock Practice
            </Link>
            <Link to="/game" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span className="material-icons">sports_esports</span>
              Game
            </Link>
            <Link to="/blogs" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <ArticleIcon />
              Blogs
            </Link>
            <Link to="/login" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <span className="material-icons">account_circle</span>
              Account
            </Link>
          </div>
        </div>
      )}

      {/* Material Icons */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
};

export default CoursesScreen;