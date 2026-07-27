import React, { useState } from 'react';
import './DocsFaqPrivacy.css';

interface DocsFaqPrivacyProps {
  onNavigate: (path: string) => void;
}

export const DocsFaqPrivacy: React.FC<DocsFaqPrivacyProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Privacy Policy

We care about your privacy.

1. Local Storage
We save your keys and chat history in your browser's local storage. We do not store them on our servers.

2. API Keys
Your API keys are sent directly to the model provider (OpenAI, Google, Groq).`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-privacy-layout">
      {/* Left: Main Content */}
      <div className="docs-privacy-container docs-privacy-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-privacy-category">FAQ</div>

        {/* Main Heading */}
        <h1 className="docs-privacy-title">Privacy Policy</h1>

        {/* Top Action Options bar */}
        <div className="docs-privacy-actions-bar">
          <button className="docs-privacy-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-privacy-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
        </div>

        {/* Intro */}
        <p className="docs-privacy-lead">
          We want to be completely open about how we handle your data when you use Nothric.
        </p>

        {/* Policy Content Sections */}
        <div className="docs-privacy-rendered-view">
          <div className="docs-privacy-section" id="local-data">
            <h2 className="docs-privacy-section-heading">1. Local Storage</h2>
            <p className="docs-privacy-text">
              Nothric is designed to be local-first. This means we store your custom API keys, settings, and active chat threads directly inside your browser's local storage database. We never upload this data to our servers.
            </p>
          </div>

          <div className="docs-privacy-section" id="api-keys">
            <h2 className="docs-privacy-section-heading">2. Model API Key Communication</h2>
            <p className="docs-privacy-text">
              When you send a prompt, your browser communicates directly with the respective model providers (like Groq, OpenAI, Google, or Mistral) using the API keys you provided. Your keys are sent over secure HTTPS connections directly to their official API endpoints.
            </p>
          </div>

          <div className="docs-privacy-section" id="cookies">
            <h2 className="docs-privacy-section-heading">3. Cookies and Analytics</h2>
            <p className="docs-privacy-text">
              We do not use tracking cookies or run invasive background analytics scripts on your activity. Your sessions are fully anonymous.
            </p>
          </div>

          <div className="docs-privacy-section" id="security">
            <h2 className="docs-privacy-section-heading">4. Data Deletion</h2>
            <p className="docs-privacy-text">
              You are in full control of your data. You can delete all your chat logs and configured keys at any time by clearing your browser's cache/local storage or using the "Reset Workspace" buttons in the welcome tab.
            </p>
          </div>
        </div>

        {/* Related Documentation footer list */}
        <div className="docs-privacy-related-section">
          <span className="docs-privacy-related-title">Related:</span>
          <a href="/docs/faq-general" onClick={(e) => handleLinkClick('/docs/faq-general', e)} className="docs-privacy-related-link-item">
            General Questions
          </a>
          <span className="docs-privacy-related-dot">•</span>
          <a href="/docs/faq-terms" onClick={(e) => handleLinkClick('/docs/faq-terms', e)} className="docs-privacy-related-link-item">
            Terms of Use
          </a>
        </div>

        {/* Bottom Last Updated Section */}
        <div className="docs-privacy-footer-divider"></div>
        <div className="docs-privacy-last-updated">
          Last updated: 17 July 2026
        </div>
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-privacy-right-sidebar">
        <div className="docs-privacy-rt-section">
          <div className="docs-privacy-rt-header">
            <span>On this page</span>
            <svg className="docs-privacy-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-privacy-rt-links">
            <li>
              <a href="#local-data" className="docs-privacy-rt-link active">1. Local Storage</a>
            </li>
            <li>
              <a href="#api-keys" className="docs-privacy-rt-link">2. API Connections</a>
            </li>
            <li>
              <a href="#cookies" className="docs-privacy-rt-link">3. Cookies & Analytics</a>
            </li>
            <li>
              <a href="#security" className="docs-privacy-rt-link">4. Data Deletion</a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
