import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import './ConfirmationModal.css'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'delete' | 'share' | 'logout'
  chatTitle?: string
  chatId?: string
  title?: string
  description?: string
  onConfirm?: () => void
}

export function ConfirmationModal({
  isOpen,
  onClose,
  type,
  chatTitle = '',
  chatId,
  title,
  description,
  onConfirm
}: ConfirmationModalProps) {
  const [copied, setCopied] = useState(false)

  // Reset copied state when modal is opened/closed or type changes
  useEffect(() => {
    setCopied(false)
  }, [isOpen, type])
  
  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleCopyLink = () => {
    const idToUse = chatId || encodeURIComponent(chatTitle.toLowerCase().replace(/\s+/g, '-'));
    navigator.clipboard.writeText(`${window.location.origin}/share/c/${idToUse}`)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container ${(type === 'delete' || type === 'logout') ? 'modal-delete-style' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Close Button - Hidden in Delete & Logout Confirmation for a cleaner dialog box */}
        {type !== 'delete' && type !== 'logout' && (
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="close-icon">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        {type === 'delete' ? (
          <div className="modal-content left-aligned">
            <h3 className="modal-title">{title || 'Delete chat?'}</h3>
            <p className="modal-description">
              {description || (
                <>
                  This will delete <strong>{chatTitle}</strong>.
                </>
              )}
            </p>
            <p className="modal-subtext">
              Visit <span className="settings-link">settings</span> to delete any memories saved during this chat.
            </p>
            <div className="modal-actions right-aligned">
              <button className="btn btn-secondary pill-btn" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn btn-danger pill-btn" 
                onClick={() => {
                  if (onConfirm) onConfirm()
                  onClose()
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : type === 'logout' ? (
          <div className="modal-content left-aligned">
            <h3 className="modal-title">{title || 'Log out?'}</h3>
            <p className="modal-description">
              {description || 'Are you sure you want to log out? You will need to sign in again to access your active workspace, saved creations, and personalization settings.'}
            </p>
            <div className="modal-actions right-aligned">
              <button className="btn btn-secondary pill-btn" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="btn btn-danger pill-btn" 
                onClick={() => {
                  if (onConfirm) onConfirm()
                  onClose()
                }}
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-content left-aligned">
            <h3 className="modal-title">Share Chat</h3>
            <p className="modal-description">
              Anyone with this link will be able to view the conversation history of <strong>{chatTitle}</strong>.
            </p>
            <div className="share-link-container">
              <input 
                type="text" 
                className="share-link-input" 
                readOnly 
                value={`${window.location.origin}/share/c/${chatId || encodeURIComponent(chatTitle.toLowerCase().replace(/\s+/g, '-'))}`} 
              />
              <button 
                className={`btn btn-primary share-link-btn ${copied ? 'copied' : ''}`} 
                onClick={handleCopyLink}
              >
                {copied ? (
                  'Copied!'
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
