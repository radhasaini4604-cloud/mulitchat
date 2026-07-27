import { useEffect } from 'react'
import ElectricBorder from '../../components/ElectricBorder'
import Navbar from '../../components/Navbar'
import LandingFooter from '../../components/Footer'
import '../../components/base.css'
import '../../components/layout.css'
import './DevPricingPage.css'

export default function DevPricingPage() {
  useEffect(() => {
    document.title = 'Developer Pricing | Nothric';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const elements = document.querySelectorAll('.pricing-page .reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="pricing-page" style={{ position: 'relative', width: '100vw', minHeight: '100vh', backgroundColor: '#f8fafc', display: 'block', height: 'auto', overflow: 'visible' }}>
      <div className="bg-glow-container">
        <div className="glow-1" />
        <div className="glow-2" />
        <div className="glow-3" />
        <div className="glow-4" />
        <div className="glow-5" />
      </div>

      <div className="ui-overlay">
        <Navbar />

      <div className="pricing-header" style={{ margin: '48px 0 32px 0' }}>
        <h1 className="pricing-title" style={{ fontSize: '3rem' }}>Pricing</h1>
        <p className="pricing-subtitle" style={{ fontSize: '1.05rem', color: '#64748b' }}>
          See pricing for our individual, business, and enterprise plans.
        </p>
      </div>

      <div className="pricing-grid-4">
        <div className="price-card">
          <span className="tier-name" style={{ color: '#0f172a' }}>Orbital</span>
          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', margin: '4px 0 16px 0' }}>Intelligence for everyday tasks</span>
          <div className="tier-price" style={{ margin: '8px 0 20px 0' }}>₹0 <span style={{ fontSize: '0.8rem' }}>/ month</span></div>
          <button className="btn-signup" style={{ width: '100%', marginBottom: '24px', background: '#0f172a', color: '#ffffff' }}>Get Orbital</button>
          <ul className="tier-features" style={{ gap: '12px', fontSize: '0.85rem' }}>
            <li>✓ Only access to Gpt 2.6</li>
            <li>✓ Limited messages and uploads</li>
            <li>✓ Limited and slower image generation</li>
            <li>✓ Limited deep research</li>
            <li>✓ Limited memory and context</li>
            <li>✓ Limited Group Chat code access</li>
          </ul>
        </div>

        <div className="price-card">
          <span className="tier-name" style={{ color: '#0f172a' }}>Voyager</span>
          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', margin: '4px 0 16px 0' }}>Keep chatting with expanded access</span>
          <div className="tier-price" style={{ margin: '8px 0 20px 0' }}>₹399 <span style={{ fontSize: '0.8rem' }}>/ month</span></div>
          <button className="btn-signup" style={{ width: '100%', marginBottom: '24px', background: '#0f172a', color: '#ffffff' }}>Get Voyager</button>
          <ul className="tier-features" style={{ gap: '12px', fontSize: '0.85rem' }}>
            <li style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>⚡ Everything in Orbital and:</li>
            <li>✓ Access to Gpt 4.6 and Qwen 1.2</li>
            <li>✓ More messages</li>
            <li>✓ More uploads</li>
            <li>✓ More image creation</li>
            <li>✓ Longer memory</li>
          </ul>
        </div>

        <div className="price-card" style={{ background: 'rgba(255, 255, 255, 0.85)' }}>
          <span className="tier-name" style={{ color: '#0f172a' }}>Quasar</span>
          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', margin: '4px 0 16px 0' }}>Do more with advanced intelligence</span>
          <div className="tier-price" style={{ margin: '8px 0 20px 0' }}>₹1,999 <span style={{ fontSize: '0.8rem' }}>/ month</span></div>
          <button className="btn-signup" style={{ width: '100%', marginBottom: '24px', background: '#0f172a', color: '#ffffff' }}>Get Quasar</button>
          <ul className="tier-features" style={{ gap: '12px', fontSize: '0.85rem' }}>
            <li style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>⚡ Everything in Voyager and:</li>
            <li style={{ fontWeight: '800', color: '#64748b' }}>✓ Full access to Gemini 3.5</li>
            <li>✓ Access to Gpt 7.4, Qwen 2.4 and Mistral 1.1</li>
            <li>✓ Advanced reasoning capabilities</li>
            <li>✓ More complex and accurate image creation</li>
            <li>✓ Expanded deep research and agent mode</li>
            <li>✓ Expanded memory and context</li>
            <li>✓ Projects, tasks, and custom Nothric agents</li>
            <li>✓ Expanded Group Chat code usage</li>
          </ul>
        </div>

        <div className="price-card">
          <span className="tier-name" style={{ color: '#0f172a' }}>Interstellar</span>
          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', margin: '4px 0 16px 0' }}>Maximize your productivity</span>
          <div className="tier-price" style={{ margin: '8px 0 20px 0' }}>₹10,699 <span style={{ fontSize: '0.8rem' }}>/ month</span></div>
          <button className="btn-signup" style={{ width: '100%', marginBottom: '24px', background: '#0f172a', color: '#ffffff' }}>Get Interstellar</button>
          <ul className="tier-features" style={{ gap: '12px', fontSize: '0.85rem' }}>
            <li style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>⚡ Everything in Quasar and:</li>
            <li style={{ fontWeight: '800', color: '#64748b' }}>✓ Full access to Gemini 3.5</li>
            <li>✓ Access to all models: Gpt, Qwen, Mistral, and Cohere 4.2</li>
            <li>✓ 5x or 20x more usage</li>
            <li>✓ Maximum Group Chat code tasks</li>
            <li>✓ Unlimited file uploads</li>
            <li>✓ Unlimited and faster image creation</li>
            <li>✓ Maximum deep research and agent mode</li>
            <li>✓ Maximum memory and context</li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '32px', width: '100%', padding: '0 24px', boxSizing: 'border-box' }} className="reveal-on-scroll">
        <p style={{ fontSize: '1.05rem', color: '#475569', fontWeight: 600, margin: 0 }}>
          These plans are for both Group Chat code and Nothric
        </p>
      </div>

      <div className="pricing-grid-3">
        <ElectricBorder color="#0f172a" borderRadius={24} speed={1.5} chaos={0.05} className="reveal-on-scroll reveal-delay-1">
          <div className="price-card featured" style={{ border: 'none', background: 'rgba(255, 255, 255, 0.9)', height: '100%', boxSizing: 'border-box' }}>
            <span className="tier-name" style={{ color: '#0f172a' }}>Business Group Chat code</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', margin: '4px 0 16px 0' }}>A plan for development-focused teams with pay-as-you-go pricing</span>
            <div className="tier-price custom-pricing" style={{ margin: '8px 0 20px 0' }}>Usage pricing <span style={{ fontSize: '0.8rem' }}>/ based on usage</span></div>
            <button className="btn-signup" style={{ width: '100%', marginBottom: '24px', background: '#0f172a', color: '#ffffff' }}>Get started</button>
            <ul className="tier-features" style={{ gap: '12px', fontSize: '0.85rem' }}>
              <li>✓ AI-powered software engineering</li>
              <li>✓ Automated code and security reviews</li>
              <li>✓ Automate tasks on your computer</li>
              <li>✓ Take action across your documents, tools, and codebases</li>
              <li>✓ Built-in worktrees and cloud environments for multi-agent workflows</li>
              <li>✓ No fixed seat fee; pay as you go based on usage</li>
            </ul>
          </div>
        </ElectricBorder>

        <div className="price-card reveal-on-scroll reveal-delay-2">
          <span className="tier-name" style={{ color: '#0f172a' }}>Business Nothric & Group Chat code</span>
          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', margin: '4px 0 16px 0' }}>A secure workspace with company context and tools for teams</span>
          <div className="tier-price" style={{ margin: '8px 0 20px 0' }}>₹1,800 <span style={{ fontSize: '0.8rem' }}>/ user / month</span></div>
          <button className="btn-signup" style={{ width: '100%', marginBottom: '24px', background: '#0f172a', color: '#ffffff' }}>Get started</button>
          <ul className="tier-features" style={{ gap: '12px', fontSize: '0.85rem' }}>
            <li>✓ Access Nothric and Group Chat code across desktop and mobile apps</li>
            <li>✓ AI for chat, coding, analysis, and workflows</li>
            <li>✓ Connect tools like Office 365, Google Drive, Slack, GitHub</li>
            <li>✓ Build custom team agent plugins</li>
            <li>✓ Centralized billing and administration</li>
            <li>✓ Secure workspace with SAML SSO and MFA</li>
          </ul>
        </div>

        <div className="price-card dark reveal-on-scroll reveal-delay-3">
          <span className="tier-name">Enterprise</span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', margin: '4px 0 16px 0' }}>Enterprise-grade AI, security, and support for businesses operating at scale</span>
          <div className="tier-price custom-pricing" style={{ margin: '8px 0 20px 0' }}>Custom pricing <span style={{ fontSize: '0.8rem' }}>/ custom terms</span></div>
          <button className="btn-signup" style={{ width: '100%', marginBottom: '24px' }}>Contact sales</button>
          <ul className="tier-features" style={{ gap: '12px', fontSize: '0.85rem' }}>
            <li>✓ Expanded context window that supports longer inputs and larger files</li>
            <li>✓ Enterprise-level security and controls (SCIM, EKM, domain verification)</li>
            <li>✓ Advanced data privacy with custom data retention policies</li>
            <li>✓ Support for data residency in ten regions</li>
            <li>✓ 24/7 priority support and SLAs</li>
            <li>✓ Invoicing and billing, volume discounts</li>
          </ul>
        </div>
      </div>

      <section className="trusted-section reveal-on-scroll">
        <h3 className="trusted-title">Trusted by teams at</h3>
        <div className="trusted-logos-grid">
          <span className="trusted-logo-item">Gates Foundation</span>
          <span className="trusted-logo-item">jetBlue</span>
          <span className="trusted-logo-item">LOWE\'S</span>
          <span className="trusted-logo-item">UNIVERSITY OF OXFORD</span>
          <span className="trusted-logo-item">STATE OF MINNESOTA</span>
        </div>
      </section>

      <LandingFooter />
      </div>
    </div>
  )
}
