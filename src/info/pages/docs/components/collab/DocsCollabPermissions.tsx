import React, { useState } from 'react';
import './DocsCollabPermissions.css';

interface DocsCollabPermissionsProps {
  onNavigate: (path: string) => void;
}

export const DocsCollabPermissions: React.FC<DocsCollabPermissionsProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Permissions

Nothric allows all active users to create and join collaborative rooms.

## Guidelines
- Spam Detection: Accounts sending automated spam will be blocked.
- Policy Violations: Breaking terms of service will result in permanent collab room bans.
- Appeals: Contact support if your account ID was blocked in error.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-cp-layout">
      {/* Left: Main Content */}
      <div className="docs-cp-container docs-cp-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-cp-category">Collab</div>

        {/* Main Heading */}
        <h1 className="docs-cp-title">Permissions</h1>

        {/* Top Action Options bar */}
        <div className="docs-cp-actions-bar">
          <button className="docs-cp-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-cp-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-cp-actions-separator">|</span>
          <button className="docs-cp-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-cp-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-cp-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-cp-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/projects" 
            onClick={(e) => handleLinkClick('/projects', e)}
            className="docs-cp-btn-secondary"
          >
            Try Collab <span className="docs-cp-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-cp-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-cp-rendered-view">
            <p className="docs-cp-lead">
              Nothric is designed to be open. Every user has permission to create shared rooms and invite team members, but we enforce rules to protect the platform from spam.
            </p>

            {/* Standard Permissions Section */}
            <div className="docs-cp-section-block" id="user-rights">
              <h2 className="docs-cp-section-heading">Standard User Rights</h2>
              <p className="docs-cp-section-intro">
                By default, active accounts have access to all collaborative features:
              </p>

              <div className="docs-cp-rights-table-wrapper">
                <table className="docs-cp-rights-table">
                  <thead>
                    <tr>
                      <th>Workspace Action</th>
                      <th>Room Creator</th>
                      <th>Invited Member</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="docs-cp-action-name">Create Shared Rooms</td>
                      <td className="docs-cp-allowed">Yes</td>
                      <td className="docs-cp-allowed">Yes</td>
                    </tr>
                    <tr>
                      <td className="docs-cp-action-name">Generate Invite Keys</td>
                      <td className="docs-cp-allowed">Yes</td>
                      <td className="docs-cp-allowed">Yes</td>
                    </tr>
                    <tr>
                      <td className="docs-cp-action-name">Add/Remove AI Models</td>
                      <td className="docs-cp-allowed">Yes</td>
                      <td className="docs-cp-allowed">Yes</td>
                    </tr>
                    <tr>
                      <td className="docs-cp-action-name">Run Code Sandbox Previews</td>
                      <td className="docs-cp-allowed">Yes</td>
                      <td className="docs-cp-allowed">Yes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning and Anti-Spam Section */}
            <div className="docs-cp-section-block" id="spam-restrictions">
              <h2 className="docs-cp-section-heading">Spam & Policy Restrictions</h2>
              <p className="docs-cp-section-intro">
                To keep our servers fast and safe, we monitor and restrict accounts that break our rules:
              </p>

              <div className="docs-cp-warning-box">
                <div className="docs-cp-warning-item">
                  <div className="docs-cp-warning-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div className="docs-cp-warning-content">
                    <h4 className="docs-cp-warning-title">Spam Detection</h4>
                    <p className="docs-cp-warning-text">
                      If our system detects unwanted spam messages or repeated automatic queries in collab rooms, we will block your account ID from using the Collab workspace features.
                    </p>
                  </div>
                </div>

                <div className="docs-cp-warning-item">
                  <div className="docs-cp-warning-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                    </svg>
                  </div>
                  <div className="docs-cp-warning-content">
                    <h4 className="docs-cp-warning-title">Policy Violations</h4>
                    <p className="docs-cp-warning-text">
                      Violating our terms of service or guidelines (such as generating harmful text or images) will result in a permanent ban. Restricted account IDs will not be allowed to host or join any shared room sessions.
                    </p>
                  </div>
                </div>

                <div className="docs-cp-warning-item">
                  <div className="docs-cp-warning-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  </div>
                  <div className="docs-cp-warning-content">
                    <h4 className="docs-cp-warning-title">Appeals Support</h4>
                    <p className="docs-cp-warning-text">
                      If your ID was blocked by mistake, you can <a href="/support" onClick={(e) => handleLinkClick('/support', e)} className="docs-cp-inline-link">contact our support team</a> to appeal and request a review of your account status.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="docs-cp-next-steps">
              <h3 className="docs-cp-next-steps-heading">What's Next?</h3>
              <p className="docs-cp-next-steps-desc">
                Review the terms of service agreement and privacy policies:
              </p>
              <div className="docs-cp-next-steps-links">
                <a href="/terms" onClick={(e) => handleLinkClick('/terms', e)} className="docs-cp-next-link-item">
                  <span>Terms of Service</span>
                  <span className="docs-cp-next-link-arrow">→</span>
                </a>
                <a href="/privacy" onClick={(e) => handleLinkClick('/privacy', e)} className="docs-cp-next-link-item">
                  <span>Privacy Policy</span>
                  <span className="docs-cp-next-link-arrow">→</span>
                </a>
              </div>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-cp-footer-divider"></div>
            <div className="docs-cp-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-cp-right-sidebar">
        <div className="docs-cp-rt-section">
          <div className="docs-cp-rt-header">
            <span>On this page</span>
            <svg className="docs-cp-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-cp-rt-links">
            <li>
              <a href="#user-rights" className="docs-cp-rt-link active">Standard User Rights</a>
            </li>
            <li>
              <a href="#spam-restrictions" className="docs-cp-rt-link">Spam Restrictions</a>
            </li>
            <li className="docs-cp-rt-subitem">
              <a href="#resources" className="docs-cp-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-cp-rt-divider" />

        <div className="docs-cp-rt-footer-actions">
          <button className="docs-cp-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-cp-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-cp-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-cp-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
