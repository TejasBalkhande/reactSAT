import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import './courses_playlist.css';
import { FaPenAlt, FaChartBar, FaUniversity, FaBook, FaGamepad, FaUsers } from 'react-icons/fa';

// Import Material-UI icons
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MapIcon from '@mui/icons-material/Map';
import QuizIcon from '@mui/icons-material/Quiz';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArticleIcon from '@mui/icons-material/Article';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CoursesPlaylistScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const playerRef = useRef(null);

  // Course data from route state
  const course = location.state?.course || {
    id: id || 'sat-reading-hacks',
    title: 'SAT Reading Hacks',
    description: 'Master the SAT Reading section with proven hacks, strategies, and time-saving methods.',
    category: 'Reading'
  };

  // Get videos based on course ID
  const getVideosForCourse = (courseId) => {
    switch (courseId) {
      case 'sat-reading-hacks':
        return [
          { id: 'eCmWcSdjt7E', title: 'MUST KNOW SAT Reading Hacks' },
          { id: 'UpCdi13HfBk', title: 'MUST KNOW SAT Punctuation Hacks' },
          { id: 'QLSfV_X3qXE', title: 'MUST KNOW SAT Grammar Hacks' },
          { id: 'lgo1iHUCIUU', title: 'DO THIS with SAT Verb Questions' },
          { id: 'MwCi6n4pOYk', title: 'One Rule Every SAT Student Needs To Know | Independent vs Dependent Clauses' },
          { id: 'vaVdU9hrR3M', title: 'STOP Losing SAT Points Over This Simple Rule!' },
          { id: 'ZRdsmOq4D5c', title: 'How to FIND the Main Idea | SAT Reading Hacks' },
          { id: 'f5TJdtQ3ZMg', title: 'SAT Reading Hacks' },
          { id: 'xvhccF_tkIE', title: 'SAT English Hacks | Transitions' },
          { id: 'RlvHAqMUzSw', title: 'SAT English Hacks | Words in Context' },
          { id: 'IRR18st6y-g', title: 'EVERY SAT Grammar Rule in 36 minutes' },
          { id: 'BikLpKp0TpQ', title: 'SAT English Hacks | Cross Text Connections' },
          { id: 'iJmdrd4xdzc', title: 'SAT English Hacks | Central Ideas & Details' },
          { id: 'G1QkmrTR1i0', title: 'SAT English Hacks | Rhetorical Synthesis' },
          { id: 'CsBB1CWLvJs', title: 'SAT English Hacks | Command of Evidence Textual' },
          { id: 'ruOYTZfxiqk', title: 'EVERY SAT Punctuation Rule in 37 Minutes' },
          { id: 'iOBMaQ1uYA4', title: 'SAT English Hacks | Dashes' },
          { id: 'QsX_kTiRhBM', title: 'SAT English Hacks | Modifiers' },
          { id: 'mUsOu6GlKbg', title: 'SAT English Hacks | Verbs' },
          { id: 'LtmukMnRDA8', title: 'SAT English Hacks | Pronouns' },
          { id: 'fAHc6HnySgE', title: 'English SAT Hacks | Structure & Purpose' },
          { id: 'HPq_HUZlNqI', title: 'SAT English Hacks | Apostrophes' },
          { id: '01TEb74ggx8', title: 'SAT English Hacks | Commas' },
          { id: 'qwjPSZGGbc8', title: 'SAT English Hacks | Semicolons' },
          { id: 'EtKuBsepc_c', title: 'SAT English Hacks | Graphs' },
          { id: 'd-8NdvsLozQ', title: 'SAT English Hacks | Colons' },
          { id: 'ECkeeyvgiy0', title: 'SAT English Hacks | Inferences' },
        ];

      case 'digital-sat-math-speedruns':
        return [
          { id: 'uY-R7CQqZbc', title: 'Digital SAT Math Speedrun - Perfect Math Scorer!' },
          { id: 'GyspOPMHG_w', title: '800 Math Scorer Speedruns Digital SAT Math Test 2' },
          { id: 's_cmbLwDSWA', title: 'Digital SAT Math Speedrun - Test 3' },
          { id: '4sWmkdzuMYs', title: '1590 SAT Scorer Speedruns Digital SAT Math - Test 4' },
        ];

      case 'digital-sat-reading-writing':
        return [
          { id: 'Q1FOo9irGLg', title: 'Ace the Digital SAT! Reading and Writing Walkthrough' },
          { id: 'ip-MQN3P_yQ', title: 'Digital SAT Reading and Writing Walkthrough 🏆 Test 1' },
          { id: 'mBe2ghoUrPk', title: 'Digital SAT Reading & Writing Walkthrough - Test 3' },
          { id: 'lpbsgEmjde4', title: 'Digital SAT Reading & Writing Walkthrough - Test 4' },
          { id: 'r_0QHkFg8L8', title: 'How to Approach Digital SAT Reading Questions' },
          { id: 'auBQllMiA08', title: 'How to Approach Digital SAT Writing Questions' },
          { id: '1ppKIYbdEk0', title: 'Digital SAT Writing Guide from a Perfect SAT Writing Scorer' },
        ];

      case 'digital-sat-math-tips-tricks':
        return [
          { id: 'oPuJG6AJOlQ', title: '54 SAT Math Tips, 1590 Scorer DSAT 1' },
          { id: 'VGu3mVqnmvg', title: 'Ace the SAT! 54 Math Tips from an 800 Scorer' },
          { id: 'F4QhEz2wL4k', title: '54 SAT Math Tips 800 Math scorer DSAT 3' },
          { id: 'XWwWTqa3y-0', title: 'Score 800 on SAT Math - Use These 54 Tips DSAT 4' },
          { id: 'o9bnJ5hZmbU', title: 'Score 800 on SAT Math - Use These 216 Tips!' },
        ];

      default:
        return [
          { id: 'uY-R7CQqZbc', title: 'SAT Math Introduction' },
          { id: 'Q1FOo9irGLg', title: 'Algebra Fundamentals' },
          { id: 'oPuJG6AJOlQ', title: 'Advanced Geometry' },
          { id: 'ww_SviZqml8', title: 'Problem Solving Techniques' },
        ];
    }
  };

  const [videos, setVideos] = useState(getVideosForCourse(course.id));

  // YouTube player options
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      fs: 1,
    },
  };

  // Responsive check
  const isMobile = windowWidth < 768;

  // Handle video selection
  const playVideo = (index) => {
    setSelectedIndex(index);
    setPlayerReady(false);
  };

  // Handle YouTube player ready
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    setPlayerReady(true);
  };

  // Handle YouTube state change
  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setPlayerReady(true);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render desktop layout
  const renderDesktopLayout = () => (
    <div className="playlist-desktop-layout">
      <div className="video-player-section">
        <div className="video-player-wrapper">
          <div className="video-player-container">
            <YouTube
              videoId={videos[selectedIndex]?.id}
              opts={opts}
              onReady={onPlayerReady}
              onStateChange={onPlayerStateChange}
              className="youtube-player"
            />
          </div>
        </div>
        <div className="video-info-card">
          <h3 className="video-title">{videos[selectedIndex]?.title}</h3>
          <div className="video-description-scroll">
            <p className="video-description">{course.description}</p>
          </div>
        </div>
      </div>
      
      <div className="playlist-section">
        <div className="playlist-header">
          <h3>Playlist</h3>
          <p>{videos.length} videos</p>
        </div>
        <div className="playlist-items">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className={`playlist-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => playVideo(index)}
            >
              <div className="video-thumbnail">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/default.jpg`}
                  alt={video.title}
                  className="thumbnail-image"
                />
              </div>
              <div className="video-item-info">
                <p className="video-item-title">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render mobile layout
  const renderMobileLayout = () => (
    <div className="playlist-mobile-layout">
      <div className="video-player-wrapper">
        <div className="video-player-container">
          <YouTube
            videoId={videos[selectedIndex]?.id}
            opts={opts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            className="youtube-player"
          />
        </div>
      </div>
      
      <div className="video-info-card">
        <h3 className="video-title">{videos[selectedIndex]?.title}</h3>
        <div className="video-description-scroll">
          <p className="video-description">{course.description}</p>
        </div>
      </div>
      
      <div className="playlist-section">
        <div className="playlist-header">
          <h3>Playlist</h3>
          <p>{videos.length} videos</p>
        </div>
        <div className="playlist-items">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className={`playlist-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => playVideo(index)}
            >
              <div className="video-thumbnail">
                <img
                  src={`https://i.ytimg.com/vi/${video.id}/default.jpg`}
                  alt={video.title}
                  className="thumbnail-image"
                />
              </div>
              <div className="video-item-info">
                <p className="video-item-title">{video.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="courses-playlist-screen">
      {/* Navigation - Matching App Page */}
      <nav className="navbar sat-navbar">
        <div className="nav-container">
          {/* Back button and logo on left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            <div className="logo sat-logo">
              <img src="/logo.png" alt="Logo" className="logo-img" />
              <span className="logo-text">Mock SAT Exam</span>
            </div>
          </div>
          
          {/* Navigation links - hidden on mobile */}
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu">
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
            <Link to="/login" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Account
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="playlist-content">
        <div className="course-header">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
        
        {isMobile ? renderMobileLayout() : renderDesktopLayout()}
      </main>

      {/* Material Icons */}
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
};

export default CoursesPlaylistScreen;