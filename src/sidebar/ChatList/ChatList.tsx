import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal'
import { getChats, deleteChatFromDB, saveChat } from '../../Main_chat/utils/db'
import { useAuth } from '../../context/AuthContext'
import type { ChatSession } from '../../Main_chat/utils/db'
import { PinIcon } from '../../components/icons/PinIcon'
import './ChatList.css'

const openSelectionDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('Main_chat_selection_db', 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('session_models')) {
        db.createObjectStore('session_models', { keyPath: 'sessionId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getAllSessionModels = async (): Promise<Record<string, string[]>> => {
  try {
    const db = await openSelectionDB();
    return new Promise((resolve) => {
      const tx = db.transaction('session_models', 'readonly');
      const store = tx.objectStore('session_models');
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        const mapping: Record<string, string[]> = {};
        results.forEach((item: any) => {
          if (item && item.sessionId && Array.isArray(item.models)) {
            mapping[item.sessionId] = item.models;
          }
        });
        resolve(mapping);
      };
      req.onerror = () => resolve({});
    });
  } catch (err) {
    console.error('Error reading Selection IndexedDB:', err);
    return {};
  }
};

interface ChatListProps {
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  filter?: 'all' | 'Main_chat' | 'normal';
  chatFilter?: 'all' | 'multi' | 'auto' | 'single';
  onLoaded?: () => void;
}

export function ChatList({ activeSessionId, setActiveSessionId, filter: _filter = 'all', chatFilter = 'all', onLoaded }: ChatListProps) {
  const { user } = useAuth()
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; isBelow: boolean } | null>(null)
  const [modalConfig, setModalConfig] = useState<{ type: 'delete' | 'share'; chatTitle: string; id: string } | null>(null)
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null)
  const [pinTooltipPos, setPinTooltipPos] = useState<{ top: number; left: number } | null>(null)

  const [chats, setChats] = useState<ChatSession[]>([])
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null)
  const [squeezingChatId, setSqueezingChatId] = useState<string | null>(null)
  const [sessionModels, setSessionModels] = useState<Record<string, string[]>>({})

  const loadChats = async () => {
    try {
      const sessions = await getChats();
      // Sort sessions: newest first
      sessions.sort((a, b) => b.createdAt - a.createdAt);
      setChats(sessions);
      if (onLoaded) onLoaded();

      const modelsMap = await getAllSessionModels();
      setSessionModels(modelsMap);
    } catch (err) {
      console.error('Failed to load chats:', err);
      if (onLoaded) onLoaded();
    }
  };

  const handleRenameSave = async (id: string) => {
    const trimmed = renameValue.trim()
    if (!trimmed) {
      setRenamingId(null)
      return
    }
    try {
      const chatToUpdate = chats.find(c => c.id === id)
      if (chatToUpdate) {
        chatToUpdate.title = trimmed
        await saveChat(chatToUpdate)
        await loadChats()
        window.dispatchEvent(new Event('chat-sessions-updated'))
      }
    } catch (err) {
      console.error('Failed to rename chat:', err)
    } finally {
      setRenamingId(null)
    }
  }

  useEffect(() => {
    loadChats();
    window.addEventListener('chat-sessions-updated', loadChats);
    return () => {
      window.removeEventListener('chat-sessions-updated', loadChats);
    };
  }, [user]);

  // Close the dropdown submenu when clicking anywhere outside or scrolling
  useEffect(() => {
    if (activeMenuId === null) return
    const handleOutsideClick = () => {
      setActiveMenuId(null)
      setMenuPosition(null)
    }
    const handleScroll = () => {
      setActiveMenuId(null)
      setMenuPosition(null)
    }
    document.addEventListener('click', handleOutsideClick)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [activeMenuId])

  const handleDeleteConfirm = async () => {
    if (modalConfig) {
      const chatIdToDelete = modalConfig.id;
      setModalConfig(null);
      setDeletingChatId(chatIdToDelete); // Step 1: Instantly fade the card
      
      try {
        await deleteChatFromDB(chatIdToDelete); // Call delete API
        
        // Step 2: Supabase deleted successfully, trigger squeeze-out animation
        setSqueezingChatId(chatIdToDelete);
        
        // Step 3: Wait for animation duration (800ms) before clean-up
        setTimeout(() => {
          if (activeSessionId === chatIdToDelete) {
            setActiveSessionId(null);
          }
          setChats((prev) => prev.filter(c => c.id !== chatIdToDelete));
          setDeletingChatId(null);
          setSqueezingChatId(null);
          window.dispatchEvent(new Event('chat-sessions-updated'));
        }, 800);
      } catch (err) {
        console.error('Failed to delete chat:', err);
        setDeletingChatId(null);
        alert('Failed to delete chat: ' + ((err as any)?.message || String(err)));
      }
    }
  }

  const renderChatItem = (chat: ChatSession) => {
    const isDeleting = deletingChatId === chat.id;
    const isSqueezing = squeezingChatId === chat.id;
    const containerClasses = [
      'chat-item-container',
      isDeleting ? 'is-deleting-faded' : '',
      isSqueezing ? 'is-squeezing' : ''
    ].filter(Boolean).join(' ');

    const models = sessionModels[chat.id] || [];
    const isSingleChat = (models.length === 1 && !models.includes('auto')) || (!chat.id.startsWith('auto_') && !chat.id.startsWith('temp_auto_') && models.length <= 1);
    const isAutoChat = !isSingleChat && (chat.id.startsWith('auto_') || chat.id.startsWith('temp_auto_') || models.includes('auto'));

    return (
      <div key={chat.id} className={containerClasses}>
        <div 
          className={`chat-item ${activeSessionId === chat.id ? 'active' : ''}`}
          onClick={() => {
            if (renamingId !== chat.id) {
              setActiveSessionId(chat.id)
            }
          }}
        >
          {renamingId === chat.id ? (
            <input
              type="text"
              className="chat-rename-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => handleRenameSave(chat.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSave(chat.id)
                } else if (e.key === 'Escape') {
                  setRenamingId(null)
                }
              }}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          ) : (
            <>
              {chat.pinned && (
                <span 
                  className="pinned-dot-container"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setHoveredPinId(chat.id)
                    setPinTooltipPos({
                      top: rect.top - 28,
                      left: rect.left + rect.width / 2
                    })
                  }}
                  onMouseLeave={() => {
                    setHoveredPinId(null)
                    setPinTooltipPos(null)
                  }}
                >
                  <span 
                    className="pinned-dot"
                    style={{ 
                      display: 'inline-block',
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: 'currentColor', 
                      opacity: 0.8 
                    }} 
                  />
                </span>
              )}
              <span className="chat-title">
                {chat.title}
              </span>
            </>
          )}
          {renamingId !== chat.id && (
            <div className="chat-actions-right">
              {isSingleChat && (
                <span className="single-chat-icon" title="Single Chat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'currentColor' }}>
                    <path d="M8 10.5H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    <path d="M8 14H13.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </span>
              )}
              {isAutoChat && (
                <span className="auto-chat-icon" title="Auto Nothric">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'currentColor' }}>
                    <path d="M12.978 21.4558L13.6213 21.8413L12.978 21.4558ZM13.4659 20.6417L12.8226 20.2562L13.4659 20.6417ZM10.5341 20.6417L9.89077 21.0272H9.89077L10.5341 20.6417ZM11.022 21.4558L11.6653 21.0703L11.022 21.4558ZM12 4.22224L11.473 3.68863C11.3303 3.82954 11.25 4.02172 11.25 4.22224C11.25 4.42277 11.3303 4.61494 11.473 4.75585L12 4.22224ZM20.25 11.7778C20.25 12.192 20.5858 12.5278 21 12.5278C21.4142 12.5278 21.75 12.192 21.75 11.7778H20.25ZM3.34254 16.5897L4.03418 16.2997H4.03418L3.34254 16.5897ZM8.21062 19.3258L8.19786 20.0757L8.21062 19.3258ZM5.77792 18.9951L5.49394 19.6892H5.49394L5.77792 18.9951ZM20.6575 16.5897L21.3491 16.8798L21.3491 16.8798L20.6575 16.5897ZM15.7893 19.3258L15.7766 18.5759H15.7766L15.7893 19.3258ZM18.2221 18.9951L18.5061 19.6892H18.5061L18.2221 18.9951ZM18.8512 4.87708L18.4629 5.51871L18.8512 4.87708ZM20.3369 6.34439L20.9742 5.94897V5.94897L20.3369 6.34439ZM5.14876 4.87708L4.76041 4.23545H4.76041L5.14876 4.87708ZM3.66312 6.34439L3.02582 5.94897H3.02582L3.66312 6.34439ZM9.66251 19.5199L10.0361 18.8696L10.0361 18.8696L9.66251 19.5199ZM14.777 2.53361C15.0717 2.24254 15.0747 1.76768 14.7836 1.47297C14.4925 1.17827 14.0177 1.17532 13.723 1.46639L14.777 2.53361ZM13.723 6.97809C14.0177 7.26916 14.4925 7.26622 14.7836 6.97151C15.0747 6.67681 15.0717 6.20194 14.777 5.91087L13.723 6.97809ZM9.3023 4.97309C9.71651 4.97182 10.0513 4.63501 10.05 4.2208C10.0487 3.80658 9.71191 3.47183 9.2977 3.4731L9.3023 4.97309ZM21.7365 14.4646C21.7476 14.0506 21.4209 13.7059 21.0068 13.6948C20.5928 13.6837 20.2481 14.0104 20.237 14.4245L21.7365 14.4646ZM13.6213 21.8413L14.1092 21.0272L12.8226 20.2562L12.3347 21.0703L13.6213 21.8413ZM9.89077 21.0272L10.3787 21.8413L11.6653 21.0703L11.1774 20.2562L9.89077 21.0272ZM12.3347 21.0703C12.2671 21.183 12.1458 21.25 12 21.25C11.8541 21.25 11.7329 21.183 11.6653 21.0703L10.3787 21.8413C11.1047 23.0529 12.8952 23.0529 13.6213 21.8413L12.3347 21.0703ZM3.75 12.6667V11.7778H2.25V12.6667H3.75ZM2.25 12.6667C2.25 13.6917 2.24958 14.4985 2.2946 15.1502C2.3401 15.8087 2.43455 16.3639 2.6509 16.8798L4.03418 16.2997C3.908 15.9988 3.83117 15.6279 3.79103 15.0468C3.75042 14.4588 3.75 13.7125 3.75 12.6667H2.25ZM8.22338 18.5759C7.09333 18.5567 6.51282 18.4854 6.06191 18.3009L5.49394 19.6892C6.23158 19.991 7.06826 20.0565 8.19786 20.0757L8.22338 18.5759ZM2.6509 16.8798C3.18531 18.1541 4.20905 19.1636 5.49394 19.6892L6.06191 18.3009C5.14155 17.9244 4.41322 17.2035 4.03418 16.2997L2.6509 16.8798ZM15.8021 20.0757C16.9317 20.0565 17.7684 19.991 18.5061 19.6892L17.9381 18.3009C17.4872 18.4854 16.9067 18.5567 15.7766 18.5759L15.8021 20.0757ZM19.9658 16.2997C19.5868 17.2035 18.8585 17.9244 17.9381 18.3009L18.5061 19.6892C19.791 19.1636 20.8147 18.1541 21.3491 16.8798L19.9658 16.2997ZM12 4.97224C13.4807 4.97224 14.8952 4.97257 16.074 5.05235C16.6621 5.09215 17.1733 5.1507 17.5922 5.23404C18.0215 5.31946 18.3018 5.42118 18.4629 5.51871L19.2396 4.23545C18.8597 4.00551 18.3813 3.86165 17.8849 3.76288C17.378 3.66204 16.7964 3.59781 16.1753 3.55577C14.9354 3.47186 13.4654 3.47224 12 3.47224V4.97224ZM21.75 11.7778C21.75 10.3376 21.7508 9.20415 21.6637 8.29884C21.5754 7.38197 21.3915 6.62164 20.9742 5.94897L19.6996 6.7398C19.9453 7.1359 20.093 7.63739 20.1706 8.44258C20.2492 9.25933 20.25 10.3082 20.25 11.7778H21.75ZM18.4629 5.51871C18.9677 5.82427 19.3913 6.24293 19.6996 6.7398L20.9742 5.94897C20.5404 5.24979 19.9457 4.66284 19.2396 4.23545L18.4629 5.51871ZM3.75 11.7778C3.75 10.3082 3.75081 9.25933 3.82944 8.44258C3.90695 7.63739 4.05466 7.1359 4.30042 6.7398L3.02582 5.94897C2.60846 6.62164 2.42461 7.38197 2.33634 8.29884C2.24919 9.20415 2.25 10.3376 2.25 11.7778H3.75ZM4.76041 4.23545C4.05426 4.66284 3.45964 5.24979 3.02582 5.94897L4.30042 6.7398C4.6087 6.24293 5.03225 5.82427 5.5371 5.51871L4.76041 4.23545ZM11.1774 20.2562C10.9955 19.9526 10.8327 19.6795 10.6738 19.4641C10.5054 19.2359 10.3094 19.0265 10.0361 18.8696L9.28893 20.1702C9.3196 20.1879 9.37008 20.2236 9.46688 20.3548C9.57318 20.4988 9.69425 20.6993 9.89077 21.0272L11.1774 20.2562ZM8.19786 20.0757C8.59427 20.0824 8.841 20.0874 9.02805 20.1078C9.20155 20.1268 9.26024 20.1538 9.28893 20.1702L10.0361 18.8696C9.76085 18.7115 9.47626 18.6479 9.19112 18.6167C8.91953 18.587 8.59228 18.5822 8.22338 18.5759L8.19786 20.0757ZM14.1092 21.0272C14.3057 20.6993 14.4268 20.4988 14.5331 20.3548C14.6299 20.2236 14.6804 20.1879 14.711 20.1702L13.9639 18.8696C13.6906 19.0265 13.4945 19.2359 13.3261 19.4641C13.1672 19.6795 13.0045 19.9526 12.8226 20.2562L14.1092 21.0272ZM15.7766 18.5759C15.4077 18.5822 15.0804 18.587 14.8088 18.6167C14.5237 18.6479 14.2391 18.7115 13.9639 18.8696L14.711 20.1702C14.7397 20.1538 14.7984 20.1268 14.9719 20.1078C15.159 20.0874 15.4057 20.0824 15.8021 20.0757L15.7766 18.5759ZM12.527 4.75585L14.777 2.53361L13.723 1.46639L11.473 3.68863L12.527 4.75585ZM11.473 4.75585L13.723 6.97809L14.777 5.91087L12.527 3.68863L11.473 3.68863ZM9.2977 3.4731C7.0617 3.47995 5.93013 3.52749 4.76041 4.23545L5.5371 5.51871C6.29497 5.06002 6.99727 4.98015 9.3023 4.97309L9.2977 3.4731ZM20.237 14.4245C20.2114 15.3805 20.1349 15.8964 19.9658 16.2997L21.3491 16.8798C21.6333 16.2021 21.7102 15.4457 21.7365 14.4646L20.237 14.4245Z" fill="currentColor"></path>
                  </svg>
                </span>
              )}
              <button
                className={`chat-menu-btn ${activeMenuId === chat.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (activeMenuId === chat.id) {
                    setActiveMenuId(null)
                    setMenuPosition(null)
                  } else {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const sidebarEl = document.querySelector('.sidebar')
                    const sidebarRect = sidebarEl ? sidebarEl.getBoundingClientRect() : null
                    
                    const menuHeight = 240
                    let top = rect.bottom + 4
                    
                    if (top + menuHeight > window.innerHeight) {
                      top = rect.top - menuHeight - 4
                    }
                    
                    const left = sidebarRect ? sidebarRect.right - 45 : rect.right - 45
                    
                    const isBelow = top === rect.bottom + 4
                    
                    setActiveMenuId(chat.id)
                    setMenuPosition({
                      top: Math.max(12, top),
                      left: left,
                      isBelow: isBelow
                    })
                  }
                }}
                aria-label="Chat actions"
              >
                {/* Ellipsis Horizontal Icon */}
                <svg className="dots-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Submenu Dropdown */}
        {activeMenuId === chat.id && menuPosition && createPortal(
          <div 
            className="chat-submenu" 
            style={{ 
              position: 'fixed', 
              top: `${menuPosition.top}px`, 
              left: `${menuPosition.left}px`,
              transformOrigin: menuPosition.isBelow ? '25px top' : '25px bottom'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="submenu-item"
              onClick={() => {
                setModalConfig({ type: 'share', chatTitle: chat.title, id: chat.id })
                setActiveMenuId(null)
              }}
            >
              {/* Share Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                className="submenu-icon lucide lucide-message-square-share-icon lucide-message-square-share"
              >
                <g strokeWidth="1"></g>
                <g strokeLinecap="round" strokeLinejoin="round"></g>
                <g>
                  <path d="M13 11L22 2M22 2H16.6562M22 2V7.34375" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                </g>
              </svg>
              <span>Share</span>
            </button>

            <button 
              className="submenu-item"
              onClick={() => {
                setRenamingId(chat.id)
                setRenameValue(chat.title)
                setActiveMenuId(null)
              }}
            >
              {/* Rename Icon */}
              <svg className="submenu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
              </svg>
              <span>Rename</span>
            </button>

            <button 
              className="submenu-item"
              onClick={() => {
                // Dispatch custom event to trigger summary for the clicked chat
                const event = new CustomEvent('request-chat-summary', {
                  detail: { sessionId: chat.id, chatTitle: chat.title, summary: chat.summary }
                });
                window.dispatchEvent(event);
                setActiveMenuId(null);
              }}
            >
              {/* Summarize Chat Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="submenu-icon lucide lucide-summary-icon lucide-summary"
              >
                <path d="M15 4H7" />
                <path d="m18 16 3 3-3 3" />
                <path d="M3 4v13a2 2 0 0 0 2 2h16" />
                <path d="M7 14h7" />
                <path d="M7 9h12" />
              </svg>
              <span>{chat.summary ? 'View summary' : 'Summarize chat'}</span>
            </button>

            <div className="submenu-divider" />

            <button 
              className="submenu-item"
              onClick={async () => {
                try {
                  chat.pinned = !chat.pinned
                  await saveChat(chat)
                  await loadChats()
                  window.dispatchEvent(new Event('chat-sessions-updated'))
                } catch (err) {
                  console.error('Failed to toggle pin state:', err)
                }
                setActiveMenuId(null)
              }}
            >
              {/* Pin Chat Icon */}
              <PinIcon className="submenu-icon" />
              <span>{chat.pinned ? 'Unpin chat' : 'Pin chat'}</span>
            </button>

            <button 
              className="submenu-item"
              onClick={async () => {
                try {
                  chat.archived = true;
                  chat.pinned = false; // Unpin when archiving
                  await saveChat(chat);
                  await loadChats();
                  window.dispatchEvent(new Event('chat-sessions-updated'));
                } catch (err) {
                  console.error('Failed to archive chat:', err);
                }
                setActiveMenuId(null);
              }}
            >
              <svg className="submenu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="1"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12" stroke="currentColor" strokeWidth="1"></path> <path d="M2 14C2 11.1997 2 9.79961 2.54497 8.73005C3.02433 7.78924 3.78924 7.02433 4.73005 6.54497C5.79961 6 7.19974 6 10 6H14C16.8003 6 18.2004 6 19.27 6.54497C20.2108 7.02433 20.9757 7.78924 21.455 8.73005C22 9.79961 22 11.1997 22 14C22 16.8003 22 18.2004 21.455 19.27C20.9757 20.2108 20.2108 20.9757 19.27 21.455C18.2004 22 16.8003 22 14 22H10C7.19974 22 5.79961 22 4.73005 21.455C3.78924 20.9757 3.02433 20.2108 2.54497 19.27C2 18.2004 2 16.8003 2 14Z" stroke="currentColor" strokeWidth="1"></path> <path d="M12 11L12 17M12 17L14.5 14.5M12 17L9.5 14.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              <span>Archive</span>
            </button>

            <button
              className="submenu-item delete-item"
              onClick={() => {
                setModalConfig({ type: 'delete', chatTitle: chat.title, id: chat.id })
                setActiveMenuId(null)
              }}
            >
              {/* Delete Icon */}
              <svg className="submenu-icon" viewBox="0 0 24.00 24.00" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <g strokeWidth="1" fill="none" fillRule="evenodd">
                  <g transform="translate(-576.000000, -192.000000)" fillRule="nonzero">
                    <g transform="translate(576.000000, 192.000000)">
                      <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" fillRule="nonzero"></path>
                      <path d="M14.2792,2 C15.1401,2 15.9044,2.55086 16.1766,3.36754 L16.7208,5 L20,5 C20.5523,5 21,5.44772 21,6 C21,6.55227 20.5523,6.99998 20,7 L19.9975,7.07125 L19.9975,7.07125 L19.1301,19.2137 C19.018,20.7837 17.7117,22 16.1378,22 L7.86224,22 C6.28832,22 4.982,20.7837 4.86986,19.2137 L4.00254,7.07125 C4.00083,7.04735 3.99998,7.02359 3.99996,7 C3.44769,6.99998 3,6.55227 3,6 C3,5.44772 3.44772,5 4,5 L7.27924,5 L7.82339,3.36754 C8.09562,2.55086 8.8599,2 9.72076,2 L14.2792,2 Z M17.9975,7 L6.00255,7 L6.86478,19.0712 C6.90216,19.5946 7.3376,20 7.86224,20 L16.1378,20 C16.6624,20 17.0978,19.5946 17.1352,19.0712 L17.9975,7 Z M10,10 C10.51285,10 10.9355092,10.386027 10.9932725,10.8833761 L11,11 L11,16 C11,16.5523 10.5523,17 10,17 C9.48715929,17 9.06449214,16.613973 9.00672766,16.1166239 L9,16 L9,11 C9,10.4477 9.44771,10 10,10 Z M14,10 C14.5523,10 15,10.4477 15,11 L15,16 C15,16.5523 14.5523,17 14,17 C13.4477,17 13,16.5523 13,16 L13,11 C13,10.4477 13.4477,10 14,10 Z M14.2792,4 L9.72076,4 L9.38743,5 L14.6126,5 L14.2792,4 Z" fill="currentColor"></path>
                    </g>
                  </g>
                </g>
              </svg>
              <span>Delete</span>
            </button>
          </div>,
          document.body
        )}
      </div>
    )
  }

  let sortedActiveChats = [...chats]
    .filter(chat => !chat.archived && (chat.id.startsWith('Main_chat_') || chat.id.startsWith('auto_')));

  if (chatFilter && chatFilter !== 'all') {
    sortedActiveChats = sortedActiveChats.filter(chat => {
      const models = sessionModels[chat.id] || [];
      const isAuto = chat.id.startsWith('auto_') || chat.id.startsWith('temp_auto_');
      const isSingle = !isAuto && models.length === 1;
      const isMulti = !isAuto && models.length > 1;

      if (chatFilter === 'auto') return isAuto;
      if (chatFilter === 'single') return isSingle;
      if (chatFilter === 'multi') return isMulti;
      return true;
    });
  }

  sortedActiveChats.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.createdAt - a.createdAt
  })

  return (
    <div className="chat-list">
      {sortedActiveChats.map((chat) => renderChatItem(chat))}
      
      {sortedActiveChats.length === 0 && (
        <div className="no-chats-placeholder">No conversations yet</div>
      )}
      
      {/* Confirmation/Share Modal */}
      <ConfirmationModal
        isOpen={modalConfig !== null}
        onClose={() => setModalConfig(null)}
        type={modalConfig?.type || 'delete'}
        chatTitle={modalConfig?.chatTitle || ''}
        chatId={modalConfig?.id || ''}
        onConfirm={handleDeleteConfirm}
      />

      {/* Pinned Dot Portal Tooltip */}
      {hoveredPinId && pinTooltipPos && (() => {
        const dotCenter = pinTooltipPos.left;
        const tooltipWidth = 74; // Approximate width of the tooltip
        const tooltipLeft = Math.max(tooltipWidth / 2 + 6, dotCenter); // Keep at least 6px from left screen edge
        const arrowLeft = dotCenter - (tooltipLeft - tooltipWidth / 2);
        
        return createPortal(
          <div 
            className="pinned-tooltip portal-tooltip" 
            style={{ 
              position: 'fixed', 
              top: `${pinTooltipPos.top}px`, 
              left: `${tooltipLeft}px`,
              bottom: 'auto',
              transform: 'translateX(-50%)',
              opacity: 1,
              pointerEvents: 'none'
            }}
          >
            Pinned chat
            <div 
              className="pinned-tooltip-arrow" 
              style={{
                position: 'absolute',
                top: '100%',
                left: `${arrowLeft}px`,
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderWidth: '4px',
                borderStyle: 'solid',
                borderColor: '#000000 transparent transparent transparent'
              }}
            />
          </div>,
          document.body
        );
      })()}
    </div>
  )
}
