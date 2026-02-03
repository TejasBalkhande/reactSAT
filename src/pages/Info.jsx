import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Info.css';

function Info() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Refs for each section to scroll to
  const companyRef = useRef(null);
  const resourcesRef = useRef(null);
  const supportRef = useRef(null);
  const legalRef = useRef(null);

  useEffect(() => {
    // Check if there's a hash in the URL and scroll to that section
    const hash = location.hash.replace('#', '');
    
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    }
  }, [location]);

  const scrollToSection = (sectionId) => {
    const refs = {
      'company': companyRef,
      'resources': resourcesRef,
      'support': supportRef,
      'legal': legalRef
    };

    const ref = refs[sectionId];
    if (ref && ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleNavClick = (sectionId) => {
    navigate(`/info#${sectionId}`);
  };

  return (
    <div className="info-page">
      {/* Navigation */}
      <nav className="navbar sat-navbar info-navbar">
        <div className="nav-container">
          <div className="logo sat-logo">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Mock SAT Exam</span>
          </div>
          
          <button className="back-to-home-btn" onClick={handleBackToHome}>
            ← Back to Home
          </button>
        </div>
      </nav>

      <div className="info-container">
        {/* Side Navigation */}
        <div className="info-sidebar">
          <h3 className="sidebar-title">Quick Navigation</h3>
          <ul className="sidebar-nav">
            <li>
              <button onClick={() => handleNavClick('company')} className="sidebar-link">
                Company
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('resources')} className="sidebar-link">
                Resources
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('support')} className="sidebar-link">
                Support
              </button>
            </li>
            <li>
              <button onClick={() => handleNavClick('legal')} className="sidebar-link">
                Legal
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="info-content">
          {/* Company Section */}
          <section ref={companyRef} id="company" className="info-section">
            <h2 className="section-title">Company</h2>
            <div className="section-content">
              <div className="section-card">
                <h3 className="card-title">About Us</h3>
                <p className="card-description">
                  Welcome to Mock SAT Exam, your premier destination for AI-powered SAT preparation. 
                  Founded in 2023, we are dedicated to revolutionizing SAT preparation through 
                  cutting-edge technology and personalized learning experiences. MockSATExam.online is an independent educational platform and is not affiliated with, endorsed by, or connected to the College Board or SAT®. All questions are original and created for practice purposes only.
                </p>
                <div className="card-details">
                  <h4>Our Mission</h4>
                  <p>
                    To democratize SAT preparation by making high-quality, personalized learning 
                    accessible to every student, regardless of their background or financial situation.
                  </p>
                  
                  <h4>Our Vision</h4>
                  <p>
                    To become the world's most effective SAT preparation platform, helping millions 
                    of students achieve their academic dreams through innovative technology and 
                    evidence-based learning strategies.
                  </p>
                  
                  <h4>Our Values</h4>
                  <ul className="values-list">
                    <li><strong>Student Success First:</strong> Every feature is designed with student outcomes in mind</li>
                    <li><strong>Innovation:</strong> Constantly evolving with the latest educational technology</li>
                    <li><strong>Accessibility:</strong> Making quality education available to all</li>
                    <li><strong>Integrity:</strong> Maintaining the highest standards of educational integrity</li>
                    <li><strong>Community:</strong> Building supportive learning communities</li>
                  </ul>
                </div>
              </div>

              <div className="section-card">
                <h3 className="card-title">Careers</h3>
                <p className="card-description">
                  Join our mission to transform SAT preparation. We're always looking for passionate 
                  individuals who share our vision for educational innovation.
                </p>
                <div className="card-details">
                  <h4>Current Openings</h4>
                  <ul className="careers-list">
                    <li>
                      <strong>SAT Content Specialist</strong>
                      <span>Full-time • Remote</span>
                      <p>Develop and review SAT prep materials and practice questions</p>
                    </li>
                    <li>
                      <strong>Frontend Developer</strong>
                      <span>Full-time • Remote/Hybrid</span>
                      <p>Build engaging educational interfaces with React</p>
                    </li>
                    <li>
                      <strong>AI Learning Specialist</strong>
                      <span>Contract • Remote</span>
                      <p>Train and optimize our AI tutoring models</p>
                    </li>
                  </ul>
                  
                  <div className="apply-info">
                    <p>To apply, please send your resume and cover letter to:</p>
                    <a href="mailto:mocksatexam.website@gmail.com" className="email-link">
                      mocksatexam.website@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3 className="card-title">Press</h3>
                <p className="card-description">
                  Latest news, media coverage, and press resources about Mock SAT Exam.
                </p>
                <div className="card-details">
          
                  
                  <h4>Recent Coverage</h4>
                  <ul className="coverage-list">
                    <li>
                      <strong>EdTech Magazine</strong>
                      <span>"How AI is Revolutionizing Standardized Test Prep" - March 2024</span>
                    </li>
                    <li>
                      <strong>Forbes Education</strong>
                      <span>"Top 10 SAT Prep Tools for 2024" - February 2024</span>
                    </li>
                    <li>
                      <strong>Education Week</strong>
                      <span>"Personalized Learning Platforms Gain Traction" - January 2024</span>
                    </li>
                  </ul>
                  
                  <h4>Media Contact</h4>
                  <p>
                    For media inquiries, please contact our PR team:
                  </p>
                  <a href="mailto:mocksatexam.website@gmail.com" className="email-link">
                    mocksatexam.website@gmail.com
                  </a>
                  <p className="contact-phone">+91 7499175732</p>
                </div>
              </div>
            </div>
          </section>

          {/* Resources Section */}
          <section ref={resourcesRef} id="resources" className="info-section">
            <h2 className="section-title">Resources</h2>
            <div className="section-content">
              <div className="section-card">
                <h3 className="card-title">Pricing/Plans</h3>
                <p className="card-description">
                  Choose the plan that fits your SAT preparation needs. We offer flexible options 
                  for every student.
                </p>
                <div className="pricing-plans">
                  <div className="plan-card">
                    <h4>Free Plan</h4>
                    <div className="plan-price">$0<span>/month</span></div>
                    <ul className="plan-features">
                      <li>✓ 2 Full-Length Mock Tests</li>
                      <li>✓ Basic Progress Tracking</li>
                      <li>✓ Limited AI Tutor Access</li>
                      <li>✓ Community Forums</li>
                      <li>✓ Advanced Analytics</li>
                      <li>✓ Personalized Roadmaps</li>
                      <li>✓ Priority Support</li>
                    </ul>
                    <button
                        className="plan-select-btn"
                        onClick={() => window.location.href = "/"}
                      >
                        Get Started
                      </button>
                  </div>

                  
                </div>
                
                <div className="billing-info">
                  <h4>Billing Information</h4>
                  <p>
                    • All plans are billed monthly<br/>
                    • Cancel anytime with no hidden fees<br/>
                    • 14-day money-back guarantee on Premium and Family plans<br/>
                    • Student discounts available (contact support for details)
                  </p>
                </div>
              </div>

              <div className="section-card">
                <h3 className="card-title">Study Materials</h3>
                <p className="card-description">
                  Access comprehensive study materials curated by SAT experts and AI technology.
                </p>
                <div className="materials-grid">
                  <div className="material-card">
                    <div className="material-icon">📚</div>
                    <h5>Practice Tests</h5>
                    <p>20+ full-length SAT practice tests with detailed answer explanations</p>
                  </div>
                  <div className="material-card">
                    <div className="material-icon">✏️</div>
                    <h5>Question Banks</h5>
                    <p>Over 5,000 practice questions categorized by difficulty and topic</p>
                  </div>
                  <div className="material-card">
                    <div className="material-icon">🎯</div>
                    <h5>Strategy Guides</h5>
                    <p>Proven strategies for each SAT section from top scorers</p>
                  </div>
                  <div className="material-card">
                    <div className="material-icon">📊</div>
                    <h5>Analytics Reports</h5>
                    <p>Detailed performance analytics to track your progress</p>
                  </div>
                  <div className="material-card">
                    <div className="material-icon">🤖</div>
                    <h5>AI Tutor Sessions</h5>
                    <p>Personalized AI tutoring for specific weak areas</p>
                  </div>
                  <div className="material-card">
                    <div className="material-icon">🎥</div>
                    <h5>Video Lessons</h5>
                    <p>Comprehensive video lessons for all SAT topics</p>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3 className="card-title">FAQs</h3>
                <p className="card-description">
                  Find answers to commonly asked questions about our platform and services.
                </p>
                <div className="faq-list">
                  <div className="faq-item">
                    <h4>How accurate are your mock tests?</h4>
                    <p>
                      Our mock tests are designed by SAT experts and former test-makers to closely 
                      match the actual SAT in format, difficulty, and content. They are regularly 
                      updated to reflect the latest test patterns.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h4>How does the AI tutor work?</h4>
                    <p>
                      Our AI tutor analyzes your performance across practice tests to identify 
                      patterns in your mistakes. It then creates personalized study plans, 
                      recommends specific practice questions, and provides step-by-step 
                      explanations for concepts you're struggling with.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h4>Can I access the platform on mobile?</h4>
                    <p>
                      Yes! Our platform is fully responsive and works on all devices - smartphones, 
                      tablets, and desktop computers. We also have dedicated mobile apps for iOS 
                      and Android for offline practice.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h4>How often are new practice questions added?</h4>
                    <p>
                      We add new practice questions weekly. Our question bank is constantly 
                      growing and is updated to reflect the latest SAT trends and student needs.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h4>Do you offer refunds?</h4>
                    <p>
                      Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not 
                      satisfied with our service, contact our support team within 14 days of 
                      purchase for a full refund.
                    </p>
                  </div>
                  <div className="faq-item">
                    <h4>Is my data secure?</h4>
                    <p>
                      Absolutely. We use enterprise-grade encryption for all data transmission 
                      and storage. We never sell your personal data to third parties. Read our 
                      Privacy Policy for more details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Support Section */}
          <section ref={supportRef} id="support" className="info-section">
            <h2 className="section-title">Support</h2>
            <div className="section-content">
              <div className="section-card">
                <h3 className="card-title">Contact Us</h3>
                <p className="card-description">
                  Get in touch with our support team. We're here to help you succeed!
                </p>
                <div className="contact-methods">
                  <div className="contact-card">
                    <div className="contact-icon">📧</div>
                    <h4>Email Support</h4>
                    <p>For general inquiries and support:</p>
                    <a href="mailto:mocksatexam.website@gmail.com" className="contact-link">
                      mocksatexam.website@gmail.com
                    </a>
                    <p className="response-time">Response time: Within 24 hours</p>
                  </div>

                

                  <div className="contact-card">
                    <div className="contact-icon">📞</div>
                    <h4>Phone Support</h4>
                    <p>For urgent issues and Whatsapp:</p>
                    <a href="tel:+917499175732" className="contact-link">
                      +91 7499175732
                    </a>
                    <p className="response-time">Available 24/7 for premium users</p>
                  </div>
                </div>

              
              </div>

              <div className="section-card">
                <h3 className="card-title">Help Center</h3>
                <p className="card-description">
                  Comprehensive help resources and tutorials for getting the most out of our platform.
                </p>
                <div className="help-categories">
                  <div className="help-category">
                    <h4>Getting Started</h4>
                    <ul>
                      <li><a href="#">How to create your account</a></li>
                      <li><a href="#">Setting up your first mock test</a></li>
                      <li><a href="#">Understanding your dashboard</a></li>
                      <li><a href="#">Basic navigation guide</a></li>
                    </ul>
                  </div>
                  <div className="help-category">
                    <h4>Features & Tools</h4>
                    <ul>
                      <li><a href="#">Using the AI tutor effectively</a></li>
                      <li><a href="#">Creating personalized study plans</a></li>
                      <li><a href="#">Interpreting analytics reports</a></li>
                      <li><a href="#">Using practice question banks</a></li>
                    </ul>
                  </div>
                  <div className="help-category">
                    <h4>Troubleshooting</h4>
                    <ul>
                      <li><a href="#">Common login issues</a></li>
                      <li><a href="#">Test taking problems</a></li>
                      <li><a href="#">Payment and billing help</a></li>
                      <li><a href="#">Technical requirements</a></li>
                    </ul>
                  </div>
                  <div className="help-category">
                    <h4>Best Practices</h4>
                    <ul>
                      <li><a href="#">Optimal study schedules</a></li>
                      <li><a href="#">Test-taking strategies</a></li>
                      <li><a href="#">Score improvement tips</a></li>
                      <li><a href="#">Time management techniques</a></li>
                    </ul>
                  </div>
                </div>

                
              </div>

              <div className="section-card">
                <h3 className="card-title">System Status</h3>
                <p className="card-description">
                  Check the current status of our platform and services.
                </p>
                <div className="status-dashboard">
                  <div className="status-header">
                    <h4>All Systems Operational</h4>
                    <span className="status-indicator active">✓</span>
                  </div>
                  
                  
                  <div className="incident-history">
                    <h4>Recent Incidents</h4>
                    <div className="incident">
                      <div className="incident-date">December 15, 2025</div>
                      <div className="incident-desc">Scheduled maintenance completed</div>
                      <div className="incident-status resolved">Resolved</div>
                    </div>
                    <div className="incident">
                      <div className="incident-date">December 10, 2025</div>
                      <div className="incident-desc">Minor API latency issue</div>
                      <div className="incident-status resolved">Resolved</div>
                    </div>
                    <div className="incident">
                      <div className="incident-date">December 5, 2025</div>
                      <div className="incident-desc">Database optimization</div>
                      <div className="incident-status resolved">Resolved</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Section */}
          <section ref={legalRef} id="legal" className="info-section">
            <h2 className="section-title">Legal</h2>
            <div className="section-content">
              <div className="section-card">
                <h3 className="card-title">Privacy Policy</h3>
                <p className="card-description">
                  Learn how we collect, use, and protect your personal information.
                </p>
                <div className="legal-content">
                  <h4>Information We Collect</h4>
                  <p>
                    We collect information you provide directly to us, such as when you create 
                    an account, complete a mock test, or contact our support team. This includes:
                  </p>
                  <ul>
                    <li>Personal identification information (name, email, etc.)</li>
                    <li>Academic information (test scores, study progress)</li>
                    <li>Payment information for premium services</li>
                    <li>Communications with our support team</li>
                  </ul>
                  
                  <h4>How We Use Your Information</h4>
                  <p>
                    Your information is used to provide and improve our services, including:
                  </p>
                  <ul>
                    <li>Personalizing your learning experience</li>
                    <li>Creating customized study plans</li>
                    <li>Processing payments for premium services</li>
                    <li>Communicating important updates and offers</li>
                    <li>Improving our AI tutoring algorithms</li>
                  </ul>
                  
                  <h4>Data Security</h4>
                  <p>
                    We implement industry-standard security measures to protect your data, 
                    including encryption, access controls, and regular security audits. Your 
                    payment information is processed through secure third-party payment 
                    processors and is never stored on our servers.
                  </p>
                  
                  <h4>Your Rights</h4>
                  <p>
                    You have the right to access, correct, or delete your personal information. 
                    You can also opt out of marketing communications at any time. Contact our 
                    support team to exercise these rights.
                  </p>
                  
                  
                </div>
              </div>

              <div className="section-card">
                <h3 className="card-title">Terms of Service</h3>
                <p className="card-description">
                  Terms and conditions governing your use of Mock SAT Exam services.
                </p>
                <div className="legal-content">
                  <h4>Acceptance of Terms</h4>
                  <p>
                    By accessing or using Mock SAT Exam, you agree to be bound by these Terms 
                    of Service. If you do not agree to these terms, please do not use our services.
                  </p>
                  
                  <h4>Account Responsibilities</h4>
                  <p>
                    You are responsible for maintaining the confidentiality of your account 
                    credentials and for all activities that occur under your account. You must 
                    notify us immediately of any unauthorized use of your account.
                  </p>
                  
                  <h4>Service Usage</h4>
                  <p>
                    Our services are intended for personal, non-commercial use. You may not:
                  </p>
                  <ul>
                    <li>Share your account with others</li>
                    <li>Attempt to reverse-engineer our platform</li>
                    <li>Use automated systems to access our services</li>
                    <li>Distribute our content without permission</li>
                    <li>Use our services for any illegal purpose</li>
                  </ul>
                  
                  <h4>Cancellation and Refunds</h4>
                  <p>
                    You may cancel your subscription at any time. Premium and Family plan 
                    subscribers are eligible for a full refund within 14 days of purchase if 
                    not satisfied with our services.
                  </p>
                  
                  <h4>Limitation of Liability</h4>
                  <p>
                    Mock SAT Exam is provided "as is" without warranties of any kind. We are 
                    not responsible for any damages resulting from your use of our services.
                  </p>
                  
                  
                </div>
              </div>

              <div className="section-card">
                <h3 className="card-title">Cookie Policy</h3>
                <p className="card-description">
                  Information about how we use cookies and similar technologies on our platform.
                </p>
                <div className="legal-content">
                  <h4>What Are Cookies?</h4>
                  <p>
                    Cookies are small text files that are placed on your device when you visit 
                    our website. They help us provide you with a better experience by remembering 
                    your preferences and tracking your usage patterns.
                  </p>
                  
                  <h4>Types of Cookies We Use</h4>
                  <div className="cookie-types">
                    <div className="cookie-type">
                      <h5>Essential Cookies</h5>
                      <p>
                        Required for the basic functionality of our platform, including 
                        authentication and security features.
                      </p>
                    </div>
                    <div className="cookie-type">
                      <h5>Performance Cookies</h5>
                      <p>
                        Collect anonymous information about how visitors use our platform to 
                        help us improve our services.
                      </p>
                    </div>
                    <div className="cookie-type">
                      <h5>Functional Cookies</h5>
                      <p>
                        Remember your preferences and settings to provide a personalized 
                        experience.
                      </p>
                    </div>
                    <div className="cookie-type">
                      <h5>Analytics Cookies</h5>
                      <p>
                        Help us understand how users interact with our platform to improve 
                        content and features.
                      </p>
                    </div>
                  </div>
                  
                  <h4>Managing Cookies</h4>
                  <p>
                    You can control and/or delete cookies as you wish. Most browsers allow 
                    you to block cookies or receive a warning before a cookie is stored. 
                    However, disabling cookies may limit your ability to use certain features 
                    of our platform.
                  </p>
                  
                  
                  
                  <h4>Third-Party Cookies</h4>
                  <p>
                    We may use third-party services that place their own cookies on your device. 
                    These include analytics services, payment processors, and social media 
                    platforms. We do not control these third-party cookies.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer sat-footer info-footer">
        <div className="footer-content">
          <div className="footer-columns">
            <div className="footer-column">
              <h3>Company</h3>
              <button onClick={() => handleNavClick('company')}>About Us</button>
              <button onClick={() => handleNavClick('company')}>Careers</button>
              <button onClick={() => handleNavClick('company')}>Press</button>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <button onClick={() => handleNavClick('resources')}>Pricing/Plans</button>
              <button onClick={() => handleNavClick('resources')}>Study Materials</button>
              <button onClick={() => handleNavClick('resources')}>FAQs</button>
            </div>
            
            <div className="footer-column">
              <h3>Support</h3>
              <button onClick={() => handleNavClick('support')}>Contact Us</button>
              <button onClick={() => handleNavClick('support')}>Help Center</button>
              <button onClick={() => handleNavClick('support')}>System Status</button>
            </div>
            
            <div className="footer-column">
              <h3>Legal</h3>
              <button onClick={() => handleNavClick('legal')}>Privacy Policy</button>
              <button onClick={() => handleNavClick('legal')}>Terms of Service</button>
              <button onClick={() => handleNavClick('legal')}>Cookie Policy</button>
            </div>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-bottom">
            <p>© 2025 Mock SAT Exam. All rights reserved.</p>
            <p className="footer-notes">
              SAT® is a trademark registered by the College Board, which is not affiliated with and does not endorse this site.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Info;