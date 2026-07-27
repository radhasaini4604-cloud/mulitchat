import { useState, useEffect } from 'react';
import { getSharedChat, getSharedMessages } from '../utils/db';
import type { ChatSession, ChatMessage } from '../utils/db';
import { CompletedRenderer } from '../renderers/CompletedRenderer';
import './SharedChatPage.css';
import '../ModelColumn/MessageItem.css'; // Reuse message styling for standard bubbles

interface SharedChatPageProps {
  sessionId: string;
}

export function SharedChatPage({ sessionId }: SharedChatPageProps) {
  const [chat, setChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const session = await getSharedChat(sessionId);
        if (!session) {
          setError('Conversation not found');
          setLoading(false);
          return;
        }
        setChat(session);

        const msgs = await getSharedMessages(sessionId);
        setMessages(msgs);
      } catch (err) {
        console.error('Failed to load shared chat:', err);
        setError('An error occurred while loading this conversation');
      } finally {
        setLoading(false);
      }
    };

    loadSharedContent();
  }, [sessionId]);

  const providerMap: Record<string, string> = {
    gemini: 'Gemini 2.5 Flash',
    gpt: 'GPT 120B',
    qwen: 'Qwen Coder',
    mistral: 'Mistral Large',
    cohere: 'Command R+',
    nemotron: 'Nemotron 120B',
  };

  const MODELS_LIST = ['gemini', 'gpt', 'qwen', 'mistral', 'cohere', 'nemotron'];

  // Check if groq (gpt) model was used even once in the session
  const hasGpt = messages.some(
    (msg) => msg.sender === 'assistant' && msg.model?.toLowerCase() === 'gpt'
  );

  const activeModels = hasGpt
    ? ['gemini', 'gpt', 'qwen', 'mistral', 'cohere', 'nemotron']
    : ['gemini', 'qwen', 'mistral', 'cohere', 'nemotron'];

  // Group messages for each model
  const columnResponses: Record<string, ChatMessage[]> = {
    gemini: [],
    gpt: [],
    qwen: [],
    mistral: [],
    cohere: [],
    nemotron: [],
  };

  interface Turn {
    userMsg: ChatMessage;
    modelMsgs: Record<string, ChatMessage>;
  }

  const turns: Turn[] = [];
  let currentTurn: Turn | null = null;

  messages.forEach((msg) => {
    if (msg.sender === 'user') {
      if (currentTurn) turns.push(currentTurn);
      currentTurn = { userMsg: msg, modelMsgs: {} };
    } else if (msg.sender === 'assistant' && msg.model) {
      const mKey = msg.model.toLowerCase();
      if (currentTurn) currentTurn.modelMsgs[mKey] = msg;
    }
  });
  if (currentTurn) turns.push(currentTurn);

  turns.forEach((turn) => {
    const activeKeys = Object.keys(turn.modelMsgs);
    if (activeKeys.length === 0) {
      // Show user message in all columns if there were no replies yet
      MODELS_LIST.forEach((m) => {
        columnResponses[m].push({ ...turn.userMsg });
      });
    } else {
      activeKeys.forEach((m) => {
        if (columnResponses[m]) {
          columnResponses[m].push({ ...turn.userMsg });
          columnResponses[m].push(turn.modelMsgs[m]);
        }
      });
    }
  });

  if (loading) {
    return (
      <div className="shared-chat-page">
        <div className="shared-chat-loading">
          <div className="spinner" />
          <p>Retrieving conversation history...</p>
        </div>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="shared-chat-page">
        <div className="shared-chat-error">
          <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h4 className="error-title">{error || 'Not Found'}</h4>
          <p className="error-desc">The link you followed might be incorrect, private, or has been deleted by the owner.</p>
          <a href="/?auth=true" className="back-btn">Go to Nothric</a>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(chat.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="shared-chat-page">
      {/* Top Branding Header */}
      <header className="shared-chat-header">
        <div className="header-left-group">
          <a href="/" target="_blank" rel="noopener noreferrer" className="header-left-brand">
            <img src="/logo.svg" className="logo-img" alt="Nothric logo" />
            <span className="logo-text">nothric</span>
          </a>
          <div className="header-meta-info">
            <span className="header-chat-title">{chat.title}</span>
            <div className="header-chat-submeta">
              <span>Conversation History</span>
              <span className="meta-dot" />
              <span>Shared on {formattedDate}</span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <span className="read-only-badge">Shared View</span>
          <a href="/?auth=true" target="_blank" rel="noopener noreferrer" className="cta-btn">
            <span>Try Nothric</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </header>

      {/* Main Conversation Container */}
      <main className="shared-chat-main">

        {/* Column responses grid */}
        {messages.length > 0 ? (
          <div className="shared-columns-grid">
            {activeModels.map((model) => (
              <div key={model} className="shared-column-card">
                <div className="shared-column-header">
                  <span className="shared-column-model-name">{providerMap[model] || model}</span>
                </div>
                <div className="shared-column-body">
                  {columnResponses[model]?.map((msg) => {
                    const hasAttachments = msg.sender === 'user' && msg.attachments && msg.attachments.length > 0;
                    
                    const ripMarker = "🪦 RIP to the rest of that response. 🚫📖 The ending remains a mystery. 🕵️";
                    const hasRip = msg.text && msg.text.includes(ripMarker);
                    const cleanText = hasRip ? msg.text.replace(ripMarker, '').trim() : msg.text;

                    return (
                      <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                        <div className="message-container-inner">
                          {/* Attachments rendering */}
                          {hasAttachments && (
                            <div className="message-attachments-container">
                              {msg.attachments!.map((file: any, idx: number) => {
                                const isImage = file.type === 'image';
                                const isPdf = file.type === 'pdf';
                                const imageUrl = file.url || (file.base64 ? `data:image/png;base64,${file.base64}` : undefined);
                                
                                if (isImage && imageUrl) {
                                  return (
                                    <div key={idx} className="message-attachment-image-wrapper">
                                      <img src={imageUrl} alt={file.name} className="message-attachment-image" />
                                    </div>
                                  );
                                }

                                return (
                                  <div key={idx} className="message-attachment-card">
                                    <div className="attachment-icon-wrapper icon-bg-file">
                                      {isPdf ? (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                          <polyline points="14 2 14 8 20 8" />
                                          <line x1="16" y1="13" x2="8" y2="13" />
                                          <line x1="16" y1="17" x2="8" y2="17" />
                                          <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                      ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                          <polyline points="13 2 13 9 20 9" />
                                        </svg>
                                      )}
                                    </div>
                                    <div className="attachment-info">
                                      <span className="attachment-name">{file.name}</span>
                                      {file.size && (
                                        <span className="attachment-size">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Content block */}
                          {(cleanText || msg.sender === 'user') && (
                            <div className="message-bubble">
                              {msg.sender === 'user' ? (
                                <span>{msg.text}</span>
                              ) : (
                                <div className="assistant-content">
                                  <CompletedRenderer text={cleanText} />
                                </div>
                              )}
                            </div>
                          )}

                          {hasRip && (
                            <div className="stopped-dashed-line" style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                              🪦 RIP to the rest of that response. 🚫📖 The ending remains a mystery. 🕵️
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="shared-chat-error" style={{ minHeight: 'auto' }}>
            <p className="error-desc">No messages found in this conversation.</p>
          </div>
        )}

      </main>

      {messages.length > 0 && (
        <div className="shared-chat-end-divider">
          <div className="divider-line" />
          <span>Start your own journey. See you in nothric.</span>
          <div className="divider-line" />
        </div>
      )}
    </div>
  );
}
