import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CollabAnnouncement } from '../../api';
import './Announcement.css';

interface AnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: CollabAnnouncement[];
  isCoAdmin: boolean;
  onAddAnnouncement: (text: string) => void;
  onDeleteAnnouncement: (id: string) => void;
}

const FUNNY_EMPTY_LINES = [
  "The next announcement will arrive before GTA 6... probably 💀",
  "Breaking News: There is no news. Literally crickets in here 😭",
  "We searched the entire galaxy... still 0 announcements 🗿",
  "This feed has less activity than my gym membership 📉",
  "Admin is currently AFK... main character energy on pause 🥱",
  "No tea to spill here yet... check back later bestie 💅",
  "Zero announcements found. Not very demure, not very mindful 🗣️",
];

export function Announcement({
  isOpen,
  onClose,
  announcements,
  isCoAdmin,
  onAddAnnouncement,
  onDeleteAnnouncement,
}: AnnouncementProps) {
  const [inputText, setInputText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [emptyLine, setEmptyLine] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsAnimatingOut(false);
      const randomIndex = Math.floor(Math.random() * FUNNY_EMPTY_LINES.length);
      setEmptyLine(FUNNY_EMPTY_LINES[randomIndex]);
    } else if (isRendered) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsAnimatingOut(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  if (!isRendered) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isPosting) return;
    setIsPosting(true);
    try {
      await onAddAnnouncement(inputText.trim());
      setInputText('');
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch {
      return dateStr;
    }
  };

  const isDarkMode = typeof document !== 'undefined' && document.body.classList.contains('dark-mode');

  return createPortal(
    <div className={`announcement-drawer-overlay ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isAnimatingOut ? 'closing' : ''}`} onClick={onClose}>
      <div className={`announcement-drawer-container ${isAnimatingOut ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="announcement-drawer-header">
          <div className="announcement-drawer-header-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 7.99992V11.9999M10.25 5.49991H6.8C5.11984 5.49991 4.27976 5.49991 3.63803 5.82689C3.07354 6.11451 2.6146 6.57345 2.32698 7.13794C2 7.77968 2 8.61976 2 10.2999L2 11.4999C2 12.4318 2 12.8977 2.15224 13.2653C2.35523 13.7553 2.74458 14.1447 3.23463 14.3477C3.60218 14.4999 4.06812 14.4999 5 14.4999V18.7499C5 18.9821 5 19.0982 5.00963 19.1959C5.10316 20.1455 5.85441 20.8968 6.80397 20.9903C6.90175 20.9999 7.01783 20.9999 7.25 20.9999C7.48217 20.9999 7.59826 20.9999 7.69604 20.9903C8.64559 20.8968 9.39685 20.1455 9.49037 19.1959C9.5 19.0982 9.5 18.9821 9.5 18.7499V14.4999H10.25C12.0164 14.4999 14.1772 15.4468 15.8443 16.3556C16.8168 16.8857 17.3031 17.1508 17.6216 17.1118C17.9169 17.0756 18.1402 16.943 18.3133 16.701C18.5 16.4401 18.5 15.9179 18.5 14.8736V5.1262C18.5 4.08191 18.5 3.55976 18.3133 3.2988C18.1402 3.05681 17.9169 2.92421 17.6216 2.88804C17.3031 2.84903 16.8168 3.11411 15.8443 3.64427C14.1772 4.55302 12.0164 5.49991 10.25 5.49991Z" />
            </svg>
            <h3>Announcements</h3>
          </div>
          <button type="button" className="announcement-drawer-close-btn" onClick={onClose} aria-label="Close panel" title="Close panel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Announcements List Feed */}
        <div className="announcement-drawer-feed">
          {announcements.length === 0 ? (
            <div className="announcement-drawer-empty">
              <div className="empty-svg-icon">
                <svg fill="currentColor" width="56" height="56" viewBox="0 0 128 128">
                  <g>
                    <circle cx="39.2" cy="17.9" r="12.6"></circle>
                    <path d="M78.6,70.2l-21.2,0l-5.7-28.4c-3.4-14.8-24.2-10.4-22,4.1l6.6,33c1,5,5,9.3,11.3,9.3h27.1c0,0,0,21.2,0,30 c0,9.5,13.3,9.5,13.3,0.2V79.7C88,75.1,84.8,70.2,78.6,70.2z"></path>
                    <path d="M64.7,90.6H46.9c-6.4,0-11.8-3.8-13.4-11l-5.8-28.2c-1.4-6.9-11.1-4.6-9.8,2.1L24,82.9c2.5,11,11.9,18.1,21.4,18.1h19.5 C71.7,101,71.7,90.6,64.7,90.6z"></path>
                    <path d="M91.1,3.9c-11.2,0-20.3,9.1-20.3,20.3c0,11.2,9.1,20.3,20.3,20.3c11.2,0,20.3-9.1,20.3-20.3C111.4,13.1,102.3,3.9,91.1,3.9 z M91.1,40.7c-9.1,0-16.5-7.4-16.5-16.5c0-9.1,7.4-16.5,16.5-16.5c9.1,0,16.5,7.4,16.5,16.5C107.5,33.3,100.1,40.7,91.1,40.7z"></path>
                    <path d="M99.5,20l-8,3.6v-9.4c0-1.5-2.2-1.4-2.2,0l0,11.3c0,0.8,0.9,1.5,1.7,1l9.4-4.5C101.7,21.3,100.9,19.3,99.5,20z"></path>
                  </g>
                </svg>
              </div>
              <p className="funny-empty-line">{emptyLine}</p>
            </div>
          ) : (
            announcements.map((ann) => (
              <div key={ann.id} className="announcement-item-wrapper">
                <div className="announcement-card-meta">
                  <div className="announcement-meta-info">
                    <span className="announcement-sender">{ann.sender_name}</span>
                    <span className="announcement-time">{formatDate(ann.created_at)}</span>
                  </div>
                  {isCoAdmin && (
                    <button
                      type="button"
                      className="announcement-delete-btn"
                      onClick={() => onDeleteAnnouncement(ann.id)}
                      title="Delete Announcement"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="announcement-card-pill">{ann.text}</div>
              </div>
            ))
          )}
        </div>

        {/* Admin Composer Section (At the Bottom - Pill Shaped) */}
        {isCoAdmin && (
          <div className="announcement-drawer-footer">
            <form className="announcement-pill-composer" onSubmit={handleSubmit}>
              <input
                type="text"
                className="announcement-pill-input"
                placeholder="Post an announcement..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                type="submit"
                className="announcement-pill-send-btn"
                disabled={!inputText.trim() || isPosting}
                aria-label="Post Announcement"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
