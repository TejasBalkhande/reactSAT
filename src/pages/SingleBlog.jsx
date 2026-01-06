import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import './SingleBlog.css';

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [environment, setEnvironment] = useState('remote');

  // Define API URLs for different environments
  const API_URLS = {
    local: 'http://localhost:8787',
    remote: 'https://sat-blog-worker.tejasbalkhande221.workers.dev'
  };

  const API_BASE_URL = API_URLS[environment];

  useEffect(() => {
    console.log('SingleBlog mounted with slug:', slug);
    console.log('API Base URL:', API_BASE_URL);
    fetchBlog();
  }, [slug, environment]);

  const fetchBlog = async () => {
    setLoading(true);
    setError('');
    try {
      console.log(`Fetching blog from: ${API_BASE_URL}/api/blogs/${slug}`);
      
      const response = await axios.get(
        `${API_BASE_URL}/api/blogs/${slug}`,
        {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Blog API response:', response.data);

      if (response.data.success) {
        setBlog(response.data.blog);
        setRelatedPosts(response.data.relatedPosts || []);
        setTrendingPosts(response.data.trendingPosts || []);
        
        // Track social shares (mock)
        trackSocialShare();
      } else {
        setError(response.data.message || 'Blog post not found');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 404) {
        setError('Blog post not found. It might have been deleted or unpublished.');
      } else if (err.code === 'ERR_NETWORK') {
        setError(`Cannot connect to ${environment} Cloudflare Worker at ${API_BASE_URL}.`);
        
        // Try switching environment automatically
        if (environment === 'remote') {
          setEnvironment('local');
          setError('Trying local environment...');
        } else {
          setError('Failed to connect to both remote and local environments.');
        }
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load blog post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const trackSocialShare = () => {
    // In production, implement actual tracking
    console.log('Blog viewed:', slug);
  };

  const handleSocialShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title || '';
    const text = blog?.meta_description || '';

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const generateBreadcrumbSchema = () => {
    if (!blog) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://satprep.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://satprep.com/blogs"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": blog.category,
          "item": `https://satprep.com/blogs?category=${encodeURIComponent(blog.category)}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": blog.title,
          "item": window.location.href
        }
      ]
    };
  };

  const formatContent = (html) => {
    if (!html) return '<p>No content available.</p>';
    
    return html.replace(
      /<p>/g, 
      '<p style="margin-bottom: 1.5rem; line-height: 1.8;">'
    );
  };

  // Render loading state
  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>
          Loading SAT preparation article from {environment}...
          <br />
          <small style={{ fontSize: '0.9rem', color: '#718096' }}>
            Slug: {slug}
            <br />
            API: {API_BASE_URL}/api/blogs/{slug}
          </small>
        </p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => fetchBlog()}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Retry Loading
          </button>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '2px solid #667eea',
              background: 'white',
              color: '#4a5568',
              cursor: 'pointer'
            }}
          >
            <option value="local">Local Database</option>
            <option value="remote">Remote Database</option>
          </select>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !blog) {
    return (
      <div className="error-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#e53e3e', marginBottom: '20px' }}>Article Not Found</h2>
        <p style={{ color: '#718096', fontSize: '1.1rem', marginBottom: '30px' }}>
          {error || "The SAT preparation article you're looking for doesn't exist."}
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px' }}>
          <Link 
            to="/blogs" 
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#667eea',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#5a67d8'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
          >
            ← Browse All SAT Articles
          </Link>
          <Link 
            to="/admin/create-blog" 
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#38a169',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2f855a'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#38a169'}
          >
            ✍️ Create New Blog
          </Link>
        </div>
        
        <div style={{ 
          marginTop: '40px', 
          background: '#f7fafc', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'left',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ color: '#4a5568', marginBottom: '10px' }}>Debug Information:</h4>
          <div style={{ fontSize: '0.9rem', color: '#718096' }}>
            <p style={{ marginBottom: '5px' }}>
              <strong>Slug:</strong> {slug}
            </p>
            <p style={{ marginBottom: '5px' }}>
              <strong>Environment:</strong> {environment}
            </p>
            <p style={{ marginBottom: '5px' }}>
              <strong>API URL:</strong> {API_BASE_URL}/api/blogs/{slug}
            </p>
            <p style={{ marginBottom: '15px' }}>
              <strong>Time:</strong> {new Date().toLocaleString()}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => {
                  window.open(`${API_BASE_URL}/api/blogs/${slug}`, '_blank');
                }}
                style={{
                  padding: '8px 16px',
                  background: '#ed8936',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Test API Endpoint
              </button>
              <button 
                onClick={() => {
                  window.open(`${API_BASE_URL}/api/blogs`, '_blank');
                }}
                style={{
                  padding: '8px 16px',
                  background: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                List All Blogs
              </button>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: '2px solid #667eea',
                  background: 'white',
                  color: '#4a5568',
                  cursor: 'pointer'
                }}
              >
                <option value="local">Switch to Local</option>
                <option value="remote">Switch to Remote</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render blog content
  return (
    <>
      <Helmet>
        <title>{blog.meta_title || blog.title}</title>
        <meta name="description" content={blog.meta_description} />
        <meta name="keywords" content={blog.keywords} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.meta_description} />
        <meta property="og:image" content={blog.cover_image} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.meta_description} />
        <meta name="twitter:image" content={blog.cover_image} />
        <link rel="canonical" href={`https://satprep.com/blog/${slug}`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.meta_description,
            "image": blog.cover_image,
            "author": {
              "@type": "Person",
              "name": blog.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "SAT Preparation Academy",
              "logo": {
                "@type": "ImageObject",
                "url": "https://satprep.com/logo.png"
              }
            },
            "datePublished": blog.publish_date,
            "dateModified": blog.updated_at || blog.publish_date,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            },
            "keywords": blog.keywords,
            "articleSection": blog.category,
            "timeRequired": `PT${blog.reading_time || 5}M`
          })}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema())}
        </script>
      </Helmet>

      <div className="single-blog-container">
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          background: '#e6f7ff',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span> / </span>
            <Link to="/blogs">Blog</Link>
            <span> / </span>
            <Link to={`/blogs?category=${encodeURIComponent(blog.category)}`}>
              {blog.category}
            </Link>
            <span> / </span>
            <span className="current">
              {blog.title.length > 50 ? blog.title.substring(0, 50) + '...' : blog.title}
            </span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>
              Source: <strong>{environment === 'remote' ? 'Cloudflare D1' : 'Local SQLite'}</strong>
            </span>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                border: '2px solid #667eea',
                background: 'white',
                color: '#4a5568',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="local">Local</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>

        <div className="blog-main">
          <aside className="blog-sidebar">
            <div className="sidebar-widget">
              <h3>Source Environment</h3>
              <div style={{ 
                padding: '10px', 
                background: environment === 'remote' ? '#e6fffa' : '#fefcbf',
                borderRadius: '6px',
                textAlign: 'center',
                marginBottom: '15px'
              }}>
                <strong>{environment === 'remote' ? '🌐 Cloudflare D1' : '💻 Local Database'}</strong>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#718096' }}>
                {environment === 'remote' 
                  ? 'This article is stored in Cloudflare D1 Database via Worker.' 
                  : 'This article is stored in your local development database.'}
              </p>
            </div>

            <div className="sidebar-widget">
              <h3>Trending SAT Articles</h3>
              <div className="trending-list">
                {trendingPosts.length > 0 ? (
                  trendingPosts.map(post => (
                    <Link 
                      key={post.slug} 
                      to={`/blog/${post.slug}`}
                      className="trending-item"
                    >
                      <h4>{post.title}</h4>
                      <div className="trending-meta">
                        <span>{format(new Date(post.publish_date || post.created_at), 'MMM dd')}</span>
                        <span>👁️ {post.views || 0}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                    No trending articles yet
                  </p>
                )}
              </div>
            </div>

            <div className="sidebar-widget">
              <h3>SAT Quick Tips</h3>
              <div className="quick-tips">
                <div className="tip">
                  <strong>Math Tip:</strong> Memorize key formulas
                </div>
                <div className="tip">
                  <strong>Reading Tip:</strong> Skim questions first
                </div>
                <div className="tip">
                  <strong>Writing Tip:</strong> Watch for subject-verb agreement
                </div>
                <div className="tip">
                  <strong>General:</strong> Pace yourself - don't spend too long on one question
                </div>
              </div>
            </div>

            <div className="sidebar-widget cta-sidebar">
              <h3>Free SAT Practice Test</h3>
              <p>Get instant score and detailed analysis</p>
              <button className="cta-button" onClick={() => navigate('/practice-tests')}>
                Download Now
              </button>
            </div>
          </aside>

          <article className="blog-content">
            <header className="article-header">
              <div className="category-badge">{blog.category}</div>
              <h1 className="article-title">{blog.title}</h1>
              
              <div className="article-meta">
                <div className="meta-left">
                  <span className="author">By {blog.author}</span>
                  <span className="date">
                    {format(new Date(blog.publish_date || blog.created_at), 'MMMM dd, yyyy')}
                  </span>
                  <span className="reading-time">
                    ⏱️ {blog.reading_time || 5} min read
                  </span>
                </div>
                <div className="meta-right">
                  <span className="views">👁️ {blog.views || 0} views</span>
                </div>
              </div>

              <div className="social-share">
                <span>Share:</span>
                <button 
                  onClick={() => handleSocialShare('facebook')}
                  className="social-btn facebook"
                >
                  Facebook
                </button>
                <button 
                  onClick={() => handleSocialShare('twitter')}
                  className="social-btn twitter"
                >
                  Twitter
                </button>
                <button 
                  onClick={() => handleSocialShare('linkedin')}
                  className="social-btn linkedin"
                >
                  LinkedIn
                </button>
                <button 
                  onClick={() => handleSocialShare('whatsapp')}
                  className="social-btn whatsapp"
                >
                  WhatsApp
                </button>
              </div>
            </header>

            {blog.cover_image && (
              <div className="featured-image">
                <img 
                  src={blog.cover_image} 
                  alt={blog.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80';
                    e.target.style.backgroundColor = '#f7fafc';
                    e.target.style.padding = '40px';
                    e.target.style.textAlign = 'center';
                  }}
                />
                <div className="image-caption">
                  SAT preparation requires consistent practice and strategy
                </div>
              </div>
            )}

            <div className="article-body">
              <div 
                className="html-content"
                dangerouslySetInnerHTML={{ 
                  __html: formatContent(blog.html_content) 
                }}
              />
            </div>

            <footer className="article-footer">
              {blog.keywords && blog.keywords.trim() && (
                <div className="article-tags">
                  <h4>Topics:</h4>
                  {blog.keywords.split(',').map((keyword, index) => (
                    keyword.trim() && (
                      <Link 
                        key={index}
                        to={`/blogs?search=${encodeURIComponent(keyword.trim())}`}
                        className="tag"
                      >
                        {keyword.trim()}
                      </Link>
                    )
                  ))}
                </div>
              )}

              <div className="author-bio">
                <div className="author-info">
                  <h4>About the Author</h4>
                  <p><strong>{blog.author}</strong> is an SAT preparation expert with years of experience helping students achieve their target scores.</p>
                </div>
              </div>

              <div className="article-cta">
                <h3>Ready to Boost Your SAT Score?</h3>
                <p>Join thousands of students who improved their scores with our proven methods.</p>
                <button className="primary-cta" onClick={() => navigate('/study-plans')}>
                  Get Free SAT Study Plan
                </button>
              </div>

              {relatedPosts.length > 0 && (
                <div className="related-posts">
                  <h3>Related SAT Articles</h3>
                  <div className="related-grid">
                    {relatedPosts.map(post => (
                      <Link 
                        key={post.slug}
                        to={`/blog/${post.slug}`}
                        className="related-card"
                      >
                        {post.cover_image && (
                          <img 
                            src={post.cover_image} 
                            alt={post.title}
                            className="related-image"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        )}
                        <h4>{post.title}</h4>
                        <p>{post.meta_description?.substring(0, 100) || 'Read more about SAT preparation...'}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="comments-section">
                <h3>Discussion & Questions</h3>
                <p>Have questions about SAT preparation? Share your thoughts below.</p>
                <div className="comment-form">
                  <textarea 
                    placeholder="Share your SAT preparation experience or ask a question..."
                    rows="4"
                  ></textarea>
                  <button className="submit-comment">Post Comment</button>
                </div>
              </div>
            </footer>
          </article>
        </div>

        <div className="seo-article-footer">
          <div className="seo-content">
            <h3>SAT Preparation Resources</h3>
            <div className="resource-links">
              <Link to="/blogs?category=SAT+Math">SAT Math Formulas</Link>
              <Link to="/blogs?category=SAT+Reading">Reading Comprehension Tips</Link>
              <Link to="/blogs?category=SAT+Writing">Grammar Rules Cheat Sheet</Link>
              <Link to="/blogs?category=Study+Plans">8-Week Study Plan</Link>
              <Link to="/blogs?category=Test+Strategies">Test Day Checklist</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlog;