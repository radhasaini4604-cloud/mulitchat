import React, { useState } from 'react';
import './DocsReleaseNotes.css';

interface DocsReleaseNotesProps {
  onNavigate: (path: string) => void;
}

export const DocsReleaseNotes: React.FC<DocsReleaseNotesProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const changelogPosts = [
    {
      version: 'v4.8.0-frontier',
      date: 'August 28, 2026',
      title: 'Frontier Model Hub & Single Model Workspace',
      tags: [
        { text: 'New Models', type: 'new' as const },
        { text: 'Interface', type: 'upgrade' as const }
      ],
      intro: 'We have integrated the industry\'s leading frontier models directly into our core routing framework, accompanied by a dedicated single-model workspace for focused dialogue.',
      details: [
        'Frontier Models: Integrated native access to Gemini 3.1 Pro, Claude 3.5, and GPT-5.5 models.',
        'Single Model Chat: Allows users to bypass multi-agent consensus loops and talk directly with a single specific model.',
        'Latency Tuning: Optimized route mapping to lower token retrieval latency by 12% across frontier nodes.'
      ]
    },
    {
      version: 'v4.6.0-core',
      date: 'August 12, 2026',
      title: 'Auto Nothric Consensus Router',
      tags: [
        { text: 'Core Engine', type: 'upgrade' as const }
      ],
      intro: 'Introducing Auto Nothric, our meta-routing intelligence that dynamically analyzes user prompts to select and trigger the optimal combination of models.',
      details: [
        'Smart Routing: Automatically routes code queries to Mistral, conversational prompts to Gemini, and vision files to Qwen.',
        'Token Calibration: Optimizes token costs by dynamically skipping consensus verification when a single model is sufficient.'
      ]
    },
    {
      version: 'v4.3.0-collab',
      date: 'July 24, 2026',
      title: 'Multi-Model Discussions inside Collab',
      tags: [
        { text: 'Collab', type: 'upgrade' as const }
      ],
      intro: 'To preserve the core multi-agent synergy of Nothric, we have upgraded our real-time collaboration whiteboard to support simultaneous multi-model discussions.',
      details: [
        'Multi-Agent Whiteboard: Teams can now summon and run multiple models simultaneously on the collaborative whiteboard canvas.',
        'Room Mentions: Easily coordinate tasks during team brainstorms by tagging specific agents (e.g. `@gemini`, `@mistral`).'
      ]
    },
    {
      version: 'v4.2.0-collab',
      date: 'July 14, 2026',
      title: 'Single-Model Canvas Integration in Collab',
      tags: [
        { text: 'Collab', type: 'new' as const }
      ],
      intro: 'Based on high developer demand, we have brought our first dedicated model assistant directly into the real-time collaboration rooms.',
      details: [
        'Collaborative Mistral: Integrated a single-agent Mistral model inside the shared rooms to assist with real-time editing.',
        'State Sync: Real-time listeners automatically sync the model\'s outputs to all active whiteboard participants.'
      ]
    },
    {
      version: 'v4.0.0-collab',
      date: 'July 04, 2026',
      title: 'Nothric Collab Live Beta Launch',
      tags: [
        { text: 'Collab', type: 'new' as const }
      ],
      intro: 'We are thrilled to launch the live beta of Nothric Collab, our real-time collaborative workspace designed exclusively for human-to-human user coordination.',
      details: [
        'Shared Workspace: Secure, low-latency sandbox enabling teams to chat, draw, and share workspaces in real-time.',
        'Live Cursor Tracking: Real-time UI syncing showing exactly where collaborators are focusing on the screen.'
      ]
    }
  ];

  const getMarkdown = () => {
    return `# Release Notes

The latest updates, features, and fixes shipping to the Nothric model sandbox workspace.

` + changelogPosts.map(post => {
      return `## ${post.title} (${post.version}) - ${post.date}\n\n${post.intro}\n\n${post.details.map(d => `* ${d}`).join('\n')}`;
    }).join('\n\n');
  };

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(getMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-rn-layout">
      {/* Left: Main Content */}
      <div className="docs-rn-container docs-rn-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-rn-category">Get Started</div>

        {/* Main Heading */}
        <h1 className="docs-rn-title">Release Notes</h1>

        {/* Top Action Options bar */}
        <div className="docs-rn-actions-bar">
          <button className="docs-rn-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-rn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-rn-actions-separator">|</span>
          <button className="docs-rn-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-rn-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-rn-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-rn-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-rn-btn-secondary"
          >
            Meet Main_chat Chat <span className="docs-rn-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-rn-markdown-view">
            <pre>{getMarkdown()}</pre>
          </div>
        ) : (
          <div className="docs-rn-rendered-view">
            <p className="docs-rn-lead">
              The latest updates, features, and fixes shipping to the Nothric model sandbox workspace. Keep track of model migrations, engine upgrades, and platform capability releases.
            </p>

            {/* Timeline container */}
            <div className="docs-rn-timeline">
              {changelogPosts.map((post, index) => {
                const dateDay = post.date.split(',')[0];

                return (
                  <div key={index} className="docs-rn-post" id={post.version}>
                    {/* Left: Date */}
                    <div className="docs-rn-left">
                      <span className="docs-rn-date">{dateDay}</span>
                    </div>

                    {/* Middle: line & dot */}
                    <div className="docs-rn-middle">
                      <div className="docs-rn-dot"></div>
                    </div>

                    {/* Right: details */}
                    <div className="docs-rn-right">
                      <h3 className="docs-rn-post-title">{post.title}</h3>
                      <div className="docs-rn-tags-row">
                        <span className="docs-rn-version">{post.version}</span>
                        {post.tags.map((tag, tIdx) => (
                          <span key={tIdx} className={`docs-rn-tag ${tag.type}`}>
                            {tag.text}
                          </span>
                        ))}
                      </div>

                      <p className="docs-rn-intro">{post.intro}</p>

                      <ul className="docs-rn-list">
                        {post.details.map((detail, dIdx) => {
                          const separator = detail.includes(':') ? ':' : '—';
                          const parts = detail.split(separator);
                          const leadText = parts[0].trim();
                          const descText = parts.slice(1).join(separator).trim();

                          return (
                            <li key={dIdx} className="docs-rn-list-item">
                              <span className="docs-rn-list-lead">{leadText}</span>
                              {descText && (
                                <>
                                  <span className="docs-rn-list-dash"> — </span>
                                  <span className="docs-rn-list-desc">{descText}</span>
                                </>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-rn-footer-divider"></div>
            <div className="docs-rn-last-updated">
              Last updated: 28 August 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-rn-right-sidebar">
        <div className="docs-rn-rt-section">
          <div className="docs-rn-rt-header">
            <span>On this page</span>
            <svg className="docs-rn-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-rn-rt-links">
            {changelogPosts.map((post, idx) => (
              <li key={idx}>
                <a href={`#${post.version}`} className={`docs-rn-rt-link ${idx === 0 ? 'active' : ''}`}>{post.title}</a>
              </li>
            ))}
            <li className="docs-rn-rt-subitem">
              <a href="#resources" className="docs-rn-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-rn-rt-divider" />

        <div className="docs-rn-rt-footer-actions">
          <button className="docs-rn-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-rn-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-rn-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-rn-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
