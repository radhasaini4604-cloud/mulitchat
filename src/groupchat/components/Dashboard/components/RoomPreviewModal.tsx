import type { CollabRoom } from '../../../api';
import './RoomPreviewModal.css';

interface RoomPreviewModalProps {
  previewRoom: CollabRoom | null;
  previewParticipants: { user_id: string; user_name: string }[];
  onJoinRoom: (code: string) => void;
  onIgnore: () => void;
}

export function RoomPreviewModal({
  previewRoom,
  previewParticipants,
  onJoinRoom,
  onIgnore,
}: RoomPreviewModalProps) {
  if (!previewRoom) return null;

  const uniqueParticipants: { user_id: string; user_name: string }[] = [];
  const seenIds = new Set<string>();
  for (const p of previewParticipants) {
    if (!seenIds.has(p.user_id)) {
      seenIds.add(p.user_id);
      uniqueParticipants.push(p);
    }
  }

  const participantNames = uniqueParticipants.map((p) => p.user_name);
  const memberCount = uniqueParticipants.length;

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const avatarColors = [
    '#eab308', // Yellow
    '#3b82f6', // Blue
    '#10b981', // Green
    '#ec4899', // Pink
    '#8b5cf6', // Purple
  ];

  const formatParticipantString = () => {
    if (participantNames.length === 0) return 'No members yet';
    if (participantNames.length === 1) return participantNames[0];
    if (participantNames.length === 2) return `${participantNames[0]} and ${participantNames[1]}`;
    return `${participantNames[0]}, ${participantNames[1]} ... etc.`;
  };

  return (
    <div className="groupchat-join-preview-screen">
      <div className="join-preview-content">
        <div className="join-preview-main">
          {/* Overlapping Avatar circles */}
          <div className="preview-avatars-row">
            {uniqueParticipants.slice(0, 3).map((part, index) => (
              <div
                key={part.user_id}
                className="preview-avatar-circle"
                style={{
                  backgroundColor: avatarColors[index % avatarColors.length],
                  zIndex: 10 - index,
                }}
              >
                {getInitials(part.user_name)}
              </div>
            ))}
            {uniqueParticipants.length > 3 && (
              <div
                className="preview-avatar-circle count-more"
                style={{
                  backgroundColor: 'var(--groupchat-item-hover-bg)',
                  zIndex: 1,
                }}
              >
                +{uniqueParticipants.length - 3}
              </div>
            )}
          </div>

          <h2 className="preview-heading">
            Nothric with {formatParticipantString()}
          </h2>

          <h3 className="preview-room-title">{previewRoom.title}</h3>
          <p className="preview-room-subtitle">Number of members currently in the room: {memberCount}</p>

          <div className="preview-buttons-group">
            <button
              className="preview-join-btn"
              onClick={() => {
                const roomCode = previewRoom.code;
                onIgnore();
                onJoinRoom(roomCode);
              }}
            >
              Join group chat
            </button>
            <button className="preview-ignore-btn" onClick={onIgnore}>
              Ignore
            </button>
          </div>
        </div>

        <div className="preview-footer">
          <p>Your personal Nothric memory is never used in group chats.</p>
          <button
            className="preview-learn-more-btn"
            onClick={() =>
              alert(
                'Nothric Collab provides sandboxed environment sessions. Your chat personalization and custom memory context from personal workspace screens is completely isolated.'
              )
            }
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}
