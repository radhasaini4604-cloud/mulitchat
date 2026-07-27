import React, { useState } from 'react';
import './DocsImagineTools.css';

interface DocsImagineToolsProps {
  onNavigate: (path: string) => void;
}

export const DocsImagineTools: React.FC<DocsImagineToolsProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Imagine Tools

Nothric provides built-in canvas controls to edit, regenerate, and distribute your images.

## Edit Tools
- Hover Toolbar: Adjust, Filter, Crop, Object Remover.
- Seed Regeneration: Re-run prompts with new seeds.

## Export & Share
- Formats: Save as PNG, JPG, WebP.
- Sharing: Authenticated cloud links.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-it-layout">
      {/* Left: Main Content */}
      <div className="docs-it-container docs-it-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-it-category">Imagine</div>

        {/* Main Heading */}
        <h1 className="docs-it-title">Imagine Tools</h1>

        {/* Top Action Options bar */}
        <div className="docs-it-actions-bar">
          <button className="docs-it-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-it-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-it-actions-separator">|</span>
          <button className="docs-it-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-it-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-it-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-it-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/imagine" 
            onClick={(e) => handleLinkClick('/imagine', e)}
            className="docs-it-btn-secondary"
          >
            Try Imagine <span className="docs-it-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-it-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-it-rendered-view">
            <p className="docs-it-lead">
              Manipulate and distribute generated visual assets directly inside your sandbox interface. The tools system provides local image editing layers and instantaneous sharing nodes.
            </p>

            {/* Alternating Layout Sections */}
            <div className="docs-it-alternating-container" id="canvas-tools">
              
              {/* Row 1: Left Card, Right Text */}
              <div className="docs-it-alt-row">
                <div className="docs-it-alt-sidebar-panel">
                  <span className="docs-it-panel-label">CANVAS CONTROLS</span>
                  <h3 className="docs-it-panel-heading">Hover Editor</h3>
                  <div className="docs-it-panel-tags">
                    <span className="docs-it-tag">Regenerate</span>
                    <span className="docs-it-tag">Adjust</span>
                    <span className="docs-it-tag">Filter</span>
                    <span className="docs-it-tag">Crop</span>
                    <span className="docs-it-tag">Remover</span>
                  </div>
                </div>
                <div className="docs-it-alt-content-panel">
                  <p>
                    Hovering over any generated image triggers the local edit layer overlay immediately. You can recompile assets using the <strong>Regenerate</strong> tool to execute the prompt query with a fresh noise seed.
                  </p>
                  <p>
                    Use <strong>Adjust</strong> to scale brightness, contrast, and color values, or apply pre-calibrated <strong>Filters</strong> to alter the styling tones. The integrated <strong>Crop</strong> tool scales composition frames, while the brush-based <strong>Object Remover</strong> isolates and clears visual artifacts directly.
                  </p>
                </div>
              </div>

              {/* Separator line */}
              <div className="docs-it-alt-separator"></div>

              {/* Row 2: Right Card, Left Text */}
              <div className="docs-it-alt-row reverse" id="distribution-tools">
                <div className="docs-it-alt-sidebar-panel">
                  <span className="docs-it-panel-label">DISTRIBUTION</span>
                  <h3 className="docs-it-panel-heading">Export & Share</h3>
                  <div className="docs-it-panel-tags">
                    <span className="docs-it-tag">PNG</span>
                    <span className="docs-it-tag">JPG</span>
                    <span className="docs-it-tag">WebP</span>
                    <span className="docs-it-tag">Cloud Link</span>
                  </div>
                </div>
                <div className="docs-it-alt-content-panel">
                  <p>
                    Nothric supports instant client-side asset distribution. Save visual assets directly to your system drive as high-resolution <strong>PNG, JPG, or WebP</strong> formats with custom compress margins.
                  </p>
                  <p>
                    The <strong>Share</strong> function uploads target files to authenticated cloud preview buckets, returning low-latency URLs to distribute to your workspace channels instantly.
                  </p>
                </div>
              </div>

            </div>

            {/* Operational Notes points list */}
            <div className="docs-it-closing-points" id="operational-notes">
              <h3 className="docs-it-points-heading">Operational Notes</h3>
              <ul className="docs-it-points-list">
                <li><strong>Seed Synchronization:</strong> Run prompt modifications using identical random seed values to maintain object consistency across canvas iterations.</li>
                <li><strong>Client Cache Rules:</strong> Generated mockups reside in local browser storage. Clearing local cache items will clear active canvas threads.</li>
                <li><strong>Asset Specifications:</strong> Large-scale outputs automatically append generation parameter tags to help track rendering engine speeds.</li>
              </ul>
            </div>

            {/* Next Steps Section */}
            <div className="docs-it-next-steps">
              <h3 className="docs-it-next-steps-heading">What's Next?</h3>
              <p className="docs-it-next-steps-desc">
                Learn about real-time team collaboration workspaces and permissions:
              </p>
              <div className="docs-it-next-steps-links">
                <a href="/collab-overview" onClick={(e) => handleLinkClick('/collab-overview', e)} className="docs-it-next-link-item">
                  <span>Collab Workspace</span>
                  <span className="docs-it-next-link-arrow">→</span>
                </a>
                <a href="/collab-shared-workspaces" onClick={(e) => handleLinkClick('/collab-shared-workspaces', e)} className="docs-it-next-link-item">
                  <span>Shared Workspaces</span>
                  <span className="docs-it-next-link-arrow">→</span>
                </a>
              </div>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-it-footer-divider"></div>
            <div className="docs-it-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-it-right-sidebar">
        <div className="docs-it-rt-section">
          <div className="docs-it-rt-header">
            <span>On this page</span>
            <svg className="docs-it-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-it-rt-links">
            <li>
              <a href="#canvas-tools" className="docs-it-rt-link active">Hover Editor</a>
            </li>
            <li>
              <a href="#distribution-tools" className="docs-it-rt-link">Export & Share</a>
            </li>
            <li className="docs-it-rt-subitem">
              <a href="#resources" className="docs-it-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-it-rt-divider" />

        <div className="docs-it-rt-footer-actions">
          <button className="docs-it-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-it-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-it-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-it-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
