import React from 'react';
import { createPortal } from 'react-dom';
import './SingleModelModal.css';

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  desc: string;
  badge: string;
  color: string;
  logo: React.ReactNode;
}

const models: ModelInfo[] = [
  {
    id: 'gemini',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    desc: 'Multimodal analysis (PDFs & Images), fast answers.',
    badge: 'Fast & Multimodal',
    color: '#3b82f6',
    logo: (
      <svg viewBox="0 0 24 24" className="model-logo-svg" fill="currentColor" style={{ color: '#1a73e8' }}>
        <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
      </svg>
    )
  },
  {
    id: 'gpt',
    name: 'GPT 120B',
    provider: 'OpenAI',
    desc: 'Deep reasoning, calculations, and structured planning.',
    badge: 'Reasoning',
    color: '#10b981',
    logo: (
      <svg viewBox="0 0 512 509.639" className="model-logo-svg" style={{ fill: '#000000' }}>
        <path fill="#fff" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/>
        <path fillRule="nonzero" d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"/>
      </svg>
    )
  },
  {
    id: 'qwen',
    name: 'Qwen Coder',
    provider: 'Alibaba',
    desc: 'Dedicated programming, script generation, and debugging.',
    badge: 'Coding Assist',
    color: '#a78bfa',
    logo: (
      <svg viewBox="0 0 24 24" className="model-logo-svg" fill="currentColor" style={{ color: '#8b5cf6' }}>
        <path d="M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06 l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z" />
      </svg>
    )
  },
  {
    id: 'mistral',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    desc: 'Creative copy, storytelling, translation, and brainstorming.',
    badge: 'Creative Writing',
    color: '#f97316',
    logo: (
      <svg viewBox="0 0 512 512" className="model-logo-svg">
        <g transform="translate(6 79.299) scale(1.96335)">
          <g transform="scale(1.33333)">
            <path fill="#ffd800" d="M27.153 0h27.169v27.089H27.153zM135.815 0h27.169v27.089h-27.169z"/>
            <path fill="#ffaf00" d="M27.153 27.091h54.329V54.18H27.153zM108.661 27.091h54.329V54.18h-54.329z"/>
            <path fill="#ff8205" d="M27.153 54.168h135.819v27.089H27.153z"/>
            <path fill="#fa500f" d="M27.153 81.259h27.169v27.09H27.153zM81.492 81.259h27.169v27.09H81.492zM135.815 81.259h27.169v27.09h-27.169z"/>
            <path fill="#e10500" d="M-.001 108.339h81.489v27.09H-.001zM108.661 108.339h81.498v27.09h-81.498z"/>
          </g>
        </g>
      </svg>
    )
  },
  {
    id: 'cohere',
    name: 'Command R+',
    provider: 'Cohere',
    desc: 'Conversational agent for search queries and contexts.',
    badge: 'Conversational',
    color: '#0ea5e9',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="model-logo-svg" style={{ color: '#059669' }}>
        <path d="M8.128 14.099c.592 0 1.77-.033 3.398-.703 1.897-.781 5.672-2.2 8.395-3.656 1.905-1.018 2.74-2.366 2.74-4.18A4.56 4.56 0 0018.1 1H7.549A6.55 6.55 0 001 7.55c0 3.617 2.745 6.549 7.128 6.549z" />
        <path d="M9.912 18.61a4.387 4.387 0 012.705-4.052l3.323-1.38c3.361-1.394 7.06 1.076 7.06 4.715a5.104 5.104 0 01-5.105 5.104l-3.597-.001a4.386 4.386 0 01-4.386-4.387z" />
        <path d="M4.776 14.962A3.775 3.775 0 001 18.738v.489a3.776 3.776 0 007.551 0v-.49a3.775 3.775 0 00-3.775-3.775z" />
      </svg>
    )
  },
  {
    id: 'nemotron',
    name: 'Nemotron 120B',
    provider: 'NVIDIA',
    desc: 'Logical explanations, math, and structured dialogues.',
    badge: 'Technical & Logic',
    color: '#84cc16',
    logo: (
      <svg viewBox="0 0 64 64" fill="currentColor" className="model-logo-svg" style={{ color: '#76b900' }}>
        <path d="M23.862 23.46v-3.816l1.13-.047c10.46-.33 17.313 8.998 17.313 8.998s-7.396 10.27-15.335 10.27a9.73 9.73 0 0 1-3.086-.495v-11.59c4.075.495 4.9 2.285 7.326 6.36l5.44-4.57s-3.98-5.206-10.67-5.206c-.707-.024-1.413.024-2.12.094m0-12.626v5.7l1.13-.07c14.534-.495 24.026 11.92 24.026 11.92S38.136 41.622 26.806 41.622c-.99 0-1.955-.094-2.92-.26v3.533c.8.094 1.625.165 2.426.165 10.553 0 18.185-5.394 25.58-11.754 1.225.99 6.242 3.368 7.28 4.405-7.02 5.89-23.39 10.623-32.67 10.623a23.24 23.24 0 0 1-2.591-.141v4.97H64v-42.33zm0 27.536v3.015C14.1 39.644 11.4 29.49 11.4 29.49s4.688-5.182 12.46-6.03v3.298h-.024c-4.075-.495-7.28 3.32-7.28 3.32s1.814 6.43 7.302 8.29M6.548 29.067s5.77-8.527 17.337-9.422v-3.11C11.07 17.572 0 28.408 0 28.408s6.266 18.138 23.862 19.787v-3.298c-12.908-1.602-17.313-15.83-17.313-15.83z" />
      </svg>
    )
  },
];

interface SingleModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onSelect: (modelId: string) => void;
}

export function SingleModelModal({ isOpen, onClose, currentModel, onSelect }: SingleModelModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="single-model-modal-overlay" onClick={onClose}>
      <div className="single-model-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="single-model-close-btn" onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="close-icon">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="single-model-modal-header">
          <h2>Select Model</h2>
          <p>Choose a dedicated model to chat with.</p>
        </div>

        <div className="single-model-list">
          {models.map((model) => {
            const isSelected = currentModel === model.id;
            return (
              <div 
                key={model.id} 
                className={`single-model-row-item ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onSelect(model.id);
                  onClose();
                }}
              >
                <div className="model-logo-wrapper">
                  {model.logo}
                </div>
                <div className="model-info-block">
                  <div className="model-title-row">
                    <span className="model-name">{model.name}</span>
                    <span className="model-provider">{model.provider}</span>
                    {isSelected && <span className="active-dot" style={{ backgroundColor: model.color }} />}
                  </div>
                  <span className="model-description">{model.desc}</span>
                </div>
                <div className="model-badge-wrapper">
                  <span className="model-pill-badge">{model.badge}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}
