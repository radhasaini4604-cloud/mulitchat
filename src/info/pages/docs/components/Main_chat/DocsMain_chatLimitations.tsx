import React, { useState } from 'react';
import './DocsMain_chatLimitations.css';

interface DocsMain_chatLimitationsProps {
  onNavigate: (path: string) => void;
}

export const DocsMain_chatLimitations: React.FC<DocsMain_chatLimitationsProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Limitations

Nothric Main_chat Chat operates with client-side sandbox constraints. Review our current limitations.

## Current Limitations
- Direct Image Generation: Not supported in chat. Users must use the Imagine workspace.
- Selective Web Search: Web queries are restricted to optimized model channels.
- Isolated Memory: Context resets completely between separate conversations.
- Premium Model Pipeline: Next-generation models like Gemini 3.1 Pro and Claude Fable 5 are in active integration.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-pl-layout">
      {/* Left: Main Content */}
      <div className="docs-pl-container docs-pl-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-pl-category">Main_chat Chat</div>

        {/* Main Heading */}
        <h1 className="docs-pl-title">Limitations</h1>

        {/* Top Action Options bar */}
        <div className="docs-pl-actions-bar">
          <button className="docs-pl-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-pl-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-pl-actions-separator">|</span>
          <button className="docs-pl-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-pl-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-pl-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-pl-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-pl-btn-secondary"
          >
            Meet Main_chat Chat <span className="docs-pl-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-pl-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-pl-rendered-view">
            <p className="docs-pl-lead">
              Review current architectural limits inside the Main_chat environment. Nothric runs all consensus verification client-side, which structures how state is cached and queried.
            </p>

            {/* Limitations details */}
            <div className="docs-pl-section-block" id="limitations-list">
              <h2 className="docs-pl-section-heading">Current System Limitations</h2>
              <p className="docs-pl-section-intro">
                The following structural restrictions are present in the current release:
              </p>

              <div className="docs-pl-limits-flat-list">
                {/* No Direct Image Generation */}
                <div className="docs-pl-flat-row">
                  <div className="docs-pl-flat-main">
                    <div className="docs-pl-flat-header">
                      <div className="docs-pl-flat-left">
                        <span className="docs-pl-flat-title">No Direct Image Generation</span>
                        <span className="docs-pl-flat-badge">Imagine</span>
                      </div>
                    </div>
                    <ul className="docs-pl-flat-details">
                      <li><strong>Workspace Isolation:</strong> Image generation is not supported directly in the conversational chat workspace.</li>
                      <li><strong>Dedicated Section:</strong> Users must navigate to the standalone <span className="docs-pl-inline-link" onClick={() => onNavigate('/imagine-overview')}>Imagine Workspace</span> tab to generate visual assets.</li>
                    </ul>
                  </div>
                </div>

                {/* No Real-time Search for all models */}
                <div className="docs-pl-flat-row">
                  <div className="docs-pl-flat-main">
                    <div className="docs-pl-flat-header">
                      <div className="docs-pl-flat-left">
                        <span className="docs-pl-flat-title">Selective Web Search</span>
                        <span className="docs-pl-flat-badge">Search</span>
                      </div>
                    </div>
                    <ul className="docs-pl-flat-details">
                      <li><strong>Restricted Models:</strong> Live web search support is not available for all models due to api-level pipeline differences.</li>
                      <li><strong>Optimized Routing:</strong> Active online references are only fetched and synthesized when running optimized consensus combinations.</li>
                    </ul>
                  </div>
                </div>

                {/* No in-between chats memory */}
                <div className="docs-pl-flat-row">
                  <div className="docs-pl-flat-main">
                    <div className="docs-pl-flat-header">
                      <div className="docs-pl-flat-left">
                        <span className="docs-pl-flat-title">Isolated Session Memory</span>
                        <span className="docs-pl-flat-badge">Memory</span>
                      </div>
                    </div>
                    <ul className="docs-pl-flat-details">
                      <li><strong>No Cross-Chat Recall:</strong> Nothric does not preserve conversational state context between separate active chats.</li>
                      <li><strong>Fresh Sandbox Threads:</strong> Every chat workspace initialization resets active cache variables to guarantee local browser speed and data privacy.</li>
                    </ul>
                  </div>
                </div>

                {/* Lack of Premium Models */}
                <div className="docs-pl-flat-row">
                  <div className="docs-pl-flat-main">
                    <div className="docs-pl-flat-header">
                      <div className="docs-pl-flat-left">
                        <span className="docs-pl-flat-title">Premium Models Pipeline</span>
                        <span className="docs-pl-flat-badge">Models</span>
                      </div>
                    </div>
                    <ul className="docs-pl-flat-details">
                      <li><strong>Active Integration:</strong> Next-generation frontier models (like <em>Gemini 3.1 Pro</em> and <em>Claude Fable 5</em>) are not yet integrated.</li>
                      <li><strong>API Alignment:</strong> We are coordinating with API provider console hooks to add these models to the models index in upcoming releases.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="docs-pl-next-steps">
              <h3 className="docs-pl-next-steps-heading">What's Next?</h3>
              <p className="docs-pl-next-steps-desc">
                Learn about image generation canvases or real-time team collaboration:
              </p>
              <div className="docs-pl-next-steps-links">
                <a href="/imagine-overview" onClick={(e) => handleLinkClick('/imagine-overview', e)} className="docs-pl-next-link-item">
                  <span>Imagine Workspace</span>
                  <span className="docs-pl-next-link-arrow">→</span>
                </a>
                <a href="/collab-overview" onClick={(e) => handleLinkClick('/collab-overview', e)} className="docs-pl-next-link-item">
                  <span>Collab Shared Spaces</span>
                  <span className="docs-pl-next-link-arrow">→</span>
                </a>
              </div>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-pl-footer-divider"></div>
            <div className="docs-pl-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-pl-right-sidebar">
        <div className="docs-pl-rt-section">
          <div className="docs-pl-rt-header">
            <span>On this page</span>
            <svg className="docs-pl-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-pl-rt-links">
            <li>
              <a href="#limitations-list" className="docs-pl-rt-link active">System Limitations</a>
            </li>
            <li className="docs-pl-rt-subitem">
              <a href="#resources" className="docs-pl-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-pl-rt-divider" />

        <div className="docs-pl-rt-footer-actions">
          <button className="docs-pl-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-pl-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-pl-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-pl-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
