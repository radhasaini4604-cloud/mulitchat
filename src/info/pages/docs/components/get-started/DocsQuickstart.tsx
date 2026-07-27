import React, { useState } from 'react';
import './DocsQuickstart.css';

interface DocsQuickstartProps {
  onNavigate: (path: string) => void;
}

export const DocsQuickstart: React.FC<DocsQuickstartProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Quickstart

Welcome! In this guide, we'll walk you through the basics of using the Nothric interface, from setting up your local environment to making your first side-by-side model comparison.

## Step 1: Create a Nothric Account
Access the workspace console to start orchestrating LLMs.

## Step 2: Configure API Keys
Nothric is client-side. Go to the "Manage API keys" section and enter your API keys.

## Step 3: Launch Parallel Chat
Open Main_chat Chat, select two models (e.g., Grok 4.5 and Gemini Pro), type your prompt, and compare output results instantly.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-qs-layout">
      <div className="docs-quickstart-container docs-qs-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-qs-category">Quickstart</div>

        {/* Main Heading */}
        <h1 className="docs-qs-title">Quickstart</h1>

        {/* Top Action Options bar */}
        <div className="docs-qs-actions-bar">
          <button className="docs-qs-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-qs-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-qs-actions-separator">|</span>
          <button className="docs-qs-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-qs-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            {showMarkdown ? 'View Rendered' : 'View as Markdown'}
          </button>
        </div>

        {/* CTA Buttons row */}
        <div className="docs-qs-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-qs-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-qs-btn-secondary"
          >
            Meet Main_chat Chat <span className="docs-qs-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-qs-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-qs-rendered-view">
            <p className="docs-qs-lead">
              Welcome! In this guide, we'll walk you through the basics of using the Nothric interface, from setting up your local environment to making your first side-by-side model comparison.
            </p>

            <div className="docs-qs-steps">
              {/* Step 1 */}
              <div className="docs-qs-step-item">
                <div className="docs-qs-step-num">1</div>
                <div className="docs-qs-step-content">
                  <h3 className="docs-qs-step-title">Create a Nothric Account</h3>
                  <p className="docs-qs-step-desc">
                    Access the web interface to get started. No complex installer is required; Nothric operates fully in modern browsers.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="docs-qs-step-item">
                <div className="docs-qs-step-num">2</div>
                <div className="docs-qs-step-content">
                  <h3 className="docs-qs-step-title">Configure API Keys</h3>
                  <p className="docs-qs-step-desc">
                    Nothric is client-side. Go to the <a href="/api-guide" onClick={(e) => handleLinkClick('/api-guide', e)} className="docs-qs-inline-link">Manage API keys</a> page and input your API keys for providers like Google, Anthropic, xAI, or OpenAI. These are safely saved inside your local browser session and never sent to our servers.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="docs-qs-step-item">
                <div className="docs-qs-step-num">3</div>
                <div className="docs-qs-step-content">
                  <h3 className="docs-qs-step-title">Launch Parallel Chat</h3>
                  <p className="docs-qs-step-desc">
                    Navigate to <a href="/Main_chat" onClick={(e) => handleLinkClick('/Main_chat', e)} className="docs-qs-inline-link">Main_chat Chat</a>, select your target models side-by-side, type your prompt, and watch both models execute concurrently for speed, quality, and reasoning comparison.
                  </p>
                </div>
              </div>
            </div>

            {/* What's New Section */}
            <div className="docs-qs-whats-new-section">
              <h2 className="docs-qs-whats-new-title">What's new</h2>
              <div className="docs-qs-whats-new-grid">
                
                {/* Card 1: Imagine */}
                <div className="docs-qs-whats-new-card">
                  <h3 className="docs-qs-whats-new-card-title">Imagine</h3>
                  <p className="docs-qs-whats-new-card-desc">
                    Generate, edit, and compare images dynamically.
                  </p>
                  <a href="/imagine" onClick={(e) => handleLinkClick('/imagine', e)} className="docs-qs-whats-new-link">
                    Explore <span className="docs-qs-whats-new-link-arrow">→</span>
                  </a>
                </div>

                {/* Card 2: Collab */}
                <div className="docs-qs-whats-new-card">
                  <h3 className="docs-qs-whats-new-card-title">Collab</h3>
                  <p className="docs-qs-whats-new-card-desc">
                    Collaborate in real-time with shared workspace comparisons.
                  </p>
                  <a href="/collab" onClick={(e) => handleLinkClick('/collab', e)} className="docs-qs-whats-new-link">
                    Explore <span className="docs-whats-new-link-arrow">→</span>
                  </a>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-right-sidebar">
        <div className="docs-rt-section">
          <div className="docs-rt-header">
            <span>On this page</span>
            <svg className="docs-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-rt-links">
            <li>
              <a href="#step-1" className="docs-rt-link active">Step 1: Create a Nothric account</a>
            </li>
            <li>
              <a href="#step-2" className="docs-rt-link">Step 2: Configure API keys</a>
            </li>
            <li>
              <a href="#step-3" className="docs-rt-link">Step 3: Launch Parallel Chat</a>
            </li>
            <li>
              <a href="#whats-new" className="docs-rt-link">What's new</a>
            </li>
            <li className="docs-rt-subitem">
              <a href="#resources" className="docs-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-rt-divider" />

        <div className="docs-rt-footer-actions">
          <button className="docs-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
