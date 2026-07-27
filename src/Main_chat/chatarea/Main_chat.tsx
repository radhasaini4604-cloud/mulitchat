import { useState, useRef, useEffect, useCallback } from 'react';
import { ModelColumn } from '../ModelColumn/ModelColumn';
import { Main_chatInputCard } from './Main_chatInputCard';
import { useMain_chatChat } from './useMain_chatChat';
import { useVoiceInput } from './useVoiceInput';
import { SingleModelModal } from '../../components/SingleModelModal/SingleModelModal';
import { getChats } from '../utils/db';
import { getTempChat } from '../utils/tempDb';
import './Main_chat.css';

const NEW_CHAT_TITLES = [
  'ready to think limitless .',
  'dive into unmatched dimensions .',
  'traverse the infinite expanse .',
  'beyond the event nothric .',
  'let\'s explore the infinite .',
];

export interface Main_chatProps {
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  onPreviewFile?: (file: any) => void;
}

export function Main_chat({ activeSessionId, setActiveSessionId, onPreviewFile }: Main_chatProps) {
  const [prompt, setPrompt] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isGridScrolling, setIsGridScrolling] = useState(false);
  const gridScrollTimeoutRef = useRef<any>(null);

  const handleGridScroll = () => {
    setIsGridScrolling(true);
    if (gridScrollTimeoutRef.current) {
      clearTimeout(gridScrollTimeoutRef.current);
    }
    gridScrollTimeoutRef.current = setTimeout(() => {
      setIsGridScrolling(false);
    }, 850);
  };

  useEffect(() => {
    return () => {
      if (gridScrollTimeoutRef.current) clearTimeout(gridScrollTimeoutRef.current);
    };
  }, []);
  const [isDictationEnabled, setIsDictationEnabled] = useState(
    () => localStorage.getItem('settings-enable-detection') !== 'false'
  );
  const [smartScroll, setSmartScroll] = useState(
    () => localStorage.getItem('settings-smart-scroll') !== 'false'
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);
  const [isSingleModelModalOpen, setIsSingleModelModalOpen] = useState(false);




  const dropdownRef = useRef<HTMLDivElement>(null);
  const layoutDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (layoutDropdownRef.current && !layoutDropdownRef.current.contains(event.target as Node)) {
        setIsLayoutDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [title] = useState(() => {
    const lastIndexStr = sessionStorage.getItem('last_new_chat_title_index');
    const lastIndex = lastIndexStr ? parseInt(lastIndexStr, 10) : -1;
    let randomIndex = Math.floor(Math.random() * NEW_CHAT_TITLES.length);
    if (lastIndex !== -1 && NEW_CHAT_TITLES.length > 1) {
      while (randomIndex === lastIndex) {
        randomIndex = Math.floor(Math.random() * NEW_CHAT_TITLES.length);
      }
    }
    sessionStorage.setItem('last_new_chat_title_index', randomIndex.toString());
    return NEW_CHAT_TITLES[randomIndex];
  });

  const [isTemporary, setIsTemporary] = useState(
    () => sessionStorage.getItem('Main_chat_temp_chat') === 'true'
  );

  useEffect(() => {
    if (activeSessionId?.startsWith('temp_')) {
      setIsTemporary(true);
    }
  }, [activeSessionId]);

  const handleToggleTempChat = () => {
    const nextVal = !isTemporary;
    setIsTemporary(nextVal);
    sessionStorage.setItem('Main_chat_temp_chat', nextVal ? 'true' : 'false');
    setActiveSessionId(null);
    window.dispatchEvent(new Event('chat-sessions-updated'));
  };

  // Chat logic
  const {
    activeModels, setActiveModels, responses, isResponding, isStopped,
    toggleModel, handleSend, handleStop, handleTypewriterComplete, handleRetry, handleEditMessage, modelsList,
  } = useMain_chatChat({
    activeSessionId, setActiveSessionId,
    attachedFiles, setAttachedFiles,
    expandedModel,
    isTemporary,
  });

  const gridRef = useRef<HTMLDivElement>(null);

  // Buttery-smooth horizontal edge-scrolling with custom chevron cursors & kinetic velocity scroll
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !smartScroll) return;

    let animationFrameId: number | null = null;
    let scrollDirection: 'left' | 'right' | null = null;
    let scrollSpeed = 0;

    // Debounce timer for left scroll to prevent accidental scrolling when moving cursor to the sidebar
    let leftScrollTimeoutId: any = null;

    // Kinetic velocity tracking variables
    let lastX = 0;
    let lastTime = Date.now();
    let velocityMultiplier = 1;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = e.clientX;

      // Vertical boundary check: only scroll if mouse is within vertical content bounds (excluding header and footer)
      if (e.clientY < 70 || e.clientY > window.innerHeight - 100) {
        stopScrolling();
        return;
      }

      // Calculate instantaneous mouse velocity to boost scroll speed when cursor is moved quickly
      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const dx = e.clientX - lastX;
        const speed = Math.abs(dx / dt); // pixels per millisecond

        // Flick boost: multiplier scales with flick speed up to 3.5x
        velocityMultiplier = Math.min(3.5, 1 + speed * 1.5);
      }
      lastX = e.clientX;
      lastTime = now;

      const boundaryWidth = 70; // 70px boundary zone from right edge of the screen
      const rightTriggerThreshold = window.innerWidth - boundaryWidth;
      const leftTriggerThreshold = rect.left + 60; // 60px zone next to sidebar

      if (x >= rightTriggerThreshold) {
        // Clear any left scroll timeout
        if (leftScrollTimeoutId) {
          clearTimeout(leftScrollTimeoutId);
          leftScrollTimeoutId = null;
        }

        scrollDirection = 'right';

        // Closer to the screen right edge (window.innerWidth) means faster scroll
        const distanceToRightEdge = window.innerWidth - x;
        const ratio = 1 - (Math.max(0, distanceToRightEdge) / boundaryWidth);
        scrollSpeed = ratio * 18; // Max speed 18px per frame

        const container = grid.closest('.Main_chat-container') || grid;
        container.classList.add('edge-scroll-right-active');
        container.classList.remove('edge-scroll-left-active');

        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(scrollLoop);
        }
      } else if (x >= rect.left && x <= leftTriggerThreshold) {
        if (scrollDirection === 'left') {
          // Already scrolling left, update speed dynamically based on proximity
          const distance = x - rect.left;
          const ratio = 1 - (distance / 60);
          scrollSpeed = ratio * 18;
        } else if (!leftScrollTimeoutId) {
          // Debounce left scroll so fast swipes to sidebar do not trigger accidental left-scrolling
          leftScrollTimeoutId = setTimeout(() => {
            scrollDirection = 'left';

            const distance = x - rect.left;
            const ratio = 1 - (distance / 60);
            scrollSpeed = ratio * 18;

            const container = grid.closest('.Main_chat-container') || grid;
            container.classList.add('edge-scroll-left-active');
            container.classList.remove('edge-scroll-right-active');

            if (!animationFrameId) {
              animationFrameId = requestAnimationFrame(scrollLoop);
            }
          }, 250); // 250ms hold required to initiate left scroll
        }
      } else {
        stopScrolling();
      }
    };

    const scrollLoop = () => {
      if (!scrollDirection) {
        animationFrameId = null;
        return;
      }

      // Temporarily disable scroll-snap during active edge scrolling to prevent jerky feedback
      grid.style.scrollSnapType = 'none';

      // Apply velocity-tracked kinetic multiplier to final frame speed
      const finalSpeed = scrollSpeed * velocityMultiplier;

      if (scrollDirection === 'right') {
        grid.scrollLeft += finalSpeed;
      } else if (scrollDirection === 'left') {
        grid.scrollLeft -= finalSpeed;
      }

      // Smoothly decay velocity multiplier back to 1.0 (base speed) over animation frames if mouse stays still
      if (velocityMultiplier > 1) {
        velocityMultiplier = Math.max(1, velocityMultiplier - 0.05);
      }

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    const stopScrolling = () => {
      scrollDirection = null;
      velocityMultiplier = 1;
      if (leftScrollTimeoutId) {
        clearTimeout(leftScrollTimeoutId);
        leftScrollTimeoutId = null;
      }
      if (grid) {
        const container = grid.closest('.Main_chat-container') || grid;
        container.classList.remove('edge-scroll-right-active');
        container.classList.remove('edge-scroll-left-active');
        grid.style.scrollSnapType = ''; // Re-enable scroll snapping when idle
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    // Listen globally on window so it works even if mouse reaches sidebar/screen borders
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('blur', stopScrolling);

    return () => {
      stopScrolling();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('blur', stopScrolling);
    };
  }, [activeSessionId, activeModels, responses, smartScroll]);

  // Voice input logic
  const { isRecording, isProcessingVoice, handleMicClick, stopVisualizer } = useVoiceInput({
    canvasRef,
    onTranscript: (text) => setPrompt((prev) => prev ? prev + ' ' + text : text),
  });

  // Clean up URL model param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('models')) {
      params.delete('models');
      const search = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${search ? '?' + search : ''}`);
    }
  }, []);

  // Set document title dynamically based on active chat session title
  useEffect(() => {
    let active = true;

    async function updateTitle() {
      if (!activeSessionId) {
        document.title = 'Nothric';
        return;
      }

      try {
        if (activeSessionId.startsWith('temp_')) {
          const session = await getTempChat(activeSessionId);
          if (active) {
            document.title = session ? `${session.title} - Nothric` : 'Nothric';
          }
        } else {
          const chatsList = await getChats();
          const session = chatsList.find(c => c.id === activeSessionId);
          if (active) {
            document.title = session ? `${session.title} - Nothric` : 'Nothric';
          }
        }
      } catch (err) {
        console.error('Failed to update tab title:', err);
        if (active) {
          document.title = 'Nothric';
        }
      }
    }

    updateTitle();

    window.addEventListener('chat-sessions-updated', updateTitle);

    return () => {
      active = false;
      window.removeEventListener('chat-sessions-updated', updateTitle);
    };
  }, [activeSessionId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Listen for dictation setting change & cleanup
  useEffect(() => {
    const handleUpdate = () => {
      setIsDictationEnabled(localStorage.getItem('settings-enable-detection') !== 'false');
    };
    window.addEventListener('settings-dictation-changed', handleUpdate);
    return () => {
      window.removeEventListener('settings-dictation-changed', handleUpdate);
      stopVisualizer();
    };
  }, [stopVisualizer]);


  // Listen for smart scroll setting change
  useEffect(() => {
    const handleSmartScrollChange = () => {
      setSmartScroll(localStorage.getItem('settings-smart-scroll') !== 'false');
    };
    window.addEventListener('settings-smart-scroll-changed', handleSmartScrollChange);
    return () => {
      window.removeEventListener('settings-smart-scroll-changed', handleSmartScrollChange);
    };
  }, []);

  // Auto-start from project new chat
  useEffect(() => {
    const queryText = localStorage.getItem('project_new_chat_query');
    if (queryText && !activeSessionId) {
      localStorage.removeItem('project_new_chat_query');
      setPrompt(queryText);
      handleSend(queryText, queryText);
    }
  }, [activeSessionId]);

  const handleToggleExpand = (model: string) => {
    setExpandedModel((prev) => (prev === model ? null : model));
  };

  const handleFileSelect = useCallback((files: File[]) => {
    if (!activeModels.includes('auto')) {
      alert('Attachments are only supported in Auto Nothric mode.');
      return;
    }
    setAttachedFiles((prev) => [...prev, ...files]);
  }, [activeModels]);

  const handleRemoveFile = useCallback((index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSuggestionClick = useCallback((text: string) => {
    setPrompt(text);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!activeModels.includes('auto')) {
      return;
    }
    const items = e.clipboardData.items;
    const filesToAttach: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        if (file) filesToAttach.push(file);
      }
    }
    if (filesToAttach.length > 0) handleFileSelect(filesToAttach);
  }, [handleFileSelect, activeModels]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(undefined, prompt);
      setPrompt('');
    }
  };

  const hasMessages = Object.values(responses).some((msgs) => msgs.length > 0);

  return (
    <div className={`Main_chat-container ${!hasMessages ? 'new-chat' : ''}`}>
      {/* Top Left Layout Selector on Greet Screen */}
      {!hasMessages && (
        <div className="greet-layout-selector" ref={layoutDropdownRef} style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 1002,
        }}>
          <button
            className="greet-layout-trigger"
            onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main, #ffffff)',
              fontSize: '18px',
              fontFamily: "'Open Sans', sans-serif",
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'background 0.2s ease',
            }}
          >
            <span style={{ fontSize: '18px', letterSpacing: '-0.02em', fontFamily: "'Inter', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 300 }}>{activeModels.includes('auto') ? 'Auto Nothric' : activeModels.length === 1 ? 'Single Model' : 'Multi-Column'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', opacity: 0.8 }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          <div className={`greet-layout-dropdown ${isLayoutDropdownOpen ? 'open' : ''}`} style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: '6px',
              width: '250px',
              background: 'var(--dropdown-bg, #ffffff)',
              border: 'none',
              borderRadius: '12px',
              padding: '6px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              fontFamily: "'Open Sans', sans-serif",
            }}>
              {/* Option 1: Multi-Column */}
              <button
                className={`layout-dropdown-item ${(!activeModels.includes('auto') && activeModels.length > 1) ? 'active' : ''}`}
                onClick={() => {
                  toggleModel('gemini');
                  toggleModel('gpt');
                  toggleModel('qwen');
                  setIsLayoutDropdownOpen(false);
                }}
                type="button"
              >
                <div className="layout-icon-container">
                  <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1">
                    <path d="M9.5 5.75C9.91421 5.75 10.25 5.41421 10.25 5C10.25 4.58579 9.91421 4.25 9.5 4.25V5.75ZM4.75 11C4.75 11.4142 5.08579 11.75 5.5 11.75C5.91421 11.75 6.25 11.4142 6.25 11H4.75ZM9.5 4.25C9.08579 4.25 8.75 4.58579 8.75 5C8.75 5.41421 9.08579 5.75 9.5 5.75V4.25ZM18.75 11C18.75 11.4142 19.0858 11.75 19.5 11.75C19.9142 11.75 20.25 11.4142 20.25 11H18.75ZM10.25 5C10.25 4.58579 9.91421 4.25 9.5 4.25C9.08579 4.25 8.75 4.58579 8.75 5H10.25ZM8.75 11C8.75 11.4142 9.08579 11.75 9.5 11.75C9.91421 11.75 10.25 11.4142 10.25 11H8.75ZM9.5 11.75C9.91421 11.75 10.25 11.4142 10.25 11C10.25 10.5858 9.91421 10.25 9.5 10.25V11.75ZM5.5 10.25C5.08579 10.25 4.75 10.5858 4.75 11C4.75 11.4142 5.08579 11.75 5.5 11.75V10.25ZM9.5 10.25C9.08579 10.25 8.75 10.5858 8.75 11C8.75 11.4142 9.08579 11.75 9.5 11.75V10.25ZM19.5 11.75C19.9142 11.75 20.25 11.4142 20.25 11C20.25 10.5858 19.9142 10.25 19.5 10.25V11.75ZM6.25 11C6.25 10.5858 5.91421 10.25 5.5 10.25C5.08579 10.25 4.75 10.5858 4.75 11H6.25ZM20.25 11C20.25 10.5858 19.9142 10.25 19.5 10.25C19.0858 10.25 18.75 10.5858 18.75 11H20.25ZM9.5 4.25C6.87665 4.25 4.75 6.37665 4.75 9H6.25C6.25 7.20507 7.70507 5.75 9.5 5.75V4.25ZM4.75 9V11H6.25V9H4.75ZM9.5 5.75H15.5V4.25H9.5V5.75ZM15.5 5.75C17.2949 5.75 18.75 7.20507 18.75 9H20.25C20.25 6.37665 18.1234 4.25 15.5 4.25V5.75ZM18.75 9V11H20.25V9H18.75ZM8.75 5V11H10.25V5H8.75ZM9.5 10.25H5.5V11.75H9.5V10.25ZM9.5 11.75H19.5V10.25H9.5V11.75ZM4.75 11V15H6.25V11H4.75ZM4.75 15C4.75 17.6234 6.87665 19.75 9.5 19.75V18.25C7.70507 18.25 6.25 16.7949 6.25 15H4.75ZM9.5 19.75H15.5V18.25H9.5V19.75ZM15.5 19.75C18.1234 19.75 20.25 17.6234 20.25 15H18.75C18.75 16.7949 17.2949 18.25 15.5 18.25V19.75ZM20.25 15V11H18.75V15H20.25Z" fill="currentColor"></path>
                  </svg>
                </div>
                <div className="layout-item-content">
                  <span className="layout-item-title">Multi-Column</span>
                  <span className="layout-item-description">Compare all models side-by-side</span>
                </div>
              </button>

              {/* Option 2: Auto Nothric */}
              <button
                className={`layout-dropdown-item ${activeModels.includes('auto') ? 'active' : ''}`}
                onClick={() => {
                  toggleModel('auto');
                  setIsLayoutDropdownOpen(false);
                }}
                type="button"
              >
                <div className="layout-icon-container">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.978 21.4558L13.6213 21.8413L12.978 21.4558ZM13.4659 20.6417L12.8226 20.2562L13.4659 20.6417ZM10.5341 20.6417L9.89077 21.0272H9.89077L10.5341 20.6417ZM11.022 21.4558L11.6653 21.0703L11.022 21.4558ZM12 4.22224L11.473 3.68863C11.3303 3.82954 11.25 4.02172 11.25 4.22224C11.25 4.42277 11.3303 4.61494 11.473 4.75585L12 4.22224ZM20.25 11.7778C20.25 12.192 20.5858 12.5278 21 12.5278C21.4142 12.5278 21.75 12.192 21.75 11.7778H20.25ZM3.34254 16.5897L4.03418 16.2997H4.03418L3.34254 16.5897ZM8.21062 19.3258L8.19786 20.0757L8.21062 19.3258ZM5.77792 18.9951L5.49394 19.6892H5.49394L5.77792 18.9951ZM20.6575 16.5897L21.3491 16.8798L21.3491 16.8798L20.6575 16.5897ZM15.7893 19.3258L15.7766 18.5759H15.7766L15.7893 19.3258ZM18.2221 18.9951L18.5061 19.6892H18.5061L18.2221 18.9951ZM18.8512 4.87708L18.4629 5.51871L18.8512 4.87708ZM20.3369 6.34439L20.9742 5.94897V5.94897L20.3369 6.34439ZM5.14876 4.87708L4.76041 4.23545H4.76041L5.14876 4.87708ZM3.66312 6.34439L3.02582 5.94897H3.02582L3.66312 6.34439ZM9.66251 19.5199L10.0361 18.8696L10.0361 18.8696L9.66251 19.5199ZM14.777 2.53361C15.0717 2.24254 15.0747 1.76768 14.7836 1.47297C14.4925 1.17827 14.0177 1.17532 13.723 1.46639L14.777 2.53361ZM13.723 6.97809C14.0177 7.26916 14.4925 7.26622 14.7836 6.97151C15.0747 6.67681 15.0717 6.20194 14.777 5.91087L13.723 6.97809ZM9.3023 4.97309C9.71651 4.97182 10.0513 4.63501 10.05 4.2208C10.0487 3.80658 9.71191 3.47183 9.2977 3.4731L9.3023 4.97309ZM21.7365 14.4646C21.7476 14.0506 21.4209 13.7059 21.0068 13.6948C20.5928 13.6837 20.2481 14.0104 20.237 14.4245L21.7365 14.4646ZM13.6213 21.8413L14.1092 21.0272L12.8226 20.2562L12.3347 21.0703L13.6213 21.8413ZM9.89077 21.0272L10.3787 21.8413L11.6653 21.0703L11.1774 20.2562L9.89077 21.0272ZM12.3347 21.0703C12.2671 21.183 12.1458 21.25 12 21.25C11.8541 21.25 11.7329 21.183 11.6653 21.0703L10.3787 21.8413C11.1047 23.0529 12.8952 23.0529 13.6213 21.8413L12.3347 21.0703ZM3.75 12.6667V11.7778H2.25V12.6667H3.75ZM2.25 12.6667C2.25 13.6917 2.24958 14.4985 2.2946 15.1502C2.3401 15.8087 2.43455 16.3639 2.6509 16.8798L4.03418 16.2997C3.908 15.9988 3.83117 15.6279 3.79103 15.0468C3.75042 14.4588 3.75 13.7125 3.75 12.6667H2.25ZM8.22338 18.5759C7.09333 18.5567 6.51282 18.4854 6.06191 18.3009L5.49394 19.6892C6.23158 19.991 7.06826 20.0565 8.19786 20.0757L8.22338 18.5759ZM2.6509 16.8798C3.18531 18.1541 4.20905 19.1636 5.49394 19.6892L6.06191 18.3009C5.14155 17.9244 4.41322 17.2035 4.03418 16.2997L2.6509 16.8798ZM15.8021 20.0757C16.9317 20.0565 17.7684 19.991 18.5061 19.6892L17.9381 18.3009C17.4872 18.4854 16.9067 18.5567 15.7766 18.5759L15.8021 20.0757ZM19.9658 16.2997C19.5868 17.2035 18.8585 17.9244 17.9381 18.3009L18.5061 19.6892C19.791 19.1636 20.8147 18.1541 21.3491 16.8798L19.9658 16.2997ZM12 4.97224C13.4807 4.97224 14.8952 4.97257 16.074 5.05235C16.6621 5.09215 17.1733 5.1507 17.5922 5.23404C18.0215 5.31946 18.3018 5.42118 18.4629 5.51871L19.2396 4.23545C18.8597 4.00551 18.3813 3.86165 17.8849 3.76288C17.378 3.66204 16.7964 3.59781 16.1753 3.55577C14.9354 3.47186 13.4654 3.47224 12 3.47224V4.97224ZM21.75 11.7778C21.75 10.3376 21.7508 9.20415 21.6637 8.29884C21.5754 7.38197 21.3915 6.62164 20.9742 5.94897L19.6996 6.7398C19.9453 7.1359 20.093 7.63739 20.1706 8.44258C20.2492 9.25933 20.25 10.3082 20.25 11.7778H21.75ZM18.4629 5.51871C18.9677 5.82427 19.3913 6.24293 19.6996 6.7398L20.9742 5.94897C20.5404 5.24979 19.9457 4.66284 19.2396 4.23545L18.4629 5.51871ZM3.75 11.7778C3.75 10.3082 3.75081 9.25933 3.82944 8.44258C3.90695 7.63739 4.05466 7.1359 4.30042 6.7398L3.02582 5.94897C2.60846 6.62164 2.42461 7.38197 2.33634 8.29884C2.24919 9.20415 2.25 10.3376 2.25 11.7778H3.75ZM4.76041 4.23545C4.05426 4.66284 3.45964 5.24979 3.02582 5.94897L4.30042 6.7398C4.6087 6.24293 5.03225 5.82427 5.5371 5.51871L4.76041 4.23545ZM11.1774 20.2562C10.9955 19.9526 10.8327 19.6795 10.6738 19.4641C10.5054 19.2359 10.3094 19.0265 10.0361 18.8696L9.28893 20.1702C9.3196 20.1879 9.37008 20.2236 9.46688 20.3548C9.57318 20.4988 9.69425 20.6993 9.89077 21.0272L11.1774 20.2562ZM8.19786 20.0757C8.59427 20.0824 8.841 20.0874 9.02805 20.1078C9.20155 20.1268 9.26024 20.1538 9.28893 20.1702L10.0361 18.8696C9.76085 18.7115 9.47626 18.6479 9.19112 18.6167C8.91953 18.587 8.59228 18.5822 8.22338 18.5759L8.19786 20.0757ZM14.1092 21.0272C14.3057 20.6993 14.4268 20.4988 14.5331 20.3548C14.6299 20.2236 14.6804 20.1879 14.711 20.1702L13.9639 18.8696C13.6906 19.0265 13.4945 19.2359 13.3261 19.4641C13.1672 19.6795 13.0045 19.9526 12.8226 20.2562L14.1092 21.0272ZM15.7766 18.5759C15.4077 18.5822 15.0804 18.587 14.8088 18.6167C14.5237 18.6479 14.2391 18.7115 13.9639 18.8696L14.711 20.1702C14.7397 20.1538 14.7984 20.1268 14.9719 20.1078C15.159 20.0874 15.4057 20.0824 15.8021 20.0757L15.7766 18.5759ZM12.527 4.75585L14.777 2.53361L13.723 1.46639L11.473 3.68863L12.527 4.75585ZM11.473 4.75585L13.723 6.97809L14.777 5.91087L12.527 3.68863L11.473 4.75585ZM9.2977 3.4731C7.0617 3.47995 5.93013 3.52749 4.76041 4.23545L5.5371 5.51871C6.29497 5.06002 6.99727 4.98015 9.3023 4.97309L9.2977 3.4731ZM20.237 14.4245C20.2114 15.3805 20.1349 15.8964 19.9658 16.2997L21.3491 16.8798C21.6333 16.2021 21.7102 15.4457 21.7365 14.4646L20.237 14.4245Z" fill="currentColor"></path>
                  </svg>
                </div>
                <div className="layout-item-content">
                  <span className="layout-item-title">Auto Nothric</span>
                  <span className="layout-item-description">Dynamic background routing</span>
                </div>
              </button>

              {/* Option 3: Single Model */}
              <button
                className={`layout-dropdown-item ${(activeModels.length === 1 && !activeModels.includes('auto')) ? 'active' : ''}`}
                onClick={() => {
                  setIsSingleModelModalOpen(true);
                  setIsLayoutDropdownOpen(false);
                }}
                type="button"
              >
                <div className="layout-icon-container">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="1"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path d="M8 10.5H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                      <path d="M8 14H13.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                      <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>
                    </g>
                  </svg>
                </div>
                <div className="layout-item-content">
                  <span className="layout-item-title">Single Model</span>
                  <span className="layout-item-description">Chat with one model directly</span>
                </div>
              </button>
            </div>
        </div>
      )}

      {/* Temporary Chat Toggle Button */}
      {!hasMessages && (
        <button
          className={`temp-chat-toggle-btn ${isTemporary ? 'active' : ''}`}
          onClick={handleToggleTempChat}
          type="button"
        >
          {isTemporary ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" className="temp-chat-icon">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C12.5523 20 13 20.4477 13 21C13 21.5523 12.5523 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.5523 21.5523 13 21 13C20.4477 13 20 12.5523 20 12C20 7.58172 16.4183 4 12 4ZM23.6139 15.2106C24.0499 15.5497 24.1284 16.178 23.7894 16.6139L19.1227 22.6139C18.9485 22.8379 18.6875 22.9773 18.4045 22.9975C18.1216 23.0177 17.8434 22.9167 17.6392 22.7198L15.3059 20.4698C14.9083 20.0865 14.8968 19.4534 15.2802 19.0559C15.6635 18.6583 16.2966 18.6468 16.6941 19.0302L18.2268 20.5081L22.2106 15.3861C22.5497 14.9501 23.178 14.8716 23.6139 15.2106ZM13 6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13 11.5858V6Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="temp-chat-icon">
              <path d="M12 2a10 10 0 0 1 7.38 16.75" />
              <path d="M12 6v6l4 2" />
              <path d="M2.5 8.875a10 10 0 0 0-.5 3" />
              <path d="M2.83 16a10 10 0 0 0 2.43 3.4" />
              <path d="M4.636 5.235a10 10 0 0 1 .891-.857" />
              <path d="M8.644 21.42a10 10 0 0 0 7.631-.38" />
            </svg>
          )}
          <span className="temp-chat-tooltip">
            {isTemporary ? "Turn off temporary chat" : "Turn on temporary chat"}
          </span>
        </button>
      )}

      {hasMessages ? (
        <>


          <div
            ref={gridRef}
            className={`Main_chat-grid ${isGridScrolling ? 'scrolling' : ''} ${activeModels.includes('auto') ? 'auto-grid-layout' : ''} ${activeModels.length <= 2 ? 'hide-scrollbar' : ''}`}
            style={{ gap: expandedModel ? '0px' : '16px' }}
            onScroll={handleGridScroll}
          >
            {activeModels.map((model, index) => (
              <ModelColumn
                key={model}
                model={model}
                messages={responses[model] || []}
                isExpanded={expandedModel === model}
                isAnyExpanded={expandedModel !== null}
                onToggleExpand={() => handleToggleExpand(model)}
                isStopped={isStopped}
                onTypewriterComplete={(msgId) => handleTypewriterComplete(msgId, model)}
                onPreviewFile={onPreviewFile}
                onRetry={handleRetry}
                onEditMessage={handleEditMessage}
                index={index}
                activeModelsCount={activeModels.length}
              />
            ))}
          </div>

          {/* Input card */}
          <Main_chatInputCard
            prompt={prompt}
            setPrompt={setPrompt}
            attachedFiles={attachedFiles}
            onRemoveFile={handleRemoveFile}
            onFileSelect={handleFileSelect}
            onSend={() => { handleSend(undefined, prompt); setPrompt(''); }}
            onStop={handleStop}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            isResponding={isResponding}
            isRecording={isRecording}
            isProcessingVoice={isProcessingVoice}
            isDictationEnabled={isDictationEnabled}
            onMicClick={handleMicClick}
            canvasRef={canvasRef}
            expandedModel={expandedModel}
            activeModels={activeModels}
            modelsList={modelsList}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            dropdownRef={dropdownRef}
            toggleModel={toggleModel}
          />
        </>
      ) : (
        <div className={`Main_chat-new-chat-container ${isTemporary ? 'temp-mode' : ''}`}>
          <div className="Main_chat-new-chat-brand">
            {isTemporary ? (
              <>
                <h1 key="temp-title" className="Main_chat-new-chat-title">Temporary Chat</h1>
                <p key="temp-subtitle" className="Main_chat-new-chat-subtitle temp-chat">
                  This chat won't appear in history and will not save in our database, data will store in your browser.
                </p>
              </>
            ) : (
              <h1 key="normal-title" className="Main_chat-new-chat-title">{title}</h1>
            )}
          </div>

          <div className="Main_chat-new-chat-input-wrapper">
            <Main_chatInputCard
              prompt={prompt}
              setPrompt={setPrompt}
              attachedFiles={attachedFiles}
              onRemoveFile={handleRemoveFile}
              onFileSelect={handleFileSelect}
              onSend={() => { handleSend(undefined, prompt); setPrompt(''); }}
              onStop={handleStop}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              isResponding={isResponding}
              isRecording={isRecording}
              isProcessingVoice={isProcessingVoice}
              isDictationEnabled={isDictationEnabled}
              onMicClick={handleMicClick}
              canvasRef={canvasRef}
              expandedModel={expandedModel}
              activeModels={activeModels}
              modelsList={modelsList}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              dropdownRef={dropdownRef}
              toggleModel={toggleModel}
              isCentered={true}
            />
          </div>

          {/* Suggestion prompt cards wrapper */}
          <div className="prompt-suggestions-wrapper">
            <div className="prompt-suggestions">
              <button className="prompt-card" onClick={() => handleSuggestionClick('Create landing page')}>
                <svg className="prompt-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 6v8a2 2 0 0 0 2 2h8" />
                  <polyline points="17 13 20 16 17 19" />
                </svg>
                <span className="prompt-text">Create landing page</span>
              </button>

              <button className="prompt-card" onClick={() => handleSuggestionClick('Design logo icon')}>
                <svg className="prompt-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 6v8a2 2 0 0 0 2 2h8" />
                  <polyline points="17 13 20 16 17 19" />
                </svg>
                <span className="prompt-text">Design logo icon</span>
              </button>

              <button className="prompt-card" onClick={() => handleSuggestionClick('Write code helper')}>
                <svg className="prompt-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 6v8a2 2 0 0 0 2 2h8" />
                  <polyline points="17 13 20 16 17 19" />
                </svg>
                <span className="prompt-text">Write code helper</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <SingleModelModal
        isOpen={isSingleModelModalOpen}
        onClose={() => setIsSingleModelModalOpen(false)}
        currentModel={activeModels.length === 1 && !activeModels.includes('auto') ? activeModels[0] : 'gemini'}
        onSelect={(modelId) => setActiveModels([modelId])}
      />
    </div>
  );
}
