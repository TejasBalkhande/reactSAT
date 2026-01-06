import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';
import './BlogsList.css';

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
        <title>SAT Preparation Blog - Expert Tips & Strategies</title>
        <meta 
          name="description" 
          content="Comprehensive SAT preparation blog with math tips, reading strategies, writing guides, and college admission advice from experts." 
        />
        <meta 
          name="keywords" 
          content="SAT blog, SAT preparation, SAT tips, SAT math, SAT reading, SAT writing, college admissions" 
        />
        <link rel="canonical" href="https://satprep.com/blogs" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "SAT Preparation Blog",
            "description": "Expert SAT preparation tips and strategies",
            "url": "https://satprep.com/blogs",
            "publisher": {
              "@type": "Organization",
              "name": "SAT Prep Academy"
            }
          })}
        </script>
      </Helmet>

      <div className="blogs-list-container">
        {/* Hero Section */}
        <div className="blogs-hero">
          <div className="hero-content">
            <h1>SAT Preparation Blog</h1>
            <p className="hero-subtitle">
              Expert tips, strategies, and resources to help you ace the SAT exam
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                background: environment === 'remote' ? 'rgba(72, 187, 120, 0.3)' : 'rgba(229, 62, 62, 0.3)',
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${environment === 'remote' ? '#48bb78' : '#e53e3e'}`,
                color: 'white',
                fontWeight: 'bold'
              }}>
                📊 Source: {environment === 'remote' ? 'Cloudflare D1' : 'Local SQLite'}
              </div>
              <select
                value={environment}
                onChange={(e) => handleEnvironmentChange(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                <option value="local">Local Database</option>
                <option value="remote">Remote Database</option>
              </select>
              <button
                onClick={fetchBlogs}
                style={{
                  background: '#ed8936',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                🔄 Refresh
              </button>
            </div>

            {apiError && (
              <div style={{
                background: '#fed7d7',
                color: '#c53030',
                padding: '10px 20px',
                marginBottom: '20px',
                borderRadius: '8px',
                maxWidth: '600px',
                margin: '0 auto 20px'
              }}>
                <strong>⚠️ Connection Error:</strong> {apiError}
              </div>
            )}
            
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="search"
                name="search"
                placeholder="Search SAT topics, tips, strategies..."
                defaultValue={search}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>

            <div className="trending-topics">
              <span>Trending: </span>
              {getPopularKeywords().slice(0, 4).map(keyword => (
                <button
                  key={keyword}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('search', keyword);
                    setSearchParams(params);
                  }}
                  className="trending-tag"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="blogs-main">
          {/* Sidebar */}
          <aside className="blogs-sidebar">
            <div className="sidebar-section">
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3>Data Source</h3>
                <span style={{
                  fontSize: '0.8rem',
                  background: environment === 'remote' ? '#c6f6d5' : '#fed7d7',
                  color: environment === 'remote' ? '#22543d' : '#742a2a',
                  padding: '3px 8px',
                  borderRadius: '10px'
                }}>
                  {environment === 'remote' ? '🌐 Cloudflare' : '💻 Local'}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '15px' }}>
                {environment === 'remote' 
                  ? 'All blogs are stored in Cloudflare D1 Database and served via Worker.' 
                  : 'Using local development database for testing.'}
              </p>
              <button 
                onClick={() => handleEnvironmentChange(environment === 'remote' ? 'local' : 'remote')}
                className="quick-link"
                style={{ width: '100%', textAlign: 'center' }}
              >
                Switch to {environment === 'remote' ? 'Local' : 'Remote'}
              </button>
            </div>

            <div className="sidebar-section">
              <h3>Categories</h3>
              <div className="categories-list">
                <button
                  onClick={() => handleCategoryClick('')}
                  className={`category-btn ${!category ? 'active' : ''}`}
                >
                  All Topics
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
              <h3>Sort By</h3>
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
                  Trending
                </button>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Quick Links</h3>
              <div className="quick-links">
                <button onClick={handleCreateBlog} className="quick-link">
                  ✍️ Write a Blog
                </button>
                <a 
                  href="/sitemap.xml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="quick-link"
                >
                  🗺️ Sitemap
                </a>
                <button onClick={() => navigate('/')} className="quick-link">
                  🏠 Home
                </button>
              </div>
            </div>

            <div className="sidebar-section cta-box">
              <h3>Free SAT Guide</h3>
              <p>Get our free comprehensive SAT preparation guide</p>
              <button className="cta-button">
                Download Now
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="blogs-content">
            <div style={{
              marginBottom: '20px',
              padding: '15px',
              background: '#f7fafc',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, color: '#2d3748' }}>
                SAT Preparation Articles
                {category && (
                  <span style={{ color: '#667eea', marginLeft: '10px', fontSize: '1rem' }}>
                    / {category}
                  </span>
                )}
              </h2>
              <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                Showing {blogs.length} of {pagination.total} articles
              </div>
            </div>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading SAT articles from {environment} database...</p>
                <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                  API: {API_BASE_URL}/api/blogs
                </p>
              </div>
            ) : (
              <>
                <div className="blogs-grid">
                  {blogs.map(blog => (
                    <article key={blog.id} className="blog-card">
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
                          <div style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: environment === 'remote' ? 'rgba(72, 187, 120, 0.9)' : 'rgba(229, 62, 62, 0.9)',
                            color: 'white',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}>
                            {environment === 'remote' ? '🌐' : '💻'}
                          </div>
                        </div>
                        
                        <div className="blog-content">
                          <h2 className="blog-title">{blog.title}</h2>
                          <p className="blog-excerpt">
                            {blog.meta_description || blog.title.substring(0, 150) + '...'}
                          </p>
                          
                          <div className="blog-meta">
                            <div className="meta-left">
                              <span className="author">{blog.author}</span>
                              <span className="date">
                                {format(new Date(blog.publish_date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="meta-right">
                              <span className="reading-time">
                                ⏱️ {blog.reading_time || 5} min read
                              </span>
                              <span className="views">
                                👁️ {blog.views || 0} views
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
                      className="pagination-btn"
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
                      className="pagination-btn"
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
                    <button onClick={() => handleCreateBlog()} className="btn-primary" style={{ marginTop: '20px' }}>
                      ✍️ Write Your First Blog
                    </button>
                    {environment === 'remote' && (
                      <button 
                        onClick={() => handleEnvironmentChange('local')}
                        className="btn-secondary" 
                        style={{ marginTop: '10px', marginLeft: '10px' }}
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

        {/* SEO Footer */}
        <footer className="seo-footer">
          <div className="seo-content">
            <h2>SAT Preparation Resources</h2>
            <div className="seo-links">
              <div className="seo-column">
                <h3>SAT Sections</h3>
                <ul>
                  <li>SAT Math Practice</li>
                  <li>SAT Reading Comprehension</li>
                  <li>SAT Writing and Language</li>
                  <li>SAT Essay Writing</li>
                </ul>
              </div>
              <div className="seo-column">
                <h3>Study Materials</h3>
                <ul>
                  <li>SAT Practice Tests</li>
                  <li>SAT Vocabulary Lists</li>
                  <li>SAT Math Formulas</li>
                  <li>SAT Study Plans</li>
                </ul>
              </div>
              <div className="seo-column">
                <h3>Test Strategies</h3>
                <ul>
                  <li>Time Management</li>
                  <li>Guessing Strategies</li>
                  <li>Stress Management</li>
                  <li>Test Day Tips</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default BlogsList;