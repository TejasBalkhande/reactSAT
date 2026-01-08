import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Roadmap.css';

const Roadmap = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  // Use the correct API URL for Cloudflare Worker
  const API_BASE_URL = 'https://sat-blog-worker.tejasbalkhande221.workers.dev';
  
  // Color theme
  const colors = {
    primary: '#2B463C',
    secondary: '#4A7C59',
    accent: '#8FCB9B',
    surface: '#F5F9F2',
    background: '#F8F9F5',
    error: '#E57373'
  };

  // Skill numbers mapping
  const skillNumbers = {
    'Words in Context': 1,
    'Text Structure and Purpose': 2,
    'Cross-text Connections': 3,
    'Central Ideas and Details': 4,
    'Command of Evidence': 5,
    'Inferences': 6,
    'Transitions': 7,
    'Rhetorical Synthesis': 8,
    'Boundaries': 9,
    'Form, Structure, and Sense': 10,
    'Area and Volume': 11,
    'Circles': 12,
    'Lines, Angles, and Triangles': 13,
    'Right Triangles and Trigonometry': 14,
    'Equivalent Expressions': 15,
    'Nonlinear Equations and Systems of Equations': 16,
    'Nonlinear Functions': 17,
    'Linear Equations in One Variable': 18,
    'Linear Equations in Two Variables': 19,
    'Linear Functions': 20,
    'Linear Inequalities': 21,
    'Systems of Linear Equations': 22,
    'Observational Studies and Experiments': 23,
    'One-Variable Data': 24,
    'Percentages': 25,
    'Probability': 26,
    'Ratios, Rates, Proportions, and Units': 27,
    'Sample Statistics and Margin of Error': 28,
    'Two-Variable Data': 29,
  };

  // Domain structure
  const domainStructure = {
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
          "Author's purpose",
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
    'Math': {
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
    },
  };

  // State
  const [domainLevels, setDomainLevels] = useState({
    'Geometry and Trigonometry': 2,
    'Advanced Math': 4,
    'Algebra': 3,
    'Problem-Solving and Data Analysis': 5,
    'Craft and Structure': 1,
    'Information and Ideas': 2,
    'Expression of Ideas': 4,
    'Standard English Conventions': 3,
  });
  
  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [hasExistingRoadmap, setHasExistingRoadmap] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [roadmapString, setRoadmapString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const profileMenuRef = useRef(null);

  // Check for existing roadmap on component mount
  useEffect(() => {
    // Get user from localStorage if not provided as prop
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (user) {
      setLocalUser(user);
    } else if (storedUser && storedToken) {
      setLocalUser(JSON.parse(storedUser));
    }
    
    // Close profile menu when clicking outside
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user]);

  // Check for roadmap when localUser is set
  useEffect(() => {
    if (localUser) {
      checkExistingRoadmap();
    }
  }, [localUser]);

  // API Functions - UPDATED TO USE CLOUDFLARE WORKER URL
  const getRoadmap = async (email) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/roadmap?email=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch roadmap');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting roadmap:', error);
      throw error;
    }
  };

  const saveRoadmap = async (email, roadmapString, level) => {
    try {
      console.log('📤 Saving roadmap to Cloudflare D1...');
      console.log('Email:', email);
      console.log('Roadmap string length:', roadmapString.length);
      console.log('Level:', level);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, roadmapString, level }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Save roadmap failed:', data);
        throw new Error(data.error || 'Failed to save roadmap');
      }
      
      console.log('✅ Roadmap saved successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Error saving roadmap:', error);
      throw error;
    }
  };

  const checkExistingRoadmap = async () => {
    if (!localUser?.email) return;
    
    setIsLoading(true);
    try {
      const data = await getRoadmap(localUser.email);
      
      if (data.success && data.exists) {
        setRoadmapString(data.roadmapString);
        setCurrentLevel(data.level || 0);
        setHasExistingRoadmap(true);
        setShowRoadmap(true);
        generateRoadmapFromString(data.roadmapString, data.level);
      }
    } catch (error) {
      console.error('Error checking roadmap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoadmapFromString = (roadmapStr, level = 0) => {
    const skillOrder = roadmapStr.split('-');
    const steps = [];
    
    // Create reverse mapping for number to skill
    const numberToSkill = {};
    Object.entries(skillNumbers).forEach(([skill, number]) => {
      numberToSkill[number] = skill;
    });

    skillOrder.forEach((skillNum, index) => {
      const skillNumber = parseInt(skillNum);
      const skillName = numberToSkill[skillNumber];
      
      // Find the skill in domain structure
      let domain = '';
      let category = '';
      let subskills = [];
      
      // Search in Reading and Writing
      for (const [dom, categories] of Object.entries(domainStructure['Reading and Writing'])) {
        for (const [cat, skills] of Object.entries(categories)) {
          if (skills[skillName]) {
            domain = 'Reading and Writing';
            category = cat;
            subskills = skills[skillName];
            break;
          }
        }
        if (domain) break;
      }
      
      // If not found, search in Math
      if (!domain) {
        for (const [dom, categories] of Object.entries(domainStructure['Math'])) {
          for (const [cat, skills] of Object.entries(categories)) {
            if (skills[skillName]) {
              domain = 'Math';
              category = cat;
              subskills = skills[skillName];
              break;
            }
          }
          if (domain) break;
        }
      }
      
      const icon = domain === 'Reading and Writing' ? '📚' : '🧮';
      const color = domain === 'Reading and Writing' ? colors.primary : colors.secondary;
      const stepLevel = domainLevels[category] || 3;
      const practiceType = getPracticeType(stepLevel);
      
      steps.push({
        stepNumber: index + 1,
        domain,
        category,
        skillName,
        level: stepLevel,
        practiceType,
        icon,
        color,
        subskills,
        skillNumber,
        isCompleted: index < level,
      });
    });
    
    setRoadmapSteps(steps);
  };

  const generateRoadmap = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      showLoginRequiredDialog();
      return;
    }
    
    const currentUser = JSON.parse(storedUser);
    setLocalUser(currentUser);
    
    setIsLoading(true);
    
    // Get all skills from all domains
    const allSkills = [];
    
    // Process Math skills
    Object.entries(domainStructure['Math']).forEach(([domain, skills]) => {
      Object.entries(skills).forEach(([skillName, subskills]) => {
        allSkills.push({
          domain: 'Math',
          category: domain,
          name: skillName,
          level: domainLevels[domain] || 3,
          subskills,
          skillNumber: skillNumbers[skillName],
        });
      });
    });
    
    // Process Reading and Writing skills
    Object.entries(domainStructure['Reading and Writing']).forEach(([domain, skills]) => {
      Object.entries(skills).forEach(([skillName, subskills]) => {
        allSkills.push({
          domain: 'Reading and Writing',
          category: domain,
          name: skillName,
          level: domainLevels[domain] || 3,
          subskills,
          skillNumber: skillNumbers[skillName],
        });
      });
    });
    
    // Sort skills by level (weakest first) and then randomly
    allSkills.sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return Math.random() - 0.5;
    });
    
    // Separate math and reading/writing skills
    const mathSkills = allSkills.filter(skill => skill.domain === 'Math');
    const readingSkills = allSkills.filter(skill => skill.domain === 'Reading and Writing');
    
    let mathIndex = 0;
    let readingIndex = 0;
    let alternateToReading = readingSkills.length > 0;
    const skillOrderNumbers = [];
    const steps = [];
    
    for (let i = 0; i < allSkills.length; i++) {
      let skill;
      let domain;
      let icon;
      let color;
      
      if (alternateToReading && readingIndex < readingSkills.length) {
        skill = readingSkills[readingIndex++];
        domain = "Reading and Writing";
        icon = "📚";
        color = colors.primary;
      } else if (mathIndex < mathSkills.length) {
        skill = mathSkills[mathIndex++];
        domain = "Math";
        icon = "🧮";
        color = colors.secondary;
      } else if (readingIndex < readingSkills.length) {
        skill = readingSkills[readingIndex++];
        domain = "Reading and Writing";
        icon = "📚";
        color = colors.primary;
      } else {
        break;
      }
      
      skillOrderNumbers.push(skill.skillNumber);
      const practiceType = getPracticeType(skill.level);
      
      steps.push({
        stepNumber: i + 1,
        domain,
        category: skill.category,
        skillName: skill.name,
        level: skill.level,
        practiceType,
        icon,
        color,
        subskills: skill.subskills,
        skillNumber: skill.skillNumber,
        isCompleted: false,
      });
      
      alternateToReading = !alternateToReading;
    }
    
    // Create roadmap string
    const newRoadmapString = skillOrderNumbers.join('-');
    
    try {
      await saveRoadmap(currentUser.email, newRoadmapString, 0);
      
      setRoadmapString(newRoadmapString);
      setRoadmapSteps(steps);
      setCurrentLevel(0);
      setShowRoadmap(true);
      setHasExistingRoadmap(true);
    } catch (error) {
      console.error('Error saving roadmap:', error);
      // Mock success for demo purposes
      setRoadmapString(newRoadmapString);
      setRoadmapSteps(steps);
      setCurrentLevel(0);
      setShowRoadmap(true);
      setHasExistingRoadmap(true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLevel = async (newLevel) => {
    if (!localUser?.email) return;
    
    try {
      await saveRoadmap(localUser.email, roadmapString, newLevel);
      setCurrentLevel(newLevel);
      
      // Update completion status
      const updatedSteps = roadmapSteps.map((step, index) => ({
        ...step,
        isCompleted: index < newLevel
      }));
      
      setRoadmapSteps(updatedSteps);
    } catch (error) {
      console.error('Error updating level:', error);
      // Mock success for demo purposes
      setCurrentLevel(newLevel);
      const updatedSteps = roadmapSteps.map((step, index) => ({
        ...step,
        isCompleted: index < newLevel
      }));
      setRoadmapSteps(updatedSteps);
    }
  };

  const resetRoadmap = async () => {
    if (!localUser?.email) return;
    
    if (window.confirm('Are you sure you want to reset your roadmap? This will delete your progress.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/roadmap`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ email: localUser.email }),
        });
        
        if (response.ok) {
          setRoadmapSteps([]);
          setShowRoadmap(false);
          setHasExistingRoadmap(false);
          setCurrentLevel(0);
          setRoadmapString('');
        }
      } catch (error) {
        console.error('Error resetting roadmap:', error);
        // Mock success for demo
        setRoadmapSteps([]);
        setShowRoadmap(false);
        setHasExistingRoadmap(false);
        setCurrentLevel(0);
        setRoadmapString('');
      }
    }
  };

  const showLoginRequiredDialog = () => {
    if (window.confirm('You need to be logged in to generate a personalized roadmap.\n\nWould you like to login now?')) {
      navigate('/login');
    }
  };

  const getPracticeType = (level) => {
    if (level <= 1) return "Focus on concept revision";
    if (level <= 2) return "Timed problem sets";
    if (level <= 3) return "Mixed practice";
    if (level <= 4) return "Concept strengthening";
    return "Advanced practice & review";
  };

  const getLevelDescription = (level) => {
    switch (level) {
      case 0: return "Needs Foundation";
      case 1: return "Weak";
      case 2: return "Developing";
      case 3: return "Moderate";
      case 4: return "Strong";
      case 5: return "Excellent";
      default: return "Unknown";
    }
  };

  const getLevelColor = (level) => {
    if (level <= 1) return colors.error;
    if (level <= 2) return '#FF9800'; // Orange
    if (level <= 3) return '#FFC107'; // Amber
    if (level <= 4) return colors.accent;
    return '#4CAF50'; // Green
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    }
    setProfileMenuOpen(false);
    setLocalUser(null);
    navigate('/login');
  };

  // UPDATED: Handle Level Start - Navigate to RoadmapLevel page
  const handleLevelStart = (stepNumber) => {
    const step = roadmapSteps[stepNumber - 1];
    if (!step) return;
    
    // Save current progress before starting the level
    updateLevel(stepNumber - 1);
    
    // Navigate to RoadmapLevel page with skill data
    navigate('/roadmap-level', {
      state: {
        skillName: step.skillName,
        domain: step.domain,
        category: step.category,
        currentLevel: currentLevel,
        roadmapString: roadmapString,
        userData: localUser
      }
    });
  };

  const handleDomainLevelChange = (domain, value) => {
    setDomainLevels(prev => ({
      ...prev,
      [domain]: parseInt(value)
    }));
  };

  const renderSkillAssessmentSection = () => (
    <div className="roadmap-assessment-section">
      <div className="assessment-card">
        <h2 className="assessment-title">Rate Your Domain Proficiency (0-5)</h2>
        <p className="assessment-subtitle">0 = No knowledge, 5 = Expert level</p>
        
        <div className="skill-categories-container">
          <div className="skill-category">
            <div className="category-header">
              <span className="category-icon">🧮</span>
              <h3 className="category-title">Math Skills</h3>
            </div>
            {Object.keys(domainStructure['Math']).map(domain => (
              <div key={domain} className="domain-slider-container">
                <div className="domain-header">
                  <span className="domain-name">{domain}</span>
                  <span className="domain-level" style={{ backgroundColor: getLevelColor(domainLevels[domain]).replace(')', ', 0.1)').replace('rgb', 'rgba') }}>
                    {domainLevels[domain]} - {getLevelDescription(domainLevels[domain])}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={domainLevels[domain]}
                  onChange={(e) => handleDomainLevelChange(domain, e.target.value)}
                  className="domain-slider"
                  style={{
                    '--track-color': getLevelColor(domainLevels[domain]),
                    '--thumb-color': getLevelColor(domainLevels[domain])
                  }}
                />
              </div>
            ))}
          </div>
          
          <div className="skill-category">
            <div className="category-header">
              <span className="category-icon">📚</span>
              <h3 className="category-title">Reading & Writing Skills</h3>
            </div>
            {Object.keys(domainStructure['Reading and Writing']).map(domain => (
              <div key={domain} className="domain-slider-container">
                <div className="domain-header">
                  <span className="domain-name">{domain}</span>
                  <span className="domain-level" style={{ backgroundColor: getLevelColor(domainLevels[domain]).replace(')', ', 0.1)').replace('rgb', 'rgba') }}>
                    {domainLevels[domain]} - {getLevelDescription(domainLevels[domain])}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={domainLevels[domain]}
                  onChange={(e) => handleDomainLevelChange(domain, e.target.value)}
                  className="domain-slider"
                  style={{
                    '--track-color': getLevelColor(domainLevels[domain]),
                    '--thumb-color': getLevelColor(domainLevels[domain])
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="generate-button-container">
          <button 
            className="generate-button"
            onClick={generateRoadmap}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate My Roadmap'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderRoadmapSection = () => (
    <div className="roadmap-section">
      <div className="roadmap-header">
        <div className="header-content">
          <h2 className="roadmap-title">🎯 Your Personalized SAT Roadmap</h2>
          <p className="roadmap-progress">
            Progress: {currentLevel}/{roadmapSteps.length} completed
          </p>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentLevel / roadmapSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <button 
          className="edit-button"
          onClick={() => setShowRoadmap(false)}
        >
          ✏️
        </button>
      </div>
      
      <div className="timeline">
        {roadmapSteps.map((step, index) => (
          <div key={index} className="timeline-step">
            <div className="timeline-indicator">
              <div 
                className="indicator-circle"
                style={{ 
                  backgroundColor: step.isCompleted ? '#4CAF50' : step.color,
                  border: index === currentLevel && !step.isCompleted ? `3px solid ${colors.accent}` : 'none'
                }}
              >
                {step.isCompleted ? '✓' : step.stepNumber}
              </div>
              {index < roadmapSteps.length - 1 && (
                <div 
                  className="timeline-connector"
                  style={{ 
                    backgroundColor: step.isCompleted ? '#4CAF5090' : `${step.color}90`
                  }}
                ></div>
              )}
            </div>
            
            <div className="step-card">
              <div 
                className="step-header"
                style={{ 
                  borderLeftColor: index === currentLevel && !step.isCompleted ? colors.accent : 'transparent'
                }}
              >
                <div className="step-info">
                  <div className="step-domain">
                    <span className="domain-icon">{step.icon}</span>
                    <span className="domain-name">{step.domain}</span>
                    <span className="skill-number">#{step.skillNumber}</span>
                  </div>
                  <span 
                    className="step-level"
                    style={{ 
                      backgroundColor: `${getLevelColor(step.level)}20`,
                      color: getLevelColor(step.level)
                    }}
                  >
                    {getLevelDescription(step.level)}
                  </span>
                </div>
                
                <h3 
                  className="step-category"
                  style={{ 
                    textDecoration: step.isCompleted ? 'line-through' : 'none',
                    color: step.isCompleted ? '#666' : colors.primary
                  }}
                >
                  {step.category}
                </h3>
                
                <p 
                  className="step-skill"
                  style={{ 
                    textDecoration: step.isCompleted ? 'line-through' : 'none',
                    color: step.isCompleted ? '#888' : colors.secondary
                  }}
                >
                  {step.skillName}
                </p>
                
                <div 
                  className="practice-type"
                  style={{ 
                    backgroundColor: step.isCompleted ? '#f0f0f0' : `${colors.accent}20`
                  }}
                >
                  <span className="practice-icon">{step.isCompleted ? '✓' : '💡'}</span>
                  <span className="practice-text">
                    {step.isCompleted ? 'Completed!' : step.practiceType}
                  </span>
                </div>
                
                {step.subskills.length > 0 && (
                  <div className="subskills-section">
                    <p className="subskills-title">Key Subskills:</p>
                    <div className="subskills-container">
                      {step.subskills.slice(0, 3).map((subskill, idx) => (
                        <span 
                          key={idx}
                          className="subskill-chip"
                          style={{ 
                            backgroundColor: step.isCompleted ? '#e0e0e0' : `${step.color}20`
                          }}
                        >
                          {subskill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {index === currentLevel && !step.isCompleted && (
                  <button 
                    className="start-level-button"
                    onClick={() => handleLevelStart(step.stepNumber)}
                  >
                    ▶ Start Level
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileMenu = () => (
    <div className="profile-menu" ref={profileMenuRef}>
      <button 
        className="profile-button"
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
      >
        👤 {localUser?.username || 'Account'}
      </button>
      
      {profileMenuOpen && (
        <div className="profile-dropdown">
          <button 
            className="dropdown-item"
            onClick={() => {
              setProfileMenuOpen(false);
              navigate('/profile');
            }}
          >
            👤 Profile
          </button>
          {hasExistingRoadmap && (
            <button 
              className="dropdown-item"
              onClick={() => {
                setProfileMenuOpen(false);
                resetRoadmap();
              }}
            >
              🔄 Reset Roadmap
            </button>
          )}
          {localUser && (
            <button 
              className="dropdown-item"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          )}
          {!localUser && (
            <button 
              className="dropdown-item"
              onClick={() => {
                setProfileMenuOpen(false);
                navigate('/login');
              }}
            >
              🔑 Login
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="roadmap-container">
        <header className="roadmap-header-bar">
          <h1 className="header-title">SAT Practice Roadmap</h1>
          {renderProfileMenu()}
        </header>
        <div className="roadmap-loading">
          <div className="spinner"></div>
          <p>Generating your personalized roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-container">
      <header className="roadmap-header-bar">
        <h1 className="header-title">SAT Practice Roadmap</h1>
        {renderProfileMenu()}
      </header>
      
      <main className="roadmap-content">
        {!showRoadmap ? renderSkillAssessmentSection() : renderRoadmapSection()}
      </main>
    </div>
  );
};

export default Roadmap;

// wrangler d1 create sat-blog-db
// wrangler d1 info sat-blog-db 
// wrangler d1 list   
// wrangler d1 execute sat-blog-db --file=./schema.sql --remote
// npm install -g wrangler
// npx wrangler deploy    