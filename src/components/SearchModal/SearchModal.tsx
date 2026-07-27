import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { getChats } from '../../Main_chat/utils/db'
import type { ChatSession } from '../../Main_chat/utils/db'
import './SearchModal.css'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  setActiveSessionId: (id: string | null) => void
  onNewChat?: () => void
}

interface GroupedChats {
  today: ChatSession[]
  yesterday: ChatSession[]
  lastWeek: ChatSession[]
  older: ChatSession[]
}

export function SearchModal({
  isOpen,
  onClose,
  setActiveSessionId,
  onNewChat
}: SearchModalProps) {
  const [chats, setChats] = useState<ChatSession[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const inputRef = useRef<HTMLInputElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const loadChats = async () => {
    try {
      const allChats = await getChats()
      // Filter out archived chats and non-Main_chat chats for active search, sort newest first
      const activeChats = allChats.filter((chat) => chat.archived !== true && chat.id.startsWith('Main_chat_'))
      activeChats.sort((a, b) => b.createdAt - a.createdAt)
      setChats(activeChats)
    } catch (err) {
      console.error('Failed to load chats for search:', err)
    }
  }

  // Load chats on open
  useEffect(() => {
    if (isOpen) {
      loadChats()
      setSearchQuery('')
      setSelectedDate(null)
      setIsCalendarOpen(false)
      setCurrentMonth(new Date())
      // Auto focus input
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
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

  // Click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false)
      }
    }
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCalendarOpen])

  if (!isOpen) return null

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const todayDate = new Date()

  // Filter chats by search query and selected date
  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    if (!selectedDate) return matchesSearch

    const chatDate = new Date(chat.createdAt)
    const matchesDate = isSameDay(chatDate, selectedDate)

    return matchesSearch && matchesDate
  })

  // Group chats by date
  const groupChatsByDate = (chatList: ChatSession[]): GroupedChats => {
    const today: ChatSession[] = []
    const yesterday: ChatSession[] = []
    const lastWeek: ChatSession[] = []
    const older: ChatSession[] = []

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000
    const startOfLastWeek = startOfToday - 7 * 24 * 60 * 60 * 1000

    chatList.forEach((chat) => {
      const time = chat.createdAt
      if (time >= startOfToday) {
        today.push(chat)
      } else if (time >= startOfYesterday) {
        yesterday.push(chat)
      } else if (time >= startOfLastWeek) {
        lastWeek.push(chat)
      } else {
        older.push(chat)
      }
    })

    return { today, yesterday, lastWeek, older }
  }

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDayIndex = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()
    const prevMonthTotalDays = new Date(year, month, 0).getDate()

    const days = []

    // Previous month's trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthTotalDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthTotalDays - i)
      })
    }

    // Current month's days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      })
    }

    // Next month's leading days to fill up to 42 cells
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      })
    }

    return days
  }

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleSelectDate = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDate(date)
    setIsCalendarOpen(false)
  }

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDate(null)
    setIsCalendarOpen(false)
  }

  const grouped = groupChatsByDate(filteredChats)

  const handleSelectChat = (chat: ChatSession) => {
    setActiveSessionId(chat.id)
    onClose()
  }

  const handleNewChatClick = () => {
    if (onNewChat) {
      onNewChat()
    }
    onClose()
  }

  const renderChatRow = (chat: ChatSession) => (
    <button
      key={chat.id}
      className="search-chat-row"
      onClick={() => handleSelectChat(chat)}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="search-row-icon bubble-icon"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>
      <span className="search-row-title">{chat.title}</span>
    </button>
  )

  const hasResults = filteredChats.length > 0

  return createPortal(
    <div className="modal-overlay search-modal-overlay" onClick={onClose}>
      <div className="search-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Search Input Bar */}
        <div className="search-bar-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="search-input-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input-field"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Custom Calendar Filter Button */}
          <div className="calendar-filter-container" ref={calendarRef}>
            <button
              className={`search-modal-calendar-btn ${selectedDate ? 'active' : ''}`}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              aria-label="Filter by date"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="calendar-icon"><g id="SVGRepo_bgCarrier" strokeWidth="1"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 14V12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 8.22876 2 12V14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path> <path opacity="0.5" d="M7 4V2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path> <path opacity="0.5" d="M17 4V2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path> <path opacity="0.5" d="M2 9H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path> <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1"></circle> <path d="M20.5 20.5L22 22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path> </g></svg>
              {selectedDate && <span className="calendar-active-badge"></span>}
            </button>

            {isCalendarOpen && (
              <div className="calendar-dropdown">
                <div className="calendar-dropdown-header">
                  <button className="calendar-nav-btn" onClick={handlePrevMonth} aria-label="Previous month">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="calendar-nav-icon">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <span className="calendar-month-title">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <button className="calendar-nav-btn" onClick={handleNextMonth} aria-label="Next month">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="calendar-nav-icon">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div className="calendar-weekdays">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d} className="calendar-weekday">{d}</div>
                  ))}
                </div>

                <div className="calendar-days-grid">
                  {getCalendarDays().map((cell, idx) => {
                    const isSelected = selectedDate && isSameDay(cell.date, selectedDate)
                    const isToday = isSameDay(cell.date, todayDate)
                    return (
                      <button
                        key={idx}
                        className={`calendar-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today-marker' : ''}`}
                        onClick={(e) => handleSelectDate(cell.date, e)}
                      >
                        {cell.day}
                      </button>
                    )
                  })}
                </div>

                <div className="calendar-footer">
                  <button className="calendar-clear-btn" onClick={handleClearDate}>
                    Clear Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="search-modal-close-btn" onClick={onClose} aria-label="Close search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="search-close-icon">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="search-modal-body">
          {/* Active Date Filter Chip */}
          {selectedDate && (
            <div className="active-filter-banner">
              <span className="filter-text">
                Showing chats from: <strong>{selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </span>
              <button className="clear-filter-chip-btn" onClick={() => setSelectedDate(null)} aria-label="Clear date filter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="clear-chip-icon">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
          {/* New Chat Row */}
          <button className="search-new-chat-row" onClick={handleNewChatClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="search-row-icon pen-icon"
            >
              <path d="M12 3H9a6 6 0 0 0-6 6v6a6 6 0 0 0 6 6h6a6 6 0 0 0 6-6v-3" />
              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
            </svg>
            <span className="search-row-title font-medium">New chat</span>
          </button>

          <div className="search-results-list">
            {!hasResults ? (
              <div className="search-empty-state">
                <p className="search-empty-text">No matching chats found</p>
              </div>
            ) : (
              <>
                {/* Today */}
                {grouped.today.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-header">Today</div>
                    {grouped.today.map(renderChatRow)}
                  </div>
                )}

                {/* Yesterday */}
                {grouped.yesterday.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-header">Yesterday</div>
                    {grouped.yesterday.map(renderChatRow)}
                  </div>
                )}

                {/* Previous 7 days */}
                {grouped.lastWeek.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-header">Previous 7 days</div>
                    {grouped.lastWeek.map(renderChatRow)}
                  </div>
                )}

                {/* Older */}
                {grouped.older.length > 0 && (
                  <div className="search-group">
                    <div className="search-group-header">Older</div>
                    {grouped.older.map(renderChatRow)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
