import { createPortal } from 'react-dom';
import type { CollabRoom } from '../../../api';
import './CreateRoomModal.css';

interface CreateRoomModalProps {
  isNamingModalOpen: boolean;
  onCloseNamingModal: () => void;
  newRoomTitle: string;
  onChangeTitle: (val: string) => void;
  onCreateRoom: () => void;
  isCreatingRoom: boolean;
  createdRoom: CollabRoom | null;
  isCreatedRoomClosing: boolean;
  onCloseCreatedRoom: () => void;
  isPasswordEnabled: boolean;
  roomPassword: string;
  onTogglePassword: () => void;
  onChangePassword: (val: string) => void;
  isIdCopied: boolean;
  isPasswordCopied: boolean;
  onCopyId: () => void;
  onCopyPassword: () => void;
  onJoinRoom: (code: string) => void;
}

export function CreateRoomModal({
  isNamingModalOpen,
  onCloseNamingModal,
  newRoomTitle,
  onChangeTitle,
  onCreateRoom,
  isCreatingRoom,
  createdRoom,
  isCreatedRoomClosing,
  onCloseCreatedRoom,
  isPasswordEnabled,
  roomPassword,
  onTogglePassword,
  onChangePassword,
  isIdCopied,
  isPasswordCopied,
  onCopyId,
  onCopyPassword,
  onJoinRoom,
}: CreateRoomModalProps) {
  return (
    <>
      {/* 1. Naming Modal */}
      {isNamingModalOpen &&
        createPortal(
          <div className="groupchat-modal-overlay" onClick={() => !isCreatingRoom && onCloseNamingModal()}>
            <div className="groupchat-modal-container naming-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="groupchat-modal-header">
                <h2>New Collaboration</h2>
                <button
                  className="groupchat-modal-close-btn"
                  onClick={() => !isCreatingRoom && onCloseNamingModal()}
                  disabled={isCreatingRoom}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="groupchat-modal-body naming-modal-body">
                <div className="naming-field-group">
                  <label className="naming-field-label">Collaboration Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Collaborative Discussion"
                    value={newRoomTitle}
                    onChange={(e) => onChangeTitle(e.target.value)}
                    className="naming-input-field"
                    disabled={isCreatingRoom}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onCreateRoom();
                      }
                    }}
                  />
                </div>

                <div className="naming-modal-actions">
                  <button
                    className="naming-cancel-btn"
                    onClick={onCloseNamingModal}
                    disabled={isCreatingRoom}
                  >
                    Cancel
                  </button>
                  <button
                    className="meet-pill-btn primary naming-create-btn"
                    onClick={onCreateRoom}
                    disabled={isCreatingRoom}
                  >
                    {isCreatingRoom ? (
                      <>
                        <svg className="groupchat-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="8" strokeLinecap="round" />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Room'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 2. Created / Invite Modal */}
      {createdRoom &&
        createPortal(
          <div className={`groupchat-modal-overlay ${isCreatedRoomClosing ? 'closing' : ''}`} onClick={onCloseCreatedRoom}>
            <div className={`groupchat-modal-container invite-modal-container ${isCreatedRoomClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="groupchat-modal-header">
                <h2>Collaboration Created</h2>
                <button className="groupchat-modal-close-btn" onClick={onCloseCreatedRoom}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="groupchat-modal-body invite-modal-body">
                <p className="invite-desc">Share the Collaboration ID with your team to prompt AI models together in real-time.</p>

                <div className="invite-field-group">
                  <label className="invite-field-label">Collaboration ID</label>
                  <div className="invite-id-card">
                    <span className="invite-id-text">{createdRoom.code}</span>
                    <button className="invite-copy-btn" onClick={onCopyId}>
                      {isIdCopied ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" className="copy-svg-icon" style={{ color: 'var(--groupchat-text)' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="copy-svg-icon">
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.94605 4.99995L13.2541 4.99995C14.173 5.00498 15.0524 5.37487 15.6986 6.02825C16.3449 6.68163 16.7051 7.56497 16.7001 8.48395V12.716C16.7051 13.6349 16.3449 14.5183 15.6986 15.1717C15.0524 15.825 14.173 16.1949 13.2541 16.2H8.94605C8.02707 16.1949 7.14773 15.825 6.50148 15.1717C5.85522 14.5183 5.495 13.6349 5.50005 12.716L5.50005 8.48495C5.49473 7.5658 5.85484 6.6822 6.50112 6.0286C7.1474 5.375 8.0269 5.00498 8.94605 4.99995Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M10.1671 19H14.9371C17.4857 18.9709 19.5284 16.8816 19.5001 14.333V9.666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                          </g>
                        </svg>
                      )}
                      <span className="custom-tooltip">{isIdCopied ? 'Copied!' : 'Copy ID'}</span>
                    </button>
                  </div>
                </div>

                <div className="password-protection-group">
                  <div className="password-protection-header">
                    <div className="password-protection-info">
                      <span className="password-protection-title">Password protection</span>
                      <span className="password-protection-desc">Require visitors to enter a password to join this room</span>
                    </div>
                    <button
                      type="button"
                      className={`password-toggle-switch ${isPasswordEnabled ? 'enabled' : ''}`}
                      onClick={onTogglePassword}
                    >
                      <span className="password-toggle-handle" />
                    </button>
                  </div>

                  {isPasswordEnabled && (
                    <div className="password-input-wrapper">
                      <div className="password-id-card">
                        <input
                          type="text"
                          value={roomPassword}
                          placeholder="Enter password"
                          onChange={(e) => onChangePassword(e.target.value)}
                          className="password-input-field"
                        />
                        {roomPassword.trim() && (
                          <button className="invite-copy-btn" onClick={onCopyPassword}>
                            {isPasswordCopied ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" className="copy-svg-icon" style={{ color: 'var(--groupchat-text)' }}>
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="copy-svg-icon">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M8.94605 4.99995L13.2541 4.99995C14.173 5.00498 15.0524 5.37487 15.6986 6.02825C16.3449 6.68163 16.7051 7.56497 16.7001 8.48395V12.716C16.7051 13.6349 16.3449 14.5183 15.6986 15.1717C15.0524 15.825 14.173 16.1949 13.2541 16.2H8.94605C8.02707 16.1949 7.14773 15.825 6.50148 15.1717C5.85522 14.5183 5.495 13.6349 5.50005 12.716L5.50005 8.48495C5.49473 7.5658 5.85484 6.6822 6.50112 6.0286C7.1474 5.375 8.0269 5.00498 8.94605 4.99995Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                  <path d="M10.1671 19H14.9371C17.4857 18.9709 19.5284 16.8816 19.5001 14.333V9.666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                </g>
                              </svg>
                            )}
                            <span className="custom-tooltip">{isPasswordCopied ? 'Copied!' : 'Copy Password'}</span>
                          </button>
                        )}
                      </div>
                      <span className="password-saved-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Auto-saved
                      </span>
                    </div>
                  )}
                </div>

                <div className="invite-modal-actions">
                  <button
                    className="meet-pill-btn primary join-now-btn"
                    onClick={() => {
                      const code = createdRoom.code;
                      onCloseCreatedRoom();
                      onJoinRoom(code);
                    }}
                  >
                    Join Collaboration
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
