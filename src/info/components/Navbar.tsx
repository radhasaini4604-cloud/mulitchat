import { useState, useEffect } from 'react';

interface NavbarProps {
  onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [activePath, setActivePath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setActivePath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (window.navigate) {
      window.navigate(path);
      setActivePath(path);
    } else {
      window.location.href = path;
    }
  };

  return (
    <>
      <style>{`
        .landing-navbar {
          width: 100%;
          height: 64px;
          background-color: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
          
          /* Slide down from top when other main animations are close to finishing */
          opacity: 0;
          transform: translateY(-100%);
          animation: landingNavSlideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 0.4s;
        }
        @keyframes landingNavSlideDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .landing-nav-container {
          width: 100%;
          max-width: 1200px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
        }
        .landing-nav-left {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .landing-brand {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #ffffff;
        }
        .landing-brand-text {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .landing-nav-menu {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .landing-nav-link {
          color: #a1a1a6;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 400;
          line-height: 1.2;
          transition: color 0.15s ease, opacity 0.15s ease;
          position: relative;
        }
        .landing-nav-link:hover {
          color: #ffffff;
        }
        .landing-nav-link.active {
          color: #ffffff;
          font-weight: 500;
        }
        .landing-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .landing-login-btn {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.25);
          font-size: 0.82rem;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .landing-login-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
        .landing-navbar .landing-nav-right a.landing-try-btn,
        .landing-try-btn {
          background: #ffffff !important;
          color: #000000 !important;
          border: none;
          font-size: 0.82rem;
          font-weight: 500;
          padding: 8px 18px;
          border-radius: 20px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.15s ease;
          text-decoration: none;
        }
        .landing-navbar .landing-nav-right a.landing-try-btn:hover,
        .landing-try-btn:hover {
          opacity: 0.9 !important;
        }
      `}</style>

      <header className="landing-navbar">
        <div className="landing-nav-container">
          <div className="landing-nav-left">
            <a href="/home" onClick={(e) => handleNavClick('/home', e)} className="landing-brand">
              <img src="/logo.svg" alt="Nothric Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              <span className="landing-brand-text">Nothric</span>
            </a>

            <nav className="landing-nav-menu">
              <a
                href="/home"
                onClick={(e) => handleNavClick('/home', e)}
                className={`landing-nav-link ${activePath === '/home' ? 'active' : ''}`}
              >
                Home
              </a>
              <a
                href="/docs"
                onClick={(e) => handleNavClick('/docs', e)}
                className={`landing-nav-link ${activePath === '/docs' ? 'active' : ''}`}
              >
                Documentation
              </a>
              <a
                href="/pricing"
                onClick={(e) => handleNavClick('/pricing', e)}
                className={`landing-nav-link ${activePath === '/pricing' ? 'active' : ''}`}
              >
                Pricing
              </a>
              <a
                href="/contact"
                onClick={(e) => handleNavClick('/contact', e)}
                className={`landing-nav-link ${activePath === '/contact' ? 'active' : ''}`}
              >
                Contact
              </a>
            </nav>
          </div>

          <div className="landing-nav-right">
            <button
              onClick={onLoginClick}
              className="landing-login-btn"
            >
              Log in
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ transform: 'translateY(1px)' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <a
              href="/pricing"
              onClick={(e) => handleNavClick('/pricing', e)}
              className="landing-try-btn"
            >
              Get Nothric Apex
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
