import type { ImageData } from '../utils/types';
import { ImageWithSkeleton } from './ImageWithSkeleton';

interface CreationsMasonryProps {
  images: ImageData[];
  onCopyPrompt: (prompt: string) => void;
  title?: string;
  subtext?: string;
}

export function CreationsMasonry({ 
  images, 
  onCopyPrompt,
  title = "Community Showroom",
  subtext = "Original Aspect Ratios Preserved"
}: CreationsMasonryProps) {
  // Helper to extract a 2-3 word name of the image
  const getImageName = (prompt: string) => {
    if (!prompt) return '';
    const words = prompt.trim().split(/\s+/).filter(Boolean);
    if (words.length <= 3) {
      return prompt;
    }
    return words.slice(0, 3).join(' ') + '...';
  };

  return (
    <section className="imagine-section gallery-section">
      <div className="imagine-section-header">
        <h2 className="imagine-section-title">{title}</h2>
        <span className="section-subtext">{subtext}</span>
      </div>

      <div className="masonry-grid">
        {images.map((img, idx) => (
          <div 
            key={`gallery-${idx}-${img.url}`} 
            className="masonry-card"
          >
            <div className="masonry-image-wrapper">
              <ImageWithSkeleton src={img.url} alt={img.prompt} className="masonry-img" ratio={img.ratio} />
              <div className="card-hover-overlay">
                <div className="card-action-bar">
                  <button 
                    className="card-action-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyPrompt(img.url);
                    }}
                    title="Copy image"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="btn-icon">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  </button>
                  <a 
                    className="card-action-btn" 
                    onClick={(e) => e.stopPropagation()}
                    title="Download image"
                    href={img.url}
                    target="_blank"
                    rel="noreferrer"
                    download={`imagine-${Date.now()}.png`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="btn-icon">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>
                </div>
                <p className="card-prompt-text">{getImageName(img.prompt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
