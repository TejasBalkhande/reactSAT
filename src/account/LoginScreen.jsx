import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login_screen.css';

// Icon components
const EmailIcon = () => (
  <svg className="login-input-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>
);

const LockIcon = () => (
  <svg className="login-input-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
  </svg>
);

const EyeIcon = () => (
  <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
  </svg>
);

const EyeSlashIcon = () => (
  <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
  </svg>
);

const CheckIcon = () => (
  <svg className="login-tip-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const RobotIcon = () => (
  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
  </svg>
);

const ChartIcon = () => (
  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
  </svg>
);

const MapIcon = () => (
  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
  </svg>
);

const BookIcon = () => (
  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
  </svg>
);

const ErrorIcon = () => (
  <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (formData.email === 'test@example.com' && formData.password === 'password') {
        navigate('/', { state: { user: { email: formData.email } } });
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1500);
  };

  const isSmallScreen = window.innerWidth < 900;

  return (
    <div className="login-container">
      {/* Left Panel - Login Form */}
      <div className="login-left-panel">
        <div className="login-form-container">
          <div className="login-logo-container">
            <img 
              src="/logo.png" 
              alt="Mock SAT Exam" 
              className="login-logo"
            />
            <h1 className="login-title">Mock SAT Exam</h1>
          </div>

          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Continue your journey to SAT success</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <label className="login-input-label">Email</label>
              <div className="login-input-with-icon">
                <EmailIcon />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="login-input"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-input-label">Password</label>
              <div className="login-input-with-icon">
                <LockIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="login-input"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <ErrorIcon /> {error}
              </div>
            )}

            <div className="login-forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <span className="login-button-loading">
                  <span className="login-loading-spinner"></span>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="login-signup-link">
            <p>
              Don't have an account?{' '}
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Features (hidden on small screens) */}
      {!isSmallScreen && (
        <div className="login-right-panel">
          <div className="login-right-content">
            <h2 className="login-right-title">Master the SAT</h2>
            <p className="login-right-subtitle">
              Join thousands of students who achieved their dream scores
            </p>

            {/* SAT Tips */}
            <div className="login-tips-container">
              <h3 className="login-tips-title">Proven Strategies:</h3>
              <div className="login-tip-item">
                <CheckIcon />
                <p className="login-tip-text">
                  Time management is key - practice pacing for each section
                </p>
              </div>
              <div className="login-tip-item">
                <CheckIcon />
                <p className="login-tip-text">
                  Learn to eliminate wrong answers quickly
                </p>
              </div>
              <div className="login-tip-item">
                <CheckIcon />
                <p className="login-tip-text">
                  Master the evidence-based reading approach
                </p>
              </div>
              <div className="login-tip-item">
                <CheckIcon />
                <p className="login-tip-text">
                  Use official College Board materials for authentic practice
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="login-features-grid">
              <div className="login-feature-tile">
                <div className="login-feature-icon">
                  <RobotIcon />
                </div>
                <div className="login-feature-content">
                  <h3>AI Tutor for Guidance</h3>
                  <p>Ask AI Tutor doubts about that specific question during practice session</p>
                </div>
              </div>
              <div className="login-feature-tile">
                <div className="login-feature-icon">
                  <ChartIcon />
                </div>
                <div className="login-feature-content">
                  <h3>Score Analytics</h3>
                  <p>Detailed breakdown of strengths and weaknesses</p>
                </div>
              </div>
              <div className="login-feature-tile">
                <div className="login-feature-icon">
                  <MapIcon />
                </div>
                <div className="login-feature-content">
                  <h3>Personalized Roadmap</h3>
                  <p>AI-powered study plan tailored to your goals keeping track of your weakness</p>
                </div>
              </div>
              <div className="login-feature-tile">
                <div className="login-feature-icon">
                  <BookIcon />
                </div>
                <div className="login-feature-content">
                  <h3>Question Bank</h3>
                  <p>12,000+ practice questions with video explanations</p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="login-testimonial">
              <p className="login-testimonial-text">
                "The practice tests and analytics helped me identify my weak areas. 
                I improved my math score by 150 points in just 2 months!"
              </p>
              <div className="login-testimonial-author">
                <img 
                  src="/assets/student2.jpg" 
                  alt="Michael Chen" 
                  className="login-author-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <div style={{ display: 'none' }} className="login-author-avatar-placeholder"></div>
                <div className="login-author-info">
                  <h4>Michael Chen</h4>
                  <p>Scored 1520 | Admitted to MIT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;