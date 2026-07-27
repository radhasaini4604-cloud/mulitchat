import { useRef, useEffect } from 'react';
import './InputPanel.css';

interface InputPanelProps {
  promptInput: string;
  setPromptInput: (val: string) => void;
  isGenerating: boolean;
  isEnhancing: boolean;
  selectedMode: string;
  setSelectedMode: (val: string) => void;
  selectedRatio: string;
  setSelectedRatio: (val: string) => void;
  showRatioDropdown: boolean;
  setShowRatioDropdown: (val: boolean) => void;
  onGenerate: () => void;
  ratios: string[];
  selectedModel: string;
  setSelectedModel: (val: string) => void;
  showModelDropdown: boolean;
  setShowModelDropdown: (val: boolean) => void;
  models: string[];
  originalPrompt?: string;
  onUndo?: () => void;
}

export function InputPanel({
  promptInput,
  setPromptInput,
  isGenerating,
  isEnhancing,
  selectedMode,
  setSelectedMode,
  selectedRatio,
  setSelectedRatio,
  showRatioDropdown,
  setShowRatioDropdown,
  onGenerate,
  ratios,
  selectedModel,
  setSelectedModel,
  showModelDropdown,
  setShowModelDropdown,
  models,
  originalPrompt,
  onUndo
}: InputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '36px'; // Set to base height first to allow shrinking
      const scrollHeight = textareaRef.current.scrollHeight;
      const nextHeight = Math.min(Math.max(scrollHeight, 36), 120);
      textareaRef.current.style.height = `${nextHeight}px`;

      // Only show scrollbar when it actually overflows max-height (120px)
      if (scrollHeight > 120) {
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [promptInput]);

  return (
    <footer className="imagine-input-panel">
      <div className="input-panel-container">



        <div className="input-card-body">
          {/* Top row: input field, send button */}
          <div className="input-top-row">
            <textarea
              ref={textareaRef}
              className="imagine-prompt-input"
              placeholder={isEnhancing ? "Groq is enhancing your prompt..." : "Type to imagine"}
              value={isEnhancing ? "Groq is enhancing your prompt..." : promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (e.shiftKey) {
                    // Shift + Enter adds a new row naturally
                    return;
                  } else {
                    // Enter alone triggers generation
                    e.preventDefault();
                    if (!isGenerating && !isEnhancing && promptInput.trim()) {
                      onGenerate();
                    }
                  }
                }
              }}
              disabled={isGenerating || isEnhancing}
              rows={1}
            />

            <button 
              type="button" 
              className={`input-send-btn ${promptInput.trim() && !isEnhancing ? 'active' : ''}`}
              onClick={onGenerate}
              disabled={!promptInput.trim() || isGenerating || isEnhancing}
              aria-label="Send prompt"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="send-icon">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>

          {/* Bottom row: mode selections and ratio selection */}
          <div className="input-bottom-row">
            <div className="mode-selectors">
              <button 
                type="button" 
                className={`mode-btn ${selectedMode === 'image' ? 'active' : ''}`}
                onClick={() => setSelectedMode('image')}
                disabled={isGenerating || isEnhancing}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mode-icon">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Image</span>
              </button>

              <button 
                type="button" 
                className={`mode-btn ${selectedMode === 'agent' ? 'active' : ''}`}
                onClick={() => setSelectedMode('agent')}
                disabled={isGenerating || isEnhancing}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" className="mode-icon">
                  <path d="M18.18 8.03933L18.6435 7.57589C19.4113 6.80804 20.6563 6.80804 21.4241 7.57589C22.192 8.34374 22.192 9.58868 21.4241 10.3565L20.9607 10.82M18.18 8.03933C18.18 8.03933 18.238 9.02414 19.1069 9.89309C19.9759 10.762 20.9607 10.82 20.9607 10.82M18.18 8.03933L13.9194 12.2999C13.6308 12.5885 13.4865 12.7328 13.3624 12.8919C13.2161 13.0796 13.0906 13.2827 12.9882 13.4975C12.9014 13.6797 12.8368 13.8732 12.7078 14.2604L12.2946 15.5L12.1609 15.901M20.9607 10.82L16.7001 15.0806C16.4115 15.3692 16.2672 15.5135 16.1081 15.6376C15.9204 15.7839 15.7173 15.9094 15.5025 16.0118C15.3203 16.0986 15.1268 16.1632 14.7396 16.2922L13.5 16.7054L13.099 16.8391M13.099 16.8391L12.6979 16.9728C12.5074 17.0363 12.2973 16.9867 12.1553 16.8447C12.0133 16.7027 11.9637 16.4926 12.0272 16.3021L12.1609 15.901M13.099 16.8391L12.1609 15.901" stroke="currentColor" strokeWidth="1"></path>
                  <path d="M8 13H10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                  <path d="M8 9H14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                  <path d="M8 17H9.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                  <path d="M19.8284 3.17157C18.6569 2 16.7712 2 13 2H11C7.22876 2 5.34315 2 4.17157 3.17157C3 4.34315 3 6.22876 3 10V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H13C16.7712 22 18.6569 22 19.8284 20.8284C20.7715 19.8853 20.9554 18.4796 20.9913 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                </svg>
                <span>Enhance</span>
              </button>

              {originalPrompt && (
                <button
                  type="button"
                  className="undo-btn"
                  onClick={onUndo}
                  title="Restore original prompt"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                    <path d="M3 7v6h6" />
                    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                  </svg>
                  <span>Undo</span>
                </button>
              )}
            </div>

            <div className="selectors-right" style={{ display: 'flex', gap: '8px' }}>
              {/* Model Selector */}
              <div className="model-selector-container" onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="model-pill-btn"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  disabled={isGenerating || isEnhancing}
                >
                  <span>{selectedModel}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="chevron-icon">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showModelDropdown && (
                  <div className="model-dropdown-menu">
                    {models.map(model => (
                      <button
                        key={model}
                        type="button"
                        className={`model-dropdown-item ${selectedModel === model ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelDropdown(false);
                        }}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Aspect Ratio selector */}
              <div className="ratio-selector-container" onClick={(e) => e.stopPropagation()}>
                <button 
                  type="button" 
                  className="ratio-pill-btn"
                  onClick={() => setShowRatioDropdown(!showRatioDropdown)}
                >
                  <span className="ratio-rect-icon"></span>
                  <span>{selectedRatio}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="chevron-icon">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showRatioDropdown && (
                  <div className="ratio-dropdown-menu">
                    {ratios.map(ratio => (
                      <button
                        key={ratio}
                        type="button"
                        className={`ratio-dropdown-item ${selectedRatio === ratio ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedRatio(ratio);
                          setShowRatioDropdown(false);
                        }}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
