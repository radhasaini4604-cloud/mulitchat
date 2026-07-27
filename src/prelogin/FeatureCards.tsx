import { useState, useEffect, useRef } from 'react';
import Grainient from '../Main_chat/Grainient/Grainient';
import blackHoleImg from '../imagine/images/image copy 10.png';
import './FeatureCards.css';

interface FeatureCardsProps {
  activeFeature: 'chat' | 'imagine' | 'collab' | 'compare';
}

const TARGET_PROMPT = "Create a 7-day workout plan for beginners.";
const IMAGINE_TARGET_PROMPT = "A cinematic supermassive black hole in deep space, 8k";
export default function FeatureCards({ activeFeature }: FeatureCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Card 1: Chat States
  const [typedPrompt, setTypedPrompt] = useState('');
  const [chatPromptSubmitted, setChatPromptSubmitted] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // Card 2: Imagine States
  const [typedImaginePrompt, setTypedImaginePrompt] = useState('');
  const [imagineSubmitted, setImagineSubmitted] = useState('');
  const [isImagineTyping, setIsImagineTyping] = useState(false);
  const [imagineProgress, setImagineProgress] = useState(0);
  const [imagineDone, setImagineDone] = useState(false);

  // Card 3: Collab States
  const [typedCollabPrompt, setTypedCollabPrompt] = useState('');
  const [collabSubmittedPrompt, setCollabSubmittedPrompt] = useState('');
  const [isCollabTyping, setIsCollabTyping] = useState(false);
  const [showCollabB, setShowCollabB] = useState(false);
  const [isCollabBTyping, setIsCollabBTyping] = useState(false);
  const [showCollabAI, setShowCollabAI] = useState(false);
  const [isCollabAITyping, setIsCollabAITyping] = useState(false);
  const [collabAIAnswer, setCollabAIAnswer] = useState('');
  const [showCollabC, setShowCollabC] = useState(false);
  const [isCollabCTyping, setIsCollabCTyping] = useState(false);

  // Card 4: Search States
  const [typedSearchPrompt, setTypedSearchPrompt] = useState('');
  const [searchSubmittedPrompt, setSearchSubmittedPrompt] = useState('');
  const [isSearchTyping, setIsSearchTyping] = useState(false);
  const [showSearchThinking, setShowSearchThinking] = useState(false);
  const [searchAiResponse, setSearchAiResponse] = useState('');

  // Streaming answers states
  const [geminiAnswer, setGeminiAnswer] = useState('');
  const [gptAnswer, setGptAnswer] = useState('');
  const [deepseekAnswer, setDeepseekAnswer] = useState('');
  const [geminiStreamDone, setGeminiStreamDone] = useState(false);
  const [gptStreamDone, setGptStreamDone] = useState(false);
  const [deepseekStreamDone, setDeepseekStreamDone] = useState(false);

  const typingTimerRef = useRef<any>(null);
  const timeoutsRef = useRef<any[]>([]);
  const intervalsRef = useRef<any[]>([]);
  const collabScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll collab chat container
  useEffect(() => {
    if (collabScrollRef.current) {
      collabScrollRef.current.scrollTo({
        top: collabScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [collabAIAnswer, showCollabB, showCollabC, isCollabBTyping, isCollabCTyping, collabSubmittedPrompt]);

  const geminiText = "Here is your beginner routine:\n• Mon: Squats & core plank\n• Wed: Dumbbell chest press\n• Fri: Light cardio & recovery";
  const gptText = "Here is your weekly split:\n• Mon: Pushup & triceps\n• Wed: Pullups & rows\n• Fri: Dumbbell squats & rest";
  const deepseekText = "Here is your conditioning routine:\n• Day 1: Pushups & squats\n• Day 3: Dumbbell press\n• Day 5: Cardio & recovery";

  const clearAllTimers = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current = [];
    intervalsRef.current = [];
  };

  const addTimeout = (fn: () => void, delay: number) => {
    const timer = setTimeout(fn, delay);
    timeoutsRef.current.push(timer);
  };

  const addInterval = (fn: () => void, delay: number) => {
    const timer = setInterval(fn, delay);
    intervalsRef.current.push(timer);
    return timer;
  };

  const streamAnswers = () => {
    let geminiCurrent = '';
    const gInterval = addInterval(() => {
      if (geminiCurrent.length < geminiText.length) {
        geminiCurrent += geminiText.charAt(geminiCurrent.length);
        setGeminiAnswer(geminiCurrent);
      } else {
        clearInterval(gInterval);
        setGeminiStreamDone(true);
      }
    }, 3);

    let gptCurrent = '';
    const oInterval = addInterval(() => {
      if (gptCurrent.length < gptText.length) {
        gptCurrent += gptText.charAt(gptCurrent.length);
        setGptAnswer(gptCurrent);
      } else {
        clearInterval(oInterval);
        setGptStreamDone(true);
      }
    }, 4);

    let deepseekCurrent = '';
    const dInterval = addInterval(() => {
      if (deepseekCurrent.length < deepseekText.length) {
        deepseekCurrent += deepseekText.charAt(deepseekCurrent.length);
        setDeepseekAnswer(deepseekCurrent);
      } else {
        clearInterval(dInterval);
        setDeepseekStreamDone(true);
      }
    }, 4);
  };

  const renderFormattedAiText = (text: string) => {
    const codeIndicator = "import { handler } from './module';";
    if (text.includes(codeIndicator)) {
      const parts = text.split(codeIndicator);
      return (
        <span className="bubble-text" style={{ color: '#ffffff' }}>
          {parts[0]}
          <code className="collab-inline-code-box">{codeIndicator}</code>
          {parts[1]}
        </span>
      );
    }

    const lines = text.split('\n');
    return (
      <span className="bubble-text" style={{ display: 'block', color: '#ffffff' }}>
        {lines.map((line, idx) => {
          let cleanLine = line;
          let isBullet = false;
          if (line.startsWith('• ')) {
            cleanLine = line.slice(2);
            isBullet = true;
          }

          let content: React.ReactNode = cleanLine;

          if (cleanLine.includes('**')) {
            const parts = cleanLine.split('**');
            content = parts.map((part, pIdx) => {
              return pIdx % 2 === 1 ? <strong key={pIdx} style={{ color: '#ffffff', fontWeight: 'bold' }}>{part}</strong> : part;
            });
          }

          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} style={{ fontSize: '13px', fontWeight: '700', marginTop: '8px', marginBottom: '4px', color: '#ffffff', display: 'block' }}>
                {line.replace('### ', '')}
              </h3>
            );
          }
          if (line.startsWith('#### ')) {
            return (
              <h4 key={idx} style={{ fontSize: '12px', fontWeight: '600', marginTop: '6px', marginBottom: '2px', color: '#ffffff', display: 'block' }}>
                {line.replace('#### ', '')}
              </h4>
            );
          }
          if (isBullet) {
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', marginLeft: '4px', marginBottom: '3px', color: '#ffffff' }}>
                <span style={{ marginRight: '6px', color: '#ffffff' }}>•</span>
                <div style={{ color: '#ffffff' }}>{content}</div>
              </div>
            );
          }
          return <div key={idx} style={{ minHeight: line === '' ? '6px' : 'auto', marginBottom: '1px', color: '#ffffff' }}>{content}</div>;
        })}
      </span>
    );
  };

  // Declarative Typewriter Effects to completely eliminate interval race conditions and skipped first letters
  useEffect(() => {
    if (!isTyping) return;
    if (typedPrompt.length < TARGET_PROMPT.length) {
      const timer = setTimeout(() => {
        setTypedPrompt(TARGET_PROMPT.slice(0, typedPrompt.length + 1));
      }, 15);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      // Wait then submit using addTimeout helper
      addTimeout(() => {
        setChatPromptSubmitted(TARGET_PROMPT);
        setTypedPrompt('');
        setIsLoadingResults(true);
        setShowResults(true);

        // Fast 350ms loading shimmer
        addTimeout(() => {
          setIsLoadingResults(false);
          streamAnswers();
        }, 350);
      }, 200);
    }
  }, [isTyping, typedPrompt]);

  useEffect(() => {
    if (!isImagineTyping) return;
    if (typedImaginePrompt.length < IMAGINE_TARGET_PROMPT.length) {
      const timer = setTimeout(() => {
        setTypedImaginePrompt(IMAGINE_TARGET_PROMPT.slice(0, typedImaginePrompt.length + 1));
      }, 12);
      return () => clearTimeout(timer);
    } else {
      setIsImagineTyping(false);
      const timer = setTimeout(() => {
        setImagineSubmitted(IMAGINE_TARGET_PROMPT);

        // Fast progress fill from 0% to 100%
        let progressVal = 0;
        const progInterval = setInterval(() => {
          progressVal += 15;
          setImagineProgress(Math.min(100, progressVal));

          if (progressVal >= 100) {
            clearInterval(progInterval);
            const doneTimer = setTimeout(() => {
              setImagineDone(true);
            }, 50);
            timeoutsRef.current.push(doneTimer);
          }
        }, 25);
        intervalsRef.current.push(progInterval);
      }, 100);
      timeoutsRef.current.push(timer);
    }
  }, [isImagineTyping, typedImaginePrompt]);

  const COLLAB_PROMPT = "Hi! Today we have planned to start our new project, Nothric. What do you all think?";
  useEffect(() => {
    if (!isCollabTyping) return;
    if (typedCollabPrompt.length < COLLAB_PROMPT.length) {
      const timer = setTimeout(() => {
        setTypedCollabPrompt(COLLAB_PROMPT.slice(0, typedCollabPrompt.length + 1));
      }, 5);
      return () => clearTimeout(timer);
    } else {
      setIsCollabTyping(false);
      const timer = setTimeout(() => {
        setCollabSubmittedPrompt(COLLAB_PROMPT);
        setTypedCollabPrompt('');

        // Fast User B (Alex) typing
        const bTimer = setTimeout(() => {
          setIsCollabBTyping(true);

          const bDoneTimer = setTimeout(() => {
            setIsCollabBTyping(false);
            setShowCollabB(true);

            // Fast Gemini start
            const aiTimer = setTimeout(() => {
              setIsCollabAITyping(true);
              setShowCollabAI(true);

              const aiThinkTimer = setTimeout(() => {
                setIsCollabAITyping(false);

                const geminiCollabText = "### Recommended Stack for Nothric\n\nHere is a modern, collaborative tech stack to maximize efficiency:\n\n#### 1. Core Framework\n• **Next.js & React 19:** Ultra-fast routing, instant rendering.\n\n#### 2. Real-time Database\n• **Supabase:** Postgres engine with live WebSocket syncing.\n\n#### 3. AI Capabilities\n• **Vercel AI SDK:** For running Gemini & Claude models side-by-side.\n\n#### 4. Shared Canvas\n• **Liveblocks:** Interactive document & whiteboard collaboration.\n\nThis stack ensures ultra-low latency, clean architecture, and instant multi-user synchronization. Let me know if you would like to explore or customize any of these choices!";
                let geminiCurrent = '';
                const geminiInterval = setInterval(() => {
                  if (geminiCurrent.length < geminiCollabText.length) {
                    geminiCurrent += geminiCollabText.charAt(geminiCurrent.length);
                    setCollabAIAnswer(geminiCurrent);
                  } else {
                    clearInterval(geminiInterval);

                    const cTimer = setTimeout(() => {
                      setIsCollabCTyping(true);

                      const cDoneTimer = setTimeout(() => {
                        setIsCollabCTyping(false);
                        setShowCollabC(true);
                      }, 100);
                      timeoutsRef.current.push(cDoneTimer);
                    }, 80);
                    timeoutsRef.current.push(cTimer);
                  }
                }, 1);
                intervalsRef.current.push(geminiInterval);
              }, 100);
              timeoutsRef.current.push(aiThinkTimer);
            }, 80);
            timeoutsRef.current.push(aiTimer);
          }, 100);
          timeoutsRef.current.push(bDoneTimer);
        }, 80);
        timeoutsRef.current.push(bTimer);
      }, 80);
      timeoutsRef.current.push(timer);
    }
  }, [isCollabTyping, typedCollabPrompt]);

  const SEARCH_PROMPT = "Compare quarterly AI model performance trends 2026";
  useEffect(() => {
    if (!isSearchTyping) return;
    if (typedSearchPrompt.length < SEARCH_PROMPT.length) {
      const timer = setTimeout(() => {
        setTypedSearchPrompt(SEARCH_PROMPT.slice(0, typedSearchPrompt.length + 1));
      }, 12);
      return () => clearTimeout(timer);
    } else {
      setIsSearchTyping(false);
      const timer = setTimeout(() => {
        setSearchSubmittedPrompt(SEARCH_PROMPT);
        setTypedSearchPrompt('');

        // Show thinking indicator
        setShowSearchThinking(true);
        setSearchAiResponse('');

        const thinkingTimer = setTimeout(() => {
          setShowSearchThinking(false);

          const aiResponseText = "Based on synthesized data across 4 primary developer benchmark sources, here is the comparative analysis for Q1 2026 coding models:\n\n• Gemini 2.5 Pro continues to lead at 98.5% coding accuracy, showing exceptional multi-step reasoning capabilities.\n• DeepSeek V3 ranks second at 97.1%, demonstrating high cost-efficiency and coding logic generation.\n• Claude 3.5 Sonnet (96.8%) and GPT-4o (94.2%) show strong syntax correctness but minor logic gaps in complex structures.\n\nOverall, the trend indicates a shifting preference towards Gemini for enterprise orchestration and DeepSeek for high-volume pipelines.";
          let currentText = '';
          const streamInterval = setInterval(() => {
            if (currentText.length < aiResponseText.length) {
              currentText += aiResponseText.charAt(currentText.length);
              setSearchAiResponse(currentText);
            } else {
              clearInterval(streamInterval);
            }
          }, 2);
          intervalsRef.current.push(streamInterval);
        }, 800); // Fast 800ms thinking time
        timeoutsRef.current.push(thinkingTimer);
      }, 200);
      timeoutsRef.current.push(timer);
    }
  }, [isSearchTyping, typedSearchPrompt]);

  // Reset and restart the typewriter sequences
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

  const startImagineSequence = () => {
    clearAllTimers();
    setTypedImaginePrompt('');
    setImagineSubmitted('');
    setImagineProgress(0);
    setImagineDone(false);
    setIsImagineTyping(true);
  };

  const startCollabSequence = () => {
    clearAllTimers();
    setTypedCollabPrompt('');
    setCollabSubmittedPrompt('');
    setIsCollabTyping(true);
    setShowCollabB(false);
    setIsCollabBTyping(false);
    setShowCollabAI(false);
    setIsCollabAITyping(false);
    setCollabAIAnswer('');
    setShowCollabC(false);
    setIsCollabCTyping(false);
  };

  const startSearchSequence = () => {
    clearAllTimers();
    setTypedSearchPrompt('');
    setSearchSubmittedPrompt('');
    setIsSearchTyping(true);
    setShowSearchThinking(false);
    setSearchAiResponse('');
  };

  useEffect(() => {
    if (activeFeature === 'chat') {
      startTypewriterSequence();
    } else if (activeFeature === 'imagine') {
      startImagineSequence();
    } else if (activeFeature === 'collab') {
      startCollabSequence();
    } else if (activeFeature === 'compare') {
      startSearchSequence();
    }
    return () => {
      clearAllTimers();
    };
  }, [activeFeature]);

  // Render Card 1 (Chat)
  if (activeFeature === 'chat') {
    return (
      <div className="feature-cards-container" ref={containerRef}>
        <div className="mockup-chat-container">
          {/* 3 Columns Arena */}
          {showResults && (
            <div className="chat-columns-wrapper">
              {/* Gemini Column */}
              <div className="chat-column gemini">
                <div className="model-name-label">Gemini Pro</div>
                <div className="col-body">
                  {isLoadingResults ? (
                    <div className="shimmer-loader">
                      <div className="shimmer-line"></div>
                      <div className="shimmer-line"></div>
                      <div className="shimmer-line short"></div>
                    </div>
                  ) : (
                    <>
                      <div className="col-message-text">
                        <p>{geminiAnswer}</p>
                      </div>
                      {geminiStreamDone && (
                        <div className="col-message-toolbar animate-fade-in">
                          <button className="toolbar-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                          </button>
                          <button className="toolbar-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                          </button>
                          <button className="toolbar-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* GPT Column */}
              <div className="chat-column gpt">
                <div className="model-name-label">GPT-4o</div>
                <div className="col-body">
                  {isLoadingResults ? (
                    <div className="shimmer-loader">
                      <div className="shimmer-line"></div>
                      <div className="shimmer-line"></div>
                      <div className="shimmer-line short"></div>
                    </div>
                  ) : (
                    <>
                      <div className="col-message-text">
                        <p>{gptAnswer}</p>
                      </div>
                      {gptStreamDone && (
                        <div className="col-message-toolbar animate-fade-in">
                          <button className="toolbar-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                          </button>
                          <button className="toolbar-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                          </button>
                          <button className="toolbar-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* DeepSeek Column */}
              <div className="chat-column deepseek">
                <div className="model-name-label">DeepSeek V3</div>
                <div className="col-body">
                  {isLoadingResults ? (
                    <div className="shimmer-loader">
                      <div className="shimmer-line"></div>
                      <div className="shimmer-line"></div>
                      <div className="shimmer-line short"></div>
                    </div>
                  ) : (
                    <>
                      <div className="col-message-text">
                        <p>{deepseekAnswer}</p>
                      </div>
                      {deepseekStreamDone && (
                        <div className="col-message-toolbar animate-fade-in">
                          <button className="toolbar-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                          </button>
                          <button className="toolbar-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                          </button>
                          <button className="toolbar-btn" disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Real Nothric-style Input Pill */}
          <div className="nothric-input-card">
            <div className="input-left-actions">
              <button className="input-circle-btn" disabled>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
            <div className="nothric-input-text-wrapper">
              <div className="nothric-input-text">
                {chatPromptSubmitted ? '' : typedPrompt}
                {isTyping && <span className="typewriter-cursor"></span>}
              </div>
            </div>
            <div className="input-right-actions">
              <button className="input-circle-btn mic-btn" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
              </button>
              <button className={`nothric-send-btn ${chatPromptSubmitted ? 'active' : ''}`} disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cards 2, 3, 4 fallback placeholders
  return (
    <div className="feature-cards-container" ref={containerRef}>
      {activeFeature === 'imagine' && (
        <div className="mockup-chat-container">
          {/* Chat flow containing message bubbles and subcard */}
          <div className="imagine-chat-flow-wrapper">
            {imagineSubmitted && (
              <div className="imagine-chat-bubble user animate-fade-in">
                <span className="avatar-u">U</span>
                <div className="bubble-content">
                  <span className="bubble-text">{imagineSubmitted}</span>
                </div>
              </div>
            )}

            {imagineSubmitted ? (
              <div className="imagine-subcard-container">
                {!imagineDone ? (
                  <div className="imagine-generating-subcard">
                    <Grainient className="imagine-grainient" />
                    <div className="imagine-generating-overlay">
                      <div className="imagine-spinner"></div>
                      <span className="engine-label">Nemotron Image Engine v2</span>
                      <span className="progress-label">Generating... {imagineProgress}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="imagine-result-subcard animate-fade-in">
                    <img src={blackHoleImg} alt="Generated Cosmic Black Hole" className="imagine-result-image" />
                    <div className="imagine-result-badge">Flux dev</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="imagine-empty-state">
                <span className="imagine-empty-text">Enter prompt to imagine...</span>
              </div>
            )}
          </div>

          {/* Real Nothric-style Input Pill */}
          <div className="nothric-input-card">
            <div className="input-left-actions">
              <button className="input-circle-btn" disabled>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
            <div className="nothric-input-text-wrapper">
              <div className="nothric-input-text">
                {imagineSubmitted ? '' : typedImaginePrompt}
                {isImagineTyping && <span className="typewriter-cursor"></span>}
              </div>
            </div>
            <div className="input-right-actions">
              <button className="input-circle-btn mic-btn" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
              </button>
              <button className={`nothric-send-btn ${imagineSubmitted ? 'active' : ''}`} disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeFeature === 'collab' && (
        <div className="mockup-chat-container">
          {/* Group Chat Thread */}
          <div className="collab-chat-flow-wrapper" ref={collabScrollRef}>
            {/* User A's message (Local user, Right side, Grey bubble) */}
            {collabSubmittedPrompt && (
              <div className="collab-bubble-row user-row animate-fade-in">
                <div className="collab-bubble user-bubble grey-bubble">
                  <span className="bubble-text">{collabSubmittedPrompt}</span>
                </div>
                <span className="avatar-u collab-avatar">U</span>
              </div>
            )}

            {/* User B's typing indicator (Alex, Left side) */}
            {isCollabBTyping && (
              <div className="collab-bubble-row collab-other-row animate-fade-in">
                <span className="avatar-other collab-avatar">A</span>
                <div className="collab-bubble other-bubble white-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {/* User B's message (Alex, Left side, White bubble) */}
            {showCollabB && (
              <div className="collab-bubble-row collab-other-row animate-fade-in">
                <span className="avatar-other collab-avatar">A</span>
                <div className="collab-bubble other-bubble white-bubble">
                  <span className="bubble-text">Yes, so let's decide on the tools we're going to use. Gemini, what options do we have?</span>
                </div>
              </div>
            )}

            {/* Gemini's typing or streaming (AI, Left side, Direct text block) */}
            {showCollabAI && (
              <div className="collab-bubble-row collab-ai-row animate-fade-in">
                <span className="avatar-ai collab-avatar">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <defs>
                      <linearGradient id="gemini-official-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a73e8" />
                        <stop offset="35%" stopColor="#8ab4f8" />
                        <stop offset="70%" stopColor="#c58af9" />
                        <stop offset="100%" stopColor="#e879f9" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#gemini-official-grad)" d="M12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24Z" />
                  </svg>
                </span>
                <div className="collab-ai-direct-text">
                  {isCollabAITyping ? (
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    renderFormattedAiText(collabAIAnswer)
                  )}
                </div>
              </div>
            )}

            {/* User C's typing indicator (Sarah, Left side) */}
            {isCollabCTyping && (
              <div className="collab-bubble-row collab-other-row animate-fade-in">
                <span className="avatar-sarah collab-avatar">S</span>
                <div className="collab-bubble other-bubble white-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            {/* User C's message (Sarah, Left side, White bubble) */}
            {showCollabC && (
              <div className="collab-bubble-row collab-other-row animate-fade-in">
                <span className="avatar-sarah collab-avatar">S</span>
                <div className="collab-bubble other-bubble white-bubble">
                  <span className="bubble-text">I think the tool list is great, we should consider it. Let's start the UI process!</span>
                </div>
              </div>
            )}
          </div>

          {/* Real Nothric-style Input Pill */}
          <div className="nothric-input-card">
            <div className="input-left-actions">
              <button className="input-circle-btn" disabled>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
            <div className="nothric-input-text-wrapper">
              <div className="nothric-input-text">
                {collabSubmittedPrompt ? '' : typedCollabPrompt}
                {isCollabTyping && <span className="typewriter-cursor"></span>}
              </div>
            </div>
            <div className="input-right-actions">
              <button className="input-circle-btn mic-btn" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
              </button>
              <button className={`nothric-send-btn ${collabSubmittedPrompt ? 'active' : ''}`} disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeFeature === 'compare' && (
        <div className="mockup-chat-container">
          {/* Deep Search Thread */}
          <div className="search-flow-wrapper">
            {!searchSubmittedPrompt ? null : (
              <div className="search-active-content">
                {/* User Search Query Bubble */}
                <div className="search-user-bubble-row user-row animate-fade-in">
                  <div className="search-user-bubble user-bubble grey-bubble">
                    <span className="bubble-text">{searchSubmittedPrompt}</span>
                  </div>
                  <span className="avatar-u search-avatar-u">U</span>
                </div>

                {/* Thinking Indicator */}
                {showSearchThinking && (
                  <div className="agents-thinking-container animate-fade-in">
                    <div className="thinking-circles">
                      <div className="thinking-circle circle-1">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="url(#gemini-grad)">
                          <defs>
                            <linearGradient id="gemini-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#9b72cb" />
                              <stop offset="50%" stopColor="#d96570" stopOpacity="0.9" />
                              <stop offset="100%" stopColor="#5ea3ec" />
                            </linearGradient>
                          </defs>
                          <path d="M12,2 C12,7.5 16.5,12 22,12 C16.5,12 12,16.5 12,22 C12,16.5 7.5,12 2,12 C7.5,12 12,7.5 12,2 Z" />
                        </svg>
                      </div>
                      <div className="thinking-circle circle-2">
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round">
                          <line x1="18" y1="4" x2="6" y2="20" />
                        </svg>
                      </div>
                      <div className="thinking-circle circle-3">
                        <svg viewBox="0 0 24 24" width="13" height="13">
                          <circle cx="12" cy="12" r="10" fill="#ffd21e" />
                          <circle cx="9.5" cy="10.5" r="1.2" fill="#4a3b00" />
                          <circle cx="14.5" cy="10.5" r="1.2" fill="#4a3b00" />
                          <path d="M9,14 Q12,17 15,14" fill="none" stroke="#4a3b00" strokeWidth="1" strokeLinecap="round" />
                          <path d="M4,15 Q6,12.5 8,14" fill="none" stroke="#4a3b00" strokeWidth="1" strokeLinecap="round" />
                          <path d="M20,15 Q18,12.5 16,14" fill="none" stroke="#4a3b00" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="thinking-circle circle-4">
                        <svg viewBox="0 0 24 24" width="11" height="11" fill="#ffffff" style={{ marginLeft: '1.5px' }}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <span className="thinking-badge">+12</span>
                    <span className="thinking-text">search the web &bull; 3s</span>
                  </div>
                )}

                {/* AI Response in Normal Text */}
                {searchAiResponse && (
                  <div className="search-ai-response-direct animate-fade-in">
                    <div className="search-ai-text">
                      {searchAiResponse}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Real Nothric-style Input Pill */}
          <div className="nothric-input-card">
            <div className="input-left-actions">
              <button className="input-circle-btn" disabled>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
            <div className="nothric-input-text-wrapper">
              <div className="nothric-input-text">
                {searchSubmittedPrompt ? '' : typedSearchPrompt}
                {isSearchTyping && <span className="typewriter-cursor"></span>}
              </div>
            </div>
            <div className="input-right-actions">
              <button className="input-circle-btn mic-btn" disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
              </button>
              <button className={`nothric-send-btn ${searchSubmittedPrompt ? 'active' : ''}`} disabled>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
