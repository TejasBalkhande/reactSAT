import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateBlog.css';

// Lazy load ReactQuill to optimize initial load
const ReactQuill = lazy(() => import('react-quill'));
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image', 'video', 'formula'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'script', 'color', 'background', 'align',
  'link', 'image', 'video', 'formula'
];

const CreateBlog = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [slugPreview, setSlugPreview] = useState('');
  const [charCount, setCharCount] = useState({
    metaTitle: 0,
    metaDescription: 0
  });
  const [seoScore, setSeoScore] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [apiError, setApiError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  
  // Add environment selector state
  const [selectedEnvironment, setSelectedEnvironment] = useState('remote');

  // Define API URLs for different environments
  const API_URLS = {
    local: 'http://localhost:8787',
    remote: 'https://sat-blog-worker.tejasbalkhande221.workers.dev'
  };

  const API_BASE_URL = API_URLS[selectedEnvironment];

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_title: '',
    meta_description: '',
    keywords: '',
    author: 'SAT Prep Team',
    cover_image: '',
    html_content: '',
    publish_date: new Date().toISOString().split('T')[0],
    status: 'draft',
    category: 'SAT Tips',
    reading_time: 5
  });

  const SAT_CATEGORIES = [
    'SAT Math',
    'SAT Reading', 
    'SAT Writing',
    'Test Strategies',
    'Study Plans',
    'College Admissions',
    'SAT Tips',
    'Score Improvement',
    'Practice Tests',
    'Time Management'
  ];

  const SAT_KEYWORDS = [
    'SAT exam', 'SAT preparation', 'SAT tips', 'SAT math',
    'SAT reading', 'SAT writing', 'college admissions',
    'test strategies', 'study plan', 'SAT practice test',
    'SAT score', 'SAT online course', 'SAT tutoring',
    'digital SAT', 'SAT registration', 'SAT dates',
    'SAT vocabulary', 'SAT grammar', 'SAT calculator',
    'SAT essay', 'SAT prep books', 'free SAT practice'
  ];

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()
        .substring(0, 60);
      setSlugPreview(generatedSlug);
    }
  }, [formData.title, formData.slug]);

  // Character count for SEO
  useEffect(() => {
    setCharCount({
      metaTitle: formData.meta_title.length,
      metaDescription: formData.meta_description.length
    });
  }, [formData.meta_title, formData.meta_description]);

  // Calculate word count and SEO score
  useEffect(() => {
    // Calculate word count from HTML content
    const textContent = formData.html_content.replace(/<[^>]*>/g, ' ');
    const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Calculate reading time (assuming 200 words per minute)
    const readingTime = Math.max(1, Math.ceil(words.length / 200));
    setFormData(prev => ({ ...prev, reading_time: readingTime }));
    
    // Calculate SEO score
    let score = 0;
    if (formData.title.length >= 10 && formData.title.length <= 70) score += 20;
    if (formData.meta_title.length >= 50 && formData.meta_title.length <= 60) score += 20;
    if (formData.meta_description.length >= 120 && formData.meta_description.length <= 160) score += 20;
    if (words.length >= 500) score += 20;
    if (formData.keywords.split(',').filter(k => k.trim()).length >= 3) score += 10;
    if (formData.cover_image) score += 10;
    
    setSeoScore(score);
  }, [formData]);

  // Test API connection on component mount
  useEffect(() => {
    testApiConnection();
  }, [selectedEnvironment]);

  const testApiConnection = async () => {
    try {
      setApiStatus('checking');
      const response = await axios.get(`${API_BASE_URL}/api/blogs?limit=1`, {
        timeout: 5000
      });
      
      if (response.data.success) {
        setApiStatus('online');
        setApiError('');
        console.log(`✅ ${selectedEnvironment.toUpperCase()} API connection successful:`, API_BASE_URL);
      } else {
        setApiStatus('error');
        setApiError('API returned error: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(`❌ ${selectedEnvironment.toUpperCase()} API connection failed:`, error.message);
      setApiStatus('error');
      
      if (error.code === 'ERR_NETWORK') {
        setApiError(`Cannot connect to Cloudflare Worker at ${API_BASE_URL}. Make sure the worker is deployed and running.`);
      } else if (error.code === 'ECONNABORTED') {
        setApiError('Connection timeout. The server might be down or slow to respond.');
      } else {
        setApiError(`Connection error: ${error.message}`);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      html_content: value
    }));
  };

  const generateMetaFromTitle = () => {
    if (formData.title) {
      setFormData(prev => ({
        ...prev,
        meta_title: formData.title.substring(0, 60),
        meta_description: `${formData.title.substring(0, 157)} - Expert SAT preparation tips and strategies to help you achieve your target score. Download free practice materials and join our SAT prep course today!`
      }));
    }
  };

  const handleSubmit = async (e, status) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');

    try {
      const finalSlug = formData.slug || slugPreview;
      const dataToSend = {
        ...formData,
        slug: finalSlug,
        status: status || formData.status,
        keywords: formData.keywords || 'SAT, SAT Exam, SAT Preparation, College Admissions, Test Strategies',
        author: formData.author || 'SAT Prep Team',
        category: formData.category || 'SAT Tips',
        reading_time: formData.reading_time || 5,
        publish_date: formData.publish_date || new Date().toISOString().split('T')[0]
      };

      console.log(`📤 Sending data to ${selectedEnvironment} Cloudflare Worker:`, API_BASE_URL);
      console.log('📝 Data being sent:', JSON.stringify(dataToSend, null, 2));

      const response = await axios.post(
        `${API_BASE_URL}/api/blogs`,
        dataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000 // 15 second timeout
        }
      );

      console.log(`✅ Response from ${selectedEnvironment} Cloudflare:`, response.data);

      if (response.data.success) {
        alert(`🎉 Blog post created successfully in ${selectedEnvironment} Cloudflare D1 database!`);
        
        // Navigate based on status
        if (status === 'published') {
          navigate(`/blog/${response.data.slug || finalSlug}`);
        } else {
          navigate('/admin');
        }
      } else {
        throw new Error(response.data.error || response.data.message || 'Failed to create blog');
      }
    } catch (error) {
      console.error(`❌ Error creating blog in ${selectedEnvironment}:`, error);
      
      let errorMessage = 'Error creating blog post. Please try again.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = `Cannot connect to ${selectedEnvironment} Cloudflare Worker at ${API_BASE_URL}. Please ensure:\n1. The worker is deployed (npx wrangler deploy)\n2. The worker URL is correct\n3. CORS is properly configured`;
      } else if (error.response?.status === 409) {
        errorMessage = `Slug already exists in ${selectedEnvironment} database. Please use a different title or slug.`;
      } else if (error.response?.data?.error) {
        errorMessage = `Server Error: ${error.response.data.error}`;
        if (error.response.data.details) {
          errorMessage += `\nDetails: ${error.response.data.details}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setApiError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = (keyword) => {
    const currentKeywords = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
    if (!currentKeywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...currentKeywords, keyword].join(', ')
      }));
    }
  };

  const clearKeywords = () => {
    setFormData(prev => ({
      ...prev,
      keywords: ''
    }));
  };

  const handlePublish = (e) => {
    if (apiStatus !== 'online') {
      alert(`⚠️ Cannot publish: ${selectedEnvironment} API connection is not available. Please check your Cloudflare Worker deployment.`);
      return;
    }
    handleSubmit(e, 'published');
  };

  const handleSaveDraft = (e) => {
    if (apiStatus !== 'online') {
      alert(`⚠️ Cannot save: ${selectedEnvironment} API connection is not available. Please check your Cloudflare Worker deployment.`);
      return;
    }
    handleSubmit(e, 'draft');
  };

  return (
    <div className="create-blog-container">
      {apiError && (
        <div style={{
          background: '#fed7d7',
          color: '#c53030',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '8px',
          border: '2px solid #fc8181'
        }}>
          <strong>⚠️ Cloudflare Connection Error ({selectedEnvironment}):</strong> {apiError}
          <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
            <p><strong>Debug Steps:</strong></p>
            <ol style={{ marginLeft: '20px', marginTop: '5px' }}>
              <li>Deploy your worker: <code>npx wrangler deploy</code></li>
              <li>Check worker status: <code>npx wrangler d1 list</code></li>
              <li>Test API directly: <a href={`${API_BASE_URL}/api/blogs`} target="_blank" rel="noopener noreferrer">Open API Endpoint</a></li>
              <li>Initialize database: <a href={`${API_BASE_URL}/api/init-db`} target="_blank" rel="noopener noreferrer">Initialize DB</a></li>
            </ol>
            <p style={{ marginTop: '10px' }}>
              <strong>Current API URL:</strong> {API_BASE_URL}
            </p>
          </div>
        </div>
      )}

      <div className="seo-header">
        <h1>📝 Create SAT Preparation Blog Post</h1>
        <p className="seo-tip">Blogs are saved directly to Cloudflare D1 Database via Worker</p>
        <div style={{ marginTop: '15px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            background: apiStatus === 'online' ? 'rgba(72, 187, 120, 0.3)' : 'rgba(229, 62, 62, 0.3)',
            padding: '8px 16px', 
            borderRadius: '20px',
            border: `2px solid ${apiStatus === 'online' ? '#48bb78' : '#e53e3e'}`
          }}>
            <strong>Cloudflare Status ({selectedEnvironment}):</strong> 
            <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
              {apiStatus === 'online' ? '✅ Online' : '❌ Offline'}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontWeight: 'bold', color: 'white' }}>Target:</label>
            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
              style={{
                padding: '6px 12px',
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
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px' }}>
            <strong>SEO Score:</strong> {seoScore}/100
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px' }}>
            <strong>Word Count:</strong> {wordCount} words ({formData.reading_time} min read)
          </div>
          <button
            onClick={testApiConnection}
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
            🔄 Test Connection
          </button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="blog-form">
        <div className="form-grid">
          {/* Left Column - Content */}
          <div className="form-column">
            <div className="form-section">
              <h2>📄 Content</h2>
              
              <div className="form-group required">
                <label htmlFor="title">Blog Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., 10 Proven Tips to Ace the SAT Math Section in 2024"
                  required
                  className="title-input"
                  minLength="10"
                  maxLength="100"
                />
                <small>Make it compelling and keyword-rich (10-100 characters). Include numbers and year for better CTR.</small>
              </div>

              <div className="form-group">
                <label htmlFor="slug">URL Slug</label>
                <div className="slug-input-group">
                  <span className="slug-prefix">https://satprep.com/blog/</span>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder={slugPreview || "auto-generated-slug"}
                    className="slug-input"
                    pattern="[a-z0-9\-]+"
                    title="Use lowercase letters, numbers, and hyphens only"
                  />
                </div>
                {slugPreview && !formData.slug && (
                  <small className="slug-hint">Suggested: {slugPreview}</small>
                )}
                <small>Leave empty for auto-generation. Use lowercase, hyphens, no spaces. Keep it under 60 characters.</small>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="category-select"
                  required
                >
                  {SAT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group required">
                <label htmlFor="html_content">Content</label>
                <Suspense fallback={
                  <div className="quill-loading">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', marginBottom: '10px' }}>✏️</div>
                      Loading rich text editor...
                    </div>
                  </div>
                }>
                  <ReactQuill
                    value={formData.html_content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your SAT preparation content here. Use headings, bullet points, examples, and images to create engaging content..."
                    className="quill-editor"
                    theme="snow"
                  />
                </Suspense>
                <div className="editor-note">
                  <strong>✍️ Writing Tips:</strong> Use H2 for main sections, H3 for subsections. Include at least 3 images. Minimum 500 words recommended for SEO. Add internal links to related articles.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - SEO & Settings */}
          <div className="form-column">
            <div className="form-section">
              <h2>🔍 SEO Optimization</h2>
              
              <div className="form-group">
                <label htmlFor="meta_title">
                  Meta Title 
                  <span className={`char-count ${charCount.metaTitle > 60 ? 'warning' : ''}`}>
                    {charCount.metaTitle}/60
                  </span>
                </label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="Appears in search results - include primary keyword at the beginning"
                  maxLength="60"
                  className={`meta-input ${charCount.metaTitle > 60 ? 'error' : ''}`}
                />
                <button 
                  type="button" 
                  onClick={generateMetaFromTitle}
                  className="generate-btn"
                  disabled={!formData.title}
                >
                  Generate from Title
                </button>
                <small>Optimal: 50-60 characters. Include main keyword at beginning. Add numbers or power words for clicks.</small>
              </div>

              <div className="form-group">
                <label htmlFor="meta_description">
                  Meta Description
                  <span className={`char-count ${charCount.metaDescription > 160 ? 'warning' : ''}`}>
                    {charCount.metaDescription}/160
                  </span>
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  placeholder="Brief, compelling summary for search results. Include keywords naturally and a call to action."
                  maxLength="160"
                  rows="3"
                  className={`meta-textarea ${charCount.metaDescription > 160 ? 'error' : ''}`}
                />
                <small>Optimal: 120-160 characters. Include primary and secondary keywords. End with a call to action.</small>
              </div>

              <div className="form-group">
                <label htmlFor="keywords">
                  Keywords
                  <div className="keyword-tags">
                    {SAT_KEYWORDS.slice(0, 8).map(keyword => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => addKeyword(keyword)}
                        className="keyword-tag"
                      >
                        {keyword}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={clearKeywords}
                      className="keyword-tag"
                      style={{ background: '#fed7d7', borderColor: '#fc8181', color: '#c53030' }}
                    >
                      Clear All
                    </button>
                  </div>
                </label>
                <textarea
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  placeholder="SAT, SAT exam, college admissions, test preparation, SAT math tips, SAT reading strategies"
                  rows="3"
                  className="keywords-textarea"
                />
                <small>Separate with commas. Use 3-5 primary keywords and 5-10 secondary keywords. Include long-tail keywords.</small>
              </div>
            </div>

            <div className="form-section">
              <h2>⚙️ Settings</h2>
              
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="SAT Prep Team"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cover_image">Cover Image URL</label>
                <input
                  type="url"
                  id="cover_image"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  pattern="https://.*"
                  title="Must be a valid HTTPS URL"
                />
                {formData.cover_image ? (
                  <div className="image-preview">
                    <img src={formData.cover_image} alt="Preview" onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="padding: 40px; text-align: center; color: #718096;">Image failed to load</div>';
                    }} />
                  </div>
                ) : (
                  <small>Recommended: 1200x630px for social media sharing. Use royalty-free images from Unsplash or Pexels.</small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="publish_date">Publish Date</label>
                <input
                  type="date"
                  id="publish_date"
                  name="publish_date"
                  value={formData.publish_date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="draft">Save as Draft</option>
                  <option value="published">Publish Now</option>
                </select>
              </div>
            </div>

            <div className="seo-checklist">
              <h3>✅ SEO Checklist</h3>
              <ul>
                <li className={formData.title.length >= 10 && formData.title.length <= 100 ? 'checked' : ''}>
                  Title length: 10-100 characters
                </li>
                <li className={wordCount > 500 ? 'checked' : ''}>
                  Content length &gt; 500 words ({wordCount} words)
                </li>
                <li className={formData.meta_title.length > 0 && formData.meta_title.length <= 60 ? 'checked' : ''}>
                  Meta title &lt; 60 chars ({charCount.metaTitle}/60)
                </li>
                <li className={formData.meta_description.length > 0 && formData.meta_description.length <= 160 ? 'checked' : ''}>
                  Meta description &lt; 160 chars ({charCount.metaDescription}/160)
                </li>
                <li className={formData.keywords.split(',').filter(k => k.trim()).length >= 3 ? 'checked' : ''}>
                  At least 3 keywords ({formData.keywords.split(',').filter(k => k.trim()).length} added)
                </li>
                <li className={formData.cover_image ? 'checked' : ''}>
                  Cover image added {formData.cover_image ? '✓' : '✗'}
                </li>
              </ul>
              <div style={{ marginTop: '20px', padding: '10px', background: '#e6fffa', borderRadius: '6px', textAlign: 'center' }}>
                <strong>SEO Score: {seoScore}/100</strong>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${seoScore}%`, 
                    height: '100%', 
                    background: seoScore >= 80 ? '#48bb78' : seoScore >= 60 ? '#ed8936' : '#e53e3e',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => {
              if (window.confirm('Are you sure? All unsaved changes will be lost.')) {
                navigate('/blogs');
              }
            }}
            className="btn-secondary"
            disabled={loading}
          >
            <span>✕</span> Cancel
          </button>
          <button 
            type="button"
            onClick={handleSaveDraft}
            disabled={loading || !formData.title || apiStatus !== 'online'}
            className="btn-secondary"
            title={apiStatus !== 'online' ? `${selectedEnvironment} Cloudflare API not connected` : ''}
          >
            {loading ? '⏳ Saving to Cloudflare...' : `💾 Save Draft to ${selectedEnvironment}`}
          </button>
          <button 
            type="button" 
            onClick={handlePublish}
            disabled={loading || !formData.title || !formData.html_content || apiStatus !== 'online'}
            className={`btn-primary ${loading ? 'loading' : ''}`}
            title={apiStatus !== 'online' ? `${selectedEnvironment} Cloudflare API not connected` : ''}
          >
            {loading ? '🚀 Publishing to Cloudflare...' : `📤 Publish to ${selectedEnvironment}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;