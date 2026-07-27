import React from 'react';
import type { CollabRoom } from '../../../api';
import { PinIcon } from '../../../../components/icons/PinIcon';
import { RoomContextMenu } from './RoomContextMenu';
import './RoomCard.css';

interface RoomCardProps {
  room: CollabRoom;
  isSelected: boolean;
  isAllRoomsModalOpen: boolean;
  renamingRoomId: string | null;
  renameValue: string;
  openDropdownRoomId: string | null;
  menuPosition: { top: number; left: number } | null;
  onJoinRoom: (code: string) => void;
  onToggleSelect: (e: React.MouseEvent, roomId: string) => void;
  onRenameChange: (val: string) => void;
  onSubmitRename: (roomId: string) => void;
  onCancelRename: () => void;
  onMenuClick: (e: React.MouseEvent, roomId: string) => void;
  onRenameClick: (roomId: string, title: string) => void;
  onPinClick: (roomId: string) => void;
  onSummarizeClick: (roomId: string, title: string) => void;
  onRoomInfoClick: (room: CollabRoom) => void;
  onDeleteClick: (room: CollabRoom) => void;
}

export function RoomCard({
  room,
  isSelected,
  isAllRoomsModalOpen,
  renamingRoomId,
  renameValue,
  openDropdownRoomId,
  menuPosition,
  onJoinRoom,
  onToggleSelect,
  onRenameChange,
  onSubmitRename,
  onCancelRename,
  onMenuClick,
  onRenameClick,
  onPinClick,
  onSummarizeClick,
  onRoomInfoClick,
  onDeleteClick,
}: RoomCardProps) {
  return (
    <div
      key={room.id}
      className={`room-row ${isAllRoomsModalOpen && isSelected ? 'selected-row' : ''}`}
      onClick={() => onJoinRoom(room.code)}
    >
      <div className="room-row-left">
        <div
          className={`room-icon-select-wrapper ${isAllRoomsModalOpen ? 'active' : ''}`}
          onClick={(e) => {
            if (isAllRoomsModalOpen) {
              onToggleSelect(e, room.id);
            }
          }}
        >
          <svg
            className={`room-row-icon ${isSelected ? 'selected' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isAllRoomsModalOpen && isSelected ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
          </svg>
        </div>
        {renamingRoomId === room.id ? (
          <input
            type="text"
            value={renameValue}
            onChange={(e) => onRenameChange(e.target.value)}
            className="room-row-rename-input"
            autoFocus
            onClick={(e) => e.stopPropagation()}
            onBlur={() => onSubmitRename(room.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSubmitRename(room.id);
              } else if (e.key === 'Escape') {
                onCancelRename();
              }
            }}
          />
        ) : (
          <>
            <span className="room-row-name">{room.title}</span>
            {room.pinned === 1 && (
              <PinIcon
                className="room-pinned-indicator"
                size={12}
                style={{ color: 'var(--groupchat-text-muted)', marginLeft: '6px', transform: 'rotate(45deg)' }}
              />
            )}
          </>
        )}
      </div>
      <div className="room-row-right" onClick={(e) => e.stopPropagation()}>
        <span className="room-row-date">
          {new Date(room.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>

        <div className="dropdown-wrapper">
          <button
            className={`three-dots-btn ${openDropdownRoomId === room.id ? 'active' : ''}`}
            title="Actions"
            onClick={(e) => onMenuClick(e, room.id)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {openDropdownRoomId === room.id && menuPosition && (
            <RoomContextMenu
              room={room}
              menuPosition={menuPosition}
              isAllRoomsModalOpen={isAllRoomsModalOpen}
              onRename={() => onRenameClick(room.id, room.title)}
              onPin={() => onPinClick(room.id)}
              onSummarize={() => onSummarizeClick(room.id, room.title)}
              onRoomInfo={() => onRoomInfoClick(room)}
              onDelete={() => onDeleteClick(room)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
