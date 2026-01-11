import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './mock_test_screen.css';
import {
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaFlag,
  FaGraduationCap,
  FaHome,
  FaBook,
  FaRoad,
  FaUniversity,
  FaGamepad,
  FaUserCircle,
  FaSpinner,
  FaQuestionCircle,
  FaTh,
  FaCheckCircle,
  FaCalculator,
  FaBookOpen
} from 'react-icons/fa';

// Question model
class Question {
  constructor(data) {
    this.questionId = data.question_id;
    this.assessment = data.assessment;
    this.test = data.test;
    this.domain = data.domain;
    this.skill = data.skill;
    this.difficulty = data.difficulty;
    this.questionText = data.question_text;
    this.options = data.options;
    this.correctOption = data.correct_option;
    this.explanation = data.explanation;
    this.image = data.image;
  }
}

// Answer state model
class AnswerState {
  constructor() {
    this.selectedOption = null;
    this.marked = false;
  }
}

const MockTestScreen = () => {
  const { mockTestId } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [readingWritingQuestions, setReadingWritingQuestions] = useState([]);
  const [mathQuestions, setMathQuestions] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [readingWritingAnswerStates, setReadingWritingAnswerStates] = useState([]);
  const [mathAnswerStates, setMathAnswerStates] = useState([]);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  
  // Refs
  const timerRef = useRef(null);
  const questionAreaRef = useRef(null);
  
  // Computed values
  const currentSectionQuestions = currentSectionIndex === 0 ? readingWritingQuestions : mathQuestions;
  const currentAnswerStates = currentSectionIndex === 0 ? readingWritingAnswerStates : mathAnswerStates;
  const totalReadingWritingTime = 64 * 60;
  const totalMathTime = 70 * 60;
  
  // Function to render text with LaTeX (same as PracticePage)
  const renderTextWithLatex = (text, fontSize = 16, textStyle = {}) => {
    if (!text || typeof text !== 'string') return text;
    
    const latexPattern = /\\\[.*?\\\]|\\\(.*?\\\)|\\(?:frac|sqrt|sum|int|lim|sin|cos|tan|log|ln)\b/g;
    
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

    if (latexMatches.length === 0) {
      return <span style={{ fontSize: `${fontSize}px`, ...textStyle }}>{text}</span>;
    }

    const parts = [];
    let currentIndex = 0;

    latexMatches.forEach((match, i) => {
      if (match.index > currentIndex) {
        parts.push(
          <span key={`plain-${i}`} style={{ fontSize: `${fontSize}px`, ...textStyle }}>
            {textToProcess.substring(currentIndex, match.index)}
          </span>
        );
      }

      const latexContent = match.text
        .replace(/^\\\(/, '')
        .replace(/\\\)$/, '')
        .replace(/^\\\[/, '')
        .replace(/\\\]$/, '');

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
        // Check if mockTestId is provided
        if (!mockTestId) {
          throw new Error('No mock test ID provided');
        }
        
        console.log(`Loading questions for mock test: ${mockTestId}`);
        
        // Try to load from public/mockquestions directory
        const response = await fetch(`/mockquestions/${mockTestId}.json`);
        
        if (!response.ok) {
          // If not found in mockquestions, try root of public folder
          const altResponse = await fetch(`/${mockTestId}.json`);
          if (!altResponse.ok) {
            throw new Error(`Failed to load questions: ${response.status} ${response.statusText}`);
          }
          const data = await altResponse.json();
          processQuestions(data);
        } else {
          const data = await response.json();
          processQuestions(data);
        }
        
      } catch (error) {
        console.error('Error loading questions:', error);
        setIsLoading(false);
        navigate('/digital-sat-practice-questions'); // Redirect back to study plan
      }
    };
    
    // Helper function to process questions data
    const processQuestions = (data) => {
      if (!Array.isArray(data)) {
        throw new Error('Invalid questions data format');
      }
      
      const allQuestions = data.map(item => new Question(item));
      
      const readingWriting = allQuestions.filter(q => q.test === "Reading and Writing");
      const math = allQuestions.filter(q => q.test === "Math");
      
      console.log(`Loaded ${readingWriting.length} Reading & Writing questions and ${math.length} Math questions`);
      
      setReadingWritingQuestions(readingWriting);
      setMathQuestions(math);
      setReadingWritingAnswerStates(Array(readingWriting.length).fill().map(() => new AnswerState()));
      setMathAnswerStates(Array(math.length).fill().map(() => new AnswerState()));
      setRemainingSeconds(totalReadingWritingTime);
      setIsLoading(false);
      setShowWelcomeScreen(true);
    };
    
    loadQuestions();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [mockTestId, navigate]);
  
  // Start test function
  const startTest = () => {
    setTestStarted(true);
    setShowWelcomeScreen(false);
    startTimer();
  };
  
  // Start timer
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Navigate to question
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    
    if (questionAreaRef.current) {
      questionAreaRef.current.scrollTop = 0;
    }
  };
  
  // Toggle mark for review
  const toggleMarkForReview = () => {
    const newStates = [...currentAnswerStates];
    newStates[currentQuestionIndex].marked = !newStates[currentQuestionIndex].marked;
    
    if (currentSectionIndex === 0) {
      setReadingWritingAnswerStates(newStates);
    } else {
      setMathAnswerStates(newStates);
    }
  };
  
  // Select option
  const selectOption = (option) => {
    const newStates = [...currentAnswerStates];
    newStates[currentQuestionIndex].selectedOption = option;
    
    if (currentSectionIndex === 0) {
      setReadingWritingAnswerStates(newStates);
    } else {
      setMathAnswerStates(newStates);
    }
  };
  
  // Submit test
  const submitTest = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTestCompleted(true);
  };
  
  // Finish section
  const finishSection = () => {
    if (currentSectionIndex === 0) {
      setCurrentSectionIndex(1);
      setCurrentQuestionIndex(0);
      setRemainingSeconds(totalMathTime);
      if (questionAreaRef.current) {
        questionAreaRef.current.scrollTop = 0;
      }
    } else {
      showSubmitConfirmation();
    }
    setIsSidebarOpen(false);
  };
  
  // Submit confirmation
  const showSubmitConfirmation = () => {
    const shouldSubmit = window.confirm(
      'Submit Test?\n\nAre you sure you want to submit your test? ' +
      'You will not be able to make changes after submission.'
    );
    
    if (shouldSubmit) {
      submitTest();
    }
  };
  
  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Timer widget
  const TimerWidget = () => (
    <div className="timer-widget">
      <FaClock className="timer-icon" />
      <span className="timer-text">{formatTime(remainingSeconds)}</span>
    </div>
  );
  
  // Loading Component - Single spinner for all loading states
  const LoadingScreen = () => (
    <div className="mock-test-container loading">
      <header className="app-header">
        <div className="app-header-left" onClick={() => navigate('/digital-sat-practice-questions')}>
          <div className="logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </div>
          <h1>Mock SAT Exam</h1>
        </div>
      </header>
      <div className="loading-spinner">
        <FaSpinner className="spinner" />
      </div>
    </div>
  );
  
  // Welcome Screen Component
  const WelcomeScreen = () => {
    return (
      <div className="mock-test-container welcome-screen">
        <header className="app-header">
          <div className="app-header-left" onClick={() => navigate('/digital-sat-practice-questions')}>
            <div className="logo">
              <img src="/logo.png" alt="Logo" className="logo-img" />
            </div>
            <h1>Mock SAT Exam</h1>
          </div>
        </header>
        
        <div className="welcome-content">
          <div className="welcome-card">
            <div className="welcome-header">
              <FaGraduationCap className="welcome-icon" />
              <h1>SAT Practice Test</h1>
              <p className="welcome-subtitle">Get ready to demonstrate your skills</p>
            </div>
            
            <div className="test-info-section">
              <div className="info-card">
                <div className="info-icon reading">
                  <FaBookOpen />
                </div>
                <div className="info-content">
                  <h3>Reading & Writing</h3>
                  <p className="info-stats">
                    <span className="stat-item">
                      <strong>{readingWritingQuestions.length}</strong> Questions
                    </span>
                    <span className="stat-item">
                      <strong>{totalReadingWritingTime / 60}</strong> Minutes
                    </span>
                  </p>
                  <p className="info-description">
                    Covers reading comprehension, grammar, and writing skills
                  </p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon math">
                  <FaCalculator />
                </div>
                <div className="info-content">
                  <h3>Math</h3>
                  <p className="info-stats">
                    <span className="stat-item">
                      <strong>{mathQuestions.length}</strong> Questions
                    </span>
                    <span className="stat-item">
                      <strong>{totalMathTime / 60}</strong> Minutes
                    </span>
                  </p>
                  <p className="info-description">
                    Includes algebra, geometry, trigonometry, and data analysis
                  </p>
                </div>
              </div>
            </div>
            
            <div className="start-test-section">
              <button 
                className="start-test-button"
                onClick={startTest}
              >
                <FaCheckCircle className="start-icon" />
                I'm Ready
              </button>
              <button 
                className="back-button"
                onClick={() => navigate('/digital-sat-practice-questions')}
              >
                <FaChevronLeft />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Question grid sidebar
  const QuestionGridSidebar = () => {
    return (
      <div className={`question-grid-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="grid-header">
          <h3>{currentSectionIndex === 0 ? 'Reading & Writing' : 'Math'} Questions</h3>
          <button 
            className="close-grid"
            onClick={() => setIsSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        
        <div className="grid-container">
          {currentSectionQuestions.map((_, index) => {
            const state = currentAnswerStates[index];
            return (
              <div
                key={index}
                className={`grid-item ${index === currentQuestionIndex ? 'current' : ''} ${
                  state.selectedOption ? 'answered' : state.marked ? 'marked' : 'unanswered'
                }`}
                onClick={() => goToQuestion(index)}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
        
        <div className="finish-section-container">
          <button className="finish-section-btn" onClick={finishSection}>
            {currentSectionIndex === 0 ? 'Next Section →' : 'Submit Test'}
          </button>
        </div>
      </div>
    );
  };
  
  // Loading state - use single LoadingScreen component
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Show welcome screen
  if (showWelcomeScreen) {
    return <WelcomeScreen />;
  }
  
  // Test not started
  if (!testStarted) {
    return <LoadingScreen />;
  }
  
  // Test completed - show results
  if (testCompleted) {
    return (
      <MockTestResultsScreen
        readingWritingQuestions={readingWritingQuestions}
        mathQuestions={mathQuestions}
        readingWritingAnswerStates={readingWritingAnswerStates}
        mathAnswerStates={mathAnswerStates}
        renderTextWithLatex={renderTextWithLatex}
        renderQuestionText={renderQuestionText}
      />
    );
  }
  
  // No questions
  if (currentSectionQuestions.length === 0) {
    return (
      <div className="mock-test-container">
        <header className="app-header">
          <div className="app-header-left" onClick={() => navigate('/digital-sat-practice-questions')}>
            <div className="logo">
              <img src="/logo.png" alt="Logo" className="logo-img" />
            </div>
            <h1>Mock SAT Exam</h1>
          </div>
        </header>
        <div className="no-questions">
          <FaQuestionCircle size={48} color="#f39c12" />
          <h2>No Questions Found</h2>
          <p>No questions were loaded for this test.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/digital-sat-practice-questions')}
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }
  
  const question = currentSectionQuestions[currentQuestionIndex];
  const answerState = currentAnswerStates[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === currentSectionQuestions.length - 1;
  const progress = (currentQuestionIndex + 1) / currentSectionQuestions.length;
  
  return (
    <div className="mock-test-container">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div 
          className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Question Grid Sidebar */}
      <QuestionGridSidebar />
      
      {/* Header */}
      <header className="app-header">
        <div className="app-header-left" onClick={() => navigate('/digital-sat-practice-questions')}>
          <div className="logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </div>
          <h1>{currentSectionIndex === 0 ? 'Reading & Writing' : 'Math'} Section</h1>
        </div>
        
        <div className="header-actions">
          <TimerWidget />
          <button 
            className="grid-toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaTh />
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="main-content-wrapper">
        {/* Question Area */}
        <div className="question-area" ref={questionAreaRef}>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          
          {/* Question Header */}
          <div className="question-header">
            <div className="header-top-row">
              <h3 className="domain">{question.domain}</h3>
              <div className={`difficulty-badge ${question.difficulty.toLowerCase()}`}>
                {question.difficulty}
              </div>
            </div>
            <span className="skill">{question.skill}</span>
          </div>
          
          {/* Question Text - USING NEW RENDER FUNCTION */}
          <div className="question-text">
            {renderQuestionText(question.questionText, 18, { color: '#2c3e50' })}
          </div>
          
          {/* Image - ONLY SHOW IF IMAGE EXISTS IN JSON */}
          {question.image && question.image.trim() !== '' && (
            <div className="question-image">
              <img 
                src={`/${question.image}`} 
                alt="Question diagram" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.error(`Failed to load image: /${question.image}`);
                }}
              />
            </div>
          )}
          
          {/* Options */}
          <div className="options-container">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option-card ${answerState.selectedOption === option ? 'selected' : ''}`}
                onClick={() => selectOption(option)}
              >
                <div className="option-selector">
                  <div className={`option-circle ${answerState.selectedOption === option ? 'filled' : ''}`} />
                </div>
                <div className="option-text">
                  {renderTextWithLatex(option, 16, { color: '#34495e' })}
                </div>
              </div>
            ))}
          </div>
          
        </div>
        
      </div>
      
      
      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button
          className="nav-button previous"
          disabled={isFirstQuestion}
          onClick={() => goToQuestion(currentQuestionIndex - 1)}
        >
          <FaChevronLeft /> Previous
        </button>
        
        <button
          className={`nav-button mark ${answerState.marked ? 'marked' : ''}`}
          onClick={toggleMarkForReview}
        >
          <FaFlag /> {answerState.marked ? 'Marked' : 'Mark for Review'}
        </button>
        
        <button
          className="nav-button next"
          onClick={() => {
            if (isLastQuestion) {
              finishSection();
            } else {
              goToQuestion(currentQuestionIndex + 1);
            }
          }}
        >
          {isLastQuestion ? (currentSectionIndex === 0 ? 'Next Section' : 'Submit Test') : 'Next Question'}
          {!isLastQuestion && <FaChevronRight />}
        </button>
      </div>
    </div>
  );
};

