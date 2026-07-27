import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../../context/AuthContext';
import type { CollabRoom, CollabMessage, CollabAnnouncement } from '../../api';
import { Announcement } from '../Announcement/Announcement';
import { InfoCard } from '../settings/InfoCard/InfoCard';
import { PeopleCard } from '../settings/PeopleCard/PeopleCard';
import { ModelCard } from '../settings/ModelCard/ModelCard';
import { SecurityCard } from '../settings/SecurityCard/SecurityCard';
import './Navbar.css';

interface NavbarProps {
  room: CollabRoom;
  isCreator: boolean;
  isPasswordEnabled: boolean;
  roomPassword: string;
  currentRating: number;
  isExporting: boolean;
  onlineUsers?: { userId: string; userName: string; isTyping: boolean }[];
  handlePasswordToggle: () => void;
  handlePasswordChange: (val: string) => void;
  handleRatingChange: (rating: number) => void;
  handleExport: () => void;
  onLeave: () => void;
  onRenameRoom?: (newTitle: string) => void;
  onDeleteRoom?: () => void;
  onUpdateSystemPrompt?: (newPrompt: string | null) => void;
  onKickUser?: (userId: string) => void;
  isRoomLocked?: boolean;
  coAdmins?: string[];
  onToggleRoomLock?: () => void;
  onToggleCoAdmin?: (userId: string) => void;
  messages?: CollabMessage[];
  voiceState?: {
    isInVoice: boolean;
    isMuted: boolean;
    voiceUsers: { userId: string; userName: string; isMuted: boolean; isSpeaking: boolean }[];
    speakingUsers: Record<string, boolean>;
    joinVoice: () => void;
    leaveVoice: () => void;
    toggleMute: () => void;
  };
  announcements?: CollabAnnouncement[];
  unreadAnnouncementsCount?: number;
  onAddAnnouncement?: (text: string) => void;
  onDeleteAnnouncement?: (id: string) => void;
  onMarkAnnouncementsAsRead?: () => void;
  isCoAdmin?: boolean;
}

