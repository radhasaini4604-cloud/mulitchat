import { useState, useEffect } from 'react'
import { Sidebar } from './sidebar/Sidebar/Sidebar'
import { Main_chat } from './Main_chat/chatarea/Main_chat'
import { Imagine } from './imagine/Imagine/Imagine'
import { SummaryController } from './components/SummaryController/SummaryController'
import PrivacyPage from './info/pages/legal/privacy'
import TermsPage from './info/pages/legal/terms'
import NothricCollab from './info/pages/legal/NothricCollab'
import CollabPrivacyPage from './info/pages/legal/collab_privacy'
import EntropyPage from './info/pages/entropy/EntropyPage'
import VectorPage from './info/pages/models/VectorPage'
import MatrixPage from './info/pages/models/MatrixPage'
import ZenithPage from './info/pages/models/ZenithPage'
import EclipsePage from './info/pages/models/EclipsePage'
import Docs from './info/pages/docs/Docs'
import PricingPage from './info/pages/pricing/PricingPage'
import DevPricingPage from './info/pages/dev-pricing/DevPricingPage'
import SupportPage from './info/pages/support/SupportPage'
import CareersPage from './info/pages/careers/CareersPage'
import MissionPage from './info/pages/mission/MissionPage'
import AlignmentPage from './info/pages/alignment/AlignmentPage'
import PartnersPage from './info/pages/partners/PartnersPage'
import ContactPage from './info/pages/contact/ContactPage'
import ChangelogPage from './info/pages/changelog/ChangelogPage'
import CookieSettingsPage from './info/pages/cookies/CookieSettingsPage'
import InfoCheckPage from './info/pages/info-check/InfoCheckPage'
import ApiGuidePage from './info/pages/apiguide/ApiGuidePage'
import ClerkTestPage from './info/pages/clerk-test/ClerkTest'
import PreLoginHome from './prelogin/PreLoginHome'
import HomePage from './info/pages/about-us/AboutUsPage'
import { ProjectsDashboard } from './projects/ProjectsDashboard/ProjectsDashboard'
import GroupChat from './groupchat/GroupChat'
import { useAuth } from './context/AuthContext'
import { FilePreviewPanel } from './components/FilePreviewPanel/FilePreviewPanel'
import { Library } from './components/Library/Library'
import { SharedChatPage } from './Main_chat/SharedChatPage/SharedChatPage'
import { GrainientTest } from './Main_chat/Grainient/GrainientTest'
import TestScroll from './testscroll'
import './App.css'
import './Main_chat/chatarea/Main_chat.css'

