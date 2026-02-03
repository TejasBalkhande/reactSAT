import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import './SingleBlog.css';
import { 
  FaPenAlt, 
  FaChartBar, 
  FaUniversity, 
  FaBook, 
  FaGamepad, 
  FaUsers,
  FaMap,
  FaRoad
} from 'react-icons/fa';

// Import Material-UI icons
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
import BannerAd2 from '../banner_box';

const SingleBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [environment, setEnvironment] = useState('remote');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      } else {
        setError(response.data.message || 'Blog post not found');
      }
    } catch (err) {
      console.error('Error fetching blog:', err);
      
      if (err.response?.status === 404) {
        setError('Blog post not found. It might have been deleted or unpublished.');
      } else if (err.code === 'ERR_NETWORK') {
        setError(`Cannot connect to ${environment} Cloudflare Worker at ${API_BASE_URL}.`);
        
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
      '<p style="margin-bottom: 1.5rem; line-height: 1.6;">'
    );
  };

  // Handle navigation to StudyPlan
  const handleStartMockTest = () => {
    navigate('/digital-sat-practice-questions');
  };

  // Handle navigation to StudyPlan (changed from /practice)
  const handleSolveQuestions = () => {
    navigate('/digital-sat-practice-questions');
  };

  // Handle navigation to Roadmap
  const handleCreateRoadmap = () => {
    navigate('/roadmap');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="sat-app">
        {/* Navigation */}
        <nav className="navbar sat-navbar">
          <div className="nav-container">
            <div className="logo sat-logo"  onClick={(e) => {
              e.stopPropagation();   // important!
              navigate('/');
            } }>
              <img src="/logo.png" alt="Logo" className="logo-img" />
              <span className="logo-text">Mock SAT Exam</span>
            </div>
            
            <div className="nav-links sat-nav-links">
              <Link to="/" className="nav-link sat-nav-link community-link">
                Home
              </Link>
              <Link to="/courses" className="nav-link sat-nav-link courses-link">
                Courses
              </Link>
              <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link">
                RoadMap
              </Link>
              <Link to="/digital-sat-practice-questions" className="nav-link sat-nav-link digital-sat-practice-questions-link">
                Questions
              </Link>
              <Link to="/blogs" className="nav-link sat-nav-link blogs-link">
                Blogs
              </Link>
              
              <button className="signin-btn sat-signin-btn">
                Account
              </button>
            </div>
            
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              ☰
            </button>
          </div>
        </nav>

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
            borderTop: '5px solid #4A7C59',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}></div>
          <p style={{ fontSize: '1.2rem', color: '#2B463C' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !blog) {
    return (
      <div className="sat-app">
        {/* Navigation */}
        <nav className="navbar sat-navbar">
          <div className="nav-container">
            <div className="logo sat-logo">
              <img src="/logo.png" alt="Logo" className="logo-img" />
              <span className="logo-text">Mock SAT Exam</span>
            </div>
            
            <div className="nav-links sat-nav-links">
              <Link to="/" className="nav-link sat-nav-link community-link">
                Home
              </Link>
              <Link to="/courses" className="nav-link sat-nav-link courses-link">
                Courses
              </Link>
              <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link">
                RoadMap
              </Link>
              <Link to="/digital-sat-practice-questions" className="nav-link sat-nav-link digital-sat-practice-questions-link">
                Questions
              </Link>
              <Link to="/blogs" className="nav-link sat-nav-link blogs-link">
                Blogs
              </Link>

              <button className="signin-btn sat-signin-btn">
                Account
              </button>
            </div>
            
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              ☰
            </button>
          </div>
        </nav>

        <div className="error-container" style={{
          maxWidth: '800px',
          margin: '100px auto 0',
          padding: '60px 20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#e53e3e', marginBottom: '20px' }}>Article Not Found</h2>
          <p style={{ color: '#666666', fontSize: '1.1rem', marginBottom: '30px' }}>
            {error || "The SAT preparation article you're looking for doesn't exist."}
          </p>
          
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px' }}>
            <Link 
              to="/blogs" 
              className="sat-hero-btn primary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              ← Browse All SAT Articles
            </Link>
            <Link 
              to="/admin/create-blog" 
              className="sat-hero-btn-secondary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              ✍️ Create New Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render blog content
  return (
    <div className="sat-app">
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

      {/* Navigation */}
      <nav className="navbar sat-navbar">
        <div className="nav-container">
          <div className="logo sat-logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          <div className="nav-links sat-nav-links">
            <Link to="/" className="nav-link sat-nav-link community-link">
                Home
              </Link>
            <Link to="/courses" className="nav-link sat-nav-link courses-link">
              Courses
            </Link>
            <Link to="/roadmap" className="nav-link sat-nav-link roadmap-link">
              RoadMap
            </Link>
            <Link to="/digital-sat-practice-questions" className="nav-link sat-nav-link digital-sat-practice-questions-link">
              Questions
            </Link>

            <Link to="/blogs" className="nav-link sat-nav-link blogs-link">
              Blogs
            </Link>

            <button className="signin-btn sat-signin-btn">
              Account
            </button>
          </div>
          
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>
      </nav>

      {/* Main Blog Content */}
      <div className="single-blog-container sat-page-content">
        <div className="breadcrumb sat-breadcrumb">
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
        </div>

        <div className="blog-main">
          <aside className="blog-sidebar">
            <div className="sidebar-widget sat-sidebar-widget">
              <h3>SAT Practice</h3>
              <div className="sat-practice-buttons">
                <button 
                  className="sat-solve-btn"
                  onClick={handleSolveQuestions}
                  style={{ width: '100%', marginBottom: '0.75rem' }}
                >
                  Solve Questions
                </button>
                {/* NEW ROADMAP BUTTON */}
                <button 
                  className="sat-roadmap-btn"
                  onClick={handleCreateRoadmap}
                  style={{ width: '100%' }}
                >
                   Create Roadmap
                </button>
              </div>
            </div>


            <div className="sidebar-widget sat-sidebar-widget">
              <h3>Trending SAT Articles</h3>
              <div className="trending-list">
                {trendingPosts.length > 0 ? (
                  trendingPosts.map(post => (
                    <Link 
                      key={post.slug} 
                      to={`/blog/${post.slug}`}
                      className="trending-item sat-trending-item"
                    >
                      <h4>{post.title}</h4>
                      <div className="trending-meta">
                        <span>{format(new Date(post.publish_date || post.created_at), 'MMM dd')}</span>
                        <span>👁️ {post.views || 0}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="sat-no-content">
                    No trending articles yet
                  </p>
                )}
              </div>
            </div>

            <div className="sidebar-widget sat-sidebar-widget">
              <h3>SAT Quick Tips</h3>
              <div className="quick-tips sat-quick-tips">
                <div className="tip sat-tip">
                  <strong>Math Tip:</strong> Memorize key formulas
                </div>
                <div className="tip sat-tip">
                  <strong>Reading Tip:</strong> Skim questions first
                </div>
                <div className="tip sat-tip">
                  <strong>Writing Tip:</strong> Watch for subject-verb agreement
                </div>
                <div className="tip sat-tip">
                  <strong>General:</strong> Pace yourself - don't spend too long on one question
                </div>
              </div>
            </div>
          </aside>

          <article className="blog-content sat-blog-content">
            <header className="article-header sat-article-header">
              <h1 className="article-title sat-article-title">{blog.title}</h1>
              
              <div className="article-meta sat-article-meta">
                <div className="meta-left">
                  <span className="author">By {blog.author}</span>
                  {/* Hidden in mobile view */}
                  <span className="date desktop-only">
                    {format(new Date(blog.publish_date || blog.created_at), 'MMMM dd, yyyy')}
                  </span>
                  <span className="reading-time desktop-only">
                    ⏱️ {blog.reading_time || 5} min read
                  </span>
                </div>
                <div className="meta-right">
                  <span className="views">👁️ {blog.views || 0} views</span>
                </div>
              </div>
            </header>

            {blog.cover_image && (
              <div className="featured-image sat-featured-image">
                <img 
                  src={blog.cover_image} 
                  alt={blog.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="image-caption sat-image-caption">
                  SAT preparation requires consistent practice and strategy
                </div>
              </div>
            )}

            <div className="article-body sat-article-body">
              <div 
                className="html-content sat-html-content"
                dangerouslySetInnerHTML={{ 
                  __html: formatContent(blog.html_content) 
                }}
              />
            </div>

            <footer className="article-footer sat-article-footer">
              
              {blog.keywords && blog.keywords.trim() && (
                <div className="article-tags sat-article-tags">
                  <h4>Topics:</h4>
                  {blog.keywords.split(',').map((keyword, index) => (
                    keyword.trim() && (
                      <Link 
                        key={index}
                        to={`/blogs?search=${encodeURIComponent(keyword.trim())}`}
                        className="tag sat-tag"
                      >
                        {keyword.trim()}
                      </Link>
                    )
                  ))}
                </div>
              )}

              <div className="author-bio sat-author-bio">
                <div className="author-info">
                  <h4>About the Author</h4>
                  <p><strong>{blog.author}</strong> is an SAT preparation expert with years of experience helping students achieve their target scores.</p>
                </div>
              </div>

              {relatedPosts.length > 0 && (
                <div className="related-posts sat-related-posts">
                  <h3>Related SAT Articles</h3>
                  <div className="related-grid sat-related-grid">
                    {relatedPosts.map(post => (
                      <Link 
                        key={post.slug}
                        to={`/blog/${post.slug}`}
                        className="related-card sat-related-card"
                      >
                        {post.cover_image && (
                          <img 
                            src={post.cover_image} 
                            alt={post.title}
                            className="related-image sat-related-image"
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
            </footer>
          </article>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu">
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
            <Link to="/community" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Community
            </Link>
            <Link to="/digital-sat-practice-questions" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Questions
            </Link>

            <Link to="/blogs" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>
              Blogs
            </Link>
            <button className="mobile-signin-btn">
              Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBlog;