import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getChats, saveChat, deleteChatFromDB } from '../../Main_chat/utils/db'
import type { ChatSession } from '../../Main_chat/utils/db'
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal'
import './ArchivedChatsModal.css'

interface ArchivedChatsModalProps {
  isOpen: boolean
  onClose: () => void
  activeSessionId: string | null
  setActiveSessionId: (id: string | null) => void
}

export function ArchivedChatsModal({
  isOpen,
  onClose,
  activeSessionId,
  setActiveSessionId
}: ArchivedChatsModalProps) {
  const [archivedChats, setArchivedChats] = useState<ChatSession[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  })

  const loadArchivedChats = async () => {
    try {
      const allChats = await getChats()
      const archived = allChats.filter((chat) => chat.archived === true && chat.id.startsWith('Main_chat_'))
      archived.sort((a, b) => b.createdAt - a.createdAt)
      setArchivedChats(archived)
    } catch (err) {
      console.error('Failed to load archived chats:', err)
    }
  }

  // Load archived chats on open
  useEffect(() => {
    if (isOpen) {
      loadArchivedChats()
      setSelectedIds([])
    }
  }, [isOpen])

  // Listen to external chat session updates to sync state if needed
  useEffect(() => {
    if (!isOpen) return
    window.addEventListener('chat-sessions-updated', loadArchivedChats)
    return () => {
      window.removeEventListener('chat-sessions-updated', loadArchivedChats)
    }
  }, [isOpen])

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleContinueChat = async (chat: ChatSession) => {
    try {
      chat.archived = false
      await saveChat(chat)
      window.dispatchEvent(new Event('chat-sessions-updated'))
      setActiveSessionId(chat.id)
      onClose()
    } catch (err) {
      console.error('Failed to continue chat:', err)
    }
  }

  const handleUnarchiveSingle = async (chat: ChatSession) => {
    try {
      chat.archived = false
      await saveChat(chat)
      window.dispatchEvent(new Event('chat-sessions-updated'))
      loadArchivedChats()
      setSelectedIds((prev) => prev.filter((x) => x !== chat.id))
    } catch (err) {
      console.error('Failed to unarchive chat:', err)
    }
  }

  const handleDeleteSingle = (chat: ChatSession) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Chat',
      description: `Are you sure you want to permanently delete "${chat.title}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await deleteChatFromDB(chat.id)
          if (activeSessionId === chat.id) {
            setActiveSessionId(null)
          }
          window.dispatchEvent(new Event('chat-sessions-updated'))
          loadArchivedChats()
          setSelectedIds((prev) => prev.filter((x) => x !== chat.id))
        } catch (err) {
          console.error('Failed to delete chat:', err)
        }
      }
    })
  }

  const handleBulkUnarchive = async () => {
    if (selectedIds.length === 0) return
    try {
      for (const id of selectedIds) {
        const chat = archivedChats.find((c) => c.id === id)
        if (chat) {
          chat.archived = false
          await saveChat(chat)
        }
      }
      window.dispatchEvent(new Event('chat-sessions-updated'))
      loadArchivedChats()
      setSelectedIds([])
    } catch (err) {
      console.error('Failed to bulk unarchive:', err)
    }
  }

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    setConfirmConfig({
      isOpen: true,
      title: 'Delete Chats',
      description: `Are you sure you want to permanently delete the ${selectedIds.length} selected chats? This cannot be undone.`,
      onConfirm: async () => {
        try {
          for (const id of selectedIds) {
            await deleteChatFromDB(id)
            if (activeSessionId === id) {
              setActiveSessionId(null)
            }
          }
          window.dispatchEvent(new Event('chat-sessions-updated'))
          loadArchivedChats()
          setSelectedIds([])
        } catch (err) {
          console.error('Failed to bulk delete:', err)
        }
      }
    })
  }

  return createPortal(
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container archived-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Close Button */}
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="close-icon">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="archived-modal-content">
            <div className="archived-modal-header">
              <h3 className="modal-title">Archived Chats</h3>
              {archivedChats.length > 0 && (
                <div className="header-bulk-actions">
                  <label className="select-all-label">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={selectedIds.length === archivedChats.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(archivedChats.map((c) => c.id))
                        } else {
                          setSelectedIds([])
                        }
                      }}
                    />
                    <span>Select all</span>
                  </label>
                  {selectedIds.length > 0 && (
                    <div className="bulk-buttons">
                      <button className="bulk-btn unarchive-bulk-btn" onClick={handleBulkUnarchive}>
                        Unarchive ({selectedIds.length})
                      </button>
                      <button className="bulk-btn delete-bulk-btn" onClick={handleBulkDelete}>
                        Delete ({selectedIds.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="archived-list-container">
              {archivedChats.length === 0 ? (
                <div className="archived-empty-state">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="empty-icon"><g id="SVGRepo_bgCarrier" strokeWidth="1"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12" stroke="currentColor" strokeWidth="1"></path> <path d="M2 14C2 11.1997 2 9.79961 2.54497 8.73005C3.02433 7.78924 3.78924 7.02433 4.73005 6.54497C5.79961 6 7.19974 6 10 6H14C16.8003 6 18.2004 6 19.27 6.54497C20.2108 7.02433 20.9757 7.78924 21.455 8.73005C22 9.79961 22 11.1997 22 14C22 16.8003 22 18.2004 21.455 19.27C20.9757 20.2108 20.2108 20.9757 19.27 21.455C18.2004 22 16.8003 22 14 22H10C7.19974 22 5.79961 22 4.73005 21.455C3.78924 20.9757 3.02433 20.2108 2.54497 19.27C2 18.2004 2 16.8003 2 14Z" stroke="currentColor" strokeWidth="1"></path> <path d="M12 11L12 17M12 17L14.5 14.5M12 17L9.5 14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                  <p className="empty-title">No archived chats</p>
                  <p className="empty-subtitle">Conversations you archive will appear here.</p>
                </div>
              ) : (
                <div className="archived-list">
                  {archivedChats.map((chat) => (
                    <div key={chat.id} className="archived-item-row">
                      <input
                        type="checkbox"
                        className="custom-checkbox row-checkbox"
                        checked={selectedIds.includes(chat.id)}
                        onChange={() => toggleSelect(chat.id)}
                      />
                      <div className="archived-item-details" onClick={() => handleContinueChat(chat)}>
                        <span className="archived-item-title">{chat.title}</span>
                        <span className="archived-item-date">
                          {new Date(chat.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="archived-item-actions">
                        <button
                          className="item-action-btn tooltip-container"
                          aria-label="Unarchive chat"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUnarchiveSingle(chat)
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="action-icon">
                            <polyline points="12 8 8 12 12 16" />
                            <line x1="16" y1="12" x2="8" y2="12" />
                            <rect x="2" y="2" width="20" height="20" rx="4" />
                          </svg>
                          <span className="tooltip-text">Unarchive</span>
                        </button>
                        <button
                          className="item-action-btn delete-action-btn tooltip-container"
                          aria-label="Delete permanently"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteSingle(chat)
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="action-icon">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          <span className="tooltip-text">Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        type="delete"
        title={confirmConfig.title}
        description={confirmConfig.description}
        onConfirm={confirmConfig.onConfirm}
      />
    </>,
    document.body
  )
}
