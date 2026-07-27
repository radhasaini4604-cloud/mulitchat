import React, { useState } from 'react';
import './DocsCollabWorkspaces.css';

interface DocsCollabWorkspacesProps {
  onNavigate: (path: string) => void;
}

export const DocsCollabWorkspaces: React.FC<DocsCollabWorkspacesProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Shared Workspaces

Type /model in the input box to open the dropdown. Use Arrow keys to move, and press Tab or Enter to select your model.

- Choose single or multiple models.
- Quick command dropdown to add models.
- Press Enter or Tab to submit.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-cw-layout">
      {/* Left: Main Content */}
      <div className="docs-cw-container docs-cw-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-cw-category">Collab</div>

        {/* Main Heading */}
        <h1 className="docs-cw-title">Shared Workspaces</h1>

        {/* Top Action Options bar */}
        <div className="docs-cw-actions-bar">
          <button className="docs-cw-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-cw-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-cw-actions-separator">|</span>
          <button className="docs-cw-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-cw-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-cw-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-cw-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/projects" 
            onClick={(e) => handleLinkClick('/projects', e)}
            className="docs-cw-btn-secondary"
          >
            Try Collab <span className="docs-cw-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-cw-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-cw-rendered-view">
            <p className="docs-cw-lead">
              Manage AI models in your group rooms. You can choose to ask a single AI model or query multiple AI models together side-by-side.
            </p>

            {/* Model Selection Mockup Panel */}
            <div className="docs-cw-section-block" id="dropdown-guide">
              <h2 className="docs-cw-section-heading">How to Choose Models</h2>
              <p className="docs-cw-section-intro">
                Type the model command directly into the chat input box to select and add AI models to your room:
              </p>

              <div className="docs-cw-mockup-wrapper">
                <div className="docs-cw-mockup-panel">
                  <div className="docs-cw-mockup-input">
                    <span className="docs-cw-input-slash">/model </span>
                    <span className="docs-cw-input-cursor"></span>
                  </div>
                  <div className="docs-cw-mockup-dropdown">
                    <div className="docs-cw-dropdown-header">CHOOSE ACTIVE MODELS</div>
                    <div className="docs-cw-dropdown-item active">
                      <span className="docs-cw-item-title">Gemini 1.5 Pro</span>
                      <span className="docs-cw-item-label">Google</span>
                    </div>
                    <div className="docs-cw-dropdown-item">
                      <span className="docs-cw-item-title">Claude 3.5 Sonnet</span>
                      <span className="docs-cw-item-label">Anthropic</span>
                    </div>
                    <div className="docs-cw-dropdown-item">
                      <span className="docs-cw-item-title">GPT-4o</span>
                      <span className="docs-cw-item-label">OpenAI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps & Guidelines */}
            <div className="docs-cw-section-block" id="keyboard-shortcuts">
              <h2 className="docs-cw-section-heading">Step-by-Step Instructions</h2>
              <div className="docs-cw-info-grid">
                
                <div className="docs-cw-info-card">
                  <div className="docs-cw-info-num">1</div>
                  <h3 className="docs-cw-info-title">Talk to One or More Models</h3>
                  <p className="docs-cw-info-text">
                    You can ask a single model or load multiple models at the same time to see their answers side-by-side in your room.
                  </p>
                </div>

                <div className="docs-cw-info-card">
                  <div className="docs-cw-info-num">2</div>
                  <h3 className="docs-cw-info-title">Type the Command</h3>
                  <p className="docs-cw-info-text">
                    Click the chat input box and type <code>/model</code>. This immediately opens a dropdown menu listing all available models.
                  </p>
                </div>

                <div className="docs-cw-info-card">
                  <div className="docs-cw-info-num">3</div>
                  <h3 className="docs-cw-info-title">Select and Confirm</h3>
                  <p className="docs-cw-info-text">
                    Use your keyboard Arrow keys to move up and down, then press <strong>Tab</strong> or <strong>Enter</strong> to select and activate the model.
                  </p>
                </div>
              </div>
            </div>

            {/* Workspace Features details */}
            <div className="docs-cw-section-block" id="workspace-features">
              <h2 className="docs-cw-section-heading">Workspace Features</h2>
              <p className="docs-cw-section-intro">
                Nothric rooms include several tools to help your team work together smoothly:
              </p>

              <div className="docs-cw-features-flat-list">
                <div className="docs-cw-flat-row">
                  <div className="docs-cw-flat-main">
                    <div className="docs-cw-flat-header">
                      <div className="docs-cw-flat-left">
                        <span className="docs-cw-flat-title">Cursor Syncing</span>
                        <span className="docs-cw-flat-badge">Sync</span>
                      </div>
                    </div>
                    <ul className="docs-cw-flat-details">
                      <li><strong>Real-time Presence:</strong> See exactly where your team members are clicking and typing.</li>
                      <li><strong>No Conflicts:</strong> Multiple people can type in the same prompt box without overriding each other's work.</li>
                    </ul>
                  </div>
                </div>

                <div className="docs-cw-flat-row">
                  <div className="docs-cw-flat-main">
                    <div className="docs-cw-flat-header">
                      <div className="docs-cw-flat-left">
                        <span className="docs-cw-flat-title">Shared Chat History</span>
                        <span className="docs-cw-flat-badge">Cache</span>
                      </div>
                    </div>
                    <ul className="docs-cw-flat-details">
                      <li><strong>Instant Updates:</strong> When anyone sends a prompt or gets an AI answer, it updates on everyone's screen instantly.</li>
                      <li><strong>Persistent Thread:</strong> The chat history stays synced in the room so new members can read past replies.</li>
                    </ul>
                  </div>
                </div>

                <div className="docs-cw-flat-row">
                  <div className="docs-cw-flat-main">
                    <div className="docs-cw-flat-header">
                      <div className="docs-cw-flat-left">
                        <span className="docs-cw-flat-title">Sandbox Sharing</span>
                        <span className="docs-cw-flat-badge">Code</span>
                      </div>
                    </div>
                    <ul className="docs-cw-flat-details">
                      <li><strong>Code Previews:</strong> If someone compiles code or generates a webpage inside the sandbox, the preview updates for everyone.</li>
                      <li><strong>Play Actions:</strong> Run, test, and edit code blocks interactively together.</li>
                    </ul>
                  </div>
                </div>

                <div className="docs-cw-flat-row">
                  <div className="docs-cw-flat-main">
                    <div className="docs-cw-flat-header">
                      <div className="docs-cw-flat-left">
                        <span className="docs-cw-flat-title">History & Privacy</span>
                        <span className="docs-cw-flat-badge">Privacy</span>
                      </div>
                    </div>
                    <ul className="docs-cw-flat-details">
                      <li><strong>Saved Room History:</strong> Room chats and links are saved in the room history so you can review previous collaborative work anytime.</li>
                      <li><strong>Personal Chat Isolation:</strong> Your personal Nothric chat history and memory are never shown or used inside group rooms. Teammates can never see your private chats.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="docs-cw-next-steps">
              <h3 className="docs-cw-next-steps-heading">What's Next?</h3>
              <p className="docs-cw-next-steps-desc">
                Learn about managing member permissions inside collaborative rooms:
              </p>
              <div className="docs-cw-next-steps-links">
                <a href="/collab-permissions" onClick={(e) => handleLinkClick('/collab-permissions', e)} className="docs-cw-next-link-item">
                  <span>Permissions Qwen</span>
                  <span className="docs-cw-next-link-arrow">→</span>
                </a>
                <a href="/privacy" onClick={(e) => handleLinkClick('/privacy', e)} className="docs-cw-next-link-item">
                  <span>Privacy Policy</span>
                  <span className="docs-cw-next-link-arrow">→</span>
                </a>
              </div>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-cw-footer-divider"></div>
            <div className="docs-cw-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-cw-right-sidebar">
        <div className="docs-cw-rt-section">
          <div className="docs-cw-rt-header">
            <span>On this page</span>
            <svg className="docs-cw-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-cw-rt-links">
            <li>
              <a href="#dropdown-guide" className="docs-cw-rt-link active">How to Choose Models</a>
            </li>
            <li>
              <a href="#keyboard-shortcuts" className="docs-cw-rt-link">Step-by-Step Instructions</a>
            </li>
            <li className="docs-cw-rt-subitem">
              <a href="#resources" className="docs-cw-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-cw-rt-divider" />

        <div className="docs-cw-rt-footer-actions">
          <button className="docs-cw-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-cw-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-cw-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-cw-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
