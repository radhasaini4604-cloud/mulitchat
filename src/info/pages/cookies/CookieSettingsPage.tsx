import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import LandingFooter from '../../components/Footer'
import '../../components/base.css'
import '../../components/layout.css'
import './CookieSettingsPage.css'

export default function CookieSettingsPage() {
  useEffect(() => {
    document.title = 'Cookie Settings | Nothric';
    window.scrollTo(0, 0);
  }, []);

  const [analytics, setAnalytics] = useState(false)
  const [functional, setFunctional] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleAcceptAll = () => {
    setAnalytics(true)
    setFunctional(true)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="cookies-page-wrapper">
      {/* Cinematic Red/Dark Ambient Glow Spots */}
      <div className="cookies-glow-container">
        <div className="cookies-glow-blob cookies-glow-1" />
        <div className="cookies-glow-blob cookies-glow-2" />
      </div>

      <div className="ui-overlay" style={{ paddingBottom: 0 }}>
        {/* Navigation Header */}
        <Navbar />

        {/* Content Body */}
        <main className="cookies-content">
          <div className="cookies-meta">Preferences</div>
          <h1 className="cookies-title">Cookie Settings</h1>
          <p className="cookies-subtitle">
            Manage your cookie preferences. Cookies are small text files that help us improve your experience, analyze traffic, and ensure site performance. You can enable or disable different types of cookies below.
          </p>

          <div className="cookie-settings-list">
            {/* Required Cookies */}
            <div className="cookie-setting-item">
              <div className="cookie-setting-info">
                <h3 className="cookie-setting-title">Necessary Cookies</h3>
                <p className="cookie-setting-desc">
                  These cookies are essential for the website to function properly and cannot be disabled. They handle core security parameters, user authentication, and session status.
                </p>
              </div>
              <label className="switch-control">
                <input type="checkbox" checked disabled />
                <span className="switch-slider"></span>
              </label>
            </div>

            <hr className="cookie-divider" />

            {/* Performance Cookies */}
            <div className="cookie-setting-item">
              <div className="cookie-setting-info">
                <h3 className="cookie-setting-title">Performance & Analytics</h3>
                <p className="cookie-setting-desc">
                  These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site, identifying which pathways are popular.
                </p>
              </div>
              <label className="switch-control">
                <input 
                  type="checkbox" 
                  checked={analytics} 
                  onChange={(e) => setAnalytics(e.target.checked)} 
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <hr className="cookie-divider" />

            {/* Functional Cookies */}
            <div className="cookie-setting-item">
              <div className="cookie-setting-info">
                <h3 className="cookie-setting-title">Functional & Personalization</h3>
                <p className="cookie-setting-desc">
                  These cookies enable the website to provide enhanced functionality, such as retaining developer console logs, workspace configurations, and chat layouts.
                </p>
              </div>
              <label className="switch-control">
                <input 
                  type="checkbox" 
                  checked={functional} 
                  onChange={(e) => setFunctional(e.target.checked)} 
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div className="cookie-actions">
            <button className="btn-cookie-save" onClick={handleSave}>
              Save Preferences
            </button>
            <button className="btn-cookie-accept-all" onClick={handleAcceptAll}>
              Accept All Cookies
            </button>
          </div>

          {saved && (
            <div className="cookies-save-success">
              <span className="success-icon">✓</span> Preference configurations updated and saved.
            </div>
          )}
        </main>

        <LandingFooter />
      </div>
    </div>
  )
}
