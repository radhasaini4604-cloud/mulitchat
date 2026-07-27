import React, { useState, useEffect } from 'react';
import './DocsAutoHowItWorks.css';

interface DocsAutoHowItWorksProps {
  onNavigate: (path: string) => void;
}

interface SamplePrompt {
  text: string;
  category: 'code' | 'reasoning' | 'creative' | 'conversational';
  modelName: string;
  badge: string;
  mockAnswer: string;
}

const HighlightedRustCode = () => {
  return (
    <pre className="docs-ahw-code-block">
      <span className="tokyo-keyword">fn</span> <span className="tokyo-func">binary_search</span>(arr: &amp;[<span className="tokyo-type">i32</span>], target: <span className="tokyo-type">i32</span>) -&gt; <span className="tokyo-type">Option</span>&lt;<span className="tokyo-type">usize</span>&gt; &#123;{"\n"}
      {"    "}<span className="tokyo-keyword">let mut</span> low = <span className="tokyo-number">0</span>;{"\n"}
      {"    "}<span className="tokyo-keyword">let mut</span> high = arr.<span className="tokyo-func">len</span>();{"\n"}
      {"    "}<span className="tokyo-keyword">while</span> low &lt; high &#123;{"\n"}
      {"        "}<span className="tokyo-keyword">let</span> mid = low + (high - low) / <span className="tokyo-number">2</span>;{"\n"}
      {"        "}<span className="tokyo-keyword">if</span> arr[mid] == target &#123; <span className="tokyo-keyword">return</span> <span className="tokyo-func">Some</span>(mid); &#125;{"\n"}
      {"        "}<span className="tokyo-keyword">else if</span> arr[mid] &lt; target &#123; low = mid + <span className="tokyo-number">1</span>; &#125;{"\n"}
      {"        "}<span className="tokyo-keyword">else</span> &#123; high = mid; &#125;{"\n"}
      {"    "}&#125;{"\n"}
      {"    "}<span className="tokyo-func">None</span>{"\n"}
      &#125;
    </pre>
  );
};

