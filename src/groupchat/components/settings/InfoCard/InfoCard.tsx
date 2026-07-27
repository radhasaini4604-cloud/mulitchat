import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CollabRoom, CollabMessage } from '../../../api';
import '../SharedSettings.css';
import './InfoCard.css';

interface InfoCardProps {
  isOpen: boolean;
  onClose: () => void;
  room: CollabRoom;
  isCoAdmin: boolean;
  onlineUsersCount: number;
  messagesCount: number;
  isRoomLocked: boolean;
  isPasswordEnabled: boolean;
  onRenameRoom: (newTitle: string) => void;
  onExportChat?: () => void;
  messages?: CollabMessage[];
  onlineUsers?: { userId: string; userName: string }[];
  creatorName?: string;
}

export function InfoCard({
  isOpen,
  onClose,
  room,
  isCoAdmin,
  onlineUsersCount,
  messagesCount,
  isRoomLocked,
  isPasswordEnabled,
  onRenameRoom,
  messages = [],
  onlineUsers = [],
  creatorName,
}: InfoCardProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [renameVal, setRenameVal] = useState(room.title);
  const [copiedId, setCopiedId] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    setRenameVal(room.title);
  }, [room.title]);

  if (!isOpen) return null;

  const creatorUser = onlineUsers.find((u) => u.userId === room.created_by);
  const displayCreator = creatorName || creatorUser?.userName || 'Admin';

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSaveTitle = () => {
    if (renameVal.trim() && renameVal.trim() !== room.title) {
      onRenameRoom(renameVal.trim());
      triggerToast('Group name updated!');
    }
    setIsEditingTitle(false);
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(room.code).catch(() => {
          fallbackCopyText(room.code);
        });
      } else {
        fallbackCopyText(room.code);
      }
    } catch {
      fallbackCopyText(room.code);
    }
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    triggerToast('Copied to clipboard');
  };

  const handleExportTxtFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let content = `==================================================\n`;
    content += `Group Room: ${room.title}\n`;
    content += `Group Code: ${room.code}\n`;
    content += `Created By: ${displayCreator}\n`;
    content += `Export Date: ${new Date().toLocaleString()}\n`;
    content += `==================================================\n\n`;

    if (messages && messages.length > 0) {
      messages.forEach((m: any, index: number) => {
        const sender = m.sender_name || m.user_name || m.sender_id || (m.is_ai ? 'AI Assistant' : 'Member');
        const time = m.created_at ? new Date(m.created_at).toLocaleString() : 'N/A';
        
        let textBody = '';
        if (m.prompt && m.response) {
          textBody = `User Prompt: ${m.prompt}\nAI Response: ${m.response}`;
        } else {
          textBody = m.response || m.prompt || m.content || m.text || '';
        }

        content += `[#${index + 1}] [${time}] ${sender}:\n${textBody}\n\n--------------------------------------------------\n\n`;
      });
    } else {
      content += `No messages in this chat history.\n`;
    }

    try {
      const safeTitle = (room.title || 'group').toLowerCase().replace(/[^a-z0-9]/g, '_');
      const filename = `${safeTitle}_chat_history.txt`;
      const encodedText = encodeURIComponent(content);
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodedText}`);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error('Failed to export txt file:', err);
    }

    triggerToast('Chat history exported!');
  };

  const handleExportPdfFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerToast('Failed to open PDF preview');
      return;
    }

    let html = `<!DOCTYPE html><html><head><title>${room.title} - Chat History</title><style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .meta { font-size: 12px; color: #666; margin-bottom: 24px; border-bottom: 1px solid #ddd; padding-bottom: 12px; }
      .msg { margin-bottom: 16px; padding: 10px; background: #f8f9fa; border-radius: 8px; }
      .sender { font-size: 13px; font-weight: 600; color: #222; margin-bottom: 4px; }
      .time { font-size: 11px; color: #888; font-weight: normal; margin-left: 8px; }
      .text { font-size: 13.5px; line-height: 1.5; color: #333; white-space: pre-wrap; }
    </style></head><body>`;
    
    html += `<h1>${room.title}</h1>`;
    html += `<div class="meta">Group Code: ${room.code} | Created By: ${displayCreator} | Export Date: ${new Date().toLocaleString()}</div>`;

    if (messages && messages.length > 0) {
      messages.forEach((m: any) => {
        const sender = m.sender_name || m.user_name || m.sender_id || (m.is_ai ? 'AI Assistant' : 'Member');
        const time = m.created_at ? new Date(m.created_at).toLocaleString() : 'N/A';
        let textBody = '';
        if (m.prompt && m.response) {
          textBody = `User Prompt: ${m.prompt}\nAI Response: ${m.response}`;
        } else {
          textBody = m.response || m.prompt || m.content || m.text || '';
        }

        html += `<div class="msg"><div class="sender">${sender}<span class="time">${time}</span></div><div class="text">${textBody}</div></div>`;
      });
    } else {
      html += `<p>No messages in this chat history.</p>`;
    }

    html += `</body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);

    triggerToast('Opening PDF print preview...');
  };

  return createPortal(
    <div className="room-navbar-modal-overlay" onClick={onClose}>
      <div className="room-navbar-modal-container wide-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="room-navbar-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2>Group Info & Details</h2>
          </div>
          <button className="room-navbar-modal-close-btn" onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="room-navbar-modal-body">
          {/* Top Centered Title Banner (No Avatar) */}
          <div className="submodal-header-banner centered">
            <div className="submodal-group-title-col centered">
              {!isEditingTitle ? (
                <div className="submodal-clean-title-row centered">
                  <h3 
                    className={`submodal-display-title centered ${isCoAdmin ? 'clickable' : ''}`}
                    onClick={() => { if (isCoAdmin) setIsEditingTitle(true); }}
                    title={isCoAdmin ? "Click to rename group" : undefined}
                  >
                    {room.title}
                  </h3>
                </div>
              ) : (
                <div className="submodal-inline-edit-row centered">
                  <input
                    type="text"
                    className="submodal-input borderless-input"
                    value={renameVal}
                    onChange={(e) => setRenameVal(e.target.value)}
                    placeholder="Enter group name..."
                    autoFocus
                  />
                  <button type="button" className="submodal-action-btn primary" onClick={handleSaveTitle}>
                    Save
                  </button>
                  <button type="button" className="submodal-action-btn" onClick={() => setIsEditingTitle(false)}>
                    Cancel
                  </button>
                </div>
              )}
              <span className="submodal-created-subtext centered">
                Created by {displayCreator} • {new Date(room.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="submodal-stats-grid">
            <div className="stat-card">
              <span className="stat-num">{onlineUsersCount}</span>
              <span className="stat-label">Online</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{messagesCount}</span>
              <span className="stat-label">Messages</span>
            </div>
            <div className="stat-card">
              <span className="stat-num">{isRoomLocked ? 'Locked' : isPasswordEnabled ? 'Protected' : 'Public'}</span>
              <span className="stat-label">Privacy</span>
            </div>
          </div>

          {/* Group ID Only Share Card */}
          <div className="submodal-unified-share-card">
            <div className="share-card-info">
              <span className="share-card-label">Group ID</span>
              <span className="share-card-url">{room.code}</span>
            </div>

            <div className="share-card-actions">
              {/* Copy Group ID Icon */}
              <button 
                type="button" 
                className={`submodal-icon-copy-btn ${copiedId ? 'copied' : ''}`}
                onClick={handleCopyId}
                title={copiedId ? "Copied Group ID!" : "Copy Group ID"}
              >
                {copiedId ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Quick Actions Footer (Borderless TXT & PDF buttons) */}
          <div className="submodal-quick-actions">
            <button
              type="button"
              className="submodal-quick-btn"
              onClick={handleExportTxtFile}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export TXT</span>
            </button>

            <button
              type="button"
              className="submodal-quick-btn"
              onClick={handleExportPdfFile}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Top-Center Sleek Black Toast Banner */}
        {toastMsg && createPortal(
          <div className="top-center-copied-toast">
            {toastMsg}
          </div>,
          document.body
        )}
      </div>
    </div>,
    document.body
  );
}
