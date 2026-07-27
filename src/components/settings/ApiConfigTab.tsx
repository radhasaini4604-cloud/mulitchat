import { useState } from 'react'
import './ApiConfigTab.css'

interface ApiKeyFieldProps {
  id: string
  label: string
  description?: string
  placeholder: string
  value: string
  onChange: (val: string) => void
}

function ApiKeyField({ id, label, description, placeholder, value, onChange }: ApiKeyFieldProps) {
  const [showKey, setShowKey] = useState(false)

  return (
    <div className="api-config-field">
      <div className="api-config-info">
        <label className="api-config-label" htmlFor={id}>
          {label}
        </label>
        {description && <span className="api-config-desc">{description}</span>}
      </div>
      <div className="api-config-input-wrapper">
        <input
          id={id}
          type={showKey ? 'text' : 'password'}
          className="api-config-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="api-config-visibility-btn"
          onClick={() => setShowKey(!showKey)}
          aria-label={showKey ? 'Hide key' : 'Show key'}
        >
          {showKey ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="visibility-icon">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="visibility-icon">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export function ApiConfigTab() {
  const [gemini, setGemini] = useState(() => localStorage.getItem('api-key-gemini') || '')
  const [groq, setGroq] = useState(() => localStorage.getItem('api-key-groq') || '')
  const [mistral, setMistral] = useState(() => localStorage.getItem('api-key-mistral') || '')
  const [cohere, setCohere] = useState(() => localStorage.getItem('api-key-cohere') || '')
  const [nvidia, setNvidia] = useState(() => localStorage.getItem('api-key-nvidia') || '')
  const [cfAccount, setCfAccount] = useState(() => localStorage.getItem('api-key-cloudflare-account') || '')
  const [cfToken, setCfToken] = useState(() => localStorage.getItem('api-key-cloudflare-token') || '')
  const [tavily, setTavily] = useState(() => localStorage.getItem('api-key-tavily') || '')

  const updateKey = (keyName: string, val: string, setter: (v: string) => void) => {
    setter(val)
    if (val.trim() === '') {
      localStorage.removeItem(keyName)
    } else {
      localStorage.setItem(keyName, val.trim())
    }
    // Dispatch event to notify handlers in real time
    window.dispatchEvent(new Event('api-keys-changed'))
  }

  return (
    <div className="api-config-tab-content">
      <div className="api-config-header-section">
        <div className="api-config-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ margin: 0 }}>API Configuration</h3>
          <button
            type="button"
            className="api-config-guide-btn"
            onClick={() => {
              if (window.navigate) {
                window.navigate('/api-guide');
              } else {
                window.location.href = '/api-guide';
              }
            }}
          >
            Setup Guide
          </button>
        </div>
        <p className="api-config-tab-intro">
          If you have exceeded the shared free tier limits, configure your own API keys below to continue using Nothric models seamlessly. Your keys are stored locally on your device.
        </p>
      </div>

      <div className="api-config-scroll-area">
        <ApiKeyField
          id="api-gemini"
          label="Gemini API Key"
          placeholder="AIzaSy..."
          value={gemini}
          onChange={(val) => updateKey('api-key-gemini', val, setGemini)}
        />

        <div className="api-config-divider" />

        <ApiKeyField
          id="api-groq"
          label="Groq API Key"
          placeholder="gsk_..."
          value={groq}
          onChange={(val) => updateKey('api-key-groq', val, setGroq)}
        />

        <div className="api-config-divider" />

        <ApiKeyField
          id="api-mistral"
          label="Mistral API Key"
          placeholder="Mistral key..."
          value={mistral}
          onChange={(val) => updateKey('api-key-mistral', val, setMistral)}
        />

        <div className="api-config-divider" />

        <ApiKeyField
          id="api-cohere"
          label="Cohere API Key"
          placeholder="Cohere key..."
          value={cohere}
          onChange={(val) => updateKey('api-key-cohere', val, setCohere)}
        />

        <div className="api-config-divider" />

        <ApiKeyField
          id="api-nvidia"
          label="NVIDIA API Key"
          placeholder="nvapi-..."
          value={nvidia}
          onChange={(val) => updateKey('api-key-nvidia', val, setNvidia)}
        />

        <div className="api-config-divider" />

        <div className="api-config-field-group">
          <div className="api-config-group-header">
            <span className="api-config-label">Cloudflare Workers AI</span>
          </div>
          <div className="api-config-two-column">
            <div className="api-config-column">
              <label className="api-config-sublabel" htmlFor="api-cf-account">Account ID</label>
              <input
                id="api-cf-account"
                type="text"
                className="api-config-input"
                placeholder="Cloudflare Account ID..."
                value={cfAccount}
                onChange={(e) => updateKey('api-key-cloudflare-account', e.target.value, setCfAccount)}
              />
            </div>
            <div className="api-config-column">
              <label className="api-config-sublabel" htmlFor="api-cf-token">API Token</label>
              <input
                id="api-cf-token"
                type="password"
                className="api-config-input"
                placeholder="Cloudflare API Token..."
                value={cfToken}
                onChange={(e) => updateKey('api-key-cloudflare-token', e.target.value, setCfToken)}
              />
            </div>
          </div>
        </div>

        <div className="api-config-divider" />

        <ApiKeyField
          id="api-tavily"
          label="Tavily API Key"
          placeholder="tvly-..."
          value={tavily}
          onChange={(val) => updateKey('api-key-tavily', val, setTavily)}
        />
      </div>
    </div>
  )
}
