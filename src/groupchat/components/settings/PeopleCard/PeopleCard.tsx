import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { CollabRoom } from '../../../api';
import '../SharedSettings.css';
import './PeopleCard.css';

interface PeopleCardProps {
  isOpen: boolean;
  onClose: () => void;
  room: CollabRoom;
  isCoAdmin: boolean;
  onlineUsers: { userId: string; userName: string; isTyping: boolean; presenceKey?: string }[];
  coAdmins: string[];
  currentUserId?: string;
  onToggleCoAdmin?: (userId: string) => void;
  onKickUser?: (userId: string) => void;
}

export function PeopleCard({
  isOpen,
  onClose,
  room,
  isCoAdmin,
  onlineUsers,
  coAdmins,
  currentUserId,
  onToggleCoAdmin,
  onKickUser,
}: PeopleCardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredUsers = onlineUsers.filter((u) =>
    u.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return createPortal(
    <div className="room-navbar-modal-overlay" onClick={onClose}>
      <div className="room-navbar-modal-container wide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="room-navbar-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2>People & Members</h2>
          </div>

          {/* Search Box placed inside top header next to heading */}
          <div className="submodal-search-wrapper header-search">
            <input
              type="text"
              className="submodal-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              autoFocus
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <button className="room-navbar-modal-close-btn" onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="room-navbar-modal-body">
          {/* Members Feed List */}
          <div className="submodal-members-feed">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => {
                const isUserCreator = u.userId === room.created_by;
                const isUserCoAdmin = isUserCreator || coAdmins.includes(u.userId);
                return (
                  <div key={u.presenceKey || u.userId} className="submodal-member-row">
                    {/* Left side: Avatar + Name */}
                    <div className="submodal-member-left">
                      <div className="submodal-member-avatar">
                        {u.userName.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="submodal-member-name">
                        {u.userName} {u.userId === currentUserId && '(You)'}
                      </span>
                    </div>

                    {/* Right side: Badge + Action Icons at border */}
                    <div className="submodal-member-right">
                      <div className="submodal-badges-group">
                        {isUserCoAdmin ? (
                          <span className="badge-chip admin">Admin</span>
                        ) : (
                          <span className="badge-chip member">Member</span>
                        )}
                        {u.isTyping && <span className="typing-chip">typing...</span>}
                      </div>

                      {isCoAdmin && u.userId !== currentUserId && !isUserCreator && (
                        <div className="submodal-member-actions">
                          {/* Toggle Admin Button */}
                          <button 
                            type="button"
                            className={`submodal-coadmin-icon-btn ${isUserCoAdmin ? 'active' : ''}`}
                            onClick={() => onToggleCoAdmin?.(u.userId)}
                            title={isUserCoAdmin ? "Dismiss Admin" : "Make Admin"}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill={isUserCoAdmin ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                          </button>

                          {/* Kick Button */}
                          <button 
                            type="button"
                            className="submodal-kick-icon-btn"
                            onClick={() => onKickUser?.(u.userId)}
                            title="Remove from room"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <line x1="17" y1="8" x2="22" y2="13" />
                              <line x1="22" y1="8" x2="17" y2="13" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="submodal-empty-search-state">
                No members found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
