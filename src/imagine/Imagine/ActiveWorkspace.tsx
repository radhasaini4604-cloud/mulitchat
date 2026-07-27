import { useState } from 'react';
import ReactDOM from 'react-dom';
import { Grainient } from '../../Main_chat/Grainient/Grainient';
import { FeedbackModal } from '../../Main_chat/FeedbackModal/FeedbackModal';
import { InputPanel } from '../components/InputPanel';
import { RATIOS, MODELS } from '../utils/types';
import type { WorkspaceCreation } from './Imagine';
import './Workspace.css';

const formatDisplayName = (prompt: string, summary?: string) => {
  const source = summary || prompt || '';
  const text = source.toLowerCase();
  if (text.length > 9) {
    return text.substring(0, 9) + '...';
  }
  return text;
};

function ThumbsIcon({ active, flipped }: { active: boolean; flipped?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 772 712"
      style={{
        width: '20px',
        height: '20px',
        display: 'block',
        transform: flipped ? 'scaleY(-1) scaleX(-1)' : 'none',
        overflow: 'visible'
      }}
    >
      <path
        d="M0 0 C20.39149193 12.75022362 31.56595777 33.45334855 37 56.26416016 C38.88680613 65.40222121 39.03798321 74.38810012 39.046875 83.68603516 C39.04788208 84.41663147 39.04888916 85.14722778 39.04992676 85.89996338 C39.03791822 98.8377552 38.07411113 111.37052205 35.796875 124.12353516 C35.65765625 124.94418457 35.5184375 125.76483398 35.375 126.61035156 C33.75975604 135.94848072 31.36397723 144.78669006 28.15625 153.70556641 C27.83253418 154.61745728 27.50881836 155.52934814 27.17529297 156.46887207 C26.3866348 158.68861015 25.59378399 160.90674882 24.796875 163.12353516 C26.76979774 163.15112663 26.76979774 163.15112663 28.78257751 163.17927551 C41.24210159 163.35532344 53.70133142 163.54592823 66.16042233 163.7504015 C72.56414163 163.85503906 78.96785477 163.95473456 85.37182617 164.04272461 C91.56421767 164.1279963 97.75626549 164.22678657 103.94830513 164.33453941 C106.29823106 164.37313558 108.64823927 164.40704617 110.99830437 164.43595314 C141.94382825 164.82443549 167.33255019 170.46052427 190.390625 192.61572266 C205.77762265 208.62009984 214.24372138 228.98180154 214.24197388 251.18103027 C213.99423056 263.56003038 211.21502292 275.55316702 208.671875 287.62353516 C208.15797262 290.13594908 207.64585993 292.64872972 207.13549805 295.16186523 C205.91724195 301.13988066 204.67759348 307.11317345 203.42950439 313.08502197 C202.60899058 317.02594229 201.80753877 320.97053676 201.01171875 324.91650391 C199.64513209 331.66053116 198.23083553 338.39354148 196.796875 345.12353516 C196.48871974 346.57551027 196.18061738 348.02749661 195.87255859 349.47949219 C193.55887002 360.37076661 191.20312209 371.25233007 188.796875 382.12353516 C188.37873535 384.01483154 188.37873535 384.01483154 187.95214844 385.94433594 C181.07153459 416.736575 169.7984435 443.98812852 142.23828125 461.99072266 C128.35081315 470.73978819 112.47483438 476.83668078 95.93286133 477.43554688 C94.80007248 477.47688751 93.66728363 477.51822815 92.50016785 477.56082153 C90.67670586 477.61893509 90.67670586 477.61893509 88.81640625 477.67822266 C87.53868851 477.72026825 86.26097076 477.76231384 84.9445343 477.80563354 C72.05799585 478.20797312 59.17289172 478.27557831 46.28051758 478.25390625 C42.440228 478.24847269 38.60005205 478.25393645 34.75976562 478.26025391 C-19.84582336 478.28045884 -72.54170323 467.79433754 -123.40625 447.99853516 C-124.58993164 447.53833984 -125.77361328 447.07814453 -126.99316406 446.60400391 C-134.60154619 443.09493567 -139.04694857 438.30352485 -142.32453728 430.73119164 C-143.86092294 426.17118479 -143.91433106 421.66244767 -144.01586914 416.88452148 C-144.05351568 415.76623396 -144.09116222 414.64794643 -144.12994957 413.49577141 C-144.24951951 409.71183082 -144.338888 405.92789064 -144.42578125 402.14306641 C-144.4619456 400.78701187 -144.49883824 399.43097658 -144.53642464 398.07496071 C-145.58459666 359.98551023 -145.61238205 321.87233401 -145.62739789 283.77118194 C-145.62781509 282.72399903 -145.62823228 281.67681612 -145.62866211 280.59790039 C-145.62906766 279.54900513 -145.6294732 278.50010987 -145.62989104 277.4194299 C-145.63533215 268.77051236 -145.66731322 260.12182179 -145.70406669 251.47298878 C-145.73874564 243.00877671 -145.75420936 243.00877671 -145.75420936 243.00877671 C-145.75420936 243.00877671 -145.73874564 243.00877671 -145.70406669 251.47298878 C-145.73874564 243.00877671 -145.75420936 234.54466716 -145.75490814 226.08038455 C-145.75569542 221.07747634 -145.7641972 216.07489035 -145.79290581 211.07205772 C-145.81907739 206.41638774 -145.82129734 201.7613104 -145.80525017 197.10560036 C-145.80344083 195.40848618 -145.81007962 193.71133731 -145.82606888 192.01429749 C-145.91960184 181.44318672 -145.40107284 172.6595609 -137.80078125 164.56494141 C-136.96417969 163.94490234 -136.12757813 163.32486328 -135.265625 162.68603516 C-134.31300781 161.95771484 -133.36039062 161.22939453 -132.37890625 160.47900391 C-131.33089844 159.70169922 -130.28289062 158.92439453 -129.203125 158.12353516 C-126.77529446 156.26275963 -124.36274801 154.38280711 -121.953125 152.49853516 C-121.35105225 152.02971924 -120.74897949 151.56090332 -120.12866211 151.07788086 C-116.42772756 148.16996707 -113.0112102 145.15388407 -109.7734375 141.72900391 C-108.00774601 139.92378201 -106.13065859 138.31674323 -104.203125 136.68603516 C-100.11407449 133.13749132 -96.62004324 129.31766226 -93.203125 125.12353516 C-92.4296875 124.17607422 -91.65625 123.22861328 -90.859375 122.25244141 C-80.96152797 109.8868908 -73.57248183 97.01917023 -68.203125 82.12353516 C-67.88601563 81.30369141 -67.56890625 80.48384766 -67.2421875 79.63916016 C-63.26557487 68.85112193 -62.97064568 57.43529199 -62.85461426 46.06570435 C-62.39693038 9.26908022 -62.39693038 9.26908022 -51.31640625 -2.95849609 C-36.44353694 -16.86817006 -15.30916429 -9.02655529 0 0 Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? "12" : "32"}
        strokeLinejoin="round"
        transform="translate(439.203125,143.87646484375)"
      />
      <path
        d="M0 0 C7.06591488 6.77309318 11.08715973 12.51728747 11.37854004 22.43531799 C11.39581264 25.07720231 11.39713054 27.71604269 11.38476562 30.35766602 C11.38893967 31.82364581 11.39447066 33.28962226 11.40124416 34.75559235 C11.41309074 37.92024978 11.4156644 41.08473091 11.41108513 44.24940681 C11.40398176 49.33190999 11.41843563 54.4142189 11.43592834 59.49668884 C11.45909389 66.75381485 11.47372269 74.01090927 11.48245239 81.26806641 C11.5064496 100.02392027 11.58847494 118.77954376 11.68359375 137.53515625 C11.68814536 138.45992594 11.69269697 139.38469563 11.6973865 140.33748865 C11.89969555 181.08444783 12.82754018 221.78399177 14.56813049 262.49656677 C15.86161761 293.02430844 15.86161761 293.02430844 6 304 C-7.37258596 314.32734361 -22.36527461 312.6298563 -38.1875 310.75 C-57.6829958 308.22800775 -74.65378584 301.28853901 -87.1015625 285.30078125 C-94.14194717 274.80012241 -96.74006947 263.75606403 -98.5 251.375 C-98.65391708 250.32736984 -98.65391708 250.32736984 -98.8109436 249.25857544 C-101.48042083 231.02450692 -103.24474299 212.69119775 -104.80145264 194.33288574 C-104.98488437 192.17760519 -105.17371028 190.02286823 -105.36376953 187.86816406 C-108.94163257 146.05355604 -108.08426061 103.22902248 -104.5625 61.4375 C-104.5625 61.4375 -104.5625 61.4375 -104.5625 61.4375 C-104.50105804 60.70451691 -104.43961609 59.97153381 -104.37631226 59.21633911 C-102.64061204 38.86507435 -100.8491615 20.69804628 -84.25 6.6875 C-64.57054748 -7.92981024 -20.83401455 -16.86761899 0 0 Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={active ? "12" : "32"}
        strokeLinejoin="round"
        transform="translate(248,300)"
      />
    </svg>
  );
}

