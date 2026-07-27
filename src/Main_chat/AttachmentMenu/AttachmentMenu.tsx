import { useState, useRef, useEffect } from 'react';
import './AttachmentMenu.css';

interface AttachmentMenuProps {
  onFileSelect: (files: File[]) => void;
}

export function AttachmentMenu({ onFileSelect }: AttachmentMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
      // Reset input value to allow selecting same file again
      e.target.value = '';
    }
    setIsOpen(false);
  };

  return (
    <div className="attachment-menu-container" ref={menuRef}>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />
      <input
        type="file"
        ref={folderInputRef}
        style={{ display: 'none' }}
        // @ts-ignore
        webkitdirectory=""
        directory=""
        onChange={handleFileChange}
        multiple
      />
      <input
        type="file"
        ref={pdfInputRef}
        style={{ display: 'none' }}
        accept=".pdf"
        onChange={handleFileChange}
        multiple
      />
      <input
        type="file"
        ref={imageInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
        multiple
      />

      <button 
        className={`footer-circle-btn ${isOpen ? 'active' : ''}`} 
        aria-label="Attach file" 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
      </button>

      {isOpen && (
        <div className="attachment-dropdown-menu">
          <button 
            className="attachment-dropdown-item" 
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-item-icon">
              <path d="M11.1 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.589 3.588A2.4 2.4 0 0 1 20 8v3.25" />
              <path d="M14 2v5a1 1 0 0 0 1 1h5" />
              <path d="m21 22-2.88-2.88" />
              <circle cx="16" cy="17" r="3" />
            </svg>
            <span>Upload a file</span>
          </button>

          <button 
            className="attachment-dropdown-item" 
            onClick={() => folderInputRef.current?.click()}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-item-icon">
              <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Upload a folder</span>
          </button>

          <button 
            className="attachment-dropdown-item" 
            onClick={() => pdfInputRef.current?.click()}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-item-icon">
              <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
              <path d="M14 2v5a1 1 0 0 0 1 1h5" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
            <span>PDF</span>
          </button>

          <button 
            className="attachment-dropdown-item" 
            onClick={() => imageInputRef.current?.click()}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="menu-item-icon">
              <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21" />
              <path d="m14 19.5 3-3 3 3" />
              <path d="M17 22v-5.5" />
              <circle cx="9" cy="9" r="2" />
            </svg>
            <span>Image</span>
          </button>
        </div>
      )}
    </div>
  );
}
