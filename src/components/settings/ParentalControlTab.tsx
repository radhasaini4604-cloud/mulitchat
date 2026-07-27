import { useState, useEffect } from 'react'
import { setAppSetting } from '../../Main_chat/utils/settingsSync'
import './ParentalControlTab.css'

export function ParentalControlTab() {
  const [explicitFilter, setExplicitFilter] = useState(() => localStorage.getItem('parental-explicit-filter') === 'true')
  const [safeSearch, setSafeSearch] = useState(() => localStorage.getItem('parental-safesearch') !== 'false')
  const [ageRating, setAgeRating] = useState(() => localStorage.getItem('parental-age-rating') || 'Unrestricted')
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(() => localStorage.getItem('parental-time-limit-enabled') === 'true')
  const [dailyLimit, setDailyLimit] = useState(() => localStorage.getItem('parental-daily-limit') || '2 Hours')
  const [isLocked, setIsLocked] = useState(() => localStorage.getItem('parental-locked') === 'true')

  useEffect(() => {
    const handleSync = () => {
      setExplicitFilter(localStorage.getItem('parental-explicit-filter') === 'true')
      setSafeSearch(localStorage.getItem('parental-safesearch') !== 'false')
      setAgeRating(localStorage.getItem('parental-age-rating') || 'Unrestricted')
      setTimeLimitEnabled(localStorage.getItem('parental-time-limit-enabled') === 'true')
      setDailyLimit(localStorage.getItem('parental-daily-limit') || '2 Hours')
      setIsLocked(localStorage.getItem('parental-locked') === 'true')
    }
    window.addEventListener('app_settings_synced', handleSync)
    return () => window.removeEventListener('app_settings_synced', handleSync)
  }, [])

  const handleToggleExplicit = () => {
    const nextVal = !explicitFilter
    setExplicitFilter(nextVal)
    setAppSetting('parental-explicit-filter', String(nextVal))
  }

  const handleToggleSafeSearch = () => {
    const nextVal = !safeSearch
    setSafeSearch(nextVal)
    setAppSetting('parental-safesearch', String(nextVal))
  }

  const handleToggleTimeLimit = () => {
    const nextVal = !timeLimitEnabled
    setTimeLimitEnabled(nextVal)
    setAppSetting('parental-time-limit-enabled', String(nextVal))
  }

  const handleSetAgeRating = (val: string) => {
    setAgeRating(val)
    setAppSetting('parental-age-rating', val)
  }

  const handleSetDailyLimit = (val: string) => {
    setDailyLimit(val)
    setAppSetting('parental-daily-limit', val)
  }

  const handleLockToggle = () => {
    const nextVal = !isLocked
    setIsLocked(nextVal)
    setAppSetting('parental-locked', String(nextVal))
    if (nextVal) {
      alert('Parental controls have been locked with your passcode.')
    } else {
      alert('Parental controls have been unlocked.')
    }
  }

  return (
    <div className="parental-tab-content">
      <div className="parental-header-section">
        <h3>Parental Control</h3>
      </div>

      {/* Explicit Content Filter */}
      <div className="parental-row">
        <div className="parental-info">
          <span className="parental-label">Explicit Content Filter</span>
          <span className="parental-desc">Restrict explicit responses, language, or assets in chat.</span>
        </div>
        <button 
          type="button"
          className={`toggle-switch ${explicitFilter ? 'on' : ''}`}
          onClick={handleToggleExplicit}
          aria-label="Toggle Explicit Content Filter"
        >
          <div className="toggle-thumb" />
        </button>
      </div>

      {/* SafeSearch Mode */}
      <div className="parental-row">
        <div className="parental-info">
          <span className="parental-label">SafeSearch Mode</span>
          <span className="parental-desc">Enforce strict context and external link safety evaluations.</span>
        </div>
        <button 
          type="button"
          className={`toggle-switch ${safeSearch ? 'on' : ''}`}
          onClick={handleToggleSafeSearch}
          aria-label="Toggle SafeSearch Mode"
        >
          <div className="toggle-thumb" />
        </button>
      </div>

      <div className="parental-section-divider" />

      {/* Age Rating Limit */}
      <div className="parental-row align-center">
        <div className="parental-info">
          <span className="parental-label">Max Content Rating</span>
          <span className="parental-desc">Set age-appropriate filters for conversation topics.</span>
        </div>
        <select 
          className="parental-select" 
          value={ageRating} 
          onChange={(e) => handleSetAgeRating(e.target.value)}
        >
          <option value="Unrestricted">Unrestricted</option>
          <option value="18+ Mature">18+ Mature</option>
          <option value="13+ Teen">13+ Teen</option>
          <option value="Under 13">Under 13</option>
        </select>
      </div>

      {/* Daily Usage Time Limit */}
      <div className="parental-row align-center">
        <div className="parental-info">
          <span className="parental-label">Daily Chat Time Limit</span>
          <span className="parental-desc">Enable dynamic timeout limits to restrict usage per day.</span>
        </div>
        <div className="parental-time-control">
          {timeLimitEnabled && (
            <select 
              className="parental-select inline-select" 
              value={dailyLimit} 
              onChange={(e) => handleSetDailyLimit(e.target.value)}
            >
              <option value="30 Minutes">30 Mins</option>
              <option value="1 Hour">1 Hour</option>
              <option value="2 Hours">2 Hours</option>
              <option value="3 Hours">3 Hours</option>
            </select>
          )}
          <button 
            type="button"
            className={`toggle-switch ${timeLimitEnabled ? 'on' : ''}`}
            onClick={handleToggleTimeLimit}
            aria-label="Toggle Daily Chat Time Limit"
          >
            <div className="toggle-thumb" />
          </button>
        </div>
      </div>

      <div className="parental-section-divider" />

      {/* Parental Lock Configuration */}
      <div className="parental-row align-center">
        <div className="parental-info">
          <span className="parental-label">Lock Settings</span>
          <span className="parental-desc">Prevent children or guests from modifying these restriction rules.</span>
        </div>
        <button 
          type="button" 
          className={`parental-btn-secondary ${isLocked ? 'locked' : ''}`} 
          onClick={handleLockToggle}
        >
          {isLocked ? (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Unlock settings</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
              </svg>
              <span>Lock settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
