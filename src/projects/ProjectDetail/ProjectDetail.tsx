import { useState, useEffect, useCallback } from 'react';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import './ProjectDetail.css';

import { getChats, saveChat, deleteChatFromDB, getFriendlyDate } from '../../Main_chat/utils/db';
import type { ProjectItem } from '../../Main_chat/utils/db';

interface ProjectDetailProps {
  project: ProjectItem;
  onBack: () => void;
  setActiveSessionId: (id: string | null) => void;
  setCurrentView: (view: 'Main_chat' | 'imagine' | 'projects') => void;
}

interface ProjectChat {
  id: string;
  title: string;
  preview: string;
  date: string;
  pinned?: boolean;
}

interface ProjectSource {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}



export function ProjectDetail({ project, onBack, setActiveSessionId, setCurrentView }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'sources'>('chats');
  const [chatInputValue, setChatInputValue] = useState('');
  
  // Local state loaded from DB
  const [chats, setChats] = useState<ProjectChat[]>([]);
  const [sources, setSources] = useState<ProjectSource[]>([]);

  // Dropdown / action states for chats
  const [activeChatMenuId, setActiveChatMenuId] = useState<string | null>(null);
  const [deleteTargetChat, setDeleteTargetChat] = useState<ProjectChat | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load chats belonging to this project
  const loadProjectChats = useCallback(async () => {
    try {
      const allChats = await getChats();
      const projectChats = allChats.filter(c => c.projectId === project.id);
      setChats(projectChats.map(c => ({
        id: c.id,
        title: c.title,
        preview: c.summary || 'Click to view conversation',
        date: getFriendlyDate(c.createdAt),
        pinned: c.pinned
      })));
    } catch (err) {
      console.error('Failed to load project chats:', err);
    }
  }, [project.id]);

  useEffect(() => {
    loadProjectChats();
  }, [loadProjectChats]);

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.chat-menu-wrapper')) {
        setActiveChatMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputValue.trim()) return;

    // Save temporary details in localStorage so Main_chat can start this new project chat!
    localStorage.setItem('project_new_chat_query', chatInputValue.trim());
    localStorage.setItem('project_new_chat_project_id', project.id);

    // Redirect to Main_chat view
    setActiveSessionId(null);
    setCurrentView('Main_chat');
  };

  const handleAddSource = () => {
    const fileNames = ['api_specs.json', 'product_brief.docx', 'analytics_export.csv', 'config_prod.yaml'];
    const randomName = fileNames[Math.floor(Math.random() * fileNames.length)];
    
    const newSource: ProjectSource = {
      id: String(Date.now()),
      name: randomName,
      type: randomName.split('.').pop()?.toUpperCase() || 'FILE',
      size: `${(Math.random() * 10 + 1).toFixed(1)} KB`,
      date: 'Today'
    };

    setSources([newSource, ...sources]);
  };

  const handleTogglePinChat = async (id: string) => {
    try {
      const allChats = await getChats();
      const chat = allChats.find(c => c.id === id);
      if (chat) {
        chat.pinned = !chat.pinned;
        await saveChat(chat);
        loadProjectChats();
        window.dispatchEvent(new Event('chat-sessions-updated'));
      }
    } catch (err) {
      console.error("Failed to pin project chat:", err);
    }
    setActiveChatMenuId(null);
  };

  const handleShareChat = (chat: ProjectChat) => {
    const shareUrl = `${window.location.origin}/share/c/${chat.id}`;
    navigator.clipboard.writeText(shareUrl);
    setToastMessage(`Copied share link for "${chat.title}"!`);
    setActiveChatMenuId(null);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSummarizeChat = async (chat: ProjectChat) => {
    try {
      const allChats = await getChats();
      const dbChat = allChats.find(c => c.id === chat.id);
      if (dbChat) {
        dbChat.summary = 'Summary: Discussed project settings and schema setups.';
        await saveChat(dbChat);
        loadProjectChats();
        setToastMessage(`Generated summary for "${chat.title}"!`);
        setTimeout(() => {
          setToastMessage(null);
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to summarize chat:", err);
    }
    setActiveChatMenuId(null);
  };

  const handleRenameStart = (chat: ProjectChat) => {
    setRenamingChatId(chat.id);
    setRenameValue(chat.title);
    setActiveChatMenuId(null);
  };

  const handleRenameSubmit = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      const allChats = await getChats();
      const chat = allChats.find(c => c.id === id);
      if (chat) {
        chat.title = renameValue.trim();
        await saveChat(chat);
        loadProjectChats();
        window.dispatchEvent(new Event('chat-sessions-updated'));
      }
    } catch (err) {
      console.error("Failed to rename project chat:", err);
    }
    setRenamingChatId(null);
  };

  const handleDeleteChatConfirm = async () => {
    if (!deleteTargetChat) return;
    try {
      await deleteChatFromDB(deleteTargetChat.id);
      loadProjectChats();
      window.dispatchEvent(new Event('chat-sessions-updated'));
    } catch (err) {
      console.error("Failed to delete project chat:", err);
    }
    setDeleteTargetChat(null);
  };

  // Sort chats by pinned status
  const sortedChats = [...chats].sort((a, b) => {
    const aPinned = a.pinned || false;
    const bPinned = b.pinned || false;
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  return (
    <div className="project-detail-container">
      <div className="project-detail-content">
        
        {/* Detail Header Row */}
        <header className="project-detail-header">
          <div className="header-left">
            <button className="back-arrow-btn" onClick={onBack} title="Back to Projects">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div className="folder-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="folder-icon">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h1 className="project-detail-title">{project.name}</h1>
          </div>

          <div className="header-right">
            <button className="detail-share-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="share-icon">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              <span>Share</span>
            </button>
            
            <button className="detail-more-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" className="dots-icon">
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </svg>
            </button>
          </div>
        </header>

        {/* Capsule Chat Input Bar */}
        <form onSubmit={handleSendChat} className="project-chat-input-bar">
          <button type="button" className="input-plus-btn" title="Add files to chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          
          <input 
            type="text"
            placeholder={`New chat in ${project.name}`}
            value={chatInputValue}
            onChange={e => setChatInputValue(e.target.value)}
            className="project-chat-input"
          />

          <div className="input-right-actions">
            <button type="button" className="input-mic-btn" title="Voice input">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
            <button type="button" className="input-voice-pulse-btn" title="Audio waveform">
              <div className="waveform-line bar-1"></div>
              <div className="waveform-line bar-2"></div>
              <div className="waveform-line bar-3"></div>
            </button>
          </div>
        </form>

        {/* Tab Selection Row */}
        <div className="project-detail-tabs">
          <button 
            className={`detail-tab-btn ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button 
            className={`detail-tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
            onClick={() => setActiveTab('sources')}
          >
            Sources
          </button>
        </div>

        {/* Tab Content List Area */}
        <div className="project-detail-list-area">
          {activeTab === 'chats' ? (
            <div className="detail-chats-list">
              {sortedChats.length > 0 ? (
                sortedChats.map(chat => (
                  <div 
                    key={chat.id} 
                    className="project-chat-row"
                    onClick={() => {
                      setActiveSessionId(chat.id);
                      setCurrentView('Main_chat');
                    }}
                  >
                    <div className="chat-row-left">
                      {renamingChatId === chat.id ? (
                        <div className="inline-rename-form" onClick={e => e.stopPropagation()}>
                          <input 
                            type="text"
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleRenameSubmit(chat.id);
                              if (e.key === 'Escape') setRenamingChatId(null);
                            }}
                            onBlur={() => handleRenameSubmit(chat.id)}
                            autoFocus
                            className="rename-input"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="chat-row-title-container">
                            <span className="chat-row-title">{chat.title}</span>
                            {chat.pinned && (
                              <svg viewBox="0 0 24 24" fill="currentColor" className="pinned-pin-icon inline-pin">
                                <title>Pinned chat</title>
                                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                              </svg>
                            )}
                          </div>
                          <span className="chat-row-preview">{chat.preview}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="chat-row-right-container">
                      <span className="chat-row-date">{chat.date}</span>
                      
                      {/* Submenu Dropdown */}
                      <div className="chat-menu-wrapper">
                        <button 
                          className={`chat-menu-trigger-btn ${activeChatMenuId === chat.id ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveChatMenuId(activeChatMenuId === chat.id ? null : chat.id);
                          }}
                          title="Chat options"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" className="dots-icon">
                            <circle cx="5" cy="12" r="2"></circle>
                            <circle cx="12" cy="12" r="2"></circle>
                            <circle cx="19" cy="12" r="2"></circle>
                          </svg>
                        </button>
                        
                        {activeChatMenuId === chat.id && (
                          <div className="chat-dropdown-menu" onClick={e => e.stopPropagation()}>
                            <button className="dropdown-item" onClick={() => handleShareChat(chat)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                                <path d="M12 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4" />
                                <path d="M16 3h6v6" />
                                <path d="m16 9 6-6" />
                              </svg>
                              <span>Share</span>
                            </button>
                            
                            <button className="dropdown-item" onClick={() => handleRenameStart(chat)}>
                              <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                              </svg>
                              <span>Rename</span>
                            </button>
                            
                            <button className="dropdown-item" onClick={() => handleSummarizeChat(chat)}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                                <path d="M15 4H7" />
                                <path d="m18 16 3 3-3 3" />
                                <path d="M3 4v13a2 2 0 0 0 2 2h16" />
                                <path d="M7 14h7" />
                                <path d="M7 9h12" />
                              </svg>
                              <span>{chat.preview.startsWith('Summary:') ? 'View summary' : 'Summarize'}</span>
                            </button>

                            <button className="dropdown-item" onClick={() => handleTogglePinChat(chat.id)}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="dropdown-item-icon">
                                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                              </svg>
                              <span>{chat.pinned ? 'Unpin chat' : 'Pin chat'}</span>
                            </button>
                            
                            <div className="dropdown-divider" />
                            
                            <button className="dropdown-item delete-item" onClick={() => {
                              setDeleteTargetChat(chat);
                              setActiveChatMenuId(null);
                            }}>
                              <svg className="dropdown-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-items-placeholder">
                  No chats inside this project
                </div>
              )}
            </div>
          ) : (
            <div className="detail-sources-list">
              <div className="sources-header-bar">
                <span>Files and data sources ({sources.length})</span>
                <button className="add-source-btn" onClick={handleAddSource}>
                  + Add Source
                </button>
              </div>
              {sources.length > 0 ? (
                sources.map(source => (
                  <div key={source.id} className="project-source-row">
                    <div className="source-row-left">
                      <div className="source-type-badge">{source.type}</div>
                      <div className="source-info">
                        <span className="source-name">{source.name}</span>
                        <span className="source-size">{source.size}</span>
                      </div>
                    </div>
                    <span className="source-date">{source.date}</span>
                  </div>
                ))
              ) : (
                <div className="no-items-placeholder">
                  No sources added. Upload documents to provide context to Gemini.
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Delete Chat Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTargetChat !== null}
        onClose={() => setDeleteTargetChat(null)}
        type="delete"
        chatTitle={deleteTargetChat?.title}
        title="Delete Chat"
        description={deleteTargetChat ? `Are you sure you want to delete "${deleteTargetChat.title}"? This action will permanently remove this conversation from the project.` : ''}
        onConfirm={handleDeleteChatConfirm}
      />

      {/* Copy link copied Toast Message */}
      {toastMessage && (
        <div className="project-toast-message">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
