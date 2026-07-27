import { useState, useEffect } from 'react';
import { MessageItem } from '../MessageItem/MessageItem';
import { StreamingRenderer } from '../../../Main_chat/renderers/StreamingRenderer';
import { getModelLogo } from '../../../shared/modelLogos';
import type { CollabMessage } from '../../api';
import './MultiModel.css';

export interface CollabTab {
  id: string;
  modelCode: string;
  displayName: string;
  isStreaming: boolean;
  message?: CollabMessage;
  streamingText?: string;
}

interface CollabMultiModelResponseProps {
  tabs: CollabTab[];
  currentUserId: string;
  currentUserName: string;
  onRetry?: (promptText: string, modelCode: string) => void;
  onDelete?: (msgId: string) => void;
  onPinToggle?: (msgId: string, isPinned: boolean) => void;
  onAddReaction?: (msgId: string, emoji: string) => void;
  onReply?: (sender: string, text: string) => void;
  scheduleScrollToBottom?: () => void;
}

const modelAvatarData: Record<string, { letter: string; color: string }> = {
  gemini: { letter: 'G', color: '#4285f4' },
  gpt: { letter: 'G', color: '#10a37f' },
  qwen: { letter: 'Q', color: '#8b5cf6' },
  mistral: { letter: 'M', color: '#ff7000' },
  cohere: { letter: 'C', color: '#059669' },
  nemotron: { letter: 'N', color: '#76b900' }
};

function getModelAvatar(modelCode: string) {
  const key = modelCode.toLowerCase();
  return modelAvatarData[key] || { letter: modelCode[0]?.toUpperCase() || 'A', color: '#6b7280' };
}

export function MultiModel({
  tabs,
  currentUserId,
  currentUserName,
  onRetry,
  onDelete,
  onPinToggle,
  onAddReaction,
  onReply,
  scheduleScrollToBottom
}: CollabMultiModelResponseProps) {
  const [activeTabId, setActiveTabId] = useState<string>('');

  // Auto-sync active tab if tabs change or initial mount
  useEffect(() => {
    if (tabs.length > 0) {
      const exists = tabs.some(t => t.id === activeTabId);
      if (!exists) {
        setActiveTabId(tabs[0].id);
      }
    }
  }, [tabs, activeTabId]);

  if (tabs.length === 0) return null;

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return (
    <div className="collab-multi-model-group">
      <div className="collab-model-switcher">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab.id;
          const logo = getModelLogo(tab.modelCode, 16);
          const avatar = getModelAvatar(tab.modelCode);
          return (
            <button
              key={tab.id}
              type="button"
              className={`collab-model-switch-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              <span className="collab-model-switch-avatar-logo">
                {logo || <span className="collab-model-switch-avatar" style={{ backgroundColor: avatar.color }}>{avatar.letter}</span>}
              </span>
              <span className="collab-model-switch-name">{tab.displayName}</span>
            </button>
          );
        })}
      </div>
      <div className="collab-model-active-content">
        {activeTab.message ? (
          <MessageItem
            msg={activeTab.message}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            onRetry={onRetry}
            onDelete={onDelete}
            onPinToggle={onPinToggle}
            onAddReaction={onAddReaction}
            onReply={onReply}
          />
        ) : (
          <div className="collab-chat-row row-assistant streaming">
            <div className="collab-chat-bubble-container" style={{ maxWidth: '100%' }}>
              <div className="collab-chat-plain-response streaming">
                <StreamingRenderer 
                  text={activeTab.streamingText || ''} 
                  isCompleted={!activeTab.isStreaming} 
                  onComplete={() => {}}
                  onTextUpdate={scheduleScrollToBottom}
                  hidePlaceholderStatus={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
