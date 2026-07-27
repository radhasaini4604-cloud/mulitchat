import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import LandingFooter from '../../components/Footer'
import OverviewSection from './OverviewSection'
import {
  GoogleSection,
  GroqSection,
  MistralSection,
  CohereSection,
  NvidiaSection,
  CloudflareSection,
  TavilySection
} from './ModelLinks'
import '../../components/base.css'
import '../../components/layout.css'
import './ApiGuidePage.css'

export default function ApiGuidePage() {
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "API Guide | Nothric";

    const handleScroll = () => {
      const sections = ['overview', 'google', 'groq', 'mistral', 'cohere', 'nvidia', 'cloudflare', 'tavily'];
      const scrollContainer = document.querySelector('.ui-overlay');
      if (!scrollContainer) return;

      const scrollPosition = scrollContainer.scrollTop || 0;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - 140;
          const bottom = top + el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const scrollContainer = document.querySelector('.ui-overlay');
    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => scrollContainer?.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(id)
    }
  }

  return (
    <div className="api-guide-page-wrapper">
      {/* Ambient Cinematic Glow spots in background */}
      <div className="api-guide-glow-container">
        <div className="api-glow-blob api-glow-1" />
        <div className="api-glow-blob api-glow-2" />
        <div className="api-glow-blob api-glow-3" />
      </div>

      <div className="ui-overlay">
        {/* Navigation Header */}
        <Navbar onLoginClick={() => {
          if (window.navigate) {
            window.navigate('/?login=true');
          } else {
            window.location.href = '/?login=true';
          }
        }} />

        {/* Main Content Container */}
        <main className="api-guide-content-wide">
          {/* Hero Section */}
          <header className="api-guide-hero">
            <div className="api-guide-meta">Guide</div>
            <h1 className="api-guide-title">
              <span className="hero-title-word-wrapper" style={{ marginRight: '10px' }}>
                <span className="hero-title-word" style={{ animationDelay: '0.1s' }}>API</span>
              </span>
              <span className="hero-title-word-wrapper" style={{ marginRight: '10px' }}>
                <span className="hero-title-word" style={{ animationDelay: '0.2s' }}>Configuration</span>
              </span>
              <span className="hero-title-word-wrapper">
                <span className="hero-title-word" style={{ animationDelay: '0.3s' }}>Guide</span>
              </span>
            </h1>
            <p className="api-guide-lead">
              You're just 10 minutes away from taking full control of Nothric with your own API keys.Follow the steps below and unlock every supported AI provider.
            </p>
          </header>

          <div className="api-guide-divider" />

          {/* Split Section Layout */}
          <div className="api-guide-split-section">

            {/* Left Sidebar Table of Contents */}
            <aside className="api-guide-sidebar">
              <h2 className="api-guide-toc-heading">Table of contents</h2>
              <nav className="api-guide-toc-list">
                <a
                  href="#overview"
                  className={`api-guide-toc-item ${activeSection === 'overview' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('overview', e)}
                >
                  Overview
                </a>
                <a
                  href="#google"
                  className={`api-guide-toc-item ${activeSection === 'google' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('google', e)}
                >
                  Google Gemini
                </a>
                <a
                  href="#groq"
                  className={`api-guide-toc-item ${activeSection === 'groq' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('groq', e)}
                >
                  Groq (Llama)
                </a>
                <a
                  href="#mistral"
                  className={`api-guide-toc-item ${activeSection === 'mistral' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('mistral', e)}
                >
                  Mistral AI
                </a>
                <a
                  href="#cohere"
                  className={`api-guide-toc-item ${activeSection === 'cohere' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('cohere', e)}
                >
                  Cohere R+
                </a>
                <a
                  href="#nvidia"
                  className={`api-guide-toc-item ${activeSection === 'nvidia' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('nvidia', e)}
                >
                  NVIDIA NIM
                </a>
                <a
                  href="#cloudflare"
                  className={`api-guide-toc-item ${activeSection === 'cloudflare' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('cloudflare', e)}
                >
                  Cloudflare
                </a>
                <a
                  href="#tavily"
                  className={`api-guide-toc-item ${activeSection === 'tavily' ? 'active' : ''}`}
                  onClick={(e) => scrollToSection('tavily', e)}
                >
                  Tavily Search
                </a>
              </nav>
            </aside>

            {/* Right Main Content */}
            <div className="api-guide-main-column">
              <OverviewSection />
              <div className="api-guide-inner-divider" />
              <GoogleSection />
              <div className="api-guide-inner-divider" />
              <GroqSection />
              <div className="api-guide-inner-divider" />
              <MistralSection />
              <div className="api-guide-inner-divider" />
              <CohereSection />
              <div className="api-guide-inner-divider" />
              <NvidiaSection />
              <div className="api-guide-inner-divider" />
              <CloudflareSection />
              <div className="api-guide-inner-divider" />
              <TavilySection />
            </div>

          </div>
        </main>

        {/* Full Footer */}
        <LandingFooter />
      </div>
    </div>
  )
}
