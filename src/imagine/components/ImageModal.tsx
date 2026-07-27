import type { ImageData } from '../utils/types';

interface ImageModalProps {
  activeImage: ImageData;
  onClose: () => void;
  onCopyPrompt: (prompt: string) => void;
}

export function ImageModal({ activeImage, onClose, onCopyPrompt }: ImageModalProps) {
  return (
    <div className="imagine-modal-overlay" onClick={onClose}>
      <div className="imagine-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="modal-body-split">
          <div className="modal-image-panel">
            <img src={activeImage.url} alt={activeImage.prompt} className="modal-img-preview" />
          </div>
          <div className="modal-info-panel">
            <h3>Text Prompt</h3>
            <p className="modal-prompt-display">{activeImage.prompt}</p>
            <div className="modal-action-row">
              <button 
                className="modal-action-button primary" 
                onClick={() => onCopyPrompt(activeImage.prompt)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="btn-icon">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy Prompt</span>
              </button>
              <a 
                href={activeImage.url} 
                download={`imagine-${Date.now()}.png`} 
                target="_blank" 
                rel="noreferrer"
                className="modal-action-button secondary"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="btn-icon">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download HD</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
