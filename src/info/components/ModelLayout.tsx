import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Navbar from './Navbar'
import './base.css'
import './layout.css'
import './models.css'

export interface ModelLayoutProps {
  children: ReactNode
  modelKey?: 'gpt' | 'qwen' | 'mistral' | 'cohere' | 'gemini' | 'vector' | 'matrix' | 'zenith' | 'eclipse' | 'entropy'
  glows?: {
    glow1: string
    glow2: string
    glow3: string
    glow4: string
    glow5: string
  }
}

export default function ModelLayout({ children, modelKey, glows }: ModelLayoutProps) {
  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const elements = document.querySelectorAll('.reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [modelKey])

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Background canvas with blurred glows */}
      <div className="bg-glow-container">
        {glows ? (
          <>
            <div className="glow-1" style={{ background: `radial-gradient(circle, ${glows.glow1} 0%, rgba(255, 255, 255, 0) 70%)` }} />
            <div className="glow-2" style={{ background: `radial-gradient(circle, ${glows.glow2} 0%, rgba(255, 255, 255, 0) 70%)` }} />
            <div className="glow-3" style={{ background: `radial-gradient(circle, ${glows.glow3} 0%, rgba(255, 255, 255, 0) 70%)` }} />
            <div className="glow-4" style={{ background: `radial-gradient(circle, ${glows.glow4} 0%, rgba(255, 255, 255, 0) 70%)` }} />
            <div className="glow-5" style={{ background: `radial-gradient(circle, ${glows.glow5} 0%, rgba(255, 255, 255, 0) 70%)` }} />
          </>
        ) : (
          <>
            <div className="glow-1" />
            <div className="glow-2" />
            <div className="glow-3" />
            <div className="glow-4" />
            <div className="glow-5" />
          </>
        )}
      </div>

      {/* UI Elements Overlay */}
      <div className="ui-overlay">
        {/* Unified Navigation Bar */}
        <Navbar />

        {children}

        {/* Footer */}
        <footer className="footer-container">
          <div className="footer-card">
            <div className="footer-grid">
              <div className="footer-brand">
                <a href="#" className="footer-brand-logo">
                  <img src="/logo.svg" alt="Nothric Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  <span>Nothric</span>
                </a>
                <p className="footer-description">
                  Nothric empowers teams to build software, analyze data, and automate workflows with advanced agentic AI.
                </p>
                <div className="footer-socials">
                  <a href="#" className="footer-social-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                  <a href="#" className="footer-social-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  </a>
                  <a href="#" className="footer-social-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                  </a>
                  <a href="#" className="footer-social-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                  </a>
                </div>
              </div>
              <div className="footer-column">
                <h4 className="footer-column-title">Product</h4>
                <ul className="footer-links">
                  <li><a href="#features">Features</a></li>
                  <li><a href="#/pricing">Pricing</a></li>
                  <li><a href="#/changelog">Changelog</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4 className="footer-column-title">Resources</h4>
                <ul className="footer-links">
                  <li><a href="#/docs">Documentation</a></li>
                  <li><a href="#">Tutorials</a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#/support">Support</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4 className="footer-column-title">Company</h4>
                <ul className="footer-links">
                  <li><a href="#">About</a></li>
                  <li><a href="#/careers">Careers</a></li>
                  <li><a href="#/contact">Contact</a></li>
                  <li><a href="#/partners">Partners</a></li>
                </ul>
              </div>
            </div>
            <hr className="footer-divider" />
            <div className="footer-bottom">
              <p className="footer-copyright">
                © {new Date().getFullYear()} Nothric. All rights reserved.
              </p>
              <div className="footer-legal-links">
                <a href="#/privacy">Privacy Policy</a>
                <a href="#/terms">Terms of Service</a>
                <a href="#/cookies">Cookies Settings</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}
