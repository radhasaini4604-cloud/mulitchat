import { useState, memo } from 'react';
import './FeedbackModal.css';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: string, details: string) => Promise<void>;
  isSubmitting: boolean;
}

export const FeedbackModal = memo(function FeedbackModal({ isOpen, onClose, onSubmit, isSubmitting }: FeedbackModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  if (!isOpen) return null;

  const categories = [
    'Incorrect or incomplete',
    'Not what I asked for',
    'Slow or buggy',
    'Style or tone',
    'Safety or legal concern',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedCategory, details);
  };

  const handlePillClick = (cat: string) => {
    if (selectedCategory === cat) {
      setSelectedCategory(''); // toggle off if clicked again
    } else {
      setSelectedCategory(cat);
    }
  };

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <div className="feedback-modal-header">
          <h3 className="feedback-modal-title">Share feedback</h3>
          <button 
            type="button" 
            className="feedback-modal-close-btn" 
            onClick={onClose}
            aria-label="Close feedback modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="feedback-category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`feedback-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handlePillClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <textarea
            className="feedback-details-textarea"
            placeholder="Share details (optional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <div className="feedback-info-banner">
            Your conversation will be included with your feedback to help improve Nothric. <a href="#" onClick={(e) => e.preventDefault()}>Learn more</a>
          </div>

          <div className="feedback-modal-footer">
            <button
              type="submit"
              className="feedback-modal-submit-btn"
              disabled={isSubmitting || !selectedCategory}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
