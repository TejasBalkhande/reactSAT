import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './profile_screen.css';

// Icon components
const UserIcon = () => (
  <svg className="profile-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);

const EmailIcon = () => (
  <svg className="profile-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg className="profile-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg className="profile-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const EditIcon = () => (
  <svg className="profile-icon icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
  </svg>
);

const SaveIcon = () => (
  <svg className="profile-icon icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const CancelIcon = () => (
  <svg className="profile-icon icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

const ChartIcon = () => (
  <svg className="profile-icon icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
  </svg>
);

const TestIcon = () => (
  <svg className="profile-icon icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg className="profile-icon icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
  </svg>
);

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    profile_picture: ''
  });
  const [stats, setStats] = useState({
    totalPracticeTests: 0,
    averageScore: 0,
    improvement: 0,
    streakDays: 0
  });

  const API_URL = 'https://sat-blog-worker.tejasbalkhande221.workers.dev';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('sat_token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
        setEditForm({
          full_name: data.profile.full_name || '',
          profile_picture: data.profile.profile_picture || ''
        });
        
        // Fetch additional stats (mock data for now)
        setStats({
          totalPracticeTests: 8,
          averageScore: 1450,
          improvement: 125,
          streakDays: 7
        });
      } else {
        setError(data.error || 'Failed to load profile');
        
        // If token is invalid, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('sat_token');
          localStorage.removeItem('sat_user');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('sat_token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
        setIsEditing(false);
        alert('✅ Profile updated successfully!');
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    const currentPassword = prompt('Enter your current password:');
    if (!currentPassword) return;
    
    const newPassword = prompt('Enter your new password (min 6 characters):');
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    const confirmPassword = prompt('Confirm your new password:');
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    changePassword(currentPassword, newPassword);
  };

  const changePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('sat_token');
    
    try {
      const response = await fetch(`${API_URL}/api/profile/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Password changed successfully!');
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Change password error:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('sat_token');
    
    if (token) {
      try {
        await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear local storage
    localStorage.removeItem('sat_token');
    localStorage.removeItem('sat_user');
    localStorage.removeItem('sat_remember');
    
    // Redirect to login
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-error">
        <div className="profile-error-icon">⚠️</div>
        <h3>Unable to Load Profile</h3>
        <p>{error}</p>
        <button 
          className="profile-retry-btn"
          onClick={fetchProfile}
        >
          Retry
        </button>
        <button 
          className="profile-login-btn"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-container">
            {isEditing ? (
              <div className="profile-avatar-edit">
                <div 
                  className="profile-avatar-large"
                  style={{ 
                    backgroundImage: editForm.profile_picture ? `url(${editForm.profile_picture})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  {!editForm.profile_picture && (profile?.username?.charAt(0) || 'U')}
                </div>
                <input
                  type="text"
                  name="profile_picture"
                  value={editForm.profile_picture}
                  onChange={handleEditChange}
                  className="profile-picture-input"
                  placeholder="Enter image URL"
                />
              </div>
            ) : (
              <div 
                className="profile-avatar-large"
                style={{ 
                  backgroundImage: profile?.profile_picture ? `url(${profile.profile_picture})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {!profile?.profile_picture && (profile?.username?.charAt(0) || 'U')}
              </div>
            )}
            
            <div className="profile-avatar-badge">
              {profile?.account_type === 'premium' ? '⭐ Premium' : 'Free'}
            </div>
          </div>
          
          <div className="profile-info-main">
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={editForm.full_name}
                onChange={handleEditChange}
                className="profile-name-input"
                placeholder="Enter your full name"
              />
            ) : (
              <h1 className="profile-name">
                {profile?.full_name || profile?.username || 'User'}
              </h1>
            )}
            
            <p className="profile-username">@{profile?.username}</p>
            <p className="profile-email">{profile?.email}</p>
            
            <div className="profile-meta">
              <div className="profile-meta-item">
                <CalendarIcon />
                <span>Member since {profile?.member_since || 'Unknown'}</span>
              </div>
              <div className="profile-meta-item">
                <ClockIcon />
                <span>Last login: {profile?.last_login ? 
                  new Date(profile.last_login).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button 
                  className="profile-action-btn profile-action-save"
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  <SaveIcon /> Save
                </button>
                <button 
                  className="profile-action-btn profile-action-cancel"
                  onClick={handleEditToggle}
                  disabled={loading}
                >
                  <CancelIcon /> Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  className="profile-action-btn profile-action-edit"
                  onClick={handleEditToggle}
                >
                  <EditIcon /> Edit Profile
                </button>
                <button 
                  className="profile-action-btn profile-action-logout"
                  onClick={handleLogout}
                >
                  <LogoutIcon /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Left Column - Stats & Quick Actions */}
        <div className="profile-left-column">
          {/* Stats Cards */}
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="profile-stat-icon">📊</div>
              <div className="profile-stat-content">
                <h3>{stats.totalPracticeTests}</h3>
                <p>Practice Tests</p>
              </div>
            </div>
            
            <div className="profile-stat-card">
              <div className="profile-stat-icon">🎯</div>
              <div className="profile-stat-content">
                <h3>{stats.averageScore}</h3>
                <p>Average Score</p>
              </div>
            </div>
            
            <div className="profile-stat-card">
              <div className="profile-stat-icon">📈</div>
              <div className="profile-stat-content">
                <h3>+{stats.improvement}</h3>
                <p>Points Improved</p>
              </div>
            </div>
            
            <div className="profile-stat-card">
              <div className="profile-stat-icon">🔥</div>
              <div className="profile-stat-content">
                <h3>{stats.streakDays}</h3>
                <p>Day Streak</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="profile-quick-actions">
            <h3>Quick Actions</h3>
            <button className="profile-quick-action-btn">
              <TestIcon />
              <span>Take Practice Test</span>
            </button>
            <button className="profile-quick-action-btn">
              <ChartIcon />
              <span>View Progress Report</span>
            </button>
            <button 
              className="profile-quick-action-btn"
              onClick={handleChangePassword}
            >
              <LockIcon />
              <span>Change Password</span>
            </button>
            <button className="profile-quick-action-btn">
              <UserIcon />
              <span>Account Settings</span>
            </button>
          </div>

          {/* Account Info */}
          <div className="profile-account-info">
            <h3>Account Information</h3>
            <div className="profile-info-item">
              <span className="profile-info-label">Account Type:</span>
              <span className={`profile-info-value ${profile?.account_type === 'premium' ? 'premium' : 'free'}`}>
                {profile?.account_type === 'premium' ? '⭐ Premium' : 'Free'}
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Account Age:</span>
              <span className="profile-info-value">
                {profile?.account_age_days || 0} days
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Status:</span>
              <span className="profile-info-value status-active">
                ● Active
              </span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Verification:</span>
              <span className="profile-info-value status-verified">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activity & More */}
        <div className="profile-right-column">
          {/* Recent Activity */}
          <div className="profile-recent-activity">
            <div className="profile-section-header">
              <h3>Recent Activity</h3>
              <Link to="/activity" className="profile-view-all">View All</Link>
            </div>
            
            <div className="profile-activity-list">
              <div className="profile-activity-item">
                <div className="profile-activity-icon">📝</div>
                <div className="profile-activity-content">
                  <h4>Practice Test Completed</h4>
                  <p>Scored 1480 on SAT Practice Test #4</p>
                  <span className="profile-activity-time">2 hours ago</span>
                </div>
              </div>
              
              <div className="profile-activity-item">
                <div className="profile-activity-icon">📚</div>
                <div className="profile-activity-content">
                  <h4>Study Session</h4>
                  <p>Completed 30 Math practice questions</p>
                  <span className="profile-activity-time">Yesterday</span>
                </div>
              </div>
              
              <div className="profile-activity-item">
                <div className="profile-activity-icon">🎯</div>
                <div className="profile-activity-content">
                  <h4>Goal Achieved</h4>
                  <p>Reached 90% accuracy in Reading section</p>
                  <span className="profile-activity-time">3 days ago</span>
                </div>
              </div>
              
              <div className="profile-activity-item">
                <div className="profile-activity-icon">🤖</div>
                <div className="profile-activity-content">
                  <h4>AI Tutor Session</h4>
                  <p>Asked 5 questions about algebra concepts</p>
                  <span className="profile-activity-time">5 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Study Goals */}
          <div className="profile-study-goals">
            <div className="profile-section-header">
              <h3>Study Goals</h3>
              <button className="profile-edit-goals">Edit</button>
            </div>
            
            <div className="profile-goal-item">
              <div className="profile-goal-progress">
                <div className="profile-goal-progress-bar" style={{ width: '75%' }}></div>
              </div>
              <div className="profile-goal-info">
                <h4>Complete 1000 Math Questions</h4>
                <p>750/1000 (75%)</p>
              </div>
            </div>
            
            <div className="profile-goal-item">
              <div className="profile-goal-progress">
                <div className="profile-goal-progress-bar" style={{ width: '40%' }}></div>
              </div>
              <div className="profile-goal-info">
                <h4>Finish 4 Full Practice Tests</h4>
                <p>2/4 (40%)</p>
              </div>
            </div>
            
            <div className="profile-goal-item">
              <div className="profile-goal-progress">
                <div className="profile-goal-progress-bar" style={{ width: '90%' }}></div>
              </div>
              <div className="profile-goal-info">
                <h4>Improve Reading Score by 50 points</h4>
                <p>45/50 (90%)</p>
              </div>
            </div>
          </div>

          {/* Upgrade Card */}
          {profile?.account_type !== 'premium' && (
            <div className="profile-upgrade-card">
              <h3>⭐ Unlock Premium Features</h3>
              <p>Get unlimited practice tests, advanced analytics, and priority AI tutor support.</p>
              <button className="profile-upgrade-btn">
                Upgrade to Premium - $19.99/month
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;