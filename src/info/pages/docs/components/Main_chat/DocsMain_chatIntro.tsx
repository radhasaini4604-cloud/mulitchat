import React, { useState, useEffect, useRef } from 'react';
import './DocsMain_chatIntro.css';

interface DocsMain_chatIntroProps {
  onNavigate: (path: string) => void;
}

export const DocsMain_chatIntro: React.FC<DocsMain_chatIntroProps> = ({ onNavigate }) => {
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(path);
  };

  // Mockup Chat Simulation States
  const [typedPrompt, setTypedPrompt] = useState('');
  const [chatPromptSubmitted, setChatPromptSubmitted] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const [geminiAnswer, setGeminiAnswer] = useState('');
  const [gptAnswer, setGptAnswer] = useState('');
  const [deepseekAnswer, setDeepseekAnswer] = useState('');
  const [geminiStreamDone, setGeminiStreamDone] = useState(false);
  const [gptStreamDone, setGptStreamDone] = useState(false);
  const [deepseekStreamDone, setDeepseekStreamDone] = useState(false);

  const timeoutsRef = useRef<any[]>([]);
  const intervalsRef = useRef<any[]>([]);

  const TARGET_PROMPT = "Create a 7-day workout plan for beginners.";
  const geminiText = "let's make plan: 💪\nHere is your beginner routine:\n• Mon: Squats, pushups & core plank (3 sets).\n• Tue: 35 mins light cardio 🏃🏻 (brisk walk).\n• Wed: Dumbbell chest press & rows (3 sets).\n• Thu: Dynamic mobility stretching routine.\n• Fri: Pullups, glute bridges, and side planks.\n• Weekend: Complete rest and recovery.";
  const gptText = "great ,here is plan 🧠\nHere is your weekly split:\n• Mon (Push): Chest press & triceps.\n• Tue (Cardio): 30 mins steady jogging.\n• Wed (Pull): Pullups & dumbbell rows.\n• Thu (Rest): Mobility yoga flow.\n• Fri (Legs): Dumbbell squats & lunges.\n• Weekend: Rest for nervous recovery. this is final plan 😊";
  const deepseekText = "hi 😄 here is your plan \nHere is your conditioning routine:\n• Day 1 (Full): Pushups , squats & plank.\n• Day 2 (HIIT): 20 mins cycling sprints.\n• Day 3 (Upper): Dumbbell press & chin-ups.\n• Day 4 (Lower): Lunges & kettlebell swings.\n• Day 5 (Cardio): 40 mins steady power walk.\n• Weekend: Complete muscle recovery.";

  const clearAllTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current = [];
    intervalsRef.current = [];
  };

  const streamAnswers = () => {
    let geminiCurrent = '';
    const gInterval = setInterval(() => {
      if (geminiCurrent.length < geminiText.length) {
        geminiCurrent += geminiText.charAt(geminiCurrent.length);
        setGeminiAnswer(geminiCurrent);
      } else {
        clearInterval(gInterval);
        setGeminiStreamDone(true);
      }
    }, 12);
    intervalsRef.current.push(gInterval);

    let gptCurrent = '';
    const oInterval = setInterval(() => {
      if (gptCurrent.length < gptText.length) {
        gptCurrent += gptText.charAt(gptCurrent.length);
        setGptAnswer(gptCurrent);
      } else {
        clearInterval(oInterval);
        setGptStreamDone(true);
      }
    }, 15);
    intervalsRef.current.push(oInterval);

    let deepseekCurrent = '';
    const dInterval = setInterval(() => {
      if (deepseekCurrent.length < deepseekText.length) {
        deepseekCurrent += deepseekText.charAt(deepseekCurrent.length);
        setDeepseekAnswer(deepseekCurrent);
      } else {
        clearInterval(dInterval);
        setDeepseekStreamDone(true);
      }
    }, 14);
    intervalsRef.current.push(dInterval);
  };

  const startTypewriterSequence = () => {
    clearAllTimers();
    setTypedPrompt('');
    setChatPromptSubmitted('');
    setShowResults(false);
    setIsLoadingResults(false);
    setGeminiAnswer('');
    setGptAnswer('');
    setDeepseekAnswer('');
    setGeminiStreamDone(false);
    setGptStreamDone(false);
    setDeepseekStreamDone(false);
    setIsTyping(true);
  };

  useEffect(() => {
    if (!isTyping) return;
    if (typedPrompt.length < TARGET_PROMPT.length) {
      const timer = setTimeout(() => {
        setTypedPrompt(TARGET_PROMPT.slice(0, typedPrompt.length + 1));
      }, 45);
      timeoutsRef.current.push(timer);
    } else {
      setIsTyping(false);
      const submitTimer = setTimeout(() => {
        setChatPromptSubmitted(TARGET_PROMPT);
        setTypedPrompt('');
        setIsLoadingResults(true);
        setShowResults(true);

        const loadTimer = setTimeout(() => {
          setIsLoadingResults(false);
          streamAnswers();
        }, 1200);
        timeoutsRef.current.push(loadTimer);
      }, 800);
      timeoutsRef.current.push(submitTimer);
    }
  }, [isTyping, typedPrompt]);

  useEffect(() => {
    const loopInterval = setInterval(() => {
      startTypewriterSequence();
    }, 15000);
    return () => {
      clearAllTimers();
      clearInterval(loopInterval);
    };
  }, []);

  const rawMarkdown = `# Introduction to Main_chat Chat

Main_chat Chat is Nothric's flagship real-time comparison workspace, enabling side-by-side interactions with leading frontier and open-weights models.

## Core Pillars
1. Consensus Routing: Directs prompts to the most capable model dynamically.
2. Side-by-Side Comparison: View and compare stream metrics concurrently.
3. Client-Side Compile: Secure code execution in your local browser sandbox.`;

  const handleCopyForLLM = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="docs-p-layout">
      {/* Left: Main Content */}
      <div className="docs-p-container docs-p-main-content">
        {/* Breadcrumb Category */}
        <div className="docs-p-category">Main_chat Chat</div>

        {/* Main Heading */}
        <h1 className="docs-p-title">Introduction</h1>

        {/* Top Action Options bar */}
        <div className="docs-p-actions-bar">
          <button className="docs-p-action-link" onClick={handleCopyForLLM}>
            <svg className="docs-p-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <span className="docs-p-actions-separator">|</span>
          <button className="docs-p-action-link" onClick={() => setShowMarkdown(!showMarkdown)}>
            <svg className="docs-p-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="docs-p-cta-row">
          <a 
            href="/api-guide" 
            onClick={(e) => handleLinkClick('/api-guide', e)}
            className="docs-p-btn-primary"
          >
            Manage API keys &gt;
          </a>
          <a 
            href="/Main_chat" 
            onClick={(e) => handleLinkClick('/Main_chat', e)}
            className="docs-p-btn-secondary"
          >
            Meet Main_chat Chat <span className="docs-p-btn-arrow">↗</span>
          </a>
        </div>

        {showMarkdown ? (
          <div className="docs-p-markdown-view">
            <pre>{rawMarkdown}</pre>
          </div>
        ) : (
          <div className="docs-p-rendered-view">
            <p className="docs-p-lead">
              Welcome to Main_chat Chat! Main_chat Chat is Nothric's flagship playground and development workspace. It allows you to query multiple language models simultaneously, observe consensus logic, compile code sandbox scripts in real-time, and compare performance directly.
            </p>

            {/* Interactive Simulation Card */}
            <div className="docs-p-section-block" id="interactive-demo">
              <h2 className="docs-p-section-heading">Interactive Comparison Demo</h2>
              <p className="docs-p-section-intro">
                See our consensus routing engine query Gemini, GPT, and DeepSeek side-by-side in real-time:
              </p>

              <div className="docs-p-mockup-wrapper">
                <div className="docs-p-mockup-chat">
                  {showResults && (
                    <div className="docs-p-columns">
                      {/* Gemini */}
                      <div className="docs-p-col gemini">
                        <div className="docs-p-col-label">Gemini Pro</div>
                        <div className="docs-p-col-body">
                          {isLoadingResults ? (
                            <div className="docs-p-shimmer">
                              <div className="docs-p-shimmer-line"></div>
                              <div className="docs-p-shimmer-line"></div>
                              <div className="docs-p-shimmer-line short"></div>
                            </div>
                          ) : (
                            <>
                              <div className="docs-p-col-msg">{geminiAnswer}</div>
                              {geminiStreamDone && (
                                <div className="docs-p-col-toolbar">
                                  <span className="docs-p-tool-dot"></span>
                                  <span className="docs-p-tool-dot"></span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* GPT */}
                      <div className="docs-p-col gpt">
                        <div className="docs-p-col-label">GPT-4o</div>
                        <div className="docs-p-col-body">
                          {isLoadingResults ? (
                            <div className="docs-p-shimmer">
                              <div className="docs-p-shimmer-line"></div>
                              <div className="docs-p-shimmer-line"></div>
                              <div className="docs-p-shimmer-line short"></div>
                            </div>
                          ) : (
                            <>
                              <div className="docs-p-col-msg">{gptAnswer}</div>
                              {gptStreamDone && (
                                <div className="docs-p-col-toolbar">
                                  <span className="docs-p-tool-dot"></span>
                                  <span className="docs-p-tool-dot"></span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* DeepSeek */}
                      <div className="docs-p-col deepseek">
                        <div className="docs-p-col-label">DeepSeek V3</div>
                        <div className="docs-p-col-body">
                          {isLoadingResults ? (
                            <div className="docs-p-shimmer">
                              <div className="docs-p-shimmer-line"></div>
                              <div className="docs-p-shimmer-line"></div>
                              <div className="docs-p-shimmer-line short"></div>
                            </div>
                          ) : (
                            <>
                              <div className="docs-p-col-msg">{deepseekAnswer}</div>
                              {deepseekStreamDone && (
                                <div className="docs-p-col-toolbar">
                                  <span className="docs-p-tool-dot"></span>
                                  <span className="docs-p-tool-dot"></span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Input Pill */}
                  <div className="docs-p-input-pill">
                    <div className="docs-p-input-left">
                      <div className="docs-p-circle-btn">+</div>
                    </div>
                    <div className="docs-p-input-text-area">
                      <div className="docs-p-input-text">
                        {chatPromptSubmitted ? chatPromptSubmitted : typedPrompt}
                        {isTyping && <span className="docs-p-cursor"></span>}
                      </div>
                    </div>
                    <div className="docs-p-input-right">
                      <div className="docs-p-circle-btn mic-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                      </div>
                      <div className={`docs-p-send-btn ${chatPromptSubmitted ? 'active' : ''}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Pillars */}
            <div className="docs-p-section-block" id="core-pillars">
              <h2 className="docs-p-section-heading">Core Pillars of Main_chat Chat</h2>
              <p className="docs-p-section-intro">
                Designed for speed, clarity, and client-side efficiency, Main_chat is built around three foundational pillars:
              </p>
              
              <div className="docs-p-pillars-grid">
                <div className="docs-p-pillar-card">
                  <span className="docs-p-pillar-name">Consensus Routing</span>
                  <p className="docs-p-pillar-desc">
                    Dynamically analyzes user intent to dispatch prompts across optimal model pairings, cross-verifying outputs to ensure factual reasoning consistency.
                  </p>
                </div>

                <div className="docs-p-pillar-card">
                  <span className="docs-p-pillar-name">Side-by-Side Comparison</span>
                  <p className="docs-p-pillar-desc">
                    Observe generation latency, tokens-per-second, and model personas simultaneously. Compare frontier systems and open source options on a single canvas.
                  </p>
                </div>

                <div className="docs-p-pillar-card">
                  <span className="docs-p-pillar-name">Client-Side Compilation</span>
                  <p className="docs-p-pillar-desc">
                    Run logic sandbox compiled routines locally in your browser. Edit, run, and render scripts without routing any workspace computations through server relays.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Documentation footer list */}
            <div className="docs-p-related-section">
              <span className="docs-p-related-title">Related:</span>
              <a href="/features" onClick={(e) => handleLinkClick('/features', e)} className="docs-p-related-link-item">
                Workspace Features
              </a>
              <span className="docs-p-related-dot">•</span>
              <a href="/limitations" onClick={(e) => handleLinkClick('/limitations', e)} className="docs-p-related-link-item">
                Current Limitations
              </a>
            </div>

            {/* Bottom Last Updated Section */}
            <div className="docs-p-footer-divider"></div>
            <div className="docs-p-last-updated">
              Last updated: 17 July 2026
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Table of Contents */}
      <aside className="docs-p-right-sidebar">
        <div className="docs-p-rt-section">
          <div className="docs-p-rt-header">
            <span>On this page</span>
            <svg className="docs-p-rt-list-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>

          <ul className="docs-p-rt-links">
            <li>
              <a href="#interactive-demo" className="docs-p-rt-link active">Interactive Demo</a>
            </li>
            <li>
              <a href="#core-pillars" className="docs-p-rt-link">Core Pillars</a>
            </li>
            <li className="docs-p-rt-subitem">
              <a href="#resources" className="docs-p-rt-link">Resources</a>
            </li>
          </ul>
        </div>

        <div className="docs-p-rt-divider" />

        <div className="docs-p-rt-footer-actions">
          <button className="docs-p-rt-action-btn" onClick={handleCopyForLLM}>
            <svg className="docs-p-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy for LLM'}
          </button>
          <button className="docs-p-rt-action-btn" onClick={() => window.open('mailto:feedback@nothric.ai')}>
            <svg className="docs-p-rt-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Share feedback
          </button>
        </div>
      </aside>
    </div>
  );
};
