import { useState, useEffect, useRef } from 'react'
import { ProfileModal } from '../../components/ProfileModal/ProfileModal'
import { useAuth } from '../../context/AuthContext'
import { SettingsModal } from '../../components/settings/SettingsModal'
import { ArchivedChatsModal } from '../../components/ArchivedChatsModal/ArchivedChatsModal'
import './UserCard.css'
import { navigate } from '../../navigation'
import { supabase, uploadImageToBucket } from '../../lib/supabase'
import { AuthModal } from '../../components/AuthModal/AuthModal'
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal'

interface UserCardProps {
  isCollapsed: boolean;
  activeSessionId?: string | null;
  setActiveSessionId?: (id: string | null) => void;
}

export function UserCard({ isCollapsed, activeSessionId, setActiveSessionId }: UserCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isArchivedModalOpen, setIsArchivedModalOpen] = useState(false)
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false)

  const { user, setUser } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Load profile state from localStorage on init
  const [name, setName] = useState(() => localStorage.getItem('user-display-name') || 'Guest')
  const [username, setUsername] = useState(() => localStorage.getItem('user-username') || 'guest')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => localStorage.getItem('user-avatar') || null)

  const displayName = user ? (user.user_metadata?.custom_display_name || user.user_metadata?.display_name || user.email?.split('@')[0]) : name;
  const displayUsername = user ? (user.user_metadata?.custom_username || user.user_metadata?.username || user.email?.split('@')[0]) : username;
  const displayAvatarUrl = user ? (user.user_metadata?.custom_avatar_url || user.user_metadata?.avatar_url || null) : avatarUrl;

  // Dynamic Daily Quota Calculation
  const [quotaStats, setQuotaStats] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    const savedDate = localStorage.getItem('nothric_daily_usage_date');
    let count = parseInt(localStorage.getItem('nothric_daily_usage_count') || '0', 10);

    if (savedDate !== today) {
      localStorage.setItem('nothric_daily_usage_date', today);
      localStorage.setItem('nothric_daily_usage_count', '0');
      count = 0;
    }

    const hasCustomKey = !!(
      localStorage.getItem('nothric-settings-openai-key') ||
      localStorage.getItem('nothric-settings-gemini-key') ||
      localStorage.getItem('nothric-settings-anthropic-key') ||
      localStorage.getItem('nothric-settings-groq-key')
    );

    const maxLimit = 25;
    const percent = hasCustomKey ? 0 : Math.min(100, Math.round((count / maxLimit) * 100));

    return { count, maxLimit, percent, hasCustomKey };
  });

  useEffect(() => {
    const updateQuota = () => {
      const today = new Date().toISOString().slice(0, 10);
      const savedDate = localStorage.getItem('nothric_daily_usage_date');
      let count = parseInt(localStorage.getItem('nothric_daily_usage_count') || '0', 10);

      if (savedDate !== today) {
        localStorage.setItem('nothric_daily_usage_date', today);
        localStorage.setItem('nothric_daily_usage_count', '0');
        count = 0;
      }

      const hasCustomKey = !!(
        localStorage.getItem('nothric-settings-openai-key') ||
        localStorage.getItem('nothric-settings-gemini-key') ||
        localStorage.getItem('nothric-settings-anthropic-key') ||
        localStorage.getItem('nothric-settings-groq-key')
      );

      const maxLimit = 25;
      const percent = hasCustomKey ? 0 : Math.min(100, Math.round((count / maxLimit) * 100));

      setQuotaStats({ count, maxLimit, percent, hasCustomKey });
    };

    window.addEventListener('nothric-usage-updated', updateQuota);
    window.addEventListener('storage', updateQuota);
    return () => {
      window.removeEventListener('nothric-usage-updated', updateQuota);
      window.removeEventListener('storage', updateQuota);
    };
  }, []);

  const lastUserIdRef = useRef<string | null>(user?.id ?? null)

  useEffect(() => {
    const currentUserId = user?.id ?? null
    const lastUserId = lastUserIdRef.current

    if (currentUserId !== lastUserId) {
      if (setActiveSessionId) {
        setActiveSessionId(null)
      }
      window.dispatchEvent(new Event('chat-sessions-updated'))
    }
    lastUserIdRef.current = currentUserId
  }, [user, setActiveSessionId])

  // Toggle profile menu dropdown
  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(!isMenuOpen)
  }

  // Handle header click inside dropdown to edit profile
  const handleHeaderClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    setIsProfileModalOpen(true)
  }

  // Close dropdown on outside click
  useEffect(() => {
    if (!isMenuOpen) return
    const handleOutsideClick = () => {
      setIsMenuOpen(false)
    }
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleOutsideClick)
    }, 0)
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [isMenuOpen])

  // Reset support submenu state when the profile menu closes
  useEffect(() => {
    if (!isMenuOpen) {
      setIsSupportOpen(false)
    }
  }, [isMenuOpen])

  // Close dropdown on window blur, tab visibility change, pagehide, or beforeunload
  useEffect(() => {
    const handleClose = () => {
      setIsMenuOpen(false)
      setIsSupportOpen(false)
    }

    window.addEventListener('blur', handleClose)
    document.addEventListener('visibilitychange', handleClose)
    window.addEventListener('pagehide', handleClose)
    window.addEventListener('beforeunload', handleClose)

    return () => {
      window.removeEventListener('blur', handleClose)
      document.removeEventListener('visibilitychange', handleClose)
      window.removeEventListener('pagehide', handleClose)
      window.removeEventListener('beforeunload', handleClose)
    }
  }, [])


  const handleProfileSave = async (newName: string, newUsername: string, newAvatarUrl: string | null) => {
    setName(newName)
    setUsername(newUsername)
    setIsProfileModalOpen(false)

    localStorage.setItem('user-display-name', newName)
    localStorage.setItem('user-username', newUsername)

    let finalAvatarUrl = newAvatarUrl

    if (user) {
      if (newAvatarUrl && newAvatarUrl.startsWith('data:')) {
        try {
          finalAvatarUrl = await uploadImageToBucket('avatars', `${user.id}/avatar.png`, newAvatarUrl)
        } catch (uploadErr) {
          console.error("Failed to upload avatar to Supabase storage bucket:", uploadErr)
        }
      }

      try {
        const { data, error } = await supabase.auth.updateUser({
          data: {
            custom_display_name: newName,
            custom_username: newUsername,
            custom_avatar_url: finalAvatarUrl,
            display_name: newName,
            username: newUsername,
            avatar_url: finalAvatarUrl
          }
        })
        if (error) throw error
        setUser(data.user)
      } catch (err) {
        console.error("Failed to update user profile metadata in Supabase:", err)
      }
    } else {
      setAvatarUrl(newAvatarUrl)
      if (newAvatarUrl) {
        localStorage.setItem('user-avatar', newAvatarUrl)
      } else {
        localStorage.removeItem('user-avatar')
      }
    }
  }

  if (!user) {
    if (isCollapsed) {
      return (
        <div className="user-card collapsed" style={{ borderTopColor: 'transparent', justifyContent: 'center' }}>
          <button
            className="collapsed-login-btn"
            onClick={() => setIsAuthModalOpen(true)}
            aria-label="Log in"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="collapsed-login-icon">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span className="custom-tooltip">Log in</span>
          </button>

          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className={`user-card ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Profile Menu Dropdown */}
      {isMenuOpen && (
        <div className="profile-menu-dropdown" onClick={(e) => e.stopPropagation()}>
          {/* Header Item */}
          <button
            className="dropdown-header-item"
            aria-label="View Account Profile"
            onClick={handleHeaderClick}
            onMouseEnter={() => setIsSupportOpen(false)}
          >
            <div className="user-avatar">
              {displayAvatarUrl ? (
                <img src={displayAvatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="dropdown-user-details">
              <span className="dropdown-user-name">{displayName}</span>
              <span className="dropdown-user-plan">@{displayUsername}</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="item-arrow">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="dropdown-divider" />

          {/* Settings */}
          <button
            className="dropdown-item"
            onMouseEnter={() => setIsSupportOpen(false)}
            onClick={() => {
              setIsMenuOpen(false)
              setIsSettingsOpen(true)
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
              <line x1="10" y1="7" x2="19" y2="7" />
              <circle cx="7" cy="7" r="3" />
              <line x1="5" y1="17" x2="14" y2="17" />
              <circle cx="17" cy="17" r="3" />
            </svg>
            <span>Settings</span>
          </button>

          {/* Upgrade plan */}
          <button
            className="dropdown-item"
            onClick={() => navigate('/pricing')}
            onMouseEnter={() => setIsSupportOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
              <path d="M12 2a10 10 0 0 1 7.38 16.75" />
              <path d="m16 12-4-4-4 4" />
              <path d="M12 16V8" />
              <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
              <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
              <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
              <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
            </svg>
            <span>Upgrade plan</span>
          </button>

          {/* Archived chats */}
          <button
            className="dropdown-item"
            onMouseEnter={() => setIsSupportOpen(false)}
            onClick={() => {
              setIsMenuOpen(false)
              setIsArchivedModalOpen(true)
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="dropdown-item-icon"><g id="SVGRepo_bgCarrier" strokeWidth="1"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12" stroke="currentColor" strokeWidth="1"></path> <path d="M2 14C2 11.1997 2 9.79961 2.54497 8.73005C3.02433 7.78924 3.78924 7.02433 4.73005 6.54497C5.79961 6 7.19974 6 10 6H14C16.8003 6 18.2004 6 19.27 6.54497C20.2108 7.02433 20.9757 7.78924 21.455 8.73005C22 9.79961 22 11.1997 22 14C22 16.8003 22 18.2004 21.455 19.27C20.9757 20.2108 20.2108 20.9757 19.27 21.455C18.2004 22 16.8003 22 14 22H10C7.19974 22 5.79961 22 4.73005 21.455C3.78924 20.9757 3.02433 20.2108 2.54497 19.27C2 18.2004 2 16.8003 2 14Z" stroke="currentColor" strokeWidth="1"></path> <path d="M12 11L12 17M12 17L14.5 14.5M12 17L9.5 14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            <span>Archived chats</span>
          </button>

          {/* Ultra-slim Daily Quota Pipeline Meter */}
          <div className="daily-quota-pipeline-container" onMouseEnter={() => setIsSupportOpen(false)}>
            <div className="daily-quota-pipeline-bar">
              <div
                className="daily-quota-pipeline-fill"
                style={{
                  width: `${quotaStats.hasCustomKey ? 0 : quotaStats.percent}%`
                }}
              />
            </div>
            <span className="daily-quota-tooltip">
              {quotaStats.hasCustomKey
                ? 'Custom API active'
                : `${quotaStats.percent}% daily quota used`}
            </span>
          </div>

          {/* Support */}
          <div
            className={`support-item-container ${isSupportOpen ? 'open' : ''}`}
            onMouseEnter={() => setIsSupportOpen(true)}
          >
            <button className="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
                <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
              </svg>
              <span>Support</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="item-arrow">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className="support-hover-card">
              <a href="/support" target="_blank" rel="noopener noreferrer" className="hover-card-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover-card-item-icon">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Support</span>
              </a>
              <a href="/api-guide" target="_blank" rel="noopener noreferrer" className="hover-card-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover-card-item-icon">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>Setup Guide</span>
              </a>
              <a href="/docs/release-notes" target="_blank" rel="noopener noreferrer" className="hover-card-item">
                <svg viewBox="2.5 1 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover-card-item-icon">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.808 4.00001H15.329C15.3863 4.00001 15.4433 4.00367 15.5 4.01101C17.7473 4.16817 19.4924 6.0332 19.5 8.28601V14.715C19.4917 17.0871 17.5641 19.0044 15.192 19H9.808C7.43551 19.0044 5.50772 17.0865 5.5 14.714V8.28601C5.50772 5.91353 7.43551 3.99558 9.808 4.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M19.5 9.03599C19.9142 9.03599 20.25 8.7002 20.25 8.28599C20.25 7.87177 19.9142 7.53599 19.5 7.53599V9.03599ZM15.5 8.28599H14.75C14.75 8.7002 15.0858 9.03599 15.5 9.03599V8.28599ZM16.25 4.01099C16.25 3.59677 15.9142 3.26099 15.5 3.26099C15.0858 3.26099 14.75 3.59677 14.75 4.01099H16.25ZM14.5 12.75C14.9142 12.75 15.25 12.4142 15.25 12C15.25 11.5858 14.9142 11.25 14.5 11.25V12.75ZM8.5 11.25C8.08579 11.25 7.75 11.5858 7.75 12C7.75 12.4142 8.08579 12.75 8.5 12.75V11.25ZM11.5 9.74999C11.9142 9.74999 12.25 9.4142 12.25 8.99999C12.25 8.58577 11.9142 8.24999 11.5 8.24999V9.74999ZM8.5 8.24999C8.08579 8.24999 7.75 8.58577 7.75 8.99999C7.75 9.4142 8.08579 9.74999 8.5 9.74999V8.24999ZM15.5 15.75C15.9142 15.75 16.25 15.4142 16.25 15C16.25 14.5858 15.9142 14.25 15.5 14.25V15.75ZM8.5 14.25C8.08579 14.25 7.75 14.5858 7.75 15C7.75 15.4142 8.08579 15.75 8.5 15.75V14.25ZM19.5 7.53599H15.5V9.03599H19.5V7.53599ZM16.25 8.28599V4.01099H14.75V8.28599H16.25ZM14.5 11.25H8.5V12.75H14.5V11.25ZM11.5 8.24999H8.5V9.74999H11.5V8.24999ZM15.5 14.25H8.5V15.75H15.5V14.25Z" fill="currentColor"></path>
                </svg>
                <span>Release Notes</span>
              </a>
              <div className="hover-card-divider" />
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover-card-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover-card-item-icon">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Privacy Policy</span>
              </a>
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover-card-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hover-card-item-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <polyline points="9 15 11 17 15 13" />
                </svg>
                <span>Terms &amp; Conditions</span>
              </a>
            </div>
          </div>

          {/* Logout or Cloud Login */}
          {user ? (
            <button
              className="dropdown-item logout-item"
              onMouseEnter={() => setIsSupportOpen(false)}
              onClick={() => {
                setIsMenuOpen(false);
                setIsLogoutConfirmOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          ) : (
            <button
              className="dropdown-item"
              onMouseEnter={() => setIsSupportOpen(false)}
              onClick={() => {
                setIsMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Cloud Login</span>
            </button>
          )}
        </div>
      )}

      <button className="profile-btn" aria-label="User Profile" onClick={handleProfileClick}>
        <div className="user-avatar">
          {displayAvatarUrl ? (
            <img src={displayAvatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <span>{displayName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <span className="user-name">{displayName}</span>
        <span className="custom-tooltip">{displayName}</span>
      </button>

      <button className="settings-btn" aria-label="Settings" onClick={() => setIsSettingsOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="settings-icon"
        >
          {/* Top Row: Line from x=10 to 19, Circle at cx=7 */}
          <line className="line-top" x1="10" y1="7" x2="19" y2="7" />
          <circle className="circle-top" cx="7" cy="7" r="3" />

          {/* Bottom Row: Line from x=5 to 14, Circle at cx=17 */}
          <line className="line-bottom" x1="5" y1="17" x2="14" y2="17" />
          <circle className="circle-bottom" cx="17" cy="17" r="3" />
        </svg>
        <span className="custom-tooltip">Settings</span>
      </button>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentName={displayName}
        currentUsername={displayUsername}
        currentAvatarUrl={displayAvatarUrl}
        onSave={handleProfileSave}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        setActiveSessionId={setActiveSessionId}
      />

      {/* Archived Chats Modal */}
      <ArchivedChatsModal
        isOpen={isArchivedModalOpen}
        onClose={() => setIsArchivedModalOpen(false)}
        activeSessionId={activeSessionId || null}
        setActiveSessionId={setActiveSessionId || (() => { })}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        type="logout"
        onConfirm={async () => {
          localStorage.removeItem('user-display-name');
          localStorage.removeItem('user-username');
          localStorage.removeItem('user-avatar');
          localStorage.removeItem('auth_user_cache');
          setName('Guest');
          setUsername('guest');
          setAvatarUrl(null);
          await supabase.auth.signOut();
          window.location.href = '/';
        }}
      />
    </div>
  );
}
