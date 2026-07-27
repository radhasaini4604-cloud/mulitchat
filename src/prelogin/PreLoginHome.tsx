import { useState, useEffect } from 'react';
import { AuthModal } from '../components/AuthModal/AuthModal';
import TimelineSection from './TimelineSection';
import LandingFooter from '../info/components/Footer';
import ComparisonGraphs from './ComparisonGraphs';
import GlobeSection from './GlobeSection';
import FaqSection from './FaqSection';
import FeatureCards from './FeatureCards';
import { FloatingDock, type DockItem } from '../components/FloatingDock/FloatingDock';
import { IconHome, IconMail, IconHistory } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';
import 'lenis/dist/lenis.css';
import './PreLoginHome.css';

export default function PreLoginHome() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [enginesCount, setEnginesCount] = useState(0);
  const [latencyCount, setLatencyCount] = useState(0);
  const [savingsCount, setSavingsCount] = useState(0);
  const [scaleQueriesCount, setScaleQueriesCount] = useState(0);

  const [activeFeature, setActiveFeature] = useState<'chat' | 'imagine' | 'collab' | 'compare'>('chat');
  const [showStickyNav, setShowStickyNav] = useState(false);

  // Grok-style smooth card magnetic scroll controller
  useEffect(() => {
    // Lenis smooth scroll disabled to enforce native CSS position: sticky
    return () => {};
  }, []);

  const dockItems: DockItem[] = [
    {
      title: "Home",
      icon: <IconHome strokeWidth={1.5} style={{ width: '100%', height: '100%' }} />,
      href: "/",
      onClick: (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      title: "Doc",
      icon: (
        <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M9.808 4.00001H15.329C15.3863 4.00001 15.4433 4.00367 15.5 4.01101C17.7473 4.16817 19.4924 6.0332 19.5 8.28601V14.715C19.4917 17.0871 17.5641 19.0044 15.192 19H9.808C7.43551 19.0044 5.50772 17.0865 5.5 14.714V8.28601C5.50772 5.91353 7.43551 3.99558 9.808 4.00001Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19.5 9.03599C19.9142 9.03599 20.25 8.7002 20.25 8.28599C20.25 7.87177 19.9142 7.53599 19.5 7.53599V9.03599ZM15.5 8.28599H14.75C14.75 8.7002 15.0858 9.03599 15.5 9.03599V8.28599ZM16.25 4.01099C16.25 3.59677 15.9142 3.26099 15.5 3.26099C15.0858 3.26099 14.75 3.59677 14.75 4.01099H16.25ZM14.5 12.75C14.9142 12.75 15.25 12.4142 15.25 12C15.25 11.5858 14.9142 11.25 14.5 11.25V12.75ZM8.5 11.25C8.08579 11.25 7.75 11.5858 7.75 12C7.75 12.4142 8.08579 12.75 8.5 12.75V11.25ZM11.5 9.74999C11.9142 9.74999 12.25 9.4142 12.25 8.99999C12.25 8.58577 11.9142 8.24999 11.5 8.24999V9.74999ZM8.5 8.24999C8.08579 8.24999 7.75 8.58577 7.75 8.99999C7.75 9.4142 8.08579 9.74999 8.5 9.74999V8.24999ZM15.5 15.75C15.9142 15.75 16.25 15.4142 16.25 15C16.25 14.5858 15.9142 14.25 15.5 14.25V15.75ZM8.5 14.25C8.08579 14.25 7.75 14.5858 7.75 15C7.75 15.4142 8.08579 15.75 8.5 15.75V14.25ZM19.5 7.53599H15.5V9.03599H19.5V7.53599ZM16.25 8.28599V4.01099H14.75V8.28599H16.25ZM14.5 11.25H8.5V12.75H14.5V11.25ZM11.5 8.24999H8.5V9.74999H11.5V8.24999ZM15.5 14.25H8.5V15.75H15.5V14.25Z" fill="currentColor" />
        </svg>
      ),
      href: "/docs",
      onClick: (e) => {
        e.preventDefault();
        if (window.navigate) window.navigate('/docs');
        else window.location.href = '/docs';
      },
    },
    {
      title: "Pricing",
      icon: (
        <svg fill="currentColor" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <path d="M15.1,2.1a1.63,1.63,0,0,1,1.7,1.7V4.9a1.63,1.63,0,0,1-1.7,1.7H10A3.4,3.4,0,0,0,6.6,9.8V42a3.4,3.4,0,0,0,3.2,3.4H42a3.4,3.4,0,0,0,3.4-3.2V36.9a1.63,1.63,0,0,1,1.7-1.7h1.1a1.63,1.63,0,0,1,1.7,1.7v6.2a6.81,6.81,0,0,1-6.8,6.8H8.9a6.81,6.81,0,0,1-6.8-6.8V8.9A6.81,6.81,0,0,1,8.9,2.1Z" fillRule="evenodd" />
          <g>
            <path d="M29.7,4.9l8.4.2a4,4,0,0,1,1.8.7h0l3.3,3.3,3.3,3.3a2.41,2.41,0,0,1,.7,1.8h0l.2,8.4a2.64,2.64,0,0,1-.7,1.9h0L32.9,38.4a2.53,2.53,0,0,1-3.6,0h0l-7.6-7.6-7.6-7.6a2.53,2.53,0,0,1,0-3.6h0L27.9,5.7a2.34,2.34,0,0,1,1.8-.8ZM25,18.4l-1.4,1.4a.75.75,0,0,0,0,.9l8.1,8.1a.75.75,0,0,0,.9,0L34,27.4a.75.75,0,0,0,0-.9l-8.1-8.1A.56.56,0,0,0,25,18.4Zm3.8-3.8L27.5,16a.75.75,0,0,0,0,.9L35.6,25a.75.75,0,0,0,.9,0l1.4-1.4a.75.75,0,0,0,0-.9l-8.1-8.1C29.5,14.3,29.2,14.3,28.8,14.6Zm13.1-4.1a2.55,2.55,0,1,0,0,3.6A2.54,2.54,0,0,0,41.9,10.5Z" />
          </g>
        </svg>
      ),
      href: "/pricing",
      onClick: (e) => {
        e.preventDefault();
        if (window.navigate) window.navigate('/pricing');
        else window.location.href = '/pricing';
      },
    },
    {
      title: "Nothric",
      icon: <img src="/logo.svg" alt="Nothric" style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'invert(1)' }} />,
      href: "/",
      onClick: (e) => {
        e.preventDefault();
        openAuth(false);
      },
    },
    {
      title: "Contact Us",
      icon: <IconMail strokeWidth={1.5} style={{ width: '100%', height: '100%' }} />,
      href: "/contact",
      onClick: (e) => {
        e.preventDefault();
        if (window.navigate) window.navigate('/contact');
        else window.location.href = '/contact';
      },
    },
    {
      title: "Changelog",
      icon: <IconHistory strokeWidth={1.5} style={{ width: '100%', height: '100%' }} />,
      href: "/changelog",
      onClick: (e) => {
        e.preventDefault();
        if (window.navigate) window.navigate('/changelog');
        else window.location.href = '/changelog';
      },
    },
    {
      title: "Setup Guide",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <path d="M13 6L21 6.00048M13 12L21 12.0005M13 18L21 18.0005M6 4V20M6 4L3 7M6 4L9 7M6 20L3 17M6 20L9 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: "/docs/quickstart",
      onClick: (e) => {
        e.preventDefault();
        if (window.navigate) window.navigate('/docs/quickstart');
        else window.location.href = '/docs/quickstart';
      },
    },
  ];

  useEffect(() => {
    document.title = 'Nothric | The Unified AI Platform';

    const handleScrollNav = () => {
      if (window.scrollY > 150) {
        setShowStickyNav(true);
      } else {
        setShowStickyNav(false);
      }
    };

    window.addEventListener('scroll', handleScrollNav, { passive: true });
    handleScrollNav();
    return () => window.removeEventListener('scroll', handleScrollNav);
  }, []);

  const openAuth = (signUp: boolean = false) => {
    setIsSignUpMode(signUp);
    setIsAuthModalOpen(true);
  };

  // Track the visible feature scroller items to update sticky active tab instantly at center-line
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-49% 0px -49% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const featureId = entry.target.id.replace('feature-', '') as 'chat' | 'imagine' | 'collab' | 'compare';
          setActiveFeature(featureId);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.feature-scroll-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const getFeatureState = (id: 'chat' | 'imagine' | 'collab' | 'compare') => {
    const order = ['chat', 'imagine', 'collab', 'compare'] as const;
    const activeIdx = order.indexOf(activeFeature);
    const currentIdx = order.indexOf(id);
    if (currentIdx < activeIdx) return 'past';
    if (currentIdx > activeIdx) return 'upcoming';
    return 'active';
  };



  // Metrics scroll-triggered count-up animation
  useEffect(() => {
    const target = document.querySelector('.metrics-scale-section');
    if (!target) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          const duration = 2000;
          const start = performance.now();

          const animateMetrics = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);

            setEnginesCount(Math.floor(ease * 6));
            setLatencyCount(Math.floor(ease * 800));
            setSavingsCount(Math.floor(ease * 100));
            setScaleQueriesCount(Math.floor(ease * 400));

            if (progress < 1) {
              requestAnimationFrame(animateMetrics);
            } else {
              setEnginesCount(6);
              setLatencyCount(800);
              setSavingsCount(100);
              setScaleQueriesCount(400);
            }
          };

          requestAnimationFrame(animateMetrics);
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, []);

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = path;
  };

  const rollingWords = ["Creativity", "Intelligence", "Productivity", "Innovation", "Possibility"];
  const [rollingIndex, setRollingIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRollingIndex((prev) => (prev + 1) % rollingWords.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="prelogin-container">
      <section className="fullscreen-hero">

        <div className="container">
          <nav>
            <div className="logo" onClick={(e) => handleNavClick('/', e)}>
              <img src="/logo.svg" alt="Nothric" style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'invert(1)' }} />
              Nothric
            </div>

            <div className="nav-links">
              <a href="#" className="active" onClick={(e) => e.preventDefault()}>Platform</a>
              <a href="/entropy" onClick={(e) => handleNavClick('/entropy', e)}>Entropy</a>
              <a href="/pricing" onClick={(e) => handleNavClick('/pricing', e)}>Pricing</a>
              <a href="/contact" onClick={(e) => handleNavClick('/contact', e)}>Contact Us</a>
            </div>

            <div className="action-btns">
              <button className="login-btn" onClick={() => openAuth(false)}>Log in</button>
              <button className="contact-btn" onClick={(e) => handleNavClick('/pricing', e as any)}>
                Get Nothric Apex
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', display: 'inline-block', verticalAlign: 'middle' }}><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
              </button>
            </div>
          </nav>

          <main className="hero-main centered-minimal">
            <div className="hero-center-wrapper">
              
              {/* Product Badge Pill with Brand Logo */}
              <div className="hero-badge-pill">
                <img src="/logo.svg" alt="Nothric Logo" style={{ width: '13px', height: '13px', filter: 'invert(1)', objectFit: 'contain' }} />
                <span>Introducing Nothric Apex 2.0</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>

              {/* 2-Row Stacked Title with #7D8187 Second Row Color */}
              <h1 className="rolling-hero-title stacked-two-rows">
                <span className="title-row-1">Where intelligence meets</span>
                <span className="title-row-2 rolling-word-inline">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={rollingWords[rollingIndex]}
                      initial={{ y: 22, opacity: 0, filter: 'blur(6px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: -22, opacity: 0, filter: 'blur(6px)' }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="rolling-word-text"
                    >
                      {rollingWords[rollingIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              {/* Subheading */}
              <p className="hero-subdesc">
                Access leading AI engines together in one unified, intelligent space for effortless side-by-side creation.
              </p>

              {/* CTA Group */}
              <div className="hero-cta-group">
                <div className="button-wrap hero-start-free-wrap">
                  <button className="start-free-btn" onClick={() => openAuth(true)}>
                    <span>Start free</span>
                  </button>
                  <div className="button-shadow"></div>
                </div>
                <div className="button-wrap hero-start-free-wrap">
                  <button className="start-free-btn guide-btn" onClick={(e) => handleNavClick('/docs', e as any)}>
                    <span>Guide</span>
                  </button>
                  <div className="button-shadow"></div>
                </div>
              </div>
            </div>

            {/* Subtle Second Page Scroll Teaser */}
            <div className="second-fold-peek-teaser" onClick={() => {
              const el = document.getElementById('features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span>Explore Features</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </main>
        </div>
      </section>

      {/* Features Scroll Section */}
      <section className="features-scroll-section" id="features">
        <div className="scroll-wrapper">
          {/* Left Column: Info list */}
          <div className="features-scroll-list">
            
            {/* Feature 1: Parallel Chat */}
            <div 
              id="feature-chat" 
              className={`feature-scroll-item ${getFeatureState('chat')}`}
            >
              <div className="feature-category-badge">Feature 01 // Multi-Model Synthesis</div>
              <div className="feature-title-row">
                <svg className="feature-title-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>
                <h2>Parallel Chat</h2>
              </div>
              <p className="feature-desc">
                Query once, compare instantly. Stream answers from the world's leading models side-by-side in a single view to eliminate model bias and extract optimal reasoning.
              </p>
              <ul className="feature-bullets">
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Compare model logic step-by-step in real-time
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Switch models dynamically in the same conversation thread
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Fast Tavily web searches integrated directly into prompts
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Instant side-by-side response benchmarking & latency metrics
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  One-click code and text block exporting across all models
                </li>
              </ul>
            </div>

            {/* Feature 2: Imagine */}
            <div 
              id="feature-imagine" 
              className={`feature-scroll-item ${getFeatureState('imagine')}`}
            >
              <div className="feature-category-badge">Feature 02 // Creative Image Engine</div>
              <div className="feature-title-row">
                <svg className="feature-title-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <h2>Imagine</h2>
              </div>
              <p className="feature-desc">
                High-fidelity image generation right in your workflow. Turn creative concepts into high-resolution assets instantly with precision rendering and style control.
              </p>
              <ul className="feature-bullets">
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Generate, edit, and expand images via natural prompts
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Keep generation history alongside chat threads seamlessly
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Download raw high-resolution output files in 8K fidelity
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Multi-style rendering (Photorealistic, Anime, Cinematic, 3D Render)
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Dynamic seed controls and aspect ratio customizer
                </li>
              </ul>
            </div>

            {/* Feature 3: Collab */}
            <div 
              id="feature-collab" 
              className={`feature-scroll-item ${getFeatureState('collab')}`}
            >
              <div className="feature-category-badge">Feature 03 // Real-Time Team Workspace</div>
              <div className="feature-title-row">
                <svg className="feature-title-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                  <g id="SVGRepo_bgCarrier" strokeWidth="2.2"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g id="Communication / Chat_Conversation">
                      <path id="Gpt" d="M16 8H20C20.5523 8 21 8.44772 21 9V20L17.667 17.231C17.4875 17.0818 17.2608 17 17.0273 17H9C8.44771 17 8 16.5523 8 16V13M16 8V5C16 4.44772 15.5523 4 15 4H4C3.44772 4 3 4.44772 3 5V16.0003L6.33301 13.2308C6.51255 13.0817 6.73924 13 6.97266 13H8M16 8V12C16 12.5523 15.5523 13 15 13H8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </g>
                  </g>
                </svg>
                <h2>Nothric Collab</h2>
              </div>
              <p className="feature-desc">
                Meet your team in a unified workspace where colleagues and AI models interact in real time. Query single or multiple models side-by-side on a shared canvas.
              </p>
              <ul className="feature-bullets">
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Meet and collaborate with your team in one shared workspace
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Interactive chat with single or multiple AI models simultaneously
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Live-sync chat prompts, workspace canvases, and outputs
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Real-time multi-cursor collaboration with teammate activity feeds
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Granular permission controls and shared team asset library
                </li>
              </ul>
            </div>

            {/* Feature 4: Compare */}
            <div 
              id="feature-compare" 
              className={`feature-scroll-item ${getFeatureState('compare')}`}
            >
              <div className="feature-category-badge">Feature 04 // Live Web & Deep Research</div>
              <div className="feature-title-row">
                <svg className="feature-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h2>Deep Search</h2>
              </div>
              <p className="feature-desc">
                Real-time web browsing and research. Browse the live internet to extract structured data charts, trend analysis, and source references instantly.
              </p>
              <ul className="feature-bullets">
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Browse multiple live search sources in parallel
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Synthesize comparisons with interactive visualizations & data tables
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Auto-citation back to primary source articles and publications
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Deep multi-page crawling for comprehensive topic breakdowns
                </li>
                <li>
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  Real-time market trends & structured financial analysis
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Sticky Mockup UI */}
          <div className="features-scroll-sticky">
            <div className="mockup-frame">
              <div className="mockup-body">
                <FeatureCards activeFeature={activeFeature} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scale & Overview Section (Why Nothric) */}
      <section className="metrics-scale-section">
        <div className="metrics-container">
          <div className="metrics-header-row">
            <div className="metrics-header-left">
              <span className="metrics-subtitle">By the numbers</span>
              <h2 className="metrics-title">Intelligence at Scale</h2>
            </div>
            <p className="metrics-desc">
              Nothric consolidates the state-of-the-art models into a single orchestration layer. We route queries dynamically to optimize speed, logic accuracy, and subscription costs.
            </p>
          </div>

          <div className="metrics-grid">
            <div className="metric-col">
              <div className="metric-value-row">
                <span className="metric-number">{enginesCount}+</span>
                <span className="metric-unit">Engines</span>
              </div>
              <p className="metric-label">Leading AI models (Gemini, Llama, Qwen, Mistral, Command R+) integrated into one workspace.</p>
            </div>
            <div className="metric-col">
              <div className="metric-value-row">
                <span className="metric-number">{latencyCount}</span>
                <span className="metric-unit">t/s</span>
              </div>
              <p className="metric-label">Ultra-low latency processing utilizing dedicated custom LPUs and semantic orchestration.</p>
            </div>
            <div className="metric-col">
              <div className="metric-value-row">
                <span className="metric-number">{savingsCount}%</span>
                <span className="metric-unit">Free</span>
              </div>
              <p className="metric-label">Unified access to all leading specialist AI models at zero cost. No credit card required.</p>
            </div>
            <div className="metric-col">
              <div className="metric-value-row">
                <span className="metric-number">{scaleQueriesCount}K+</span>
                <span className="metric-unit">Queries</span>
              </div>
              <p className="metric-label">Queries processed daily across developer pipelines and enterprise workloads.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Orchestration Globe Showcase */}
      <GlobeSection />

      {/* Performance & Pricing Comparison Graphs */}
      <ComparisonGraphs />

      {/* Timeline Section */}
      <TimelineSection />

      {/* Frequently Asked Questions */}
      <FaqSection />

      {/* Footer */}
      <LandingFooter />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultSignUp={isSignUpMode}
      />

      {/* Floating Bottom Navigation Dock with smooth entrance animation */}
      <AnimatePresence>
        {showStickyNav && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              x: '-50%',
              zIndex: 9999,
              pointerEvents: 'auto'
            }}
          >
            <FloatingDock items={dockItems} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
