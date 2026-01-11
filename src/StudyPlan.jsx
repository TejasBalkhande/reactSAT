import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
  
  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
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

  // Handle Account button click
  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

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

  // Helper function to convert text to URL-friendly slug
  const toSlug = (text) => {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Updated startPractice function with URL routing logic
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
    
    // Count selected topics and analyze selection pattern
    let selectedTopicsList = [];
    let selectedDomains = new Set();
    let selectedSubdomains = new Set();
    let selectedTopicsNames = new Set();

    Object.keys(selectedTopics).forEach(domain => {
      Object.keys(selectedTopics[domain] || {}).forEach(subdomain => {
        Object.keys(selectedTopics[domain][subdomain] || {}).forEach(topic => {
          if (selectedTopics[domain][subdomain][topic]) {
            selectedTopicsList.push({ domain, subdomain, topic });
            selectedDomains.add(domain);
            selectedSubdomains.add(subdomain);
            selectedTopicsNames.add(topic);
          }
        });
      });
    });

    console.log('Selected items analysis:', {
      count: selectedTopicsList.length,
      domains: Array.from(selectedDomains),
      subdomains: Array.from(selectedSubdomains),
      topics: Array.from(selectedTopicsNames)
    });

    // Determine routing based on selection pattern
    let routePath = '/practice'; // Default route for multiple selections
    
    if (selectedTopicsList.length === 1) {
      // Single topic selected - FIXED: Include subdomain in URL
      const { domain, subdomain, topic } = selectedTopicsList[0];
      // Use subdomain/topic format instead of just topic
      routePath = `/${toSlug(subdomain)}/${toSlug(topic)}`;
      console.log('Single topic selected, routing to:', routePath);
    } else if (selectedTopicsList.length > 1) {
      // Check if all selected topics belong to the same subdomain
      const firstSubdomain = selectedTopicsList[0].subdomain;
      const allSameSubdomain = selectedTopicsList.every(item => item.subdomain === firstSubdomain);
      
      if (allSameSubdomain) {
        // All topics from same subdomain
        routePath = `/${toSlug(firstSubdomain)}`;
        console.log('Single subdomain selected, routing to:', routePath);
      } else {
        // Check if all selected topics belong to the same domain
        const firstDomain = selectedTopicsList[0].domain;
        const allSameDomain = selectedTopicsList.every(item => item.domain === firstDomain);
        
        if (allSameDomain) {
          // All topics from same domain
          if (firstDomain === 'Math' || firstDomain === 'Reading and Writing') {
            // Check if entire domain is selected
            const totalTopicsInDomain = Object.keys(domainStructure[firstDomain] || {}).reduce((total, subdomain) => {
              return total + Object.keys(domainStructure[firstDomain][subdomain] || {}).length;
            }, 0);
            
            if (selectedTopicsList.length === totalTopicsInDomain) {
              // Entire domain selected
              routePath = `/${toSlug(firstDomain)}`;
              console.log('Entire domain selected, routing to:', routePath);
            } else {
              // Multiple subdomains/topics from same domain but not entire domain
              routePath = '/practice';
              console.log('Multiple selections within same domain, using default route');
            }
          } else {
            routePath = '/practice';
          }
        } else {
          // Multiple different domains selected
          routePath = '/practice';
          console.log('Multiple domains selected, using default route');
        }
      }
    }
    
    // Navigate to appropriate route with selected topics
    navigate(routePath, { 
      state: { 
        selectedTopics,
        fromStudyPlan: true
      } 
    });
  };

  const handleMockTestSelected = (mockName, isPremium) => {
    if (isPremium && !isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Convert the mock name to kebab-case for URL
    // Example: "SAT Mock 1" -> "sat-mock-1"
    const formattedMockName = mockName.toLowerCase().replace(/\s+/g, '-');
    
    // Navigate to the mock test screen
    navigate(`/mock-test/${formattedMockName}`);
  };

  // Component rendering functions
  const DomainCard = ({ domain, icon }) => {
    const primaryColor = domain === 'Math' ? '#4A7C59' : '#3498db';
    const lightColor = domain === 'Math' ? '#F0F9F1' : '#E8F4FD';
    const iconBgColor = domain === 'Math' ? '#E1F0E2' : '#D4E9F9';
    const headerColor = domain === 'Math' ? '#E8F5E9' : '#E1F0FF';

    const IconComponent = icon === 'FaCalculator' ? FaCalculator : FaBookReader;

    return (
      <div className="domain-card" itemScope itemType="https://schema.org/LearningResource">
        <div className="domain-card-header" style={{ backgroundColor: headerColor }}>
          <div className="domain-card-icon" style={{ backgroundColor: iconBgColor }} aria-hidden="true">
            <IconComponent style={{ color: primaryColor }} />
          </div>
          <div className="domain-card-title" itemProp="name">{domain} SAT Preparation</div>
          <div className="domain-checkbox">
            <input
              type="checkbox"
              checked={domainSelectionState[domain] || false}
              onChange={(e) => toggleDomainSelection(domain, e.target.checked)}
              className="tristate-checkbox"
              aria-label={`Select all ${domain} SAT topics`}
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
      <div className="subdomain-section" itemScope itemType="https://schema.org/EducationEvent">
        <div 
          className="subdomain-header"
          onClick={() => toggleSubdomainExpansion(domain, subdomain)}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-controls={`subdomain-content-${domain}-${subdomain}`}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleSubdomainExpansion(domain, subdomain);
            }
          }}
        >
          <div className="subdomain-checkbox">
            <input
              type="checkbox"
              checked={subdomainSelectionState[domain]?.[subdomain] || false}
              onChange={(e) => toggleSubdomainSelection(domain, subdomain, e.target.checked)}
              className="tristate-checkbox"
              aria-label={`Select all ${subdomain} SAT topics`}
            />
          </div>
          <div className="subdomain-title" itemProp="name">{subdomain}</div>
          <div className="subdomain-expand" aria-hidden="true">
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        </div>
        {isExpanded && (
          <div className="subdomain-content" id={`subdomain-content-${domain}-${subdomain}`}>
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
        itemScope itemType="https://schema.org/CreativeWork"
      >
        <div className="topic-header">
          <div className="topic-checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleTopicSelection(domain, subdomain, topic)}
              aria-label={`Select ${topic} for SAT practice`}
            />
          </div>
          <div 
            className="topic-title"
            style={{ color: isSelected ? domainColor : '#333' }}
            itemProp="name"
          >
            {topic}
          </div>
          <button 
            className="topic-expand-btn"
            onClick={() => toggleTopicExpansion(domain, subdomain, topic)}
            style={{ backgroundColor: `${domainColor}20` }}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${topic} SAT subtopics`}
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        {isExpanded && (
          <div className="topic-content" itemProp="description">
            <div className="subtopics-label">SAT Subtopics:</div>
            {subtopics.map((subtopic, index) => (
              <div key={index} className="subtopic-item">
                <div className="subtopic-bullet" style={{ backgroundColor: domainColor }} aria-hidden="true" />
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
          aria-label={`Take ${label} premium SAT mock test`}
          itemScope itemType="https://schema.org/Action"
        >
          {label} <FaLock aria-hidden="true" />
        </button>
      );
    }

    return (
      <button 
        className="free-mock-test-btn"
        onClick={() => handleMockTestSelected(label, false)}
        aria-label={`Take ${label} free SAT mock test`}
        itemScope itemType="https://schema.org/Action"
      >
        {label}
      </button>
    );
  };

  const TimeUnit = ({ value, label }) => (
    <div className="time-unit">
      <div className="time-value" aria-label={`${value} ${label}`}>{value.toString().padStart(2, '0')}</div>
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
      <div className="countdown-section" itemScope itemType="https://schema.org/Event">
        <h2>Upcoming SAT Mock Test</h2>
        <p>Practice with a full-length Digital SAT test under timed conditions</p>
        <div className="countdown-label">SAT TEST STARTS IN</div>
        <div className="countdown-timer" aria-live="polite" aria-atomic="true">
          <TimeUnit value={countdown.days} label="Days" />
          <div className="time-separator" aria-hidden="true">:</div>
          <TimeUnit value={countdown.hours} label="Hours" />
          <div className="time-separator" aria-hidden="true">:</div>
          <TimeUnit value={countdown.minutes} label="Mins" />
          <div className="time-separator" aria-hidden="true">:</div>
          <TimeUnit value={countdown.seconds} label="Secs" />
        </div>
        <div className="countdown-date">
          <FaCalendarAlt aria-hidden="true" />
          <span itemProp="startDate" content={countdown.nextEvent?.toISOString()}>
            {formatDate(countdown.nextEvent)}
          </span>
        </div>
      </div>
    );
  };

  // Generate JSON-LD structured data for SEO
  const generateStructuredData = () => {
    const baseUrl = window.location.origin;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${baseUrl}/digital-sat-practice-questions`,
          "name": "SAT Study Plan | Targeted Practice with AI Tutor | Mock SAT Exam",
          "description": "Select specific SAT domains and topics to focus on your weak areas. Practice with full-length Digital SAT mock tests and track your progress with our AI-powered tutoring system.",
          "url": `${baseUrl}/digital-sat-practice-questions`,
          "mainEntityOfPage": {
            "@type": "WebApplication",
            "name": "Mock SAT Exam Study Planner",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "description": "Interactive Digital SAT study plan tool with topic selection and mock tests for SAT 2026 preparation",
            "offers": {
              "@type": "Offer",
              "category": "Free",
              "availability": "https://schema.org/InStock"
            }
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": `${baseUrl}/`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "SAT Study Plan",
              "item": `${baseUrl}/digital-sat-practice-questions`
            }
          ]
        },
        {
          "@type": "EducationEvent",
          "name": "Weekly SAT Mock Test",
          "description": "Full-length Digital SAT practice test with timer and scoring",
          "startDate": countdown.nextEvent?.toISOString(),
          "endDate": countdown.nextEvent ? new Date(countdown.nextEvent.getTime() + 180 * 60000).toISOString() : null,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
          "location": {
            "@type": "VirtualLocation",
            "url": `${baseUrl}/mock-test`
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          }
        }
      ]
    };

    return JSON.stringify(structuredData);
  };

  // Generate FAQ structured data
  const generateFAQStructuredData = () => {
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the SAT study plan work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our SAT study plan allows you to select specific domains (Math, Reading & Writing) and topics within each domain. You can choose individual topics, subdomains, or entire domains to focus your practice. The system then generates targeted practice questions based on your selections."
          }
        },
        {
          "@type": "Question",
          "name": "Are the mock tests free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer 3 free full-length SAT mock tests. Additional premium tests are available with enhanced features and detailed analytics. All tests simulate the actual Digital SAT exam format and timing."
          }
        },
        {
          "@type": "Question",
          "name": "How many SAT topics are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our platform covers all major SAT domains including Advanced Math, Algebra, Problem-Solving and Data Analysis, Geometry, Trigonometry, Reading, and Writing. Each domain is broken down into subdomains and specific topics for targeted practice."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a timer for practice sessions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, both practice sessions and mock tests include a timer to simulate real SAT testing conditions. This helps you improve your time management skills for the actual Digital SAT exam."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to create an account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While you can access basic features without an account, creating a free account allows you to save your progress, track your improvement over time, and access personalized recommendations based on your performance."
          }
        }
      ]
    };

    return JSON.stringify(faqData);
  };

  // Generate How-To structured data
  const generateHowToStructuredData = () => {
    const howToData = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Create a Personalized SAT Study Plan",
      "description": "Step-by-step guide to creating an effective SAT study plan using our platform",
      "step": [
        {
          "@type": "HowToStep",
          "position": "1",
          "name": "Select SAT Domains",
          "text": "Choose between Math and Reading & Writing domains based on your areas of focus",
          "url": `${window.location.href}#domain-selection`
        },
        {
          "@type": "HowToStep",
          "position": "2",
          "name": "Choose Specific Topics",
          "text": "Expand each domain to select specific topics within subdomains like Algebra, Geometry, or Reading Comprehension",
          "url": `${window.location.href}#topic-selection`
        },
        {
          "@type": "HowToStep",
          "position": "3",
          "name": "Start Practice Session",
          "text": "Click 'Start Practice Session' to begin targeted practice with questions from your selected topics",
          "url": `${window.location.href}#start-practice`
        },
        {
          "@type": "HowToStep",
          "position": "4",
          "name": "Take Mock Tests",
          "text": "Use full-length mock tests to simulate the actual Digital SAT exam experience",
          "url": `${window.location.href}#mock-tests`
        },
        {
          "@type": "HowToStep",
          "position": "5",
          "name": "Track Progress",
          "text": "Review your performance and adjust your study plan based on results",
          "url": `${window.location.href}#progress`
        }
      ]
    };

    return JSON.stringify(howToData);
  };

  return (
    <div className="app sat-app">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>SAT Study Plan | Targeted Practice with AI Tutor | Mock SAT Exam 2026</title>
        <meta name="description" content="Create your personalized Digital SAT study plan. Select specific SAT domains and topics to focus on weak areas. Practice with full-length mock tests and AI-powered tutoring. Free SAT preparation for 2026." />
        <meta name="keywords" content="SAT study plan, Digital SAT practice, SAT mock tests, SAT Math preparation, SAT Reading & Writing, SAT targeted practice, SAT topics, SAT domains, SAT test prep 2026, SAT AI tutor" />
        <meta name="author" content="Mock SAT Exam" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="SAT Study Plan | Targeted Practice with AI Tutor | Mock SAT Exam" />
        <meta property="og:description" content="Create your personalized Digital SAT study plan. Select specific SAT domains and topics to focus on weak areas. Practice with full-length mock tests." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${window.location.origin}/logo.png`} />
        <meta property="og:image:alt" content="Mock SAT Exam - SAT Study Plan" />
        <meta property="og:site_name" content="Mock SAT Exam" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SAT Study Plan | Targeted Practice with AI Tutor" />
        <meta name="twitter:description" content="Create personalized Digital SAT study plans with targeted practice and full mock tests" />
        <meta name="twitter:image" content={`${window.location.origin}/logo.png`} />
        <meta name="twitter:creator" content="@mocksatexam" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        
        {/* Structured Data Scripts */}
        <script type="application/ld+json">
          {generateStructuredData()}
        </script>
        <script type="application/ld+json">
          {generateFAQStructuredData()}
        </script>
        <script type="application/ld+json">
          {generateHowToStructuredData()}
        </script>
      </Helmet>

      {/* Hidden structured data for accessibility */}
      <div className="structured-data" aria-hidden="true">
        <h1 className="visually-hidden">Digital SAT Study Plan - Targeted Practice with AI Tutor</h1>
        <h2 className="visually-hidden">Personalized SAT Preparation for 2026</h2>
        <h3 className="visually-hidden">Free SAT Mock Tests and Practice Questions</h3>
      </div>

      {/* Navigation - SAME AS APP PAGE */}
      <nav className="navbar sat-navbar" role="navigation" aria-label="SAT Study Plan Navigation">
        <div className="nav-container">
          {/* Logo on leftmost side */}
          <div className="logo sat-logo" onClick={(e) => {
            e.stopPropagation();
            navigate('/');
          }} role="button" tabIndex={0} onKeyPress={(e) => {
            if (e.key === 'Enter') navigate('/');
          }} aria-label="Go to SAT Home Page">
            <img src="/logo.png" alt="Mock SAT Exam Logo - Free Digital SAT Preparation" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          {/* Navigation links and Account button on rightmost side */}
          <div className="nav-links sat-nav-links">
            <Link to="/" className="nav-link sat-nav-link home-link" aria-label="SAT Home Page">
              Home
            </Link>
            <Link to="/" className="nav-link sat-nav-link digital-sat-practice-questions-link" aria-label="SAT Mock Practice">
              Home
            </Link>
            <Link to="/courses" className="nav-link sat-nav-link courses-link" aria-label="SAT Courses">
              Courses
            </Link>
            <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link" aria-label="SAT Roadmap">
              RoadMap
            </Link>
            
            <Link to="/blogs" className="nav-link sat-nav-link blogs-link" aria-label="SAT Blog Articles">
              Blogs
            </Link>
            
            {/* UPDATED ACCOUNT BUTTON - Shows Profile when logged in */}
            <button 
              onClick={handleAccountClick}
              className="nav-link sat-nav-link community-link account-button"
              aria-label={isLoggedIn ? 'Go to SAT Profile' : 'Sign in to SAT Account'}
            >
              {isLoggedIn ? 'Profile' : 'Account'}
            </button>
          </div>
          
          {/* Mobile menu toggle */}
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle SAT mobile menu"
            aria-expanded={isMenuOpen}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content" role="main" itemScope itemType="https://schema.org/WebPage">
        <div className="content-container">
          {/* Breadcrumb navigation */}
          <nav className="breadcrumb" aria-label="SAT Breadcrumb Navigation">
            <Link to="/" itemProp="url">
              <span itemProp="title">SAT Home</span>
            </Link>
            <span className="breadcrumb-separator" aria-hidden="true">›</span>
            <span itemProp="title">SAT Study Plan</span>
          </nav>

          <h1 itemProp="headline">Digital SAT Targeted Practice with AI Tutor</h1>
          <p className="subtitle" itemProp="description">Select specific SAT domains and topics to focus on your weak areas for 2026 Digital SAT preparation</p>

          {/* Domain Cards */}
          <div className="domain-cards-container" id="domain-selection" itemScope itemProp="mainEntity" itemType="https://schema.org/ItemList">
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
            <div className="warning-message" role="alert">
              Please select at least one SAT topic to practice
            </div>
          )}

          {/* Start Practice Button */}
          <div className="start-practice-container" id="start-practice">
            <button 
              className="start-practice-btn" 
              onClick={startPractice}
              aria-label="Start SAT practice session with selected topics"
              itemScope itemType="https://schema.org/Action"
            >
              Start SAT Practice Session
            </button>
          </div>

          {/* Mock Tests and Countdown Section */}
          <div className="mock-tests-section-container" id="mock-tests">
            {isMobile ? (
              <>
                <div ref={mockTestsRef} className="mock-tests-section" itemScope itemType="https://schema.org/EducationEvent">
                  <h2>Full Digital SAT Mock Tests</h2>
                  <p>Practice with full-length Digital SAT mock tests for 2026</p>
                  
                  <div className="mock-tests-container">
                    <div className="free-tests">
                      <div className="section-label">
                        <FaLockOpen aria-hidden="true" /> FREE SAT MOCK TESTS
                      </div>
                      <div className="test-buttons">
                        <MockTestButton label="SAT Mock 1" isPremium={false} />
                        <MockTestButton label="SAT Mock 2" isPremium={false} />
                        <MockTestButton label="SAT Mock 3" isPremium={false} />
                      </div>
                    </div>

                    <button 
                      className="more-tests-btn"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      aria-expanded={isDropdownOpen}
                      aria-controls="premium-tests-dropdown"
                    >
                      More SAT Tests {isDropdownOpen ? <FaChevronUp aria-hidden="true" /> : <FaChevronDown aria-hidden="true" />}
                    </button>

                    {isDropdownOpen && (
                      <div className="premium-tests" id="premium-tests-dropdown">
                        <div className="section-label">
                          <FaLock aria-hidden="true" /> PREMIUM SAT MOCK TESTS
                        </div>
                        <div className="test-buttons">
                          {[4, 5, 6, 7, 8].map(num => (
                            <MockTestButton key={num} label={`SAT Mock ${num}`} isPremium={true} />
                          ))}
                        </div>
                        <p className="premium-note">
                          Unlock all premium SAT mock tests with SAT Pro subscription
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
                <div ref={mockTestsRef} className="mock-tests-section" itemScope itemType="https://schema.org/EducationEvent">
                  <h2>Full Digital SAT Mock Tests</h2>
                  <p>Practice with full-length Digital SAT mock tests for 2026</p>
                  
                  <div className="mock-tests-container">
                    <div className="free-tests">
                      <div className="section-label">
                        <FaLockOpen aria-hidden="true" /> FREE SAT MOCK TESTS
                      </div>
                      <div className="test-buttons">
                        <MockTestButton label="SAT Mock 1" isPremium={false} />
                        <MockTestButton label="SAT Mock 2" isPremium={false} />
                        <MockTestButton label="SAT Mock 3" isPremium={false} />
                      </div>
                    </div>

                    <button 
                      className="more-tests-btn"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      aria-expanded={isDropdownOpen}
                      aria-controls="premium-tests-dropdown"
                    >
                      More SAT Tests {isDropdownOpen ? <FaChevronUp aria-hidden="true" /> : <FaChevronDown aria-hidden="true" />}
                    </button>

                    {isDropdownOpen && (
                      <div className="premium-tests" id="premium-tests-dropdown">
                        <div className="section-label">
                          <FaLock aria-hidden="true" /> PREMIUM SAT MOCK TESTS
                        </div>
                        <div className="test-buttons">
                          {[4, 5, 6, 7, 8].map(num => (
                            <MockTestButton key={num} label={`SAT Mock ${num}`} isPremium={true} />
                          ))}
                        </div>
                        <p className="premium-note">
                          Unlock all premium SAT mock tests with SAT Pro subscription
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <MockTestCountdownSection />
              </div>
            )}
          </div>

          {/* SEO FAQ Section (Hidden from UI but accessible) */}
          <div className="structured-data" aria-hidden="true">
            <div itemScope itemType="https://schema.org/FAQPage">
              <div itemScope itemType="https://schema.org/Question">
                <h3 itemProp="name">What is a SAT study plan?</h3>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <div itemProp="text">
                    A SAT study plan is a structured approach to preparing for the Digital SAT exam that focuses on your specific weak areas. Our platform allows you to select individual topics within Math, Reading, and Writing domains to create a personalized study schedule.
                  </div>
                </div>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 itemProp="name">How many SAT topics are available?</h3>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <div itemProp="text">
                    Our platform covers all major SAT domains including Advanced Math, Algebra, Problem-Solving and Data Analysis, Geometry, Trigonometry, Reading Comprehension, and Writing. Each domain contains multiple subdomains and specific topics for targeted practice.
                  </div>
                </div>
              </div>
              <div itemScope itemType="https://schema.org/Question">
                <h3 itemProp="name">Are the mock tests similar to the real Digital SAT?</h3>
                <div itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                  <div itemProp="text">
                    Yes, our mock tests are designed to simulate the actual Digital SAT exam format, timing, and question types. They include both Math and Evidence-Based Reading and Writing sections with accurate difficulty levels.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu" role="dialog" aria-modal="true" aria-label="SAT Mobile Menu">
          {/* Header Section with Logo */}
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <img src="/logo.png" alt="Mock SAT Exam" className="mobile-logo-img" />
            </div>
            <button 
              className="close-menu" 
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close SAT mobile menu"
            >
              ×
            </button>
          </div>
          
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)} aria-label="SAT Home">
              Home
            </Link>
            <Link to="/courses" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)} aria-label="SAT Courses">
              Courses
            </Link>
            <Link to="/roadmap" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)} aria-label="SAT Roadmap">
              RoadMap
            </Link>

            <Link to="/blogs" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)} aria-label="SAT Blogs">
              Blogs
            </Link>
            <button 
              onClick={() => {
                handleAccountClick();
                setIsMenuOpen(false);
              }}
              className="mobile-menu-link"
              aria-label={isLoggedIn ? "SAT Profile" : "SAT Account"}
            >
              {isLoggedIn ? 'SAT Profile' : 'SAT Account'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyPlan;