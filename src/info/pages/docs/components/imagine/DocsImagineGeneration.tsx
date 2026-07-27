import React, { useState } from 'react';
import './DocsImagineGeneration.css';

interface DocsImagineGenerationProps {
  onNavigate: (path: string) => void;
}

export const DocsImagineGeneration: React.FC<DocsImagineGenerationProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Image Generation

Learn how to configure prompts, model engines, and aspect ratios inside Nothric's visual sandbox.

## Key Generation Steps
- Prompt Entry: Input creative concepts and leverage reasoning loops.
- Engine Selection: Scale outputs between Flux Dev and Flux Schnell.
- Aspect Ratios: Toggle layout margins from 1:1, 16:9, and 9:16.
- Progress Cycle: Live loading progressions from 0% to 100% on canvas.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-ig-layout">
      {/* Left: Main Content */}
      <div className="docs-ig-container docs-ig-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-ig-category">Imagine</div>

        {/* Main Heading */}
        <h1 className="docs-ig-title">Image Generation</h1>

        {/* Top Action Options bar */}
        <div className="docs-ig-actions-bar">
          <button className="docs-ig-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-ig-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-ig-actions-separator">|</span>
          <button className="docs-ig-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-ig-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-ig-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-ig-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/imagine" 
            onClick={(e) => handleLinkClick('/imagine', e)}
            className="docs-ig-btn-secondary"
          >
            Try Imagine <span className="docs-ig-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-ig-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-ig-rendered-view">
            <p className="docs-ig-lead">
              Create high-resolution visual outputs from plain text instructions. Our backend routes image generation passes to remote GPU servers or local inference tunnels based on your workspace keys.
            </p>

            {/* Generation details */}
            <div className="docs-ig-section-block" id="generation-steps">
              <h2 className="docs-ig-section-heading">Generation Workflows</h2>
              <p className="docs-ig-section-intro">
                Follow these parameters to configure and run image generation cycles:
              </p>

              <div className="docs-ig-limits-flat-list">
                {/* Prompt Entry */}
                <div className="docs-ig-flat-row">
                  <div className="docs-ig-flat-main">
                    <div className="docs-ig-flat-header">
                      <div className="docs-ig-flat-left">
                        <span className="docs-ig-flat-title">Prompt Entry</span>
                        <span className="docs-ig-flat-badge">Prompt</span>
                      </div>
                    </div>
                    <ul className="docs-ig-flat-details">
                      <li><strong>Syntactic Expansion:</strong> Basic keywords compile through reasoning cycles to auto-generate highly detailed environmental instructions.</li>
                      <li><strong>Negative Modifiers:</strong> Filter out details, shapes, or structural configurations using negative prompt properties.</li>
                    </ul>
                  </div>
                </div>

                {/* Model Selection */}
                <div className="docs-ig-flat-row">
                  <div className="docs-ig-flat-main">
                    <div className="docs-ig-flat-header">
                      <div className="docs-ig-flat-left">
                        <span className="docs-ig-flat-title">Model Selection</span>
                        <span className="docs-ig-flat-badge">Engine</span>
                      </div>
                    </div>
                    <ul className="docs-ig-flat-details">
                      <li><strong>Flux Dev:</strong> Optimizes details, sharp lighting shadows, and legible textual characters inside generated images.</li>
                      <li><strong>Flux Schnell:</strong> Built for ultra-low latency passes, outputting high-quality assets in under 1 second.</li>
                    </ul>
                  </div>
                </div>

                {/* Ratio Modification */}
                <div className="docs-ig-flat-row">
                  <div className="docs-ig-flat-main">
                    <div className="docs-ig-flat-header">
                      <div className="docs-ig-flat-left">
                        <span className="docs-ig-flat-title">Aspect Ratios</span>
                        <span className="docs-ig-flat-badge">Ratio</span>
                      </div>
                    </div>
                    <ul className="docs-ig-flat-details">
                      <li><strong>Landscape (16:9):</strong> Best for cinematic displays, wide wallpapers, and header interfaces.</li>
                      <li><strong>Portrait (9:16):</strong> Formatted for smartphone mockup panels, vertical frames, and stories.</li>
                      <li><strong>Square (1:1):</strong> Ideal for profile cards, icons, and modular canvas components.</li>
                    </ul>
                  </div>
                </div>

                {/* Output Rendering */}
                <div className="docs-ig-flat-row">
                  <div className="docs-ig-flat-main">
                    <div className="docs-ig-flat-header">
                      <div className="docs-ig-flat-left">
                        <span className="docs-ig-flat-title">Output Rendering</span>
                        <span className="docs-ig-flat-badge">Output</span>
                      </div>
                    </div>
                    <ul className="docs-ig-flat-details">
                      <li><strong>Live Feedback:</strong> Shows step progress indicators from 0% to 100% directly inside the rendering thumbnail card.</li>
                      <li><strong>Sandbox Storage:</strong> Visual assets compile and load directly in the browser's memory buffer before download.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="docs-ig-next-steps">
              <h3 className="docs-ig-next-steps-heading">What's Next?</h3>
              <p className="docs-ig-next-steps-desc">
                Review specific design tools and collaboration workflow rules:
              </p>
              <div className="docs-ig-next-steps-links">
                <a href="/imagine-tools" onClick={(e) => handleLinkClick('/imagine-tools', e)} className="docs-ig-next-link-item">
                  <span>Imagine Tools</span>
                  <span className="docs-ig-next-link-arrow">→</span>
                </a>
                <a href="/collab-overview" onClick={(e) => handleLinkClick('/collab-overview', e)} className="docs-ig-next-link-item">
                  <span>Collab Shared Spaces</span>
                  <span className="docs-ig-next-link-arrow">→</span>
                </a>
              </div>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-ig-footer-divider"></div>
            <div className="docs-ig-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-ig-right-sidebar">
        <div className="docs-ig-rt-section">
          <div className="docs-ig-rt-header">
            <span>On this page</span>
            <svg className="docs-ig-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-ig-rt-links">
            <li>
              <a href="#generation-steps" className="docs-ig-rt-link active">Generation Steps</a>
            </li>
            <li className="docs-ig-rt-subitem">
              <a href="#resources" className="docs-ig-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-ig-rt-divider" />

        <div className="docs-ig-rt-footer-actions">
          <button className="docs-ig-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-ig-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-ig-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-ig-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
