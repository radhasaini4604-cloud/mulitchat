import { useState, useEffect, useRef } from 'react';
import { AttachmentMenu } from '../AttachmentMenu/AttachmentMenu';
import './InputCard.css';
import './ModelDropdown.css';

const providerMap: Record<string, string> = {
  auto: 'Auto Nothric',
  gemini: 'Gemini 2.5 Flash',
  gpt: 'GPT 120B',
  qwen: 'Qwen Coder',
  accent: 'Mistral Large',
  mistral: 'Mistral Large',
  cohere: 'Command R+',
  nemotron: 'Nemotron 120B',
};

interface AttachedFile extends File {
  webkitRelativePath: string;
}

interface Main_chatInputCardProps {
  prompt: string;
  setPrompt: (val: string) => void;
  attachedFiles: File[];
  onRemoveFile: (idx: number) => void;
  onFileSelect: (files: File[]) => void;
  onSend: () => void;
  onStop: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  isResponding: boolean;
  isRecording: boolean;
  isProcessingVoice: boolean;
  isDictationEnabled: boolean;
  onMicClick: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  expandedModel: string | null;
  activeModels: string[];
  modelsList: string[];
  isDropdownOpen: boolean;
  setIsDropdownOpen: (val: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  toggleModel: (model: string) => void;
  isCentered?: boolean;
}

function ImagePreviewThumbnail({ file }: { file: File }) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  if (!src) return <div className="image-preview-placeholder" />;
  return <img src={src} alt={file.name} className="image-preview-thumbnail" />;
}

