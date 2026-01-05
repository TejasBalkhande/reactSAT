// App.jsx - UPDATED BLOG SLIDER WITH 3 POSTS ON SCREEN AND CENTERED MOBILE VIEW
import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { 
  FaPenAlt, 
  FaChartBar, 
  FaUniversity, 
  FaBook, 
  FaGamepad, 
  FaUsers 
} from 'react-icons/fa';
import './App.css'

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
  
  // Blog Slider States - UPDATED FOR 3 POSTS
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slidesToShow, setSlidesToShow] = useState(3)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const sliderRef = useRef(null)
  const autoPlayRef = useRef(null)
  const containerRef = useRef(null)

  // Use navigate for routing
  const navigate = useNavigate()

  // Calculate total slides based on 3 posts visible
  const totalSlides = blogPosts.length
  const maxSlide = Math.max(0, totalSlides - slidesToShow)

  useEffect(() => {
    // Mock blog posts data
    const mockBlogPosts = [
      {
        id: 1,
        title: 'SAT Math Tips: How to Master Algebra',
        description: 'Learn the key strategies to solve algebra problems quickly and accurately. Our comprehensive guide covers everything from basic equations to complex word problems.',
        date: '2024-03-15',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 2,
        title: 'Reading Comprehension Strategies for High Scores',
        description: 'Boost your reading score with these proven techniques. Learn how to analyze passages efficiently and answer questions confidently.',
        date: '2024-03-10',
        image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 3,
        title: 'Time Management for SAT Success',
        description: 'Learn how to pace yourself during the exam. These time management strategies will help you complete every section with confidence.',
        date: '2024-03-05',
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 4,
        title: 'Grammar Rules You Must Know for Writing Section',
        description: 'Essential writing and language section tips. Master punctuation, sentence structure, and style improvement techniques.',
        date: '2024-02-28',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 5,
        title: 'SAT Vocabulary Building Techniques',
        description: 'Effective ways to expand your vocabulary for the SAT. Learn memory techniques and context-based learning strategies.',
        date: '2024-02-20',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 6,
        title: 'Essay Writing Techniques That Impress',
        description: 'Master the SAT essay with these writing strategies. Learn how to structure your essay and present compelling arguments.',
        date: '2024-02-15',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 7,
        title: 'Overcoming Test Anxiety: A Guide',
        description: 'Practical techniques to manage stress and perform your best on test day. Learn breathing exercises and mental preparation strategies.',
        date: '2024-02-10',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 8,
        title: 'SAT Calculator Strategies for Math Section',
        description: 'Maximize your calculator use with these expert tips. Learn which problems are best solved with calculator assistance.',
        date: '2024-02-05',
        image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80'
      }
    ]

    setBlogPosts(mockBlogPosts)
    setIsLoading(false)

    // Handle responsive slides - UPDATED FOR 3 POSTS
    const updateSlidesToShow = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1) // On mobile, we'll show 3 posts but treat as carousel
      } else if (window.innerWidth < 1200) {
        setSlidesToShow(2)
      } else {
        setSlidesToShow(3) // Show 3 posts on desktop
      }
    }

    updateSlidesToShow()
    window.addEventListener('resize', updateSlidesToShow)

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
    
    // Auto-play slider - UPDATED FOR 3 POSTS
    const startAutoPlay = () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      
      if (isAutoPlaying && slidesToShow < totalSlides) {
        autoPlayRef.current = setInterval(() => {
          nextSlide()
        }, 4000)
      }
    }
    
    startAutoPlay()

    return () => {
      clearInterval(countdownInterval)
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      window.removeEventListener('resize', updateSlidesToShow)
    }
  }, [isAutoPlaying])

  // Update auto-play when slides change
  useEffect(() => {
    if (isAutoPlaying && slidesToShow < totalSlides) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
      autoPlayRef.current = setInterval(() => {
        nextSlide()
      }, 4000)
    }
    
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [currentSlide, isAutoPlaying, slidesToShow, totalSlides])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return `${diff} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Blog Slider Functions - UPDATED FOR 3 POSTS
  const nextSlide = () => {
    setCurrentSlide(prev => {
      if (prev >= maxSlide) {
        return 0 // Loop back to start
      }
      return prev + 1
    })
  }

  const prevSlide = () => {
    setCurrentSlide(prev => {
      if (prev <= 0) {
        return maxSlide // Loop to end
      }
      return prev - 1
    })
  }

  const goToSlide = (index) => {
    setCurrentSlide(Math.min(index, maxSlide))
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  // Calculate translate value for slider - FIXED FOR 3 POSTS
  const getTranslateValue = () => {
    if (slidesToShow === 1) {
      // On mobile, each slide takes full width
      return -currentSlide * 100
    } else if (slidesToShow === 2) {
      // On tablet, each slide takes 50% minus gap
      return -currentSlide * 50
    } else {
      // On desktop, each slide takes 33.33% minus gap
      return -currentSlide * 33.33
    }
  }

  // Handle mobile scroll to center
  const handleMobileScroll = () => {
    if (window.innerWidth < 768 && containerRef.current) {
      const slideWidth = containerRef.current.offsetWidth * 0.75 // 75vw
      const gap = 0.75 * 16 // 0.75rem in pixels
      const scrollPosition = (slideWidth + gap) * currentSlide
      containerRef.current.scrollLeft = scrollPosition
    }
  }

  useEffect(() => {
    handleMobileScroll()
  }, [currentSlide])

  // Function to navigate to StudyPlan
  const handleStartMockTest = () => {
    navigate('/study-plan')
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
            <Link to="/community" className="nav-link sat-nav-link community-link">
              Community
            </Link>
            {/* UPDATED ACCOUNT BUTTON */}
            <button className="signin-btn sat-signin-btn">
              Account
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
            <button className="hero-btn secondary sat-hero-btn-secondary">
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

      {/* UPDATED: Blog Slider Section - SHOW 3 POSTS */}
      <section className="blog-section sat-blog">
        <div className="blog-slider-container">
          <div className="blog-slider-header">
            <div>
              <h2>Latest Blog Posts</h2>
              <p>Stay updated with the latest SAT prep tips and strategies</p>
            </div>
            <div className="blog-slider-nav">
              <button 
                className="blog-slider-btn" 
                onClick={prevSlide}
                disabled={currentSlide === 0 && maxSlide > 0}
                aria-label="Previous slide"
              >
                <ArrowBackIosIcon style={{ fontSize: '18px' }} />
              </button>
              <button 
                className="blog-slider-btn" 
                onClick={nextSlide}
                disabled={currentSlide >= maxSlide && maxSlide > 0}
                aria-label="Next slide"
              >
                <ArrowForwardIosIcon style={{ fontSize: '18px' }} />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {/* Desktop/Tab View (transform slider) */}
              <div className="blog-slider-wrapper" style={{ display: window.innerWidth >= 768 ? 'block' : 'none' }}>
                <div 
                  className="blog-slider" 
                  ref={sliderRef}
                  style={{ transform: `translateX(${getTranslateValue()}%)` }}
                >
                  {blogPosts.map((post) => (
                    <div className="blog-slide" key={post.id}>
                      <div 
                        className="blog-slide-image"
                        style={{ backgroundImage: `url(${post.image})` }}
                      ></div>
                      <div className="blog-slide-content">
                        <h3 className="blog-slide-title">{post.title}</h3>
                        <p className="blog-slide-desc">{post.description}</p>
                        <div className="blog-slide-meta">
                          <span className="blog-slide-date">
                            <CalendarTodayIcon style={{ fontSize: '16px' }} />
                            {formatDate(post.date)}
                          </span>
                          <a href="#" className="blog-read-more">
                            Read More <ArrowForwardIcon style={{ fontSize: '16px' }} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Mobile View (scrollable container with 3 posts centered) */}
              <div 
                className="blog-slider-wrapper" 
                ref={containerRef}
                style={{ 
                  display: window.innerWidth < 768 ? 'block' : 'none',
                  overflowX: 'auto',
                  scrollBehavior: 'smooth'
                }}
              >
                <div className="blog-slider">
                  {blogPosts.map((post, index) => (
                    <div 
                      className="blog-slide" 
                      key={post.id}
                      onClick={() => setCurrentSlide(index)}
                      style={{ 
                        opacity: index >= currentSlide && index < currentSlide + 3 ? 1 : 0.7
                      }}
                    >
                      <div 
                        className="blog-slide-image"
                        style={{ backgroundImage: `url(${post.image})` }}
                      ></div>
                      <div className="blog-slide-content">
                        <h3 className="blog-slide-title">{post.title}</h3>
                        <p className="blog-slide-desc">{post.description}</p>
                        <div className="blog-slide-meta">
                          <span className="blog-slide-date">
                            <CalendarTodayIcon style={{ fontSize: '16px' }} />
                            {formatDate(post.date)}
                          </span>
                          <a href="#" className="blog-read-more">
                            Read More <ArrowForwardIcon style={{ fontSize: '16px' }} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Slider Dots */}
              <div className="blog-slider-dots">
                {Array.from({ length: maxSlide + 1 }).map((_, index) => (
                  <button
                    key={index}
                    className={`blog-slider-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>


      {/* UPDATED RANKING SECTION - SIMPLIFIED FOR MOBILE */}
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
                <div className="stat-value-compact">$500+</div>
                <div className="stat-label-compact">Total Prizes</div>
              </div>
            </div>
            
            <div className="ranking-actions">
              <button className="ranking-cta-compact ranking-cta-primary">
                Join Competition →
              </button>
              <button className="ranking-cta-compact ranking-cta-secondary">
                View Leaderboard
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
              <FaUniversity className="icon" />
            </div>
            <div className="nav-tile-label">Top Colleges</div>
          </div>
          
          <div className="nav-tile sat-nav-tile">
            <div className="nav-tile-icon">
              <FaBook className="icon" />
            </div>
            <div className="nav-tile-label">Prep Resources</div>
          </div>
          
          <div className="nav-tile sat-nav-tile">
            <div className="nav-tile-icon">
              <FaGamepad className="icon" />
            </div>
            <div className="nav-tile-label">SAT Game</div>
          </div>
          
          <div className="nav-tile sat-nav-tile">
            <div className="nav-tile-icon">
              <FaUsers className="icon" />
            </div>
            <div className="nav-tile-label">Community</div>
          </div>
        </div>
      </section>

      {/* Progress Tracker */}
      <section className="progress-section sat-progress">
        <h2>Track Your Progress</h2>
        <p>Sign up to unlock personalized study plans, progress tracking, and score analytics</p>
        <div className="progress-buttons">
          <button className="progress-btn sat-progress-btn">Create Account</button>
          <button className="progress-btn-secondary">Already have an account? Log in</button>
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
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <a href="#">Pricing/Plans</a>
              <a href="#">Study Materials</a>
              <a href="#">FAQs</a>
            </div>
            
            <div className="footer-column">
              <h3>Support</h3>
              <a href="#">Contact Us</a>
              <a href="#">Help Center</a>
              <a href="#">System Status</a>
            </div>
            
            <div className="footer-column">
              <h3>Legal</h3>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-bottom">
            <p>© 2025 SAT Prep Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
            <button className="mobile-signin-btn">
              Account
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/study-plan" element={<StudyPlan />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/courses" element={<div className="page">Courses Page</div>} />
        <Route path="/roadmap" element={<div className="page">RoadMap Page</div>} />
        <Route path="/mock-practice" element={<div className="page">Mock Practice Page</div>} />
        <Route path="/game" element={<div className="page">Game Page</div>} />
        <Route path="/community" element={<div className="page">Community Page</div>} />
        <Route path="/blogs" element={<div className="page">Blogs Page</div>} />
      </Routes>
    </Router>
  )
}

export default App