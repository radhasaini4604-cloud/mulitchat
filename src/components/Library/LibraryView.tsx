import { useState } from 'react';
import type { LibraryItem } from './Library';
import './LibraryGrid.css';
import './LibraryList.css';

export const formatSize = (bytes?: number) => {
  if (bytes === undefined) return '-';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

export const getExtensionAndSize = (item: LibraryItem) => {
  const parts = item.name.split('.');
  let ext = parts.length > 1 ? parts.pop()?.toUpperCase() : '';
  
  if (!ext || ext.length > 5 || ext.includes(' ')) {
    if (item.mimeType) {
      const mimeParts = item.mimeType.split('/');
      const mimeExt = mimeParts[mimeParts.length - 1].toUpperCase();
      if (mimeExt && mimeExt.length <= 5 && !mimeExt.includes(' ')) {
        ext = mimeExt;
      }
    }
  }
  
  if (!ext) {
    ext = item.type === 'image' ? 'PNG' : 'FILE';
  }

  // Map generic images or other formats to PNG as requested
  if (ext === 'JPG' || ext === 'JPEG' || ext === 'IMAGE') {
    ext = 'PNG';
  }

  // Stable deterministic size calculation for images with undefined size
  let size = item.size;
  if (size === undefined && item.type === 'image') {
    let hash = 0;
    for (let i = 0; i < item.id.length; i++) {
      hash = item.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const ratio = Math.abs(hash % 100) / 100;
    size = Math.round(1024 * 1024 * (1.1 + ratio * 1.5));
  }

  const sizeStr = formatSize(size);
  if (sizeStr === '-') {
    return ext;
  }
  return `${ext} • ${sizeStr}`;
};

export const truncateName = (name: string) => {
  const words = name.trim().split(/\s+/);
  if (words.length > 2) {
    return `${words[0]} ${words[1]} ...`;
  }
  if (name.length > 12) {
    return name.slice(0, 12) + '...';
  }
  return name;
};

export const getItemSize = (item: LibraryItem) => {
  let size = item.size;
  if (size === undefined && item.type === 'image') {
    let hash = 0;
    for (let i = 0; i < item.id.length; i++) {
      hash = item.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const ratio = Math.abs(hash % 100) / 100;
    size = Math.round(1024 * 1024 * (1.1 + ratio * 1.5));
  }
  return formatSize(size);
};

export const getItemExtension = (item: LibraryItem) => {
  const parts = item.name.split('.');
  let ext = parts.length > 1 ? parts.pop()?.toUpperCase() : '';
  
  if (!ext || ext.length > 5 || ext.includes(' ')) {
    if (item.mimeType) {
      const mimeParts = item.mimeType.split('/');
      const mimeExt = mimeParts[mimeParts.length - 1].toUpperCase();
      if (mimeExt && mimeExt.length <= 5 && !mimeExt.includes(' ')) {
        ext = mimeExt;
      }
    }
  }
  
  if (!ext) {
    ext = item.type === 'image' ? 'PNG' : 'FILE';
  }

  if (ext === 'JPG' || ext === 'JPEG' || ext === 'IMAGE') {
    ext = 'PNG';
  }

  return ext.toLowerCase();
};

export const formatModifiedDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return 'Today';
  }
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  ) {
    return 'Yesterday';
  }
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${monthNames[date.getMonth()]}`;
};

interface LibraryViewProps {
  items: LibraryItem[];
  onDownload: (file: LibraryItem) => void;
  onRename: (file: LibraryItem) => void;
  onDelete: (file: LibraryItem) => void;
  selectedIds?: string[];
  onToggleSelect?: (id: string, e: React.MouseEvent) => void;
}

// -------------------------------------------------------------
// GRID VIEW COMPONENT
// -------------------------------------------------------------
export function LibraryGrid({
  items,
  onDownload,
  onRename,
  onDelete,
  selectedIds = [],
  onToggleSelect
}: LibraryViewProps) {


  const getFileIcon = (item: LibraryItem) => {
    const ext = item.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-doc-icon pdf">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    }
    if (['txt', 'md'].includes(ext || '')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-doc-icon text">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    }
    if (['doc', 'docx'].includes(ext || '')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-doc-icon doc">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M12 18H8V14" />
          <path d="M16 14v4" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-doc-icon generic">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  };

  return (
    <div className="lib-grid">
      {items.map((item) => {
        const itemSrcUrl = item.url || (item.base64 ? `data:${item.mimeType};base64,${item.base64}` : '');
        const isSelected = selectedIds.includes(item.id);
        return (
          <div key={item.id} className={`lib-grid-card ${isSelected ? 'selected' : ''}`}>
            <div className="lib-grid-preview" onClick={(e) => onToggleSelect?.(item.id, e)}>
              {item.type === 'image' && itemSrcUrl ? (
                <img src={itemSrcUrl} alt={item.name} className="lib-image-fill" />
              ) : (
                <div className="lib-file-placeholder">
                  {getFileIcon(item)}
                  <span className="lib-grid-file-info">
                    {getExtensionAndSize(item)}
                  </span>
                </div>
              )}
              
              <div className="lib-card-overlay">
                <div className="lib-overlay-title" title={item.name}>
                  {truncateName(item.name)}
                </div>
                <div className="lib-overlay-select">
                  <div className={`lib-select-circle ${isSelected ? 'selected' : ''}`}>
                    {isSelected && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#0b0b0c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-check-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="lib-overlay-actions-column" onClick={(e) => e.stopPropagation()}>
                  <button 
                    type="button" 
                    className="lib-overlay-action-btn" 
                    onClick={(e) => { e.stopPropagation(); onRename(item); }} 
                    title="Rename"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-overlay-svg">
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className="lib-overlay-action-btn" 
                    onClick={(e) => { e.stopPropagation(); onDownload(item); }} 
                    title="Download"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-overlay-svg">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    className="lib-overlay-action-btn delete-btn" 
                    onClick={(e) => { e.stopPropagation(); onDelete(item); }} 
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="lib-overlay-svg delete-svg">
                      <path d="M14.2792,2 C15.1401,2 15.9044,2.55086 16.1766,3.36754 L16.7208,5 L20,5 C20.5523,5 21,5.44772 21,6 C21,6.55227 20.5523,6.99998 20,7 L19.9975,7.07125 L19.1301,19.2137 C19.018,20.7837 17.7117,22 16.1378,22 L7.86224,22 C6.28832,22 4.982,20.7837 4.86986,19.2137 L4.00254,7.07125 C4.00083,7.04735 3.99998,7.02359 3.99996,7 C3.44769,6.99998 3,6.55227 3,6 C3,5.44772 3.44772,5 4,5 L7.27924,5 L7.82339,3.36754 C8.09562,2.55086 8.8599,2 9.72076,2 L14.2792,2 Z M17.9975,7 L6.00255,7 L6.86478,19.0712 C6.90216,19.5946 7.3376,20 7.86224,20 L16.1378,20 C16.6624,20 17.0978,19.5946 17.1352,19.0712 L17.9975,7 Z M10,10 C10.51285,10 10.9355092,10.386027 10.9932725,10.8833761 L11,11 L11,16 C11,16.5523 10.5523,17 10,17 C9.48715929,17 9.06449214,16.613973 9.00672766,16.1166239 L9,16 L9,11 C9,10.4477 9.44771,10 10,10 Z M14,10 C14.5523,10 15,10.4477 15,11 L15,16 C15,16.5523 14.5523,17 14,17 C13.4477,17 13,16.5523 13,16 L13,11 C13,10.4477 13.4477,10 14,10 Z M14.2792,4 L9.72076,4 L9.38743,5 L14.6126,5 L14.2792,4 Z" />
                    </svg>
                  </button>
                </div>
                <div className="lib-overlay-details">
                  {getExtensionAndSize(item)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------------------
// LIST VIEW COMPONENT
// -------------------------------------------------------------
export function LibraryList({
  items,
  onDownload,
  onRename,
  onDelete,
  selectedIds = [],
  onToggleSelect
}: LibraryViewProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  const closeDropdown = () => {
    setActiveDropdownId(null);
  };

  const getFileIcon = (item: LibraryItem) => {
    const ext = item.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-list-doc-icon pdf">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    }
    if (['txt', 'md'].includes(ext || '')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-list-doc-icon text">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    }
    if (['doc', 'docx'].includes(ext || '')) {
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-list-doc-icon doc">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M12 18H8V14" />
          <path d="M16 14v4" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-list-doc-icon generic">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  };

  return (
    <div className="lib-list-container" onClick={closeDropdown}>
      <table className="lib-list-table">
        <thead>
          <tr>
            <th style={{ width: '40px' }}></th>
            <th>Name</th>
            <th>Modified <span className="lib-sort-arrow">↓</span></th>
            <th>Size</th>
            <th style={{ width: '60px' }}></th>
          </tr>
        </thead>
        <tbody>
          <tr className="lib-list-spacer-row">
            <td colSpan={5} style={{ height: '12px', padding: 0 }}></td>
          </tr>
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const itemSrcUrl = item.url || (item.base64 ? `data:${item.mimeType};base64,${item.base64}` : '');
            return (
              <tr key={item.id} className={`lib-list-row ${isSelected ? 'selected' : ''}`} onClick={(e) => onToggleSelect?.(item.id, e)}>
                <td className="lib-list-checkbox-col" onClick={(e) => { e.stopPropagation(); onToggleSelect?.(item.id, e); }}>
                  <div className={`lib-list-select-circle ${isSelected ? 'selected' : ''}`}>
                    {isSelected && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#0b0b0c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-check-svg">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </td>
                <td className="lib-list-name-col">
                  <div className="lib-list-name-wrap">
                    <span className="lib-list-icon-cell">
                      {item.type === 'image' && itemSrcUrl ? (
                        <img src={itemSrcUrl} alt={item.name} className="lib-list-thumbnail" />
                      ) : (
                        getFileIcon(item)
                      )}
                    </span>
                    <span className="lib-list-name-text" title={item.name}>{item.name}</span>
                  </div>
                </td>
                <td>{formatModifiedDate(item.timestamp)}</td>
                <td>{getItemSize(item)}</td>
                <td className="align-right" onClick={(e) => e.stopPropagation()}>
                <div className={`lib-list-actions-wrapper ${activeDropdownId === item.id ? 'active' : ''}`}>
                  <button 
                    type="button"
                    className="lib-list-actions-btn" 
                    onClick={(e) => toggleDropdown(e, item.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-list-dots-svg">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>

                  {activeDropdownId === item.id && (
                    <div className="lib-list-dropdown">
                      <button type="button" onClick={() => { onDownload(item); closeDropdown(); }}>
                        Download
                      </button>
                      {item.source === 'chat' && (
                        <button type="button" onClick={() => { onRename(item); closeDropdown(); }}>
                          Rename
                        </button>
                      )}
                      <button type="button" className="delete" onClick={() => { onDelete(item); closeDropdown(); }}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
}
