import React, { useState } from 'react';
import './DocsMain_chatFeatures.css';

interface DocsMain_chatFeaturesProps {
  onNavigate: (path: string) => void;
}

export const DocsMain_chatFeatures: React.FC<DocsMain_chatFeaturesProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Workspace Features

Nothric is packed with professional workspace controls to streamline multi-agent orchestration.

## Core Workspace Features
- Voice Detection: Real-time hands-free speech input with translation.
- Code Controls: Sandbox compile execution loop (Copy, Run, Play).
- Real-time Web Support: Integrates search engines to fetch online references.
- Real-time Voice Conversations: Multi-agent vocal synergy streams.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-pf-layout">
      {/* Left: Main Content */}
      <div className="docs-pf-container docs-pf-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-pf-category">Main_chat Chat</div>

        {/* Main Heading */}
        <h1 className="docs-pf-title">Features</h1>

        {/* Top Action Options bar */}
        <div className="docs-pf-actions-bar">
          <button className="docs-pf-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-pf-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-pf-actions-separator">|</span>
          <button className="docs-pf-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-pf-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-pf-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-pf-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-pf-btn-secondary"
          >
            Meet Main_chat Chat <span className="docs-pf-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-pf-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-pf-rendered-view">
            <p className="docs-pf-lead">
              Discover the dynamic, client-side tools built directly into the Main_chat Chat workspace. Experience real-time multi-agent comparisons, local compiles, and semantic searches.
            </p>

            {/* Key Features details */}
            <div className="docs-pf-section-block" id="key-features">
              <h2 className="docs-pf-section-heading">Key Features</h2>
              <p className="docs-pf-section-intro">
                Main_chat Chat consolidates a broad ecosystem of developer capabilities:
              </p>

              <div className="docs-pf-features-flat-list">
                <div className="docs-pf-flat-row">
                  <div className="docs-pf-flat-main">
                    <div className="docs-pf-flat-header">
                      <div className="docs-pf-flat-left">
                        <span className="docs-pf-flat-title">Voice Detection</span>
                        <span className="docs-pf-flat-badge">ASR</span>
                      </div>
                    </div>
                    <ul className="docs-pf-flat-details">
                      <li><strong>Real-time Audio Input:</strong> Real-time Web Audio speech synthesis and Hinglish parsing.</li>
                      <li><strong>Automatic Speech Recognition (ASR):</strong> Uses client-side audio streams to translate spoken Hinglish prompts instantly with zero latency.</li>
                      <li><strong>Acoustic Calibration:</strong> Filters out background noise dynamically, focusing on the main developer's voice.</li>
                    </ul>
                  </div>
                </div>

                <div className="docs-pf-flat-row">
                  <div className="docs-pf-flat-main">
                    <div className="docs-pf-flat-header">
                      <div className="docs-pf-flat-left">
                        <span className="docs-pf-flat-title">Code Controls</span>
                        <span className="docs-pf-flat-badge">Compile</span>
                      </div>
                    </div>
                    <ul className="docs-pf-flat-details">
                      <li><strong>Execution Workflow:</strong> Live sandbox preview compile cycle with copy/run/play rules.</li>
                      <li><strong>Interactive Execution:</strong> Instantly compile python, javascript, html, or css snippets directly inside the preview sandbox tab.</li>
                      <li><strong>Action Shortcuts:</strong> Fast copy-to-clipboard actions and play buttons to mount layout outputs immediately.</li>
                    </ul>
                  </div>
                </div>

                <div className="docs-pf-flat-row">
                  <div className="docs-pf-flat-main">
                    <div className="docs-pf-flat-header">
                      <div className="docs-pf-flat-left">
                        <span className="docs-pf-flat-title">Real-Time Web</span>
                        <span className="docs-pf-flat-badge">Search</span>
                      </div>
                    </div>
                    <ul className="docs-pf-flat-details">
                      <li><strong>Query Integration:</strong> Semantic search engines integration to inject live web references.</li>
                      <li><strong>Semantic Augmentation:</strong> Connects search engine indices directly to your conversational pipeline to fetch live news, documentation references, and stock parameters.</li>
                      <li><strong>Context Integration:</strong> Scrapes online references dynamically and structures them in the context window before queries execute.</li>
                    </ul>
                  </div>
                </div>

                <div className="docs-pf-flat-row">
                  <div className="docs-pf-flat-main">
                    <div className="docs-pf-flat-header">
                      <div className="docs-pf-flat-left">
                        <span className="docs-pf-flat-title">Voice Conversation</span>
                        <span className="docs-pf-flat-badge">Duplex</span>
                      </div>
                    </div>
                    <ul className="docs-pf-flat-details">
                      <li><strong>Conversation Streams:</strong> Duplex verbal sync conversations allowing user interruptions.</li>
                      <li><strong>Duplex Audio Streaming:</strong> Full two-way duplex voice conversations with ultra-low latency streams.</li>
                      <li><strong>Active Interruption:</strong> Enables developers to speak and interrupt active agent vocal replies naturally.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="docs-pf-next-steps">
              <h3 className="docs-pf-next-steps-heading">What's Next?</h3>
              <p className="docs-pf-next-steps-desc">
                Review workspace margins and multi-agent coordination limitations:
              </p>
              <div className="docs-pf-next-steps-links">
                <a href="/limitations" onClick={(e) => handleLinkClick('/limitations', e)} className="docs-pf-next-link-item">
                  <span>Workspace Limitations</span>
                  <span className="docs-pf-next-link-arrow">→</span>
                </a>
                <a href="/collab-overview" onClick={(e) => handleLinkClick('/collab-overview', e)} className="docs-pf-next-link-item">
                  <span>Collab Shared Whiteboards</span>
                  <span className="docs-pf-next-link-arrow">→</span>
                </a>
              </div>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-pf-footer-divider"></div>
            <div className="docs-pf-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-pf-right-sidebar">
        <div className="docs-pf-rt-section">
          <div className="docs-pf-rt-header">
            <span>On this page</span>
            <svg className="docs-pf-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-pf-rt-links">
            <li>
              <a href="#key-features" className="docs-pf-rt-link active">Key Features</a>
            </li>
            <li className="docs-pf-rt-subitem">
              <a href="#resources" className="docs-pf-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-pf-rt-divider" />

        <div className="docs-pf-rt-footer-actions">
          <button className="docs-pf-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-pf-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-pf-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-pf-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
