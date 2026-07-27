import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CollabMessage } from '../../api';
import { CompletedRenderer } from '../../../Main_chat/renderers/CompletedRenderer';
import { ttsEngine } from '../../../lib/ttsEngine';
import { getModelLogo } from '../../../shared/modelLogos';
import { Reactions } from '../Reactions/Reactions';
import './MessageItem.css';

const ThumbsIcon = ({ isFlipped = false, isFilled = false }: { isFlipped?: boolean; isFilled?: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 772 712"
    style={{
      transform: isFlipped ? 'scale(-1, -1)' : 'none',
      display: 'block',
      color: 'currentColor',
      transition: 'transform 0.2s ease'
    }}
  >
    <g
      fill={isFilled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={isFilled ? "0" : "32"}
    >
      <path
        d="M0 0 C20.39149193 12.75022362 31.56595777 33.45334855 37 56.26416016 C38.88680613 65.40222121 39.03798321 74.38810012 39.046875 83.68603516 C39.04788208 84.41663147 39.04888916 85.14722778 39.04992676 85.89996338 C39.03791822 98.8377552 38.07411113 111.37052205 35.796875 124.12353516 C35.65765625 124.94418457 35.5184375 125.76483398 35.375 126.61035156 C33.75975604 135.94848072 31.36397723 144.78669006 28.15625 153.70556641 C27.83253418 154.61745728 27.50881836 155.52934814 27.17529297 156.46887207 C26.3866348 158.68861015 25.59378399 160.90674882 24.796875 163.12353516 C26.76979774 163.15112663 26.76979774 163.15112663 28.78257751 163.17927551 C41.24210159 163.35532344 53.70133142 163.54592823 66.16042233 163.7504015 C72.56414163 163.85503906 78.96785477 163.95473456 85.37182617 164.04272461 C91.56421767 164.1279963 97.75626549 164.22678657 103.94830513 164.33453941 C106.29823106 164.37313558 108.64823927 164.40704617 110.99830437 164.43595314 C141.94382825 164.82443549 167.33255019 170.46052427 190.390625 192.61572266 C205.77762265 208.62009984 214.24372138 228.98180154 214.24197388 251.18103027 C213.99423056 263.56003038 211.21502292 275.55316702 208.671875 287.62353516 C208.15797262 290.13594908 207.64585993 292.64872972 207.13549805 295.16186523 C205.91724195 301.13988066 204.67759348 307.11317345 203.42950439 313.08502197 C202.60899058 317.02594229 201.80753877 320.97053676 201.01171875 324.91650391 C199.64513209 331.66053116 198.23083553 338.39354148 196.796875 345.12353516 C196.48871974 346.57551027 196.18061738 348.02749661 195.87255859 349.47949219 C193.55887002 360.37076661 191.20312209 371.25233007 188.796875 382.12353516 C188.37873535 384.01483154 188.37873535 384.01483154 187.95214844 385.94433594 C181.07153459 416.736575 169.7984435 443.98812852 142.23828125 461.99072266 C128.35081315 470.73978819 112.47483438 476.83668078 95.93286133 477.43554688 C94.80007248 477.47688751 93.66728363 477.51822815 92.50016785 477.56082153 C90.67670586 477.61893509 90.67670586 477.61893509 88.81640625 477.67822266 C87.53868851 477.72026825 86.26097076 477.76231384 84.9445343 477.80563354 C72.05799585 478.20797312 59.17289172 478.27557831 46.28051758 478.25390625 C42.440228 478.24847269 38.60005205 478.25393645 34.75976562 478.26025391 C-19.84582336 478.28045884 -72.54170323 467.79433754 -123.40625 447.99853516 C-124.58993164 447.53833984 -125.77361328 447.07814453 -126.99316406 446.60400391 C-134.60154619 443.09493567 -139.04694857 438.30352485 -142.32453728 430.73119164 C-143.86092294 426.17118479 -143.91433106 421.66244767 -144.01586914 416.88452148 C-144.05351568 415.76623396 -144.09116222 414.64794643 -144.12994957 413.49577141 C-144.24951951 409.71183082 -144.338888 405.92789064 -144.42578125 402.14306641 C-144.4619456 400.78701187 -144.49883824 399.43097658 -144.53642464 398.07496071 C-145.58459666 359.98551023 -145.61238205 321.87233401 -145.62739789 283.77118194 C-145.62781509 282.72399903 -145.62823228 281.67681612 -145.62866211 280.59790039 C-145.62906766 279.54900513 -145.6294732 278.50010987 -145.62989104 277.4194299 C-145.63533215 268.77051236 -145.66731322 260.12182179 -145.70406669 251.47298878 C-145.73874564 243.00877671 -145.75420936 234.54466716 -145.75490814 226.08038455 C-145.75569542 221.07747634 -145.7641972 216.07489035 -145.79290581 211.07205772 C-145.81907739 206.41638774 -145.82129734 201.7613104 -145.80525017 197.10560036 C-145.80344083 195.40848618 -145.81007962 193.71133731 -145.82606888 192.01429749 C-145.91960184 181.44318672 -145.40107284 172.6595609 -137.80078125 164.56494141 C-136.96417969 163.94490234 -136.12757813 163.32486328 -135.265625 162.68603516 C-134.31300781 161.95771484 -133.36039062 161.22939453 -132.37890625 160.47900391 C-131.33089844 159.70169922 -130.28289062 158.92439453 -129.203125 158.12353516 C-126.77529446 156.26275963 -124.36274801 154.38280711 -121.953125 152.49853516 C-121.35105225 152.02971924 -120.74897949 151.56090332 -120.12866211 151.07788086 C-116.42772756 148.16996707 -113.0112102 145.15388407 -109.7734375 141.72900391 C-108.00774601 139.92378201 -106.13065859 138.31674323 -104.203125 136.68603516 C-100.11407449 133.13749132 -96.62004324 129.31766226 -93.203125 125.12353516 C-92.4296875 124.17607422 -91.65625 123.22861328 -90.859375 122.25244141 C-80.96152797 109.8868908 -73.57248183 97.01917023 -68.203125 82.12353516 C-67.88601563 81.30369141 -67.56890625 80.48384766 -67.2421875 79.63916016 C-63.26557487 68.85112193 -62.97064568 57.43529199 -62.85461426 46.06570435 C-62.39693038 9.26908022 -62.39693038 9.26908022 -51.31640625 -2.95849609 C-36.44353694 -16.86817006 -15.30916429 -9.02655529 0 0 Z"
        transform="translate(439.203125,143.87646484375)"
      />
      <path
        d="M0 0 C7.06591488 6.77309318 11.08715973 12.51728747 11.37854004 22.43531799 C11.39581264 25.07720231 11.39713054 27.71604269 11.38476562 30.35766602 C11.38893967 31.82364581 11.39447066 33.28962226 11.40124416 34.75559235 C11.41309074 37.92024978 11.4156644 41.08473091 11.41108513 44.24940681 C11.40398176 49.33190999 11.41843563 54.4142189 11.43592834 59.49668884 C11.45909389 66.75381485 11.47372269 74.01090927 11.48245239 81.26806641 C11.5064496 100.02392027 11.58847494 118.77954376 11.68359375 137.53515625 C11.68814536 138.45992594 11.69269697 139.38469563 11.6973865 140.33748865 C11.89969555 181.08444783 12.82754018 221.78399177 14.56813049 262.49656677 C15.86161761 293.02430844 15.86161761 293.02430844 6 304 C-7.37258596 314.32734361 -22.36527461 312.6298563 -38.1875 310.75 C-57.6829958 308.22800775 -74.65378584 301.28853901 -87.1015625 285.30078125 C-94.14194717 274.80012241 -96.74006947 263.75606403 -98.5 251.375 C-98.65391708 250.32736984 -98.65391708 250.32736984 -98.8109436 249.25857544 C-101.48042083 231.02450692 -103.24474299 212.69119775 -104.80145264 194.33288574 C-104.98488437 192.17760519 -105.17371028 190.02286823 -105.36376953 187.86816406 C-108.94163257 146.05355604 -108.08426061 103.22902248 -104.5625 61.4375 C-104.50105804 60.70451691 -104.43961609 59.97153381 -104.37631226 59.21633911 C-102.64061204 38.86507435 -100.8491615 20.69804628 -84.25 6.6875 C-64.57054748 -7.92981024 -20.83401455 -16.86761899 0 0 Z"
        transform="translate(248,300)"
      />
    </g>
  </svg>
);

interface MessageItemProps {
  msg: CollabMessage;
  currentUserId: string;
  currentUserName: string;
  isCoAdmin?: boolean;
  onRetry?: (promptText: string, modelCode: string) => void;
  onDelete?: (msgId: string) => void;
  onPinToggle?: (msgId: string, isPinned: boolean) => void;
  onAddReaction?: (msgId: string, emoji: string) => void;
  onReply?: (sender: string, text: string) => void;
}

export function MessageItem({ 
  msg, 
  currentUserId, 
  currentUserName,
  isCoAdmin = false,
  onRetry, 
  onDelete,
  onPinToggle,
  onAddReaction,
  onReply
}: MessageItemProps) {
  const isOwn = msg.sender_id === currentUserId;

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const modelAvatarData: Record<string, { letter: string; color: string; name: string }> = {
    gemini: { letter: 'G', color: '#4285f4', name: 'Gemini' },
    gpt: { letter: 'G', color: '#10a37f', name: 'GPT' },
    qwen: { letter: 'Q', color: '#8b5cf6', name: 'Qwen' },
    mistral: { letter: 'M', color: '#ff7000', name: 'Mistral' },
    cohere: { letter: 'C', color: '#059669', name: 'Cohere' },
    nemotron: { letter: 'N', color: '#76b900', name: 'Nemotron' }
  };

  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [isLoadingTts, setIsLoadingTts] = useState(false);
  const [activeTtsId, setActiveTtsId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = ttsEngine.registerStateCallback((activeId: any, isSpeaking: boolean, isLoading: boolean) => {
      setIsPlayingTts(isSpeaking && !isLoading);
      setIsLoadingTts(isSpeaking && isLoading);
      setActiveTtsId(activeId);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSpeakClick = (msgId: string, text: string) => {
    ttsEngine.toggleSpeak(msgId, text);
  };

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msgId: string; msgText: string; sender: string; isOwn: boolean } | null>(null);

  const handleSelectOption = (action: string) => {
    if (!contextMenu) return;
    const { msgId, msgText, sender } = contextMenu;

    switch (action) {
      case 'reply':
        if (onReply) {
          onReply(sender, msgText);
        }
        break;
      case 'copy':
        navigator.clipboard.writeText(msgText);
        break;
      case 'pin':
        if (onPinToggle) {
          onPinToggle(msgId, !msg.pinned);
        }
        break;
      case 'download':
        handleDownload(msgText, sender);
        break;
      case 'select':
        alert(`Selected message: ${msgId}`);
        break;
      case 'delete':
        if (onDelete) {
          onDelete(msgId);
        }
        break;
    }
  };

  const renderReactionPills = (reactions: Record<string, string[]> | undefined) => {
    if (!reactions || Object.keys(reactions).length === 0) return null;
    return (
      <div 
        className="collab-reaction-pills" 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '6px', 
          marginTop: '6px', 
          alignItems: 'center' 
        }}
      >
        {Object.entries(reactions).map(([emoji, users]) => {
          const hasReacted = users.includes(currentUserName);
          return (
            <button
              key={emoji}
              onClick={(e) => {
                e.stopPropagation();
                if (onAddReaction) onAddReaction(msg.id, emoji);
              }}
              title={users.join(', ')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '12px',
                background: hasReacted ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: hasReacted ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                color: hasReacted ? '#60a5fa' : '#94a3b8',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border 0.2s ease',
                outline: 'none'
              }}
            >
              <span>{emoji}</span>
              <span style={{ fontWeight: 600 }}>{users.length}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const handleDownload = (text: string, sender: string) => {
    const header = `Nothric | Collaborative Chat\n--------------------------------------------------\n\n`;
    const fullText = header + text;

    const element = document.createElement("a");
    const file = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(file);
    element.href = downloadUrl;
    element.download = `collab-${sender.toLowerCase()}-message.txt`;
    element.style.display = 'none';

    element.onclick = (e) => e.stopPropagation();

    document.body.appendChild(element);
    element.click();

    setTimeout(() => {
      document.body.removeChild(element);
      URL.revokeObjectURL(downloadUrl);
    }, 100);
  };

  const getModelInfo = (modelKey: string) => {
    const key = modelKey.toLowerCase();
    return modelAvatarData[key] || { letter: modelKey[0]?.toUpperCase() || 'A', color: '#6b7280', name: modelKey };
  };

  const userAvatarColor = '#475569'; // Slate for other users

  return (
    <div className="collab-message-group">
      {/* 1. User Prompt Row */}
      {msg.sender_id !== 'ai' && (
        <div className={`collab-chat-row ${isOwn ? 'row-own' : 'row-other'}`}>
          {!isOwn && (
            <div className="collab-chat-avatar" style={{ backgroundColor: userAvatarColor }}>
              {getInitials(msg.sender_name)}
            </div>
          )}
          <div className="collab-chat-bubble-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {!isOwn && <span className="collab-chat-sender-name">{msg.sender_name}</span>}
              {msg.pinned && (
                <span style={{ color: '#38bdf8', display: 'inline-flex' }} title="Pinned Message">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2Z" />
                  </svg>
                </span>
              )}
            </div>
            <div 
              id={`msg-bubble-prompt-${msg.id}`}
              className="collab-chat-bubble"
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  msgId: msg.id,
                  msgText: msg.prompt,
                  sender: msg.sender_name,
                  isOwn: isOwn
                });
              }}
            >
              {msg.reply_to && (
                <div className="reply-quote-block">
                  <div className="reply-quote-accent" />
                  <div className="reply-quote-content">
                    <span className="reply-quote-sender">{msg.reply_to.sender}</span>
                    <span className="reply-quote-text">{msg.reply_to.text}</span>
                  </div>
                </div>
              )}
              <p className="collab-chat-text">{msg.prompt}</p>
            </div>
            {renderReactionPills(msg.reactions)}
          </div>
        </div>
      )}

      {/* 2. AI Response Row */}
      {msg.response && (
        <div className="collab-chat-row row-assistant">
          <div className="collab-chat-bubble-container">
            <div className="collab-chat-sender-header" style={{ display: 'flex', alignItems: 'center' }}>
              <span className="collab-chat-model-circle">
                {getModelLogo(msg.model || '', 20) || getModelInfo(msg.model || '').letter}
              </span>
              <span className="collab-chat-sender-name">{getModelInfo(msg.model || '').name}</span>
              {msg.pinned && (
                <span style={{ color: '#38bdf8', display: 'inline-flex', marginLeft: '6px' }} title="Pinned Message">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2Z" />
                  </svg>
                </span>
              )}
            </div>
            <div 
              id={`msg-bubble-response-${msg.id}`}
              className="collab-chat-plain-response"
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  msgId: msg.id,
                  msgText: msg.response,
                  sender: getModelInfo(msg.model || '').name,
                  isOwn: false
                });
              }}
            >
              <CompletedRenderer text={msg.response} />
            </div>
            {renderReactionPills(msg.reactions)}

            {/* Message Actions Toolbar */}
            <div className="message-actions-toolbar">
              <button
                className={`msg-action-btn ${isCopied ? 'copied' : ''}`}
                aria-label="Copy message"
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(msg.response);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
              >
                {isCopied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                )}
              </button>

              <button
                className={`msg-action-btn ${isLiked ? 'liked' : ''}`}
                aria-label="Like message"
                type="button"
                onClick={() => {
                  setIsLiked(!isLiked);
                  if (isDisliked) setIsDisliked(false);
                }}
              >
                <ThumbsIcon isFilled={isLiked} />
              </button>

              <button
                className={`msg-action-btn ${isDisliked ? 'disliked' : ''}`}
                aria-label="Dislike message"
                type="button"
                onClick={() => {
                  setIsDisliked(!isDisliked);
                  if (isLiked) setIsLiked(false);
                }}
              >
                <ThumbsIcon isFlipped isFilled={isDisliked} />
              </button>

              <button
                className="msg-action-btn"
                aria-label="Download message"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleDownload(msg.response, 'model');
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
                  <path d="M12 15V3" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                </svg>
              </button>

              {onRetry && (
                <button
                  className="msg-action-btn"
                  aria-label="Regenerate response"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onRetry(msg.prompt, msg.model || 'aurora');
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 16h5v5" />
                  </svg>
                </button>
              )}

              <button
                className={`msg-action-btn ${activeTtsId === msg.id && isPlayingTts ? 'playing-tts' : ''} ${activeTtsId === msg.id && isLoadingTts ? 'loading-tts' : ''}`}
                aria-label={activeTtsId === msg.id && isPlayingTts ? "Pause speech" : "Speak message"}
                type="button"
                onClick={() => handleSpeakClick(msg.id, msg.response)}
              >
                {activeTtsId === msg.id && isLoadingTts ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="lucide-spinner animate-spin">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.25 }}></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-volume-2 ${activeTtsId === msg.id && isPlayingTts ? 'pulsing' : ''}`}>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {contextMenu && createPortal(
        <Reactions
          x={contextMenu.x}
          y={contextMenu.y}
          messageId={contextMenu.msgId}
          isOwnMessage={contextMenu.isOwn || isCoAdmin}
          onClose={() => setContextMenu(null)}
          onSelectOption={handleSelectOption}
          onReact={(emoji) => {
            if (onAddReaction) onAddReaction(msg.id, emoji);
          }}
        />,
        document.body
      )}
    </div>
  );
}
