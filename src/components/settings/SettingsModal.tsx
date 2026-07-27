import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './SettingsModal.css'
import { PersonalizationTab } from './PersonalizationTab'
import { DataControlTab } from './DataControlTab'
import { StorageTab } from './StorageTab'
import { ParentalControlTab } from './ParentalControlTab'
import { VoiceTab } from './VoiceTab'
import { ApiConfigTab } from './ApiConfigTab'
import { setAppSetting } from '../../Main_chat/utils/settingsSync'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  setActiveSessionId?: (id: string | null) => void
}

type TabType = 'general' | 'personalization' | 'voice' | 'data_control' | 'storage' | 'parental_control' | 'api_keys'

interface AccentOption {
  id: string
  name: string
  color: string
}

const accents: AccentOption[] = [
  { id: 'soft-grey', name: 'Soft Grey', color: '#a1a1aa' },
  { id: 'soft-pink', name: 'Soft Pink', color: '#f472b6' },
  { id: 'soft-blue', name: 'Soft Blue', color: '#60a5fa' },
  { id: 'purple', name: 'Purple', color: '#a78bfa' },
  { id: 'red', name: 'Red', color: '#f87171' },
  { id: 'black', name: 'Black', color: '#18181b' },
  { id: 'orange', name: 'Orange', color: '#fb923c' },
  { id: 'yellow', name: 'Yellow', color: '#facc15' },
]

interface AccentDropdownSelectProps {
  options: AccentOption[]
  value: string
  onChange: (val: string) => void
}

