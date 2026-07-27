export default function LandingFooter() {

  return (
    <>
      {/* OpenAI-Style Dark Footer Styles */}
      <style>{`
        .landing-footer {
          width: 100% !important;
          max-width: none !important;
          background: #000000 !important;
          border-top: 0.5px solid rgba(255, 255, 255, 0.15);
          margin: 0 !important;
          padding: 72px 40px 48px 40px !important;
          box-sizing: border-box;
          min-height: 45vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          position: relative !important;
          overflow: hidden !important;
        }
        
        .landing-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative !important;
          z-index: 5 !important;
        }

        .footer-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 240px;
          background: linear-gradient(to top, rgba(162, 215, 230, 0.25) 0%, rgba(0, 0, 0, 0) 100%);
          filter: blur(40px);
          z-index: 2;
          pointer-events: none;
        }

        .footer-grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
          background-image: 
              linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
          background-size: 160px 160px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(4, 1fr);
          gap: 32px;
          margin-bottom: 48px;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }
        }

        @media (max-width: 500px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }

        .footer-brand-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-brand-title {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #ffffff;
        }
        
        .footer-logo-container {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-logo-svg {
          width: 100%;
          height: 100%;
        }

        .footer-logo-svg .mask-draw-path {
          fill: none;
          stroke: #ffffff;
          stroke-width: 160;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .footer-logo-svg .fill-path {
          fill: #ffffff;
          opacity: 0.95;
        }

        .footer-brand-name {
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .footer-brand-text {
          font-size: 13px;
          color: #86868b;
          line-height: 1.5;
          margin: 0;
          max-width: 240px;
        }

        .footer-brand-socials {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 8px;
        }

        .footer-brand-social-link {
          color: #86868b;
          transition: color 0.2s, transform 0.2s;
        }

        .footer-brand-social-link:hover {
          color: #ffffff;
          transform: translateY(-2px);
        }

        .footer-section-block {
          margin-bottom: 40px;
        }

        .footer-section-block:last-child {
          margin-bottom: 0;
        }

        .footer-column-title {
          color: #ffffff;
          font-size: 13px;
          font-weight: 500;
          margin: 0 0 16px 0;
          letter-spacing: -0.01em;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          color: #86868b;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #ffffff;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 0.5px solid rgba(255, 255, 255, 0.1);
          padding-top: 20px;
          margin-top: 28px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-socials {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-social-link {
          color: #86868b;
          transition: color 0.2s;
        }

        .footer-social-link:hover {
          color: #ffffff;
        }

        .footer-copyright-text {
          font-size: 12px;
          color: #6e6e73;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-copyright-text a {
          color: #86868b;
          text-decoration: none;
        }

        .footer-copyright-text a:hover {
          color: #ffffff;
        }

        .footer-lang-btn {
          background: transparent;
          border: 0.5px solid rgba(255, 255, 255, 0.25);
          border-radius: 9999px;
          padding: 8px 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #86868b;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s;
          font-family: inherit;
        }

        .footer-lang-btn:hover {
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.45);
        }

        .footer-lang-btn span {
          color: #ffffff;
          font-weight: 500;
        }

        .footer-bg-logo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 580px;
          height: 580px;
          opacity: 0.09;
          pointer-events: none;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: blur(8px) invert(1);
        }

        .footer-bg-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      `}</style>

      <footer className="landing-footer">
        <div className="landing-footer-inner">

          {/* 6-Column Grid Layout with Brand Logo Column */}
          <div className="footer-grid">

            {/* Brand Logo & Socials Column */}
            <div className="footer-brand-column">
              <a href="/home" className="footer-brand-title">
                <div className="footer-logo-container">
                  <img
                    src="/logo_nobg.png"
                    alt="Nothric Logo"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      filter: 'invert(1)'
                    }}
                  />
                </div>
                <span className="footer-brand-name">Nothric</span>
              </a>

              <p className="footer-brand-text">
                Nothric brings the world's leading AI models into a single, seamless platform.
              </p>

              {/* Brand Socials below logo & name */}
              <div className="footer-brand-socials">
                <a href="https://github.com" className="footer-brand-social-link" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>
                <a href="https://x.com" className="footer-brand-social-link" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://youtube.com" className="footer-brand-social-link" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.02 0 12 0 12s0 3.98.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.98 24 12 24 12s0-3.98-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a href="https://instagram.com" className="footer-brand-social-link" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://linkedin.com" className="footer-brand-social-link" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z" />
                  </svg>
                </a>
                <a href="https://discord.com" className="footer-brand-social-link" target="_blank" rel="noopener noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Products & Documentation */}
            <div className="footer-column">
              <div className="footer-section-block">
                <h4 className="footer-column-title">Products</h4>
                <ul className="footer-links">
                  <li><a href="/docs/imagine-overview">Imagine</a></li>
                  <li><a href="/docs/Main_chat-introduction">Chat</a></li>
                  <li><a href="/docs/collab-overview">Group Chat</a></li>
                  <li><a href="/docs/auto-overview">Auto Nothric</a></li>
                  <li><a href="/docs/release-notes">Release Notes</a></li>
                </ul>
              </div>
              <div className="footer-section-block">
                <h4 className="footer-column-title">Documentation</h4>
                <ul className="footer-links">
                  <li><a href="/docs/welcome">Get Started</a></li>
                  <li><a href="/docs/quickstart">Quick Start</a></li>
                  <li><a href="/docs/faq-general">General FAQ</a></li>
                </ul>
              </div>
            </div>

            {/* Column 3: Guides, Safety & Business */}
            <div className="footer-column">
              <div className="footer-section-block">
                <h4 className="footer-column-title">Guides & API</h4>
                <ul className="footer-links">
                  <li><a href="/docs/welcome">Platform Overview</a></li>
                  <li><a href="/api-guide">Setup Guide</a></li>
                  <li><a href="/docs/rate-limits">Rate Limit</a></li>
                  <li><a href="/docs/models">Models</a></li>
                </ul>
              </div>
              <div className="footer-section-block">
                <h4 className="footer-column-title">Safety</h4>
                <ul className="footer-links">
                  <li><a href="/alignment">Alignment Approach</a></li>
                  <li><a href="/trust-transparency">Trust & Transparency</a></li>
                </ul>
              </div>
              <div className="footer-section-block">
                <h4 className="footer-column-title">Business</h4>
                <ul className="footer-links">
                  <li><a href="/partners">Partner Network</a></li>
                  <li><a href="/contact">Contact Sales</a></li>
                </ul>
              </div>
            </div>

            {/* Column 4: Company, Support & Pricing */}
            <div className="footer-column">
              <div className="footer-section-block">
                <h4 className="footer-column-title">Company</h4>
                <ul className="footer-links">
                  <li><a href="/about-us">About Us</a></li>
                  <li><a href="/mission">Our Mission</a></li>
                  <li><a href="/careers">Careers</a></li>
                </ul>
              </div>
              <div className="footer-section-block">
                <h4 className="footer-column-title">Support</h4>
                <ul className="footer-links">
                  <li><a href="/contact">contact us</a></li>
                  <li><a href="/support">Support</a></li>
                </ul>
              </div>
              <div className="footer-section-block">
                <h4 className="footer-column-title">Pricing</h4>
                <ul className="footer-links">
                  <li><a href="/pricing">User Pricing</a></li>
                  <li><a href="/developers/pricing">Developer Pricing</a></li>
                </ul>
              </div>
            </div>

            {/* Column 5: Advancements, Terms & More */}
            <div className="footer-column">
              <div className="footer-section-block">
                <h4 className="footer-column-title">Latest Advancements</h4>
                <ul className="footer-links">
                  <li><a href="/gemini">gemini 3.5</a></li>
                  <li><a href="/gpt">gemini 3.0</a></li>
                  <li><a href="/qwen">gemini 2.7</a></li>
                </ul>
              </div>
              <div className="footer-section-block">
                <h4 className="footer-column-title">Terms & Policies</h4>
                <ul className="footer-links">
                  <li><a href="/terms">Terms of Use</a></li>
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/collab-privacy">other Policy</a></li>
                </ul>
              </div>
              <div className="footer-section-block">
                <h4 className="footer-column-title">More</h4>
                <ul className="footer-links">
                  <li><a href="/changelog">Changelog</a></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Footer Bottom Row */}
          <div className="footer-bottom">

            {/* Copyright */}
            <p className="footer-copyright-text">
              Nothric © 2025–2026 <a href="/cookies" target="_blank" rel="noopener noreferrer">Manage Cookies</a>
            </p>

            {/* Language Capsule */}
            <button className="footer-lang-btn" onClick={(e) => e.preventDefault()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>English</span> India
            </button>

          </div>

        </div>

        {/* Background Glow & Grid effects clone from eg.html */}
        <div className="footer-bg-logo">
          <img src="/logo_nobg.png" alt="" />
        </div>
        <div className="footer-glow"></div>
        <div className="footer-grid-overlay"></div>
      </footer>
    </>
  );
}