// Results Screen Component
const MockTestResultsScreen = ({ 
  readingWritingQuestions, 
  mathQuestions, 
  readingWritingAnswerStates, 
  mathAnswerStates,
  renderTextWithLatex,
  renderQuestionText
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  
  // Calculate scores
  const calculateScore = (questions, answerStates) => {
    return questions.reduce((score, question, index) => {
      if (answerStates[index]?.selectedOption?.startsWith(question.correctOption)) {
        return score + 1;
      }
      return score;
    }, 0);
  };
  
  // Calculate section stats
  const calculateSectionStats = (questions, answerStates) => {
    let correct = 0;
    let incorrect = 0;
    let omitted = 0;
    
    questions.forEach((question, index) => {
      const state = answerStates[index];
      if (!state || !state.selectedOption) {
        omitted++;
      } else if (state.selectedOption.startsWith(question.correctOption)) {
        correct++;
      } else {
        incorrect++;
      }
    });
    
    const total = questions.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    return { correct, incorrect, omitted, total, accuracy };
  };
  
  // Calculate skill accuracy
  const calculateSkillAccuracy = (questions, answerStates) => {
    const skillResults = {};
    
    questions.forEach((question, index) => {
      const skill = question.skill;
      const isCorrect = answerStates[index]?.selectedOption?.startsWith(question.correctOption);
      
      if (!skillResults[skill]) {
        skillResults[skill] = { correct: 0, total: 0 };
      }
      
      skillResults[skill].total++;
      if (isCorrect) {
        skillResults[skill].correct++;
      }
    });
    
    const skillAccuracy = {};
    Object.keys(skillResults).forEach(skill => {
      const { correct, total } = skillResults[skill];
      skillAccuracy[skill] = total > 0 ? (correct / total) * 100 : 0;
    });
    
    return skillAccuracy;
  };
  
  const readingWritingScore = calculateScore(readingWritingQuestions, readingWritingAnswerStates);
  const mathScore = calculateScore(mathQuestions, mathAnswerStates);
  const totalScore = readingWritingScore + mathScore;
  const maxReadingWritingScore = readingWritingQuestions.length;
  const maxMathScore = mathQuestions.length;
  const maxTotalScore = maxReadingWritingScore + maxMathScore;
  
  const rwStats = calculateSectionStats(readingWritingQuestions, readingWritingAnswerStates);
  const mathStats = calculateSectionStats(mathQuestions, mathAnswerStates);
  
  const rwSkillAccuracy = calculateSkillAccuracy(readingWritingQuestions, readingWritingAnswerStates);
  const mathSkillAccuracy = calculateSkillAccuracy(mathQuestions, mathAnswerStates);
  
  // Score card
  const ScoreCard = ({ title, score, maxScore, icon, color }) => (
    <div className="score-card" style={{ borderColor: color }}>
      <div className="score-icon" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <h3>{title}</h3>
      <div className="score-value">
        {score} / {maxScore}
      </div>
    </div>
  );
  
  // Stats card
  const StatsCard = ({ stats, color, title }) => (
    <div className="stats-card">
      <h3 style={{ color }}>{title} Performance</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Correct:</span>
          <span className="stat-value correct">{stats.correct}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Incorrect:</span>
          <span className="stat-value incorrect">{stats.incorrect}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Omitted:</span>
          <span className="stat-value omitted">{stats.omitted}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value accuracy">{stats.accuracy}%</span>
        </div>
      </div>
    </div>
  );
  
  // Skill performance
  const SkillPerformance = ({ skillAccuracy, color, title }) => {
    const sortedSkills = Object.entries(skillAccuracy)
      .sort((a, b) => a[1] - b[1]);
    
    const weakestSkills = sortedSkills.slice(0, 3);
    const strongestSkills = sortedSkills.slice(-3).reverse();
    
    return (
      <div className="skill-performance">
        <h3 style={{ color }}>{title} Skills</h3>
        
        <div className="skill-section">
          <h4>Areas to Improve</h4>
          {weakestSkills.map(([skill, accuracy]) => (
            <div key={skill} className="skill-item">
              <span className="skill-name">{skill}</span>
              <span className="skill-accuracy">{accuracy.toFixed(1)}%</span>
            </div>
          ))}
        </div>
        
        <div className="skill-section">
          <h4>Strongest Areas</h4>
          {strongestSkills.map(([skill, accuracy]) => (
            <div key={skill} className="skill-item">
              <span className="skill-name">{skill}</span>
              <span className="skill-accuracy">{accuracy.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Review tab
  const ReviewTab = ({ questions, answerStates }) => (
    <div className="review-tab">
      {questions.map((question, index) => {
        const state = answerStates[index];
        const isCorrect = state?.selectedOption?.startsWith(question.correctOption);
        
        return (
          <div key={index} className="review-card">
            <div className="review-header">
              <div className={`review-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? '✓' : '✗'} Question {index + 1}
              </div>
              <div className="review-difficulty">{question.difficulty}</div>
            </div>
            
            <div className="review-question">
              {renderQuestionText(question.questionText, 16)}
              
              {/* Show image in review if it exists */}
              {question.image && question.image.trim() !== '' && (
                <div className="question-image" style={{ marginTop: '1rem' }}>
                  <img 
                    src={`/${question.image}`} 
                    alt="Question diagram" 
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="review-answers">
              <div className="answer-item">
                <strong>Your answer:</strong>{' '}
                <span className={isCorrect ? 'correct' : 'incorrect'}>
                  {state?.selectedOption || 'Not answered'}
                </span>
              </div>
              <div className="answer-item">
                <strong>Correct answer:</strong>{' '}
                <span className="correct">{question.correctOption}</span>
              </div>
            </div>
            
            <div className="review-explanation">
              <strong>Explanation:</strong>
              <div>{renderQuestionText(question.explanation, 14, { color: '#666' })}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
  
  return (
    <div className="results-container">
      <header className="app-header">
        <div className="app-header-left" onClick={() => navigate('/digital-sat-practice-questions')}>
          <div className="logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
          </div>
          <h1>Mock SAT Exam</h1>
        </div>

        <button 
          className="app-header-back"
          onClick={() => navigate('/digital-sat-practice-questions')}
        >
          ← Back to Tests
        </button>
      </header>
      
      <div className="results-tabs">
        <button 
          className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reading' ? 'active' : ''}`}
          onClick={() => setActiveTab('reading')}
        >
          Reading & Writing
        </button>
        <button 
          className={`tab-btn ${activeTab === 'math' ? 'active' : ''}`}
          onClick={() => setActiveTab('math')}
        >
          Math
        </button>
      </div>
      
      <div className="results-content">
        {activeTab === 'summary' && (
          <div className="summary-tab">
            <h2>Test Summary</h2>
            
            <div className="scores-row">
              <ScoreCard
                title="Reading & Writing"
                score={readingWritingScore}
                maxScore={maxReadingWritingScore}
                icon="📚"
                color="#3498db"
              />
              <ScoreCard
                title="Math"
                score={mathScore}
                maxScore={maxMathScore}
                icon="🧮"
                color="#4A7C59"
              />
            </div>
            
            <div className="stats-row">
              <StatsCard
                stats={rwStats}
                color="#3498db"
                title="Reading & Writing"
              />
              <StatsCard
                stats={mathStats}
                color="#4A7C59"
                title="Math"
              />
            </div>
            
            <div className="skills-row">
              <SkillPerformance
                skillAccuracy={rwSkillAccuracy}
                color="#3498db"
                title="Reading & Writing"
              />
              <SkillPerformance
                skillAccuracy={mathSkillAccuracy}
                color="#4A7C59"
                title="Math"
              />
            </div>
            
            <div className="total-score">
              <h2>Total Score</h2>
              <div className="total-score-value">
                {totalScore} / {maxTotalScore}
              </div>
              <div className="total-score-percentage">
                {((totalScore / maxTotalScore) * 100).toFixed(1)}%
              </div>
            </div>
            
            <button 
              className="back-to-tests-btn"
              onClick={() => navigate('/digital-sat-practice-questions')}
            >
              Back to Tests
            </button>
          </div>
        )}
        
        {activeTab === 'reading' && (
          <ReviewTab
            questions={readingWritingQuestions}
            answerStates={readingWritingAnswerStates}
          />
        )}
        
        {activeTab === 'math' && (
          <ReviewTab
            questions={mathQuestions}
            answerStates={mathAnswerStates}
          />
        )}
      </div>
    </div>
  );
};

export default MockTestScreen;