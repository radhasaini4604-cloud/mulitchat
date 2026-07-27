import React, { useState } from 'react';
import './DocsFaqTerms.css';

interface DocsFaqTermsProps {
  onNavigate: (path: string) => void;
}

export const DocsFaqTerms: React.FC<DocsFaqTermsProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Terms of Use

1. Acceptance of Terms
By using Nothric, you agree to these terms.

2. API Keys and Fees
You are responsible for any fees charged by your model API providers (Groq, OpenAI, Google, Mistral) under the keys you connect.

3. Sandbox Behavior
You agree not to use Nothric's sandboxes for malicious code execution.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-terms-layout">
      {/* Left: Main Content */}
      <div className="docs-terms-container docs-terms-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-terms-category">FAQ</div>

        {/* Main Heading */}
        <h1 className="docs-terms-title">Terms of Use</h1>

        {/* Top Action Options bar */}
        <div className="docs-terms-actions-bar">
          <button className="docs-terms-actions-link" onClick={handleCopyForLLM}>
            <svg className="docs-terms-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
        </div>

        {/* Intro */}
        <p className="docs-terms-lead">
          Please review the guidelines for using our developer sandbox workspaces and services.
        </p>

        {/* Policy Content Sections */}
        <div className="docs-terms-rendered-view">
          <div className="docs-terms-section" id="acceptance">
            <h2 className="docs-terms-section-heading">1. Acceptance of Terms</h2>
            <p className="docs-terms-text">
              By using Nothric's websites, browser tools, and client code sandboxes, you agree to comply with these terms. If you do not agree, please stop using the workspace.
            </p>
          </div>

          <div className="docs-terms-section" id="api-billing">
            <h2 className="docs-terms-section-heading">2. API Connections &amp; Billing</h2>
            <p className="docs-terms-text">
              Nothric does not sell or charge you for model tokens. You connect your own custom API keys. You are fully responsible for any charges or token usages incurred on your OpenAI, Google, Groq, or Mistral accounts.
            </p>
          </div>

          <div className="docs-terms-section" id="prohibited-use">
            <h2 className="docs-terms-section-heading">3. Safe Sandbox Behavior</h2>
            <p className="docs-terms-text">
              You agree not to use Nothric's code editors, execution contexts, or terminals to run malicious scripts, write viruses, or attempt security exploits against other users or systems.
            </p>
          </div>

          <div className="docs-terms-section" id="intellectual-property">
            <h2 className="docs-terms-section-heading">4. Code and Content Ownership</h2>
            <p className="docs-terms-text">
              Any prompts you enter and any source code generated inside Nothric's workspaces belong fully to you. Nothric claims no ownership or rights over your code files.
            </p>
          </div>
        </div>

        {/* Related Documentation footer list */}
        <div className="docs-terms-related-section">
          <span className="docs-terms-related-title">Related:</span>
          <a href="/docs/faq-general" onClick={(e) => handleLinkClick('/docs/faq-general', e)} className="docs-terms-related-link-item">
            General Questions
          </a>
          <span className="docs-terms-related-dot">•</span>
          <a href="/docs/faq-privacy" onClick={(e) => handleLinkClick('/docs/faq-privacy', e)} className="docs-terms-related-link-item">
            Privacy Policy
          </a>
        </div>

        {/* Bottom Last Updated Section */}
        <div className="docs-terms-footer-divider"></div>
        <div className="docs-terms-last-updated">
          Last updated: 17 July 2026
        </div>
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-terms-right-sidebar">
        <div className="docs-terms-rt-section">
          <div className="docs-terms-rt-header">
            <span>On this page</span>
            <svg className="docs-terms-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-terms-rt-links">
            <li>
              <a href="#acceptance" className="docs-terms-rt-link active">1. Acceptance</a>
            </li>
            <li>
              <a href="#api-billing" className="docs-terms-rt-link">2. API &amp; Billing</a>
            </li>
            <li>
              <a href="#prohibited-use" className="docs-terms-rt-link">3. Safe Behavior</a>
            </li>
            <li>
              <a href="#intellectual-property" className="docs-terms-rt-link">4. Code Ownership</a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
