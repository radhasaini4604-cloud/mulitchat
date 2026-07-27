import React, { useState } from 'react';
import './DocsImagineOverview.css';

interface DocsImagineOverviewProps {
  onNavigate: (path: string) => void;
}

export const DocsImagineOverview: React.FC<DocsImagineOverviewProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Imagine Overview

Nothric Imagine is our standalone visual sandbox that generates high-fidelity assets using leading open-weights models.

## Core Features
1. Flux Architecture: Powered by Flux Schnell and Flux Dev for sub-second visual renders.
2. Prompt Expansion: Automated reasoning loops to enrich basic text prompts.
3. Multi-Ratio Layouts: Generate square, vertical, or panoramic ratios.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-im-layout">
      {/* Left: Main Content */}
      <div className="docs-im-container docs-im-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-im-category">Imagine</div>

        {/* Main Heading */}
        <h1 className="docs-im-title">Overview</h1>

        {/* Top Action Options bar */}
        <div className="docs-im-actions-bar">
          <button className="docs-im-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-im-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-im-actions-separator">|</span>
          <button className="docs-im-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-im-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-im-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-im-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/imagine" 
            onClick={(e) => handleLinkClick('/imagine', e)}
            className="docs-im-btn-secondary"
          >
            Try Imagine <span className="docs-im-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-im-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-im-rendered-view">
            <p className="docs-im-lead">
              Welcome! Imagine is Nothric's dedicated workspace for text-to-image creation. Running independently from the conversational chat channels, Imagine is tuned for low-latency visual compilation, dynamic ratio scaling, and smart prompt detailing.
            </p>

            {/* Core Pillars */}
            <div className="docs-im-section-block" id="core-pillars">
              <h2 className="docs-im-section-heading">Core Pillars of Imagine</h2>
              <p className="docs-im-section-intro">
                The visual playground framework is constructed around three central design concepts:
              </p>
              
              <div className="docs-im-pillars-grid">
                <div className="docs-im-pillar-card">
                  <span className="docs-im-pillar-name">Flux Architecture</span>
                  <p className="docs-im-pillar-desc">
                    Leverages state-of-the-art Flux Schnell and Flux Dev checkpoints to produce standard resolution visual mockups in less than 950ms.
                  </p>
                </div>

                <div className="docs-im-pillar-card">
                  <span className="docs-im-pillar-name">Multi-Ratio Output</span>
                  <p className="docs-im-pillar-desc">
                    Scale parameters seamlessly between square (1:1), horizontal widescreen (16:9), and portrait (9:16) rendering limits on the fly.
                  </p>
                </div>

                <div className="docs-im-pillar-card">
                  <span className="docs-im-pillar-name">Prompt Enrichment</span>
                  <p className="docs-im-pillar-desc">
                    Auto-expands basic concepts into highly descriptive rendering guidelines using reasoning meta-prompts before generation runs.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Documentation footer list */}
            <div className="docs-im-related-section">
              <span className="docs-im-related-title">Related:</span>
              <a href="/image-generation" onClick={(e) => handleLinkClick('/image-generation', e)} className="docs-im-related-link-item">
                Image Generation
              </a>
              <span className="docs-im-related-dot">•</span>
              <a href="/imagine-tools" onClick={(e) => handleLinkClick('/imagine-tools', e)} className="docs-im-related-link-item">
                Imagine Tools
              </a>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-im-footer-divider"></div>
            <div className="docs-im-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-im-right-sidebar">
        <div className="docs-im-rt-section">
          <div className="docs-im-rt-header">
            <span>On this page</span>
            <svg className="docs-im-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-im-rt-links">
            <li>
              <a href="#core-pillars" className="docs-im-rt-link active">Core Pillars</a>
            </li>
            <li className="docs-im-rt-subitem">
              <a href="#resources" className="docs-im-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-im-rt-divider" />

        <div className="docs-im-rt-footer-actions">
          <button className="docs-im-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-im-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-im-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-im-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
