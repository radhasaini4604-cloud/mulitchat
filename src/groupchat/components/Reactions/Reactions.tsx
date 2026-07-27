import { useEffect, useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import './Reactions.css';

interface MessageReactProps {
  x?: number;
  y?: number;
  messageId: string;
  isOwnMessage?: boolean;
  onClose: () => void;
  onSelectOption: (action: string) => void;
  onReact: (emoji: string) => void;
}

const EMOJIS = ['❤️', '👍', '👎', '🔥', '🥰', '👏', '😃'];

export function Reactions({ x, y, messageId, isOwnMessage = false, onClose, onSelectOption, onReact }: MessageReactProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showAllEmojis, setShowAllEmojis] = useState(false);

  // Position management relative to the bubble element
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    const bubbleEl = document.getElementById(`msg-bubble-${messageId}`);
    const scrollerEl = document.querySelector('.messages-scroller');

    const updatePosition = () => {
      const rect = el.getBoundingClientRect();
      const menuHeight = rect.height || el.offsetHeight || 300;
      const menuWidth = rect.width || el.offsetWidth || 260;

      let finalX = x || 0;
      let finalY = y || 0;

      // Find the input composer to avoid going under it / Dock
      const composerEl = document.querySelector('.chat-composer');
      const maxBottom = composerEl
        ? composerEl.getBoundingClientRect().top - 8
        : window.innerHeight - 10;

      if (bubbleEl) {
        const bubbleRect = bubbleEl.getBoundingClientRect();
        
        // Dynamically check if the menu fits next to the bubble without going offscreen
        let fitsBeside = false;
        if (isOwnMessage) {
          fitsBeside = bubbleRect.left - menuWidth - 8 >= 10;
        } else {
          fitsBeside = bubbleRect.right + menuWidth + 8 <= window.innerWidth - 10;
        }

        if (fitsBeside && window.innerWidth > 640) {
          // Desktop: Place menu beside the bubble (Telegram style) so it never covers it
          if (isOwnMessage) {
            // Own message is on the right, place menu to its LEFT
            finalX = bubbleRect.left - menuWidth - 8;
          } else {
            // Other message is on the left, place menu to its RIGHT
            finalX = bubbleRect.right + 8;
          }

          // Vertically align top of menu with top of bubble
          finalY = bubbleRect.top;
          if (finalY + menuHeight > maxBottom) {
            // If it overflows bottom, align menu bottom with bubble bottom
            finalY = Math.max(10, bubbleRect.bottom - menuHeight);
          }
        } else {
          // Mobile/Narrow or if message is too wide: Place menu above or below the bubble to prevent overlap
          if (isOwnMessage) {
            finalX = bubbleRect.right - menuWidth;
          } else {
            finalX = bubbleRect.left;
          }

          const isInLowerHalf = bubbleRect.top + bubbleRect.height / 2 > maxBottom / 2;
          if (isInLowerHalf) {
            // Place ABOVE the bubble
            finalY = bubbleRect.top - menuHeight - 8;
          } else {
            // Place BELOW the bubble
            finalY = bubbleRect.bottom + 8;
          }
        }
      } else {
        // Fallback to mouse coordinates if element is not found
        if (x !== undefined && y !== undefined) {
          finalX = x > window.innerWidth / 2 ? x - menuWidth : x;
          finalY = y + menuHeight > maxBottom ? y - menuHeight : y;
        }
      }

      // Final viewport and composer boundaries
      if (finalX + menuWidth > window.innerWidth - 10) {
        finalX = window.innerWidth - menuWidth - 10;
      }
      if (finalX < 10) {
        finalX = 10;
      }
      if (finalY + menuHeight > maxBottom) {
        finalY = maxBottom - menuHeight;
      }
      if (finalY < 10) {
        finalY = 10;
      }

      el.style.left = `${finalX}px`;
      el.style.top = `${finalY}px`;
    };

    // Use ResizeObserver to track actual dimension changes (including transitions/rendering)
    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });
    resizeObserver.observe(el);

    // Listen to scroll events on the scroller to update positioning dynamically
    if (scrollerEl) {
      scrollerEl.addEventListener('scroll', updatePosition, { passive: true });
    }
    window.addEventListener('resize', updatePosition);

    return () => {
      resizeObserver.disconnect();
      if (scrollerEl) {
        scrollerEl.removeEventListener('scroll', updatePosition);
      }
      window.removeEventListener('resize', updatePosition);
    };
  }, [messageId, isOwnMessage, x, y, showAllEmojis]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const isRightSide = isOwnMessage;

  return (
    <div className="message-context-menu-wrapper" ref={menuRef}>
      {/* Emoji Bar */}
      <div 
        className="menu-emoji-bar"
        style={{ flexDirection: isRightSide ? 'row-reverse' : 'row' }}
      >
        <div className="emojis-list">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              className="emoji-btn"
              onClick={() => {
                onReact(emoji);
                onClose();
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
        <button 
          className={`emoji-more-btn ${showAllEmojis ? 'active' : ''}`}
          onClick={() => setShowAllEmojis(!showAllEmojis)}
          aria-label="More emojis"
          style={{
            marginRight: isRightSide ? '16px' : '0',
            marginLeft: isRightSide ? '0' : '16px'
          }}
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            style={{
              transform: showAllEmojis ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease'
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {showAllEmojis && (
        <div 
          className="full-emoji-picker-container"
          style={isRightSide ? { left: 'auto', right: 'calc(100% + 8px)' } : {}}
        >
          <Picker
            data={data}
            set="apple"
            theme={document.body.classList.contains('dark-mode') ? 'dark' : 'light'}
            onEmojiSelect={(emojiObj: any) => {
              onReact(emojiObj.native);
              onClose();
            }}
          />
        </div>
      )}

      <div className="menu-divider" />

      {/* Menu Actions List */}
      <div className="menu-actions-list">
        <button className="menu-action-item" onClick={() => { onSelectOption('reply'); onClose(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
            <polyline points="9 17 4 12 9 7" />
            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
          </svg>
          <span>Reply</span>
        </button>

        <button className="menu-action-item" onClick={() => { onSelectOption('copy'); onClose(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Copy Text</span>
        </button>

        <button className="menu-action-item" onClick={() => { onSelectOption('pin'); onClose(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
            <line x1="12" y1="2" x2="12" y2="12" />
            <path d="M12 12c-2.2 0-4 1.8-4 4h8c0-2.2-1.8-4-4-4Z" />
            <line x1="12" y1="16" x2="12" y2="22" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Pin</span>
        </button>

        <button className="menu-action-item" onClick={() => { onSelectOption('download'); onClose(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download</span>
        </button>

        <button className="menu-action-item" onClick={() => { onSelectOption('select'); onClose(); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 11 12 14 15 8" />
          </svg>
          <span>Select</span>
        </button>

        {isOwnMessage && (
          <>
            <div className="menu-divider" />

            <button className="menu-action-item delete" onClick={() => { onSelectOption('delete'); onClose(); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
