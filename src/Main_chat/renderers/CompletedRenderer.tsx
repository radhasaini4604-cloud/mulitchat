import { memo, useState } from 'react';
import { parseMarkdown, parseThinkingText } from '../utils/markdownParser';

interface CompletedRendererProps {
  text: string;
}

export const CompletedRenderer = memo(function CompletedRenderer({ text }: CompletedRendererProps) {
  const { thinking, response } = parseThinkingText(text, true);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!thinking) {
    return (
      <div 
        className="assistant-markdown-content"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }} 
      />
    );
  }

  return (
    <div className="message-response-container">
      <div className="thinking-process-block" style={{ marginBottom: '14px', marginTop: '4px' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
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
          <span>Thought process</span>
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
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s ease',
              color: '#64748b'
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        
        {isExpanded && (
          <div
            style={{
              marginTop: '10px',
              paddingLeft: '14px',
              borderLeft: '2px solid rgba(148, 163, 184, 0.25)',
              color: '#94a3b8',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}
          >
            {thinking}
          </div>
        )}
      </div>

      {response && (
        <div 
          className="assistant-markdown-content"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(response) }} 
        />
      )}
    </div>
  );
});
