import React, { useState } from 'react';
import './App.css';
import { submitDueDiligenceForm, submitNewsletterForm, submitFacilityTourForm, DueDiligenceFormData, NewsletterFormData, FacilityTourFormData } from './lib/supabase';

// Form error interfaces
interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
  investmentSize?: string;
  company?: string;
  message?: string;
}

function App() {
  // Form states
  const [dueDiligenceForm, setDueDiligenceForm] = useState<DueDiligenceFormData>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    investmentSize: ''
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [facilityTourForm, setFacilityTourForm] = useState<FacilityTourFormData>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [facilitySubmitMessage, setFacilitySubmitMessage] = useState('');

  // Form validation
  const validateDueDiligenceForm = (data: DueDiligenceFormData): FormErrors => {
    const errors: FormErrors = {};
    
    if (!data.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!data.country.trim()) {
      errors.country = 'Country is required';
    }
    
    if (!data.investmentSize) {
      errors.investmentSize = 'Investment size is required';
    }
    
    return errors;
  };

  const validateFacilityForm = (data: FacilityTourFormData): FormErrors => {
    const errors: FormErrors = {};
    
    if (!data.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    return errors;
  };

  // Handle due diligence form submission
  const handleDueDiligenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateDueDiligenceForm(dueDiligenceForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const result = await submitDueDiligenceForm(dueDiligenceForm);
      setSubmitMessage(result.data?.message || 'Thank you! Your Due Diligence Toolkit download will begin shortly.');
      setDueDiligenceForm({ fullName: '', email: '', phone: '', country: '', investmentSize: '' });
    } catch (error: any) {
      setSubmitMessage('There was an error submitting the form. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle newsletter signup
  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    
    try {
      const result = await submitNewsletterForm({ email: newsletterEmail });
      alert(result.data?.message || 'Successfully subscribed to the Intelligence Brief!');
      setNewsletterEmail('');
    } catch (error: any) {
      alert('Subscription failed. Please try again.');
      console.error('Newsletter subscription error:', error);
    }
  };

  // Handle facility tour form submission
  const handleFacilityTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateFacilityForm(facilityTourForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const result = await submitFacilityTourForm(facilityTourForm);
      setFacilitySubmitMessage(result.data?.message || 'Facility tour request submitted successfully! We will contact you within 24 hours.');
      setFacilityTourForm({ fullName: '', email: '', phone: '', company: '', message: '' });
    } catch (error: any) {
      setFacilitySubmitMessage('There was an error submitting your request. Please try again.');
      console.error('Facility tour submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQ toggle function
  const toggleFAQ = (index: number) => {
    const answer = document.getElementById(`answer-${index}`);
    const toggle = document.getElementById(`toggle-${index}`);
    
    if (answer && toggle) {
      if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        toggle.classList.remove('open');
      } else {
        answer.classList.add('active');
        toggle.classList.add('open');
      }
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <span className="logo-text">Curated Mining</span>
            </div>
            <nav className="nav">
              <a href="#toolkit">Toolkit</a>
              <a href="#insights">Insights</a>
              <a href="#about">About</a>
              <a href="#faq">FAQ</a>
            </nav>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <div className="hero-text">
              <h1>Curated Bitcoin Mining <span className="gold-accent">Due Diligence Toolkit</span></h1>
              <p className="hero-description">
                Protect your capital before you deploy. Download the Curated Mining vetted checklist, 
                breakeven calculator, and contract red-flag guide — built from years of institutional mining oversight.
              </p>
              <div className="hero-cta">
                <a href="#download" className="btn btn-primary">Download Toolkit Now</a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="toolkit-cover">
                <div className="cover-content">
                  <h3>DUE DILIGENCE</h3>
                  <h2>TOOLKIT</h2>
                  <p>2025 Edition</p>
                  <div className="cover-items">
                    <span>✓ Vendor Verification</span>
                    <span>✓ Break-Even Calculator</span>
                    <span>✓ Contract Red Flags</span>
                  </div>
                  <div className="cover-footer">Curated Mining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Due Diligence Is Critical */}
      <section className="section section-light" id="why-diligence">
        <div className="container">
          <div className="content-max">
            <h2>Why Due Diligence Is Critical</h2>
            <p className="lead">
              Every year, investors lose millions to mining contracts with hidden clauses, 
              unreliable hosts, and inflated promises.
            </p>
            
            <div className="example-box">
              <h3>Example:</h3>
              <p>
                One institutional investor signed a hosting agreement without an uptime threshold. 
                When energy prices spiked, uptime collapsed — and the investor had no contractual recourse.
              </p>
            </div>
            
            <div className="lesson-box">
              <h3>Lesson:</h3>
              <p>
                Due diligence isn't a formality. It's the most important step to protect your capital. 
                That's why we created the Curated Due Diligence Toolkit — so you know exactly what 
                to look for before signing any agreement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What's Inside the Toolkit */}
      <section className="section section-dark" id="toolkit">
        <div className="container">
          <div className="content-max">
            <h2>What's Inside the Toolkit</h2>
            
            <div className="toolkit-items">
              <div className="toolkit-item">
                <div className="item-icon">📋</div>
                <h3>Vendor Verification Checklist</h3>
                <p>How we validate suppliers, hosts, and counterparties.</p>
              </div>
              
              <div className="toolkit-item">
                <div className="item-icon">📊</div>
                <h3>Break-Even Electricity Calculator</h3>
                <p>Model profitability based on energy price, network difficulty, and hardware efficiency.</p>
              </div>
              
              <div className="toolkit-item">
                <div className="item-icon">🚩</div>
                <h3>Hosting SLA Red-Flag List</h3>
                <p>The 10 clauses that silently shift risk from vendor to investor.</p>
              </div>
            </div>
            
            <div className="disclaimer">
              <p><em>(All resources are educational only — not legal, tax, or investment advice.)</em></p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Gated Download Form */}
      <section className="section section-gold" id="download">
        <div className="container">
          <div className="form-section">
            <div className="form-container">
              <h2>Download the Due Diligence Toolkit</h2>
              
              {submitMessage ? (
                <div className="success-message">
                  <h3>✓ Success!</h3>
                  <p>{submitMessage}</p>
                  <button 
                    onClick={() => {
                      setSubmitMessage('');
                      setDueDiligenceForm({ fullName: '', email: '', phone: '', country: '', investmentSize: '' });
                    }}
                    className="btn btn-secondary"
                    style={{ marginTop: '20px' }}
                  >
                    Download Another Copy
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDueDiligenceSubmit} className="lead-form" id="lead-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fullName" className="form-label">Full Name *</label>
                      <input
                        type="text"
                        id="fullName"
                        value={dueDiligenceForm.fullName}
                        onChange={(e) => setDueDiligenceForm({...dueDiligenceForm, fullName: e.target.value})}
                        className={`form-input ${errors.fullName ? 'error' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        value={dueDiligenceForm.email}
                        onChange={(e) => setDueDiligenceForm({...dueDiligenceForm, email: e.target.value})}
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="Enter your email address"
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        value={dueDiligenceForm.phone}
                        onChange={(e) => setDueDiligenceForm({...dueDiligenceForm, phone: e.target.value})}
                        className="form-input"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="country" className="form-label">Country *</label>
                      <select
                        id="country"
                        value={dueDiligenceForm.country}
                        onChange={(e) => setDueDiligenceForm({...dueDiligenceForm, country: e.target.value})}
                        className={`form-input ${errors.country ? 'error' : ''}`}
                      >
                        <option value="">Select your country</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Germany">Germany</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.country && <span className="error-text">{errors.country}</span>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="investmentSize" className="form-label">Investment Size *</label>
                    <select
                      id="investmentSize"
                      value={dueDiligenceForm.investmentSize}
                      onChange={(e) => setDueDiligenceForm({...dueDiligenceForm, investmentSize: e.target.value})}
                      className={`form-input ${errors.investmentSize ? 'error' : ''}`}
                    >
                      <option value="">Select investment size</option>
                      <option value="<$1M">Less than $1M</option>
                      <option value="$1-5M">$1M - $5M</option>
                      <option value="$5M+">$5M+</option>
                    </select>
                    {errors.investmentSize && <span className="error-text">{errors.investmentSize}</span>}
                  </div>
                  
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Download Toolkit Now'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="section section-dark" id="final-cta">
        <div className="container">
          <div className="content-center">
            <h2>Get the Toolkit — Then Schedule Your Due Diligence Review Call</h2>
            <p className="lead">
              Download the curated checklist and tools today. Then book a confidential consultation 
              with Curated Mining to walk through vetted projects before you commit capital.
            </p>
            <a href="#download" className="btn btn-primary">Download Toolkit + Book Review Call</a>
          </div>
        </div>
      </section>

      {/* 6. Newsletter Section - Intelligence Brief */}
      <section className="section section-gold" id="newsletter">
        <div className="container">
          <div className="content-center">
            <h2>Exclusive Institutional-Grade Insights — Delivered Before the Market Moves</h2>
            <p className="lead">
              Every month, Curated Mining publishes confidential research briefings on risk controls, 
              governance strategies, and procurement trends. Designed for institutions and HNWIs — not retail hype.
            </p>
            
            <form onSubmit={handleNewsletterSignup} className="newsletter-form">
              <div className="newsletter-input-group">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="btn btn-secondary">Join the Intelligence Brief</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="section section-light" id="testimonials">
        <div className="container">
          <div className="content-max">
            <h2>What Our Partners Say</h2>
            
            <div className="testimonials-grid">
              <div className="testimonial">
                <blockquote>
                  "Diligence-first. No hype, just clarity."
                </blockquote>
                <cite>— Family Office CIO</cite>
              </div>
              
              <div className="testimonial">
                <blockquote>
                  "Operational oversight that reduced real risk."
                </blockquote>
                <cite>— Private Investor</cite>
              </div>
              
              <div className="testimonial">
                <blockquote>
                  "Independent, aligned, and professional. Exactly what we needed."
                </blockquote>
                <cite>— Institutional Fund Manager</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. As Seen At */}
      <section className="section section-dark" id="speaking">
        <div className="container">
          <div className="content-center">
            <h2>As Seen At</h2>
            <p className="lead">
              Curated Mining regularly speaks at global Bitcoin conferences, including:
            </p>
            
            <div className="speaking-logos">
              <div className="speaking-item">
                <div className="speaking-logo">Bitcoin Daily</div>
              </div>
              <div className="speaking-item">
                <div className="speaking-logo">Bitcoin 2024</div>
              </div>
            </div>
            
            <div className="conference-speakers">
              <div className="speaker-images">
                <img src="/conference-speaker-1.jpg" alt="John Drew speaking at Bitcoin 2024 Nashville conference" className="speaker-photo" />
                <img src="/conference-speaker-2.jpg" alt="Matty Ice speaking at Bitcoin conference" className="speaker-photo" />
              </div>
              <p className="speaking-note">
                <em>John Drew and Matty Ice speaking at global Bitcoin conferences</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Facility Tours Lead Capture */}
      <section className="section facility-tours" id="tours">
        <div className="facility-overlay">
          <div className="container">
            <div className="content-center">
              <h2>Request a Private Tour of a Mining Facility</h2>
              <p className="lead">
                See institutional-grade mining in action. Tours available at vetted facilities across North America.
              </p>
              <button 
                onClick={() => setShowFacilityModal(true)}
                className="btn btn-primary"
              >
                Request a Facility Tour
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. About Us */}
      <section className="section section-light" id="about">
        <div className="container">
          <div className="content-max">
            <h2>Who We Are</h2>
            
            <div className="about-content">
              <div className="about-text">
                <p className="lead">
                  Curated Mining is led by Matty Ice and John Drew, two veterans in Bitcoin mining and institutional advisory.
                </p>
                
                <div className="team-profiles">
                  <div className="profile">
                    <h3>Matty Ice</h3>
                    <p>A decade of ASIC procurement, ROI modeling, and multi-megawatt oversight.</p>
                  </div>
                  
                  <div className="profile">
                    <h3>John Drew</h3>
                    <p>Expertise in energy negotiations, governance frameworks, and investor protections (Consensus Protocol).</p>
                  </div>
                </div>
                
                <p>
                  Together, they provide independent, vendor-neutral partnerships designed to protect capital and deliver clarity.
                </p>
              </div>
              
              <div className="about-image">
                <img src="/team-matty-john.jpg" alt="Matty Ice and John Drew, Curated Mining leadership team" className="team-photo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. YouTube Section */}
      <section className="section section-dark" id="youtube">
        <div className="container">
          <div className="content-max">
            <h2>Institutional-Grade Insights in Video Form</h2>
            
            <div className="youtube-content">
              <div className="video-embed">
                <div className="video-placeholder">
                  <div className="play-button">▶</div>
                  <p>Latest YouTube Video Embed</p>
                  <small>Embed most recent YouTube video here</small>
                </div>
              </div>
              
              <div className="video-description">
                <p>
                  In this episode, Matty Ice breaks down the top 10 hosting contract red flags 
                  every institutional investor should know before deploying capital.
                </p>
                <a href="#" className="btn btn-secondary">Explore Our Channel</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Latest Insights */}
      <section className="section section-light" id="insights">
        <div className="container">
          <div className="content-max">
            <h2>Latest Insights</h2>
            
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-thumbnail">
                  <div className="placeholder-thumbnail">Blog Thumbnail</div>
                </div>
                <h3>The Hidden Costs of Mining Hosting Agreements</h3>
                <p>Learn how to identify and avoid unexpected fees that can erode your mining profitability.</p>
                <a href="#" className="read-more">Read More →</a>
              </div>
              
              <div className="insight-card">
                <div className="insight-thumbnail">
                  <div className="placeholder-thumbnail">Blog Thumbnail</div>
                </div>
                <h3>Energy Price Volatility: A Mining Risk Management Guide</h3>
                <p>Strategies for protecting your operations from energy market fluctuations.</p>
                <a href="#" className="read-more">Read More →</a>
              </div>
              
              <div className="insight-card">
                <div className="insight-thumbnail">
                  <div className="placeholder-thumbnail">Blog Thumbnail</div>
                </div>
                <h3>Due Diligence Checklist for Bitcoin Mining Investments</h3>
                <p>A comprehensive guide to evaluating mining opportunities and avoiding common pitfalls.</p>
                <a href="#" className="read-more">Read More →</a>
              </div>
            </div>
            
            <div className="insights-cta">
              <a href="#" className="btn btn-primary">Read All Insights</a>
            </div>
          </div>
        </div>
      </section>

      {/* 13. FAQ Section */}
      <section className="section section-dark" id="faq">
        <div className="container">
          <div className="content-max">
            <h2>FAQ — Bitcoin Mining Due Diligence</h2>
            
            <div className="faq-list">
              <div className="faq-item">
                <div className="faq-question" onClick={() => toggleFAQ(1)}>
                  <h3>What is Bitcoin mining due diligence?</h3>
                  <span className="faq-toggle" id="toggle-1">+</span>
                </div>
                <div className="faq-answer" id="answer-1">
                  <p>It's the process of evaluating vendors, contracts, and facilities before committing capital. Done correctly, it verifies uptime claims, checks financial solvency, inspects sites, and exposes hidden risks.</p>
                </div>
              </div>
              
              <div className="faq-item">
                <div className="faq-question" onClick={() => toggleFAQ(2)}>
                  <h3>Why is Curated Mining due diligence better than relying on vendors?</h3>
                  <span className="faq-toggle" id="toggle-2">+</span>
                </div>
                <div className="faq-answer" id="answer-2">
                  <p>Vendors are incentivized to close deals — not protect your capital. Curated due diligence ensures your interests come first.</p>
                </div>
              </div>
              
              <div className="faq-item">
                <div className="faq-question" onClick={() => toggleFAQ(3)}>
                  <h3>What risks do investors often miss?</h3>
                  <span className="faq-toggle" id="toggle-3">+</span>
                </div>
                <div className="faq-answer" id="answer-3">
                  <p>Common oversights include auto-renewal clauses, weak uptime credits, opaque repair queues, and undercapitalized hosts. Our toolkit helps flag these before you sign.</p>
                </div>
              </div>
              
              <div className="faq-item">
                <div className="faq-question" onClick={() => toggleFAQ(4)}>
                  <h3>Does the toolkit replace legal or tax advisors?</h3>
                  <span className="faq-toggle" id="toggle-4">+</span>
                </div>
                <div className="faq-answer" id="answer-4">
                  <p>No. It prepares you to ask the right questions and spot red flags — so your advisors can work from a stronger foundation.</p>
                </div>
              </div>
              
              <div className="faq-item">
                <div className="faq-question" onClick={() => toggleFAQ(5)}>
                  <h3>How does Curated Mining support the due diligence process?</h3>
                  <span className="faq-toggle" id="toggle-5">+</span>
                </div>
                <div className="faq-answer" id="answer-5">
                  <p>We partner with you to review contracts, verify vendors, and model break-even economics. With our frameworks and network, you gain clarity and confidence before deploying capital.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Curated Mining</h3>
              <p>Independent, institutional-grade Bitcoin mining advisory.</p>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#download">Due Diligence Toolkit</a></li>
                <li><a href="#newsletter">Intelligence Brief</a></li>
                <li><a href="#insights">Latest Insights</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#speaking">Speaking</a></li>
                <li><a href="#tours">Facility Tours</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect</h4>
              <ul>
                <li><a href="#youtube">YouTube Channel</a></li>
                <li><a href="#newsletter">Newsletter</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Curated Mining. All rights reserved. Educational content only — not investment advice.</p>
          </div>
        </div>
      </footer>

      {/* Facility Tour Modal */}
      {showFacilityModal && (
        <div className="modal-overlay" onClick={() => setShowFacilityModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request a Facility Tour</h2>
              <button 
                className="modal-close"
                onClick={() => setShowFacilityModal(false)}
              >
                ×
              </button>
            </div>
            
            {facilitySubmitMessage ? (
              <div className="success-message">
                <h3>✓ Success!</h3>
                <p>{facilitySubmitMessage}</p>
                <button 
                  onClick={() => {
                    setFacilitySubmitMessage('');
                    setShowFacilityModal(false);
                  }}
                  className="btn btn-primary"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleFacilityTourSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    value={facilityTourForm.fullName}
                    onChange={(e) => setFacilityTourForm({...facilityTourForm, fullName: e.target.value})}
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    value={facilityTourForm.email}
                    onChange={(e) => setFacilityTourForm({...facilityTourForm, email: e.target.value})}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={facilityTourForm.phone}
                    onChange={(e) => setFacilityTourForm({...facilityTourForm, phone: e.target.value})}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    value={facilityTourForm.company}
                    onChange={(e) => setFacilityTourForm({...facilityTourForm, company: e.target.value})}
                    className="form-input"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    value={facilityTourForm.message}
                    onChange={(e) => setFacilityTourForm({...facilityTourForm, message: e.target.value})}
                    className="form-input form-textarea"
                    placeholder="Any specific requirements or questions?"
                    rows={3}
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Request Tour'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowFacilityModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
