import { useState, useEffect, useMemo } from 'react';
import { getChats, getMessages, saveMessage } from '../../Main_chat/utils/db';
import { useAuth } from '../../context/AuthContext';
import type { ChatMessage } from '../../Main_chat/utils/db';
import { getCreations, deleteCreation } from '../../imagine/utils/db';
import { LibraryFilterRow } from './LibraryFilter';
import { LibraryGrid, LibraryList } from './LibraryView';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import './Library.css';

export interface LibraryItem {
  id: string;
  name: string;
  type: 'image' | 'file';
  mimeType?: string;
  url?: string;
  base64?: string;
  source: 'chat' | 'imagine';
  timestamp: number;
  chatId?: string;
  chatTitle?: string;
  messageId?: string;
  creationId?: number;
  size?: number;
}

// -------------------------------------------------------------
// LOCAL LIBRARY HEADER COMPONENT
// -------------------------------------------------------------
export function LibraryHeader() {
  return (
    <div className="lib-title-row">
      <h1 className="lib-main-title">Nothric Library</h1>
    </div>
  );
}

interface LibraryProps {
  onPreviewFile: (file: {
    name: string;
    type: string;
    url?: string;
    base64?: string;
    content?: string;
    size?: number;
  }) => void;
}

// -------------------------------------------------------------
// MAIN DASHBOARD COMPONENT
// -------------------------------------------------------------
export function Library({ onPreviewFile: _onPreviewFile }: LibraryProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'file'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Date Picker state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Rename states
  const [renamingItem, setRenamingItem] = useState<LibraryItem | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Delete states
  const [deletingItem, setDeletingItem] = useState<LibraryItem | null>(null);

  // Multi-selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Fetch all attachments & creations
  useEffect(() => {
    async function loadLibraryData() {
      try {
        setLoading(true);
        const allItems: LibraryItem[] = [];

        // 1. Fetch chat attachments
        const chats = await getChats();
        const messagesPromises = chats.map(c => getMessages(c.id));
        const allMessagesList = await Promise.all(messagesPromises);

        allMessagesList.forEach((messages, chatIdx) => {
          const chat = chats[chatIdx];
          messages.forEach((msg) => {
            if (msg.attachments && Array.isArray(msg.attachments)) {
              msg.attachments.forEach((att, attIdx) => {
                const isImg = att.type === 'image' || att.mimeType?.startsWith('image') || false;
                allItems.push({
                  id: `chat-att-${msg.id}-${attIdx}`,
                  name: att.name || 'Unnamed attachment',
                  type: isImg ? 'image' : 'file',
                  mimeType: att.mimeType || att.type,
                  url: att.url,
                  base64: att.base64,
                  source: 'chat',
                  chatId: chat.id,
                  chatTitle: chat.title,
                  messageId: msg.id,
                  timestamp: msg.timestamp,
                  size: att.size || (att.base64 ? Math.round(att.base64.length * 0.75) : undefined)
                });
              });
            }
          });
        });

        // 2. Fetch creations from Imagine
        const creations = await getCreations();
        creations.forEach((cr) => {
          allItems.push({
            id: `imagine-cr-${cr.id}`,
            name: cr.prompt || 'Generated Creation',
            type: 'image',
            url: cr.url,
            source: 'imagine',
            creationId: cr.id,
            timestamp: cr.timestamp
          });
        });

        // Sort by timestamp descending
        allItems.sort((a, b) => b.timestamp - a.timestamp);
        setItems(allItems);
      } catch (err) {
        console.error('Failed to load library items:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLibraryData();
  }, [user]);

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Delete Action
  const executeDeleteItem = async (item: LibraryItem) => {
    try {
      if (item.source === 'imagine' && item.creationId) {
        await deleteCreation(item.creationId);
      } else if (item.source === 'chat' && item.chatId && item.messageId) {
        const chatMsgs = await getMessages(item.chatId);
        const targetMsgIndex = chatMsgs.findIndex(m => m.id === item.messageId);
        if (targetMsgIndex > -1) {
          const msg = chatMsgs[targetMsgIndex];
          const updatedAttachments = (msg.attachments || []).filter(att => att.name !== item.name);
          
          const updatedMsg: ChatMessage = {
            ...msg,
            attachments: updatedAttachments.length > 0 ? updatedAttachments : undefined
          };
          await saveMessage(updatedMsg);
        }
      }
      // Remove from UI state
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  // Rename Action Form Submit
  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingItem || !renameValue.trim()) return;

    const trimmedName = renameValue.trim();

    try {
      if (renamingItem.source === 'chat' && renamingItem.chatId && renamingItem.messageId) {
        const chatMsgs = await getMessages(renamingItem.chatId);
        const targetMsgIndex = chatMsgs.findIndex(m => m.id === renamingItem.messageId);
        if (targetMsgIndex > -1) {
          const msg = chatMsgs[targetMsgIndex];
          const updatedAttachments = (msg.attachments || []).map(att => {
            if (att.name === renamingItem.name) {
              return { ...att, name: trimmedName };
            }
            return att;
          });
          
          const updatedMsg: ChatMessage = {
            ...msg,
            attachments: updatedAttachments
          };
          await saveMessage(updatedMsg);
        }
      }
      
      // Update UI state
      setItems(prev => prev.map(i => {
        if (i.id === renamingItem.id) {
          return { ...i, name: trimmedName };
        }
        return i;
      }));
      setRenamingItem(null);
      setRenameValue('');
    } catch (err) {
      console.error('Failed to rename item:', err);
    }
  };

  // Download Action
  const handleDownload = (item: LibraryItem) => {
    if (item.base64 && item.mimeType) {
      const byteCharacters = atob(item.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: item.mimeType });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = item.name;
      link.click();
      URL.revokeObjectURL(blobUrl);
    }
  };

  // Selection Actions
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkDownload = () => {
    selectedIds.forEach(id => {
      const item = items.find(i => i.id === id);
      if (item) handleDownload(item);
    });
    setSelectedIds([]);
  };

  const handleBulkDeleteConfirm = async () => {
    for (const id of selectedIds) {
      const item = items.find(i => i.id === id);
      if (item) {
        await executeDeleteItem(item);
      }
    }
    setSelectedIds([]);
    setIsBulkDeleteOpen(false);
  };


  const handleBulkStartChat = () => {
    const selectedItems = items.filter(i => selectedIds.includes(i.id));
    const event = new CustomEvent('start-chat-with-attachments', {
      detail: { files: selectedItems }
    });
    window.dispatchEvent(event);
    setSelectedIds([]);
  };

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Search Query Filter
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Type Filter (All / Image / File)
      const matchesType = 
        filterType === 'all' || 
        (filterType === 'image' && item.type === 'image') ||
        (filterType === 'file' && item.type === 'file');

      // 3. Date Filter
      let matchesDate = true;
      if (selectedDate) {
        const itemDate = new Date(item.timestamp);
        matchesDate = isSameDay(itemDate, selectedDate);
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [items, searchQuery, filterType, selectedDate]);

  return (
    <div className="library-container">
      {/* 1. Header Centered */}
      <LibraryHeader />

      {/* 2. Left Tabs / Right Controls Row */}
      <LibraryFilterRow
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isCalendarOpen={isCalendarOpen}
        setIsCalendarOpen={setIsCalendarOpen}
        selectedIds={selectedIds}
        onClearSelection={handleClearSelection}
        onBulkDownload={handleBulkDownload}
        onBulkDelete={() => setIsBulkDeleteOpen(true)}
        onBulkStartChat={handleBulkStartChat}
      />

      {/* 3. Main Items Panel */}
      {loading ? (
        <div className="lib-status-area">
          <div className="lib-spinner"></div>
          <p>Loading library files...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="lib-status-area empty">
          <svg viewBox="0 0 24 24" fill="none" className="lib-empty-icon">
            <path d="M10.5 15L13.5 12M13.5 15L10.5 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M22 11.7979C22 9.16554 22 7.84935 21.2305 6.99383C21.1598 6.91514 21.0849 6.84024 21.0062 6.76946C20.1506 6 18.8345 6 16.2021 6H15.8284C14.6747 6 14.0979 6 13.5604 5.84678C13.2651 5.7626 12.9804 5.64471 12.7121 5.49543C12.2237 5.22367 11.8158 4.81578 11 4L10.4497 3.44975C10.1763 3.17633 10.0396 3.03961 9.89594 2.92051C9.27652 2.40704 8.51665 2.09229 7.71557 2.01738C7.52976 2 7.33642 2 6.94975 2C6.06722 2 5.62595 2 5.25839 2.06935C3.64031 2.37464 2.37464 3.64031 2.06935 5.25839C2 5.62595 2 6.06722 2 6.94975M21.9913 16C21.9554 18.4796 21.7715 19.8853 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <h3>No items found</h3>
          <p>Try refining your search text or date filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <LibraryGrid
          items={filteredItems}
          onDownload={handleDownload}
          onRename={(item) => { setRenamingItem(item); setRenameValue(item.name); }}
          onDelete={setDeletingItem}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
        />
      ) : (
        <LibraryList
          items={filteredItems}
          onDownload={handleDownload}
          onRename={(item) => { setRenamingItem(item); setRenameValue(item.name); }}
          onDelete={setDeletingItem}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
        />
      )}

      {/* Rename Dialog Modal overlay */}
      {renamingItem && (
        <div className="lib-modal-overlay">
          <div className="lib-modal-card">
            <h3>Rename Attachment</h3>
            <form onSubmit={handleRenameSubmit}>
              <input
                type="text"
                className="lib-modal-input"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
              />
              <div className="lib-modal-buttons">
                <button type="button" className="lib-modal-cancel" onClick={() => setRenamingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="lib-modal-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation modal for item deletion */}
      <ConfirmationModal
        isOpen={deletingItem !== null}
        onClose={() => setDeletingItem(null)}
        type="delete"
        title="Delete file?"
        description={deletingItem ? `This will delete "${deletingItem.name}" permanently.` : ''}
        onConfirm={() => {
          if (deletingItem) {
            executeDeleteItem(deletingItem);
          }
        }}
      />

      {/* Confirmation modal for bulk deletion */}
      <ConfirmationModal
        isOpen={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        type="delete"
        title="Delete multiple files?"
        description={`Are you sure you want to delete these ${selectedIds.length} files permanently?`}
        onConfirm={handleBulkDeleteConfirm}
      />
    </div>
  );
}
