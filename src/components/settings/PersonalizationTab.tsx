import { useState, useRef, useEffect } from 'react'
import { setAppSetting } from '../../Main_chat/utils/settingsSync'
import './PersonalizationTab.css'

interface DropdownSelectProps {
  options: string[]
  value: string
  onChange: (val: string) => void
  direction?: 'down' | 'up'
}

function DropdownSelect({ options, value, onChange, direction = 'down' }: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="personalization-select-container" ref={containerRef}>
      <button 
        type="button" 
        className="personalization-select-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={`chevron-icon ${isOpen ? 'open' : ''}`}>
          {direction === 'up' ? (
            <polyline points="18 15 12 9 6 15"/>
          ) : (
            <polyline points="6 9 12 15 18 9"/>
          )}
        </svg>
      </button>

      {isOpen && (
        <div className={`personalization-select-dropdown ${direction === 'up' ? 'direction-up' : ''}`}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`personalization-select-item ${value === option ? 'active' : ''}`}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function PersonalizationTab() {
  const [baseStyle, setBaseStyle] = useState(() => localStorage.getItem('personalization-base-style') || 'Default')
  const [warm, setWarm] = useState(() => localStorage.getItem('personalization-warm') || 'Default')
  const [enthusiastic, setEnthusiastic] = useState(() => localStorage.getItem('personalization-enthusiastic') || 'Default')
  const [headersLists, setHeadersLists] = useState(() => localStorage.getItem('personalization-headers-lists') || 'Default')
  const [emoji, setEmoji] = useState(() => localStorage.getItem('personalization-emoji') || 'More')
  const [customInstructions, setCustomInstructions] = useState(() => localStorage.getItem('personalization-custom-instructions') || '')

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setBaseStyle(localStorage.getItem('personalization-base-style') || 'Default')
      setWarm(localStorage.getItem('personalization-warm') || 'Default')
      setEnthusiastic(localStorage.getItem('personalization-enthusiastic') || 'Default')
      setHeadersLists(localStorage.getItem('personalization-headers-lists') || 'Default')
      setEmoji(localStorage.getItem('personalization-emoji') || 'More')
      setCustomInstructions(localStorage.getItem('personalization-custom-instructions') || '')
    }

    window.addEventListener('personalization-settings-updated', handleSettingsUpdate)
    return () => {
      window.removeEventListener('personalization-settings-updated', handleSettingsUpdate)
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  const updateSetting = (key: string, val: string, setter: (v: string) => void) => {
    setter(val)
    setAppSetting(`personalization-${key}`, val);
  }

  return (
    <div className="personalization-tab-content">
      <div className="personalization-header-section">
        <h3>Personalization</h3>
      </div>

      <div className="personalization-textarea-section">
        <label className="personalization-label" htmlFor="custom-instructions-input">
          Custom instructions
        </label>
        <span className="personalization-desc">
          Add custom rules or context you want Nothric to remember and apply across all chats.
        </span>
        <textarea
          id="custom-instructions-input"
          className="personalization-textarea"
          placeholder="Add your instructions"
          value={customInstructions}
          onChange={(e) => updateSetting('custom-instructions', e.target.value, setCustomInstructions)}
          rows={4}
        />
      </div>

      <div className="personalization-section-divider" />

      <div className="personalization-row">
        <div className="personalization-info">
          <span className="personalization-label">Base style and tone</span>
        </div>
        <DropdownSelect
          options={['Default', 'Professional', 'Creative', 'Direct & Concise', 'Educational']}
          value={baseStyle}
          onChange={(val) => updateSetting('base-style', val, setBaseStyle)}
        />
      </div>

      <div className="personalization-section-divider" />

      <div className="personalization-subheader-section">
        <h4>Characteristics</h4>
        <span className="personalization-desc">Choose additional customizations on top of your base style and tone.</span>
      </div>

      <div className="personalization-row">
        <div className="personalization-info">
          <span className="personalization-label">Warm</span>
        </div>
        <DropdownSelect
          options={['Default', 'Friendly', 'Empathetic', 'Formal & Neutral']}
          value={warm}
          onChange={(val) => updateSetting('warm', val, setWarm)}
        />
      </div>

      <div className="personalization-row">
        <div className="personalization-info">
          <span className="personalization-label">Enthusiastic</span>
        </div>
        <DropdownSelect
          options={['Default', 'Very Enthusiastic', 'Calm', 'Reserved']}
          value={enthusiastic}
          onChange={(val) => updateSetting('enthusiastic', val, setEnthusiastic)}
        />
      </div>

      <div className="personalization-row">
        <div className="personalization-info">
          <span className="personalization-label">Headers &amp; Lists</span>
        </div>
        <DropdownSelect
          options={['Default', 'Rich Formatting', 'Plain Text', 'Minimalist']}
          value={headersLists}
          onChange={(val) => updateSetting('headers-lists', val, setHeadersLists)}
          direction="up"
        />
      </div>

      <div className="personalization-row">
        <div className="personalization-info">
          <span className="personalization-label">Emoji</span>
        </div>
        <DropdownSelect
          options={['Default', 'More', 'Few Emojis', 'No Emojis']}
          value={emoji}
          onChange={(val) => updateSetting('emoji', val, setEmoji)}
          direction="up"
        />
      </div>
    </div>
  )
}
