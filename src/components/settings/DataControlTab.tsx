import { useState, useEffect } from 'react'
import { setAppSetting } from '../../Main_chat/utils/settingsSync'
import './DataControlTab.css'
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal'
import { clearAllChatsFromDB } from '../../Main_chat/utils/db'

interface SharedLink {
  id: string
  title: string
  url: string
  date: string
}

interface DataControlTabProps {
  setActiveSessionId?: (id: string | null) => void
}

export function DataControlTab({ setActiveSessionId }: DataControlTabProps) {
  const [memory, setMemory] = useState(() => localStorage.getItem('datacontrol-memory') === 'true')
  const [trainModel, setTrainModel] = useState(() => localStorage.getItem('datacontrol-train-model') !== 'false')
  const [shareLink, setShareLink] = useState(() => localStorage.getItem('datacontrol-share-link') !== 'false')

  useEffect(() => {
    const handleSync = () => {
      setMemory(localStorage.getItem('datacontrol-memory') === 'true')
      setTrainModel(localStorage.getItem('datacontrol-train-model') !== 'false')
      setShareLink(localStorage.getItem('datacontrol-share-link') !== 'false')
    }
    window.addEventListener('app_settings_synced', handleSync)
    return () => window.removeEventListener('app_settings_synced', handleSync)
  }, [])
  
  // Custom modal configuration
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
  } | null>(null)

  // Navigation to sub panel
  const [showSharedLinks, setShowSharedLinks] = useState(false)

  // Dummy list of shared links for management panel
  const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([
    { id: '1', title: 'Nothric Chat - Project Plan', url: '/share/nothric-project-plan', date: 'June 20, 2026' },
    { id: '2', title: 'Python Code Helper Functions', url: '/share/python-helpers', date: 'June 18, 2026' },
    { id: '3', title: 'Marketing Strategy Outline', url: '/share/marketing-strategy', date: 'June 10, 2026' },
  ])

  const handleToggleMemory = () => {
    const nextVal = !memory
    setMemory(nextVal)
    setAppSetting('datacontrol-memory', String(nextVal))
  }

  const handleToggleTrainModel = () => {
    const nextVal = !trainModel
    setTrainModel(nextVal)
    setAppSetting('datacontrol-train-model', String(nextVal))
  }

  const handleToggleShareLink = () => {
    const nextVal = !shareLink
    setShareLink(nextVal)
    setAppSetting('datacontrol-share-link', String(nextVal))
  }

  const handleDeleteLink = (id: string) => {
    const link = sharedLinks.find(l => l.id === id)
    if (!link) return
    setModalConfig({
      isOpen: true,
      title: 'Delete Shared Link',
      description: `Are you sure you want to delete the shared link for "${link.title}"? Anyone with this link will no longer be able to access the conversation history.`,
      onConfirm: () => {
        setSharedLinks(prev => prev.filter(l => l.id !== id))
      }
    })
  }

  const handleDeleteAllChats = () => {
    setModalConfig({
      isOpen: true,
      title: 'Delete All Chats',
      description: 'Are you sure you want to delete all chats? This action cannot be undone and will permanently remove all conversations from your history.',
      onConfirm: () => {
        clearAllChatsFromDB()
          .then(() => {
            if (setActiveSessionId) {
              setActiveSessionId(null)
            }
            window.dispatchEvent(new Event('chat-sessions-updated'))
          })
          .catch((err) => {
            console.error('Failed to delete all chats:', err)
            alert('Failed to delete all chats: ' + ((err as any)?.message || String(err)))
          })
      }
    })
  }

  const handleDeleteAllImages = () => {
    setModalConfig({
      isOpen: true,
      title: 'Delete All Shared Images',
      description: 'Are you sure you want to delete all shared images? This action cannot be undone and will permanently remove all uploaded and shared images.',
      onConfirm: () => {
        console.log('All shared images deleted successfully.')
      }
    })
  }

  const handleDeleteAccount = () => {
    setModalConfig({
      isOpen: true,
      title: 'Delete Account',
      description: 'WARNING: Are you sure you want to permanently delete your account? All data, settings, and histories will be permanently lost and cannot be recovered.',
      onConfirm: () => {
        console.log('Account deletion request submitted.')
      }
    })
  }

  if (showSharedLinks) {
    return (
      <div className="datacontrol-tab-content">
        <div className="datacontrol-subpanel-header">
          <button type="button" className="datacontrol-back-btn" onClick={() => setShowSharedLinks(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="back-icon">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <span>Back to Data Control</span>
          </button>
          <h3>Shared Links</h3>
        </div>

        <p className="datacontrol-desc subpanel-desc">
          Manage the public links you've created to share chats. Anyone with the link can view the shared conversation history.
        </p>

        <div className="shared-links-list">
          {sharedLinks.length === 0 ? (
            <div className="empty-shared-links">No active shared links found.</div>
          ) : (
            sharedLinks.map(link => (
              <div key={link.id} className="shared-link-item">
                <div className="shared-link-details">
                  <span className="shared-link-title">{link.title}</span>
                  <span className="shared-link-date">Shared on {link.date}</span>
                </div>
                <div className="shared-link-actions">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn-link-action">View</a>
                  <button type="button" className="btn-link-action delete-link-btn" onClick={() => handleDeleteLink(link.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
        {modalConfig && (
          <ConfirmationModal
            isOpen={modalConfig.isOpen}
            onClose={() => setModalConfig(null)}
            type="delete"
            title={modalConfig.title}
            description={modalConfig.description}
            onConfirm={modalConfig.onConfirm}
          />
        )}
      </div>
    )
  }

  return (
    <div className="datacontrol-tab-content">
      <div className="datacontrol-header-section">
        <h3>Data Control</h3>
      </div>

      {/* Memory toggle */}
      <div className="datacontrol-row">
        <div className="datacontrol-info">
          <span className="datacontrol-label">Memory</span>
          <span className="datacontrol-desc">Let Nothric remember details from your conversations to personalize future chats.</span>
        </div>
        <button 
          type="button"
          className={`toggle-switch ${memory ? 'on' : ''}`}
          onClick={handleToggleMemory}
          aria-label="Toggle Memory"
        >
          <div className="toggle-thumb" />
        </button>
      </div>

      {/* Train model toggle */}
      <div className="datacontrol-row">
        <div className="datacontrol-info">
          <span className="datacontrol-label">Train model from conversations</span>
          <span className="datacontrol-desc">Allow us to train and improve Nothric models using conversation history.</span>
        </div>
        <button 
          type="button"
          className={`toggle-switch ${trainModel ? 'on' : ''}`}
          onClick={handleToggleTrainModel}
          aria-label="Toggle Train Model"
        >
          <div className="toggle-thumb" />
        </button>
      </div>

      {/* Share link toggle */}
      <div className="datacontrol-row">
        <div className="datacontrol-info">
          <span className="datacontrol-label">Share link</span>
          <span className="datacontrol-desc">Enable creation of public links to share your conversations.</span>
        </div>
        <button 
          type="button"
          className={`toggle-switch ${shareLink ? 'on' : ''}`}
          onClick={handleToggleShareLink}
          aria-label="Toggle Share Link"
        >
          <div className="toggle-thumb" />
        </button>
      </div>

      {/* Manage share links button */}
      <div className="datacontrol-row align-center">
        <div className="datacontrol-info">
          <span className="datacontrol-label">Manage shared links</span>
          <span className="datacontrol-desc">View and delete public links you have shared with others.</span>
        </div>
        <button type="button" className="datacontrol-btn-secondary" onClick={() => setShowSharedLinks(true)}>
          Manage
        </button>
      </div>

      <div className="datacontrol-section-divider" />

      {/* Danger Zone Actions */}
      <div className="datacontrol-row align-center">
        <div className="datacontrol-info">
          <span className="datacontrol-label">Delete all chats</span>
          <span className="datacontrol-desc">Permanently remove all conversations from your history.</span>
        </div>
        <button type="button" className="datacontrol-btn-danger" onClick={handleDeleteAllChats}>
          Delete
        </button>
      </div>

      <div className="datacontrol-row align-center">
        <div className="datacontrol-info">
          <span className="datacontrol-label">Delete all images shared</span>
          <span className="datacontrol-desc">Permanently remove all uploaded and shared images.</span>
        </div>
        <button type="button" className="datacontrol-btn-danger" onClick={handleDeleteAllImages}>
          Delete
        </button>
      </div>

      <div className="datacontrol-row align-center">
        <div className="datacontrol-info">
          <span className="datacontrol-label text-danger">Delete account</span>
          <span className="datacontrol-desc">Permanently delete your profile and erase all personal settings/data.</span>
        </div>
        <button type="button" className="datacontrol-btn-danger-filled" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>
      {modalConfig && (
        <ConfirmationModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig(null)}
          type="delete"
          title={modalConfig.title}
          description={modalConfig.description}
          onConfirm={() => {
            const confirmFn = modalConfig.onConfirm;
            setModalConfig(null);
            if (confirmFn) confirmFn();
          }}
        />
      )}
    </div>
  )
}
