import { useRef, useEffect, useState } from 'react';
import './LibraryFilter.css';

interface CalendarFilterProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onClearDate: () => void;
}

// -------------------------------------------------------------
// CALENDAR PICKER FILTER COMPONENT
// -------------------------------------------------------------
export function CalendarFilter({ selectedDate, onSelectDate, onClearDate }: CalendarFilterProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();

    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthTotalDays = prevMonthLastDay.getDate();

    const days = [];

    // Prepend previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: prevMonthTotalDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthTotalDays - i)
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }

    // Append next month days to complete grid
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }

    return days;
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="lib-calendar-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="lib-cal-header">
        <button type="button" className="lib-cal-nav-btn" onClick={handlePrevMonth} aria-label="Previous month">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-cal-nav-icon">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="lib-cal-month-title">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button type="button" className="lib-cal-nav-btn" onClick={handleNextMonth} aria-label="Next month">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="lib-cal-nav-icon">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="lib-cal-weekdays">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="lib-cal-weekday">{d}</div>
        ))}
      </div>

      <div className="lib-cal-days-grid">
        {getCalendarDays().map((cell, idx) => {
          const isSelected = selectedDate && isSameDay(cell.date, selectedDate);
          const isToday = isSameDay(cell.date, new Date());
          return (
            <button
              key={idx}
              type="button"
              className={`lib-cal-day-cell ${!cell.isCurrentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => onSelectDate(cell.date)}
              disabled={!cell.isCurrentMonth}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <div className="lib-cal-footer">
        <button type="button" className="lib-cal-clear-btn" onClick={onClearDate}>
          Clear Filter
        </button>
      </div>
    </div>
  );
}

interface LibraryFilterRowProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'image' | 'file';
  setFilterType: (type: 'all' | 'image' | 'file') => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  
  // Selection props
  selectedIds?: string[];
  onClearSelection?: () => void;
  onBulkDownload?: () => void;
  onBulkDelete?: () => void;
  onBulkStartChat?: () => void;
}

// -------------------------------------------------------------
// FILTER ROW COMPONENT
// -------------------------------------------------------------
export function LibraryFilterRow({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  viewMode,
  setViewMode,
  selectedDate,
  setSelectedDate,
  isCalendarOpen,
  setIsCalendarOpen,
  selectedIds = [],
  onClearSelection,
  onBulkDownload,
  onBulkDelete,
  onBulkStartChat
}: LibraryFilterRowProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        calendarRef.current && 
        !calendarRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsCalendarOpen]);

  const hasSelection = selectedIds && selectedIds.length > 0;

  if (hasSelection) {
    return (
      <div className="lib-filter-controls-row select-mode-header">
        <div className="lib-bulk-actions-row">
          <button className="lib-bulk-btn start-chat-btn" onClick={onBulkStartChat}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-bulk-btn-svg">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Start chat
          </button>
          
          <button className="lib-bulk-btn action-pill-btn" onClick={onBulkDownload}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-bulk-btn-svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
          <button className="lib-bulk-btn delete-pill-btn" onClick={onBulkDelete}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-bulk-btn-svg">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        </div>

        <div className="lib-controls select-mode-controls">
          <span className="lib-selected-count-label">
            {selectedIds.length} selected
          </span>
          <button className="lib-clear-select-btn" onClick={onClearSelection}>
            Clear
          </button>

          <div className="lib-layout-toggles">
            <div className="lib-tooltip-wrapper">
              <button
                className={`lib-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid layout"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-layout-icon">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <span className="lib-tooltip-text">Grid view</span>
            </div>
            <div className="lib-tooltip-wrapper">
              <button
                className={`lib-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List layout"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-layout-icon">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <span className="lib-tooltip-text">List view</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lib-filter-controls-row">
      <div className="lib-tab-row">
        {(['all', 'image', 'file'] as const).map((tab) => (
          <button
            key={tab}
            className={`lib-tab ${filterType === tab ? 'active' : ''}`}
            onClick={() => setFilterType(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1) + 's'}
          </button>
        ))}
      </div>

      <div className="lib-controls">
        <div className="lib-search-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lib-search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="lib-search-field"
          />
        </div>

        <div className="lib-calendar-wrapper lib-tooltip-wrapper" ref={calendarRef}>
          <button
            ref={triggerRef}
            className={`lib-calendar-btn ${selectedDate ? 'active' : ''}`}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            aria-label="Filter by date"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" className="lib-calendar-svg">
              <path d="M22 14V12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 8.22876 2 12V14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
              <path opacity="0.5" d="M7 4V2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
              <path opacity="0.5" d="M17 4V2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
              <path opacity="0.5" d="M2 9H22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
              <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="1"></circle>
              <path d="M20.5 20.5L22 22" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
            </svg>
            {selectedDate && <span className="lib-calendar-badge"></span>}
          </button>
          {!isCalendarOpen && <span className="lib-tooltip-text">Filter by date</span>}

          {isCalendarOpen && (
            <CalendarFilter
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
              onClearDate={() => {
                setSelectedDate(null);
                setIsCalendarOpen(false);
              }}
            />
          )}
        </div>

        <div className="lib-layout-toggles">
          <div className="lib-tooltip-wrapper">
            <button
              className={`lib-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid layout"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-layout-icon">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <span className="lib-tooltip-text">Grid view</span>
          </div>
          <div className="lib-tooltip-wrapper">
            <button
              className={`lib-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List layout"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lib-layout-icon">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="lib-tooltip-text">List view</span>
          </div>
        </div>
      </div>
    </div>
  );
}
