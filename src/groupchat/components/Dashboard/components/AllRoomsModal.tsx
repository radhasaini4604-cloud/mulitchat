import React from 'react';
import { createPortal } from 'react-dom';
import type { CollabRoom } from '../../../api';
import './AllRoomsModal.css';

interface AllRoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  myRooms: CollabRoom[];
  selectedRoomIds: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  renderRoomRow: (room: CollabRoom) => React.ReactNode;
}

export function AllRoomsModal({
  isOpen,
  onClose,
  myRooms,
  selectedRoomIds,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  renderRoomRow,
}: AllRoomsModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="groupchat-modal-overlay" onClick={onClose}>
      <div className="groupchat-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="groupchat-modal-header">
          <h2>All Collaborations</h2>
          <button className="groupchat-modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="groupchat-modal-body">
          {/* Bulk Actions Toolbar */}
          <div className="rooms-bulk-actions">
            <button
              className="bulk-action-btn select-all"
              onClick={onSelectAll}
              title="Select All"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-dashed-mouse-pointer-icon lucide-square-dashed-mouse-pointer">
                <path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z" />
                <path d="M5 3a2 2 0 0 0-2 2" />
                <path d="M19 3a2 2 0 0 1 2 2" />
                <path d="M5 21a2 2 0 0 1-2-2" />
                <path d="M9 3h1" />
                <path d="M9 21h2" />
                <path d="M14 3h1" />
                <path d="M3 9v1" />
                <path d="M21 9v2" />
                <path d="M3 14v1" />
              </svg>
              <span>Select All</span>
            </button>
            <button
              className="bulk-action-btn deselect-all"
              onClick={onDeselectAll}
              title="Deselect All"
              disabled={selectedRoomIds.length === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-dashed-top-solid-icon lucide-square-dashed-top-solid">
                <path d="M14 21h1" />
                <path d="M21 14v1" />
                <path d="M21 19a2 2 0 0 1-2 2" />
                <path d="M21 9v1" />
                <path d="M3 14v1" />
                <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" />
                <path d="M3 9v1" />
                <path d="M5 21a2 2 0 0 1-2-2" />
                <path d="M9 21h1" />
              </svg>
              <span>Deselect All</span>
            </button>
            {selectedRoomIds.length > 0 && (
              <button
                className="bulk-action-btn delete-selected"
                onClick={onDeleteSelected}
                title={`Delete Selected (${selectedRoomIds.length})`}
              >
                <svg width="14" height="14" viewBox="0 0 24.00 24.00" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <g strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-576.000000, -192.000000)" fillRule="nonzero">
                      <g transform="translate(576.000000, 192.000000)">
                        <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fillRule="nonzero"></path>
                        <path d="M14.2792,2 C15.1401,2 15.9044,2.55086 16.1766,3.36754 L16.7208,5 L20,5 C20.5523,5 21,5.44772 21,6 C21,6.55227 20.5523,6.99998 20,7 L19.9975,7.07125 L19.9975,7.07125 L19.1301,19.2137 C19.018,20.7837 17.7117,22 16.1378,22 L7.86224,22 C6.28832,22 4.982,20.7837 4.86986,19.2137 L4.00254,7.07125 C4.00083,7.04735 3.99998,7.02359 3.99996,7 C3.44769,6.99998 3,6.55227 3,6 C3,5.44772 3.44772,5 4,5 L7.27924,5 L7.82339,3.36754 C8.09562,2.55086 8.8599,2 9.72076,2 L14.2792,2 Z M17.9975,7 L6.00255,7 L6.86478,19.0712 C6.90216,19.5946 7.3376,20 7.86224,20 L16.1378,20 C16.6624,20 17.0978,19.5946 17.1352,19.0712 L17.9975,7 Z M10,10 C10.51285,10 10.9355092,10.386027 10.9932725,10.8833761 L11,11 L11,16 C11,16.5523 10.5523,17 10,17 C9.48715929,17 9.06449214,16.613973 9.00672766,16.1166239 L9,16 L9,11 C9,10.4477 9.44771,10 10,10 Z M14,10 C14.5523,10 15,10.4477 15,11 L15,16 C15,16.5523 14.5523,17 14,17 C13.4477,17 13,16.5523 13,16 L13,11 C13,10.4477 13.4477,10 14,10 Z M14.2792,4 L9.72076,4 L9.38743,5 L14.6126,5 L14.2792,4 Z" fill="currentColor"></path>
                      </g>
                    </g>
                  </g>
                </svg>
                <span>Delete Selected ({selectedRoomIds.length})</span>
              </button>
            )}
          </div>

          <div className="rooms-list modal-list">
            {myRooms.map(renderRoomRow)}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
