import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChatList } from '../ChatList/ChatList'
import { UserCard } from '../UserCard/UserCard'

import { SearchModal } from '../../components/SearchModal/SearchModal'
import './Sidebar.css'
import { navigate } from '../../navigation'
import { AuthModal } from '../../components/AuthModal/AuthModal'
import { useAuth } from '../../context/AuthContext'

/*
const _LockIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="sidebar-lock-icon"
    style={{ marginLeft: 'auto', opacity: 0.6, flexShrink: 0 }}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
*/

interface SidebarProps {
  currentView: 'Main_chat' | 'imagine' | 'projects' | 'groupchat' | 'library';
  setCurrentView: (view: 'Main_chat' | 'imagine' | 'projects' | 'groupchat' | 'library') => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onNewChat?: () => void;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
}

export function Sidebar({ currentView, setCurrentView, isCollapsed, setIsCollapsed, onNewChat, activeSessionId, setActiveSessionId }: SidebarProps) {
  const [isChatsCollapsed, setIsChatsCollapsed] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const { user } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [chatFilter, setChatFilter] = useState<'all' | 'multi' | 'auto' | 'single'>('all')
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [filterMenuPos, setFilterMenuPos] = useState<{ top: number; left: number } | null>(null)
  const [isChatsLoaded, setIsChatsLoaded] = useState(false)

  const filterDropdownRef = useRef<HTMLDivElement>(null)

  // Click outside and scroll/resize listener to close filter dropdown
  useEffect(() => {
    if (!isFilterMenuOpen) return;
    const handleClose = () => {
      setIsFilterMenuOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target as Node)) {
        const btn = document.querySelector('.recent-filter-btn');
        if (btn && btn.contains(e.target as Node)) return;
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleClose);
    window.addEventListener('scroll', handleClose, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleClose);
      window.removeEventListener('scroll', handleClose, true);
    };
  }, [isFilterMenuOpen]);

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleScroll = () => {
    setIsScrolling(true)
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1000)
  }

  // Global keyboard shortcuts for sidebar actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + Shift + O -> New Chat
      if (ctrlOrCmd && e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        e.preventDefault();
        setCurrentView('Main_chat');
        navigate('/');
        if (onNewChat) onNewChat();
      }
      // Ctrl/Cmd + K -> Search Chat
      else if (ctrlOrCmd && (e.key === 'K' || e.key === 'k')) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Ctrl/Cmd + \ or Ctrl/Cmd + Shift + B -> Toggle Sidebar
      else if (ctrlOrCmd && (e.key === '\\' || (e.shiftKey && (e.key === 'B' || e.key === 'b')))) {
        e.preventDefault();
        setIsCollapsed(!isCollapsed);
      }
      // Ctrl/Cmd + Shift + I -> Imagine
      else if (ctrlOrCmd && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        if (user) {
          setCurrentView('imagine');
          navigate('/imagine');
        } else {
          setIsAuthModalOpen(true);
        }
      }
      // Ctrl/Cmd + Shift + P -> Projects
      else if (ctrlOrCmd && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        if (user) {
          setCurrentView('projects');
        } else {
          setIsAuthModalOpen(true);
        }
      }
      // Ctrl/Cmd + Shift + G -> Group Chat
      else if (ctrlOrCmd && e.shiftKey && (e.key === 'G' || e.key === 'g')) {
        e.preventDefault();
        if (user) {
          setCurrentView('groupchat');
          navigate('/groupchat');
        } else {
          setIsAuthModalOpen(true);
        }
      }
      // Ctrl/Cmd + Shift + Y -> Library (LibrarY)
      else if (ctrlOrCmd && e.shiftKey && (e.key === 'Y' || e.key === 'y')) {
        e.preventDefault();
        if (user) {
          setCurrentView('library');
          navigate('/library');
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, navigate, onNewChat, setCurrentView, setIsCollapsed, isCollapsed]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Top Header */}
      <div className="sidebar-header">
        <div
          className={`sidebar-brand ${isCollapsed ? 'e-resize' : ''}`}
          onClick={() => {
            if (isCollapsed) {
              setIsCollapsed(false);
            } else {
              setCurrentView('Main_chat');
              navigate('/');
            }
          }}
          style={{ cursor: isCollapsed ? 'e-resize' : 'pointer' }}
        >
          <div className="logo-container">
            <img src="/logo.svg" className="logo-icon" alt="nothric logo" />
            <div className="toggle-btn-overlay">
              {/* Slide Icon SVG overlay */}
              <svg className="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
          </div>
          <span className="brand-name">Nothric</span>
          <span className="custom-tooltip">Expand</span>
        </div>
        <button
          className={`toggle-btn ${!isCollapsed ? 'w-resize' : ''}`}
          aria-label="Toggle Sidebar"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {/* Slide Icon SVG */}
          <svg
            className="sidebar-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: !isCollapsed ? 'scaleX(-1)' : 'none',
              transition: 'transform 0.3s ease',
            }}
          >
            <g strokeWidth="0"></g>
            <g strokeLinecap="round" strokeLinejoin="round"></g>
            <g>
              <path d="M12 3H11C7.22876 3 5.34315 3 4.17157 4.17157C3 5.34315 3 7.22876 3 11V13C3 16.7712 3 18.6569 4.17157 19.8284C5.34315 21 7.22876 21 11 21H12" stroke="currentColor" strokeWidth="1.5"></path>
              <path d="M11 3H15C17.8284 3 19.2426 3 20.1213 3.87013C21 4.75736 21 6.17157 21 9V15C21 17.8284 21 19.2426 20.1213 20.1213C19.2426 21 17.8284 21 15 21H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2.5 3"></path>
              <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
            </g>
          </svg>
          <span className="custom-tooltip">Close sidebar</span>
        </button>
      </div>

      {/* Main Menu */}
      <nav className="sidebar-menu">
        <button
          className={`menu-item new-chat-btn ${currentView === 'Main_chat' && !activeSessionId ? 'active' : ''}`}
          onClick={() => {
            setCurrentView('Main_chat');
            navigate('/');
            if (onNewChat) onNewChat();
          }}
        >
          {/* New Chat SVG */}
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3H9a6 6 0 0 0-6 6v6a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6v-3" />
            <path className="pencil-path" d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
          </svg>
          <span className="menu-text">New chat</span>
          <span className="menu-shortcut">Ctrl+Shift+O</span>
          <span className="custom-tooltip">New chat</span>
        </button>

        <button className="menu-item" onClick={() => setIsSearchOpen(true)}>
          {/* Search Chat SVG */}
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="menu-text">Search chat</span>
          <span className="menu-shortcut">Ctrl+K</span>
          <span className="custom-tooltip">Search chat</span>
        </button>

        <div className="sidebar-section-title">Tools & Studio</div>

        <button
          className={`menu-item ${currentView === 'imagine' ? 'active' : ''}`}
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              setCurrentView('imagine');
              navigate('/imagine');
            }
          }}
        >
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="4.5" ry="4.5"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
          <span className="menu-text">Imagine</span>
          <span className="menu-shortcut">Ctrl+Shift+I</span>
          <span className="custom-tooltip">Imagine{!user ? ' (Login required)' : ''}</span>
        </button>

        <button
          className={`menu-item ${currentView === 'projects' ? 'active' : ''}`}
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              setCurrentView('projects');
            }
          }}
        >
          {/* Project SVG */}
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
          </svg>
          <span className="menu-text">Project</span>
          <span className="menu-shortcut">Ctrl+Shift+P</span>
          <span className="custom-tooltip">Project{!user ? ' (Login required)' : ''}</span>
        </button>

        <button
          className={`menu-item ${currentView === 'groupchat' ? 'active' : ''}`}
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              setCurrentView('groupchat');
              navigate('/groupchat');
            }
          }}
        >
          {/* Collab Icon */}
          <svg className="menu-icon" viewBox="0 0 24 24" fill="currentColor" stroke="var(--sidebar-bg)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.275 5.265c0-.852-.132-1.703-.36-2.555-.328-1.016-1.081-1.834-2.031-2.194a9.248 9.248 0 0 0-6.092 0 3.168 3.168 0 0 0-2.03 2.194 9.532 9.532 0 0 0 0 5.077c.326 1.015 1.08 1.834 2.03 2.194a8.04 8.04 0 0 0 3.046.491c1.049 0 2.063-.196 3.046-.491a3.172 3.172 0 0 0 2.031-2.194c.229-.819.36-1.67.36-2.522zm-3.308 0c0 .393-.065.852-.196 1.212-.164.524-.623.95-1.18 1.081a4.233 4.233 0 0 1-1.571 0 1.473 1.473 0 0 1-1.18-1.081 4.025 4.025 0 0 1 0-2.489c.163-.524.622-.95 1.18-1.081a4.233 4.233 0 0 1 1.571 0 1.476 1.476 0 0 1 1.18 1.081c.13.458.196.884.196 1.277m-8.745 13.79a9.552 9.552 0 0 0 0-5.077c-.327-1.016-1.081-1.834-2.03-2.195a9.248 9.248 0 0 0-6.092 0 3.173 3.173 0 0 0-2.031 2.195 9.552 9.552 0 0 0 0 5.077c.328 1.015 1.081 1.834 2.031 2.193a9.248 9.248 0 0 0 6.092 0 3.392 3.392 0 0 0 2.03-2.193m-2.948-2.523c0 .393-.066.852-.197 1.212a1.644 1.644 0 0 1-1.179 1.081 4.238 4.238 0 0 1-1.572 0 1.477 1.477 0 0 1-1.179-1.081 4.04 4.04 0 0 1 0-2.489 1.64 1.64 0 0 1 1.179-1.081 4.196 4.196 0 0 1 1.572 0 1.476 1.476 0 0 1 1.179 1.081c.131.426.197.851.197 1.277m0-11.3h3.308c0-.851-.131-1.703-.36-2.521-.327-1.016-1.081-1.834-2.03-2.194a9.248 9.248 0 0 0-6.092 0C2.084.909 1.331 1.728 1.068 2.743a9.552 9.552 0 0 0 0 5.077c.328 1.015 1.081 1.834 2.031 2.194.982.36 1.998.492 3.046.492 1.048 0 2.063-.197 3.046-.492a3.17 3.17 0 0 0 2.03-2.194c.033-.131.065-.295.131-.426L8.241 5.953c-.033.196-.065.36-.131.557-.163.524-.622.95-1.179 1.081a4.238 4.238 0 0 1-1.572 0A1.478 1.478 0 0 1 4.18 6.51a4.04 4.04 0 0 1 0-2.489c.164-.524.622-.95 1.179-1.082a4.238 4.238 0 0 1 1.572 0A1.476 1.476 0 0 1 8.11 4.021c.098.425.164.818.164 1.211m4.421 8.779a9.442 9.442 0 0 0-.36 2.555V24h3.308v-7.468c0-.393.065-.852.196-1.212.163-.524.622-.95 1.18-1.081a4.191 4.191 0 0 1 1.571 0 1.478 1.478 0 0 1 1.18 1.081 4.04 4.04 0 0 1 0 2.489c-.164.523-.623.95-1.146 1.08a4.196 4.196 0 0 1-1.572 0c-.099-.031-.229-.064-.327-.098l1.113 3.079c1.049 0 2.063-.197 3.046-.491a3.175 3.175 0 0 0 2.031-2.194 9.552 9.552 0 0 0 0-5.077c-.328-1.016-1.081-1.834-2.031-2.195a9.248 9.248 0 0 0-6.092 0c-1.016.263-1.769 1.082-2.097 2.098" />
          </svg>
          <span className="menu-text">Group Chat</span>
          <span className="menu-shortcut">Ctrl+Shift+G</span>
          <span className="custom-tooltip">Group Chat{!user ? ' (Login required)' : ''}</span>
        </button>

        <button
          className={`menu-item ${currentView === 'library' ? 'active' : ''}`}
          onClick={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              setCurrentView('library');
              navigate('/library');
            }
          }}
        >
          {/* Library SVG */}
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="0.00024">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.25 18C8.25 17.5858 8.58579 17.25 9 17.25H15C15.4142 17.25 15.75 18 C15.75 18.4142 15.4142 18.75 15 18.75H9C8.58579 18.75 8.25 18.4142 8.25 18Z" fill="currentColor"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M8.69935 1.25001H15.3004C15.5203 1.24995 15.6888 1.2499 15.8362 1.26571C17.1903 1.41104 18.2268 2.52307 18.2897 3.87013C19.4805 4.22571 20.3289 5.3275 20.3443 6.59118C20.9453 6.77151 21.4637 7.05595 21.888 7.51432C22.54 8.21857 22.7421 9.08649 22.7498 10.1003C22.7572 11.075 22.5835 12.3067 22.3678 13.8363L21.9288 16.9499C21.7602 18.146 21.6232 19.1176 21.4101 19.879C21.1871 20.6756 20.8585 21.331 20.25 21.8349C19.6463 22.3347 18.9301 22.5502 18.0835 22.6518C17.265 22.75 16.2353 22.75 14.9532 22.75H9.04687C7.76478 22.75 6.73501 22.75 5.91647 22.6518C5.06993 22.5502 4.35372 22.3347 3.75003 21.8349C3.14152 21.331 2.81286 20.6756 2.58989 19.879C2.37676 19.1176 2.23979 18.146 2.07118 16.9499L1.63219 13.8363C1.41651 12.3067 1.24283 11.075 1.25023 10.1003C1.25792 9.08649 1.45997 8.21857 2.11196 7.51432C2.53621 7.05606 3.05445 6.77164 3.65528 6.5913C3.67058 5.3275 4.51917 4.22559 5.71005 3.87007C5.77295 2.52304 6.80943 1.41104 8.16359 1.26571C8.31094 1.2499 8.4795 1.24995 8.69935 1.25001ZM5.18902 6.32785C6.11481 6.24999 7.24973 6.25 8.61594 6.25001H15.384C16.75 6.25 17.8848 6.24999 18.8105 6.32781C18.6734 5.72018 18.1306 5.25001 17.4617 5.25001H6.53787C5.86896 5.25001 5.32618 5.72019 5.18902 6.32785ZM15.6761 2.75715C16.2263 2.8162 16.6611 3.22633 16.7677 3.75001H7.2321C7.33862 3.22633 7.77344 2.8162 8.32365 2.75715C8.37993 2.75111 8.46013 2.75001 8.74099 2.75001H15.2588C15.5396 2.75001 15.6198 2.75111 15.6761 2.75715ZM3.21267 8.53336C3.51557 8.20618 3.97106 7.98917 4.85612 7.87145C5.75726 7.75159 6.96357 7.75001 8.67239 7.75001H15.3276C17.0364 7.75001 18.2427 7.75159 19.1439 7.87145C20.0289 7.98917 20.4844 8.20618 20.7873 8.53336C21.0832 8.85293 21.2436 9.28782 21.2498 10.1117C21.2563 10.9618 21.1002 12.0828 20.8738 13.6883L20.4509 16.6883C20.2731 17.9491 20.1486 18.821 19.9656 19.4747C19.7894 20.1042 19.582 20.4405 19.2934 20.6795C18.9999 20.9225 18.6058 21.0784 17.9048 21.1625C17.1861 21.2488 16.2465 21.25 14.9046 21.25H9.09536C7.75347 21.25 6.81393 21.2488 6.09519 21.1625C5.39417 21.0784 5.00014 20.9225 4.70664 20.6795C4.41795 20.4405 4.21058 20.1042 4.03437 19.4747C3.8514 18.821 3.7269 17.9491 3.54913 16.6883L3.12616 13.6883C2.89981 12.0828 2.74373 10.9618 2.75018 10.1117C2.75644 9.28782 2.91681 8.85293 3.21267 8.53336Z" fill="currentColor"></path>
            </g>
          </svg>
          <span className="menu-text">Library</span>
          <span className="menu-shortcut">Ctrl+Shift+Y</span>
          <span className="custom-tooltip">Library{!user ? ' (Login required)' : ''}</span>
        </button>

        <button className="menu-item more-btn">
          {/* More SVG */}
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" />
            <circle cx="5" cy="12" r="1.5" fill="currentColor" />
          </svg>
          <span className="menu-text">More</span>
          <span className="custom-tooltip">More</span>
        </button>
      </nav>

      {/* Spacer or Recent Chat Section */}
      {!user ? (
        <div style={{ flex: 1 }} />
      ) : (
        <div className="recent-chat-section">
          <div className="recent-chat-header-container">
            <div className="recent-chat-title">Threads</div>

            {!isCollapsed && (
              <div className="recent-filter-dropdown-container">
                <button
                  className={`recent-filter-btn ${isFilterMenuOpen ? 'active' : ''}`}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setFilterMenuPos({
                      top: rect.top,
                      left: rect.right + 8
                    });
                    setIsFilterMenuOpen(!isFilterMenuOpen);
                  }}
                  aria-label="Filter chats"
                  style={{ position: 'relative' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                  </svg>
                  <span className="custom-tooltip">Filter</span>
                </button>
                 {filterMenuPos && createPortal(
                  <div
                    className={`recent-filter-menu ${isFilterMenuOpen ? 'open' : ''}`}
                    ref={filterDropdownRef}
                    style={{
                      position: 'fixed',
                      top: `${filterMenuPos.top}px`,
                      left: `${filterMenuPos.left}px`,
                      right: 'auto',
                      margin: 0,
                      zIndex: 100000
                    }}
                  >
                    <button
                      className={`filter-item ${chatFilter === 'all' ? 'active' : ''}`}
                      onClick={() => { setChatFilter('all'); setIsFilterMenuOpen(false); }}
                    >
                      All Chats
                    </button>
                    <button
                      className={`filter-item ${chatFilter === 'multi' ? 'active' : ''}`}
                      onClick={() => { setChatFilter('multi'); setIsFilterMenuOpen(false); }}
                    >
                      Multi-Column
                    </button>
                    <button
                      className={`filter-item ${chatFilter === 'auto' ? 'active' : ''}`}
                      onClick={() => { setChatFilter('auto'); setIsFilterMenuOpen(false); }}
                    >
                      Auto Nothric
                    </button>
                    <button
                      className={`filter-item ${chatFilter === 'single' ? 'active' : ''}`}
                      onClick={() => { setChatFilter('single'); setIsFilterMenuOpen(false); }}
                    >
                      Single Chat
                    </button>
                  </div>,
                  document.body
                )}
              </div>
            )}

            <button
              className="chats-collapse-btn"
              onClick={() => setIsChatsCollapsed(!isChatsCollapsed)}
              aria-label="Toggle Recent Chats"
            >
              <svg
                className={`chevron-icon ${isChatsCollapsed ? 'collapsed' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
          <div
            className={`recent-chat-list-wrapper ${isChatsCollapsed ? 'collapsed' : ''} ${!isChatsLoaded ? 'mount-collapsed' : ''} ${isScrolling ? 'is-scrolling' : ''}`}
            onScroll={handleScroll}
          >
            <div className="recent-chat-list">
              <ChatList activeSessionId={activeSessionId} setActiveSessionId={setActiveSessionId} chatFilter={chatFilter} onLoaded={() => setIsChatsLoaded(true)} />
            </div>
          </div>
        </div>
      )}
      <UserCard
        isCollapsed={isCollapsed}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setActiveSessionId={setActiveSessionId}
        onNewChat={onNewChat}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </aside>

  )
}
