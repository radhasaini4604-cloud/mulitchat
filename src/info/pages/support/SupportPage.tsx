import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import LandingFooter from '../../components/Footer';
import '../contact/ContactPage.css';
import '../contact/ContactForm.css';
import './SupportDropdown.css';

const CATEGORIES = [
  { value: 'account-access', label: 'Account Access & Login Issues' },
  { value: 'billing-payments', label: 'Subscription & Billing Queries' },
  { value: 'chat-errors', label: 'Chat & Model Response Problems' },
  { value: 'upload-failures', label: 'File & Image Upload Failures' },
  { value: 'ui-workspace', label: 'UI & Workspace Settings' },
  { value: 'feedback-requests', label: 'Feature Requests & Feedback' },
  { value: 'general-bug', label: 'Other Technical Glitches' }
];

import SupportTimeline from './SupportTimeline';
import SupportStats from './SupportStats';
import SupportFAQ from './SupportFAQ';
import SupportCTA from './SupportCTA';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'account-access',
    bugDescription: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Support | Nothric';
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.bugDescription) {
      setSubmitError('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY_HERE',
          name: formData.name,
          email: formData.email,
          subject: `Nothric Support: ${CATEGORIES.find(c => c.value === formData.category)?.label || formData.category}`,
          category: CATEGORIES.find(c => c.value === formData.category)?.label || formData.category,
          message: formData.bugDescription
        })
      });

      const result = await response.json();
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubmitError('Failed to send message. Please check your internet connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-new">
      {/* Premium custom high-tech background */}
      <div className="contact-bg-glow" />

      {/* Massive blurred "SUPPORT" word in the background */}
      <div className="bg-contact-text">SUPPORT</div>

      {/* Decorative Circuit Lines on Left & Right */}
      <div className="circuit-lines-container">
        {/* Left Circuit Line */}
        <svg className="circuit-line left" width="280" height="180" viewBox="0 0 280 180" fill="none">
          <path d="M0 40 H120 L160 110 H280" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
          <path d="M0 40 H120 L160 110 H280" stroke="url(#glowGradientLeft)" strokeWidth="2" strokeDasharray="60 160" strokeDashoffset="0">
            <animate attributeName="strokeDashoffset" values="220;0" dur="5s" repeatCount="indefinite" />
          </path>
          <defs>
            <linearGradient id="glowGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Right Circuit Line */}
        <svg className="circuit-line right" width="280" height="180" viewBox="0 0 280 180" fill="none">
          <path d="M280 40 H160 L120 110 H0" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
          <path d="M280 40 H160 L120 110 H0" stroke="url(#glowGradientRight)" strokeWidth="2" strokeDasharray="60 160" strokeDashoffset="0">
            <animate attributeName="strokeDashoffset" values="0;220" dur="5s" repeatCount="indefinite" />
          </path>
          <defs>
            <linearGradient id="glowGradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Navbar with Transparent Style */}
      <Navbar onLoginClick={() => {
        if ((window as any).navigate) {
          (window as any).navigate('/?login=true');
        } else {
          window.location.href = '/?login=true';
        }
      }} />

      {/* Main Content Area */}
      <main className="contact-main-content">
        <div className="contact-content-grid">

          {/* Left Column: Get In Touch Info */}
          <div className="contact-info-col">
            {/* Title & Subtitle */}
            <h1 className="contact-h1">Get support</h1>
            <p className="contact-desc">
              Have questions or facing technical issues? Reach out and our engineering desk will resolve it.
            </p>

            {/* Info Cards */}
            <div className="contact-cards-list">

              {/* Email Card */}
              <a href="mailto:nothric07@gmail.com" className="info-card-item">
                <div className="card-left-section">
                  <div className="icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="text-details">
                    <span className="card-label">Email support</span>
                    <span className="card-value">nothric07@gmail.com</span>
                  </div>
                </div>
                <div className="card-arrow-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </a>

              {/* Phone Card */}
              <a href="tel:+914909429571" className="info-card-item">
                <div className="card-left-section">
                  <div className="icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="text-details">
                    <span className="card-label">Call support</span>
                    <span className="card-value">+91 4909429571</span>
                  </div>
                </div>
                <div className="card-arrow-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </a>

              {/* Location Card */}
              <a href="https://maps.google.com/?q=Jodhpur,India" target="_blank" rel="noopener noreferrer" className="info-card-item">
                <div className="card-left-section">
                  <div className="icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="text-details">
                    <span className="card-label">Our location</span>
                    <span className="card-value">Jodhpur, India</span>
                  </div>
                </div>
                <div className="card-arrow-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </a>

            </div>

            {/* Availability & Social Section */}
            <div className="contact-extra-info">
              <h4 className="extra-info-title">Other platforms to connect</h4>

              {/* Social Links */}
              <div className="social-links-row">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="X (Twitter)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Discord">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Support Ticket Form */}
          <div className="contact-form-col">
            <div className="contact-form-glass-card">
              {isSubmitted ? (
                <div className="contact-success-state">
                  <div className="success-icon-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3>Ticket Submitted!</h3>
                  <p>Thank you, {formData.name}. We have logged your support ticket. A tracker link has been dispatched to {formData.email}.</p>
                  <button className="reset-btn" onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', category: 'account-access', bugDescription: '' });
                  }}>
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form className="premium-contact-form" onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="form-error-banner">
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="input-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder=" "
                      disabled={isSubmitting}
                    />
                    <label htmlFor="name" className="input-label">Name</label>
                  </div>

                  {/* Email Input */}
                  <div className="input-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder=" "
                      disabled={isSubmitting}
                    />
                    <label htmlFor="email" className="input-label">Email</label>
                  </div>

                  {/* Category Dropdown */}
                  <div className="input-group" ref={dropdownRef}>
                    <div className="support-dropdown-container">
                      <button
                        type="button"
                        className={`support-dropdown-trigger ${isDropdownOpen ? 'open' : ''}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={isSubmitting}
                      >
                        <span>{CATEGORIES.find(c => c.value === formData.category)?.label || 'Select a category'}</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#a1a1aa"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="chevron-icon"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="support-dropdown-menu">
                          {CATEGORIES.map(category => {
                            const isActive = formData.category === category.value;
                            return (
                              <button
                                key={category.value}
                                type="button"
                                className={`support-dropdown-item ${isActive ? 'active' : ''}`}
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, category: category.value }));
                                  setIsDropdownOpen(false);
                                }}
                              >
                                {category.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description Input */}
                  <div className="input-group">
                    <textarea
                      id="bugDescription"
                      name="bugDescription"
                      rows={5}
                      required
                      value={formData.bugDescription}
                      onChange={handleInputChange}
                      placeholder=" "
                      disabled={isSubmitting}
                    />
                    <label htmlFor="bugDescription" className="input-label">Issue Description</label>
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Section Divider */}
        <div className="contact-divider support-divider" />

        {/* Modular Sections */}
        <SupportTimeline />
        <SupportStats />
        <SupportFAQ />
        <SupportCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
