import React, { useState } from 'react';
import './DocsAutoOverview.css';

interface DocsAutoOverviewProps {
  onNavigate: (path: string) => void;
}

export const DocsAutoOverview: React.FC<DocsAutoOverviewProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Auto Nothric Overview

Auto Nothric is our smart router. It reads what you type, finds what kind of task you want to do, and sends it to the best AI model automatically.

## Supported Models
- Code Tasks: Qwen Coder
- Reasoning & Math: GPT-4o
- Creative & Writing: Mistral Large
- Fast/General Chat: Gemini 2.5 Flash`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-ao-layout">
      {/* Left: Main Content */}
      <div className="docs-ao-container docs-ao-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-ao-category">Auto Nothric</div>

        {/* Main Heading */}
        <h1 className="docs-ao-title">Overview</h1>

        {/* Top Action Options bar */}
        <div className="docs-ao-actions-bar">
          <button className="docs-ao-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-ao-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-ao-actions-separator">|</span>
          <button className="docs-ao-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-ao-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-ao-cta-row">
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-ao-btn-primary"
          >
            Try Auto Nothric &gt;
          </a>
          <a 
            href="/docs/auto-how-it-works" 
            onClick={(e) => handleLinkClick('/docs/auto-how-it-works', e)}
            className="docs-ao-btn-secondary"
          >
            How it works <span className="docs-ao-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-ao-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-ao-rendered-view">
            <p className="docs-ao-lead">
              Auto Nothric is the smart brain of the Nothric platform. Instead of choosing which AI model to use yourself, you can just write your prompt. Our system looks at your request and sends it to the AI that is best at that exact topic.
            </p>

            {/* Visual routing schema cards */}
            <div className="docs-ao-section-block" id="routing-qwen">
              <h2 className="docs-ao-section-heading">How We Route Your Prompts</h2>
              <p className="docs-ao-section-intro">
                We put prompts into four simple groups and send them to the correct expert model:
              </p>

              <div className="docs-ao-grid">
                <div className="docs-ao-card">
                  <div className="docs-ao-card-header">
                    <span className="docs-ao-card-title">Coding & Scripts</span>
                    <span className="docs-ao-card-badge red">Qwen Coder</span>
                  </div>
                  <p className="docs-ao-card-desc">
                    If you write code, ask for programming help, or want to fix bugs, Auto Nothric routes your prompt to <strong>Qwen Coder</strong>.
                  </p>
                </div>

                <div className="docs-ao-card">
                  <div className="docs-ao-card-header">
                    <span className="docs-ao-card-title">Math & Logic</span>
                    <span className="docs-ao-card-badge red">GPT-4o</span>
                  </div>
                  <p className="docs-ao-card-desc">
                    If you ask hard science questions, multi-step math problems, or deep logic puzzles, Auto Nothric routes them to <strong>GPT-4o</strong>.
                  </p>
                </div>

                <div className="docs-ao-card">
                  <div className="docs-ao-card-header">
                    <span className="docs-ao-card-title">Writing & Creative</span>
                    <span className="docs-ao-card-badge red">Mistral Large</span>
                  </div>
                  <p className="docs-ao-card-desc">
                    If you want to brainstorm ideas, write stories, draft emails, or summarize articles, Auto Nothric routes them to <strong>Mistral Large</strong>.
                  </p>
                </div>

                <div className="docs-ao-card">
                  <div className="docs-ao-card-header">
                    <span className="docs-ao-card-title">General Chat</span>
                    <span className="docs-ao-card-badge red">Gemini Flash</span>
                  </div>
                  <p className="docs-ao-card-desc">
                    If you say hello, ask a quick question, tell a joke, or just want a fast answer, Auto Nothric routes it to <strong>Gemini 2.5 Flash</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Why use Auto Nothric details */}
            <div className="docs-ao-section-block" id="benefits">
              <h2 className="docs-ao-section-heading">Why Use Auto Nothric?</h2>
              <p className="docs-ao-section-intro">
                Auto Nothric helps you work faster and get better answers:
              </p>
              
              <ul className="docs-ao-list" style={{ color: '#a1a1aa', paddingLeft: '20px', lineHeight: '1.7', fontSize: '0.95rem' }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Save Time:</strong> You do not need to switch models manually. Just type what you want and let us do the work.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Get the Best Answers:</strong> Every AI model has things it does best. We make sure your prompt always goes to the model that knows the topic best.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>Fast Responses:</strong> The routing happens in milliseconds at the edge, so your chat experience remains quick and smooth.
                </li>
              </ul>
            </div>

            {/* Related Documentation footer list */}
            <div className="docs-ao-related-section">
              <span className="docs-ao-related-title">Related:</span>
              <a href="/docs/auto-how-it-works" onClick={(e) => handleLinkClick('/docs/auto-how-it-works', e)} className="docs-ao-related-link-item">
                How It Works
              </a>
              <span className="docs-ao-related-dot">•</span>
              <a href="/docs/Main_chat-introduction" onClick={(e) => handleLinkClick('/docs/Main_chat-introduction', e)} className="docs-ao-related-link-item">
                Main_chat Chat Intro
              </a>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-ao-footer-divider"></div>
            <div className="docs-ao-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-ao-right-sidebar">
        <div className="docs-ao-rt-section">
          <div className="docs-ao-rt-header">
            <span>On this page</span>
            <svg className="docs-ao-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-ao-rt-links">
            <li>
              <a href="#routing-qwen" className="docs-ao-rt-link active">Routing Map</a>
            </li>
            <li>
              <a href="#benefits" className="docs-ao-rt-link">Why Use It?</a>
            </li>
          </ul>
        </div>

        <div className="docs-ao-rt-divider" />

        <div className="docs-ao-rt-footer-actions">
          <button className="docs-ao-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-ao-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-ao-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-ao-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
