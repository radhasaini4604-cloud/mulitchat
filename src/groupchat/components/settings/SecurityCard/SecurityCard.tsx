import { useState } from 'react';
import { createPortal } from 'react-dom';
import '../SharedSettings.css';
import './SecurityCard.css';

interface SecurityCardProps {
  isOpen: boolean;
  onClose: () => void;
  isCoAdmin: boolean;
  isRoomLocked: boolean;
  isPasswordEnabled: boolean;
  roomPassword: string;
  onToggleRoomLock?: () => void;
  handlePasswordToggle: () => void;
  handlePasswordChange: (val: string) => void;
}

export function SecurityCard({
  isOpen,
  onClose,
  isCoAdmin,
  isRoomLocked,
  isPasswordEnabled,
  roomPassword,
  onToggleRoomLock,
  handlePasswordToggle,
  handlePasswordChange,
}: SecurityCardProps) {
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
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

  const handleCopyPassword = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!roomPassword) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(roomPassword).catch(() => fallbackCopyText(roomPassword));
      } else {
        fallbackCopyText(roomPassword);
      }
    } catch {
      fallbackCopyText(roomPassword);
    }
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
    triggerToast('Password copied to clipboard!');
  };

  const handleSavePassword = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (roomPassword.trim()) {
      handlePasswordChange(roomPassword.trim());
      triggerToast('Password updated!');
    }
  };

  return createPortal(
    <div className="room-navbar-modal-overlay" onClick={onClose}>
      <div className="room-navbar-modal-container wide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="room-navbar-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2>Security & Access Control</h2>
          </div>
          <button className="room-navbar-modal-close-btn" onClick={onClose} title="Close" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="room-navbar-modal-body">
          {/* Lock Room Toggle */}
          <div className="submodal-toggle-row">
            <div>
              <div className="submodal-toggle-title">Lock Room</div>
              <div className="submodal-toggle-desc">Prevent new members from joining this room</div>
            </div>
            <button
              type="button"
              className={`password-toggle-switch ${isRoomLocked ? 'enabled' : ''}`}
              onClick={() => isCoAdmin && onToggleRoomLock?.()}
              disabled={!isCoAdmin}
            >
              <span className="password-toggle-handle" />
            </button>
          </div>

          {/* Password Protection Section */}
          <div className="submodal-section" style={{ marginTop: '18px' }}>
            <div className="submodal-toggle-row">
              <div>
                <div className="submodal-toggle-title">Password Protection</div>
                <div className="submodal-toggle-desc">Require a password to enter the room</div>
              </div>
              <button
                type="button"
                className={`password-toggle-switch ${isPasswordEnabled ? 'enabled' : ''}`}
                onClick={() => isCoAdmin && handlePasswordToggle()}
                disabled={!isCoAdmin}
              >
                <span className="password-toggle-handle" />
              </button>
            </div>

            {/* Unified Input Pill Card with Copy Icon & Save Button inside */}
            {isPasswordEnabled && (
              <div className="security-password-pill-card" style={{ marginTop: '14px' }}>
                <input
                  type="text"
                  className="security-password-input"
                  value={roomPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Set room password..."
                  disabled={!isCoAdmin}
                />

                <div className="security-pill-actions">
                  {/* Copy Password Icon with Tick Mark when copied */}
                  <button
                    type="button"
                    className={`submodal-icon-copy-btn ${copiedPassword ? 'copied' : ''}`}
                    onClick={handleCopyPassword}
                    title={copiedPassword ? "Copied Password!" : "Copy Password"}
                  >
                    {copiedPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>

                  {/* Save Password Button inside Pill */}
                  {isCoAdmin && (
                    <button
                      type="button"
                      className="security-save-pill-btn"
                      onClick={handleSavePassword}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top-Center Toast Banner */}
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
