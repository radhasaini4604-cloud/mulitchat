import { useState, useEffect } from 'react';
import { AuthModal } from '../../../components/AuthModal/AuthModal';
import Navbar from '../../components/Navbar';
import LandingFooter from '../../components/Footer';
import './AboutUsPage.css';

export default function AboutUsPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [queriesCount, setQueriesCount] = useState(0);
  const [gpusCount, setGpusCount] = useState(0);
  const [modelsCount, setModelsCount] = useState(0);

  const openAuth = (signUp: boolean = false) => {
    setIsSignUpMode(signUp);
    setIsAuthModalOpen(true);
  };

  // Stats counter animation
  useEffect(() => {
    const duration = 2000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);

      setQueriesCount(Math.floor(ease * 400));
      setGpusCount(Math.floor(ease * 30));
      setModelsCount(Math.floor(ease * 6));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setQueriesCount(400);
        setGpusCount(30);
        setModelsCount(6);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Cursor tracking for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);



  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (signUp: boolean) => {
    openAuth(signUp);
  };

  const goTo = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <div className="aboutus-container">
      {/* Soft Spotlight Tracker */}
      <div id="spotlight"></div>

      {/* Hero Container & Background */}
      <div className="hero-container">
        <div className="hero-bg"></div>
        <div className="glow-sweep"></div>

        {/* Navigation — standard global navbar */}
        <Navbar onLoginClick={() => handleNavClick(false)} />

        {/* Hero main content */}
        <main className="hero-main">
          <div className="hero-content">
            <div className="intro-tag">Introducing Nothric</div>

            <h1>One workspace.<br />All leading models.</h1>

            <p className="hero-desc">
              Nothric brings the world's leading AI models into a single, seamless platform. Chat, compare, and analyze side-by-side without managing multiple subscriptions.
            </p>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => openAuth(true)}>
                Start Free
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px', display: 'inline-block', verticalAlign: 'middle' }}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
              <button className="btn btn-secondary" onClick={(e) => goTo('/docs', e as any)}>
                Documentation
              </button>
            </div>

            {/* Statistics Counter Row */}
            <div className="home-stats-row">
              <div className="home-stats-col">
                <div className="home-stats-number">{queriesCount}K+</div>
                <div className="home-stats-label">queries processed daily</div>
              </div>
              <div className="home-stats-divider"></div>
              <div className="home-stats-col">
                <div className="home-stats-number">{gpusCount}+</div>
                <div className="home-stats-label">GPU from NVIDIA</div>
              </div>
              <div className="home-stats-divider"></div>
              <div className="home-stats-col">
                <div className="home-stats-number">{modelsCount}+</div>
                <div className="home-stats-label">models</div>
              </div>
            </div>
          </div>
        </main>

        {/* Scroll Indicator */}
        <button className="scroll-indicator" onClick={scrollToFeatures} aria-label="Scroll to features">
          <span>Scroll</span>
          <svg className="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Elegance in Execution.</h2>
          <p>Designed to make AI faster, smarter, and more accessible—giving you one unified space for learning, coding, research, and creativity.</p>
        </div>

        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3>Nothric Collab</h3>
            <p>Collaborate with others in real-time. Share prompts, explore ideas, and build workflows side-by-side in a single canvas.</p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3>Side-by-Side Compare</h3>
            <p>Ask a question once and compare responses from leading engines side-by-side to choose the best AI for the job.</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3>Multi-Modal Analysis</h3>
            <p>Seamlessly upload and analyze images, design assets, and large PDFs to synthesize summaries and extract key insights.</p>
          </div>
        </div>
      </section>

      {/* Footer — standard global footer */}
      <LandingFooter />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultSignUp={isSignUpMode}
      />
    </div>
  );
}
