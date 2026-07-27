import React, { useState } from 'react';
import './DocsCollabOverview.css';

interface DocsCollabOverviewProps {
  onNavigate: (path: string) => void;
}

export const DocsCollabOverview: React.FC<DocsCollabOverviewProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Collab Overview

Nothric Collab connects multiple developers in real-time rooms to compose prompts and coordinate multi-agent consensus streams.

## Workflow Phases
1. Create Workspace Room: Spin up collaborative rooms synced over websocket nodes.
2. Invite Team: Distribute secure workspace access tokens.
3. Live Prompt Sync: Edit and execute prompt configurations side-by-side.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-co-layout">
      {/* Left: Main Content */}
      <div className="docs-co-container docs-co-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-co-category">Collab</div>

        {/* Main Heading */}
        <h1 className="docs-co-title">Overview</h1>

        {/* Top Action Options bar */}
        <div className="docs-co-actions-bar">
          <button className="docs-co-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-co-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-co-actions-separator">|</span>
          <button className="docs-co-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-co-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-co-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-co-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/projects" 
            onClick={(e) => handleLinkClick('/projects', e)}
            className="docs-co-btn-secondary"
          >
            Try Collab <span className="docs-co-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-co-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-co-rendered-view">
            <p className="docs-co-lead">
              Nothric Collab lets you work with other developers in real-time rooms. You can write prompts, test code, and compare AI model answers together at the same time.
            </p>

            {/* Workflow Steps Layout */}
            <div className="docs-co-section-block" id="workflow-flow">
              <h2 className="docs-co-section-heading">How Collab Rooms Work</h2>
              <p className="docs-co-section-intro">
                Nothric uses fast local sync to run group chats and shared workspaces without storing your data on our servers:
              </p>

              <div className="docs-co-workflow-flow">
                {/* Step 1 */}
                <div className="docs-co-flow-step">
                  <div className="docs-co-step-number-wrapper">
                    <span className="docs-co-step-number">01</span>
                    <div className="docs-co-step-line"></div>
                  </div>
                  <div className="docs-co-step-content">
                    <h3 className="docs-co-step-title">Create a Shared Room</h3>
                    <p className="docs-co-step-desc">
                      Start a new group room directly from your dashboard. A secure invite key is created on your device so your conversations stay private.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="docs-co-flow-step">
                  <div className="docs-co-step-number-wrapper">
                    <span className="docs-co-step-number">02</span>
                    <div className="docs-co-step-line"></div>
                  </div>
                  <div className="docs-co-step-content">
                    <h3 className="docs-co-step-title">Invite Your Team</h3>
                    <p className="docs-co-step-desc">
                      Send the invite key to your friends or teammates. Once they join, they can see your cursor, chat with you, and write prompts with you instantly.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="docs-co-flow-step">
                  <div className="docs-co-step-number-wrapper">
                    <span className="docs-co-step-number">03</span>
                  </div>
                  <div className="docs-co-step-content">
                    <h3 className="docs-co-step-title">Write Prompts Together</h3>
                    <p className="docs-co-step-desc">
                      Edit text prompts together, run the code editor at the same time, and see how different AI models answer in side-by-side columns.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Documentation footer list */}
            <div className="docs-co-related-section">
              <span className="docs-co-related-title">Related:</span>
              <a href="/collab-shared-workspaces" onClick={(e) => handleLinkClick('/collab-shared-workspaces', e)} className="docs-co-related-link-item">
                Shared Workspaces
              </a>
              <span className="docs-co-related-dot">•</span>
              <a href="/collab-permissions" onClick={(e) => handleLinkClick('/collab-permissions', e)} className="docs-co-related-link-item">
                Permissions Qwen
              </a>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-co-footer-divider"></div>
            <div className="docs-co-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-co-right-sidebar">
        <div className="docs-co-rt-section">
          <div className="docs-co-rt-header">
            <span>On this page</span>
            <svg className="docs-co-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-co-rt-links">
            <li>
              <a href="#workflow-flow" className="docs-co-rt-link active">How it Works</a>
            </li>
            <li className="docs-co-rt-subitem">
              <a href="#resources" className="docs-co-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-co-rt-divider" />

        <div className="docs-co-rt-footer-actions">
          <button className="docs-co-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-co-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-co-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-co-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
