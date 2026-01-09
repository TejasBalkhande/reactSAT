import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './StudyPlan.css';
import {
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
  FaChevronLeft,
  FaCalendarAlt,
  FaLock,
  FaLockOpen,
  FaCalculator,
  FaBookReader,
  FaCheck,
  FaClock
} from 'react-icons/fa';

// Import Material-UI icons for navbar
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MapIcon from '@mui/icons-material/Map';
import QuizIcon from '@mui/icons-material/Quiz';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArticleIcon from '@mui/icons-material/Article';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';

const StudyPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mockTestsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSelectTopicWarning, setShowSelectTopicWarning] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Navbar state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Domain structure - same as Flutter version
  const domainStructure = {
    'Math': {
      'Advanced Math': {
        'Equivalent Expressions': [
          'Factor algebraic expressions',
          'Simplify rational expressions',
          'Rewrite expressions using exponent rules',
          'Identify equivalent polynomial forms',
          'Simplify radical expressions'
        ],
        'Nonlinear Equations and Systems of Equations': [
          'Solve quadratic equations',
          'Solve exponential equations',
          'Solve radical equations',
          'Solve systems with nonlinear equations',
          'Use substitution/elimination methods'
        ],
        'Nonlinear Functions': [
          'Analyze quadratic functions',
          'Graph exponential functions',
          'Model with logarithmic functions',
          'Interpret function transformations',
          'Analyze polynomial end behavior'
        ]
      },
      'Algebra': {
        'Linear Equations in One Variable': [
          'Solve multi-step equations',
          'Solve equations with variables on both sides',
          'Solve literal equations',
          'Identify equations with no/infinite solutions',
          'Model real-world scenarios'
        ],
        'Linear Equations in Two Variables': [
          'Graph linear equations',
          'Calculate slope from points/graphs',
          'Write equations in slope-intercept form',
          'Convert between equation forms',
          'Interpret slope and intercepts'
        ],
        'Linear Functions': [
          'Evaluate linear functions',
          'Determine domain and range',
          'Identify function characteristics',
          'Compare linear rates of change',
          'Model with linear functions'
        ],
        'Linear Inequalities': [
          'Solve/graph one-variable inequalities',
          'Solve compound inequalities',
          'Graph two-variable inequalities',
          'Solve systems of inequalities',
          'Interpret inequality solutions'
        ],
        'Systems of Linear Equations': [
          'Solve by graphing',
          'Solve by substitution',
          'Solve by elimination',
          'Classify dependent/independent systems',
          'Model real-world systems'
        ]
      },
      'Problem-Solving and Data Analysis': {
        'Observational Studies and Experiments': [
          'Distinguish study types',
          'Identify sampling methods',
          'Recognize bias in data collection',
          'Design controlled experiments',
          'Interpret study conclusions'
        ],
        'One-Variable Data': [
          'Calculate measures of center (mean, median)',
          'Calculate measures of spread (range, IQR)',
          'Interpret box plots/histograms',
          'Identify distribution shapes',
          'Analyze skewed distributions'
        ],
        'Percentages': [
          'Calculate percent change',
          'Solve markup/discount problems',
          'Solve compound interest problems',
          'Analyze proportional relationships',
          'Interpret percentage points'
        ],
        'Probability': [
          'Calculate theoretical probabilities',
          'Calculate experimental probabilities',
          'Apply counting principles',
          'Analyze compound events',
          'Use conditional probability'
        ],
        'Ratios, Rates, Proportions, and Units': [
          'Convert measurement units',
          'Calculate unit rates',
          'Solve proportion problems',
          'Analyze scale drawings/maps',
          'Solve dimensional analysis problems'
        ],
        'Sample Statistics and Margin of Error': [
          'Interpret confidence intervals',
          'Calculate margin of error',
          'Analyze sampling distributions',
          'Determine required sample sizes',
          'Interpret statistical significance'
        ],
        'Two-Variable Data': [
          'Interpret scatterplots',
          'Calculate correlation coefficients',
          'Determine regression lines',
          'Analyze residual plots',
          'Distinguish correlation vs causation'
        ]
      },
      'Geometry and Trigonometry': {
        'Area and Volume': [
          'Calculate area of polygons',
          'Calculate surface area of 3D shapes',
          'Calculate volume of prisms/pyramids',
          'Apply area/volume formulas to real-world problems',
          'Solve problems with composite shapes'
        ],
        'Circles': [
          'Apply circle theorems',
          'Calculate circumference/arc length',
          'Calculate area of circles/sectors',
          'Solve problems with tangent lines',
          'Find equations of circles'
        ],
        'Lines, Angles, and Triangles': [
          'Classify angle types',
          'Apply angle relationships (vertical, adjacent)',
          'Use triangle congruence theorems',
          'Apply similarity principles',
          'Use parallel/perpendicular line properties'
        ],
        'Right Triangles and Trigonometry': [
          'Apply Pythagorean theorem',
          'Solve special right triangles (30-60-90, 45-45-90)',
          'Use trigonometric ratios (SOHCAHTOA)',
          'Solve trigonometric equations',
          'Apply laws of sines/cosines'
        ]
      },
    },
    'Reading and Writing': {
      'Craft and Structure': {
        'Words in Context': [
          'Context clues',
          'Word choice analysis',
          'Tone interpretation',
          'Meaning of words/phrases in context',
          'Connotation and denotation',
        ],
        'Text Structure and Purpose': [
          'Author\'s purpose',
          'Text structure',
          'Persuasive techniques',
          'Evaluate argument effectiveness',
          'Analyze stylistic devices',
        ],
        'Cross-text Connections': [
          'Compare viewpoints',
          'Analyze arguments',
          'Synthesize information',
          'Understand relationships between paired passages',
        ],
      },
      'Information and Ideas': {
        'Central Ideas and Details': [
          'Main idea identification',
          'Theme analysis',
          'Summary creation',
          'Identify relationships between ideas',
        ],
        'Command of Evidence': [
          'Textual support',
          'Graphical support',
          'Evidence evaluation',
          'Use evidence to support claims',
          'Distinguish relevant from irrelevant evidence',
        ],
        'Inferences': [
          'Making logical inferences',
          'Drawing conclusions from text',
          'Inferring implied meanings',
          'Predicting outcomes based on text',
        ],
      },
      'Expression of Ideas': {
        'Transitions': [
          'Effective transitions',
          'Logical connection between ideas',
          'Using transitional words and phrases',
          'Coherence between sentences and paragraphs',
        ],
        'Rhetorical Synthesis': [
          'Combining information from multiple sources',
          'Creating coherent sentences/paragraphs',
          'Synthesizing ideas',
          'Selecting relevant information',
        ],
      },
      'Standard English Conventions': {
        'Boundaries': [
          'Avoid run-ons and fragments',
          'Correct comma usage',
          'Correct semicolon/colon usage',
          'Appropriate sentence separation',
        ],
        'Form, Structure, and Sense': [
          'Subject-verb agreement',
          'Pronoun usage',
          'Verb tense consistency',
          'Modifier placement',
          'Parallel structure',
        ],
      },
    },
  };

  // State for selections
  const [selectedTopics, setSelectedTopics] = useState({});
  const [topicExpanded, setTopicExpanded] = useState({});
  const [subdomainExpanded, setSubdomainExpanded] = useState({});
  const [domainSelectionState, setDomainSelectionState] = useState({});
  const [subdomainSelectionState, setSubdomainSelectionState] = useState({});
  
  // Countdown state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    nextEvent: null
  });

  // Mock user data (replace with actual auth)
  const userData = { isPremium: false };
  const loggedIn = false;

  // Initialize selection maps
  useEffect(() => {
    const initMaps = () => {
      const newSelectedTopics = {};
      const newTopicExpanded = {};
      const newSubdomainExpanded = {};
      const newDomainSelectionState = {};
      const newSubdomainSelectionState = {};

      Object.keys(domainStructure).forEach(domain => {
        newSelectedTopics[domain] = {};
        newTopicExpanded[domain] = {};
        newSubdomainExpanded[domain] = {};
        newSubdomainSelectionState[domain] = {};
        newDomainSelectionState[domain] = false;

        Object.keys(domainStructure[domain]).forEach(subdomain => {
          newSelectedTopics[domain][subdomain] = {};
          newTopicExpanded[domain][subdomain] = {};
          newSubdomainExpanded[domain][subdomain] = false;
          newSubdomainSelectionState[domain][subdomain] = false;

          Object.keys(domainStructure[domain][subdomain]).forEach(topic => {
            newSelectedTopics[domain][subdomain][topic] = false;
            newTopicExpanded[domain][subdomain][topic] = false;
          });
        });
      });

      setSelectedTopics(newSelectedTopics);
      setTopicExpanded(newTopicExpanded);
      setSubdomainExpanded(newSubdomainExpanded);
      setDomainSelectionState(newDomainSelectionState);
      setSubdomainSelectionState(newSubdomainSelectionState);
    };

    initMaps();
  }, []);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Countdown timer
  useEffect(() => {
    const calculateNextEvent = () => {
      const now = new Date();
      const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
      const nextEvent = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + daysUntilSaturday,
        8
      );
      return nextEvent;
    };

    const updateCountdown = () => {
      const nextEvent = calculateNextEvent();
      const now = new Date();
      const diff = nextEvent - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({
          days,
          hours,
          minutes,
          seconds,
          nextEvent
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  // Scroll to mock tests if needed
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scrollToMockTests = params.get('scrollToMockTests');
    
    if (scrollToMockTests === 'true' && mockTestsRef.current) {
      setTimeout(() => {
        mockTestsRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [location]);

  // Helper functions
  const updateSubdomainSelectionState = (domain, subdomain) => {
    const topics = selectedTopics[domain][subdomain];
    const selectedCount = Object.values(topics).filter(v => v).length;
    const totalCount = Object.keys(topics).length;

    let state;
    if (selectedCount === 0) state = false;
    else if (selectedCount === totalCount) state = true;
    else state = null;

    setSubdomainSelectionState(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [subdomain]: state
      }
    }));
  };

  const updateDomainSelectionState = (domain) => {
    let totalTopics = 0;
    let selectedTopicsCount = 0;

    Object.keys(selectedTopics[domain] || {}).forEach(subdomain => {
      Object.keys(selectedTopics[domain][subdomain] || {}).forEach(topic => {
        totalTopics++;
        if (selectedTopics[domain][subdomain][topic]) {
          selectedTopicsCount++;
        }
      });
    });

    let state;
    if (selectedTopicsCount === 0) state = false;
    else if (selectedTopicsCount === totalTopics) state = true;
    else state = null;

    setDomainSelectionState(prev => ({
      ...prev,
      [domain]: state
    }));
  };

  // Toggle functions
  const toggleSubdomainExpansion = (domain, subdomain) => {
    setSubdomainExpanded(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [subdomain]: !prev[domain][subdomain]
      }
    }));
  };

  const toggleTopicSelection = (domain, subdomain, topic) => {
    setSelectedTopics(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [subdomain]: {
          ...prev[domain][subdomain],
          [topic]: !prev[domain][subdomain][topic]
        }
      }
    }));
    
    // Update states after selection change
    setTimeout(() => {
      updateSubdomainSelectionState(domain, subdomain);
      updateDomainSelectionState(domain);
    }, 0);
  };

  const toggleDomainSelection = (domain, value) => {
    const newValue = value !== undefined ? value : !domainSelectionState[domain];
    
    setDomainSelectionState(prev => ({
      ...prev,
      [domain]: newValue
    }));

    const newSelectedTopics = { ...selectedTopics };
    const newSubdomainSelectionState = { ...subdomainSelectionState };

    if (newSelectedTopics[domain]) {
      Object.keys(newSelectedTopics[domain]).forEach(subdomain => {
        Object.keys(newSelectedTopics[domain][subdomain]).forEach(topic => {
          newSelectedTopics[domain][subdomain][topic] = newValue;
        });
        newSubdomainSelectionState[domain][subdomain] = newValue;
      });

      setSelectedTopics(newSelectedTopics);
      setSubdomainSelectionState(newSubdomainSelectionState);
    }
  };

  const toggleSubdomainSelection = (domain, subdomain, value) => {
    const newValue = value !== undefined ? value : !subdomainSelectionState[domain][subdomain];
    
    setSubdomainSelectionState(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [subdomain]: newValue
      }
    }));

    const newSelectedTopics = { ...selectedTopics };
    
    if (newSelectedTopics[domain] && newSelectedTopics[domain][subdomain]) {
      Object.keys(newSelectedTopics[domain][subdomain]).forEach(topic => {
        newSelectedTopics[domain][subdomain][topic] = newValue;
      });

      setSelectedTopics(newSelectedTopics);
      updateDomainSelectionState(domain);
    }
  };

  const toggleTopicExpansion = (domain, subdomain, topic) => {
    setTopicExpanded(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [subdomain]: {
          ...prev[domain][subdomain],
          [topic]: !prev[domain][subdomain][topic]
        }
      }
    }));
  };

  const startPractice = () => {
    let anyTopicSelected = false;

    Object.keys(selectedTopics).forEach(domain => {
      Object.keys(selectedTopics[domain] || {}).forEach(subdomain => {
        Object.keys(selectedTopics[domain][subdomain] || {}).forEach(topic => {
          if (selectedTopics[domain][subdomain][topic]) {
            anyTopicSelected = true;
          }
        });
      });
    });

    if (!anyTopicSelected) {
      setShowSelectTopicWarning(true);
      alert('Please select at least one topic to practice');
      return;
    }

    setShowSelectTopicWarning(false);
    
    // Navigate to practice page with selected topics
    navigate('/practice', { 
      state: { 
        selectedTopics,
      } 
    });
  };

  const handleMockTestSelected = (mockName, isPremium) => {
    if (isPremium && !(userData?.isPremium)) {
      navigate('/login');
      return;
    }
    
    // Navigate to the mock test screen
    navigate(`/mock-test/${mockName.toLowerCase()}`);
  };

  // Component rendering functions
  const DomainCard = ({ domain, icon }) => {
    const primaryColor = domain === 'Math' ? '#4A7C59' : '#3498db';
    const lightColor = domain === 'Math' ? '#F0F9F1' : '#E8F4FD';
    const iconBgColor = domain === 'Math' ? '#E1F0E2' : '#D4E9F9';
    const headerColor = domain === 'Math' ? '#E8F5E9' : '#E1F0FF';

    const IconComponent = icon === 'FaCalculator' ? FaCalculator : FaBookReader;

    return (
      <div className="domain-card">
        <div className="domain-card-header" style={{ backgroundColor: headerColor }}>
          <div className="domain-card-icon" style={{ backgroundColor: iconBgColor }}>
            <IconComponent style={{ color: primaryColor }} />
          </div>
          <div className="domain-card-title">{domain}</div>
          <div className="domain-checkbox">
            <input
              type="checkbox"
              checked={domainSelectionState[domain] || false}
              onChange={(e) => toggleDomainSelection(domain, e.target.checked)}
              className="tristate-checkbox"
            />
          </div>
        </div>
        <div className="domain-card-content">
          {Object.keys(domainStructure[domain] || {}).map(subdomain => (
            <SubdomainSection
              key={subdomain}
              domain={domain}
              subdomain={subdomain}
              domainColor={primaryColor}
            />
          ))}
        </div>
      </div>
    );
  };

  const SubdomainSection = ({ domain, subdomain, domainColor }) => {
    const isExpanded = subdomainExpanded[domain]?.[subdomain] || false;

    return (
      <div className="subdomain-section">
        <div 
          className="subdomain-header"
          onClick={() => toggleSubdomainExpansion(domain, subdomain)}
        >
          <div className="subdomain-checkbox">
            <input
              type="checkbox"
              checked={subdomainSelectionState[domain]?.[subdomain] || false}
              onChange={(e) => toggleSubdomainSelection(domain, subdomain, e.target.checked)}
              className="tristate-checkbox"
            />
          </div>
          <div className="subdomain-title">{subdomain}</div>
          <div className="subdomain-expand">
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        {isExpanded && (
          <div className="subdomain-content">
            {Object.keys(domainStructure[domain][subdomain] || {}).map(topic => (
              <TopicRow
                key={topic}
                domain={domain}
                subdomain={subdomain}
                topic={topic}
                domainColor={domainColor}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const TopicRow = ({ domain, subdomain, topic, domainColor }) => {
    const isSelected = selectedTopics[domain]?.[subdomain]?.[topic] || false;
    const isExpanded = topicExpanded[domain]?.[subdomain]?.[topic] || false;
    const subtopics = domainStructure[domain][subdomain][topic] || [];

    return (
      <div 
        className={`topic-row ${isSelected ? 'selected' : ''}`}
        style={{
          backgroundColor: isSelected ? `${domainColor}10` : 'transparent',
          borderColor: isSelected ? `${domainColor}50` : 'transparent'
        }}
      >
        <div className="topic-header">
          <div className="topic-checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleTopicSelection(domain, subdomain, topic)}
            />
          </div>
          <div 
            className="topic-title"
            style={{ color: isSelected ? domainColor : '#333' }}
          >
            {topic}
          </div>
          <button 
            className="topic-expand-btn"
            onClick={() => toggleTopicExpansion(domain, subdomain, topic)}
            style={{ backgroundColor: `${domainColor}20` }}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isExpanded && (
          <div className="topic-content">
            <div className="subtopics-label">Subtopics:</div>
            {subtopics.map((subtopic, index) => (
              <div key={index} className="subtopic-item">
                <div className="subtopic-bullet" style={{ backgroundColor: domainColor }} />
                <div className="subtopic-text">{subtopic}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const MockTestButton = ({ label, isPremium }) => {
    if (isPremium) {
      return (
        <button 
          className="premium-mock-test-btn"
          onClick={() => handleMockTestSelected(label, true)}
        >
          {label} <FaLock />
        </button>
      );
    }

    return (
      <button 
        className="free-mock-test-btn"
        onClick={() => handleMockTestSelected(label, false)}
      >
        {label}
      </button>
    );
  };

  const TimeUnit = ({ value, label }) => (
    <div className="time-unit">
      <div className="time-value">{value.toString().padStart(2, '0')}</div>
      <div className="time-label">{label}</div>
    </div>
  );

  const MockTestCountdownSection = () => {
    const formatDate = (date) => {
      if (!date) return '';
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    };

    return (
      <div className="countdown-section">
        <h3>Upcoming Mock Test</h3>
        <p>Practice with a full-length test under timed conditions</p>
        <div className="countdown-label">TEST STARTS IN</div>
        <div className="countdown-timer">
          <TimeUnit value={countdown.days} label="Days" />
          <div className="time-separator">:</div>
          <TimeUnit value={countdown.hours} label="Hours" />
          <div className="time-separator">:</div>
          <TimeUnit value={countdown.minutes} label="Mins" />
          <div className="time-separator">:</div>
          <TimeUnit value={countdown.seconds} label="Secs" />
        </div>
        <div className="countdown-date">
          <FaCalendarAlt />
          <span>{formatDate(countdown.nextEvent)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="app sat-app">
      {/* Navigation - SAME AS APP PAGE */}
      <nav className="navbar sat-navbar">
        <div className="nav-container">
          {/* Logo on leftmost side */}
          <div className="logo sat-logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          {/* Navigation links and Account button on rightmost side */}
          <div className="nav-links sat-nav-links">
            <Link to="/" className="nav-link sat-nav-link courses-link">
               Home
            </Link>
            <Link to="/courses" className="nav-link sat-nav-link courses-link">
               Courses
            </Link>
            <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link">
              RoadMap
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
            <Link to="/profile" className="nav-link sat-nav-link community-link">
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
          <div className="mobile-menu-content">
            <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <HomeIcon /> Home
            </Link>
            <Link to="/courses" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <MenuBookIcon /> Courses
            </Link>
            <Link to="/roadmap" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <MapIcon /> RoadMap
            </Link>
            <Link to="/community" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <GroupsIcon /> Community
            </Link>
            <Link to="/mock-practice" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <QuizIcon /> Mock Practice
            </Link>
            <Link to="/game" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <SportsEsportsIcon /> Game
            </Link>
            <Link to="/blogs" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <ArticleIcon /> Blogs
            </Link>
            <Link to="/blogs" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              <ArticleIcon /> Account
            </Link>
            
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <h2>Targeted Practice with AI Tutor</h2>
          <p className="subtitle">Select specific domains and topics to focus on your weak areas</p>

          {/* Domain Cards */}
          <div className="domain-cards-container">
            {isMobile ? (
              <>
                <DomainCard domain="Math" icon="FaCalculator" />
                <div className="spacer" />
                <DomainCard domain="Reading and Writing" icon="FaBookReader" />
              </>
            ) : (
              <div className="domain-cards-row">
                <DomainCard domain="Math" icon="FaCalculator" />
                <DomainCard domain="Reading and Writing" icon="FaBookReader" />
              </div>
            )}
          </div>

          {/* Warning */}
          {showSelectTopicWarning && (
            <div className="warning-message">
              Please select at least one topic to practice
            </div>
          )}

          {/* Start Practice Button */}
          <div className="start-practice-container">
            <button className="start-practice-btn" onClick={startPractice}>
              Start Practice Session
            </button>
          </div>

          {/* Mock Tests and Countdown Section */}
          <div className="mock-tests-section-container">
            {isMobile ? (
              <>
                <div ref={mockTestsRef} className="mock-tests-section">
                  <h3>Full SAT Mock Tests</h3>
                  <p>Practice with full-length mock tests</p>
                  
                  <div className="mock-tests-container">
                    <div className="free-tests">
                      <div className="section-label">
                        <FaLockOpen /> FREE MOCK TESTS
                      </div>
                      <div className="test-buttons">
                        <MockTestButton label="Mock1" isPremium={false} />
                        <MockTestButton label="Mock2" isPremium={false} />
                        <MockTestButton label="Mock3" isPremium={false} />
                      </div>
                    </div>

                    <button 
                      className="more-tests-btn"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      More Tests {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {isDropdownOpen && (
                      <div className="premium-tests">
                        <div className="section-label">
                          <FaLock /> PREMIUM MOCK TESTS
                        </div>
                        <div className="test-buttons">
                          {[4, 5, 6, 7, 8].map(num => (
                            <MockTestButton key={num} label={`Mock ${num}`} isPremium={true} />
                          ))}
                        </div>
                        <p className="premium-note">
                          Unlock all premium mock tests with SAT Pro subscription
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="spacer" />
                <MockTestCountdownSection />
              </>
            ) : (
              <div className="mock-tests-row">
                <div ref={mockTestsRef} className="mock-tests-section">
                  <h3>Full SAT Mock Tests</h3>
                  <p>Practice with full-length mock tests</p>
                  
                  <div className="mock-tests-container">
                    <div className="free-tests">
                      <div className="section-label">
                        <FaLockOpen /> FREE MOCK TESTS
                      </div>
                      <div className="test-buttons">
                        <MockTestButton label="Mock1" isPremium={false} />
                        <MockTestButton label="Mock2" isPremium={false} />
                        <MockTestButton label="Mock3" isPremium={false} />
                      </div>
                    </div>

                    <button 
                      className="more-tests-btn"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      More Tests {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {isDropdownOpen && (
                      <div className="premium-tests">
                        <div className="section-label">
                          <FaLock /> PREMIUM MOCK TESTS
                        </div>
                        <div className="test-buttons">
                          {[4, 5, 6, 7, 8].map(num => (
                            <MockTestButton key={num} label={`Mock ${num}`} isPremium={true} />
                          ))}
                        </div>
                        <p className="premium-note">
                          Unlock all premium mock tests with SAT Pro subscription
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <MockTestCountdownSection />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyPlan;
