import { useEffect, useState, useRef } from 'react';
import { parseMarkdown, parseThinkingText } from '../utils/markdownParser';
import '../ModelColumn/MessageItem.css';

interface StreamingRendererProps {
  text: string;
  isCompleted: boolean;
  onComplete: () => void;
  onTextUpdate?: () => void;
  processingType?: 'pdf' | 'image' | 'file' | 'text';
  isSearching?: boolean;
  searchQuery?: string;
  hidePlaceholderStatus?: boolean;
}

export function StreamingRenderer({ 
  text, 
  isCompleted, 
  onComplete, 
  onTextUpdate, 
  processingType,
  isSearching,
  searchQuery,
  hidePlaceholderStatus
}: StreamingRendererProps) {
  const [visibleText, setVisibleText] = useState('');
  const [statusIndex, setStatusIndex] = useState(0);
  const [isThinkingExpanded, setIsThinkingExpanded] = useState(true);
  const targetTextRef = useRef(text === 'Thinking...' ? '' : text);
  const visibleTextRef = useRef('');
  const prevFinishedThinkingRef = useRef(false);

  // Sync prop text to ref
  useEffect(() => {
    targetTextRef.current = text === 'Thinking...' ? '' : text;
  }, [text]);

  // Define dynamic status steps
  const pdfStatuses = [
    "Reading PDF layout...",
    "Extracting page text...",
    "Analyzing document tables...",
    "Cross-referencing sections...",
    "Synthesizing response..."
  ];

  const imageStatuses = [
    "Processing image pixels...",
    "Analyzing visual layout...",
    "Detecting text & details...",
    "Synthesizing description..."
  ];

  const fileStatuses = [
    "Reading file data...",
    "Analyzing code structure...",
    "Evaluating logic flow...",
    "Synthesizing explanation..."
  ];

  const textStatuses = [
    "Thinking",
    "Processing query",
    "Formulating response",
    "Generating output"
  ];

  const activeStatuses = processingType === 'pdf' ? pdfStatuses :
                         processingType === 'image' ? imageStatuses :
                         processingType === 'file' ? fileStatuses :
                         textStatuses;

  // Cycle status texts every 1.5 seconds while waiting for the stream
  useEffect(() => {
    if (visibleText !== '') return;

    const interval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % activeStatuses.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [visibleText, activeStatuses.length]);

  const { thinking, response: responseText, isStillThinking } = parseThinkingText(visibleText);

  // Auto-collapse thinking process once it finishes thinking and starts response output
  useEffect(() => {
    if (!isStillThinking && thinking && !prevFinishedThinkingRef.current) {
      setIsThinkingExpanded(false);
      prevFinishedThinkingRef.current = true;
    }
  }, [isStillThinking, thinking]);

  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const target = targetTextRef.current;
      const current = visibleTextRef.current;

      if (current.length < target.length) {
        const diff = target.length - current.length;

        // Controlled delay per character based on the diff backlog size
        let delay = 40; // default delay in ms per character (about 25 chars/sec)
        if (diff > 120) {
          delay = 3;   // catch up speed for big chunks
        } else if (diff > 60) {
          delay = 8;
        } else if (diff > 25) {
          delay = 15;
        }

        const elapsed = now - lastTime;
        if (elapsed >= delay) {
          // Cap characters added to 1 character when diff is small for a strict letter-by-letter feel
          const maxChars = diff > 45 ? 6 : 1;
          const charsToAdd = Math.min(maxChars, Math.max(1, Math.floor(elapsed / delay)));
          const nextText = target.slice(0, current.length + charsToAdd);
          visibleTextRef.current = nextText;
          setVisibleText(nextText);
          lastTime = now;

          if (onTextUpdate) {
            onTextUpdate();
          }
        }
      } else if (isCompleted) {
        // Complete typewriter transition cleanly
        onComplete();
        return; // Halt loop
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isCompleted, onComplete, onTextUpdate]);

  if (isSearching) {
    return (
      <div className="web-search-loading-container">
        <div className="search-spinner-wrapper">
          <div className="circular-spinner">
            <svg className="globe-spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <div className="spinning-ring"></div>
          </div>
        </div>
        <div className="search-loading-text">
          <span>Searching the web</span>
          {searchQuery && <span className="search-query-tag">"{searchQuery}"</span>}
        </div>
      </div>
    );
  }

  if (visibleText === '') {
    if (hidePlaceholderStatus) {
      return null;
    }
    const currentStatus = activeStatuses[statusIndex] || "Thinking";
    return (
      <div className="typing-indicator-container">
        <span>{currentStatus}</span>
        <div className="typing-dots">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    );
  }

  if (thinking) {
    return (
      <div className="message-response-container">
        <div className="thinking-process-block" style={{ marginBottom: '14px', marginTop: '4px' }}>
          <button
            onClick={() => setIsThinkingExpanded(!isThinkingExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.85rem',
              cursor: 'pointer',
              padding: '2px 0',
              fontWeight: 500,
              outline: 'none',
              userSelect: 'none',
              opacity: 0.85,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
          >
            {isStillThinking ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Thinking...
                <span className="typing-dots" style={{ display: 'inline-flex', gap: '2px' }}>
                  <span className="typing-dot" style={{ width: '4px', height: '4px', margin: 0 }}></span>
                  <span className="typing-dot" style={{ width: '4px', height: '4px', margin: 0 }}></span>
                  <span className="typing-dot" style={{ width: '4px', height: '4px', margin: 0 }}></span>
                </span>
              </span>
            ) : (
              <span>Thought process</span>
            )}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isThinkingExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease',
                color: '#64748b'
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {isThinkingExpanded && (
            <div
              style={{
                marginTop: '10px',
                paddingLeft: '14px',
                borderLeft: '2px solid rgba(148, 163, 184, 0.25)',
                color: '#94a3b8',
                fontSize: '0.875rem',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                position: 'relative'
              }}
            >
              {thinking}
              {isStillThinking && <span className="typing-cursor" style={{ marginLeft: '2px' }}></span>}
            </div>
          )}
        </div>

        {responseText && (
          <div 
            className="assistant-markdown-content streaming"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(responseText) }}
          />
        )}
      </div>
    );
  }

  // Parse markdown in real-time
  const htmlContent = parseMarkdown(visibleText);

  return (
    <div 
      className="assistant-markdown-content streaming"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
