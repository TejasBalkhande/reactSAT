import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup_screen.css';

// Icon components
const EmailIcon = () => (
  <svg className="signup-input-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>
);

const LockIcon = () => (
  <svg className="signup-input-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

const UserIcon = () => (
  <svg className="signup-input-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg className="signup-tip-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

const ClipboardCheckIcon = () => (
  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
  </svg>
);

const ClockIcon = () => (
  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const ErrorIcon = () => (
  <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const SignupScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 900);
  const [otpData, setOtpData] = useState(null);
  const [otpTimer, setOtpTimer] = useState(120); // 2 minutes timer
  const otpTimerRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // OTP timer effect
  useEffect(() => {
    if (showOtpVerification && otpTimer > 0) {
      otpTimerRef.current = setTimeout(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && showOtpVerification) {
      setApiMessage('❌ OTP expired. Please try signing up again.');
      setShowOtpVerification(false);
      setOtpData(null);
    }

    return () => {
      if (otpTimerRef.current) {
        clearTimeout(otpTimerRef.current);
      }
    };
  }, [showOtpVerification, otpTimer]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Replace with your actual Cloudflare Worker URL
  const API_URL = 'https://sat-blog-worker.tejasbalkhande221.workers.dev';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username cannot be empty';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email cannot be empty';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password cannot be empty';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check for duplicate username/email before signup
  const checkDuplicates = async () => {
    try {
      // Check username
      const usernameResponse = await fetch(`${API_URL}/api/check-duplicate?username=${formData.username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const usernameData = await usernameResponse.json();
      
      if (usernameData.success && usernameData.username && usernameData.username.existsInVerifiedAccounts) {
        setApiMessage('❌ Username already exists (verified account)');
        setErrors({ username: 'Username already exists' });
        return false;
      }

      // Check email
      const emailResponse = await fetch(`${API_URL}/api/check-duplicate?email=${formData.email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const emailData = await emailResponse.json();
      
      if (emailData.success && emailData.email && emailData.email.existsInVerifiedAccounts) {
        setApiMessage('❌ Email already registered (verified account)');
        setErrors({ email: 'Email already registered' });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Duplicate check error:', error);
      return true; // Continue with signup if check fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setApiMessage('');

    try {
      // Check for duplicates in verified accounts
      const isAvailable = await checkDuplicates();
      if (!isAvailable) {
        setLoading(false);
        return;
      }

      console.log('📤 Sending signup request to Cloudflare Worker...');
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          account_type: 'free'
        })
      });

      const data = await response.json();
      console.log('📥 Response from Cloudflare:', data);
      
      if (data.success) {
        // Store OTP data locally
        setOtpData({
          email: formData.email,
          otp: data.otp,
          userId: data.userId
        });
        
        setOtpTimer(120); // Reset timer to 2 minutes
        setApiMessage(`✅ OTP generated! Please verify your email.`);
        
        // Show OTP for testing
        alert(`OTP for verification: ${data.otp}\n\nPlease enter this OTP within 2 minutes to complete registration.\n\nUsername: ${formData.username}\nEmail: ${formData.email}`);
        
        setShowOtpVerification(true);
        setOtp(''); // Clear any previous OTP input
      } else {
        setApiMessage(`❌ Error: ${data.error}`);
        // Handle specific field errors
        if (data.field === 'username') {
          setErrors({ username: data.error });
        } else if (data.field === 'email') {
          setErrors({ email: data.error });
        } else if (data.retry) {
          // If it's a temporary duplicate (unverified account), suggest retrying
          alert(`Signup failed: ${data.error}\n\nPlease wait 2 minutes for the previous signup to expire, or use different credentials.`);
        } else {
          alert(`Signup failed: ${data.error}\n\n${data.details || ''}`);
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setApiMessage(`❌ Network error: ${error.message}`);
      alert(`Failed to connect to Cloudflare Worker. Please check:\n1. Worker is deployed\n2. Correct API_URL: ${API_URL}\n3. Database is initialized at ${API_URL}/api/init-db`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      alert('Please enter a valid 4-digit OTP');
      return;
    }

    if (!otpData) {
      alert('No verification session found. Please sign up again.');
      setShowOtpVerification(false);
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔐 Verifying OTP and completing account creation...');
      const response = await fetch(`${API_URL}/api/verify-otp-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: otpData.email,
          otp: otp
        })
      });

      const data = await response.json();
      console.log('✅ OTP verification response:', data);
      
      if (data.success) {
        alert('✅ Account created and verified successfully! You can now login.');
        
        // Clear all state
        setOtpData(null);
        setOtp('');
        setShowOtpVerification(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        navigate('/login');
      } else {
        if (data.error.includes('expired')) {
          alert(`❌ ${data.error}\n\nPlease sign up again.`);
          setShowOtpVerification(false);
          setOtpData(null);
        } else {
          alert(`❌ Verification failed: ${data.error}`);
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      alert('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!otpData) {
      alert('No verification session found. Please sign up again.');
      return;
    }

    setLoading(true);
    
    try {
      // Resend by signing up again with same credentials
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          account_type: 'free'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update OTP data
        setOtpData({
          email: formData.email,
          otp: data.otp,
          userId: data.userId
        });
        
        setOtpTimer(120);
        setOtp('');
        
        alert(`✅ New OTP generated: ${data.otp}\n\nPlease enter this OTP within 2 minutes.`);
      } else {
        alert(`Failed to resend OTP: ${data.error}`);
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      alert('Failed to resend OTP. Please try signing up again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelVerification = () => {
    setShowOtpVerification(false);
    setOtpData(null);
    setOtp('');
    setOtpTimer(120);
    setApiMessage('');
  };

  const RightPanelContent = () => (
    <div className="signup-right-panel">
      <div className="signup-right-content">
        <h2 className="signup-right-title">Elevate Your SAT Score</h2>
        <p className="signup-right-subtitle">
          Join us to improve your score by 200+ points and keep track of progress
        </p>

        {/* SAT Tips */}
        <div className="signup-tips-container">
          <h3 className="signup-tips-title">Proven Strategies:</h3>
          <div className="signup-tip-item">
            <CheckIcon />
            <p className="signup-tip-text">
              Time management is key - practice pacing for each section
            </p>
          </div>
          <div className="signup-tip-item">
            <CheckIcon />
            <p className="signup-tip-text">
              Learn to eliminate wrong answers quickly
            </p>
          </div>
          <div className="signup-tip-item">
            <CheckIcon />
            <p className="signup-tip-text">
              Master the evidence-based reading approach
            </p>
          </div>
          <div className="signup-tip-item">
            <CheckIcon />
            <p className="signup-tip-text">
              Use official College Board materials for authentic practice
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="signup-features-grid">
          <div className="signup-feature-tile">
            <div className="signup-feature-icon">
              <RobotIcon />
            </div>
            <div className="signup-feature-content">
              <h3>AI Tutor for Guidance</h3>
              <p>Ask AI Tutor doubts about that specific question during practice session</p>
            </div>
          </div>
          <div className="signup-feature-tile">
            <div className="signup-feature-icon">
              <ClipboardCheckIcon />
            </div>
            <div className="signup-feature-content">
              <h3>Official SAT Practice Tests</h3>
              <p>8 full-length exams developed by College Board experts</p>
            </div>
          </div>
          <div className="signup-feature-tile">
            <div className="signup-feature-icon">
              <ChartIcon />
            </div>
            <div className="signup-feature-content">
              <h3>Score Analytics</h3>
              <p>Detailed breakdown of strengths and weaknesses</p>
            </div>
          </div>
          <div className="signup-feature-tile">
            <div className="signup-feature-icon">
              <MapIcon />
            </div>
            <div className="signup-feature-content">
              <h3>Personalized Roadmap</h3>
              <p>AI-powered study plan tailored to your goals keeping track of your weakness</p>
            </div>
          </div>
          <div className="signup-feature-tile">
            <div className="signup-feature-icon">
              <BookIcon />
            </div>
            <div className="signup-feature-content">
              <h3>Question Bank</h3>
              <p>12,000+ practice questions with video explanations</p>
            </div>
          </div>
          <div className="signup-feature-tile">
            <div className="signup-feature-icon">
              <ClockIcon />
            </div>
            <div className="signup-feature-content">
              <h3>Time Management</h3>
              <p>Section-specific pacing strategies and drills</p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="signup-testimonial">
          <p className="signup-testimonial-text">
            "This platform helped me improve my SAT score by 320 points! 
            The practice tests are incredibly realistic and the analytics 
            showed me exactly where to focus."
          </p>
          <div className="signup-testimonial-author">
            <img 
              src="/assets/student1.jpg" 
              alt="Emily Richardson" 
              className="signup-author-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div style={{ display: 'none' }} className="signup-author-avatar-placeholder"></div>
            <div className="signup-author-info">
              <h4>Emily Richardson</h4>
              <p>Scored 1580 | Admitted to Stanford</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (showOtpVerification) {
    return (
      <div className="signup-container">
        {/* Left Panel - OTP Verification Form */}
        <div className="signup-left-panel">
          <div className="signup-form-container">
            <div className="signup-logo-container">
              <img 
                src="/logo.png" 
                alt="Mock SAT Exam" 
                className="signup-logo"
              />
              <h1 className="signup-title">Mock SAT Exam</h1>
            </div>

            <div className="signup-header">
              <h1>Verify Your Email</h1>
              <p>We've sent a 4-digit OTP to {otpData?.email}</p>
              <p style={{ color: 'green', fontSize: '14px', marginTop: '10px' }}>
                ✅ OTP generated! Account will be created after verification.
              </p>
              <div style={{ 
                marginTop: '10px', 
                padding: '8px', 
                backgroundColor: otpTimer > 30 ? '#E6F4EA' : '#FFEBEE',
                borderRadius: '6px',
                color: otpTimer > 30 ? '#2E7D32' : '#D32F2F',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                ⏰ Time remaining: {formatTime(otpTimer)}
                {otpTimer <= 30 && ' - Hurry up!'}
              </div>
            </div>

            <div className="signup-input-group">
              <label className="signup-input-label">Enter 4-digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="signup-input"
                placeholder="Enter 4-digit OTP"
                maxLength="4"
                disabled={loading}
                autoComplete="one-time-code"
              />
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                (Check the alert for the OTP sent during signup)
              </small>
            </div>

            <button
              onClick={handleVerifyOtp}
              className="signup-button"
              disabled={loading || otp.length !== 4}
            >
              {loading ? (
                <span className="signup-button-loading">
                  <span className="signup-loading-spinner"></span>
                  Verifying & Creating Account...
                </span>
              ) : (
                'Verify OTP & Create Account'
              )}
            </button>

            <button
              onClick={handleResendOtp}
              className="signup-button"
              style={{ 
                backgroundColor: 'transparent',
                color: 'var(--primary-color)',
                border: '1px solid var(--primary-color)',
                marginTop: '10px'
              }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Resend OTP'}
            </button>

            <div className="signup-divider">
              <div className="signup-divider-line"></div>
              <span className="signup-divider-text">Or</span>
              <div className="signup-divider-line"></div>
            </div>

            <button
              onClick={handleCancelVerification}
              className="signup-button"
              style={{ backgroundColor: '#666' }}
              disabled={loading}
            >
              Cancel & Go Back
            </button>
          </div>
        </div>

        {/* Right Panel - Features (hidden on small screens) */}
        {!isSmallScreen && <RightPanelContent />}
      </div>
    );
  }

  return (
    <div className="signup-container">
      {/* Left Panel - Signup Form */}
      <div className="signup-left-panel">
        <div className="signup-form-container">
          <div className="signup-logo-container">
            <img 
              src="/logo.png" 
              alt="Mock SAT Exam" 
              className="signup-logo"
            />
            <h1 className="signup-title">Mock SAT Exam</h1>
          </div>

          <div className="signup-header">
            <h1>Create Your Account</h1>
            <p>Join the elite of SAT achievers</p>
            
            {apiMessage && (
              <div style={{ 
                padding: '10px', 
                marginBottom: '15px', 
                borderRadius: '8px',
                backgroundColor: apiMessage.includes('✅') ? '#E6F4EA' : '#FFEBEE',
                color: apiMessage.includes('✅') ? '#2E7D32' : '#D32F2F',
                fontSize: '14px'
              }}>
                {apiMessage}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Username Field */}
            <div className="signup-input-group">
              <label className="signup-input-label">Username</label>
              <div className="signup-input-with-icon">
                <UserIcon />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="signup-input"
                  placeholder="Enter your username"
                  disabled={loading}
                  autoComplete="new-username"
                />
              </div>
              {errors.username && (
                <div className="signup-error">
                  <ErrorIcon /> {errors.username}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="signup-input-group">
              <label className="signup-input-label">Email</label>
              <div className="signup-input-with-icon">
                <EmailIcon />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="signup-input"
                  placeholder="Enter your email"
                  disabled={loading}
                  autoComplete="new-email"
                />
              </div>
              {errors.email && (
                <div className="signup-error">
                  <ErrorIcon /> {errors.email}
                </div>
              )}
            </div>

            {/* Password Field - Disable autofill */}
            <div className="signup-input-group">
              <label className="signup-input-label">Password</label>
              <div className="signup-input-with-icon">
                <LockIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="signup-input"
                  placeholder="Enter your password (min 6 characters)"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && (
                <div className="signup-error">
                  <ErrorIcon /> {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Field - Disable autofill */}
            <div className="signup-input-group">
              <label className="signup-input-label">Confirm Password</label>
              <div className="signup-input-with-icon">
                <LockIcon />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="signup-input"
                  placeholder="Confirm your password"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="signup-error">
                  <ErrorIcon /> {errors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="signup-button"
              disabled={loading}
            >
              {loading ? (
                <span className="signup-button-loading">
                  <span className="signup-loading-spinner"></span>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="signup-divider">
            <div className="signup-divider-line"></div>
            <span className="signup-divider-text">Or</span>
            <div className="signup-divider-line"></div>
          </div>

          <div className="signup-login-link">
            <p>
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Features (hidden on small screens) */}
      {!isSmallScreen && <RightPanelContent />}
    </div>
  );
};

export default SignupScreen;