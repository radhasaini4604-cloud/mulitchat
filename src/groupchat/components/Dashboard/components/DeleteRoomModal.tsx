import { createPortal } from 'react-dom';
import type { CollabRoom } from '../../../api';
import './DeleteRoomModal.css';

interface DeleteRoomModalProps {
  roomsToDelete: CollabRoom[];
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteRoomModal({ roomsToDelete, onCancel, onConfirm }: DeleteRoomModalProps) {
  if (roomsToDelete.length === 0) return null;

  return createPortal(
    <div className="groupchat-modal-overlay" onClick={onCancel}>
      <div className="groupchat-modal-container delete-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="groupchat-modal-header">
          <h2>Delete {roomsToDelete.length > 1 ? 'Collaborations' : 'Collaboration'}</h2>
          <button className="groupchat-modal-close-btn" onClick={onCancel}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="groupchat-modal-body delete-modal-body">
          <p className="delete-warning-text">
            {roomsToDelete.length > 1 ? (
              <>
                Are you sure you want to delete the <strong>{roomsToDelete.length} selected collaborations</strong>? This action will permanently remove all selected rooms and cannot be undone.
              </>
            ) : (
              <>
                Are you sure you want to delete <strong>{roomsToDelete[0].title}</strong>? This action cannot be undone.
              </>
            )}
          </p>
          <div className="delete-modal-actions">
            <button className="delete-cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button className="delete-confirm-btn" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
