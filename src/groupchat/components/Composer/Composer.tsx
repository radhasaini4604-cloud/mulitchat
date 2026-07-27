import { useState, useRef, useEffect } from 'react';
import { AttachmentMenu } from '../../../Main_chat/AttachmentMenu/AttachmentMenu';
import './Composer.css';

const modelOptions = [
  { key: 'gemini', name: 'Gemini 2.5 Flash', desc: 'Fast, intelligent multi-modal' },
  { key: 'gpt', name: 'GPT 120B', desc: 'High-reasoning MoE model (OSS)' },
  { key: 'qwen', name: 'Qwen Coder', desc: 'Code synthesis & debugging' },
  { key: 'mistral', name: 'Mistral Large', desc: 'State-of-the-art multilingual logic' },
  { key: 'cohere', name: 'Command R+', desc: 'Optimized for business & agents' },
  { key: 'nemotron', name: 'Nemotron 120B', desc: 'NVIDIA 120B parameter logic model' }
];

interface ComposerProps {
  onSendMessage: (promptText: string, modelCodes: string[]) => void;
  onTypingChange: (isTyping: boolean) => void;
  replyTo?: { sender: string; text: string } | null;
  onClearReply?: () => void;
  isDisabled?: boolean;
  disabledReason?: string;
  roomId?: string;
}

