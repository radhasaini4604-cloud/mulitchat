import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CollabRoom } from '../../../api';
import '../SharedSettings.css';
import './ModelCard.css';

export interface ModelCardProps {
  isOpen: boolean;
  onClose: () => void;
  room: CollabRoom;
  isCoAdmin: boolean;
  onUpdateSystemPrompt?: (newPrompt: string | null) => void;
}

export interface ModelPill {
  key: string;
  name: string;
}

const defaultModels: ModelPill[] = [
  { key: 'gemini', name: 'Gemini 2.5 Flash' },
  { key: 'gpt', name: 'Llama 3.3 70B' },
  { key: 'qwen', name: 'Qwen 2.5 Coder' },
  { key: 'mistral', name: 'Mistral Large 2' },
  { key: 'cohere', name: 'Command R+' },
  { key: 'nemotron', name: 'Nemotron 120B' },
];

export function ModelCard({
  isOpen,
  onClose,
  room,
  isCoAdmin,
  onUpdateSystemPrompt,
}: ModelCardProps) {
  const [systemPromptVal, setSystemPromptVal] = useState<string>(room.system_prompt || '');
  const [isAutoAiPickerEnabled, setIsAutoAiPickerEnabled] = useState<boolean>(() => {
    return localStorage.getItem('collab-auto-ai-picker') !== 'false';
  });

  const [enabledModels, setEnabledModels] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem(`room-models-${room.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return { gemini: true, gpt: true, qwen: true, mistral: true, cohere: true, nemotron: true };
  });

  useEffect(() => {
    setSystemPromptVal(room.system_prompt || '');
  }, [room.system_prompt]);

  if (!isOpen) return null;

  const handleToggleAutoAiPicker = () => {
    if (!isCoAdmin) return;
    const nextVal = !isAutoAiPickerEnabled;
    setIsAutoAiPickerEnabled(nextVal);
    localStorage.setItem('collab-auto-ai-picker', String(nextVal));
    window.dispatchEvent(new CustomEvent('collab-auto-ai-picker-changed', { detail: nextVal }));
  };

  const handleToggleModel = (modelKey: string) => {
    if (!isCoAdmin) return;
    const next = { ...enabledModels, [modelKey]: !enabledModels[modelKey] };
    setEnabledModels(next);
    localStorage.setItem(`room-models-${room.id}`, JSON.stringify(next));

    const event = new CustomEvent('collab-enabled-models-updated', {
      detail: { roomId: room.id, enabledModels: next },
    });
    window.dispatchEvent(event);
  };

  return createPortal(
    <div className="room-navbar-modal-overlay" onClick={onClose}>
      <div className="room-navbar-modal-container wide-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="room-navbar-modal-header">
          <h2>AI Models & Instructions</h2>
          <button className="room-navbar-modal-close-btn" onClick={onClose} title="Close" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="room-navbar-modal-body">
          {/* Section 1: Custom Instructions */}
          <div className="submodal-section">
            <label className="submodal-section-title">Custom Room Instructions</label>
            <textarea
              className="submodal-textarea borderless-input"
              rows={3}
              value={systemPromptVal}
              onChange={(e) => setSystemPromptVal(e.target.value)}
              placeholder="Add instructions applied to all AI models in this room..."
              disabled={!isCoAdmin}
            />
            {isCoAdmin && (
              <button
                type="button"
                className="submodal-action-btn primary"
                style={{ marginTop: '8px', alignSelf: 'flex-end' }}
                onClick={() => {
                  onUpdateSystemPrompt?.(systemPromptVal.trim() || null);
                  alert('Instructions saved.');
                }}
              >
                Save Instructions
              </button>
            )}
          </div>

          {/* Section 2: Participating AI Models */}
          <div className="submodal-section">
            <label className="submodal-section-title">Participating AI Models</label>
            <div className="grey-pills-container">
              {defaultModels.map((m) => {
                const isSelected = enabledModels[m.key] !== false;
                return (
                  <button
                    key={m.key}
                    type="button"
                    className={`grey-model-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => isCoAdmin && handleToggleModel(m.key)}
                    disabled={!isCoAdmin}
                  >
                    <span>{m.name}</span>
                    {isSelected && <span className="grey-pill-tick">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Smart Auto AI Picker (with generous top gap) */}
          <div className="submodal-section" style={{ marginTop: '32px', marginBottom: 0 }}>
            <div className="submodal-toggle-row">
              <div>
                <div className="submodal-toggle-title">Smart Auto AI Picker</div>
                <div className="submodal-toggle-desc">Automatically triggers AI models when addressed in chat</div>
              </div>
              <button
                type="button"
                className={`password-toggle-switch ${isAutoAiPickerEnabled ? 'enabled' : ''}`}
                onClick={handleToggleAutoAiPicker}
                disabled={!isCoAdmin}
              >
                <span className="password-toggle-handle" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
