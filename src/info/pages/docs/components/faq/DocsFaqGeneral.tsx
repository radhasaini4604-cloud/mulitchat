import React, { useState } from 'react';
import './DocsFaqGeneral.css';

interface DocsFaqGeneralProps {
  onNavigate: (path: string) => void;
}

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export const DocsFaqGeneral: React.FC<DocsFaqGeneralProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems: FaqItem[] = [
    {
      question: "What is Nothric and how does it work?",
      answer: (
        <span>
          Nothric is a space-themed multi-column workspace for developers. It lets you run multiple models (like Qwen Coder, GPT-4o, Mistral Large, and Gemini Flash) side-by-side, or use our smart <strong>Auto Nothric</strong> router to pick the best model for you.
        </span>
      )
    },
    {
      question: "How does the Auto Nothric routing work?",
      answer: (
        <span>
          We use an ultra-fast classification model (Llama 3.1 8B running on Groq) to look at your prompt. In milliseconds, it detects if you need code help (routes to Qwen Coder), hard logic (routes to GPT-4o), writing (routes to Mistral Large), or general chat (routes to Gemini Flash).
        </span>
      )
    },
    {
      question: "Are my API keys and chat histories safe?",
      answer: (
        <span>
          Yes, completely! Nothric is built with a local-first layout. Your API keys, chat histories, and settings are saved directly in your browser's local storage. We do not store them on any remote servers.
        </span>
      )
    },
    {
      question: "Can I connect my own custom keys?",
      answer: (
        <span>
          Yes. You can manage your keys in the welcome page or the API settings panel. We support Groq, OpenAI, Google Gemini, and Mistral keys.
        </span>
      )
    },
    {
      question: "What are permissions in shared workspaces?",
      answer: (
        <span>
          Workspace permissions let you control who can read, modify, or run code scripts when collaborating on shared files. This keeps your shared developer sandbox safe and secure.
        </span>
      )
    }
  ];

  const rawMarkdown = `# General FAQ

1. What is Nothric and how does it work?
Nothric is a workspace that lets you run Qwen Coder, GPT-4o, Mistral Large, and Gemini side-by-side.

2. How does Auto Nothric work?
It uses a fast Llama 3.1 8B model to route prompts automatically.

3. Are my API keys safe?
Yes, everything is stored locally in your browser.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-faq-layout">
      {/* Left: Main Content */}
      <div className="docs-faq-container docs-faq-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-faq-category">FAQ</div>

        {/* Main Heading */}
        <h1 className="docs-faq-title">General Questions</h1>

        {/* Top Action Options bar */}
        <div className="docs-faq-actions-bar">
          <button className="docs-faq-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-faq-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
        </div>

        {/* Intro */}
        <p className="docs-faq-lead">
          Find quick answers to common questions about using Nothric, managing your model setups, and data handling.
        </p>

        {/* Accordion Questions List */}
        <div className="docs-faq-accordion-block">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`docs-faq-accordion-item ${isOpen ? 'open' : ''}`}>
                <button className="docs-faq-accordion-header" onClick={() => toggleAccordion(idx)}>
                  <span>{item.question}</span>
                  <svg className={`docs-faq-accordion-arrow ${isOpen ? 'rotate' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="docs-faq-accordion-content-wrapper" style={{ height: isOpen ? 'auto' : 0 }}>
                  <div className="docs-faq-accordion-content">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Related Documentation footer list */}
        <div className="docs-faq-related-section">
          <span className="docs-faq-related-title">Related:</span>
          <a href="/docs/faq-privacy" onClick={(e) => handleLinkClick('/docs/faq-privacy', e)} className="docs-faq-related-link-item">
            Privacy Policy
          </a>
          <span className="docs-faq-related-dot">•</span>
          <a href="/docs/faq-terms" onClick={(e) => handleLinkClick('/docs/faq-terms', e)} className="docs-faq-related-link-item">
            Terms of Use
          </a>
        </div>

        {/* Bottom Last Updated Section */}
        <div className="docs-faq-footer-divider"></div>
        <div className="docs-faq-last-updated">
          Last updated: 17 July 2026
        </div>
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-faq-right-sidebar">
        <div className="docs-faq-rt-section">
          <div className="docs-faq-rt-header">
            <span>On this page</span>
            <svg className="docs-faq-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-faq-rt-links">
            {faqItems.map((item, idx) => (
              <li key={idx}>
                <a onClick={() => toggleAccordion(idx)} className={`docs-faq-rt-link ${openIndex === idx ? 'active' : ''}`}>
                  {item.question}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};
