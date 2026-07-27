import React, { useState } from 'react';
import './DocsRateLimits.css';

interface DocsRateLimitsProps {
  onNavigate: (path: string) => void;
}

export const DocsRateLimits: React.FC<DocsRateLimitsProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Rate Limits

Nothric provides a generous free allocation of queries, which can be entirely customized and expanded by linking your own API keys.

## Nothric Free Allocation
- Conversational: 100 free queries per day (across all frontier models).
- Image Generation: 10 free images per day.

## Custom API Key Limits
Linking your own keys unlocks direct provider quotas. Go to the Manage API Keys panel to connect.

### Google Gemini Limits
- Free Tier: 15 RPM (Requests Per Minute), 1,500 RPD (Requests Per Day).
- Paid Tier: 360 RPM, 120,000 RPD.

### Image Generation Custom limits
- Free Tier: 10 images / day.
- Custom API Tier: 70+ images / day with premium styles.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-rl-layout">
      {/* Left: Main Content */}
      <div className="docs-rl-container docs-rl-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-rl-category">Configuration</div>

        {/* Main Heading */}
        <h1 className="docs-rl-title">Rate Limits</h1>

        {/* Top Action Options bar */}
        <div className="docs-rl-actions-bar">
          <button className="docs-rl-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-rl-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-rl-actions-separator">|</span>
          <button className="docs-rl-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-rl-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-rl-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-rl-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-rl-btn-secondary"
          >
            Meet Main_chat Chat <span className="docs-rl-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-rl-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-rl-rendered-view">
            <p className="docs-rl-lead">
              Nothric is designed to scale with your needs. Out-of-the-box, we provide a generous daily quota for all active developer configurations. To bypass these limitations, you can connect your own keys.
            </p>

            {/* Default Allocations */}
            <div className="docs-rl-section-block" id="free-allocations">
              <h2 className="docs-rl-section-heading">Nothric Free Allocation</h2>
              <p className="docs-rl-section-intro">
                When query operations are routed through Nothric's public developer sandbox node, the following daily allowances apply:
              </p>
              
              <div className="docs-rl-info-cards-grid">
                <div className="docs-rl-info-card">
                  <div className="docs-rl-info-card-header">Conversational Models</div>
                  <div className="docs-rl-info-card-number">100</div>
                  <div className="docs-rl-info-card-sub">free queries per day across all frontier models</div>
                </div>

                <div className="docs-rl-info-card">
                  <div className="docs-rl-info-card-header">Image Generation</div>
                  <div className="docs-rl-info-card-number">10</div>
                  <div className="docs-rl-info-card-sub">free images per day via Flux Schnell</div>
                </div>
              </div>
            </div>

            {/* Custom Keys Rate limits */}
            <div className="docs-rl-section-block" id="custom-keys">
              <h2 className="docs-rl-section-heading">Custom API Key Limits</h2>
              <p className="docs-rl-section-intro">
                Linking your own custom key configurations bypasses the daily Nothric quotas. Once configured in the <a href="/api-guide" onClick={(e) => handleLinkClick('/api-guide', e)} className="docs-rl-inline-link">Manage API keys</a> settings pane, you get direct and complete access to standard provider quotas:
              </p>

              {/* Gemini limits */}
              <div className="docs-rl-provider-limit-block" id="gemini-limits">
                <h3 className="docs-rl-provider-limit-title">Google Gemini Limits</h3>
                <p className="docs-rl-section-intro">
                  Quotas supported directly by Google AI Studio configurations:
                </p>
                <div className="docs-rl-table">
                  <div className="docs-rl-table-header-row">
                    <div>Usage Tier</div>
                    <div>Requests Per Minute (RPM)</div>
                    <div>Requests Per Day (RPD)</div>
                  </div>
                  <div className="docs-rl-table-row">
                    <div className="docs-rl-table-name">Free Tier</div>
                    <div className="docs-rl-table-val">15 RPM</div>
                    <div className="docs-rl-table-val">1,500 RPD</div>
                  </div>
                  <div className="docs-rl-table-row">
                    <div className="docs-rl-table-name">Paid Tier</div>
                    <div className="docs-rl-table-val">360 RPM</div>
                    <div className="docs-rl-table-val">120,000 RPD</div>
                  </div>
                </div>
              </div>

              {/* Image custom limits */}
              <div className="docs-rl-provider-limit-block" id="image-limits">
                <h3 className="docs-rl-provider-limit-title">Image Generation Custom limits</h3>
                <p className="docs-rl-section-intro">
                  Unlock high-performance output scaling by connecting custom visual generation pipelines:
                </p>
                <div className="docs-rl-table">
                  <div className="docs-rl-table-header-row">
                    <div>Configuration</div>
                    <div>Daily Quota Allowance</div>
                    <div>Premium Features</div>
                  </div>
                  <div className="docs-rl-table-row">
                    <div className="docs-rl-table-name">Free Tier</div>
                    <div className="docs-rl-table-val">10 images / day</div>
                    <div className="docs-rl-table-val">Standard resolution only</div>
                  </div>
                  <div className="docs-rl-table-row">
                    <div className="docs-rl-table-name">Custom API Tier</div>
                    <div className="docs-rl-table-val">70+ images / day</div>
                    <div className="docs-rl-table-val">High definition & custom ratios</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="docs-rl-next-steps">
              <h3 className="docs-rl-next-steps-heading">What's Next?</h3>
              <p className="docs-rl-next-steps-desc">
                Now that you understand limits and configurations, explore the sandbox interfaces:
              </p>
              <div className="docs-rl-next-steps-links">
                <a href="/Main_chat" onClick={(e) => handleLinkClick('/Main_chat', e)} className="docs-rl-next-link-item">
                  <span>Main_chat Chat Intro</span>
                  <span className="docs-rl-next-link-arrow">→</span>
                </a>
                <a href="/imagine-overview" onClick={(e) => handleLinkClick('/imagine-overview', e)} className="docs-rl-next-link-item">
                  <span>Imagine Image Generation</span>
                  <span className="docs-rl-next-link-arrow">→</span>
                </a>
              </div>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-rl-footer-divider"></div>
            <div className="docs-rl-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-rl-right-sidebar">
        <div className="docs-rl-rt-section">
          <div className="docs-rl-rt-header">
            <span>On this page</span>
            <svg className="docs-rl-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-rl-rt-links">
            <li>
              <a href="#free-allocations" className="docs-rl-rt-link active">Nothric Free Allocation</a>
            </li>
            <li>
              <a href="#custom-keys" className="docs-rl-rt-link">Custom API Key Limits</a>
            </li>
            <li className="docs-rl-rt-subitem">
              <a href="#gemini-limits" className="docs-rl-rt-link">Google Gemini Limits</a>
            </li>
            <li className="docs-rl-rt-subitem">
              <a href="#image-limits" className="docs-rl-rt-link">Image Generation Limits</a>
            </li>
          </ul>
        </div>

        <div className="docs-rl-rt-divider" />

        <div className="docs-rl-rt-footer-actions">
          <button className="docs-rl-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-rl-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-rl-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-rl-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
