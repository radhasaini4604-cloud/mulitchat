import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { parseMarkdown } from '../../Main_chat/utils/markdownParser'
import './SummaryModal.css'

interface SummaryModalProps {
  isOpen: boolean
  onClose: () => void
  chatTitle: string
  summaryText: string
  isLoading: boolean
  error: string | null
  onExport: (format: 'pdf' | 'txt' | 'md') => void
  onResummarize: () => void
  onDeleteSummary: () => void
}

const statusMessages = [
  'Initializing summary...',
  'Reading conversation history...',
  'Extracting key insights...',
  'Formatting summary points...',
  'Polishing takeaways...'
];

export function SummaryModal({
  isOpen,
  onClose,
  chatTitle,
  summaryText,
  isLoading,
  error,
  onExport,
  onResummarize,
  onDeleteSummary
}: SummaryModalProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cycle loader status messages
  useEffect(() => {
    if (!isLoading) return;
    setStatusIndex(0);
    const interval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % statusMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Close actions menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = () => {
      setMenuOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [menuOpen]);

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

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="summary-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Actions Menu */}
        {!isLoading && !error && summaryText && (
          <div className="summary-actions-wrapper">
            <button 
              className="summary-menu-btn" 
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              aria-label="Summary actions"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {menuOpen && (
              <div className="summary-submenu" onClick={(e) => e.stopPropagation()}>
                <div className="summary-submenu-item-wrapper export-wrapper">
                  <button className="summary-submenu-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download-icon lucide-download">
                      <path d="M12 15V3"/>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <path d="m7 10 5 5 5-5"/>
                    </svg>
                    <span>Export</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', opacity: 0.7 }}>
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <div className="export-nested-submenu">
                    <button 
                      className="nested-submenu-item"
                      onClick={() => {
                        onExport('pdf');
                        setMenuOpen(false);
                      }}
                    >
                      PDF Document (.pdf)
                    </button>
                    <button 
                      className="nested-submenu-item"
                      onClick={() => {
                        onExport('txt');
                        setMenuOpen(false);
                      }}
                    >
                      Plain Text (.txt)
                    </button>
                    <button 
                      className="nested-submenu-item"
                      onClick={() => {
                        onExport('md');
                        setMenuOpen(false);
                      }}
                    >
                      Markdown (.md)
                    </button>
                  </div>
                </div>

                <button 
                  className="summary-submenu-item"
                  onClick={() => {
                    onResummarize();
                    setMenuOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-icon lucide-rotate-ccw">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </svg>
                  <span>Resummarize</span>
                </button>

                <div className="summary-submenu-divider" />

                <button 
                  className="summary-submenu-item delete-item"
                  onClick={() => {
                    onDeleteSummary();
                    setMenuOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2-icon lucide-trash-2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="close-icon">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="summary-modal-content">
          <h3 className="summary-modal-title">Chat Summary</h3>
          <p className="summary-modal-subtitle">{chatTitle}</p>

          <div className="summary-body">
            {isLoading ? (
              <div className="summary-loading-container">
                <div className="summary-spinner"></div>
                <p className="summary-loading-text">{statusMessages[statusIndex]}</p>
              </div>
            ) : error ? (
              <div className="summary-error-container">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="error-text">{error}</p>
              </div>
            ) : (
              <div 
                className="assistant-markdown-content summary-text-content"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(summaryText) }}
              />
            )}
          </div>

          {!isLoading && (
            <div className="summary-modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