interface ActiveWorkspaceProps {
  workspaceCreations: WorkspaceCreation[];
  handleExitWorkspace: () => void;
  copyImageToClipboard: (url: string) => void;
  setNotificationMsg: (msg: string) => void;
  setShowNotification: (show: boolean) => void;
  handleRetry: (item: WorkspaceCreation) => void;
  
  // InputPanel props
  promptInput: string;
  setPromptInput: (val: string) => void;
  isEnhancing: boolean;
  selectedMode: string;
  handleModeChange: (val: string) => void;
  selectedRatio: string;
  setSelectedRatio: (val: string) => void;
  showRatioDropdown: boolean;
  setShowRatioDropdown: (val: boolean) => void;
  handleGenerate: () => void;
  selectedModel: string;
  setSelectedModel: (val: string) => void;
  showModelDropdown: boolean;
  setShowModelDropdown: (val: boolean) => void;
  originalPrompt: string;
  handleUndoPrompt: () => void;
}

export function ActiveWorkspace({
  workspaceCreations,
  handleExitWorkspace,
  copyImageToClipboard,
  setNotificationMsg,
  setShowNotification,
  handleRetry,
  promptInput,
  setPromptInput,
  isEnhancing,
  selectedMode,
  handleModeChange,
  selectedRatio,
  setSelectedRatio,
  showRatioDropdown,
  setShowRatioDropdown,
  handleGenerate,
  selectedModel,
  setSelectedModel,
  showModelDropdown,
  setShowModelDropdown,
  originalPrompt,
  handleUndoPrompt
}: ActiveWorkspaceProps) {
  const [previewWorkspaceImage, setPreviewWorkspaceImage] = useState<WorkspaceCreation | null>(null);
  
  // Likes and Feedback
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [dislikedMap, setDislikedMap] = useState<Record<string, boolean>>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Comments
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');

  const activeId = previewWorkspaceImage?.id || '';
  const isLiked = likedMap[activeId] || false;
  const isDisliked = dislikedMap[activeId] || false;

  const toggleLike = () => {
    if (!activeId) return;
    setLikedMap(prev => ({ ...prev, [activeId]: !prev[activeId] }));
    if (!likedMap[activeId]) {
      setDislikedMap(prev => ({ ...prev, [activeId]: false }));
      setShowFeedbackModal(true); // Open feedback survey on like
    }
  };

  const toggleDislike = () => {
    if (!activeId) return;
    setDislikedMap(prev => ({ ...prev, [activeId]: !prev[activeId] }));
    if (!dislikedMap[activeId]) {
      setLikedMap(prev => ({ ...prev, [activeId]: false }));
    }
  };

  const handleFeedbackSubmit = async () => {
    setIsSubmittingFeedback(true);
    await new Promise(r => setTimeout(r, 1000)); // Simulating API submission
    setIsSubmittingFeedback(false);
    setShowFeedbackModal(false);
    setNotificationMsg('Feedback submitted successfully!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const triggerToast = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="imagine-workspace-container">
      {/* Soft decorative background blobs in the upper border */}
      <div className="page-bg-blob page-bg-blob-blue"></div>
      <div className="page-bg-blob page-bg-blob-pink"></div>

      <header className="imagine-workspace-header">
        <div className="workspace-header-left"></div>
        <div className="workspace-title-section">
          <h2>Creative Studio</h2>
          <p>Your Current Workspace</p>
        </div>
        <div className="workspace-header-right">
          <button className="workspace-back-btn" onClick={handleExitWorkspace}>
            Back
          </button>
        </div>
      </header>

      <div className="imagine-workspace-content">
        <div className="workspace-grid">
          {workspaceCreations.map((item) => (
            <div key={item.id} className="workspace-card">
              {item.status === 'generating' ? (
                <div className="workspace-loading-card">
                  <Grainient
                    color1="#c7c4d4"
                    color2="#784ca1"
                    color3="#d5d1c5"
                    timeSpeed={4}
                    colorBalance={0.05}
                    warpStrength={1}
                    warpFrequency={3.7}
                    warpSpeed={4.1}
                    warpAmplitude={50}
                    blendAngle={148}
                    blendSoftness={0.64}
                    rotationAmount={1190}
                    noiseScale={0.8}
                    grainAmount={0.1}
                    grainScale={3.4}
                    grainAnimated={false}
                    contrast={1.5}
                    gamma={0.75}
                    saturation={1}
                    centerX={0}
                    centerY={0.04}
                    zoom={0.85}
                  />
                  <div className="workspace-loading-overlay">

                    <div className="workspace-loading-info">
                      <h4 className="generation-status-title">Generating</h4>
                      <p className="generation-status-subtitle">{item.step}</p>
                    </div>
                  </div>
                </div>
              ) : item.status === 'failed' ? (
                <div className="workspace-loading-card failed">
                  <div style={{ marginBottom: '16px', color: '#ef4444' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ width: '48px', height: '48px' }}>
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <h4 className="generation-status-title" style={{ fontSize: '1rem', color: '#ef4444' }}>Failed</h4>
                  <p className="generation-status-subtitle" style={{ fontSize: '0.8rem', color: '#64748b', padding: '0 12px' }}>
                    API Error or connection failure. Please check your credentials.
                  </p>
                  <div className="workspace-card-footer" style={{ width: '100%', padding: '12px 0 0 0' }}>
                    <p className="workspace-card-prompt" style={{ minHeight: 'auto', marginBottom: '8px' }}>"{item.prompt}"</p>
                    <div className="workspace-card-actions">
                      <div className="workspace-action-buttons">
                        <button 
                          className="workspace-icon-btn" 
                          title="Retry generation"
                          onClick={() => handleRetry(item)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 4v6h-6"></path>
                            <path d="M1 20v-6h6"></path>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="workspace-image-wrapper" onClick={() => setPreviewWorkspaceImage(item)}>
                  <img src={item.url} alt={item.prompt} className="workspace-img" />
                  <div className="workspace-hover-summary">
                    <span>{formatDisplayName(item.prompt, item.summary)}</span>
                  </div>
                  <div className="workspace-card-actions">
                    <div className="workspace-action-buttons">
                      {/* Copy icon button */}
                      <button 
                        className="workspace-icon-btn" 
                        title="Copy image"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyImageToClipboard(item.url || '');
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                      
                      {/* Download icon button */}
                      <a 
                        className="workspace-icon-btn no-bg" 
                        title="Open full size"
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        download={`generation-${item.id}.png`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                      </a>
                      
                      {/* Retry icon button */}
                      <button 
                        className="workspace-icon-btn no-bg" 
                        title="Retry generation"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(item);
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 4v6h-6"></path>
                          <path d="M1 20v-6h6"></path>
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {previewWorkspaceImage && (
        <div className="workspace-lightbox-overlay">
          <div className="workspace-lightbox-topbar">
            <div className="lightbox-topbar-left">
              <span className="lightbox-prompt-text" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: '800', fontSize: '1.4rem', color: '#0f172a' }}>Nothric</span>
            </div>
            
            <div className="lightbox-topbar-actions">
              <button 
                className={`lightbox-btn-icon ${isLiked ? 'liked' : ''}`}
                title="Like creation"
                onClick={toggleLike}
                style={isLiked ? { color: '#0f172a' } : {}}
              >
                <ThumbsIcon active={isLiked} />
              </button>

              <button 
                className={`lightbox-btn-icon ${isDisliked ? 'disliked' : ''}`}
                title="Dislike creation"
                onClick={toggleDislike}
                style={{ ...(isDisliked ? { color: '#0f172a' } : {}), marginLeft: '-8px' }}
              >
                <ThumbsIcon active={isDisliked} flipped />
              </button>
              
              <button 
                className="lightbox-btn-primary"
                onClick={() => {
                  copyImageToClipboard(previewWorkspaceImage.url || '');
                  triggerToast('Link copied to clipboard!');
                }}
              >
                <span>Share</span>
              </button>
              
              <a 
                className="lightbox-btn-icon" 
                href={previewWorkspaceImage.url}
                download={`imagine-${previewWorkspaceImage.id}.png`}
                target="_blank"
                rel="noreferrer"
                title="Download"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
              
              <button 
                className="lightbox-btn-icon" 
                title="Close preview"
                onClick={() => setPreviewWorkspaceImage(null)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="workspace-lightbox-content" onClick={() => setPreviewWorkspaceImage(null)}>
            <img src={previewWorkspaceImage.url} alt={previewWorkspaceImage.prompt} className="workspace-lightbox-img" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        isSubmitting={isSubmittingFeedback}
      />

      {/* Comment Modal — portal so it escapes overflow:hidden */}
      {showCommentModal && ReactDOM.createPortal(
        <div className="comment-modal-overlay" onClick={() => setShowCommentModal(false)}>
          <div className="comment-modal-panel" onClick={e => e.stopPropagation()}>
            <div className="comment-modal-header">
              <span className="comment-modal-title">Add a Comment</span>
              <button className="comment-modal-close" onClick={() => setShowCommentModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <p className="comment-modal-hint">What do you think about this creation? Share your thoughts, suggestions, or feedback.</p>
            <textarea
              className="comment-modal-textarea"
              placeholder="Write your comment here…"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={5}
              autoFocus
            />
            <div className="comment-modal-actions">
              <button className="comment-modal-cancel" onClick={() => setShowCommentModal(false)}>Cancel</button>
              <button
                className="comment-modal-submit"
                disabled={!commentText.trim()}
                onClick={() => {
                  setShowCommentModal(false);
                  triggerToast('Comment submitted!');
                }}
              >Submit</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Capsule Input Panel */}
      <InputPanel 
        promptInput={promptInput}
        setPromptInput={setPromptInput}
        isGenerating={workspaceCreations.some(c => c.status === 'generating')}
        isEnhancing={isEnhancing}
        selectedMode={selectedMode}
        setSelectedMode={handleModeChange}
        selectedRatio={selectedRatio}
        setSelectedRatio={setSelectedRatio}
        showRatioDropdown={showRatioDropdown}
        setShowRatioDropdown={setShowRatioDropdown}
        onGenerate={handleGenerate}
        ratios={RATIOS}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        showModelDropdown={showModelDropdown}
        setShowModelDropdown={setShowModelDropdown}
        models={MODELS}
        originalPrompt={originalPrompt}
        onUndo={handleUndoPrompt}
      />
    </div>
  );
}
