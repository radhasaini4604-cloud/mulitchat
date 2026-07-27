import { useState, useEffect } from 'react';
import './FilePreviewPanel.css';

interface FilePreviewPanelProps {
  file: {
    name: string;
    type: string;
    url?: string;
    base64?: string;
    content?: string;
    size?: number;
  };
  onClose: () => void;
}

// Helper to convert base64 to a Blob object
function base64ToBlob(base64: string, type: string): Blob {
  const binStr = atob(base64);
  const len = binStr.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }
  return new Blob([arr], { type });
}

export function FilePreviewPanel({ file, onClose }: FilePreviewPanelProps) {
  const [copied, setCopied] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('');

  useEffect(() => {
    let urlToClean = '';
    if (file.type === 'pdf') {
      if (file.base64) {
        try {
          const blob = base64ToBlob(file.base64, 'application/pdf');
          urlToClean = URL.createObjectURL(blob);
          setPdfBlobUrl(urlToClean);
        } catch (e) {
          console.error('Failed to parse PDF base64:', e);
          setPdfBlobUrl(file.url || '');
        }
      } else {
        setPdfBlobUrl(file.url || '');
      }
    } else {
      setPdfBlobUrl('');
    }

    return () => {
      if (urlToClean) {
        URL.revokeObjectURL(urlToClean);
      }
    };
  }, [file]);

  const handleCopy = () => {
    const textToCopy = file.content || '';
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate URL for embedding/viewing image
  let imagePreviewUrl = '';
  if (file.type === 'image') {
    imagePreviewUrl = file.base64
      ? `data:image/png;base64,${file.base64}`
      : file.url || '';
  }

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="file-preview-panel">
      <div className="preview-header">
        <div className="preview-title-container">
          <span className={`preview-file-icon icon-bg-${file.type === 'pdf' ? 'pdf' : file.type === 'image' ? 'image' : 'file'}`}>
            {file.type === 'pdf' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            ) : file.type === 'image' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#ffffff' }}>
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            )}
          </span>
          <div className="preview-file-meta">
            <span className="preview-file-name" title={file.name}>{file.name}</span>
            <span className="preview-file-size">{formatSize(file.size)}</span>
          </div>
        </div>
        
        <div className="preview-actions">
          {file.content !== undefined && (
            <button 
              className={`preview-action-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copy file contents"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
          <button className="preview-close-btn" onClick={onClose} aria-label="Close panel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="preview-content">
        {file.type === 'pdf' ? (
          pdfBlobUrl ? (
            <iframe 
              src={pdfBlobUrl} 
              width="100%" 
              height="100%" 
              className="pdf-viewer"
              title={file.name}
            />
          ) : (
            <div className="preview-error">Unable to render PDF preview: No content found.</div>
          )
        ) : file.type === 'image' ? (
          imagePreviewUrl ? (
            <div className="image-viewer-container">
              <img src={imagePreviewUrl} alt={file.name} className="image-viewer" />
            </div>
          ) : (
            <div className="preview-error">Unable to render Image preview: No content found.</div>
          )
        ) : file.content !== undefined ? (
          <div className="code-viewer-container">
            <pre className="code-viewer">
              <code>
                {file.content.split('\n').map((line, idx) => (
                  <div key={idx} className="code-line">
                    <span className="line-number">{idx + 1}</span>
                    <span className="line-text">{line || ' '}</span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        ) : (
          <div className="preview-error">No content available to preview this file.</div>
        )}
      </div>
    </div>
  );
}
