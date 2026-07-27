import React, { useState } from 'react';
import './DocsApiGuide.css';

interface DocsApiGuideProps {
  onNavigate: (path: string) => void;
}

export const DocsApiGuide: React.FC<DocsApiGuideProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# API Guide

Set up your provider credentials to start comparing models side-by-side.

## Step 1: Obtain Official Provider Keys
Visit the developer consoles to obtain your access credentials:
- Google AI Studio (Gemini)
- Anthropic Console (Claude)
- OpenAI Developer Platform (GPT)
- xAI Console (Grok)

## Step 2: Open Settings & Input Keys
Go to the "Manage API keys" panel to input your keys.

## Step 3: Secure Local Browser Storage
Nothric operates client-side. Your keys are saved directly in your browser's \`localStorage\` and never transmitted to our server.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-api-layout">
      {/* Left: Main Content */}
      <div className="docs-api-container docs-api-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-api-category">Configuration</div>

        {/* Main Heading */}
        <h1 className="docs-api-title">API Guide</h1>

        {/* Top Action Options bar */}
        <div className="docs-api-actions-bar">
          <button className="docs-api-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-api-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-api-actions-separator">|</span>
          <button className="docs-api-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-api-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-api-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-api-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-api-btn-secondary"
          >
            Meet Main_chat Chat <span className="docs-api-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-api-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-api-rendered-view">
            <p className="docs-api-lead">
              Welcome! To start querying LLMs side-by-side on Nothric, you will need to configure your respective API provider keys. Follow this guide to securely configure your tokens locally.
            </p>

            <div className="docs-api-steps">
              {/* Step 1 */}
              <div className="docs-api-step-item">
                <div className="docs-api-step-num">1</div>
                <div className="docs-api-step-content">
                  <h3 className="docs-api-step-title">Obtain Official Provider Keys</h3>
                  <p className="docs-api-step-desc">
                    Visit the developer portals of the providers you wish to query, create an account, and generate a new API key:
                  </p>
                  <div className="docs-api-providers-grid">
                    <div className="docs-api-provider-card">
                      <span className="docs-api-provider-name">Google AI Studio</span>
                      <p className="docs-api-provider-desc">Gemini weights</p>
                      <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="docs-api-provider-link">Get Key ↗</a>
                    </div>

                    <div className="docs-api-provider-card">
                      <span className="docs-api-provider-name">Anthropic</span>
                      <p className="docs-api-provider-desc">Claude assistant</p>
                      <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="docs-api-provider-link">Get Key ↗</a>
                    </div>

                    <div className="docs-api-provider-card">
                      <span className="docs-api-provider-name">OpenAI Platform</span>
                      <p className="docs-api-provider-desc">GPT intelligence</p>
                      <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="docs-api-provider-link">Get Key ↗</a>
                    </div>

                    <div className="docs-api-provider-card">
                      <span className="docs-api-provider-name">xAI Console</span>
                      <p className="docs-api-provider-desc">Grok streams</p>
                      <a href="https://console.x.ai/" target="_blank" rel="noopener noreferrer" className="docs-api-provider-link">Get Key ↗</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="docs-api-step-item">
                <div className="docs-api-step-num">2</div>
                <div className="docs-api-step-content">
                  <h3 className="docs-api-step-title">Open Settings & Input Keys</h3>
                  <p className="docs-api-step-desc">
                    Navigate to the <a href="/api-guide" onClick={(e) => handleLinkClick('/api-guide', e)} className="docs-api-inline-link">Manage API keys</a> settings pane inside the Nothric menu. Enter your tokens into the corresponding provider fields.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="docs-api-step-item">
                <div className="docs-api-step-num">3</div>
                <div className="docs-api-step-content">
                  <h3 className="docs-api-step-title">Secure Local Browser Storage</h3>
                  <p className="docs-api-step-desc">
                    Nothric operates client-side. We do not host or operate backend proxy databases. Your keys are saved directly in your browser's local sandbox storage (<code>localStorage</code>) and are sent directly to the model provider endpoints. They are never sent to or cached on our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="docs-api-next-steps">
              <h3 className="docs-api-next-steps-heading">What's Next?</h3>
              <p className="docs-api-next-steps-desc">
                Now that you have configured your credentials, check out these related sections:
              </p>
              <div className="docs-api-next-steps-links">
                <a href="/rate-limits" onClick={(e) => handleLinkClick('/rate-limits', e)} className="docs-api-next-link-item">
                  <span>Rate Limits Guide</span>
                  <span className="docs-api-next-link-arrow">→</span>
                </a>
                <a href="/models" onClick={(e) => handleLinkClick('/models', e)} className="docs-api-next-link-item">
                  <span>Model Library</span>
                  <span className="docs-api-next-link-arrow">→</span>
                </a>
              </div>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-api-footer-divider"></div>
            <div className="docs-api-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-api-right-sidebar">
        <div className="docs-api-rt-section">
          <div className="docs-api-rt-header">
            <span>On this page</span>
            <svg className="docs-api-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-api-rt-links">
            <li>
              <a href="#step-1" className="docs-api-rt-link active">Step 1: Obtain Official Provider Keys</a>
            </li>
            <li>
              <a href="#step-2" className="docs-api-rt-link">Step 2: Input Keys in Settings</a>
            </li>
            <li>
              <a href="#step-3" className="docs-api-rt-link">Step 3: Secure Local Storage</a>
            </li>
            <li className="docs-api-rt-subitem">
              <a href="#resources" className="docs-api-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-api-rt-divider" />

        <div className="docs-api-rt-footer-actions">
          <button className="docs-api-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-api-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-api-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-api-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
