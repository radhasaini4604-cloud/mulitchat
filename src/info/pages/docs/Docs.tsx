import { useState, useEffect, useRef } from 'react';
import { DocsWelcome } from './components/get-started/DocsWelcome';
import { DocsQuickstart } from './components/get-started/DocsQuickstart';
import { DocsModels } from './components/get-started/DocsModels';
import { DocsPricing } from './components/get-started/DocsPricing';
import { DocsReleaseNotes } from './components/get-started/DocsReleaseNotes';
import { DocsApiGuide } from './components/configuration/DocsApiGuide';
import { DocsRateLimits } from './components/configuration/DocsRateLimits';
import { DocsMain_chatIntro } from './components/Main_chat/DocsMain_chatIntro';
import { DocsMain_chatFeatures } from './components/Main_chat/DocsMain_chatFeatures';
import { DocsMain_chatLimitations } from './components/Main_chat/DocsMain_chatLimitations';
import { DocsImagineOverview } from './components/imagine/DocsImagineOverview';
import { DocsImagineGeneration } from './components/imagine/DocsImagineGeneration';
import { DocsImagineTools } from './components/imagine/DocsImagineTools';
import { DocsCollabOverview } from './components/collab/DocsCollabOverview';
import { DocsCollabWorkspaces } from './components/collab/DocsCollabWorkspaces';
import { DocsCollabPermissions } from './components/collab/DocsCollabPermissions';
import { DocsAutoOverview } from './components/auto/DocsAutoOverview';
import { DocsAutoHowItWorks } from './components/auto/DocsAutoHowItWorks';
import { DocsFaqGeneral } from './components/faq/DocsFaqGeneral';
import { DocsFaqPrivacy } from './components/faq/DocsFaqPrivacy';
import { DocsFaqTerms } from './components/faq/DocsFaqTerms';
import './Docs.css';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: "en"
        }, "google_translate_element");
      }
    };

    const addScript = () => {
      const id = "google-translate-script";
      if (document.getElementById(id)) {
        setTimeout(() => {
          if (window.google && window.google.translate) {
            try {
              window.googleTranslateElementInit();
            } catch (e) {
              console.error(e);
            }
          }
        }, 150);
        return;
      }

      const script = document.createElement("script");
      script.id = id;
      script.type = "text/javascript";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    };

    addScript();

    // Check if Google Translate widget has fully rendered its select combo dropdown
    const checkInterval = setInterval(() => {
      if (document.querySelector('.goog-te-combo')) {
        setIsLoaded(true);
        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, []);

  return (
    <div className="docs-google-translate-wrapper">
      {!isLoaded && (
        <select className="docs-dummy-translate-select" disabled>
          <option>Select Language</option>
        </select>
      )}
      <div
        id="google_translate_element"
        className="docs-google-translate-container"
        style={{ display: isLoaded ? 'inline-block' : 'none' }}
      />
      <svg className="docs-translate-down-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
};

type SectionType =
  | 'welcome'
  | 'quickstart'
  | 'models'
  | 'pricing'
  | 'release_notes'
  | 'api_guide'
  | 'rate_limits'
  | 'Main_chat_introduction'
  | 'Main_chat_features'
  | 'Main_chat_limitations'
  | 'imagine_overview'
  | 'imagine_generation'
  | 'imagine_tools'
  | 'collab_overview'
  | 'collab_workspaces'
  | 'collab_permissions'
  | 'auto_overview'
  | 'auto_how_it_works'
  | 'faq_general'
  | 'faq_privacy'
  | 'faq_terms';

const sectionPathMap: Record<string, SectionType> = {
  '/docs': 'welcome',
  '/docs/welcome': 'welcome',
  '/docs/quickstart': 'quickstart',
  '/docs/models': 'models',
  '/docs/pricing': 'pricing',
  '/docs/release-notes': 'release_notes',
  '/docs/api-guide': 'api_guide',
  '/docs/rate-limits': 'rate_limits',
  '/docs/Main_chat-introduction': 'Main_chat_introduction',
  '/docs/Main_chat-features': 'Main_chat_features',
  '/docs/Main_chat-limitations': 'Main_chat_limitations',
  '/docs/imagine-overview': 'imagine_overview',
  '/docs/imagine-generation': 'imagine_generation',
  '/docs/imagine-tools': 'imagine_tools',
  '/docs/collab-overview': 'collab_overview',
  '/docs/collab-workspaces': 'collab_workspaces',
  '/docs/collab-permissions': 'collab_permissions',
  '/docs/auto-overview': 'auto_overview',
  '/docs/auto-how-it-works': 'auto_how_it_works',
  '/docs/faq-general': 'faq_general',
  '/docs/faq-privacy': 'faq_privacy',
  '/docs/faq-terms': 'faq_terms'
};

const sectionToPath: Record<SectionType, string> = {
  welcome: '/docs/welcome',
  quickstart: '/docs/quickstart',
  models: '/docs/models',
  pricing: '/docs/pricing',
  release_notes: '/docs/release-notes',
  api_guide: '/docs/api-guide',
  rate_limits: '/docs/rate-limits',
  Main_chat_introduction: '/docs/Main_chat-introduction',
  Main_chat_features: '/docs/Main_chat-features',
  Main_chat_limitations: '/docs/Main_chat-limitations',
  imagine_overview: '/docs/imagine-overview',
  imagine_generation: '/docs/imagine-generation',
  imagine_tools: '/docs/imagine-tools',
  collab_overview: '/docs/collab-overview',
  collab_workspaces: '/docs/collab-workspaces',
  collab_permissions: '/docs/collab-permissions',
  auto_overview: '/docs/auto-overview',
  auto_how_it_works: '/docs/auto-how-it-works',
  faq_general: '/docs/faq-general',
  faq_privacy: '/docs/faq-privacy',
  faq_terms: '/docs/faq-terms'
};

const navigationPathMap: Record<string, string> = {
  '/collab-shared-workspaces': '/docs/collab-workspaces',
  '/collab-permissions': '/docs/collab-permissions',
  '/collab-overview': '/docs/collab-overview',
  '/limitations': '/docs/Main_chat-limitations',
  '/features': '/docs/Main_chat-features',
  '/image-generation': '/docs/imagine-generation',
  '/imagine-tools': '/docs/imagine-tools',
  '/terms': '/docs/faq-terms',
  '/privacy': '/docs/faq-privacy',
  '/docs/auto-overview': '/docs/auto-overview',
  '/docs/auto-how-it-works': '/docs/auto-how-it-works'
};

interface DocsProps {
  currentPath?: string;
}

export default function Docs({ currentPath }: DocsProps = {}) {
  const handleNavigate = (path: string) => {
    const targetPath = navigationPathMap[path] || path;
    if (window.navigate) {
      window.navigate(targetPath);
    } else {
      window.location.href = targetPath;
    }
  };

  const getInitialSection = (): SectionType => {
    const pathname = currentPath || window.location.pathname;
    return sectionPathMap[pathname] || 'welcome';
  };

  const [activeSection, setActiveSection] = useState<SectionType>(getInitialSection);
  const sidebarRef = useRef<HTMLElement>(null);

  // Restore sidebar scroll position on mount/remount
  useEffect(() => {
    const savedScrollTop = sessionStorage.getItem('docs_sidebar_scroll');
    if (savedScrollTop && sidebarRef.current) {
      sidebarRef.current.scrollTop = parseInt(savedScrollTop, 10);
    }
  }, []);

  // Dynamic document title
  useEffect(() => {
    const sectionTitles: Record<SectionType, string> = {
      welcome: 'Welcome',
      quickstart: 'Quickstart',
      models: 'Models',
      pricing: 'Pricing',
      release_notes: 'Release Notes',
      api_guide: 'API Setup',
      rate_limits: 'Rate Limits',
      Main_chat_introduction: 'Main_chat Introduction',
      Main_chat_features: 'Main_chat Features',
      Main_chat_limitations: 'Main_chat Limitations',
      imagine_overview: 'Imagine Overview',
      imagine_generation: 'Imagine Generation',
      imagine_tools: 'Imagine Tools',
      collab_overview: 'Collab Overview',
      collab_workspaces: 'Collab Workspaces',
      collab_permissions: 'Collab Permissions',
      auto_overview: 'Auto Nothric Overview',
      auto_how_it_works: 'How Auto Nothric Works',
      faq_general: 'General FAQ',
      faq_privacy: 'Privacy FAQ',
      faq_terms: 'Terms FAQ'
    };
    const displayName = sectionTitles[activeSection] || 'Documentation';
    document.title = `${displayName} | Nothric Docs`;
  }, [activeSection]);

  const handleSidebarScroll = () => {
    if (sidebarRef.current) {
      sessionStorage.setItem('docs_sidebar_scroll', String(sidebarRef.current.scrollTop));
    }
  };

  useEffect(() => {
    const pathname = currentPath || window.location.pathname;
    const targetSection = sectionPathMap[pathname];
    if (targetSection && targetSection !== activeSection) {
      setActiveSection(targetSection);
    }
  }, [currentPath]);

  useEffect(() => {
    // Scroll content container to top
    const mainEl = document.querySelector('.docs-main-content');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    // Sync URL path
    const targetPath = sectionToPath[activeSection];
    if (window.location.pathname !== targetPath) {
      if (window.navigate) {
        window.navigate(targetPath);
      } else {
        window.history.pushState({}, '', targetPath);
      }
    }
  }, [activeSection]);

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (window.navigate) {
      window.navigate(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="docs-workspace-container">
      {/* SpaceX / Grok Style Sticky Header */}
      <header className="docs-header">
        <div className="docs-header-left">
          <a href="/home" onClick={(e) => handleNavClick('/home', e)} className="docs-brand-logo">
            <img src="/logo.svg" alt="Nothric Logo" />
            <span>Nothric</span>
          </a>
        </div>

        <div className="docs-nav-selector">
          <span>Documentation</span>
        </div>

        <div className="docs-header-right">
          <div className="docs-search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="docs-search-placeholder">Search Docs</span>
            <span className="docs-search-shortcut">⌘K</span>
          </div>

          <GoogleTranslate />

          <a href="/Main_chat" onClick={(e) => handleNavClick('/Main_chat', e)} className="docs-console-btn">
            <span>Go to Chat</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>
      </header>

      {/* Workspace Body */}
      <div className="docs-body">
        {/* Left Sidebar Menu */}
        <aside className="docs-sidebar" ref={sidebarRef} onScroll={handleSidebarScroll}>
          <div className="docs-sidebar-top-section">
            {/* 1. Get Started */}
            <div className="docs-sidebar-section">
              <h3 className="docs-sidebar-section-title">Get Started</h3>
              <ul className="docs-sidebar-links">
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'welcome' ? 'active' : ''}`}
                    onClick={() => setActiveSection('welcome')}
                  >
                    Welcome
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'quickstart' ? 'active' : ''}`}
                    onClick={() => setActiveSection('quickstart')}
                  >
                    Quick Start
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'models' ? 'active' : ''}`}
                    onClick={() => setActiveSection('models')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Models
                      <span className="docs-badge new">New</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'pricing' ? 'active' : ''}`}
                    onClick={() => setActiveSection('pricing')}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'release_notes' ? 'active' : ''}`}
                    onClick={() => setActiveSection('release_notes')}
                  >
                    Release Notes
                  </a>
                </li>
              </ul>
            </div>

            {/* 2. Configuration */}
            <div className="docs-sidebar-section">
              <h3 className="docs-sidebar-section-title">Configuration</h3>
              <ul className="docs-sidebar-links">
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'api_guide' ? 'active' : ''}`}
                    onClick={() => setActiveSection('api_guide')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      API Guide
                      <span className="docs-badge latest">Latest</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'rate_limits' ? 'active' : ''}`}
                    onClick={() => setActiveSection('rate_limits')}
                  >
                    Rate Limits
                  </a>
                </li>
              </ul>
            </div>

            {/* 3. Main_chat Chat */}
            <div className="docs-sidebar-section">
              <h3 className="docs-sidebar-section-title">Main_chat Chat</h3>
              <ul className="docs-sidebar-links">
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'Main_chat_introduction' ? 'active' : ''}`}
                    onClick={() => setActiveSection('Main_chat_introduction')}
                  >
                    Introduction
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'Main_chat_features' ? 'active' : ''}`}
                    onClick={() => setActiveSection('Main_chat_features')}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'Main_chat_limitations' ? 'active' : ''}`}
                    onClick={() => setActiveSection('Main_chat_limitations')}
                  >
                    Limitations
                  </a>
                </li>
              </ul>
            </div>

            {/* 4. Imagine */}
            <div className="docs-sidebar-section">
              <h3 className="docs-sidebar-section-title">Imagine</h3>
              <ul className="docs-sidebar-links">
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'imagine_overview' ? 'active' : ''}`}
                    onClick={() => setActiveSection('imagine_overview')}
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'imagine_generation' ? 'active' : ''}`}
                    onClick={() => setActiveSection('imagine_generation')}
                  >
                    Image Generation
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'imagine_tools' ? 'active' : ''}`}
                    onClick={() => setActiveSection('imagine_tools')}
                  >
                    Tools
                  </a>
                </li>
              </ul>
            </div>

            {/* 5. Collab */}
            <div className="docs-sidebar-section">
              <h3 className="docs-sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Collab
                <span className="docs-badge new" style={{ textTransform: 'none', letterSpacing: 'normal', fontSize: '9px', padding: '1px 4px' }}>New</span>
              </h3>
              <ul className="docs-sidebar-links">
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'collab_overview' ? 'active' : ''}`}
                    onClick={() => setActiveSection('collab_overview')}
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'collab_workspaces' ? 'active' : ''}`}
                    onClick={() => setActiveSection('collab_workspaces')}
                  >
                    Shared Workspaces
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'collab_permissions' ? 'active' : ''}`}
                    onClick={() => setActiveSection('collab_permissions')}
                  >
                    Permissions
                  </a>
                </li>
              </ul>
            </div>

            <div className="docs-sidebar-section">
              <h3 className="docs-sidebar-section-title">Auto Nothric</h3>
              <ul className="docs-sidebar-links">
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'auto_overview' ? 'active' : ''}`}
                    onClick={() => setActiveSection('auto_overview')}
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'auto_how_it_works' ? 'active' : ''}`}
                    onClick={() => setActiveSection('auto_how_it_works')}
                  >
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            <div className="docs-sidebar-section">
              <h3 className="docs-sidebar-section-title">FAQ</h3>
              <ul className="docs-sidebar-links">
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'faq_general' ? 'active' : ''}`}
                    onClick={() => setActiveSection('faq_general')}
                  >
                    General
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'faq_privacy' ? 'active' : ''}`}
                    onClick={() => setActiveSection('faq_privacy')}
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    className={`docs-sidebar-item ${activeSection === 'faq_terms' ? 'active' : ''}`}
                    onClick={() => setActiveSection('faq_terms')}
                  >
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </aside>

        {/* Main Content Area */}
        <main className="docs-main-content">
          <div className="docs-content-container">
            {activeSection === 'welcome' && (
              <DocsWelcome onNavigate={(path) => {
                if (window.navigate) {
                  window.navigate(path);
                } else {
                  window.location.href = path;
                }
              }} />
            )}

            {activeSection === 'quickstart' && (
              <DocsQuickstart onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'models' && (
              <DocsModels onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'pricing' && (
              <DocsPricing onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'release_notes' && (
              <DocsReleaseNotes onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'api_guide' && (
              <DocsApiGuide onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'rate_limits' && (
              <DocsRateLimits onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'Main_chat_introduction' && (
              <DocsMain_chatIntro onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else if (path === '/features') {
                  setActiveSection('Main_chat_features');
                } else if (path === '/limitations') {
                  setActiveSection('Main_chat_limitations');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'Main_chat_features' && (
              <DocsMain_chatFeatures onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else if (path === '/limitations') {
                  setActiveSection('Main_chat_limitations');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'Main_chat_limitations' && (
              <DocsMain_chatLimitations onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'imagine_overview' && (
              <DocsImagineOverview onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else if (path === '/image-generation') {
                  setActiveSection('imagine_generation');
                } else if (path === '/imagine-tools') {
                  setActiveSection('imagine_tools');
                } else if (path === '/Main_chat') {
                  setActiveSection('Main_chat_introduction');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'imagine_generation' && (
              <DocsImagineGeneration onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else if (path === '/imagine-tools') {
                  setActiveSection('imagine_tools');
                } else if (path === '/collab-overview') {
                  setActiveSection('collab_overview');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'imagine_tools' && (
              <DocsImagineTools onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else if (path === '/collab-overview') {
                  setActiveSection('collab_overview');
                } else if (path === '/collab-shared-workspaces') {
                  setActiveSection('collab_workspaces');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'collab_overview' && (
              <DocsCollabOverview onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else if (path === '/collab-shared-workspaces') {
                  setActiveSection('collab_workspaces');
                } else if (path === '/collab-permissions') {
                  setActiveSection('collab_permissions');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'collab_workspaces' && (
              <DocsCollabWorkspaces onNavigate={(path) => {
                if (path === '/api-guide') {
                  setActiveSection('api_guide');
                } else if (path === '/collab-permissions') {
                  setActiveSection('collab_permissions');
                } else if (path === '/privacy') {
                  setActiveSection('faq_privacy');
                } else {
                  if (window.navigate) {
                    window.navigate(path);
                  } else {
                    window.location.href = path;
                  }
                }
              }} />
            )}

            {activeSection === 'collab_permissions' && (
              <DocsCollabPermissions onNavigate={handleNavigate} />
            )}

            {activeSection === 'auto_overview' && (
              <DocsAutoOverview onNavigate={handleNavigate} />
            )}

            {activeSection === 'auto_how_it_works' && (
              <DocsAutoHowItWorks onNavigate={handleNavigate} />
            )}

            {activeSection === 'faq_general' && (
              <DocsFaqGeneral onNavigate={handleNavigate} />
            )}

            {activeSection === 'faq_privacy' && (
              <DocsFaqPrivacy onNavigate={handleNavigate} />
            )}

            {activeSection === 'faq_terms' && (
              <DocsFaqTerms onNavigate={handleNavigate} />
            )}

            {/* Placeholder sections that we will fill up one-by-one in subsequent steps */}
            {activeSection !== 'welcome' && activeSection !== 'quickstart' && activeSection !== 'models' && activeSection !== 'pricing' && activeSection !== 'release_notes' && activeSection !== 'api_guide' && activeSection !== 'rate_limits' && activeSection !== 'Main_chat_introduction' && activeSection !== 'Main_chat_features' && activeSection !== 'Main_chat_limitations' && activeSection !== 'imagine_overview' && activeSection !== 'imagine_generation' && activeSection !== 'imagine_tools' && activeSection !== 'collab_overview' && activeSection !== 'collab_workspaces' && activeSection !== 'collab_permissions' && activeSection !== 'auto_overview' && activeSection !== 'auto_how_it_works' && activeSection !== 'faq_general' && activeSection !== 'faq_privacy' && activeSection !== 'faq_terms' && (
              <div style={{ padding: '40px 0', textAlign: 'left' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: '#ffffff' }}>
                  {(activeSection as string).split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Documentation
                </h1>
                <p style={{ color: '#a1a1aa', fontSize: '1rem', lineHeight: '1.6' }}>
                  This section is being compiled. Please select another tab in the sidebar index or configure keys in the welcome workspace preview.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
