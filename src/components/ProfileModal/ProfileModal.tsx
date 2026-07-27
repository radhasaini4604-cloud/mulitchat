import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './ProfileModal.css'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentName: string
  currentUsername: string
  currentAvatarUrl: string | null
  onSave: (name: string, username: string, avatarUrl: string | null) => void
}

export function ProfileModal({
  isOpen,
  onClose,
  currentName,
  currentUsername,
  currentAvatarUrl,
  onSave
}: ProfileModalProps) {
  const [name, setName] = useState(currentName)
  const [username, setUsername] = useState(currentUsername)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  // Cropper states
  const [zoom, setZoom] = useState(1.0)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setName(currentName)
      setUsername(currentUsername)
      setAvatarUrl(currentAvatarUrl)
      setSelectedFile(null)
      setZoom(1.0)
      setTranslateX(0)
      setTranslateY(0)
    }
  }, [isOpen, currentName, currentUsername, currentAvatarUrl])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedFile(reader.result as string)
        setZoom(1.0)
        setTranslateX(0)
        setTranslateY(0)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedFile) return
    setIsDragging(true)
    dragStart.current = {
      x: e.clientX - translateX,
      y: e.clientY - translateY
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedFile) return
    setTranslateX(e.clientX - dragStart.current.x)
    setTranslateY(e.clientY - dragStart.current.y)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleSave = () => {
    if (selectedFile) {
      // Create cropped image using Canvas
      const img = new Image()
      img.src = selectedFile
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 150
        canvas.height = 150
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, 150, 150)
          
          // Clip path to circular cutout
          ctx.beginPath()
          ctx.arc(75, 75, 75, 0, Math.PI * 2)
          ctx.clip()

          // Draw image centered in the 200px crop container viewport
          // Scaled to 150px canvas viewport
          const containerSize = 200
          let renderWidth = containerSize
          let renderHeight = containerSize
          const aspectRatio = img.width / img.height

          if (aspectRatio > 1) {
            renderHeight = containerSize
            renderWidth = containerSize * aspectRatio
          } else {
            renderWidth = containerSize
            renderHeight = containerSize / aspectRatio
          }

          const drawWidth = renderWidth * zoom
          const drawHeight = renderHeight * zoom
          const drawX = 75 + translateX - drawWidth / 2
          const drawY = 75 + translateY - drawHeight / 2

          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

          const croppedDataUrl = canvas.toDataURL('image/png')
          onSave(name, username, croppedDataUrl)
        }
      }
    } else {
      onSave(name, username, avatarUrl)
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Edit Profile</h2>
          <button className="profile-close-btn" onClick={onClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="close-icon">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="profile-modal-body">
          {/* Avatar Edit Section */}
          <div className="profile-avatar-edit-container">
            {!selectedFile ? (
              <div className="avatar-preview-wrapper" onClick={triggerFileSelect}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar preview" className="avatar-preview-img" />
                ) : (
                  <div className="avatar-initial-fallback">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="avatar-hover-overlay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="camera-icon">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Upload</span>
                </div>
              </div>
            ) : (
              <div className="crop-area-container">
                <div 
                  className="crop-viewport"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                  <img 
                    src={selectedFile} 
                    alt="Source crop" 
                    className="crop-source-img"
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      transform: `translate(${translateX}px, ${translateY}px) scale(${zoom})`
                    }}
                  />
                  <div className="crop-overlay-mask">
                    <div className="crop-circular-cutout" />
                  </div>
                </div>
                <div className="crop-zoom-control">
                  <span className="zoom-label">Zoom</span>
                  <input 
                    type="range" 
                    min="1.0" 
                    max="3.0" 
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="zoom-slider"
                  />
                </div>
                <button className="change-photo-btn" onClick={triggerFileSelect}>
                  Choose Different Photo
                </button>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Text Inputs */}
          <div className="profile-fields-container">
            <div className="profile-input-group">
              <label htmlFor="display-name">Display Name</label>
              <input 
                type="text" 
                id="display-name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Display Name"
              />
            </div>
            
            <div className="profile-input-group">
              <label htmlFor="username">Username</label>
              <div className="username-input-wrapper">
                <span className="username-prefix">@</span>
                <input 
                  type="text" 
                  id="username"
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="username"
                />
              </div>
            </div>
          </div>
          
          <div className="profile-footer-subtext-centered">
            Your profile helps people recognize you in group chats.
          </div>
        </div>

        <div className="profile-modal-footer">
          <button className="btn btn-secondary pill-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary pill-btn" 
            onClick={handleSave}
            disabled={!name.trim() || !username.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
