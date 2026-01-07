import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login_screen.css';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiMessage, setApiMessage] = useState({ text: '', type: '' });

  // Try multiple API endpoints in order
  const API_ENDPOINTS = [
    'https://sat-blog-worker.tejasbalkhande221.workers.dev',
    'http://localhost:8787' // Local development
  ];

  const getApiUrl = () => {
    return API_ENDPOINTS[0]; // Use the Cloudflare Worker URL
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiMessage.text) {
      setApiMessage({ text: '', type: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email cannot be empty';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setApiMessage({ text: '', type: '' });

    try {
      console.log('📤 Sending login request to:', getApiUrl());
      console.log('📤 Login data:', { email: formData.email, password_length: formData.password.length });
      
      const response = await fetch(`${getApiUrl()}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('📥 Response from Cloudflare:', data);
      
      if (data.success) {
        setApiMessage({ 
          text: '✅ Login successful! Redirecting...', 
          type: 'success' 
        });
        
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Auto redirect to profile after 1 second
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } else {
        setApiMessage({ 
          text: `❌ ${data.error || 'Login failed'}`, 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiMessage({ 
        text: `❌ Network error: ${error.message}. Please check the API URL.`, 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

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

  const ErrorIcon = () => (
    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );

  const SuccessIcon = () => (
    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  );

  return (
    <div className="login-container">
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
            <h1>Welcome Back!</h1>
            <p>Login to continue your SAT preparation journey</p>
            
            <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
              <p><strong>Test Credentials:</strong></p>
              <p>Email: <code>test@example.com</code></p>
              <p>Password: <code>Test@123</code></p>
            </div>
            
            {apiMessage.text && (
              <div style={{ 
                padding: '10px', 
                marginBottom: '15px', 
                borderRadius: '8px',
                backgroundColor: apiMessage.type === 'success' ? '#E6F4EA' : '#FFEBEE',
                color: apiMessage.type === 'success' ? '#2E7D32' : '#D32F2F',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {apiMessage.type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
                {apiMessage.text}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} autoComplete="off">
            {/* Email Field */}
            <div className="login-input-group">
              <label className="login-input-label">Email</label>
              <div className="login-input-with-icon">
                <div className="login-input-icon">
                  <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="login-input"
                  placeholder="test@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="login-error">
                  <ErrorIcon /> {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="login-input-group">
              <label className="login-input-label">Password</label>
              <div className="login-input-with-icon">
                <div className="login-input-icon">
                  <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="login-input"
                  placeholder="Test@123"
                  disabled={loading}
                  autoComplete="current-password"
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
              {errors.password && (
                <div className="login-error">
                  <ErrorIcon /> {errors.password}
                </div>
              )}
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

          <div className="login-divider">
            <div className="login-divider-line"></div>
            <span className="login-divider-text">Or</span>
            <div className="login-divider-line"></div>
          </div>

          <div className="login-signup-link">
            <p>
              Don't have an account?{' '}
              <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="login-right-panel">
        <div className="login-right-content">
          <h2 className="login-right-title">Track Your Progress</h2>
          <p className="login-right-subtitle">
            Continue your journey to a higher SAT score
          </p>

          <div className="login-features-grid">
            <div className="login-feature-tile">
              <div className="login-feature-icon">
                <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div className="login-feature-content">
                <h3>Score Analytics</h3>
                <p>View detailed performance reports and track improvement</p>
              </div>
            </div>

            <div className="login-feature-tile">
              <div className="login-feature-icon">
                <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
              <div className="login-feature-content">
                <h3>Practice History</h3>
                <p>Access your completed tests and review answers</p>
              </div>
            </div>

            <div className="login-feature-tile">
              <div className="login-feature-icon">
                <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="login-feature-content">
                <h3>Study Schedule</h3>
                <p>Pick up where you left off with personalized study plans</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default LoginScreen;