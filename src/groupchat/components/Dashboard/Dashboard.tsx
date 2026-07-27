import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../api';
import type { CollabRoom } from '../../api';

import { RoomCard } from './components/RoomCard';
import { AllRoomsModal } from './components/AllRoomsModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { RoomPreviewModal } from './components/RoomPreviewModal';
import { DeleteRoomModal } from './components/DeleteRoomModal';

import './Dashboard.css';

interface DashboardProps {
  onJoinRoom: (code: string) => void;
}

export function Dashboard({ onJoinRoom }: DashboardProps) {
  const { user } = useAuth();
  const [myRooms, setMyRooms] = useState<CollabRoom[]>([]);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [openDropdownRoomId, setOpenDropdownRoomId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [collabAvatar, setCollabAvatar] = useState<string | null>(() => {
    const val = localStorage.getItem('collab-avatar');
    return val === 'null' ? null : val;
  });
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [collabAvatar]);

  const [isAllRoomsModalOpen, setIsAllRoomsModalOpen] = useState(false);
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isAllRoomsModalOpen) {
      setSelectedRoomIds([]);
    }
  }, [isAllRoomsModalOpen]);

  const [isNamingModalOpen, setIsNamingModalOpen] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<CollabRoom | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [previewRoom, setPreviewRoom] = useState<CollabRoom | null>(null);
  const [previewParticipants, setPreviewParticipants] = useState<{ user_id: string; user_name: string }[]>([]);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [roomPassword, setRoomPassword] = useState('');
  const [isIdCopied, setIsIdCopied] = useState(false);
  const [isPasswordCopied, setIsPasswordCopied] = useState(false);
  const [isCreatedRoomClosing, setIsCreatedRoomClosing] = useState(false);
  const [roomsToDelete, setRoomsToDelete] = useState<CollabRoom[]>([]);
  const [renamingRoomId, setRenamingRoomId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAvatarDropdownOpen((prev) => !prev);
  };

  const handleTriggerFileInput = () => {
    avatarInputRef.current?.click();
    setIsAvatarDropdownOpen(false);
  };

  const handleRemoveAvatar = () => {
    setCollabAvatar(null);
    localStorage.removeItem('collab-avatar');
    setIsAvatarDropdownOpen(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCollabAvatar(dataUrl);
      localStorage.setItem('collab-avatar', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const closeAll = () => {
      setIsAvatarDropdownOpen(false);
    };
    window.addEventListener('click', closeAll);
    return () => window.removeEventListener('click', closeAll);
  }, []);

  useEffect(() => {
    if (!openDropdownRoomId) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.room-dropdown') && !target.closest('.three-dots-btn')) {
        setOpenDropdownRoomId(null);
        setMenuPosition(null);
      }
    };

    document.addEventListener('click', handleOutsideClick, true);
    return () => document.removeEventListener('click', handleOutsideClick, true);
  }, [openDropdownRoomId]);

  useEffect(() => {
    if (user?.id) {
      setIsLoadingRooms(true);
      api
        .getUserRooms(user.id)
        .then((rooms) => setMyRooms(rooms))
        .catch((err) => console.error('Failed to load user rooms:', err))
        .finally(() => setIsLoadingRooms(false));
    }
  }, [user]);

  const handleMenuClick = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    if (openDropdownRoomId === roomId) {
      setOpenDropdownRoomId(null);
      setMenuPosition(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setOpenDropdownRoomId(roomId);

      if (isAllRoomsModalOpen) {
        setMenuPosition({
          top: rect.bottom + window.scrollY + 6,
          left: rect.right + window.scrollX - 160,
        });
      } else {
        setMenuPosition({
          top: rect.top - 12,
          left: rect.left + rect.width + 12,
        });
      }
    }
  };

  const handleRenameClick = (roomId: string, currentTitle: string) => {
    setRenamingRoomId(roomId);
    setRenameValue(currentTitle);
    setOpenDropdownRoomId(null);
    setMenuPosition(null);
  };

  const submitRename = async (roomId: string) => {
    if (!renameValue.trim()) {
      setRenamingRoomId(null);
      return;
    }
    const trimmed = renameValue.trim();
    setMyRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, title: trimmed } : r))
    );
    setRenamingRoomId(null);
    try {
      await api.renameRoom(roomId, trimmed);
    } catch (err) {
      console.error('Failed to rename room in database:', err);
    }
  };

  const handlePin = async (roomId: string) => {
    const room = myRooms.find((r) => r.id === roomId);
    if (!room) return;
    const nextPinned = room.pinned === 1 ? 0 : 1;
    setMyRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, pinned: nextPinned } : r))
    );
    try {
      await api.pinRoom(roomId, nextPinned);
    } catch (err) {
      console.error('Failed to pin room in database:', err);
    }
    setOpenDropdownRoomId(null);
    setMenuPosition(null);
  };

  const handleSummarize = (roomId: string, roomTitle: string) => {
    const event = new CustomEvent('request-chat-summary', {
      detail: { sessionId: roomId, chatTitle: roomTitle },
    });
    window.dispatchEvent(event);
    setOpenDropdownRoomId(null);
    setMenuPosition(null);
  };

  const handleDeleteClick = (room: CollabRoom) => {
    setRoomsToDelete([room]);
    setOpenDropdownRoomId(null);
    setMenuPosition(null);
  };

  const handleRoomInfoClick = (room: CollabRoom) => {
    setCreatedRoom(room);
    setIsPasswordEnabled(room.password ? true : false);
    setRoomPassword(room.password || '');
    setOpenDropdownRoomId(null);
    setMenuPosition(null);
  };

  const confirmDelete = async () => {
    if (roomsToDelete.length === 0) return;
    const idsToDelete = roomsToDelete.map((r) => r.id);

    setMyRooms((prev) => prev.filter((r) => !idsToDelete.includes(r.id)));
    setRoomsToDelete([]);
    setSelectedRoomIds((prev) => prev.filter((id) => !idsToDelete.includes(id)));

    try {
      for (const roomId of idsToDelete) {
        await api.deleteRoom(roomId);
      }
    } catch (err) {
      console.error('Failed to delete rooms in database:', err);
    }
  };

  const toggleSelectRoom = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    setSelectedRoomIds((prev) =>
      prev.includes(roomId) ? prev.filter((id) => id !== roomId) : [...prev, roomId]
    );
  };

  const handleDeleteSelectedRooms = () => {
    if (selectedRoomIds.length === 0) return;
    const selectedRooms = myRooms.filter((r) => selectedRoomIds.includes(r.id));
    setRoomsToDelete(selectedRooms);
  };

  const handleCreateRoom = async () => {
    if (!user?.id || isCreatingRoom) return;
    setIsCreatingRoom(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const title = newRoomTitle.trim() || 'Collaborative Discussion';
      const newRoom = await api.createRoom(user.id, title);
      setNewRoomTitle('');

      setMyRooms((prev) => [newRoom, ...prev]);

      setIsPasswordEnabled(false);
      setRoomPassword('');
      setCreatedRoom(newRoom);
      setIsNamingModalOpen(false);
    } catch (err) {
      console.error('Error creating room:', err);
      alert('Failed to create room.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handlePasswordToggle = async () => {
    if (!createdRoom) return;
    const nextEnabled = !isPasswordEnabled;
    setIsPasswordEnabled(nextEnabled);
    if (!nextEnabled) {
      setRoomPassword('');
      try {
        await api.setPassword(createdRoom.id, null);
      } catch (err) {
        console.error('Failed to clear room password:', err);
      }
    } else {
      const autoPass = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomPassword(autoPass);
      try {
        await api.setPassword(createdRoom.id, autoPass);
      } catch (err) {
        console.error('Failed to set room password:', err);
      }
    }
  };

  const handlePasswordChange = async (val: string) => {
    if (!createdRoom) return;
    setRoomPassword(val);
    try {
      await api.setPassword(createdRoom.id, val.trim() || null);
    } catch (err) {
      console.error('Failed to update room password:', err);
    }
  };

  const handleCopyId = () => {
    if (!createdRoom) return;
    navigator.clipboard.writeText(createdRoom.code);
    setIsIdCopied(true);
    setTimeout(() => setIsIdCopied(false), 2000);
  };

  const handleCopyPassword = () => {
    if (!roomPassword) return;
    navigator.clipboard.writeText(roomPassword);
    setIsPasswordCopied(true);
    setTimeout(() => setIsPasswordCopied(false), 2000);
  };

  const handleCloseCreatedRoom = () => {
    setIsCreatedRoomClosing(true);
    setTimeout(() => {
      setCreatedRoom(null);
      setIsCreatedRoomClosing(false);
    }, 200);
  };

  const handleJoinRoomSubmit = async (codeToJoin?: string) => {
    let targetCode = (codeToJoin || joinCode).trim();
    if (!targetCode) return;

    if (targetCode.startsWith('http://') || targetCode.startsWith('https://')) {
      try {
        const urlObj = new URL(targetCode);
        let roomParam = urlObj.searchParams.get('room');

        if (!roomParam && urlObj.hash && urlObj.hash.includes('?')) {
          const hashQuery = urlObj.hash.split('?')[1];
          const hashParams = new URLSearchParams(hashQuery);
          roomParam = hashParams.get('room');
        }

        if (roomParam) {
          targetCode = roomParam;
        } else {
          const segments = urlObj.pathname.split('/').filter(Boolean);
          const last = segments[segments.length - 1];
          if (last && last !== 'groupchat') {
            targetCode = last;
          }
        }
      } catch (e) {
        console.error('Failed to parse pasted invite URL:', e);
      }
    }

    try {
      const room = await api.getRoom(targetCode);
      const participants = await api.getParticipants(room.id);
      setJoinCode('');
      setPreviewParticipants(participants);
      setPreviewRoom(room);
    } catch (_err) {
      alert('Invalid room code or connection failed.');
    }
  };

  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const date = now.toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      setTimeStr(`${time}  •  ${date}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const renderRoomRow = (room: CollabRoom) => (
    <RoomCard
      key={room.id}
      room={room}
      isSelected={selectedRoomIds.includes(room.id)}
      isAllRoomsModalOpen={isAllRoomsModalOpen}
      renamingRoomId={renamingRoomId}
      renameValue={renameValue}
      openDropdownRoomId={openDropdownRoomId}
      menuPosition={menuPosition}
      onJoinRoom={(code) => handleJoinRoomSubmit(code)}
      onToggleSelect={toggleSelectRoom}
      onRenameChange={setRenameValue}
      onSubmitRename={submitRename}
      onCancelRename={() => setRenamingRoomId(null)}
      onMenuClick={handleMenuClick}
      onRenameClick={handleRenameClick}
      onPinClick={handlePin}
      onSummarizeClick={handleSummarize}
      onRoomInfoClick={handleRoomInfoClick}
      onDeleteClick={handleDeleteClick}
    />
  );

  if (previewRoom) {
    return (
      <RoomPreviewModal
        previewRoom={previewRoom}
        previewParticipants={previewParticipants}
        onJoinRoom={onJoinRoom}
        onIgnore={() => setPreviewRoom(null)}
      />
    );
  }

  return (
    <div className="groupchat-container dashboard meet-style">
      {/* Top Left Header (Date / Time) */}
      <div className="dashboard-header-left">
        <span className="header-date">{timeStr}</span>
      </div>

      {/* Top Right Header Bar */}
      <div className="dashboard-header-right">
        <button className="header-icon-btn" onClick={() => {}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="style=stroke">
              <g id="calendar-line">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.25 15.25H22.75V16.75H1.25V15.25Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M1.25 8C1.25 5.37665 3.37665 3.25 6 3.25H18C20.6234 3.25 22.75 5.37665 22.75 8V18C22.75 20.6234 20.6234 22.75 18 22.75H6C3.37665 22.75 1.25 20.6234 1.25 18V8ZM6 4.75C4.20507 4.75 2.75 6.20507 2.75 8V18C2.75 19.7949 4.20507 21.25 6 21.25H18C19.7949 21.25 21.25 19.7949 21.25 18V8C21.25 6.20507 19.7949 4.75 18 4.75H6Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8.25 11.5C8.25 11.0858 8.58579 10.75 9 10.75H15C15.4142 10.75 15.75 11.0858 15.75 11.5C15.75 11.9142 15.4142 12.25 15 12.25H9C8.58579 12.25 8.25 11.9142 8.25 11.5Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M8 1.25C8.41421 1.25 8.75 1.58579 8.75 2V5.5C8.75 5.91421 8.41421 6.25 8 6.25C7.58579 6.25 7.25 5.91421 7.25 5.5V2C7.25 1.58579 7.58579 1.25 8 1.25Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M16 1.25C16.4142 1.25 16.75 1.58579 16.75 2V5.5C16.75 5.91421 16.4142 6.25 16 6.25C15.5858 6.25 15.25 5.91421 15.25 5.5V2C15.25 1.58579 15.5858 1.25 16 1.25Z" fill="currentColor" />
              </g>
            </g>
          </svg>
          <span className="custom-tooltip">Schedule</span>
        </button>

        <button className="header-icon-btn" onClick={() => window.open('/collab-info', '_blank')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="custom-tooltip">About Nothric Collab</span>
        </button>

        <button className="header-icon-btn" onClick={() => (window.location.hash = '#/support')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="12" y1="8" x2="12" y2="11" />
            <line x1="12" y1="14" x2="12.01" y2="14" />
          </svg>
          <span className="custom-tooltip">Feedback / Help</span>
        </button>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
        <div className="avatar-dropdown-wrapper" style={{ position: 'relative' }}>
          <div className="header-user-avatar meet-avatar" title="Manage collab avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
            {!avatarError && collabAvatar ? (
              <img src={collabAvatar} alt="" className="header-user-avatar-img" onError={() => setAvatarError(true)} />
            ) : !avatarError && user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="" className="header-user-avatar-img" onError={() => setAvatarError(true)} />
            ) : (
              user?.email ? user.email[0].toUpperCase() : 'U'
            )}
          </div>
          {isAvatarDropdownOpen && (
            <div className="avatar-dropdown-menu" onClick={(e) => e.stopPropagation()}>
              <button className="avatar-dropdown-item" onClick={handleTriggerFileInput}>
                <svg className="avatar-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                Add logo
              </button>
              <button className="avatar-dropdown-item" onClick={handleRemoveAvatar}>
                <svg className="avatar-dropdown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Remove logo
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="groupchat-dashboard-content">
        <h1 className="groupchat-main-heading">
          Welcome to Nothric Collab
        </h1>
        <p className="groupchat-main-subtitle">
          Where human creativity meets AI intelligence.
        </p>

        <div className="groupchat-action-flow meet-flow">
          <div className="meet-composer-row">
            <button onClick={() => setIsNamingModalOpen(true)} className="meet-pill-btn primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-icon lucide-message-circle">
                <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
              </svg>
              New collab
            </button>

            <div className="meet-input-pill-container">
              <svg className="keyboard-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M18 12h.01M7 16h10M10 12h4" />
              </svg>
              <input
                type="text"
                placeholder="Enter link"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="meet-input"
              />
              <button
                onClick={() => handleJoinRoomSubmit()}
                disabled={!joinCode.trim()}
                className={`meet-join-btn ${joinCode.trim() ? 'active' : ''}`}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="groupchat-rooms-list-section">
          <h3>Recent Collaborations</h3>
          {isLoadingRooms ? (
            <div className="rooms-list skeleton">
              {[1, 2, 3].map((n) => (
                <div key={n} className="room-row skeleton-row">
                  <div className="room-row-left">
                    <div className="skeleton-icon" />
                    <div className="skeleton-text skeleton-title" />
                  </div>
                  <div className="room-row-right">
                    <div className="skeleton-text skeleton-date" />
                  </div>
                </div>
              ))}
            </div>
          ) : myRooms.length === 0 ? (
            <p className="empty-text">Oh, let's connect your first collab!</p>
          ) : (
            <>
              <div className="rooms-list">
                {myRooms.slice(0, 3).map(renderRoomRow)}
              </div>
              {myRooms.length > 3 && (
                <button className="groupchat-show-all-btn" onClick={() => setIsAllRoomsModalOpen(true)}>
                  Show all ({myRooms.length})
                </button>
              )}
            </>
          )}
        </div>

        {/* Stats Section */}
        <div className="groupchat-stats-section">
          <span className="groupchat-stats-title">Your total participation</span>
          <div className="groupchat-stats-columns">
            <div className="groupchat-stat-col">
              <span className="groupchat-stat-number">{myRooms.filter((r) => r.created_by === user?.id).length}</span>
              <span className="groupchat-stat-label">Created</span>
            </div>
            <div className="groupchat-stat-col">
              <span className="groupchat-stat-number">{myRooms.filter((r) => r.created_by !== user?.id).length}</span>
              <span className="groupchat-stat-label">Joined</span>
            </div>
            <div className="groupchat-stat-col">
              <span className="groupchat-stat-number">{myRooms.length}</span>
              <span className="groupchat-stat-label">Overall</span>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="groupchat-footer-links">
          <a href="/support" className="groupchat-footer-link">Help</a>
          <span className="groupchat-footer-dot">·</span>
          <a href="/support" className="groupchat-footer-link">Feedback</a>
          <span className="groupchat-footer-dot">·</span>
          <a href="/terms" className="groupchat-footer-link">Terms & Conditions</a>
        </div>
      </div>

      <AllRoomsModal
        isOpen={isAllRoomsModalOpen}
        onClose={() => setIsAllRoomsModalOpen(false)}
        myRooms={myRooms}
        selectedRoomIds={selectedRoomIds}
        onSelectAll={() => setSelectedRoomIds(myRooms.map((r) => r.id))}
        onDeselectAll={() => setSelectedRoomIds([])}
        onDeleteSelected={handleDeleteSelectedRooms}
        renderRoomRow={renderRoomRow}
      />

      <CreateRoomModal
        isNamingModalOpen={isNamingModalOpen}
        onCloseNamingModal={() => setIsNamingModalOpen(false)}
        newRoomTitle={newRoomTitle}
        onChangeTitle={setNewRoomTitle}
        onCreateRoom={handleCreateRoom}
        isCreatingRoom={isCreatingRoom}
        createdRoom={createdRoom}
        isCreatedRoomClosing={isCreatedRoomClosing}
        onCloseCreatedRoom={handleCloseCreatedRoom}
        isPasswordEnabled={isPasswordEnabled}
        roomPassword={roomPassword}
        onTogglePassword={handlePasswordToggle}
        onChangePassword={handlePasswordChange}
        isIdCopied={isIdCopied}
        isPasswordCopied={isPasswordCopied}
        onCopyId={handleCopyId}
        onCopyPassword={handleCopyPassword}
        onJoinRoom={onJoinRoom}
      />

      <DeleteRoomModal
        roomsToDelete={roomsToDelete}
        onCancel={() => setRoomsToDelete([])}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
