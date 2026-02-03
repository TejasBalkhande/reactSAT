import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // SEO: Import Helmet
import { FaPlayCircle, FaChartBar, FaUserCircle, FaTimes, FaDownload } from 'react-icons/fa';
import PersonIcon from '@mui/icons-material/Person';
import './Note.css';
import BannerAd from '../banner';
import PopUnder from '../popunder'; 

const Note = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clickCount, setClickCount] = useState(0); 
  const [showPopUnder, setShowPopUnder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Logic to handle popunder frequency
  const triggerAdLogic = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount % 2 === 0) {
      setShowPopUnder(true);
      setTimeout(() => setShowPopUnder(false), 1000);
    }
  };

  const mathResources = [
    { display: "Area and Volume", file: "Area_and_Volume" },
    { display: "Circles", file: "Circles" },
    { display: "Equivalent Expressions", file: "Equivalent_Expressions" },
    { display: "Linear Equations (One Var)", file: "Linear _Equations_in_One_Variable" },
    { display: "Linear Equations (Two Var)", file: "Linear_Equations_in_Two_Variables" },
    { display: "Linear Functions", file: "Linear_Function" },
    { display: "Linear Inequalities", file: "Linear_Inequalities" },
    { display: "Lines, Angles, Triangles", file: "Lines,_Angles,_and_Triangles" },
    { display: "Nonlinear Equations", file: "Nonlinear_&_Systems_of_Equations" },
    { display: "Nonlinear Functions", file: "Nonlinear_Functions" },
    { display: "Observational Studies", file: "Observational_Studies_and_Experiments" },
    { display: "One-Variable Data", file: "One-Variable_Data" },
    { display: "Percentages", file: "Percentages" },
    { display: "Probability", file: "Probability" },
    { display: "Ratios & Units", file: "Ratios,_Rates,_Proportions_&_Units" },
    { display: "Right Triangles & Trig", file: "Right_Triangles_and_Trigonometry" },
    { display: "Sample Statistics", file: "Sample_Statistics_and_Margin_of_Error" },
    { display: "Systems of Equations", file: "Systems_of_Linear_Equations" },
    { display: "Two-Variable Data", file: "Two-Variable_Data" }
  ];

  const readingWritingResources = [
    { display: "Boundaries", file: "Boundaries" },
    { display: "Central Ideas & Details", file: "Central_Ideas_and_Details" },
    { display: "Command of Evidence", file: "Command_of_Evidence" },
    { display: "Cross-Text Connections", file: "Cross-Text_Connections" },
    { display: "Form, Structure & Sense", file: "Form_Structure_and_Sense" },
    { display: "Inferences", file: "Inferences" },
    { display: "Rhetorical Synthesis", file: "Rhetorical_Synthesis" },
    { display: "Text Structure & Purpose", file: "Text_Structure_and_Purpose" },
    { display: "Transitions", file: "Transitions" },
    { display: "Words in Context", file: "Words_in_Context" }
  ];

  // SEO: Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Digital SAT Question Bank Archive",
    "description": "Free collection of Digital SAT practice worksheets, PDFs, and answer keys for Math and Reading & Writing.",
    "url": "https://mocksatexam.online/notes-question-bank",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        ...mathResources.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": `SAT Math: ${item.display}`
        })),
        ...readingWritingResources.map((item, index) => ({
          "@type": "ListItem",
          "position": mathResources.length + index + 1,
          "name": `SAT Reading: ${item.display}`
        }))
      ]
    }
  };

  const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePdfDownload = (e, resource, category) => {
    e.preventDefault();
    e.stopPropagation();
    
    triggerAdLogic(); 

    const basePath = category === 'Mathematics' 
      ? '/5658f84ef49frd8fdff1f56df1fdf15ffdf4d/Math54548878/'
      : '/5658f84ef49frd8fdff1f56df1fdf15ffdf4d/Reading and Writing54545775445/';
    
    const mainFileUrl = `${basePath}${resource.file}.pdf`;
    const mainFileName = `${resource.display}.pdf`;
    
    downloadFile(mainFileUrl, mainFileName);
  };

  const handleKeyDownload = (e, resource, category) => {
    e.preventDefault();
    e.stopPropagation();
    
    triggerAdLogic(); 

    const basePath = category === 'Mathematics' 
      ? '/5658f84ef49frd8fdff1f56df1fdf15ffdf4d/Math54548878/'
      : '/5658f84ef49frd8fdff1f56df1fdf15ffdf4d/Reading and Writing54545775445/';
    
    const keyFileUrl = `${basePath}${resource.file}_key.pdf`;
    const keyFileName = `${resource.display} - Key.pdf`;
    
    downloadFile(keyFileUrl, keyFileName);
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {/* SEO: Head Metadata */}
      <Helmet>
        <title>Digital SAT Question Bank 2026 | Free PDF Worksheets & Keys</title>
        <meta 
          name="description" 
          content="Access our free Digital SAT Question Bank Archive. Download PDF worksheets and answer keys for SAT Math, Reading & Writing. Perfect for Class of 2026/2027 prep." 
        />
        <meta name="keywords" content="Digital SAT Question Bank, SAT PDF Worksheets, Free SAT Practice, SAT Math PDF, SAT Reading Practice, SAT Class of 2026" />
        <link rel="canonical" href="https://mocksatexam.online/notes-question-bank" />
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Conditional PopUnder Injection */}
      {showPopUnder && <PopUnder />}

      {/* NAVBAR */}
      <nav className="navbar sat-navbar">
        <div className="nav-container">
          <div 
            className="logo sat-logo"
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="Mock SAT Exam Logo" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          <div className="nav-links sat-nav-links">
            <Link to="/roadmap" className="nav-link sat-nav-link">RoadMap</Link>
            <Link to="/digital-sat-practice-questions" className="nav-link sat-nav-link">Questions</Link>
            <Link to="/courses" className="nav-link sat-nav-link">Courses</Link>
            <Link to="/blogs" className="nav-link sat-nav-link">Blogs</Link>
            <button onClick={handleAccountClick} className="nav-link sat-nav-link account-button">
              {isLoggedIn ? 'Profile' : 'Account'}
            </button>
          </div>
          
          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu sat-mobile-menu">
          <div className="mobile-menu-header">
            <div className="mobile-menu-logo">
              <img src="/logo.png" alt="Mock SAT Exam" className="mobile-logo-img" />
              <span className="mobile-logo-text">Mock SAT Exam</span>
            </div>
            <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
          </div>
          <div className="mobile-menu-content">
            <Link to="/" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/roadmap" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>RoadMap</Link>
            <Link to="/digital-sat-practice-questions" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>Questions</Link>
            <Link to="/courses" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>Courses</Link>
            <Link to="/blogs" className="mobile-menu-link" onClick={() => setIsMenuOpen(false)}>Blogs</Link>
            <button 
              onClick={() => { handleAccountClick(); setIsMenuOpen(false); }}
              className="mobile-menu-link"
            >
              <PersonIcon style={{ fontSize: '1.4rem' }} />
              {isLoggedIn ? 'Profile' : 'Account'}
            </button>
          </div>
        </div>
      )}

      {/* NOTE CONTENT */}
      <div className="note-container">
        <div className="note-wrapper">
          <header className="note-header">
            {/* SEO: Improved H1 and P for Keywords */}
            <h1>Digital SAT Question Bank Archive</h1>
            <p>Curated worksheets, PDF practice questions, and answer keys for 2026/2027 prep.</p>
          </header>

          <BannerAd/>

          <span className="category-label">Mathematics</span>
          <div className="list-grid">
            {mathResources.map((resource, index) => (
              <div key={`math-${index}`} className="note-item">
                <span className="item-name">{resource.display}</span>
                <div className="download-actions">
                  <button className="download-btn" aria-label={`Download ${resource.display} PDF`} onClick={(e) => handlePdfDownload(e, resource, 'Mathematics')}>PDF</button>
                  <button className="download-btn" aria-label={`Download ${resource.display} Answer Key`} onClick={(e) => handleKeyDownload(e, resource, 'Mathematics')}>Key</button>
                </div>
              </div>
            ))}
          </div>

          <BannerAd/>

          <span className="category-label">Reading & Writing</span>
          <div className="list-grid">
            {readingWritingResources.map((resource, index) => (
              <div key={`rw-${index}`} className="note-item">
                <span className="item-name">{resource.display}</span>
                <div className="download-actions">
                  <button className="download-btn" aria-label={`Download ${resource.display} PDF`} onClick={(e) => handlePdfDownload(e, resource, 'Reading & Writing')}>PDF</button>
                  <button className="download-btn" aria-label={`Download ${resource.display} Answer Key`} onClick={(e) => handleKeyDownload(e, resource, 'Reading & Writing')}>Key</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Note;