function AccentDropdownSelect({ options, value, onChange }: AccentDropdownSelectProps) {
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

  const selectedAccent = options.find((a) => a.id === value) || options[0]

  return (
    <div className="accent-dropdown-container" ref={containerRef}>
      <button 
        type="button" 
        className="accent-dropdown-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="accent-dropdown-preview-wrapper">
          <span 
            className="accent-dropdown-color-preview" 
            style={{ backgroundColor: selectedAccent.color }} 
          />
          <span>{selectedAccent.name}</span>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={`chevron-icon ${isOpen ? 'open' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <div className="accent-dropdown-menu">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`accent-dropdown-item ${value === option.id ? 'active' : ''}`}
              onClick={() => {
                onChange(option.id)
                setIsOpen(false)
              }}
            >
              <span 
                className="accent-dropdown-color-preview" 
                style={{ backgroundColor: option.color }} 
              />
              <span>{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function SettingsModal({ isOpen, onClose, setActiveSessionId }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general')

  // General Settings State
  const [theme, setTheme] = useState(() => localStorage.getItem('settings-theme') || 'dark')
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('settings-accent-color') || 'soft-grey')
  const [higherIntelligence, setHigherIntelligence] = useState(() => localStorage.getItem('settings-higher-intelligence') === 'true')
  const [enableDetection, setEnableDetection] = useState(() => localStorage.getItem('settings-enable-detection') !== 'false')
  const [showBgBulbs, setShowBgBulbs] = useState(() => localStorage.getItem('settings-show-bg-bulbs') !== 'false')
  const [smartScroll, setSmartScroll] = useState(() => localStorage.getItem('settings-smart-scroll') !== 'false')

  const activeAccentHex = accents.find(a => a.id === accentColor)?.color || '#a1a1aa'

  useEffect(() => {
    const handleSync = () => {
      setTheme(localStorage.getItem('settings-theme') || 'dark')
      setAccentColor(localStorage.getItem('settings-accent-color') || 'soft-grey')
      setHigherIntelligence(localStorage.getItem('settings-higher-intelligence') === 'true')
      setEnableDetection(localStorage.getItem('settings-enable-detection') !== 'false')
      setShowBgBulbs(localStorage.getItem('settings-show-bg-bulbs') !== 'false')
      setSmartScroll(localStorage.getItem('settings-smart-scroll') !== 'false')
    }
    window.addEventListener('app_settings_synced', handleSync)
    window.addEventListener('settings-bg-bulbs-changed', handleSync)
    window.addEventListener('settings-theme-changed', handleSync)
    window.addEventListener('settings-accent-changed', handleSync)
    window.addEventListener('settings-dictation-changed', handleSync)
    window.addEventListener('settings-smart-scroll-changed', handleSync)

    return () => {
      window.removeEventListener('app_settings_synced', handleSync)
      window.removeEventListener('settings-bg-bulbs-changed', handleSync)
      window.removeEventListener('settings-theme-changed', handleSync)
      window.removeEventListener('settings-accent-changed', handleSync)
      window.removeEventListener('settings-dictation-changed', handleSync)
      window.removeEventListener('settings-smart-scroll-changed', handleSync)
    }
  }, [])

  if (!isOpen) return null

  const handleSetTheme = (newTheme: string) => {
    setTheme(newTheme)
    setAppSetting('settings-theme', newTheme)
    window.dispatchEvent(new Event('settings-theme-changed'))
  }

  const handleSetAccentColor = (newAccent: string) => {
    setAccentColor(newAccent)
    setAppSetting('settings-accent-color', newAccent)
    window.dispatchEvent(new Event('settings-accent-changed'))
  }

  const handleToggleHigherIntelligence = () => {
    const nextVal = !higherIntelligence
    setHigherIntelligence(nextVal)
    setAppSetting('settings-higher-intelligence', String(nextVal))
  }

  const handleToggleEnableDetection = () => {
    const nextVal = !enableDetection
    setEnableDetection(nextVal)
    setAppSetting('settings-enable-detection', String(nextVal))
    window.dispatchEvent(new Event('settings-dictation-changed'))
  }

  const handleToggleBgBulbs = () => {
    const nextVal = !showBgBulbs
    setShowBgBulbs(nextVal)
    setAppSetting('settings-show-bg-bulbs', String(nextVal))
    window.dispatchEvent(new Event('settings-bg-bulbs-changed'))
  }

  const handleToggleSmartScroll = () => {
    const nextVal = !smartScroll
    setSmartScroll(nextVal)
    setAppSetting('settings-smart-scroll', String(nextVal))
    window.dispatchEvent(new Event('settings-smart-scroll-changed'))
  }

  if (!isOpen) return null

  return createPortal(
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-container" onClick={(e) => e.stopPropagation()} style={{ '--active-accent': activeAccentHex } as React.CSSProperties}>
        <div className="settings-modal-header">
          <h2>Settings</h2>
          <button className="settings-close-btn" onClick={onClose} aria-label="Close settings">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="close-icon">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        
        <div className="settings-modal-body">
          {/* Left Navigation Sidebar */}
          <div className="settings-sidebar">
            <button 
              className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
                <line x1="10" y1="7" x2="19" y2="7" />
                <circle cx="7" cy="7" r="3" />
                <line x1="5" y1="17" x2="14" y2="17" />
                <circle cx="17" cy="17" r="3" />
              </svg>
              <span>General</span>
            </button>

            <button 
              className={`settings-nav-item ${activeTab === 'personalization' ? 'active' : ''}`}
              onClick={() => setActiveTab('personalization')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="nav-icon"><g id="SVGRepo_bgCarrier" strokeWidth="1"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.1992 12C14.9606 12 17.1992 9.76142 17.1992 7C17.1992 4.23858 14.9606 2 12.1992 2C9.43779 2 7.19922 4.23858 7.19922 7C7.19922 9.76142 9.43779 12 12.1992 12Z" stroke="currentColor" strokeWidth="1" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21.5902 16.35L16.5002 21.44C15.9902 21.94 14.5002 22.1799 14.1502 21.8399C14.0173 21.4468 13.9851 21.0265 14.0567 20.6177C14.1284 20.2088 14.3015 19.8246 14.5602 19.5L19.6502 14.4C19.915 14.1767 20.254 14.0613 20.6001 14.0764C20.9461 14.0915 21.2738 14.2361 21.518 14.4817C21.7623 14.7272 21.9053 15.0557 21.9187 15.4018C21.932 15.7479 21.8148 16.0863 21.5902 16.35V16.35Z" stroke="currentColor" strokeWidth="1" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 22C3.57038 20.0332 4.74795 18.2971 6.36438 17.0399C7.98081 15.7827 9.95335 15.0687 12 15" stroke="currentColor" strokeWidth="1" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
              <span>Personalization</span>
            </button>

            <button 
              className={`settings-nav-item ${activeTab === 'voice' ? 'active' : ''}`}
              onClick={() => setActiveTab('voice')}
            >
              <svg viewBox="0 0 24 24" fill="none" className="nav-icon">
                <g strokeWidth="1"></g>
                <g strokeLinecap="round" strokeLinejoin="round"></g>
                <g>
                  <title>voice_line</title>
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g fillRule="nonzero">
                      <g>
                        <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fillRule="nonzero"></path>
                        <path d="M12,3 C12.51285,3 12.9355092,3.38604429 12.9932725,3.88337975 L13,4 L13,20 C13,20.5523 12.5523,21 12,21 C11.48715,21 11.0644908,20.613973 11.0067275,20.1166239 L11,20 L11,4 C11,3.44772 11.4477,3 12,3 Z M8,6 C8.55228,6 9,6.44772 9,7 L9,17 C9,17.5523 8.55228,18 8,18 C7.44772,18 7,17.5523 7,17 L7,7 C7,6.44772 7.44772,6 8,6 Z M16,6 C16.5523,6 17,6.44772 17,7 L17,17 C17,17.5523 16.5523,18 16,18 C15.4477,18 15,17.5523 15,17 L15,7 C15,6.44772 15.4477,6 16,6 Z M4,9 C4.55228,9 5,9.44772 5,10 L5,14 C5,14.5523 4.55228,15 4,15 C3.44772,15 3,14.5523 3,14 L3,10 C3,9.44772 3.44772,9 4,9 Z M20,9 C20.51285,9 20.9355092,9.38604429 20.9932725,9.88337975 L21,10 L21,14 C21,14.5523 20.5523,15 20,15 C19.48715,15 19.0644908,14.613973 19.0067275,14.1166239 L19,14 L19,10 C19,9.44772 19.4477,9 20,9 Z" fill="currentColor"></path>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
              <span>Voice</span>
            </button>

            <button 
              className={`settings-nav-item ${activeTab === 'data_control' ? 'active' : ''}`}
              onClick={() => setActiveTab('data_control')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" stroke-linecap="round" stroke-linejoin="round" className="nav-icon"><path d="M21 11.693V5"/><path d="m22 22-1.875-1.875"/><path d="M3 12a9 3 0 0 0 8.697 2.998"/><path d="M3 5v14a9 3 0 0 0 9.28 2.999"/><circle cx="18" cy="18" r="3"/><ellipse cx="12" cy="5" rx="9" ry="3"/></svg>
              <span>Data Control</span>
            </button>

            <button 
              className={`settings-nav-item ${activeTab === 'storage' ? 'active' : ''}`}
              onClick={() => setActiveTab('storage')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" stroke-linecap="round" stroke-linejoin="round" className="nav-icon"><path d="M10 16h.01"/><path d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><path d="M21.946 12.013H2.054"/><path d="M6 16h.01"/></svg>
              <span>Storage</span>
            </button>

            <button 
              className={`settings-nav-item ${activeTab === 'parental_control' ? 'active' : ''}`}
              onClick={() => setActiveTab('parental_control')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="nav-icon">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>Parental Control</span>
            </button>

            <button 
              className={`settings-nav-item ${activeTab === 'api_keys' ? 'active' : ''}`}
              onClick={() => setActiveTab('api_keys')}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="nav-icon"><g id="SVGRepo_bgCarrier" strokeWidth="1"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17.2606 11.4402C19.8781 11.4402 22 9.3269 22 6.72008C22 4.11325 19.8781 2 17.2606 2C14.643 2 12.5211 4.11325 12.5211 6.72008C12.5211 7.92754 13.0722 8.80569 13.0722 8.80569L7.3408 14.5137C7.08363 14.7698 6.72357 15.4358 7.3408 16.0505L8.00212 16.7091C8.25929 16.9286 8.90589 17.236 9.43495 16.7091L10.2065 15.9407C10.978 16.7091 11.8598 16.27 12.1904 15.8309C12.7415 15.0625 12.0802 14.2942 12.0802 14.2942L12.3007 14.0746C13.3588 15.1284 14.2846 14.5137 14.6153 14.0746C15.1664 13.3062 14.6153 12.5378 14.6153 12.5378C14.3948 12.0988 13.954 12.0988 14.505 11.5499L15.1664 10.8913C15.6954 11.3304 16.7829 11.4402 17.2606 11.4402Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"></path> <path d="M2 11.9899C2 16.7087 2 19.0681 3.46594 20.5341C4.93188 22 7.29127 22 12.0101 22C16.7288 22 19.0882 22 20.5542 20.5341C21.6692 19.419 21.9361 17.787 22 14.993M9.00704 2C6.21298 2.06388 4.58099 2.33078 3.46594 3.44584C2.48914 4.42263 2.16321 5.79612 2.05446 8" stroke="currentColor" strokeWidth="1" stroke-linecap="round"></path> </g></svg>
              <span>API Keys</span>
            </button>
          </div>

          {/* Right Content Area */}
          <div className="settings-content-pane">
            {activeTab === 'general' && (
              <div className="settings-tab-content">
                <div className="settings-form-group">
                  <span className="settings-group-title">Appearance</span>
                  <div className="theme-selector">
                    <button 
                      className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => handleSetTheme('light')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="option-icon">
                        <circle cx="12" cy="12" r="4"/>
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                      </svg>
                      <span>Light</span>
                    </button>
                    <button 
                      className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => handleSetTheme('dark')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="option-icon">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                      </svg>
                      <span>Dark</span>
                    </button>
                    <button 
                      className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                      onClick={() => handleSetTheme('system')}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="option-icon">
                        <rect width="20" height="14" x="2" y="3" rx="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                      <span>System</span>
                    </button>
                  </div>
                </div>

                <div className="settings-form-group">
                  <div className="accent-color-row">
                    <div className="accent-color-info">
                      <span className="settings-group-title" style={{ marginBottom: 0 }}>Accent Color</span>
                    </div>
                    <AccentDropdownSelect
                      options={accents}
                      value={accentColor}
                      onChange={handleSetAccentColor}
                    />
                  </div>
                </div>

                <div className="settings-form-group">
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <span className="toggle-label">Higher Intelligence</span>
                      <span className="toggle-desc">Enable advanced logic reasoning for responses.</span>
                    </div>
                    <button 
                      className={`toggle-switch ${higherIntelligence ? 'on' : ''}`}
                      onClick={handleToggleHigherIntelligence}
                      aria-label="Toggle Higher Intelligence"
                    >
                      <div className="toggle-thumb" />
                    </button>
                  </div>
                </div>

                <div className="settings-form-group">
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <span className="toggle-label">Enable Dictation</span>
                      <span className="toggle-desc">Enable microphone voice input dictation.</span>
                    </div>
                    <button 
                      className={`toggle-switch ${enableDetection ? 'on' : ''}`}
                      onClick={handleToggleEnableDetection}
                      aria-label="Toggle Enable Dictation"
                    >
                      <div className="toggle-thumb" />
                    </button>
                  </div>
                </div>

                <div className="settings-form-group">
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <span className="toggle-label">Cinematic Glow</span>
                      <span className="toggle-desc">Show the glowing ambient background colors in the chat area.</span>
                    </div>
                    <button 
                      className={`toggle-switch ${showBgBulbs ? 'on' : ''}`}
                      onClick={handleToggleBgBulbs}
                      aria-label="Toggle Cinematic Glow"
                    >
                      <div className="toggle-thumb" />
                    </button>
                  </div>
                </div>

                <div className="settings-form-group">
                  <div className="toggle-row">
                    <div className="toggle-info">
                      <span className="toggle-label">Smart Scroll</span>
                      <span className="toggle-desc">Enable horizontal edge-scrolling on the right boundary.</span>
                    </div>
                    <button 
                      className={`toggle-switch ${smartScroll ? 'on' : ''}`}
                      onClick={handleToggleSmartScroll}
                      aria-label="Toggle Smart Scroll"
                    >
                      <div className="toggle-thumb" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'personalization' && (
              <PersonalizationTab />
            )}
            {activeTab === 'voice' && (
              <VoiceTab />
            )}
            {activeTab === 'data_control' && (
              <DataControlTab setActiveSessionId={setActiveSessionId} />
            )}
            {activeTab === 'storage' && (
              <StorageTab />
            )}
            {activeTab === 'parental_control' && (
              <ParentalControlTab />
            )}
            {activeTab === 'api_keys' && (
              <ApiConfigTab />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