export function Main_chatInputCard({
  prompt, setPrompt, attachedFiles, onRemoveFile, onFileSelect,
  onSend, onStop, onKeyDown, onPaste,
  isResponding, isRecording, isProcessingVoice, isDictationEnabled, onMicClick, canvasRef,
  expandedModel, activeModels, modelsList, isDropdownOpen, setIsDropdownOpen, dropdownRef, toggleModel,
  isCentered = false,
}: Main_chatInputCardProps) {

  const normalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const centeredTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const normalTextarea = normalTextareaRef.current;
    if (normalTextarea) {
      normalTextarea.style.height = 'auto';
      normalTextarea.style.height = `${normalTextarea.scrollHeight}px`;
    }
  }, [prompt]);

  useEffect(() => {
    const centeredTextarea = centeredTextareaRef.current;
    if (centeredTextarea) {
      centeredTextarea.style.height = 'auto';
      centeredTextarea.style.height = `${centeredTextarea.scrollHeight}px`;
    }
  }, [prompt]);

  const renderAttachedFiles = () => {
    if (attachedFiles.length === 0) return null;
    return (
      <div className="attached-files-container">
        {attachedFiles.map((file, idx) => {
          const isImage = file.type.startsWith('image/');
          const isPdf = file.name.toLowerCase().endsWith('.pdf');
          const isFolder = !!(file as AttachedFile).webkitRelativePath;

          if (isImage) {
            return (
              <div key={idx} className="attached-image-chip">
                <ImagePreviewThumbnail file={file} />
                <button type="button" className="file-chip-remove image-chip-remove" onClick={() => onRemoveFile(idx)} aria-label="Remove attachment">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          }

          let typeLabel = 'FILE';
          let iconBgClass = 'icon-bg-file';
          let iconSvg = (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="attachment-svg-white">
              <path d="M11.1 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.589 3.588A2.4 2.4 0 0 1 20 8v3.25" />
              <path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="m21 22-2.88-2.88" /><circle cx="16" cy="17" r="3" />
            </svg>
          );

          if (isPdf) {
            typeLabel = 'PDF'; iconBgClass = 'icon-bg-pdf';
            iconSvg = (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="attachment-svg-white">
                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                <path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
              </svg>
            );
          } else if (isFolder) {
            typeLabel = 'FOLDER'; iconBgClass = 'icon-bg-folder';
            iconSvg = (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="attachment-svg-white">
                <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
              </svg>
            );
          }

          return (
            <div key={idx} className="attached-card-chip">
              <div className={`attached-card-icon-box ${iconBgClass}`}>{iconSvg}</div>
              <div className="attached-card-info">
                <span className="attached-card-name" title={file.name}>{file.name}</span>
                <span className="attached-card-type">{typeLabel}</span>
              </div>
              <button type="button" className="file-chip-remove" onClick={() => onRemoveFile(idx)} aria-label="Remove attachment">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  if (isCentered) {
    return (
      <div className="Main_chat-input-container centered">
        <div className="premium-input-card centered" style={{ position: 'relative', width: '100%' }}>
          
          {/* Attachment preview chips — above input area */}
          {renderAttachedFiles()}

          {/* Textarea Area */}
          <div className="input-textarea-wrapper centered" style={{ position: 'relative', width: '100%' }}>
            {isRecording && <canvas ref={canvasRef} className="voice-wave-canvas" />}
            <textarea
              ref={centeredTextareaRef}
              className="premium-textarea"
              placeholder={
                isProcessingVoice ? 'Transcribing voice...'
                : isRecording ? ''
                : expandedModel ? `Ask only ${providerMap[expandedModel.toLowerCase()] || expandedModel}...`
                : 'Ask Nothric...'
              }
              rows={1}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              disabled={isProcessingVoice}
            />
          </div>

          {/* Bottom actions toolbar */}
          <div className="input-card-footer centered">
            <div className="footer-actions-left">
              {/* Model selector dropdown */}
              <div className="model-selector-container" ref={dropdownRef}>
                <button
                  className="model-selector-btn"
                  onClick={() => { if (!expandedModel) setIsDropdownOpen(!isDropdownOpen); }}
                  type="button"
                  style={{ cursor: expandedModel ? 'default' : 'pointer' }}
                >
                  <span>
                    {expandedModel
                      ? (providerMap[expandedModel.toLowerCase()] || expandedModel)
                      : activeModels.includes('auto')
                      ? 'Auto Nothric'
                      : activeModels.length === 1
                      ? (providerMap[activeModels[0].toLowerCase()] || activeModels[0])
                      : activeModels.length === modelsList.length
                      ? 'All Models'
                      : `${activeModels.length} Models`}
                  </span>
                  {!expandedModel && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="chevron-down-icon">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </button>
                {expandedModel && <span className="selector-tooltip">Talk only {providerMap[expandedModel.toLowerCase()] || expandedModel}</span>}
                {!expandedModel && isDropdownOpen && (
                  <div className="model-dropdown-menu">
                    {modelsList.map((model) => {
                      const isActive = activeModels.includes(model);
                      return (
                        <button key={model} className={`model-dropdown-item ${isActive ? 'active' : ''}`} onClick={() => toggleModel(model)} type="button">
                          <span>{providerMap[model.toLowerCase()] || model}</span>
                          {isActive && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Attachment button */}
              {activeModels.includes('auto') && <AttachmentMenu onFileSelect={onFileSelect} />}
            </div>

            <div className="footer-actions-right">
              {/* Mic button */}
              {isDictationEnabled && (
                <button
                  className={`footer-circle-btn mic-btn ${isRecording ? 'recording' : ''} ${isProcessingVoice ? 'processing' : ''}`}
                  aria-label="Voice input" type="button" onClick={onMicClick}
                >
                  {isProcessingVoice ? (
                    <div className="voice-spinner" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  )}
                </button>
              )}

              {/* Send / Stop */}
              {isResponding ? (
                <button className="premium-send-btn stop" onClick={onStop} type="button" aria-label="Stop generating">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                  </svg>
                </button>
              ) : (
                <button className="premium-send-btn" onClick={onSend} type="button" aria-label="Send to all models">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Main_chat-input-container">
      <div className="premium-input-card" style={{ position: 'relative', width: '100%' }}>

        {/* Attachment preview chips — above input row */}
        {renderAttachedFiles()}

        {/* Attachment button */}
        {activeModels.includes('auto') && <AttachmentMenu onFileSelect={onFileSelect} />}

        {/* Textarea */}
        <div className="input-textarea-wrapper" style={{ flex: 1, position: 'relative' }}>
          {isRecording && <canvas ref={canvasRef} className="voice-wave-canvas" />}
          <textarea
            ref={normalTextareaRef}
            className="premium-textarea"
            placeholder={
              isProcessingVoice ? 'Transcribing voice...'
              : isRecording ? ''
              : expandedModel ? `Ask only ${providerMap[expandedModel.toLowerCase()] || expandedModel}...`
              : 'Ask anything to all models...'
            }
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            disabled={isProcessingVoice}
          />
        </div>

        {/* Right-side controls */}
        <div className="input-card-footer">
          {/* Model selector */}
          <div className="model-selector-container" ref={dropdownRef}>
            <button
              className="model-selector-btn"
              onClick={() => { if (!expandedModel) setIsDropdownOpen(!isDropdownOpen); }}
              type="button"
              style={{ cursor: expandedModel ? 'default' : 'pointer' }}
            >
              <span>
                {expandedModel
                  ? (providerMap[expandedModel.toLowerCase()] || expandedModel)
                  : activeModels.includes('auto')
                  ? 'Auto Nothric'
                  : activeModels.length === 1
                  ? (providerMap[activeModels[0].toLowerCase()] || activeModels[0])
                  : activeModels.length === modelsList.length
                  ? 'All Models'
                  : `${activeModels.length} Models`}
              </span>
              {!expandedModel && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="chevron-down-icon">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
            </button>
            {expandedModel && <span className="selector-tooltip">Talk only {providerMap[expandedModel.toLowerCase()] || expandedModel}</span>}
            {!expandedModel && isDropdownOpen && (
              <div className="model-dropdown-menu">
                {modelsList.map((model) => {
                  const isActive = activeModels.includes(model);
                  return (
                    <button key={model} className={`model-dropdown-item ${isActive ? 'active' : ''}`} onClick={() => toggleModel(model)} type="button">
                      <span>{providerMap[model.toLowerCase()] || model}</span>
                      {isActive && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mic button */}
          {isDictationEnabled && (
            <button
              className={`footer-circle-btn mic-btn ${isRecording ? 'recording' : ''} ${isProcessingVoice ? 'processing' : ''}`}
              aria-label="Voice input" type="button" onClick={onMicClick}
            >
              {isProcessingVoice ? (
                <div className="voice-spinner" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              )}
            </button>
          )}

          {/* Send / Stop */}
          {isResponding ? (
            <button className="premium-send-btn stop" onClick={onStop} type="button" aria-label="Stop generating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
              </svg>
            </button>
          ) : (
            <button className="premium-send-btn" onClick={onSend} type="button" aria-label="Send to all models">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
