import React, { useState } from 'react';
import './DocsModels.css';

interface DocsModelsProps {
  onNavigate: (path: string) => void;
}

export const DocsModels: React.FC<DocsModelsProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const rawMarkdown = `# Models

Welcome! Nothric supports a curated library of frontier, open-source, and image generation models. Compare parameters, speeds, and strengths side-by-side.

## Frontier Models
- Gemini: Gemini 3.5 Flash, Gemini 2.5 Flash
- Anthropic: Claude Opus 4.6
- OpenAI: GPT 5.5
- Perplexity: Web searching & grounding
- Cohere: High-volume translation & parsing

## Open Source Models
- GPT 120B: High capacity, self-hosted
- Mistral: Efficient, localized inference

## Image Generation Models
- Nano Banana Pro: Ultra-fast sketch generation
- Flux Dev: High-fidelity prompt compliance`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-models-layout">
      {/* Left: Main Content */}
      <div className="docs-models-container docs-models-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-models-category">Get Started</div>

        {/* Main Heading */}
        <h1 className="docs-models-title">Models</h1>

        {/* Top Action Options bar */}
        <div className="docs-models-actions-bar">
          <button className="docs-models-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-models-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-models-actions-separator">|</span>
          <button className="docs-models-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-models-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-models-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-models-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-models-btn-secondary"
          >
            Meet Main_chat Chat <span className="docs-models-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-models-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-models-rendered-view">
            <p className="docs-models-lead">
              Welcome! Nothric supports a curated library of frontier, open-source, and image generation models. Compare parameters, capabilities, and strengths side-by-side to choose the perfect engine for your workload.
            </p>

            {/* Frontier Models Section */}
            <div className="docs-models-section-block" id="frontier-models">
              <h2 className="docs-models-section-heading">Frontier Models</h2>
              <p className="docs-models-section-intro">
                State-of-the-art commercial systems designed for advanced logic, search, and language processing.
              </p>
              
              <div className="docs-models-grid">
                <div className="docs-model-item-card">
                  <div className="docs-model-brand">Gemini Suite</div>
                  <div className="docs-model-variants">Gemini 3.5 Flash, Gemini 2.5 Flash</div>
                </div>

                <div className="docs-model-item-card">
                  <div className="docs-model-brand">Anthropic</div>
                  <div className="docs-model-variants">Claude Opus 4.6</div>
                </div>

                <div className="docs-model-item-card">
                  <div className="docs-model-brand">OpenAI</div>
                  <div className="docs-model-variants">GPT 5.5</div>
                </div>

                <div className="docs-model-item-card">
                  <div className="docs-model-brand">Perplexity</div>
                  <div className="docs-model-variants">Real-time Web Search Grounding</div>
                </div>

                <div className="docs-model-item-card">
                  <div className="docs-model-brand">Cohere</div>
                  <div className="docs-model-variants">Command R+, Multilingual Embeddings</div>
                </div>
              </div>
            </div>

            {/* Open Source Models Section */}
            <div className="docs-models-section-block" id="open-source-models">
              <h2 className="docs-models-section-heading">Open Source</h2>
              <p className="docs-models-section-intro">
                High-performance community weights allowing offline execution, fine-tuning, and full inference transparency.
              </p>

              <div className="docs-os-list">
                <div className="docs-os-row">
                  <span className="docs-os-name">gpt 120b</span>
                  <span className="docs-os-dots"></span>
                  <span className="docs-os-desc">120b parameters</span>
                </div>

                <div className="docs-os-row">
                  <span className="docs-os-name">mistral</span>
                  <span className="docs-os-dots"></span>
                  <span className="docs-os-desc">Open-weights enterprise intelligence</span>
                </div>
              </div>
            </div>

            {/* Image Models Section */}
            <div className="docs-models-section-block" id="image-models">
              <h2 className="docs-models-section-heading">Image Models</h2>
              <p className="docs-models-section-intro">
                Leading diffusion and transformer models dedicated to creative asset compilation and design editing.
              </p>

              <div className="docs-models-grid">
                <div className="docs-model-item-card">
                  <div className="docs-model-brand">Nano Banana</div>
                  <div className="docs-model-variants">Nano Banana Pro</div>
                </div>

                <div className="docs-model-item-card">
                  <div className="docs-model-brand">Black Forest Labs</div>
                  <div className="docs-model-variants">Flux Dev</div>
                </div>
              </div>
            </div>

            {/* Recommendation Suite Section */}
            <div className="docs-models-section-block" id="model-selection">
              <h2 className="docs-models-section-heading">Model Selection Guide</h2>
              <p className="docs-models-section-intro">
                Quick guide on targeting models based on your project requirements and workload logic.
              </p>

              <div className="docs-selection-table">
                <div className="docs-selection-header-row">
                  <div>Model</div>
                  <div>Best For</div>
                </div>

                <div className="docs-selection-row">
                  <div className="docs-sel-name">Claude Opus 4.6</div>
                  <div className="docs-sel-desc">Complex reasoning, coding</div>
                </div>

                <div className="docs-selection-row">
                  <div className="docs-sel-name">GPT 5.5</div>
                  <div className="docs-sel-desc">Logical analysis, general</div>
                </div>

                <div className="docs-selection-row">
                  <div className="docs-sel-name">Gemini 3.5 Flash</div>
                  <div className="docs-sel-desc">Speed, high throughput</div>
                </div>

                <div className="docs-selection-row">
                  <div className="docs-sel-name">Flux Dev</div>
                  <div className="docs-sel-desc">High-fidelity imagery</div>
                </div>

                <div className="docs-selection-row">
                  <div className="docs-sel-name">Mistral</div>
                  <div className="docs-sel-desc">Private local execution</div>
                </div>

                <div className="docs-selection-row">
                  <div className="docs-sel-name">Nano Banana Pro</div>
                  <div className="docs-sel-desc">Rapid image sketching</div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-models-right-sidebar">
        <div className="docs-models-rt-section">
          <div className="docs-models-rt-header">
            <span>On this page</span>
            <svg className="docs-models-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-models-rt-links">
            <li>
              <a href="#frontier-models" className="docs-models-rt-link active">Frontier Models</a>
            </li>
            <li>
              <a href="#open-source-models" className="docs-models-rt-link">Open Source</a>
            </li>
            <li>
              <a href="#image-models" className="docs-models-rt-link">Image Models</a>
            </li>
            <li>
              <a href="#model-selection" className="docs-models-rt-link">Model Selection Guide</a>
            </li>
            <li className="docs-models-rt-subitem">
              <a href="#resources" className="docs-models-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-models-rt-divider" />

        <div className="docs-models-rt-footer-actions">
          <button className="docs-models-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-models-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-models-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-models-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