export function Navbar({
  room,
  isCreator,
  isPasswordEnabled,
  roomPassword,
  currentRating: _currentRating,
  isExporting: _isExporting,
  onlineUsers = [],
  handlePasswordToggle,
  handlePasswordChange,
  handleRatingChange: _handleRatingChange,
  handleExport: _handleExport,
  onLeave,
  onRenameRoom = () => {},
  onDeleteRoom = () => {},
  onUpdateSystemPrompt = () => {},
  onKickUser = () => {},
  isRoomLocked = false,
  coAdmins = [],
  onToggleRoomLock,
  onToggleCoAdmin,
  messages = [],
  voiceState,
  announcements = [],
  unreadAnnouncementsCount = 0,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onMarkAnnouncementsAsRead,
  isCoAdmin = false,
}: NavbarProps) {
  const { user } = useAuth();
  const [collabAvatar] = useState<string | null>(() => {
    const val = localStorage.getItem('collab-avatar');
    return val === 'null' ? null : val;
  });
  const [avatarError, setAvatarError] = useState(false);

  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [collabAvatar]);

  const [activeModal, setActiveModal] = useState<'info' | 'people' | 'ai' | 'security' | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleteClosing, setIsDeleteClosing] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeaveClosing, setIsLeaveClosing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCloseDeleteConfirm = () => {
    setIsDeleteClosing(true);
    setTimeout(() => {
      setShowDeleteConfirm(false);
      setIsDeleteClosing(false);
    }, 200);
  };

  const handleCloseLeaveConfirm = () => {
    setIsLeaveClosing(true);
    setTimeout(() => {
      setShowLeaveConfirm(false);
      setIsLeaveClosing(false);
    }, 200);
  };

  const capitalizeTitle = (str: string) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="room-navbar">
      <div className="room-navbar-header-title-wrapper">
        <button
          type="button"
          className="room-navbar-title-trigger-btn"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
        >
          <span className="room-navbar-title-text">{capitalizeTitle(room.title)}</span>
          <span className="room-meta-inline-count">
            • {onlineUsers.length} {onlineUsers.length === 1 ? 'member' : 'members'}
          </span>
          <svg
            className={`title-dropdown-chevron ${isDropdownOpen ? 'open' : ''}`}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isDropdownOpen && (
          <>
            <div className="header-menu-backdrop" onClick={() => setIsDropdownOpen(false)} />
            <div className="room-navbar-hybrid-dropdown">
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setActiveModal('info');
                  setIsDropdownOpen(false);
                }}
              >
                <svg className="dropdown-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>Share Link & Info</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setActiveModal('people');
                  setIsDropdownOpen(false);
                }}
              >
                <svg className="dropdown-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>PeopleCard</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setActiveModal('ai');
                  setIsDropdownOpen(false);
                }}
              >
                <svg className="dropdown-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <span>AI Models</span>
              </button>

              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setActiveModal('security');
                  setIsDropdownOpen(false);
                }}
              >
                <svg className="dropdown-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>SecurityCard</span>
              </button>

              <div className="dropdown-divider" />

              <button
                type="button"
                className="dropdown-item danger-item"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setShowLeaveConfirm(true);
                }}
              >
                <svg className="dropdown-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Leave Group</span>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="room-navbar-right-wrapper">

        {voiceState && (
          <div>
            {!voiceState.isInVoice ? (
              <div className="header-tooltip-wrapper">
                <button
                  type="button"
                  className="icon-header-action-btn"
                  onClick={voiceState.joinVoice}
                  aria-label="Voice Chat"
                >
                  <svg viewBox="0 0 48 48" fill="currentColor" width="20" height="20">
                    <circle cx="14.3548" cy="19.496" r="4.934" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    <path d="M24.7339,33.2758v1.6906a1.641,1.641,0,0,1-1.6447,1.6446H6.1447A1.641,1.641,0,0,1,4.5,34.9664V33.2758c2.1586-7.0207,18.973-5.8163,20.2339,0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    <path d="M25.258,20.877v5.0323" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    <path d="M29.8186,16.2116V30.5745" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    <path d="M34.3791,11.3891V35.3972" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    <path d="M43.5,20.877v5.0323" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    <path d="M38.94,16.2116V30.5745" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                </button>
                <span className="header-custom-tooltip">Voice Chat</span>
              </div>
            ) : (
              <div className="active-voice-white-pill">
                <div className="header-tooltip-wrapper">
                  <div className="voice-user-count">{voiceState.voiceUsers.length}</div>
                  <span className="header-custom-tooltip">{voiceState.voiceUsers.length} members</span>
                </div>
                <div className="header-tooltip-wrapper">
                  <button
                    type="button"
                    onClick={voiceState.toggleMute}
                    aria-label={voiceState.isMuted ? "Unmute Mic" : "Mute Mic"}
                    className={`voice-pill-btn ${voiceState.isMuted ? 'muted' : ''}`}
                  >
                    {voiceState.isMuted ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="1" y1="1" x2="23" y2="23" />
                        <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </svg>
                    )}
                  </button>
                  <span className="header-custom-tooltip">{voiceState.isMuted ? "Unmute" : "Mute"}</span>
                </div>
                <div className="header-tooltip-wrapper">
                  <button
                    type="button"
                    onClick={voiceState.leaveVoice}
                    aria-label="Leave Voice"
                    className="voice-pill-btn leave"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M2.95,17.5A2.853,2.853,0,0,1,0,14.75v-12A2.854,2.854,0,0,1,2.95,0h8.8a.75.75,0,0,1,0,1.5H2.95A1.362,1.362,0,0,0,1.5,2.75v12A1.363,1.363,0,0,0,2.95,16h8.8a.75.75,0,0,1,0,1.5Zm9.269-4.219a.751.751,0,0,1,0-1.061L14.939,9.5H5.75a.75.75,0,0,1,0-1.5h9.19L12.219,5.28A.75.75,0,1,1,13.28,4.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.751.751,0,0,1-1.061,0Z" transform="translate(3.25 3.25)" fill="currentColor" />
                    </svg>
                  </button>
                  <span className="header-custom-tooltip">Leave Voice</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ position: 'relative' }}>
          <div className="header-tooltip-wrapper">
            <button
              type="button"
              className="icon-header-action-btn"
              onClick={() => {
                setIsAnnouncementOpen(true);
                onMarkAnnouncementsAsRead?.();
              }}
              aria-label="Announcement"
            >
              <svg viewBox="0 0 24 24" fill="none" width="19" height="19">
                <path d="M22 7.99992V11.9999M10.25 5.49991H6.8C5.11984 5.49991 4.27976 5.49991 3.63803 5.82689C3.07354 6.11451 2.6146 6.57345 2.32698 7.13794C2 7.77968 2 8.61976 2 10.2999L2 11.4999C2 12.4318 2 12.8977 2.15224 13.2653C2.35523 13.7553 2.74458 14.1447 3.23463 14.3477C3.60218 14.4999 4.06812 14.4999 5 14.4999V18.7499C5 18.9821 5 19.0982 5.00963 19.1959C5.10316 20.1455 5.85441 20.8968 6.80397 20.9903C6.90175 20.9999 7.01783 20.9999 7.25 20.9999C7.48217 20.9999 7.59826 20.9999 7.69604 20.9903C8.64559 20.8968 9.39685 20.1455 9.49037 19.1959C9.5 19.0982 9.5 18.9821 9.5 18.7499V14.4999H10.25C12.0164 14.4999 14.1772 15.4468 15.8443 16.3556C16.8168 16.8857 17.3031 17.1508 17.6216 17.1118C17.9169 17.0756 18.1402 16.943 18.3133 16.701C18.5 16.4401 18.5 15.9179 18.5 14.8736V5.1262C18.5 4.08191 18.5 3.55976 18.3133 3.2988C18.1402 3.05681 17.9169 2.92421 17.6216 2.88804C17.3031 2.84903 16.8168 3.11411 15.8443 3.64427C14.1772 4.55302 12.0164 5.49991 10.25 5.49991Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {unreadAnnouncementsCount > 0 && (
                <span className="announcement-badge-counter">
                  {unreadAnnouncementsCount}
                </span>
              )}
            </button>
            <span className="header-custom-tooltip">Announcements</span>
          </div>
        </div>

        <Announcement
          isOpen={isAnnouncementOpen}
          onClose={() => setIsAnnouncementOpen(false)}
          announcements={announcements}
          isCoAdmin={isCreator || isCoAdmin}
          onAddAnnouncement={(text) => onAddAnnouncement?.(text)}
          onDeleteAnnouncement={(id) => onDeleteAnnouncement?.(id)}
        />

        {!avatarError && collabAvatar ? (
          <img 
            src={collabAvatar} 
            alt="User Avatar" 
            className="navbar-user-avatar-img" 
            onError={() => setAvatarError(true)} 
          />
        ) : !avatarError && user?.user_metadata?.avatar_url ? (
          <img 
            src={user.user_metadata.avatar_url} 
            alt="User Avatar" 
            className="navbar-user-avatar-img" 
            onError={() => setAvatarError(true)} 
          />
        ) : (
          <div className="navbar-user-avatar-placeholder">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
        )}
      </div>

      {/* Dedicated Modular Modals */}
      <InfoCard
        isOpen={activeModal === 'info'}
        onClose={() => setActiveModal(null)}
        room={room}
        isCoAdmin={isCreator || isCoAdmin}
        onlineUsersCount={onlineUsers.length}
        messagesCount={messages.length}
        isRoomLocked={isRoomLocked}
        isPasswordEnabled={isPasswordEnabled}
        onRenameRoom={onRenameRoom}
        onExportChat={_handleExport}
        messages={messages}
        onlineUsers={onlineUsers}
      />

      <PeopleCard
        isOpen={activeModal === 'people'}
        onClose={() => setActiveModal(null)}
        room={room}
        isCoAdmin={isCreator || isCoAdmin}
        onlineUsers={onlineUsers}
        coAdmins={coAdmins}
        currentUserId={user?.id}
        onToggleCoAdmin={onToggleCoAdmin}
        onKickUser={onKickUser}
      />

      <ModelCard
        isOpen={activeModal === 'ai'}
        onClose={() => setActiveModal(null)}
        room={room}
        isCoAdmin={isCreator || isCoAdmin}
        onUpdateSystemPrompt={onUpdateSystemPrompt}
      />

      <SecurityCard
        isOpen={activeModal === 'security'}
        onClose={() => setActiveModal(null)}
        isCoAdmin={isCreator || isCoAdmin}
        isRoomLocked={isRoomLocked}
        isPasswordEnabled={isPasswordEnabled}
        roomPassword={roomPassword}
        onToggleRoomLock={onToggleRoomLock}
        handlePasswordToggle={handlePasswordToggle}
        handlePasswordChange={handlePasswordChange}
      />

      {showDeleteConfirm && createPortal(
        <div className={`room-navbar-modal-overlay ${isDeleteClosing ? 'closing' : ''}`} onClick={handleCloseDeleteConfirm}>
          <div className={`room-navbar-modal-container ${isDeleteClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="room-navbar-modal-header">
              <h2>Delete Group Chat</h2>
              <button className="room-navbar-modal-close-btn" onClick={handleCloseDeleteConfirm} title="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="room-navbar-modal-body">
              <p>Are you sure you want to delete <strong>{room.title}</strong>? This action is permanent and all messages will be lost.</p>
            </div>
            <div className="room-navbar-modal-footer">
              <button className="room-navbar-modal-btn cancel" onClick={handleCloseDeleteConfirm}>
                Cancel
              </button>
              <button 
                className="room-navbar-modal-btn delete" 
                onClick={() => {
                  onDeleteRoom();
                  handleCloseDeleteConfirm();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {showLeaveConfirm && createPortal(
        <div className={`room-navbar-modal-overlay ${isLeaveClosing ? 'closing' : ''}`} onClick={handleCloseLeaveConfirm}>
          <div className={`room-navbar-modal-container ${isLeaveClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="room-navbar-modal-header">
              <h2>Leave Group Chat</h2>
              <button className="room-navbar-modal-close-btn" onClick={handleCloseLeaveConfirm} title="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="room-navbar-modal-body">
              <p>Are you sure you want to leave <strong>{room.title}</strong>? You will need an invite code to rejoin.</p>
            </div>
            <div className="room-navbar-modal-footer">
              <button className="room-navbar-modal-btn cancel" onClick={handleCloseLeaveConfirm}>
                Cancel
              </button>
              <button 
                className="room-navbar-modal-btn delete" 
                onClick={() => {
                  onLeave();
                  handleCloseLeaveConfirm();
                }}
              >
                Leave
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
