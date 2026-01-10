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

      console.log(`Fetching blogs from: ${API_BASE_URL}/api/blogs?${params}`);

      const response = await axios.get(
        `${API_BASE_URL}/api/blogs?${params}`,
        {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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
      } else {
        setApiError(response.data.message || 'Failed to load blogs');
      }
    } catch (error) {
      console.error(`Error fetching blogs from ${environment}:`, error);
      setBlogs([]);
      setCategories([]);
      
      if (error.code === 'ERR_NETWORK') {
        setApiError(`Cannot connect to ${environment} Cloudflare Worker at ${API_BASE_URL}.`);
        
        // Try switching environment automatically
        if (environment === 'remote') {
          setEnvironment('local');
          setApiError('Trying local environment...');
        }
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

  const getPopularKeywords = () => {
    return [
      'SAT Math tips',
      'SAT Reading comprehension',
      'SAT Writing grammar',
      'SAT practice tests',
      'SAT score improvement',
      'SAT study schedule',
      'SAT test dates',
      'SAT online preparation',
      'SAT vocabulary',
      'SAT calculator tips'
    ];
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
              {/* UPDATED ACCOUNT BUTTON */}
             
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

                <div className="sidebar-section">
                  <h3 className="sidebar-title">Quick Actions</h3>
                  <div className="quick-actions">
                    <button onClick={handleCreateBlog} className="quick-action-btn primary">
                      ✍️ Write a Blog
                    </button>
                    <Link to="/" className="quick-action-btn secondary">
                      🏠 Back to Home
                    </Link>
                  </div>
                </div>

                <div className="sidebar-section cta-box">
                  <h3 className="sidebar-title">Free SAT Guide</h3>
                  <p>Get our free comprehensive SAT preparation guide with expert strategies</p>
                  <button className="cta-button">
                    Download Now →
                  </button>
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
                  Showing {blogs.length} of {pagination.total} articles
                </div>
              </div>

              {/* NEW: Search Bar at top of articles section */}
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
                  <p>Loading SAT articles....</p>
                  
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
                      <h3>No articles found</h3>
                      <p>
                        {search || category 
                          ? `No articles found for "${search || category}" in ${environment} database.` 
                          : `No articles in ${environment} database.`}
                      </p>
                      <button onClick={() => handleCreateBlog()} className="create-blog-btn">
                        ✍️ Write Your First Blog
                      </button>
                      {environment === 'remote' && (
                        <button 
                          onClick={() => handleEnvironmentChange('local')}
                          className="switch-db-btn"
                        >
                          Try Local Database
                        </button>
                      )}
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
              <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
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
              <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
                Account
              </Link>
               

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogsList;