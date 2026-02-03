import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './PracticePage.css';
import { Groq } from 'groq-sdk';
import {
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaBrain,
  FaPaperPlane,
  FaSpinner,
  FaCalendarAlt,
  FaUser,
  FaGraduationCap,
  FaQuestionCircle,
  FaHome,
  FaBook,
  FaRoad,
  FaUniversity,
  FaGamepad,
  FaUserCircle,
  FaLock
} from 'react-icons/fa';


const PracticePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const chatScrollRef = useRef(null);

  // Initialize Groq client with API key
  const groq = new Groq({
    dangerouslyAllowBrowser: true
  });

  // Mock user data
  const userData = { 
    isPremium: false,
    name: 'Student'
  };

  // Domain structure for URL matching (same as in StudyPlan.jsx)
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

  // Function to convert text to URL-friendly slug (same as in StudyPlan.jsx)
  const toSlug = (text) => {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Function to find matching item from slug
  const findMatchingItem = (slug) => {
    // Try to find domain
    for (const domain in domainStructure) {
      if (toSlug(domain) === slug) {
        return { type: 'domain', name: domain };
      }
    }
    
    // Try to find subdomain
    for (const domain in domainStructure) {
      for (const subdomain in domainStructure[domain]) {
        if (toSlug(subdomain) === slug) {
          return { type: 'subdomain', name: subdomain, domain };
        }
      }
    }
    
    // Try to find topic
    for (const domain in domainStructure) {
      for (const subdomain in domainStructure[domain]) {
        for (const topic in domainStructure[domain][subdomain]) {
          if (toSlug(topic) === slug) {
            return { type: 'topic', name: topic, domain, subdomain };
          }
        }
      }
    }
    
    return null;
  };

  // Function to extract and render LaTeX from text - same as in game.jsx
  const renderTextWithLatex = (text, fontSize = 16, textStyle = {}) => {
    if (!text || typeof text !== 'string') return text;
    
    // Same regex pattern as in game.jsx
    const latexPattern = /\\\[.*?\\\]|\\\(.*?\\\)|\\(?:frac|sqrt|sum|int|lim|sin|cos|tan|log|ln)\b/g;
    
    // Find all LaTeX expressions
    const latexMatches = [];
    let match;
    const regex = new RegExp(latexPattern);
    let lastIndex = 0;
    const textToProcess = text;
    
    while ((match = regex.exec(textToProcess)) !== null) {
      latexMatches.push({
        text: match[0],
        index: match.index
      });
    }

    // If no LaTeX found, return plain text
    if (latexMatches.length === 0) {
      return <span style={{ fontSize: `${fontSize}px`, ...textStyle }}>{text}</span>;
    }

    // Split text and render LaTeX parts
    const parts = [];
    let currentIndex = 0;

    latexMatches.forEach((match, i) => {
      // Add plain text before LaTeX
      if (match.index > currentIndex) {
        parts.push(
          <span key={`plain-${i}`} style={{ fontSize: `${fontSize}px`, ...textStyle }}>
            {textToProcess.substring(currentIndex, match.index)}
          </span>
        );
      }

      // Add LaTeX - handle both inline \(...\) and block \[...\]
      const latexContent = match.text
        .replace(/^\\\(/, '')  // Remove starting \(
        .replace(/\\\)$/, '')  // Remove ending \)
        .replace(/^\\\[/, '')  // Remove starting \[
        .replace(/\\\]$/, ''); // Remove ending \]

      // Check if it's block LaTeX (starts with \[)
      const isBlock = match.text.startsWith('\\[');
      
      parts.push(
        <span key={`latex-${i}`} className="latex-container" style={textStyle}>
          {isBlock ? (
            <BlockMath math={latexContent} />
          ) : (
            <InlineMath math={latexContent} />
          )}
        </span>
      );

      currentIndex = match.index + match.text.length;
    });

    // Add any remaining plain text
    if (currentIndex < textToProcess.length) {
      parts.push(
        <span key="plain-last" style={{ fontSize: `${fontSize}px`, ...textStyle }}>
          {textToProcess.substring(currentIndex)}
        </span>
      );
    }

    return <span className="text-with-latex">{parts}</span>;
  };

  // NEW FUNCTION: Render text with LaTeX AND markdown formatting
  const renderQuestionText = (text, fontSize = 18, textStyle = {}) => {
    if (!text || typeof text !== 'string') return text;

    // Split text by lines
    const lines = text.split('\n');
    
    // Process each line
    const renderedLines = lines.map((line, lineIndex) => {
      // Check if this line is a markdown header (###)
      if (line.trim().startsWith('###')) {
        const headerText = line.replace(/^###\s*/, '').trim();
        return (
          <div key={`header-${lineIndex}`} className="question-header-markdown">
            <h4 style={{ fontSize: `${fontSize + 2}px`, fontWeight: 'bold', margin: '20px 0 10px 0', ...textStyle }}>
              {renderTextWithLatex(headerText, fontSize + 2, { ...textStyle, fontWeight: 'bold' })}
            </h4>
          </div>
        );
      }
      
      // Check if line is just whitespace or empty (paragraph break)
      if (line.trim() === '') {
        return <div key={`break-${lineIndex}`} className="paragraph-break" style={{ height: '16px' }} />;
      }
      
      // Regular paragraph text
      return (
        <div key={`para-${lineIndex}`} className="question-paragraph">
          {renderTextWithLatex(line, fontSize, textStyle)}
        </div>
      );
    });

    return <div className="question-text-container">{renderedLines}</div>;
  };

  // Function to generate selectedTopics based on URL parameter
  const generateSelectedTopicsFromParam = (slug) => {
    const match = findMatchingItem(slug);
    if (!match) return null;

    const selectedTopics = {};

    if (match.type === 'domain') {
      // Select entire domain
      selectedTopics[match.name] = {};
      Object.keys(domainStructure[match.name] || {}).forEach(subdomain => {
        selectedTopics[match.name][subdomain] = {};
        Object.keys(domainStructure[match.name][subdomain] || {}).forEach(topic => {
          selectedTopics[match.name][subdomain][topic] = true;
        });
      });
    } else if (match.type === 'subdomain') {
      // Select entire subdomain
      selectedTopics[match.domain] = {};
      selectedTopics[match.domain][match.name] = {};
      Object.keys(domainStructure[match.domain][match.name] || {}).forEach(topic => {
        selectedTopics[match.domain][match.name][topic] = true;
      });
    } else if (match.type === 'topic') {
      // Select single topic
      selectedTopics[match.domain] = {};
      selectedTopics[match.domain][match.subdomain] = {};
      selectedTopics[match.domain][match.subdomain][match.name] = true;
    }

    return selectedTopics;
  };

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Fetch questions from the JSON file
        const response = await fetch('/mockquestions/practice_question.json');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        
        const data = await response.json();
        
        // Transform JSON data to match the expected question structure
        const formattedQuestions = data.map(item => ({
          id: item.question_id,
          domain: item.domain,
          skill: item.skill,
          difficulty: item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1), // Capitalize
          questionText: item.question_text,
          options: item.options,
          correctOption: item.correct_option,
          explanation: item.explanation,
          imagePath: item.image || null
        }));
        
        console.log('Loaded questions:', formattedQuestions.length);
        
        // Check if we have a URL parameter (e.g., /equivalent-expressions)
        const pathSlug = location.pathname.split('/').pop();
        
        let selectedTopicsToUse = null;
        
        if (pathSlug && pathSlug !== 'practice') {
          // We have a specific topic/subdomain/domain URL
          console.log('URL parameter detected:', pathSlug);
          selectedTopicsToUse = generateSelectedTopicsFromParam(pathSlug);
          
          if (selectedTopicsToUse) {
            console.log('Generated selectedTopics from URL:', selectedTopicsToUse);
          } else {
            console.log('No matching item found for slug:', pathSlug);
            // Fall back to location state or show no questions
          }
        } else if (location.state?.selectedTopics) {
          // We came from StudyPlan with multiple selections
          console.log('Using selectedTopics from state:', location.state.selectedTopics);
          selectedTopicsToUse = location.state.selectedTopics;
        }
        
        // If we have selected topics, filter questions
        if (selectedTopicsToUse) {
          const filteredQuestions = filterQuestionsByTopics(formattedQuestions, selectedTopicsToUse);
          console.log('Filtered questions:', filteredQuestions.length);
          setQuestions(filteredQuestions);
        } else {
          // No filtering, show all questions
          console.log('No topics selected, showing all questions');
          setQuestions(formattedQuestions);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to empty array
        setQuestions([]);
        setLoading(false);
      }
    };

    loadQuestions();
  }, [location.state, location.pathname]);

  // FIXED: Filter questions based on selected topics from StudyPlan
  const filterQuestionsByTopics = (allQuestions, selectedTopics) => {
    // If no topics selected, return all questions
    if (!selectedTopics || Object.keys(selectedTopics).length === 0) {
      console.log('No selected topics, returning all questions');
      return allQuestions;
    }

    // Create a flat list of selected skills
    const selectedSkills = [];
    
    Object.keys(selectedTopics).forEach(mainDomain => {
      Object.keys(selectedTopics[mainDomain] || {}).forEach(subdomain => {
        Object.keys(selectedTopics[mainDomain][subdomain] || {}).forEach(topic => {
          if (selectedTopics[mainDomain][subdomain][topic]) {
            // Store both main domain and subdomain for filtering
            selectedSkills.push({
              mainDomain: mainDomain,
              subdomain: subdomain,
              topic: topic
            });
          }
        });
      });
    });

    console.log('Selected skills for filtering:', selectedSkills);

    // If no skills selected, return all questions
    if (selectedSkills.length === 0) {
      console.log('No skills selected, returning all questions');
      return allQuestions;
    }

    // First, check if this is a Math or Reading/Writing question
    // The JSON questions have 'test' field that indicates if it's "Math" or "Reading and Writing"
    // But our questions don't have 'test' field, so we need to determine based on domain
    
    // Create a mapping of subdomains to main domains based on StudyPlan structure
    const subdomainToMainDomain = {
      // Math subdomains
      'Advanced Math': 'Math',
      'Algebra': 'Math',
      'Problem-Solving and Data Analysis': 'Math',
      'Geometry and Trigonometry': 'Math',
      
      // Reading and Writing subdomains
      'Craft and Structure': 'Reading and Writing',
      'Information and Ideas': 'Reading and Writing',
      'Expression of Ideas': 'Reading and Writing',
      'Standard English Conventions': 'Reading and Writing'
    };

    // Filter questions that match selected domains and skills
    return allQuestions.filter(question => {
      // Get the main domain from the question's subdomain
      const questionMainDomain = subdomainToMainDomain[question.domain] || question.domain;
      const questionSkill = question.skill.toLowerCase().trim();
      
      return selectedSkills.some(selected => {
        // Normalize strings for comparison
        const selectedMainDomain = selected.mainDomain.toLowerCase().trim();
        const selectedSubdomain = selected.subdomain.toLowerCase().trim();
        const selectedSkill = selected.topic.toLowerCase().trim();
        
        // First, check if the main domain matches
        let domainMatch = false;
        if (selectedMainDomain === 'math') {
          // For Math, check if question is in Math domain
          domainMatch = questionMainDomain.toLowerCase().includes('math') || 
                       question.domain.toLowerCase().includes('math');
        } else if (selectedMainDomain.includes('reading') || selectedMainDomain.includes('writing')) {
          // For Reading and Writing, check if question is in R&W domain
          domainMatch = questionMainDomain.toLowerCase().includes('reading') || 
                       questionMainDomain.toLowerCase().includes('writing') ||
                       question.domain.toLowerCase().includes('craft') ||
                       question.domain.toLowerCase().includes('information') ||
                       question.domain.toLowerCase().includes('expression') ||
                       question.domain.toLowerCase().includes('standard');
        }
        
        if (!domainMatch) {
          return false;
        }
        
        // Check if the subdomain matches (question.domain is actually the subdomain in StudyPlan)
        const subdomainMatch = question.domain.toLowerCase().includes(selectedSubdomain) ||
                              selectedSubdomain.includes(question.domain.toLowerCase()) ||
                              // Try to match subdomain keywords
                              selectedSubdomain.split(' ').some(word => 
                                word.length > 3 && question.domain.toLowerCase().includes(word)
                              );
        
        if (!subdomainMatch) {
          return false;
        }
        
        // Check skill matching (more flexible)
        const skillMatch = questionSkill.includes(selectedSkill) ||
                          selectedSkill.includes(questionSkill) ||
                          // Check for partial matches
                          selectedSkill.split(' ').some(word => 
                            word.length > 3 && questionSkill.includes(word)
                          ) ||
                          questionSkill.split(' ').some(word => 
                            word.length > 3 && selectedSkill.includes(word)
                          );
        
        const matches = domainMatch && subdomainMatch && skillMatch;
        
        if (matches) {
          console.log(`Question matches: MainDomain=${questionMainDomain}, Domain=${question.domain}, Skill=${question.skill}`);
          console.log(`Selected: MainDomain=${selected.mainDomain}, Subdomain=${selected.subdomain}, Topic=${selected.topic}`);
        }
        
        return matches;
      });
    });
  };

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current && isChatOpen) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isChatOpen]);

  // Handle initial chat message
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      setChatMessages([{
        text: "Hi! I'm your AI tutor, here to help you with this question. Feel free to ask me anything!",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isChatOpen]);

  // Toggle chat slider
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Close chat when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isChatOpen && window.innerWidth <= 768) {
        const chatSlider = document.querySelector('.chat-slider');
        const aiTutorButton = document.querySelector('.ai-tutor-button');
        
        if (chatSlider && !chatSlider.contains(e.target) && 
            aiTutorButton && !aiTutorButton.contains(e.target)) {
          setIsChatOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isChatOpen]);

  // Send chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    
    // Add user message
    const newUserMessage = {
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newUserMessage]);
    setIsLoadingResponse(true);

    try {
      const response = await getAIResponse(userMessage);
      
      const aiResponse = {
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  // Get AI response from Groq API using SDK
  const getAIResponse = async (userMessage) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    const contextMessage = `You are an AI tutor helping a student with SAT practice questions. 
    Current question context:
    Domain: ${currentQuestion.domain}
    Skill: ${currentQuestion.skill}
    Difficulty: ${currentQuestion.difficulty}
    Question: ${currentQuestion.questionText}
    Options: ${currentQuestion.options.join(', ')}
    Correct Answer: ${currentQuestion.correctOption}
    
    Provide helpful, educational responses and explanations. Don't give away the answer directly if the student hasn't attempted it yet.`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: contextMessage
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        model: "llama-3.1-8b-instant", // You can change this model if needed
        temperature: 0.7,
        max_completion_tokens: 500,
        top_p: 1,
        stream: false,
      });

      return chatCompletion.choices[0]?.message?.content || "Sorry, I didn't get a response.";
    } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
    }
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (!selectedOption) {
      setSelectedOption(option);
      setShowExplanation(true);
    }
  };

  // Check if option is correct
  const isOptionCorrect = (option) => {
    const currentQuestion = questions[currentQuestionIndex];
    const optionLetter = option.charAt(0); // Extract first character (A, B, C, D)
    return optionLetter === currentQuestion.correctOption;
  };

  // Navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      // Clear chat when moving to next question
      setChatMessages([]);
      setIsChatOpen(false);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setShowExplanation(false);
      // Clear chat when moving to previous question
      setChatMessages([]);
      setIsChatOpen(false);
    }
  };

  const finishSession = () => {
    navigate('/digital-sat-practice-questions');
  };

  // Get option styling
  const getOptionStyle = (option) => {
    if (!showExplanation) {
      return {
        border: selectedOption === option ? '2px solid #4A7C59' : '1px solid #ddd',
        backgroundColor: selectedOption === option ? '#F0F9F1' : 'white'
      };
    }
    
    if (isOptionCorrect(option)) {
      return {
        border: '2px solid #4A7C59',
        backgroundColor: '#E8F5E9'
      };
    } else if (option === selectedOption && !isOptionCorrect(option)) {
      return {
        border: '2px solid #e74c3c',
        backgroundColor: '#FFEBEE'
      };
    }
    
    return {
      border: '1px solid #ddd',
      backgroundColor: 'white'
    };
  };

  // Chat message component
  const ChatMessage = ({ message }) => (
    <div className={`chat-message ${message.isUser ? 'user' : 'ai'}`}>
      <div className="chat-avatar">
        {message.isUser ? <FaUser /> : <FaBrain />}
      </div>
      <div className="chat-content">
        <div className="chat-text">{message.text}</div>
        <div className="chat-time">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );

  // Navigation Drawer Component
  const NavigationDrawer = () => (
    <div className={`nav-drawer ${mobileDrawerOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <h3>SAT Prep Pro</h3>
        <p>Practice Session</p>
      </div>
      <div className="drawer-items">
        <div className="drawer-item" onClick={() => { navigate('/'); setMobileDrawerOpen(false); }}>
          <FaHome /> <span>Home</span>
        </div>
        <div className="drawer-item" onClick={() => { navigate('/digital-sat-practice-questions'); setMobileDrawerOpen(false); }}>
          <FaBook /> <span>Study Plan</span>
        </div>
        <div className="drawer-item" onClick={() => { navigate('/roadmap'); setMobileDrawerOpen(false); }}>
          <FaRoad /> <span>Roadmap</span>
        </div>
        <div className="drawer-item" onClick={() => { navigate('/colleges'); setMobileDrawerOpen(false); }}>
          <FaUniversity /> <span>Colleges</span>
        </div>
        <div className="drawer-item" onClick={() => { navigate('/game'); setMobileDrawerOpen(false); }}>
          <FaGamepad /> <span>Game</span>
        </div>
        <div className="drawer-item" onClick={() => { navigate('/profile'); setMobileDrawerOpen(false); }}>
          <FaUserCircle /> <span>Profile</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="practice-page loading">
        <FaSpinner className="spinner" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="practice-page">
        <header className="app-bar">
          <div className="app-bar-left" onClick={() => navigate('/digital-sat-practice-questions')}>
            <div className="logo">SAT</div>
            <h1>Practice Session</h1>
          </div>
        </header>
        <div className="no-questions">
          <FaQuestionCircle size={48} color="#f39c12" />
          <h2>No Questions Found</h2>
          <p>No questions match your selected topics. Please try different topics.</p>
          <p className="debug-info">Debug: Try selecting topics from both Math and Reading/Writing domains</p>
          <button 
            className="back-button"
            onClick={() => navigate('/digital-sat-practice-questions')}
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="practice-page">
      {/* Mobile Navigation Drawer */}
      {mobileDrawerOpen && <div className="drawer-overlay" onClick={() => setMobileDrawerOpen(false)} />}
      <NavigationDrawer />

      {/* Header */}
      <header className="app-bar">
        <div className="app-bar-left" onClick={() => navigate('/digital-sat-practice-questions')}>
          <div className="logo">
            <FaGraduationCap />
          </div>
          <h1>Practice Session</h1>
        </div>
        
        <div className="app-bar-right">
          <button 
            className="ai-tutor-button"
            onClick={toggleChat}
          >
            <FaBrain /> AI Tutor
          </button>
          <div className="question-counter">
            {currentQuestionIndex + 1}/{questions.length}
          </div>
        </div>
      </header>

      {/* Chat Overlay for mobile */}
      {isChatOpen && window.innerWidth <= 768 && (
        <div 
          className={`chat-overlay ${isChatOpen ? 'visible' : ''}`}
          onClick={() => setIsChatOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="practice-container">
        
        <div className={`content-wrapper ${isChatOpen ? 'chat-open' : ''}`}>
          {/* Question Section */}
          <div className="question-section">
            {/* Question Header with Domain and Difficulty on same line */}
            <div className="question-header">
              <div className="header-top-row">
                <h1 className="domain">{currentQuestion.domain} Questions</h1>
                <div className={`difficulty-badge ${currentQuestion.difficulty.toLowerCase()}`}>
                  {currentQuestion.difficulty}
                </div>
              </div>
              <span className="skill">{currentQuestion.skill}</span>
            </div>

            {/* Question Text - USING NEW RENDER FUNCTION */}
            <div className="question-text">
              {renderQuestionText(currentQuestion.questionText, 18, { color: '#2c3e50' })}
            </div>

            {/* Image (if any) */}
            {currentQuestion.imagePath && (
              <div className="question-image">
                <img 
                  src={currentQuestion.imagePath} 
                  alt="Question diagram" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<p>Image not available</p>';
                  }}
                />
              </div>
            )}

            {/* Options */}
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-card ${selectedOption === option ? 'selected' : ''}`}
                  style={getOptionStyle(option)}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="option-selector">
                    {showExplanation ? (
                      isOptionCorrect(option) ? (
                        <FaCheckCircle className="option-icon correct" />
                      ) : option === selectedOption ? (
                        <FaTimesCircle className="option-icon incorrect" />
                      ) : (
                        <div className="option-circle" />
                      )
                    ) : (
                      <div className={`option-circle ${selectedOption === option ? 'filled' : ''}`} />
                    )}
                  </div>
                  <div className="option-text">
                    {renderTextWithLatex(option, 16, { color: '#34495e' })}
                  </div>
                </div>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="explanation-container">
                <h4>Explanation:</h4>
                {renderQuestionText(currentQuestion.explanation, 16, { color: '#7f8c8d' })}
              </div>
            )}
          

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
              {!isFirstQuestion && (
                <button 
                  className="nav-button previous"
                  onClick={goToPreviousQuestion}
                >
                  <FaChevronLeft /> Previous
                </button>
              )}
              <button 
                className={`nav-button ${isLastQuestion ? 'finish' : 'next'}`}
                onClick={isLastQuestion ? finishSession : goToNextQuestion}
              >
                {isLastQuestion ? 'Finish Session' : 'Next Question'}
                {!isLastQuestion && <FaChevronRight />}
              </button>
            </div>
          </div>
        </div>

        {/* AI Tutor Chat Slider */}
        <div className={`chat-slider ${isChatOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <div className="chat-header-left">
              <FaBrain />
              <h3>AI Tutor Assistant</h3>
            </div>
            <button 
              className="close-chat"
              onClick={toggleChat}
            >
              ×
            </button>
          </div>

          <div className="chat-messages" ref={chatScrollRef}>
            {chatMessages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoadingResponse && (
              <div className="chat-message ai">
                <div className="chat-avatar">
                  <FaBrain />
                </div>
                <div className="chat-content">
                  <div className="loading-response">
                    <FaSpinner className="spinner-small" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything about this question..."
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              disabled={isLoadingResponse}
            />
            <button 
              className="send-button"
              onClick={sendChatMessage}
              disabled={isLoadingResponse || !chatInput.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;