export function Composer({
  onSendMessage,
  onTypingChange,
  replyTo,
  onClearReply,
  isDisabled = false,
  disabledReason,
  roomId,
}: ComposerProps) {
  const [enabledModels, setEnabledModels] = useState<Record<string, boolean>>(() => {
    if (roomId) {
      const saved = localStorage.getItem(`room-models-${roomId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return { gemini: true, gpt: true, qwen: true, mistral: true, cohere: true, nemotron: true };
  });

  useEffect(() => {
    const loadSaved = () => {
      if (roomId) {
        const saved = localStorage.getItem(`room-models-${roomId}`);
        if (saved) {
          try {
            setEnabledModels(JSON.parse(saved));
            return;
          } catch {}
        }
      }
      setEnabledModels({ gemini: true, gpt: true, qwen: true, mistral: true, cohere: true, nemotron: true });
    };

    loadSaved();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.roomId === roomId && customEvent.detail?.enabledModels) {
        setEnabledModels(customEvent.detail.enabledModels);
      }
    };

    window.addEventListener('collab-enabled-models-updated', handleUpdate);
    return () => window.removeEventListener('collab-enabled-models-updated', handleUpdate);
  }, [roomId]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [mentionSearch, setMentionSearch] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Automatically adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      const scrollHeight = textareaRef.current.scrollHeight;
      const nextHeight = Math.min(Math.max(scrollHeight, 24), 120);
      textareaRef.current.style.height = `${nextHeight}px`;
    }
  }, [inputPrompt]);

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Close mention dropdown on click outside
  useEffect(() => {
    if (mentionSearch === null) return;
    const handleClickOutside = () => {
      setMentionSearch(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mentionSearch]);

  const handleInputChange = (val: string) => {
    setInputPrompt(val);

    // Dynamic typing state with a 1.5s timeout for perfect real-time feedback
    if (val.length > 0) {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        onTypingChange(true);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        onTypingChange(false);
      }, 1500);
    } else {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingChange(false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }

    const atIndex = val.lastIndexOf('@');
    if (atIndex !== -1 && atIndex === val.length - 1) {
      setMentionSearch('');
      setHighlightedIndex(0);
    } else if (atIndex !== -1 && atIndex < val.length) {
      const query = val.substring(atIndex + 1);
      if (!query.includes(' ')) {
        setMentionSearch(query);
        setHighlightedIndex(0);
      } else {
        setMentionSearch(null);
      }
    } else {
      setMentionSearch(null);
    }
  };

  const selectMentionModel = (modelKey: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelKey)) return prev;
      return [...prev, modelKey];
    });
    if (mentionSearch !== null) {
      const atIndex = inputPrompt.lastIndexOf('@');
      if (atIndex !== -1) {
        setInputPrompt(inputPrompt.substring(0, atIndex));
      }
    }
    setMentionSearch(null);
  };

  const handleSend = () => {
    if (!inputPrompt.trim()) return;
    onSendMessage(inputPrompt, selectedModels);
    setInputPrompt('');
    setSelectedModels([]);

    // Immediately reset typing indicator on send
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTypingChange(false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const filteredModels = mentionSearch !== null
    ? modelOptions.filter((m) => enabledModels[m.key] !== false && m.name.toLowerCase().includes(mentionSearch.toLowerCase()))
    : [];

  return (
    <div className="chat-composer">
      <div className="collab-composer-input-wrapper">
        
        {/* Mention Dropdown Popover */}
        {mentionSearch !== null && (
          <div className="collab-mention-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="mention-dropdown-list">
              {filteredModels.map((model, index) => (
                <button
                  key={model.key}
                  type="button"
                  className={`mention-dropdown-item ${selectedModels.includes(model.key) ? 'active' : ''} ${index === highlightedIndex ? 'highlighted' : ''}`}
                  onClick={() => selectMentionModel(model.key)}
                >
                  <span className="mention-item-name">{model.name}</span>
                </button>
              ))}
              {filteredModels.length === 0 && (
                <div className="mention-no-results">No matching models found</div>
              )}
            </div>
          </div>
        )}

        {/* Attachment preview chips — above input card row */}
        {attachedFiles.length > 0 && (
          <div className="collab-attached-files-container">
            {attachedFiles.map((file, idx) => (
              <div key={idx} className="collab-attached-file-chip">
                <span className="collab-file-chip-name">{file.name}</span>
                <button 
                  type="button" 
                  className="collab-file-chip-remove" 
                  onClick={() => setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))}
                  aria-label="Remove attachment"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reply Preview Bar */}
        {replyTo && (
          <div className="collab-reply-preview">
            <div className="reply-preview-accent" />
            <div className="reply-preview-content">
              <span className="reply-preview-sender">{replyTo.sender}</span>
              <span className="reply-preview-text">{replyTo.text}</span>
            </div>
            <button
              type="button"
              className="reply-preview-close"
              onClick={onClearReply}
              aria-label="Cancel reply"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <div className="premium-input-card">
          {/* Attachment Clip Button */}
          <AttachmentMenu onFileSelect={(files: any) => setAttachedFiles((prev) => [...prev, ...files])} />

          {/* Target Model Badges */}
          {selectedModels.map((modelKey) => (
            <div key={modelKey} className="active-model-target-badge">
              <span>@{modelOptions.find((m) => m.key === modelKey)?.name}</span>
              <button
                type="button"
                className="clear-target-btn"
                onClick={() => setSelectedModels((prev) => prev.filter((m) => m !== modelKey))}
                aria-label="Remove model"
              >
                ×
              </button>
            </div>
          ))}

          {/* Input Textarea (Center) */}
          <div className="input-textarea-wrapper">
            <textarea
              ref={textareaRef}
              disabled={isDisabled}
              placeholder={
                isDisabled
                  ? (disabledReason || 'Room is currently locked by admin')
                  : selectedModels.length > 0
                  ? ''
                  : 'Send a message, or type @ for model...'
              }
              value={inputPrompt}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (isDisabled) return;
                if (e.key === 'Backspace' && selectedModels.length > 0 && e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0) {
                  setSelectedModels((prev) => prev.slice(0, -1));
                  return;
                }

                if (mentionSearch !== null && filteredModels.length > 0) {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev + 1) % filteredModels.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev - 1 + filteredModels.length) % filteredModels.length);
                  } else if (e.key === 'Tab' || e.key === 'Enter') {
                    e.preventDefault();
                    const targetModel = filteredModels[highlightedIndex];
                    if (targetModel) {
                      selectMentionModel(targetModel.key);
                    }
                  }
                } else {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }
              }}
              rows={1}
              className="premium-textarea"
            />
          </div>

          {/* Send Button (Right side) */}
          <button onClick={handleSend} className="premium-send-btn" disabled={isDisabled || !inputPrompt.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
