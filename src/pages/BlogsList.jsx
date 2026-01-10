import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import './BlogsList.css';

// Import Material-UI icons for navbar
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MapIcon from '@mui/icons-material/Map';
import QuizIcon from '@mui/icons-material/Quiz';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArticleIcon from '@mui/icons-material/Article';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const BlogsList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [environment, setEnvironment] = useState('remote');
  const [apiError, setApiError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [currentDomain, setCurrentDomain] = useState('');

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const page = parseInt(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';

  // Define API URLs for different environments
  const API_URLS = {
    local: 'http://localhost:8787',
    remote: 'https://sat-blog-worker.tejasbalkhande221.workers.dev'
  };

  const API_BASE_URL = API_URLS[environment];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Get current domain
    setCurrentDomain(window.location.origin);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [page, category, search, sort, environment]);

  const fetchBlogs = async () => {
    setLoading(true);
    setApiError('');
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(category && { category }),
        ...(search && { search }),
        sort
      });

      console.log(`🌐 Fetching blogs from: ${API_BASE_URL}/api/blogs`);
      console.log(`📊 Current domain: ${currentDomain}`);
      console.log(`🔍 Params: ${params.toString()}`);

      const response = await axios.get(
        `${API_BASE_URL}/api/blogs?${params}`,
        {
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': currentDomain
          }
        }
      );

      if (response.data.success) {
        setBlogs(response.data.blogs || []);
        setCategories(response.data.categories || []);
        setPagination(response.data.pagination || {
          page: 1,
          totalPages: 1,
          total: 0
        });
        console.log(`✅ Successfully loaded ${response.data.blogs?.length || 0} blogs`);
      } else {
        setApiError(response.data.message || 'Failed to load blogs');
      }
    } catch (error) {
      console.error(`❌ Error fetching blogs from ${environment}:`, error);
      setBlogs([]);
      setCategories([]);
      
      // Enhanced error detection
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setApiError(`Network Error: Cannot connect to ${environment} API at ${API_BASE_URL}. Check if the worker is running.`);
      } else if (error.code === 'ECONNABORTED') {
        setApiError('Request timeout. The server is taking too long to respond.');
      } else if (error.response) {
        // Server responded with error
        const status = error.response.status;
        if (status === 403 || status === 0 || error.message.includes('CORS')) {
          setApiError(`CORS Error (${status}): Your domain (${currentDomain}) is not allowed to access the API. Make sure it's added to CORS settings.`);
        } else {
          setApiError(`Server Error ${status}: ${error.response.data?.error || 'Unknown error'}`);
        }
      } else if (error.request) {
        setApiError('No response received from server. The API might be down.');
      } else {
        setApiError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === category) {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.set('page', 1);
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get('search');
    
    const params = new URLSearchParams(searchParams);
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    params.set('page', 1);
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  // Handle navigation to create blog
  const handleCreateBlog = () => {
    navigate('/admin/create-blog');
  };

  const handleEnvironmentChange = (newEnv) => {
    setEnvironment(newEnv);
    const params = new URLSearchParams(searchParams);
    params.set('page', 1);
    setSearchParams(params);
  };

  // Test API connection
  const testAPIConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`, {
        timeout: 10000,
        headers: {
          'Origin': currentDomain
        }
      });
      
      alert(`✅ API Connection Successful!\n\nMessage: ${response.data.message}\nDatabase: ${response.data.database}\nYour Domain: ${currentDomain}\nAllowed: ${response.data.allowedDomains.join(', ')}`);
      
      // Also test CORS specifically
      const corsTest = await axios.get(`${API_BASE_URL}/api/cors-test`, {
        headers: {
          'Origin': currentDomain
        }
      });
      console.log('CORS Test Result:', corsTest.data);
      
    } catch (error) {
      console.error('API Test Error:', error);
      alert(`❌ API Connection Failed!\n\nError: ${error.message}\n\nURL: ${API_BASE_URL}\n\nYour Domain: ${currentDomain}\n\nCheck:\n1. Cloudflare Worker is running\n2. CORS settings include your domain\n3. No network restrictions`);
    }
  };

  // Check CORS status
  const checkCORSStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cors-test`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Origin': currentDomain
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('CORS Check Result:', data);
        alert(`✅ CORS Check Passed!\n\nYour Domain: ${currentDomain}\n\nAllowed Patterns:\n${data.supportedPatterns.join('\n')}`);
      } else {
        alert(`❌ CORS Check Failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('CORS Check Error:', error);
      alert(`❌ CORS Check Failed!\n\nError: ${error.message}\n\nThis usually means your domain (${currentDomain}) is not in the allowed CORS origins list.`);
    }
  };

  return (
    <>
      <Helmet>
        <title>SAT Blog - Expert Tips & Strategies | Mock SAT Exam</title>
        <meta 
          name="description" 
          content="Comprehensive SAT preparation blog with math tips, reading strategies, writing guides, and college admission advice from experts." 
        />
        <meta 
          name="keywords" 
          content="SAT blog, SAT preparation, SAT tips, SAT math, SAT reading, SAT writing, college admissions" 
        />
        <link rel="canonical" href="https://satexam.com/blogs" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "SAT Preparation Blog",
            "description": "Expert SAT preparation tips and strategies",
            "url": "https://satexam.com/blogs",
            "publisher": {
              "@type": "Organization",
              "name": "Mock SAT Exam"
            }
          })}
        </script>
      </Helmet>

      <div className="blogs-list-container sat-app">
        {/* Navigation - Matching App.jsx exactly */}
        <nav className="navbar sat-navbar">
          <div className="nav-container">
            {/* Logo on leftmost side */}
            <div className="logo sat-logo">
              <img src="/logo.png" alt="Logo" className="logo-img" />
              <span className="logo-text">Mock SAT Exam</span>
            </div>
            
            {/* Navigation links and Account button on rightmost side */}
            <div className="nav-links sat-nav-links">
              <Link to="/" className="nav-link sat-nav-link blogs-link">
                Home
              </Link>
              <Link to="/courses" className="nav-link sat-nav-link courses-link">
                Courses
              </Link>
              <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link">
                RoadMap
              </Link>
              <Link to="/mock-practice" className="nav-link sat-nav-link mock-practice-link">
                Mocks
              </Link>
              <Link to="/game" className="nav-link sat-nav-link game-link">
                Game
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

        {/* Main Content Area */}
        <div className="blogs-main-content">

          {/* Main Content Grid */}
          <div className="blogs-content-grid">
            {/* Sidebar - Hidden on Mobile */}
            {!isMobile && (
              <aside className="blogs-sidebar">
                <div className="sidebar-section">
                  <h3 className="sidebar-title">
                    <FilterListIcon className="sidebar-icon" />
                    Categories
                  </h3>
                  <div className="categories-list">
                    <button
                      onClick={() => handleCategoryClick('')}
                      className={`category-btn ${!category ? 'active' : ''}`}
                    >
                      <span>All Topics</span>
                      <span className="category-count">{pagination.total}</span>
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.category}
                        onClick={() => handleCategoryClick(cat.category)}
                        className={`category-btn ${category === cat.category ? 'active' : ''}`}
                      >
                        <span>{cat.category}</span>
                        <span className="category-count">{cat.count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sidebar-section">
                  <h3 className="sidebar-title">
                    <SortIcon className="sidebar-icon" />
                    Sort By
                  </h3>
                  <div className="sort-options">
                    <button
                      onClick={() => handleSortChange('newest')}
                      className={`sort-btn ${sort === 'newest' ? 'active' : ''}`}
                    >
                      Newest First
                    </button>
                    <button
                      onClick={() => handleSortChange('popular')}
                      className={`sort-btn ${sort === 'popular' ? 'active' : ''}`}
                    >
                      Most Popular
                    </button>
                    <button
                      onClick={() => handleSortChange('trending')}
                      className={`sort-btn ${sort === 'trending' ? 'active' : ''}`}
                    >
                      <TrendingUpIcon className="btn-icon" />
                      Trending
                    </button>
                  </div>
                </div>



                <div className="sidebar-section cta-box">
                  <h3 className="sidebar-title">Free SAT Guide</h3>
                  <p>Get our free comprehensive SAT preparation guide with expert strategies</p>
                  <button className="cta-button">
                    Download Now →
                  </button>
                </div>

                {/* Environment selector for debugging */}
                <div className="sidebar-section debug-section">
                  <h3 className="sidebar-title">🔧 Debug Panel</h3>
                  <div className="debug-info">
                    <div className="debug-item">
                      <strong>Your Domain:</strong>
                      <span className="debug-value">{currentDomain}</span>
                    </div>
                    <div className="debug-item">
                      <strong>API Target:</strong>
                      <span className="debug-value">{API_BASE_URL}</span>
                    </div>
                    <div className="debug-item">
                      <strong>Environment:</strong>
                      <div className="environment-buttons">
                        <button 
                          onClick={() => handleEnvironmentChange('remote')}
                          className={`env-btn ${environment === 'remote' ? 'active' : ''}`}
                        >
                          Cloudflare
                        </button>
                        <button 
                          onClick={() => handleEnvironmentChange('local')}
                          className={`env-btn ${environment === 'local' ? 'active' : ''}`}
                        >
                          Local
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="debug-actions">
                    <button 
                      onClick={testAPIConnection}
                      className="debug-btn primary"
                    >
                      Test API Connection
                    </button>
                    <button 
                      onClick={checkCORSStatus}
                      className="debug-btn secondary"
                    >
                      Check CORS Status
                    </button>
                    <button 
                      onClick={fetchBlogs}
                      className="debug-btn tertiary"
                    >
                      Reload Data
                    </button>
                  </div>
                </div>
              </aside>
            )}

            {/* Main Content */}
            <main className={`blogs-content-area ${isMobile ? 'mobile-view' : ''}`}>
              <div className="content-header">
                <h2 className="content-title">
                  SAT Preparation Articles
                  {category && (
                    <span className="category-filter">
                      / {category}
                    </span>
                  )}
                </h2>
                <div className="content-stats">
                  <span>Showing {blogs.length} of {pagination.total} articles</span>
                  <div className="environment-info">
                    <span className="environment-badge">
                      {environment === 'remote' ? '🌐 Cloudflare' : '💻 Local'}
                    </span>
                    <span className="domain-badge">
                      🔗 {currentDomain}
                    </span>
                  </div>
                </div>
              </div>

              {/* API Error Display */}
              {apiError && (
                <div className="api-error-alert">
                  <h4>⚠️ Connection Issue Detected</h4>
                  <p><strong>Error:</strong> {apiError}</p>
                  <div className="error-actions">
                    <button onClick={fetchBlogs} className="error-btn">
                      🔄 Retry Connection
                    </button>
                    <button onClick={testAPIConnection} className="error-btn">
                      🧪 Test API
                    </button>
                    <button onClick={checkCORSStatus} className="error-btn">
                      🔍 Check CORS
                    </button>
                    {environment === 'remote' ? (
                      <button onClick={() => handleEnvironmentChange('local')} className="error-btn">
                        💻 Switch to Local
                      </button>
                    ) : (
                      <button onClick={() => handleEnvironmentChange('remote')} className="error-btn">
                        🌐 Switch to Cloudflare
                      </button>
                    )}
                  </div>
                  <div className="error-help">
                    <p><strong>Troubleshooting Tips:</strong></p>
                    <ul>
                      <li>Make sure Cloudflare Worker is running</li>
                      <li>Check if your domain ({currentDomain}) is in CORS allowed list</li>
                      <li>Verify network connection</li>
                      <li>Try switching environments</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Search Bar at top of articles section */}
              <div className="content-search-container">
                <form onSubmit={handleSearch} className="content-search-form">
                  <div className="content-search-input-container">
                    <input
                      type="search"
                      name="search"
                      placeholder="Search articles by title, topic, or keyword..."
                      defaultValue={search}
                      className="content-search-input"
                    />
                    <button type="submit" className="content-search-button">
                      Search Articles
                    </button>
                  </div>
                </form>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading SAT articles from {environment === 'remote' ? 'Cloudflare' : 'Local'}...</p>
                  <p className="loading-hint">
                    Connected to: <strong>{API_BASE_URL}</strong>
                    <br />
                    Your domain: <strong>{currentDomain}</strong>
                  </p>
                </div>
              ) : (
                <>
                  <div className={`blogs-grid ${isMobile ? 'mobile-grid' : ''}`}>
                    {blogs.map(blog => (
                      <article key={blog.id} className={`blog-card ${isMobile ? 'mobile-card' : ''}`}>
                        <div onClick={() => navigate(`/blog/${blog.slug}`)} className="blog-card-link">
                          <div className="blog-image-container">
                            <img 
                              src={blog.cover_image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400'} 
                              alt={blog.title}
                              className="blog-image"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400';
                              }}
                            />
                            <div className="blog-category">{blog.category}</div>
                            
                          </div>
                          
                          <div className="blog-content">
                            <h2 className="blog-title">{blog.title}</h2>
                            <p className="blog-excerpt">
                              {blog.meta_description || blog.title.substring(0, 120) + '...'}
                            </p>
                            
                            <div className="blog-meta">
                              <div className="meta-left">
                                <span className="author">{blog.author}</span>
                                <span className="date">
                                  <CalendarTodayIcon className="meta-icon" />
                                  {format(new Date(blog.publish_date), 'MMM dd, yyyy')}
                                </span>
                              </div>
                              <div className="meta-right">
                                <span className="reading-time">
                                  ⏱️ {blog.reading_time || 5} min
                                </span>
                                <span className="views">
                                  👁️ {blog.views || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="pagination">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="pagination-btn prev"
                      >
                        Previous
                      </button>
                      
                      <div className="page-numbers">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`page-btn ${page === pageNum ? 'active' : ''}`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="pagination-btn next"
                      >
                        Next
                      </button>
                    </div>
                  )}

                  {/* No results */}
                  {blogs.length === 0 && !loading && (
                    <div className="no-results">
                      <h3>📭 No articles found</h3>
                      <p>
                        {search || category 
                          ? `No articles found for "${search || category}" in ${environment} database.` 
                          : `No articles in ${environment} database.`}
                      </p>
                      <div className="no-results-actions">
                        
                        <button onClick={fetchBlogs} className="retry-btn">
                          🔄 Retry Loading
                        </button>
                        {environment === 'remote' ? (
                          <button 
                            onClick={() => handleEnvironmentChange('local')}
                            className="switch-db-btn"
                          >
                            🔄 Try Local Database
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleEnvironmentChange('remote')}
                            className="switch-db-btn"
                          >
                            🌐 Try Cloudflare Database
                          </button>
                        )}
                      </div>
                      <div className="debug-suggestions">
                        <h4>🛠️ Debug Suggestions:</h4>
                        <ol>
                          <li>Click "Test API Connection" to verify API is accessible</li>
                          <li>Check if your domain ({currentDomain}) is allowed in CORS</li>
                          <li>Try switching between Local and Cloudflare environments</li>
                          <li>Check browser console for detailed errors (F12)</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>

        </div>

        {/* Mobile Menu - Matching App.jsx */}
        {isMenuOpen && (
          <div className="mobile-menu sat-mobile-menu">
            <div className="mobile-menu-header">
              <div className="mobile-menu-logo">
                <img src="/logo.png" alt="Logo" className="mobile-logo-img" />
              </div>
              <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
            </div>
            <div className="mobile-menu-content">
              <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/courses" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                Courses
              </Link>
              <Link to="/roadmap" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                RoadMap
              </Link>
              
              <Link to="/mock-practice" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                Mocks
              </Link>
              <Link to="/game" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                Game
              </Link>
              <Link to="/profile" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                Account
              </Link>

              {/* Mobile debug panel */}
              <div className="mobile-debug-section">
                <h4>🔧 Debug Tools</h4>
                <div className="mobile-env-buttons">
                  <button 
                    onClick={() => {
                      handleEnvironmentChange('remote');
                      setIsMenuOpen(false);
                    }}
                    className={`mobile-env-btn ${environment === 'remote' ? 'active' : ''}`}
                  >
                    Cloudflare API
                  </button>
                  <button 
                    onClick={() => {
                      handleEnvironmentChange('local');
                      setIsMenuOpen(false);
                    }}
                    className={`mobile-env-btn ${environment === 'local' ? 'active' : ''}`}
                  >
                    Local API
                  </button>
                </div>
                <button 
                  onClick={() => {
                    testAPIConnection();
                    setIsMenuOpen(false);
                  }}
                  className="mobile-debug-btn"
                >
                  Test Connection
                </button>
                <button 
                  onClick={() => {
                    fetchBlogs();
                    setIsMenuOpen(false);
                  }}
                  className="mobile-debug-btn"
                >
                  Reload Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogsList;