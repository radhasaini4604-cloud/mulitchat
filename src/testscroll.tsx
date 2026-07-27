import React, { useState, useRef, useCallback } from 'react';
import './testscroll.css';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

const aiResponses = [
  "I'm doing great, thank you for asking! I'm ready to help you with whatever you need—whether that's tackling a complex project, organizing information, or just exploring some creative ideas.\n\nHow are things going with you today?",
  "Is there anything specific you'd like to work on, or are you looking for some inspiration to get things started today?",
  "That's a really interesting question! Let me think about it for a moment. There are several ways we could approach this, and I want to make sure I give you the most helpful answer possible.",
  "Absolutely! I'd be happy to help with that. Here's what I'd suggest as a starting point—let me know if you'd like me to go deeper into any particular aspect.",
  "Great choice! That's one of my favorite topics to discuss. There's so much nuance to it, and I think you'll find the details really fascinating once we dive in.",
  "I understand what you're going for. Let me break this down step by step so it's easy to follow along. Feel free to stop me if you have any questions!",
];

let responseIndex = 0;

const TestScroll: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const scrollToMessage = useCallback((messageElement: HTMLElement) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Get the position of the message relative to the scroll container
    const messageTop = messageElement.offsetTop;

    // Scroll so the new user message appears at a fixed position from top
    // Using ~80px from the top of the container viewport
    const scrollTarget = messageTop - 80;

    container.scrollTo({
      top: scrollTarget,
      behavior: 'smooth',
    });
  }, []);

  const handleSend = useCallback(() => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: nextId.current++,
      role: 'user',
      text: inputValue.trim(),
    };

    const aiMsg: Message = {
      id: nextId.current++,
      role: 'ai',
      text: aiResponses[responseIndex % aiResponses.length],
    };
    responseIndex++;

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputValue('');

    // Wait for DOM to update, then scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Find the user message element we just added
        const userMsgEl = container.querySelector(
          `[data-msg-id="${userMsg.id}"]`
        ) as HTMLElement | null;

        if (userMsgEl) {
          scrollToMessage(userMsgEl);
        }
      });
    });
  }, [inputValue, scrollToMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ts-wrapper">
      <div className="ts-scroll-container" ref={scrollContainerRef}>
        {/* Top spacer so first message can appear at the fixed position */}
        <div className="ts-top-spacer" />

        {messages.map((msg) => (
          <div
            key={msg.id}
            data-msg-id={msg.id}
            className={`ts-message ts-message--${msg.role}`}
          >
            <div className="ts-message__bubble">
              {msg.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < msg.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom spacer so last message can be scrolled to the fixed position */}
        <div className="ts-bottom-spacer" />
      </div>

      <div className="ts-input-area">
        <div className="ts-input-bar">
          <input
            className="ts-input"
            type="text"
            placeholder="Send a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="ts-send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestScroll;
