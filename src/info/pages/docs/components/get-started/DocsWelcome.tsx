import { useState } from 'react';
import './DocsWelcome.css';

interface DocsWelcomeProps {
  onNavigate: (path: string) => void;
}

export function DocsWelcome({ onNavigate }: DocsWelcomeProps) {
  const [activeTab, setActiveTab] = useState<'status' | 'latency' | 'limits'>('status');

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <div className="docs-welcome-container">
      {/* SpaceX/Grok Style Welcome Banner */}
      <div className="docs-welcome-banner">
        
        {/* Left Side: Title and buttons */}
        <div className="docs-welcome-info">
          <h1 className="docs-welcome-title">
            Get started with<br /><span className="docs-welcome-title-main">Nothric</span>
          </h1>
          <p className="docs-welcome-lead">
            Intelligent, fast, and multi-model comparison interface across code, text, voice, image, and video.
          </p>
          <div className="docs-welcome-actions">
            <a 
              href="/api-guide" 
              onClick={(e) => handleLinkClick('/api-guide', e)} 
              className="docs-action-btn-primary"
            >
              Manage API keys &gt;
            </a>
            <a 
              href="/Main_chat" 
              onClick={(e) => handleLinkClick('/Main_chat', e)} 
              className="docs-action-btn-secondary"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Right Side: Tabbed Status Card */}
        <div className="docs-welcome-code-card">
          <div className="docs-code-header">
            <button 
              className={`docs-code-tab ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveTab('status')}
            >
              Status
            </button>
            <button 
              className={`docs-code-tab ${activeTab === 'latency' ? 'active' : ''}`}
              onClick={() => setActiveTab('latency')}
            >
              Latency
            </button>
            <button 
              className={`docs-code-tab ${activeTab === 'limits' ? 'active' : ''}`}
              onClick={() => setActiveTab('limits')}
            >
              Usage Limits
            </button>
          </div>

          <div className="docs-code-body">
            {activeTab === 'status' && (
              <>
                <div className="docs-code-line">
                  <span className="docs-code-orange">import</span> <span className="docs-code-white">nothric</span> <span className="docs-code-orange">as</span> <span className="docs-code-white">hz</span>
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-white">hz</span>.<span className="docs-code-variable">environment</span>()
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-white">status</span> = <span className="docs-code-string">"optimal"</span>
                </div>
                <div className="docs-code-line">
                  <span className="docs-code-white">security</span> = <span className="docs-code-string">"verified"</span>
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-comment"># Workspace verification checks</span>
                </div>
                <div className="docs-code-line">
                  <span className="docs-code-white">hz</span>.<span className="docs-code-variable">ready</span>()
                </div>
              </>
            )}

            {activeTab === 'latency' && (
              <>
                <div className="docs-code-line">
                  <span className="docs-code-comment"># Nothric Edge Network</span>
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-orange">from</span> <span className="docs-code-white">nothric.network</span> <span className="docs-code-orange">import</span> <span className="docs-code-white">Edge</span>
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-white">edge</span> = <span className="docs-code-white">Edge</span>.<span className="docs-code-variable">connect</span>()
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-white">edge</span>.<span className="docs-code-variable">latency</span> = <span className="docs-code-string">"24ms"</span>
                </div>
                <div className="docs-code-line">
                  <span className="docs-code-white">edge</span>.<span className="docs-code-variable">route</span> = <span className="docs-code-string">"optimal"</span>
                </div>
                <div className="docs-code-line">
                  <span className="docs-code-white">edge</span>.<span className="docs-code-variable">status</span> = <span className="docs-code-string">"online"</span>
                </div>
              </>
            )}

            {activeTab === 'limits' && (
              <>
                <div className="docs-code-line">
                  <span className="docs-code-comment"># Shared Tier Resources</span>
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-orange">import</span> <span className="docs-code-white">nothric</span> <span className="docs-code-orange">as</span> <span className="docs-code-white">hz</span>
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-white">workspace</span> = <span className="docs-code-white">hz</span>.<span className="docs-code-variable">workspace</span>()
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-white">workspace</span>.<span className="docs-code-variable">quota</span> = <span className="docs-code-string">"92%"</span>
                </div>
                <div className="docs-code-line">
                  <span className="docs-code-white">workspace</span>.<span className="docs-code-variable">status</span> = <span className="docs-code-string">"available"</span>
                </div>
                <div className="docs-code-line"></div>
                <div className="docs-code-line">
                  <span className="docs-code-comment"># Shared resources quota refreshes daily</span>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Welcome content additional descriptive lines & footer */}
      <div className="docs-welcome-extra">
        {/* Welcome content additional descriptive lines */}
        <div className="docs-welcome-bullets">
          <div className="docs-welcome-bullet-item">
            <div className="docs-welcome-bullet-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="docs-welcome-bullet-text">
              <strong>Local Key Setup:</strong> Nothric operates client-side. Simply input your private keys once; they stay safely stored in your browser session.
            </p>
          </div>

          <div className="docs-welcome-bullet-item">
            <div className="docs-welcome-bullet-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="docs-welcome-bullet-text">
              <strong>Parallel Execution:</strong> Run separate AI models adjacent to one another to analyze responses and speeds side-by-side.
            </p>
          </div>
        </div>
        {/* Explore Documentation columns */}
        <div className="docs-explore-section">
          <h2 className="docs-explore-title">Explore Documentation</h2>
          <div className="docs-explore-grid">
            
            {/* Column 1: Get started */}
            <div className="docs-explore-col">
              <h3 className="docs-explore-col-title">Get started</h3>
              <div className="docs-explore-links">
                <a href="/api-guide" onClick={(e) => handleLinkClick('/api-guide', e)} className="docs-explore-link">
                  Manage API keys <span className="docs-explore-arrow">↗</span>
                </a>
                <a href="/docs" onClick={(e) => handleLinkClick('/docs', e)} className="docs-explore-link">
                  Quickstart guide <span className="docs-explore-arrow">↗</span>
                </a>
                <a href="/docs" onClick={(e) => handleLinkClick('/docs', e)} className="docs-explore-link">
                  Models <span className="docs-explore-arrow">↗</span>
                </a>
                <a href="/docs" onClick={(e) => handleLinkClick('/docs', e)} className="docs-explore-link">
                  Pricing <span className="docs-explore-arrow">↗</span>
                </a>
              </div>
            </div>

            {/* Column 2: Workspace Features */}
            <div className="docs-explore-col">
              <h3 className="docs-explore-col-title">Workspace</h3>
              <div className="docs-explore-links">
                <a href="/Main_chat" onClick={(e) => handleLinkClick('/Main_chat', e)} className="docs-explore-link">
                  Parallel Chat <span className="docs-explore-arrow">↗</span>
                </a>
                <a href="/imagine" onClick={(e) => handleLinkClick('/imagine', e)} className="docs-explore-link">
                  Imagine Console <span className="docs-explore-arrow">↗</span>
                </a>
                <a href="/collab" onClick={(e) => handleLinkClick('/collab', e)} className="docs-explore-link">
                  Collaboration <span className="docs-explore-arrow">↗</span>
                </a>
                <a href="/docs" onClick={(e) => handleLinkClick('/docs', e)} className="docs-explore-link">
                  Release notes <span className="docs-explore-arrow">↗</span>
                </a>
              </div>
            </div>

            {/* Column 3: Resources */}
            <div className="docs-explore-col">
              <h3 className="docs-explore-col-title">Resources</h3>
              <div className="docs-explore-links">
                <a href="/api-guide" onClick={(e) => handleLinkClick('/api-guide', e)} className="docs-explore-link">
                  Setup guide <span className="docs-explore-arrow">↗</span>
                </a>
                <a href="/privacy" onClick={(e) => handleLinkClick('/privacy', e)} className="docs-explore-link">
                  Privacy policy <span className="docs-explore-arrow">↗</span>
                </a>
                <a href="/terms" onClick={(e) => handleLinkClick('/terms', e)} className="docs-explore-link">
                  Terms of use <span className="docs-explore-arrow">↗</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Welcome Page Footer */}
        <div className="docs-welcome-footer">
          <span>Nothric © 2026</span>
          <div className="docs-welcome-footer-links">
            <a href="/privacy" onClick={(e) => handleLinkClick('/privacy', e)}>Privacy Policy</a>
            <a href="/terms" onClick={(e) => handleLinkClick('/terms', e)}>Terms of Use</a>
          </div>
        </div>
      </div>

    </div>
  );
}
