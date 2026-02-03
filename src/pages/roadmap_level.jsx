import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './RoadmapLevel.css';
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
  FaQuestionCircle,
  FaBook,
  FaCalculator,
  FaChartBar,
  FaAngleRight,
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaRoad,
  FaGraduationCap,
  FaClock,
  FaImage
} from 'react-icons/fa';
import BannerAd from '../banner';

const RoadmapLevel = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isCompletingLevel, setIsCompletingLevel] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Timer variables
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // AI Tutor variables
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  
  const chatScrollRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize Groq client with API key (same as PracticePage.jsx)
  const groq = new Groq({
    //here
    dangerouslyAllowBrowser: true
  });

  // Extract route parameters from location state or use default
  const skillData = location.state || {
    skillName: 'Lines, Angles, and Triangles',
    domain: 'Math',
    category: 'Geometry and Trigonometry',
    currentLevel: 0,
    roadmapString: '',
    userData: user || null
  };

  const { skillName, domain, category, currentLevel: initialLevel, roadmapString, userData } = skillData;

  // Color theme
  const colors = {
    primary: '#2B463C',
    secondary: '#4A7C59',
    accent: '#8FCB9B',
    background: '#F8F9F5'
  };

  // Timer functions
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerRunning, timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Pause/resume timer
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  // Reset timer to 1 hour
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(3600);
    setIsTimerRunning(true);
  };

  // Function to extract and render LaTeX from text
  const renderTextWithLatex = (text, fontSize = 16, textStyle = {}) => {
    if (!text || typeof text !== 'string') return text;
    
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
        .replace(/^\\\(/, '')
        .replace(/\\\)$/, '')
        .replace(/^\\\[/, '')
        .replace(/\\\]$/, '');

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

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
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
          difficulty: item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1),
          questionText: item.question_text,
          options: item.options,
          correctOption: item.correct_option,
          explanation: item.explanation,
          imagePath: item.image && item.image.trim() !== '' ? item.image : null
        }));
        
        // Filter questions by skill name - make sure this matches
        const skillQuestions = formattedQuestions.filter(q => 
          q.skill.toLowerCase().trim() === skillName.toLowerCase().trim()
        );
        
        // If no exact match, try partial match
        let filteredQuestions = skillQuestions;
        if (skillQuestions.length === 0) {
          filteredQuestions = formattedQuestions.filter(q => 
            q.skill.toLowerCase().includes(skillName.toLowerCase()) ||
            skillName.toLowerCase().includes(q.skill.toLowerCase())
          );
        }
        
        // Shuffle and limit to 20 questions
        const shuffledQuestions = [...filteredQuestions]
          .sort(() => Math.random() - 0.5)
          .slice(0, 50);
        
        setQuestions(shuffledQuestions);
        setIsLoading(false);
        
        if (shuffledQuestions.length === 0) {
          console.warn(`No questions found for skill: ${skillName}`);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        setQuestions([]);
        setIsLoading(false);
      }
    };

    if (skillName) {
      loadQuestions();
    }
  }, [skillName]);

  // Reset image error when question changes
  useEffect(() => {
    setImageError(false);
  }, [currentQuestionIndex]);

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
        text: `Hi! I'm your AI tutor, here to help you with ${skillName} questions. Feel free to ask me anything!`,
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isChatOpen, skillName]);

  // Toggle chat panel
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

  // Get AI response from Groq API using SDK (same as PracticePage.jsx)
  const getAIResponse = async (userMessage) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    const contextMessage = `You are an AI SAT tutor helping a student with practice questions. 
    Current question context:
    Domain: ${currentQuestion.domain}
    Skill: ${currentQuestion.skill}
    Difficulty: ${currentQuestion.difficulty}
    Question: ${currentQuestion.questionText}
    Options: ${currentQuestion.options.join(', ')}
    Correct Answer: ${currentQuestion.correctOption}
    
    The student is working on a roadmap level for ${skillName} in ${domain}.
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
    if (showExplanation) return; // Prevent changing answer after explanation is shown

    setSelectedOption(option);
    setShowExplanation(true);

    // Check if answer is correct
    const currentQuestion = questions[currentQuestionIndex];
    if (isOptionCorrect(currentQuestion, option)) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  // Check if option is correct
  const isOptionCorrect = (question, option) => {
    const optionLetter = option.charAt(0); // Extract first character (A, B, C, D)
    return optionLetter === question.correctOption;
  };

  // Navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setImageError(false);
      // Clear chat when moving to next question
      setChatMessages([]);
      setIsChatOpen(false);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setImageError(false);
      // Clear chat when moving to previous question
      setChatMessages([]);
      setIsChatOpen(false);
    }
  };

  // Complete level and save progress
  const completeLevel = async () => {
    if (isCompletingLevel) return;

    setIsCompletingLevel(true);

    try {
      // Calculate accuracy percentage
      const accuracyPercentage = Math.round((correctAnswers / questions.length) * 100);

      // Stop timer
      setIsTimerRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Show completion dialog
      const userConfirmed = window.confirm(
        `🎉 Level Complete!\n\n` +
        `Congratulations! You've completed the ${skillName} level.\n\n` +
        `Accuracy: ${correctAnswers}/${questions.length} (${accuracyPercentage}%)\n` +
        `Time: ${formatTime(3600 - timeLeft)}\n\n` +
        `${accuracyPercentage >= 70 ? 
          "Great job! You're ready for the next level." : 
          "Good effort! Keep practicing to improve your skills."}\n\n` +
        `Click OK to continue to your roadmap.`
      );

      if (userConfirmed) {
        // Save progress to backend (if implemented)
        if (userData?.email) {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://sat-blog-worker.tejasbalkhande221.workers.dev/api/roadmap', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({ 
                email: userData.email, 
                roadmapString: roadmapString, 
                level: initialLevel + 1 
              }),
            });

            if (response.ok) {
              console.log('Progress saved successfully');
            }
          } catch (error) {
            console.error('Error saving progress:', error);
          }
        }

        // Navigate back to roadmap
        navigate('/roadmap');
      }
    } catch (error) {
      console.error('Error completing level:', error);
    } finally {
      setIsCompletingLevel(false);
    }
  };

  // Get option styling
  const getOptionStyle = (question, option) => {
    if (!showExplanation) {
      return {
        border: selectedOption === option ? '2px solid #4A7C59' : '1px solid #ddd',
        backgroundColor: selectedOption === option ? '#F0F9F1' : 'white'
      };
    }
    
    if (isOptionCorrect(question, option)) {
      return {
        border: '2px solid #4A7C59',
        backgroundColor: '#E8F5E9'
      };
    } else if (option === selectedOption && !isOptionCorrect(question, option)) {
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

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Chat message component
  const ChatMessage = ({ message }) => (
    <div className={`chat-message ${message.isUser ? 'user' : 'ai'}`}>
      <div className="chat-avatar">
        {message.isUser ? <FaUserCircle /> : <FaBrain />}
      </div>
      <div className="chat-content">
        <div className="chat-text">{message.text}</div>
        <div className="chat-time">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="roadmap-level loading">
        <div className="loading-spinner">
          <FaSpinner className="spinner" />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="roadmap-level">
        <header className="app-bar">
          <div className="app-bar-left" onClick={() => navigate('/roadmap')}>
            <div className="logo">SAT</div>
            <h1>Roadmap Level</h1>
          </div>
        </header>
        <div className="no-questions">
          <FaQuestionCircle size={48} color="#f39c12" />
          <h2>No Questions Found</h2>
          <p>No questions found for skill: {skillName}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/roadmap')}
          >
            Back to Roadmap
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasImage = currentQuestion.imagePath && currentQuestion.imagePath.trim() !== '' && !imageError;

  return (
    <div className="roadmap-level">
      {/* Chat Overlay for mobile */}
      {isChatOpen && window.innerWidth <= 768 && (
        <div 
          className={`chat-overlay ${isChatOpen ? 'visible' : ''}`}
          onClick={() => setIsChatOpen(false)}
        />
      )}

      {/* Header */}
      <header className="app-bar">
        <div className="app-bar-left" onClick={() => navigate('/roadmap')}>
          <div className="logo">
            <FaGraduationCap />
          </div>
          <h1>{skillName} Level</h1>
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

      {/* Main Content */}
      <div className="practice-container">
        <div className={`content-wrapper ${isChatOpen ? 'chat-open' : ''}`}>
          {/* Question Section */}
          <div className="question-section">
            {/* Question Header */}
            <div className="question-header">
              <div className="header-top-row">
                <h3 className="domain">{currentQuestion.domain}</h3>
                <div className={`difficulty-badge ${currentQuestion.difficulty.toLowerCase()}`}>
                  {currentQuestion.difficulty}
                </div>
              </div>
              <span className="skill">{currentQuestion.skill}</span>
              
              {/* Score, Timer and Progress */}
              <div className="level-progress-info">
                <div className="score-display">
                  <FaChartBar />
                  <span>Score: {correctAnswers}/{currentQuestionIndex + (showExplanation ? 1 : 0)}</span>
                  <div className="timer-display">
                    <FaClock />
                    <span className={`time-text ${timeLeft < 300 ? 'time-warning' : ''} ${timeLeft === 0 ? 'time-up' : ''}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
                <div className="progress-info">
                  Progress: {currentQuestionIndex + 1} of {questions.length}
                </div>
              </div>
            </div>

            {/* Question Text - USING NEW RENDER FUNCTION */}
            <div className="question-text">
              {renderQuestionText(currentQuestion.questionText, 18, { color: '#2c3e50' })}
            </div>

            {/* Image (if any) */}
            {hasImage && (
              <div className="question-image">
                <img 
                  src={currentQuestion.imagePath} 
                  alt="Question diagram" 
                  onError={handleImageError}
                />
              </div>
            )}

            {/* Image error message */}
            {imageError && (
              <div className="image-error-message">
                <FaImage />
                <span>Image not available</span>
              </div>
            )}

            {/* Options */}
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-card ${selectedOption === option ? 'selected' : ''}`}
                  style={getOptionStyle(currentQuestion, option)}
                  onClick={() => handleOptionSelect(option)}
                >
                  <div className="option-selector">
                    {showExplanation ? (
                      isOptionCorrect(currentQuestion, option) ? (
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

            {/* Explanation - USING NEW RENDER FUNCTION */}
            {showExplanation && (
              <div className="explanation-container">
                <h4>Explanation:</h4>
                <div className="explanation-text">
                  {renderQuestionText(currentQuestion.explanation, 16, { color: '#7f8c8d' })}
                </div>
              </div>
            )}

            <BannerAd key={currentQuestionIndex} />
            <div style={{ marginBottom: "80px" }}></div>

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
              {!isFirstQuestion && (
                <button 
                  className="nav-button previous"
                  onClick={goToPreviousQuestion}
                  disabled={isCompletingLevel}
                >
                  <FaChevronLeft /> Previous
                </button>
              )}
              <button 
                className={`nav-button ${isLastQuestion ? 'finish' : 'next'}`}
                onClick={isLastQuestion ? completeLevel : goToNextQuestion}
                disabled={isCompletingLevel}
              >
                {isCompletingLevel ? (
                  <>
                    <FaSpinner className="spinner-small" /> Completing...
                  </>
                ) : isLastQuestion ? (
                  'Complete Level'
                ) : (
                  <>
                    Next Question <FaChevronRight />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AI Tutor Chat Slider */}
        <div className={`chat-slider ${isChatOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <div className="chat-header-left">
              <FaBrain />
              <h3>Roadmap Level Tutor</h3>
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
                    <span>Thinking...</span>
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
export default RoadmapLevel;