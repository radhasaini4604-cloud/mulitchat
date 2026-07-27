import { useState, useEffect } from 'react';
import { useRoom } from '../../useRoom';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../api';
import { Navbar } from '../Navbar/Navbar';
import { MessageItem } from '../MessageItem/MessageItem';
import { Composer } from '../Composer/Composer';
import { MultiModel, type CollabTab } from '../MultiModel/MultiModel';
import { useChatScroll } from '../../../Main_chat/utils/useChatScroll';
import { StreamingRenderer } from '../../../Main_chat/renderers/StreamingRenderer';
import { useVoice } from '../../useVoice';
import './RoomView.css';
import '../MultiModel/MultiModel.css';

interface RoomViewProps {
  roomCode: string;
  onLeave: () => void;
}

export function RoomView({ roomCode, onLeave }: RoomViewProps) {
  const { user } = useAuth();
  const {
    room,
    messages,
    onlineUsers,
    isConnecting,
    error,
    streamingModels,
    streamingTexts,
    sendMessage,
    setTypingState,
    exportToSupabase,
    creatorName,
    renameRoom,
    updateSystemPrompt,
    addReaction,
    deleteCollabMessage,
    togglePinCollabMessage,
    kickUser,
    deleteRoom,
    isRoomLocked,
    coAdmins,
    toggleRoomLock,
    toggleCoAdmin,
    isCoAdmin,
    announcements,
    unreadAnnouncementsCount,
    addAnnouncement,
    deleteAnnouncement,
    markAnnouncementsAsRead,
    currentUserName,
    currentUserId,
    tabId,
    channel,
  } = useRoom(roomCode);

  const voiceState = useVoice(channel, currentUserId, currentUserName);

  const {
    messagesContainerRef,
    isAtBottom,
    scheduleScrollToBottom,
    handleJumpToBottom,
    handleScroll,
    handleWheel,
    handleTouchStart,
    handleTouchMove
  } = useChatScroll();

  const [isExporting, setIsExporting] = useState(false);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [currentRating, setCurrentRating] = useState(0);
  const [replyTo, setReplyTo] = useState<{ sender: string; text: string } | null>(null);

  const [activeStreamingTab, setActiveStreamingTab] = useState<string | null>(null);

  // Automatically select the first streaming model if none is active
  useEffect(() => {
    if (streamingModels.length > 0) {
      if (!activeStreamingTab || !streamingModels.includes(activeStreamingTab)) {
        setActiveStreamingTab(streamingModels[0]);
      }
    } else {
      setActiveStreamingTab(null);
    }
  }, [streamingModels, activeStreamingTab]);

  // Force scroll to bottom when message count changes (new message sent/received)
  useEffect(() => {
    if (messages.length > 0) {
      handleJumpToBottom();
    }
  }, [messages.length, handleJumpToBottom]);

  // Smart follow scroll on active incoming stream text chunks
  useEffect(() => {
    scheduleScrollToBottom();
  }, [streamingTexts, scheduleScrollToBottom]);


  const isCreator = room?.created_by === user?.id;

  const modelNames: Record<string, string> = {
    gemini: 'Gemini',
    gpt: 'GPT',
    qwen: 'Qwen',
    mistral: 'Mistral',
    cohere: 'Cohere',
    nemotron: 'Nemotron'
  };



  const typingIndicators: string[] = [];
  const typingMembers = onlineUsers.filter(u => u.isTyping && u.presenceKey !== tabId);
  typingMembers.forEach(m => {
    typingIndicators.push(`${m.userName} is typing`);
  });

  if (streamingModels && streamingModels.length > 0) {
    streamingModels.forEach((model) => {
      const aiName = modelNames[model] || model;
      typingIndicators.push(`${aiName} is typing`);
    });
  }

  useEffect(() => {
    if (room) {
      setIsPasswordEnabled(room.password ? true : false);
      setRoomPassword(room.password || '');
      setCurrentRating(room.rating || 0);
    }
  }, [room]);

  const handlePasswordToggle = async () => {
    if (!room) return;
    const nextEnabled = !isPasswordEnabled;
    setIsPasswordEnabled(nextEnabled);
    if (!nextEnabled) {
      setRoomPassword('');
      try {
        await api.setPassword(room.id, null);
      } catch (err) {
        console.error('Failed to clear room password:', err);
      }
    } else {
      const autoPass = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomPassword(autoPass);
      try {
        await api.setPassword(room.id, autoPass);
      } catch (err) {
        console.error('Failed to set room password:', err);
      }
    }
  };

  const handlePasswordChange = async (val: string) => {
    if (!room) return;
    setRoomPassword(val);
    try {
      await api.setPassword(room.id, val.trim() || null);
    } catch (err) {
      console.error('Failed to update room password:', err);
    }
  };

  const handleRatingChange = async (stars: number) => {
    if (!room) return;
    setCurrentRating(stars);
    try {
      await api.setRating(room.id, stars);
    } catch (err) {
      console.error('Failed to update rating in D1:', err);
    }
  };

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

  const handleDeleteRoom = () => {
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteRoom = async () => {
    if (!room) return;
    setShowDeleteConfirmModal(false);
    try {
      await deleteRoom();
      onLeave();
    } catch (err) {
      console.error('Failed to delete room:', err);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const sessionId = await exportToSupabase();
      if (sessionId) {
        window.dispatchEvent(new Event('chat-sessions-updated'));
        return true;
      }
      return false;
    } catch (_err) {
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  if (isConnecting) {
    return (
      <div className="groupchat-container room-mode room-loading-screen">
        <div className="room-loading-content">
          <div className="room-loading-spinner" />
          <p className="room-loading-text">Connecting to collab room...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="groupchat-container room-mode error-screen">
        <div className="error-card">
          <div className="error-card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3>Connection Failed</h3>
          <p>{error || 'Room details could not be retrieved.'}</p>
          <button 
            onClick={() => {
              if (roomCode && typeof window !== 'undefined') {
                sessionStorage.removeItem(`collab_room_cache_${roomCode}`);
              }
              onLeave();
            }} 
            className="groupchat-btn error-back-btn"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Group consecutive AI messages with the same prompt into a list
  const completedGroups: Array<{
    type: 'user' | 'ai';
    promptText?: string;
    messages: any[];
  }> = [];

  messages.forEach((msg) => {
    if (msg.sender_id === 'ai') {
      const lastGroup = completedGroups[completedGroups.length - 1];
      if (lastGroup && lastGroup.type === 'ai' && lastGroup.promptText === msg.prompt) {
        lastGroup.messages.push(msg);
      } else {
        completedGroups.push({
          type: 'ai',
          promptText: msg.prompt || '',
          messages: [msg],
        });
      }
    } else {
      completedGroups.push({
        type: 'user',
        messages: [msg],
      });
    }
  });

  // Find active prompt text for active streams
  const lastUserMsg = [...messages].reverse().find(msg => msg.sender_id !== 'ai');
  const activePromptText = lastUserMsg ? lastUserMsg.prompt : '';

  // If streaming is active, append or merge it to the last group
  if (streamingModels && streamingModels.length > 0) {
    const lastGroup = completedGroups[completedGroups.length - 1];
    if (!(lastGroup && lastGroup.type === 'ai' && lastGroup.promptText === activePromptText)) {
      // No completed AI response group exists for this prompt yet, create a placeholder group
      completedGroups.push({
        type: 'ai',
        promptText: activePromptText,
        messages: [],
      });
    }
  }

  const modelFriendlyNames: Record<string, string> = {
    gemini: 'Gemini',
    gpt: 'GPT',
    qwen: 'Qwen',
    mistral: 'Mistral',
    cohere: 'Cohere',
    nemotron: 'Nemotron'
  };

  // Convert to renderable elements
  const renderableElements = completedGroups.map((group, idx) => {
    if (group.type === 'user') {
      return {
        type: 'user' as const,
        key: group.messages[0].id,
        message: group.messages[0],
      };
    }

    // AI group
    const isLastGroup = idx === completedGroups.length - 1;
    const groupStreamingModels = isLastGroup ? (streamingModels || []) : [];

    // Filter out streaming models that have already finished (existed in group.messages)
    // to prevent double tabs during state change HMR/Handovers.
    const activeStreamingModels = groupStreamingModels.filter(
      (mCode) => !group.messages.some((m) => (m.model || '').toLowerCase() === mCode.toLowerCase())
    );

    const totalModels = group.messages.length + activeStreamingModels.length;

    if (totalModels > 1) {
      // Render as multi-model card
      const tabs: CollabTab[] = [];

      // Completed tabs
      group.messages.forEach((msg) => {
        const modelKey = (msg.model || '').toLowerCase();
        tabs.push({
          id: msg.id,
          modelCode: modelKey,
          displayName: modelFriendlyNames[modelKey] || msg.model || 'Assistant',
          isStreaming: false,
          message: msg,
        });
      });

      // Streaming tabs
      activeStreamingModels.forEach((modelCode) => {
        const modelKey = modelCode.toLowerCase();
        tabs.push({
          id: `streaming-${modelKey}`,
          modelCode: modelKey,
          displayName: modelFriendlyNames[modelKey] || modelCode,
          isStreaming: true,
          streamingText: streamingTexts[modelCode] || '',
        });
      });

      return {
        type: 'multi-ai' as const,
        key: `multi-ai-${idx}`,
        tabs,
      };
    } else {
      // Render as a single element
      if (group.messages.length === 1) {
        return {
          type: 'single-completed-ai' as const,
          key: group.messages[0].id,
          message: group.messages[0],
        };
      } else {
        const modelCode = activeStreamingModels[0];
        const modelKey = modelCode.toLowerCase();
        return {
          type: 'single-streaming-ai' as const,
          key: `single-streaming-${modelKey}-${idx}`,
          modelCode: modelKey,
          streamingText: streamingTexts[modelCode] || '',
        };
      }
    }
  });

  return (
    <div className="groupchat-container room-mode">
      <Navbar
        room={room}
        isCreator={isCreator}
        isPasswordEnabled={isPasswordEnabled}
        roomPassword={roomPassword}
        currentRating={currentRating}
        isExporting={isExporting}
        onlineUsers={onlineUsers}
        handlePasswordToggle={handlePasswordToggle}
        handlePasswordChange={handlePasswordChange}
        handleRatingChange={handleRatingChange}
        handleExport={handleExport}
        onLeave={onLeave}
        onRenameRoom={renameRoom}
        onDeleteRoom={handleDeleteRoom}
        onUpdateSystemPrompt={updateSystemPrompt}
        onKickUser={kickUser}
        isRoomLocked={isRoomLocked}
        coAdmins={coAdmins}
        onToggleRoomLock={toggleRoomLock}
        onToggleCoAdmin={toggleCoAdmin}
        messages={messages}
        voiceState={voiceState}
        announcements={announcements}
        unreadAnnouncementsCount={unreadAnnouncementsCount}
        onAddAnnouncement={addAnnouncement}
        onDeleteAnnouncement={deleteAnnouncement}
        onMarkAnnouncementsAsRead={markAnnouncementsAsRead}
        isCoAdmin={isCoAdmin}
      />

      <div className="room-chat-area" style={{ position: 'relative' }}>
        <div 
          ref={messagesContainerRef}
          className="messages-scroller"
          onScroll={handleScroll}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {renderableElements.map((el) => {
            if (el.type === 'user') {
              return (
                <MessageItem 
                  key={el.key} 
                  msg={el.message} 
                  currentUserId={user?.id || ''} 
                  currentUserName={currentUserName}
                  isCoAdmin={isCoAdmin}
                  onRetry={(promptText, modelCode) => sendMessage(promptText, [modelCode])}
                  onDelete={deleteCollabMessage}
                  onPinToggle={togglePinCollabMessage}
                  onAddReaction={addReaction}
                  onReply={(sender, text) => setReplyTo({ sender, text })}
                />
              );
            } else if (el.type === 'single-completed-ai') {
              return (
                <MessageItem 
                  key={el.key} 
                  msg={el.message} 
                  currentUserId={user?.id || ''} 
                  currentUserName={currentUserName}
                  isCoAdmin={isCoAdmin}
                  onRetry={(promptText, modelCode) => sendMessage(promptText, [modelCode])}
                  onDelete={deleteCollabMessage}
                  onPinToggle={togglePinCollabMessage}
                  onAddReaction={addReaction}
                  onReply={(sender, text) => setReplyTo({ sender, text })}
                />
              );
            } else if (el.type === 'single-streaming-ai') {
              return (
                <div key={el.key} className="collab-chat-row row-assistant streaming">
                  <div className="collab-chat-bubble-container" style={{ maxWidth: '100%' }}>
                    <div className="collab-chat-plain-response streaming">
                      <StreamingRenderer 
                        text={el.streamingText} 
                        isCompleted={false} 
                        onComplete={() => {}}
                        onTextUpdate={scheduleScrollToBottom}
                        hidePlaceholderStatus={true}
                      />
                    </div>
                  </div>
                </div>
              );
            } else if (el.type === 'multi-ai') {
              return (
                <MultiModel
                  key={el.key}
                  tabs={el.tabs}
                  currentUserId={user?.id || ''}
                  currentUserName={currentUserName}
                  onRetry={(promptText: string, modelCode: string) => sendMessage(promptText, [modelCode])}
                  onDelete={deleteCollabMessage}
                  onPinToggle={togglePinCollabMessage}
                  onAddReaction={addReaction}
                  onReply={(sender: string, text: string) => setReplyTo({ sender, text })}
                  scheduleScrollToBottom={scheduleScrollToBottom}
                />
              );
            }
            return null;
          })}

          {/* Typing Indicator Panel */}
          {typingIndicators.length > 0 && (
            <div className="collab-typing-indicators">
              {typingIndicators.map((text, idx) => (
                <div key={idx} className="typing-indicator-item">
                  <div className="typing-animation-dots">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                  <span className="typing-indicator-text">{text}</span>
                </div>
              ))}
            </div>
          )}

          {messages.length === 0 && streamingModels.length === 0 && (
            <div className="room-creation-banner">
              <div className="room-creation-time">{formatCreationTime(room.created_at)}</div>
              <div className="room-creation-desc">{creatorName} created the group chat.</div>
            </div>
          )}
        </div>

        {/* Floating Jump to Latest Button */}
        {!isAtBottom && (
          <button className="jump-to-latest-btn" onClick={handleJumpToBottom} aria-label="Back to bottom">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="jump-icon">
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
            <span>Back to bottom</span>
          </button>
        )}

        <Composer
          onSendMessage={(promptText, modelCodes) => {
            sendMessage(promptText, modelCodes, replyTo);
            setReplyTo(null);
          }}
          onTypingChange={(isTyping) => setTypingState(isTyping)}
          replyTo={replyTo}
          onClearReply={() => setReplyTo(null)}
          isDisabled={isRoomLocked && !isCoAdmin}
          disabledReason="Room is locked by admin (Read-only mode)"
          roomId={room.id}
        />
      </div>

      {showDeleteConfirmModal && (
        <div className="manage-group-overlay" onClick={() => setShowDeleteConfirmModal(false)}>
          <div
            className="manage-group-container"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '420px', height: 'auto', padding: '24px', flexDirection: 'column', gap: '16px' }}
          >
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: 'inherit' }}>Delete Group Chat?</h3>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#8e8e93', lineHeight: '1.5' }}>
              Are you sure you want to delete <strong style={{ color: 'inherit' }}>{room?.title}</strong>? All members will be redirected and room history will be removed.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                className="manage-btn secondary"
                onClick={() => setShowDeleteConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                className="manage-btn danger"
                onClick={confirmDeleteRoom}
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatCreationTime(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timeStr = `${hours}:${minutes} ${ampm}`;

  if (date.toDateString() === now.toDateString()) {
    return `Today ${timeStr}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${timeStr}`;
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${timeStr}`;
}
