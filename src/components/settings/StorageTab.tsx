import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import './StorageTab.css'

export function StorageTab() {
  const [loading, setLoading] = useState(true)
  const [imagesSize, setImagesSize] = useState(0)
  const [imagesCount, setImagesCount] = useState(0)
  const [filesSize, setFilesSize] = useState(0)
  const [filesCount, setFilesCount] = useState(0)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const fetchStorageData = async () => {
      setLoading(true)
      try {
        let totalImagesBytes = 0
        let totalImagesNum = 0
        let totalFilesBytes = 0
        let totalFilesNum = 0

        if (!user) {
          // Guest mode fallback
          const guestCreationsData = localStorage.getItem('imagine_fallback:guest')
          if (guestCreationsData) {
            try {
              const list = JSON.parse(guestCreationsData)
              totalImagesNum = list.length
              list.forEach((item: any) => {
                if (item.url && item.url.startsWith('data:')) {
                  totalImagesBytes += Math.round(item.url.length * 0.75)
                }
              })
            } catch (e) {}
          }

          const guestMessagesData = localStorage.getItem('guest_messages')
          if (guestMessagesData) {
            try {
              const allMsgs = JSON.parse(guestMessagesData)
              Object.values(allMsgs).forEach((msgsList: any) => {
                if (Array.isArray(msgsList)) {
                  msgsList.forEach((msg: any) => {
                    if (msg.attachments && Array.isArray(msg.attachments)) {
                      msg.attachments.forEach((att: any) => {
                        if (att.size) {
                          if (att.type !== 'image') {
                            totalFilesBytes += att.size
                            totalFilesNum++
                          }
                        }
                      })
                    }
                  })
                }
              })
            } catch (e) {}
          }
        } else {
          // 1. Fetch images from Supabase Storage (creations & avatars)
          const { data: creationsStorage, error: creationsErr } = await supabase.storage
            .from('creations')
            .list(user.id)
          
          if (!creationsErr && creationsStorage) {
            creationsStorage.forEach(item => {
              if (item.metadata?.size) {
                totalImagesBytes += item.metadata.size
                totalImagesNum++
              }
            })
          }

          const { data: avatarsStorage, error: avatarsErr } = await supabase.storage
            .from('avatars')
            .list(user.id)
          
          if (!avatarsErr && avatarsStorage) {
            avatarsStorage.forEach(item => {
              if (item.metadata?.size) {
                totalImagesBytes += item.metadata.size
                totalImagesNum++
              }
            })
          }

          // 2. Fetch files from chat messages attachments
          const { data: chats, error: chatsErr } = await supabase
            .from('chats')
            .select('id')
            .eq('user_id', user.id)

          if (!chatsErr && chats && chats.length > 0) {
            const chatIds = chats.map(c => c.id)
            const { data: messages, error: msgsErr } = await supabase
              .from('messages')
              .select('attachments')
              .in('session_id', chatIds)

            if (!msgsErr && messages) {
              messages.forEach(msg => {
                if (msg.attachments && Array.isArray(msg.attachments)) {
                  msg.attachments.forEach((att: any) => {
                    if (att.size) {
                      if (att.type !== 'image') {
                        totalFilesBytes += att.size
                        totalFilesNum++
                      }
                    }
                  })
                }
              })
            }
          }
        }

        setImagesSize(totalImagesBytes)
        setImagesCount(totalImagesNum)
        setFilesSize(totalFilesBytes)
        setFilesCount(totalFilesNum)
      } catch (err) {
        console.error("Failed to load storage details from Supabase:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStorageData()
  }, [user])

  const limitBytes = 1 * 1024 * 1024 * 1024 // 1 GB
  const totalUsedBytes = imagesSize + filesSize
  const usedPercentage = (totalUsedBytes / limitBytes) * 100

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  return (
    <div className="storage-tab-content">
      <div className="storage-header-section">
        <h3>Storage</h3>
      </div>

      <div className="storage-usage-section">
        <span className="storage-usage-text">
          {loading ? 'Calculating storage...' : `${formatBytes(totalUsedBytes)} of 1 GB used`}
        </span>
        <div className="storage-progress-track">
          <div 
            className="storage-progress-bar" 
            style={{ width: `${Math.max(loading ? 0 : usedPercentage, totalUsedBytes > 0 ? 1 : 0)}%` }} 
          />
        </div>
      </div>

      <div className="storage-manage-section">
        <div className="storage-manage-header">
          <h4>Manage storage</h4>
          <span className="storage-manage-desc">Manage your library to free up storage</span>
        </div>

        <div className="storage-list">
          <button type="button" className="storage-list-item" onClick={() => console.log('Manage files')}>
            <div className="storage-item-info">
              <span className="storage-item-label">Files</span>
              <span className="storage-item-details">
                {loading ? 'Loading...' : `${formatBytes(filesSize)} • ${filesCount} file${filesCount !== 1 ? 's' : ''}`}
              </span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="storage-divider" />

          <button type="button" className="storage-list-item" onClick={() => console.log('Manage images')}>
            <div className="storage-item-info">
              <span className="storage-item-label">Images</span>
              <span className="storage-item-details">
                {loading ? 'Loading...' : `${formatBytes(imagesSize)} • ${imagesCount} image${imagesCount !== 1 ? 's' : ''}`}
              </span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