function App() {
  const { user, isInitializing } = useAuth()
  const [path, setPath] = useState(window.location.pathname)
  const [showBgBulbs, setShowBgBulbs] = useState(() => localStorage.getItem('settings-show-bg-bulbs') !== 'false')

  useEffect(() => {
    const handleBgBulbsChange = () => {
      setShowBgBulbs(localStorage.getItem('settings-show-bg-bulbs') !== 'false');
    };
    window.addEventListener('settings-bg-bulbs-changed', handleBgBulbsChange);
    return () => {
      window.removeEventListener('settings-bg-bulbs-changed', handleBgBulbsChange);
    };
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const currentTheme = localStorage.getItem('settings-theme') || 'dark';
      let themeToApply = currentTheme;
      if (currentTheme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeToApply = prefersDark ? 'dark' : 'light';
      }

      if (themeToApply === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    };

    applyTheme();

    window.addEventListener('settings-theme-changed', applyTheme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', applyTheme);
    } else {
      mediaQuery.addListener(applyTheme);
    }

    return () => {
      window.removeEventListener('settings-theme-changed', applyTheme);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', applyTheme);
      } else {
        mediaQuery.removeListener(applyTheme);
      }
    };
  }, []);

  // Global keyboard shortcuts for theme switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        if (e.key === 'L' || e.key === 'l') {
          e.preventDefault();
          localStorage.setItem('settings-theme', 'light');
          window.dispatchEvent(new Event('settings-theme-changed'));
        } else if (e.key === 'D' || e.key === 'd') {
          e.preventDefault();
          localStorage.setItem('settings-theme', 'dark');
          window.dispatchEvent(new Event('settings-theme-changed'));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const accentsInfo: Record<string, { bg: string; text: string }> = {
      'soft-grey': { bg: '#a1a1aa', text: '#ffffff' },
      'soft-pink': { bg: '#f472b6', text: '#ffffff' },
      'soft-blue': { bg: '#60a5fa', text: '#ffffff' },
      'purple': { bg: '#a78bfa', text: '#ffffff' },
      'red': { bg: '#f87171', text: '#ffffff' },
      'black': { bg: '#18181b', text: '#ffffff' },
      'orange': { bg: '#fb923c', text: '#ffffff' },
      'yellow': { bg: '#facc15', text: '#111827' }
    };

    const applyAccentColor = () => {
      const currentAccent = localStorage.getItem('settings-accent-color') || 'soft-grey';
      const info = accentsInfo[currentAccent] || accentsInfo['soft-grey'];
      document.documentElement.style.setProperty('--accent', info.bg);
      document.documentElement.style.setProperty('--accent-text', info.text);
    };

    applyAccentColor();
    window.addEventListener('settings-accent-changed', applyAccentColor);
    return () => {
      window.removeEventListener('settings-accent-changed', applyAccentColor);
    };
  }, []);

  const [currentView, setCurrentView] = useState<'Main_chat' | 'imagine' | 'projects' | 'groupchat' | 'library'>(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '/Main_chat' || path.startsWith('/c/')) return 'Main_chat';
    if (path === '/imagine') return 'imagine';
    if (path === '/projects') return 'projects';
    if (path === '/groupchat' || path.startsWith('/groupchat/')) return 'groupchat';
    if (path === '/library') return 'library';
    return (sessionStorage.getItem('currentView') as 'Main_chat' | 'imagine' | 'projects' | 'groupchat' | 'library') || 'Main_chat';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('isSidebarCollapsed') === 'true';
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/c/')) {
      const id = path.substring('/c/'.length);
      return id || null;
    }
    if (path === '/' || path === '/Main_chat' || path === '/chat') {
      return null;
    }
    return sessionStorage.getItem('activeSessionId') || null;
  });
  const [chatKey, setChatKey] = useState(0)
  const [activePreviewFile, setActivePreviewFile] = useState<any | null>(null)

  useEffect(() => {
    setActivePreviewFile(null);
  }, [currentView, activeSessionId]);

  useEffect(() => {
    if (currentView !== 'Main_chat') {
      sessionStorage.removeItem('Main_chat_temp_chat');
      localStorage.removeItem('Main_chat_temp_chat');
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView === 'imagine') {
      document.title = 'Imagine - Nothric';
    } else if (currentView === 'projects') {
      document.title = 'Projects - Nothric';
    } else if (currentView === 'groupchat') {
      document.title = 'Group Chat - Nothric';
    } else if (currentView === 'library') {
      document.title = 'Library - Nothric';
    } else if (currentView === 'Main_chat') {
      document.title = activeSessionId ? 'Chat - Nothric' : 'Nothric';
    }
  }, [currentView, activeSessionId]);

  useEffect(() => {
    sessionStorage.setItem('currentView', currentView);

    const currentPath = window.location.pathname;
    const isStandalonePath =
      currentPath.startsWith('/share/c/') ||
      currentPath === '/grainient' ||
      currentPath === '/testscroll' ||
      currentPath === '/privacy' ||
      currentPath === '/terms' ||
      currentPath === '/collab-info' ||
      currentPath === '/collab-privacy' ||
      currentPath === '/gemini' ||
      currentPath === '/entropy' ||
      currentPath === '/gpt' ||
      currentPath === '/vector' ||
      currentPath === '/qwen' ||
      currentPath === '/matrix' ||
      currentPath === '/mistral' ||
      currentPath === '/zenith' ||
      currentPath === '/cohere' ||
      currentPath === '/eclipse' ||
      currentPath.startsWith('/docs') ||
      currentPath === '/pricing' ||
      currentPath === '/developers/pricing' ||
      currentPath === '/support' ||
      currentPath === '/careers' ||
      currentPath === '/partners' ||
      currentPath === '/contact' ||
      currentPath === '/changelog' ||
      currentPath === '/cookies' ||
      currentPath === '/mission' ||
      currentPath === '/alignment' ||
      currentPath === '/clerk-test' ||
      currentPath === '/api-guide' ||
      currentPath === '/info-check';

    if (isStandalonePath) {
      return;
    }

    let targetPath = '/';
    if (currentView === 'imagine') {
      targetPath = '/imagine';
    } else if (currentView === 'projects') {
      targetPath = '/projects';
    } else if (currentView === 'groupchat') {
      targetPath = currentPath.startsWith('/groupchat') ? currentPath : '/groupchat';
    } else if (currentView === 'library') {
      targetPath = '/library';
    } else if (currentView === 'Main_chat') {
      if (activeSessionId) {
        targetPath = `/c/${activeSessionId}`;
      } else {
        targetPath = '/';
      }
    }

    if (currentPath !== targetPath) {
      const searchToKeep = (currentView === 'groupchat' && currentPath.startsWith('/groupchat')) ? window.location.search : '';
      window.history.pushState({ activeSessionId, currentView }, '', targetPath + searchToKeep);
      setPath(targetPath);
    }
  }, [currentView, activeSessionId]);

  useEffect(() => {
    localStorage.setItem('isSidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (activeSessionId) {
      sessionStorage.setItem('activeSessionId', activeSessionId)
    } else {
      sessionStorage.removeItem('activeSessionId')
    }
  }, [activeSessionId])

  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      setPath(currentPath);

      if (currentPath.startsWith('/c/')) {
        const sessionId = currentPath.substring('/c/'.length);
        if (sessionId) {
          setActiveSessionId(sessionId);
          setCurrentView('Main_chat');
        }
      } else if (currentPath === '/' || currentPath === '/Main_chat' || currentPath === '/chat') {
        setActiveSessionId(null);
        setCurrentView('Main_chat');
      } else if (currentPath === '/imagine') {
        setCurrentView('imagine');
      } else if (currentPath === '/projects') {
        setCurrentView('projects');
      } else if (currentPath.startsWith('/groupchat')) {
        setCurrentView('groupchat');
      } else if (currentPath === '/library') {
        setCurrentView('library');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [])

  // Scroll to top automatically when navigation path changes
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.querySelectorAll('*').forEach((el) => {
        if (el.closest('.docs-sidebar') || el.closest('.sidebar') || el.closest('aside')) {
          return;
        }
        if (el.scrollTop > 0) {
          el.scrollTop = 0;
        }
      });
    };

    scrollToTop();
    // Run on a short delay to handle components that render asynchronously
    const timer = setTimeout(scrollToTop, 50);
    return () => clearTimeout(timer);
  }, [path])

  useEffect(() => {
    if (activeSessionId) {
      setCurrentView('Main_chat');
    }
  }, [activeSessionId])





  if (isInitializing && !user) {
    return <div className="Main_chat-container" style={{ height: '100vh' }} />;
  }

  const isStandaloneOrInfoPage =
    path.startsWith('/share/c/') ||
    path === '/grainient' ||
    path === '/testscroll' ||
    path === '/privacy' ||
    path === '/terms' ||
    path === '/collab-info' ||
    path === '/collab-privacy' ||
    path === '/gemini' ||
    path === '/entropy' ||
    path === '/gpt' ||
    path === '/vector' ||
    path === '/qwen' ||
    path === '/matrix' ||
    path === '/mistral' ||
    path === '/zenith' ||
    path === '/cohere' ||
    path === '/eclipse' ||
    path.startsWith('/docs') ||
    path === '/pricing' ||
    path === '/developers/pricing' ||
    path === '/support' ||
    path === '/careers' ||
    path === '/partners' ||
    path === '/contact' ||
    path === '/changelog' ||
    path === '/cookies' ||
    path === '/mission' ||
    path === '/alignment' ||
    path === '/clerk-test' ||
    path === '/api-guide' ||
    path === '/info-check';

  const renderPage = (el: React.ReactNode) => (
    <div key={path} className="page-entrance-wrapper">
      {el}
    </div>
  );

  if (path === '/old-home' || path === '/about-us') {
    return renderPage(<HomePage />)
  }

  if (!user && !isStandaloneOrInfoPage) {
    return renderPage(<PreLoginHome />);
  }

  if (path.startsWith('/share/c/')) {
    const sessionId = path.substring('/share/c/'.length);
    return renderPage(<SharedChatPage sessionId={sessionId} />);
  }

  if (path === '/grainient') {
    return renderPage(<GrainientTest />);
  }

  if (path === '/testscroll') {
    return renderPage(<TestScroll />)
  }

  // If the pathname matches one of our custom info/model pages, render it standalone
  if (path === '/home') {
    return renderPage(<PreLoginHome />)
  }
  if (path === '/privacy') {
    return renderPage(<PrivacyPage />)
  }
  if (path === '/terms') {
    return renderPage(<TermsPage />)
  }
  if (path === '/collab-info') {
    return renderPage(<NothricCollab />)
  }
  if (path === '/collab-privacy') {
    return renderPage(<CollabPrivacyPage />)
  }
  if (path === '/gemini' || path === '/entropy') {
    return renderPage(<EntropyPage />)
  }
  if (path === '/gpt' || path === '/vector') {
    return renderPage(<VectorPage />)
  }
  if (path === '/qwen' || path === '/matrix') {
    return renderPage(<MatrixPage />)
  }
  if (path === '/mistral' || path === '/zenith') {
    return renderPage(<ZenithPage />)
  }
  if (path === '/cohere' || path === '/eclipse') {
    return renderPage(<EclipsePage />)
  }
  if (path.startsWith('/docs')) {
    return (
      <div key="/docs" className="page-entrance-wrapper">
        <Docs currentPath={path} />
      </div>
    )
  }
  if (path === '/pricing') {
    return renderPage(<PricingPage />)
  }
  if (path === '/developers/pricing') {
    return renderPage(<DevPricingPage />)
  }
  if (path === '/support') {
    return renderPage(<SupportPage />)
  }
  if (path === '/careers') {
    return renderPage(<CareersPage />)
  }
  if (path === '/mission') {
    return renderPage(<MissionPage />)
  }
  if (path === '/alignment') {
    return renderPage(<AlignmentPage />)
  }
  if (path === '/api-guide') {
    return renderPage(<ApiGuidePage />)
  }
  if (path === '/partners') {
    return renderPage(<PartnersPage />)
  }
  if (path === '/contact') {
    return renderPage(<ContactPage />)
  }
  if (path === '/changelog') {
    return renderPage(<ChangelogPage />)
  }
  if (path === '/cookies') {
    return renderPage(<CookieSettingsPage />)
  }
  if (path === '/info-check') {
    return renderPage(<InfoCheckPage />)
  }
  if (path === '/clerk-test') {
    return renderPage(<ClerkTestPage />)
  }

  // Otherwise, render the main layout with sidebar

  return (
    <div className={`app-main-layout ${currentView === 'groupchat' ? 'groupchat-mode' : ''}`} style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {showBgBulbs && (
        <div className="Main_chat-bg-glow-container">
          <div className="bg-glow-bulb bulb-blue" />
          <div className="bg-glow-bulb bulb-violet" />
          <div className="bg-glow-bulb bulb-amber" />
        </div>
      )}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onNewChat={() => {
          setActiveSessionId(null);
          sessionStorage.removeItem('Main_chat_temp_chat');
          localStorage.removeItem('Main_chat_temp_chat');
          setChatKey(prev => prev + 1);
        }}
        activeSessionId={activeSessionId}
        setActiveSessionId={setActiveSessionId}
      />
      {currentView === 'imagine' ? (
        <Imagine />
      ) : currentView === 'projects' ? (
        <ProjectsDashboard
          setActiveSessionId={setActiveSessionId}
          setCurrentView={setCurrentView}
        />
      ) : currentView === 'groupchat' ? (
        <GroupChat />
      ) : currentView === 'library' ? (
        <Library onPreviewFile={setActivePreviewFile} />
      ) : (
        <Main_chat
          key={chatKey}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          onPreviewFile={setActivePreviewFile}
        />
      )}
      {activePreviewFile && (
        <FilePreviewPanel
          file={activePreviewFile}
          onClose={() => setActivePreviewFile(null)}
        />
      )}
      <SummaryController />
    </div>
  )
}

export default App