export const DocsAutoHowItWorks: React.FC<DocsAutoHowItWorksProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  const samplePrompts: SamplePrompt[] = [
    {
      text: "Write a binary search algorithm in Rust",
      category: "code",
      modelName: "Qwen Coder",
      badge: "Qwen Coder",
      mockAnswer: "```rust\nfn binary_search(arr: &[i32], target: i32) -> Option<usize> {\n    let mut low = 0;\n    let mut high = arr.len();\n    while low < high {\n        let mid = low + (high - low) / 2;\n        if arr[mid] == target { return Some(mid); }\n        else if arr[mid] < target { low = mid + 1; }\n        else { high = mid; }\n    }\n    None\n}\n```"
    },
    {
      text: "Why is quantum computing faster than classical computing?",
      category: "reasoning",
      modelName: "GPT-4o",
      badge: "GPT-4o",
      mockAnswer: "Quantum computers leverage superposition (representing 0 and 1 simultaneously) and entanglement (interdependence of qubits) to solve specific multi-variable mathematical algorithms exponentially faster than classical bits can compute sequentially."
    },
    {
      text: "Compose a short story about a lost space explorer",
      category: "creative",
      modelName: "Mistral Large",
      badge: "Mistral Large",
      mockAnswer: "Captain Alistair stared into the endless obsidian sea of the void. His telemetry was dead, but the soft hum of the nothric engine whispered that home was still somewhere ahead in the stars..."
    },
    {
      text: "Hi, how are you doing today?",
      category: "conversational",
      modelName: "Gemini 2.5 Flash",
      badge: "Gemini Flash",
      mockAnswer: "Hello! I am doing fantastic. How can I assist you with your developer workspaces or AI queries today?"
    }
  ];

  const [selectedPrompt, setSelectedPrompt] = useState<SamplePrompt | null>(null);
  const [routingStep, setRoutingStep] = useState<'idle' | 'classifying' | 'routed'>('idle');
  const [typedInput, setTypedInput] = useState('');

  const startRoutingSimulation = (prompt: SamplePrompt) => {
    setSelectedPrompt(prompt);
    setTypedInput(prompt.text);
    setRoutingStep('classifying');
  };

  useEffect(() => {
    if (routingStep === 'classifying') {
      const timer = setTimeout(() => {
        setRoutingStep('routed');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [routingStep]);

  const rawMarkdown = `# How Auto Nothric Works

Auto Nothric uses a fast llama-3.1-8b-instant model on Groq to instantly classify user inputs.

## The Routing Process
1. User prompt entered.
2. Fast classification query sent to Groq.
3. Category classified: code, reasoning, creative, or conversational.
4. Prompt dispatched to corresponding specialized model.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-ahw-layout">
      {/* Left: Main Content */}
      <div className="docs-ahw-container docs-ahw-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-ahw-category">Auto Nothric</div>

        {/* Main Heading */}
        <h1 className="docs-ahw-title">How It Works</h1>

        {/* Top Action Options bar */}
        <div className="docs-ahw-actions-bar">
          <button className="docs-ahw-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-ahw-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-ahw-actions-separator">|</span>
          <button className="docs-ahw-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-ahw-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-ahw-cta-row">
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-ahw-btn-primary"
          >
            Try Auto Nothric &gt;
          </a>
          <a 
            href="/docs/auto-overview" 
            onClick={(e) => handleLinkClick('/docs/auto-overview', e)}
            className="docs-ahw-btn-secondary"
          >
            Auto Nothric Overview <span className="docs-ahw-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-ahw-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-ahw-rendered-view">
            <p className="docs-ahw-lead">
              Auto Nothric uses a very fast AI model (Llama 3.1 8B) running on Groq. It reads your text prompt, instantly decides what kind of expert help you need, and forwards the prompt to the right AI.
            </p>

            {/* Interactive Simulation Sandbox */}
            <div className="docs-ahw-section-block" id="interactive-simulation">
              <h2 className="docs-ahw-section-heading">Interactive Routing Simulator</h2>
              <p className="docs-ahw-section-intro">
                Click a sample prompt below to see the Auto Nothric routing engine dispatch it in real-time:
              </p>

              {/* Sample prompt selection pills */}
              <div className="docs-ahw-pills">
                {samplePrompts.map((p, i) => (
                  <button 
                    key={i} 
                    className={`docs-ahw-pill-btn ${selectedPrompt?.text === p.text ? 'active' : ''}`}
                    onClick={() => startRoutingSimulation(p)}
                  >
                    {p.text}
                  </button>
                ))}
              </div>

              {/* Simulator Display Screen */}
              <div className="docs-ahw-sim-screen">
                {routingStep === 'idle' ? (
                  <div className="docs-ahw-sim-idle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Select a sample prompt above to trigger the routing simulation.</span>
                  </div>
                ) : (
                  <div className="docs-ahw-sim-active">
                    {/* User message (Right Aligned) */}
                    <div className="docs-ahw-chat-user-row">
                      <div className="docs-ahw-chat-bubble user-bubble">
                        {typedInput}
                      </div>
                    </div>

                    {/* AI Route & Response (Left Aligned) */}
                    <div className="docs-ahw-chat-ai-row">
                      <span className="docs-ahw-sim-label-route">
                        ROUTE TO:{' '}
                        {routingStep === 'classifying' ? (
                          <span className="docs-ahw-route-loading">Classifying prompt...</span>
                        ) : (
                          <span className="docs-ahw-route-model">{selectedPrompt?.modelName}</span>
                        )}
                      </span>

                      <div className="docs-ahw-chat-bubble ai-bubble">
                        {routingStep === 'classifying' ? (
                          <div className="docs-ahw-shimmer">
                            <div className="docs-ahw-shimmer-line"></div>
                            <div className="docs-ahw-shimmer-line"></div>
                            <div className="docs-ahw-shimmer-line short"></div>
                          </div>
                        ) : selectedPrompt?.category === 'code' ? (
                          <div className="docs-ahw-code-container">
                            <HighlightedRustCode />
                          </div>
                        ) : (
                          <p className="docs-ahw-chat-text">{selectedPrompt?.mockAnswer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Steps list */}
            <div className="docs-ahw-section-block" id="process-steps">
              <h2 className="docs-ahw-section-heading">How We Route Your Request</h2>
              <p className="docs-ahw-section-intro">
                Behind the scenes, Auto Nothric performs three simple steps:
              </p>

              <div className="docs-ahw-steps">
                <div className="docs-ahw-step-item">
                  <div className="docs-ahw-step-circle">1</div>
                  <div className="docs-ahw-step-info">
                    <h4 className="docs-ahw-step-heading">Analyze the Request</h4>
                    <p className="docs-ahw-step-desc">
                      The system reads your prompt to see what you are asking. If you attach an image or a PDF, we skip classification and send it directly to Gemini since it handles files best.
                    </p>
                  </div>
                </div>

                <div className="docs-ahw-step-item">
                  <div className="docs-ahw-step-circle">2</div>
                  <div className="docs-ahw-step-info">
                    <h4 className="docs-ahw-step-heading">Ultra-Fast LLM Routing Classifier</h4>
                    <p className="docs-ahw-step-desc">
                      We query an ultra-fast, lightweight classification model (Llama 3.1 8B running on Groq). In just a few milliseconds, it checks if your prompt is about coding, math/logic, writing/creative, or basic chat.
                    </p>
                  </div>
                </div>

                <div className="docs-ahw-step-item">
                  <div className="docs-ahw-step-circle">3</div>
                  <div className="docs-ahw-step-info">
                    <h4 className="docs-ahw-step-heading">Instant Model Dispatch</h4>
                    <p className="docs-ahw-step-desc">
                      Once categorized, your prompt is routed instantly to the expert model (Qwen Coder, GPT-4o, Mistral Large, or Gemini Flash). If there are any network failures, we fall back to Gemini Flash automatically so you always get a response.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Documentation footer list */}
            <div className="docs-ahw-related-section">
              <span className="docs-ahw-related-title">Related:</span>
              <a href="/docs/auto-overview" onClick={(e) => handleLinkClick('/docs/auto-overview', e)} className="docs-ahw-related-link-item">
                Auto Nothric Overview
              </a>
              <span className="docs-ahw-related-dot">•</span>
              <a href="/docs/Main_chat-features" onClick={(e) => handleLinkClick('/docs/Main_chat-features', e)} className="docs-ahw-related-link-item">
                Workspace Features
              </a>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-ahw-footer-divider"></div>
            <div className="docs-ahw-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-ahw-right-sidebar">
        <div className="docs-ahw-rt-section">
          <div className="docs-ahw-rt-header">
            <span>On this page</span>
            <svg className="docs-ahw-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-ahw-rt-links">
            <li>
              <a href="#interactive-simulation" className="docs-ahw-rt-link active">Interactive Simulator</a>
            </li>
            <li>
              <a href="#process-steps" className="docs-ahw-rt-link">Process Workflow</a>
            </li>
          </ul>
        </div>

        <div className="docs-ahw-rt-divider" />

        <div className="docs-ahw-rt-footer-actions">
          <button className="docs-ahw-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-ahw-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-ahw-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-ahw-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
