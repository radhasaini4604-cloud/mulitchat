import React, { useState } from 'react';
import './DocsPricing.css';

interface DocsPricingProps {
  onNavigate: (path: string) => void;
}

export const DocsPricing: React.FC<DocsPricingProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Pricing

Nothric does not markup API costs. Since all connections operate client-side directly from your browser, you pay standard developer rates directly to your providers.

## Model Pricing Rates
| Model | Input (per M tokens) | Output (per M tokens) |
| --- | --- | --- |
| GPT 5.5 | $2.50 | $10.00 |
| Claude Opus 4.6 | $15.00 | $75.00 |
| Gemini 3.5 Flash | $0.075 | $0.30 |
| Gemini 2.5 Flash | $0.075 | $0.30 |
| Perplexity | $0.005 / query | $0.005 / query |

## Open Source Local Costs
- gpt 120b: Free (local inference)
- mistral: Free (local inference)

## Usage Guidelines Violation Fee
When your request is deemed to be in violation of our usage guideline by our system, we will still charge for the generation of the request.
For violations that are caught before generation in the Responses API, we will charge a $0.05 usage guideline violation fee per request.

## Billing and Availability
Your model access might vary depending on various factors such as geographical location, account limitations, etc.
For how the bills are charged, visit Manage Billing for more information.
For the most up-to-date information on your team's model availability, visit Models Page on developer consoles.

Last updated: 17 July 2026`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-pricing-layout">
      {/* Left: Main Content */}
      <div className="docs-pricing-container docs-pricing-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-pricing-category">Get Started</div>

        {/* Main Heading */}
        <h1 className="docs-pricing-title">Pricing</h1>

        {/* Top Action Options bar */}
        <div className="docs-pricing-actions-bar">
          <button className="docs-pricing-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-pricing-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-pricing-actions-separator">|</span>
          <button className="docs-pricing-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-pricing-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-pricing-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-pricing-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-pricing-btn-secondary"
          >
            Meet Main_chat Chat <span className="docs-pricing-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-pricing-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-pricing-rendered-view">
            <p className="docs-pricing-lead">
              Welcome! Nothric does not markup or charge fees on top of your model query operations. Since all LLM comparisons run client-side directly from your local browser, you pay standard developer-level costs directly to the respective API providers.
            </p>

            {/* Model Pricing Rates Section */}
            <div className="docs-pricing-section-block" id="pricing-rates">
              <h2 className="docs-pricing-section-heading">Model Pricing Rates</h2>
              <p className="docs-pricing-section-intro">
                Current token and query costs for supported frontier models per 1,000,000 (Million) tokens.
              </p>

              <div className="docs-pricing-table">
                <div className="docs-pricing-header-row">
                  <div>Model</div>
                  <div>Input (per M tokens)</div>
                  <div>Output (per M tokens)</div>
                </div>

                <div className="docs-pricing-row">
                  <div className="docs-pr-name">GPT 5.5</div>
                  <div className="docs-pr-cost">$2.50</div>
                  <div className="docs-pr-cost">$10.00</div>
                </div>

                <div className="docs-pricing-row">
                  <div className="docs-pr-name">Claude Opus 4.6</div>
                  <div className="docs-pr-cost">$15.00</div>
                  <div className="docs-pr-cost">$75.00</div>
                </div>

                <div className="docs-pricing-row">
                  <div className="docs-pr-name">Gemini 3.5 Flash</div>
                  <div className="docs-pr-cost">$0.075</div>
                  <div className="docs-pr-cost">$0.30</div>
                </div>

                <div className="docs-pricing-row">
                  <div className="docs-pr-name">Gemini 2.5 Flash</div>
                  <div className="docs-pr-cost">$0.075</div>
                  <div className="docs-pr-cost">$0.30</div>
                </div>

                <div className="docs-pricing-row">
                  <div className="docs-pr-name">Perplexity</div>
                  <div className="docs-pr-cost">$0.005 / query</div>
                  <div className="docs-pr-cost">$0.005 / query</div>
                </div>
              </div>
            </div>

            {/* Open Source Section */}
            <div className="docs-pricing-section-block" id="os-costs">
              <h2 className="docs-pricing-section-heading">Open Source Local Costs</h2>
              <p className="docs-pricing-section-intro">
                For community open-weights runs, there are no query fees. All computation is handled locally on your workstation hardware.
              </p>

              <div className="docs-pricing-os-list">
                <div className="docs-pricing-os-row">
                  <span className="docs-pricing-os-name">gpt 120b</span>
                  <span className="docs-pricing-os-dots"></span>
                  <span className="docs-pricing-os-desc">Free (local inference)</span>
                </div>

                <div className="docs-pricing-os-row">
                  <span className="docs-pricing-os-name">mistral</span>
                  <span className="docs-pricing-os-dots"></span>
                  <span className="docs-pricing-os-desc">Free (local inference)</span>
                </div>
              </div>
            </div>

            {/* Usage Guidelines Violation Fee Section */}
            <div className="docs-pricing-section-block" id="violation-fee">
              <h2 className="docs-pricing-section-heading">Usage Guidelines Violation Fee</h2>
              <p className="docs-pricing-section-intro">
                When your request is deemed to be in violation of our usage guideline by our system, we will still charge for the generation of the request.
              </p>
              <p className="docs-pricing-section-intro">
                For violations that are caught before generation in the Responses API, we will charge a $0.05 usage guideline violation fee per request.
              </p>
            </div>

            {/* Billing and Availability Section */}
            <div className="docs-pricing-section-block" id="billing-availability">
              <h2 className="docs-pricing-section-heading">Billing and Availability</h2>
              <p className="docs-pricing-section-intro">
                Your model access might vary depending on various factors such as geographical location, account limitations, etc.
              </p>
              <p className="docs-pricing-section-intro">
                For how the bills are charged, visit <span className="docs-pricing-inline-link">Manage Billing</span> for more information.
              </p>
              <p className="docs-pricing-section-intro">
                For the most up-to-date information on your team's model availability, visit <span className="docs-pricing-inline-link">Models Page</span> on developer consoles.
              </p>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-pricing-footer-divider"></div>
            <div className="docs-pricing-last-updated">
              Last updated: 17 July 2026
            </div>

          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-pricing-right-sidebar">
        <div className="docs-pricing-rt-section">
          <div className="docs-pricing-rt-header">
            <span>On this page</span>
            <svg className="docs-pricing-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-pricing-rt-links">
            <li>
              <a href="#pricing-rates" className="docs-pricing-rt-link active">Model Pricing Rates</a>
            </li>
            <li>
              <a href="#os-costs" className="docs-pricing-rt-link">Open Source Local Costs</a>
            </li>
            <li>
              <a href="#violation-fee" className="docs-pricing-rt-link">Usage Guidelines Violation Fee</a>
            </li>
            <li>
              <a href="#billing-availability" className="docs-pricing-rt-link">Billing and Availability</a>
            </li>
            <li className="docs-pricing-rt-subitem">
              <a href="#resources" className="docs-pricing-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-pricing-rt-divider" />

        <div className="docs-pricing-rt-footer-actions">
          <button className="docs-pricing-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-pricing-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-pricing-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-pricing-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
