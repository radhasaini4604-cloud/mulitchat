import { useState, useEffect } from 'react';
import type { SavedCreation } from '../utils/db';
import { ImageWithSkeleton } from './ImageWithSkeleton';
import './HistorySection.css';

interface HistorySectionProps {
  images: SavedCreation[];
  onCopyImage: (imageUrl: string) => void;
  onDeleteImage: (id: number) => void;
  onEditImage: (img: SavedCreation) => void;
}

const formatDisplayName = (prompt: string, summary?: string) => {
  const source = summary || prompt || '';
  const text = source.toLowerCase();
  if (text.length > 9) {
    return text.substring(0, 9) + '...';
  }
  return text;
};

export function HistorySection({ images, onCopyImage, onDeleteImage, onEditImage }: HistorySectionProps) {
  const [localNotification, setLocalNotification] = useState<string>('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activePromptId, setActivePromptId] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<SavedCreation | null>(null);

  useEffect(() => {
    if (activePromptId === null) return;
    const handleOutsideClick = () => {
      setActivePromptId(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [activePromptId]);

  const showToast = (msg: string) => {
    setLocalNotification(msg);
    setTimeout(() => {
      setLocalNotification('');
    }, 2000);
  };

  const handleShare = async (e: React.MouseEvent, img: SavedCreation) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Imagine Design',
          text: img.prompt,
          url: img.url
        });
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(img.url);
        showToast('Link copied to clipboard!');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="history-section-wrapper">
      {localNotification && (
        <div className="imagine-notification local-notification">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="notification-icon">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{localNotification}</span>
        </div>
      )}

      {images.length === 0 ? (
        <div className="history-empty-state">
          <p>No generated history yet. Type a prompt in the showroom and press Enter to generate your first design!</p>
        </div>
      ) : (
        <section className="imagine-section history-gallery-section">
          <div className="imagine-section-header">
            <h2 className="imagine-section-title">Your Generation History</h2>
          </div>

          <div className="history-grid">
            {images.map((img, idx) => (
              <div
                key={`history-${idx}-${img.url}`}
                className="history-card-container"
              >
                <div className="history-card" onClick={() => setPreviewImage(img)}>
                  <div className="history-image-wrapper">
                    <ImageWithSkeleton src={img.url} alt={img.prompt} className="history-img" ratio={img.ratio} />
                    {img.summary && (
                      <div className="history-hover-summary">
                        <span>{formatDisplayName(img.prompt, img.summary)}</span>
                      </div>
                    )}
                    
                    <div className="history-card-actions">
                      {/* Copy Button */}
                      <button
                        className="history-action-btn no-bg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCopyImage(img.url);
                        }}
                        title="Copy image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-icon lucide-copy">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </button>

                      {/* Download Button */}
                      <a
                        className="history-action-btn no-bg"
                        onClick={(e) => e.stopPropagation()}
                        title="Download image"
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        download={`imagine-${Date.now()}.png`}
                      >
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="currentColor"></path>
                          <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="currentColor"></path>
                        </svg>
                      </a>

                      {/* Edit Button */}
                      <button
                        className="history-action-btn no-bg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditImage(img);
                        }}
                        title="Edit image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        className="history-action-btn no-bg delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (img.id !== undefined) {
                            setDeletingId(img.id);
                          }
                        }}
                        title="Delete image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2-icon lucide-trash-2">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Confirmation Modal */}
      {deletingId !== null && (
        <div className="history-modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete creation?</h3>
            <p>This will permanently delete this image from your history. This action cannot be undone.</p>
            <div className="history-modal-footer">
              <button className="modal-btn-cancel" onClick={() => setDeletingId(null)}>
                Cancel
              </button>
              <button
                className="modal-btn-delete"
                onClick={() => {
                  onDeleteImage(deletingId);
                  setDeletingId(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage !== null && (
        <div className="history-modal-overlay preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="history-preview-modal" onClick={(e) => e.stopPropagation()}>
            {/* Soft decorative background blobs */}
            <div className="preview-bg-blob preview-bg-blob-blue"></div>
            <div className="preview-bg-blob preview-bg-blob-skin"></div>
            <div className="preview-bg-blob preview-bg-blob-purple"></div>

            {/* Close button top right */}
            <button
              className="preview-close-btn"
              onClick={() => setPreviewImage(null)}
              title="Close preview"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Main Preview Container */}
            <div className="preview-modal-body">
              {/* Left Side: Image */}
              <div className="preview-image-container">
                <ImageWithSkeleton src={previewImage.url} alt={previewImage.prompt} className="preview-main-img" ratio={previewImage.ratio} />
              </div>

              {/* Right Side: Details & Actions */}
              <div className="preview-details-sidebar">
                <div className="preview-prompt-section">
                  <div className="preview-section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table-of-contents-icon lucide-table-of-contents section-icon">
                      <path d="M16 5H3" />
                      <path d="M16 12H3" />
                      <path d="M16 19H3" />
                      <path d="M21 5h.01" />
                      <path d="M21 12h.01" />
                      <path d="M21 19h.01" />
                    </svg>
                    <span>Prompt Details</span>
                  </div>
                  <p className="preview-prompt-text">{previewImage.prompt}</p>
                </div>

                <div className="preview-meta-section">
                  <div className="meta-item">
                    <span className="meta-label">Model:</span>
                    <span className="meta-val">{previewImage.model}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Aspect Ratio:</span>
                    <span className="meta-val">{previewImage.ratio}</span>
                  </div>
                </div>

                <div className="preview-actions-bar">
                  {/* Copy Image Button */}
                  <button
                    className="history-action-btn"
                    onClick={() => {
                      onCopyImage(previewImage.url);
                      showToast('Image copied!');
                    }}
                    title="Copy image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-icon lucide-copy">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>

                  {/* Share Button */}
                  <button
                    className="history-action-btn"
                    onClick={(e) => handleShare(e, previewImage)}
                    title="Share image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right">
                      <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                      <path d="m21 3-9 9" />
                      <path d="M15 3h6v6" />
                    </svg>
                  </button>

                  {/* Download Button */}
                  <a
                    className="history-action-btn"
                    href={previewImage.url}
                    target="_blank"
                    rel="noreferrer"
                    download={`imagine-${Date.now()}.png`}
                    title="Download image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down-from-line-icon lucide-arrow-down-from-line">
                      <path d="M19 3H5" />
                      <path d="M12 21V7" />
                      <path d="m6 15 6 6 6-6" />
                    </svg>
                  </a>

                  {/* Edit Button */}
                  <button
                    className="history-action-btn"
                    onClick={() => {
                      onEditImage(previewImage);
                      setPreviewImage(null);
                    }}
                    title="Edit image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                  </button>

                  {/* Copy Prompt Button */}
                  <button
                    className="history-action-btn"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(previewImage.prompt);
                        showToast('Prompt copied!');
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    title="Copy prompt text"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-icon lucide-copy" style={{ width: '14px', height: '14px' }}>
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    className="history-action-btn delete-btn"
                    onClick={() => {
                      if (previewImage.id !== undefined) {
                        setDeletingId(previewImage.id);
                        setPreviewImage(null);
                      }
                    }}
                    title="Delete image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2-icon lucide-trash-2">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



