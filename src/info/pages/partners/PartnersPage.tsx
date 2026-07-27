import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import LandingFooter from '../../components/Footer'
import '../../components/base.css'
import '../../components/layout.css'
import './PartnersPage.css'

interface PartnerProfile {
  id: string
  name: string
  role: string
  category: 'Infrastructure' | 'AI Models' | 'Dev Tools'
  tier: 'Strategic Partner' | 'Premier Partner' | 'Technology Partner'
  description: string
  website: string
  solutions: string[]
}

const PARTNER_PROFILES: PartnerProfile[] = [
  {
    id: 'partner-1',
    name: 'Google Cloud',
    role: 'Infrastructure & Compute Provider',
    category: 'Infrastructure',
    tier: 'Strategic Partner',
    description: 'Hosts Nothric\'s secure reasoning environments, model training nodes, and distributed compilation workspaces with global scale.',
    website: 'https://cloud.google.com',
    solutions: [
      'Distributed reasoning clusters over TPU v5e pods',
      'Multi-region secure workspace sandboxing (SLA 99.99%)',
      'Federated data compliance pipelines for agent runtimes'
    ]
  },
  {
    id: 'partner-2',
    name: 'Groq API',
    role: 'Low-Latency Inference Partner',
    category: 'Infrastructure',
    tier: 'Premier Partner',
    description: 'Powers ultra-low-latency text and token processing using Groq\'s LPU hardware architecture for instant interactive model generation.',
    website: 'https://groq.com',
    solutions: [
      'Sub-20ms Time-To-First-Token performance',
      'Dedicated inference bandwidth up to 8.2K tokens/second',
      'Hardware-level context window caching optimization'
    ]
  },
  {
    id: 'partner-3',
    name: 'Anthropic',
    role: 'Analytical Model Integration',
    category: 'AI Models',
    tier: 'Strategic Partner',
    description: 'Integrates specialized analytical models into Nothric\'s multi-column workspace, supporting complex code review and layout processing.',
    website: 'https://anthropic.com',
    solutions: [
      'Full API handshakes with Claude 3.5 Sonnet engine',
      'Automated multi-file source structure analyzing',
      'Structured JSON parsing validation matrices'
    ]
  },
  {
    id: 'partner-4',
    name: 'OpenAI',
    role: 'Decision Routing & Compute Partner',
    category: 'AI Models',
    tier: 'Strategic Partner',
    description: 'Cooperates on agentic decision tree parsing, tool routing policies, and structured natural language translation.',
    website: 'https://openai.com',
    solutions: [
      'Multi-model comparison pipelines',
      'Dynamic routing models for structured prompt analysis',
      'Low-latency backup fallback endpoints'
    ]
  },
  {
    id: 'partner-5',
    name: 'Hugging Face',
    role: 'Model Hub & Checkpoint Provider',
    category: 'AI Models',
    tier: 'Technology Partner',
    description: 'Hosts and serves specialized image weights and diffusion checkpoints for Nothric\'s creative asset generators.',
    website: 'https://huggingface.co',
    solutions: [
      'Dynamic serverless diffusion model checkouts',
      'Central warehouse hosting for custom fine-tuned weights',
      'Access token handshakes to Hugging Face Model Hub'
    ]
  },
  {
    id: 'partner-6',
    name: 'GitHub',
    role: 'Repository Synchronization Partner',
    category: 'Dev Tools',
    tier: 'Premier Partner',
    description: 'Integrates repository synchronization, automated action triggers, and secure code ingestion pipelines directly into developer workspace canals.',
    website: 'https://github.com',
    solutions: [
      'Secure OAuth repository handshakes',
      'Automated PR feedback loops triggered via webhooks',
      'Direct workspace push-to-deploy setups'
    ]
  },
  {
    id: 'partner-7',
    name: 'Vercel',
    role: 'Edge Hosting & Routing Partner',
    category: 'Dev Tools',
    tier: 'Technology Partner',
    description: 'Delivers the front-end hosting environment, global edge routing, and immediate interface compiles for client-facing codebases.',
    website: 'https://vercel.com',
    solutions: [
      'Immediate preview branch compiles',
      'Global low-latency Edge middleware routing',
      'Optimized static asset delivery networks'
    ]
  },
  {
    id: 'partner-8',
    name: 'Slack',
    role: 'Collaboration Alert Integration',
    category: 'Dev Tools',
    tier: 'Technology Partner',
    description: 'Enables real-time workspace alerts, pipeline execution updates, and agent status feeds directly into team Slack channels.',
    website: 'https://slack.com',
    solutions: [
      'Webhook connection feeds for build statuses',
      'Interactive Slack command routing directly to agents',
      'Secure channel authorizations'
    ]
  }
]

export default function PartnersPage() {
  const [filter, setFilter] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedPartner, setSelectedPartner] = useState<PartnerProfile>(PARTNER_PROFILES[0])
  const [ctaEmail, setCtaEmail] = useState<string>('')
  const [isCtaSubmitted, setIsCtaSubmitted] = useState<boolean>(false)

  useEffect(() => {
    document.title = 'Partner Network | Nothric';
    // Scroll reveal intersections
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

    const elements = document.querySelectorAll('.ui-overlay .reveal-on-scroll')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  // Filter list
  const filteredPartners = PARTNER_PROFILES.filter(partner => {
    const matchesFilter = filter === 'All' || partner.category === filter
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Auto-adjust selected partner if filtered out of view
  useEffect(() => {
    if (filteredPartners.length > 0 && !filteredPartners.some(p => p.id === selectedPartner.id)) {
      setSelectedPartner(filteredPartners[0])
    }
  }, [filter, searchQuery, filteredPartners, selectedPartner])

  const handleCtaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ctaEmail) return
    setIsCtaSubmitted(true)
  }

  return (
    <div className="partners-page-wrapper">
      <div className="ui-overlay">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Layout */}
        <div className="partners-content" style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '40px', width: '100%', maxWidth: '1200px', padding: '80px 24px', boxSizing: 'border-box' }}>
          
          {/* Hero Section */}
          <section className="partners-hero">
            <div className="partners-badge">
              <span>Partner Ecosystem</span>
            </div>
            <h1 className="partners-title" style={{ fontSize: '4rem', fontWeight: 800, letterSpacing: '-0.04em', margin: '0 0 16px 0' }}>
              Our <span>Partners</span>
            </h1>
            <p className="partners-subtitle" style={{ fontSize: '1.15rem', fontWeight: 500 }}>
              Nothric collaborates with global model providers, infrastructure systems, and developer platform leaders to build unified workflows.
            </p>
          </section>

          {/* Split Interactive Dashboard */}
          <div className="partners-dashboard reveal-on-scroll">
            
            {/* Left Panel: Search, Category Filters, and Vertical List */}
            <div className="partners-list-panel">
              
              {/* Minimalist Search Box */}
              <div className="search-box-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search partner directory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-box-input"
                />
              </div>

              {/* Minimalist Tab Filters */}
              <div className="filter-tags-scroll">
                {['All', 'Infrastructure', 'AI Models', 'Dev Tools'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`btn-filter-tag ${filter === category ? 'active' : ''}`}
                  >
                    {category === 'All' ? 'All Partners' : category}
                  </button>
                ))}
              </div>

              {/* Vertical Card List */}
              <div className="nodes-vertical-list">
                {filteredPartners.length > 0 ? (
                  filteredPartners.map((partner) => (
                    <div
                      key={partner.id}
                      className={`node-list-card ${selectedPartner.id === partner.id ? 'active' : ''}`}
                      onClick={() => setSelectedPartner(partner)}
                    >
                      <div className="node-list-card-header">
                        <h4 className="node-list-name">{partner.name}</h4>
                        <span className="node-list-status">{partner.tier}</span>
                      </div>
                      <span className="node-list-role">{partner.role}</span>
                      <p className="node-list-desc-snippet">{partner.description}</p>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', border: '1px dashed #e5e7eb', borderRadius: '12px' }}>
                    No partners found matching criteria.
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Detailed Profile Inspector View */}
            <div className="partners-inspector-panel">
              {selectedPartner ? (
                <div className="inspector-card">
                  
                  {/* Inspector Header */}
                  <div className="inspector-header">
                    <div className="inspector-title-row">
                      <h2 className="inspector-node-name">{selectedPartner.name}</h2>
                      <span className="inspector-tag-pill">{selectedPartner.category}</span>
                    </div>
                    <span className="inspector-node-role">{selectedPartner.role}</span>
                  </div>

                  {/* Description */}
                  <div className="inspector-desc-section">
                    <h5 className="inspector-desc-title">Partnership Overview</h5>
                    <p className="inspector-node-desc">{selectedPartner.description}</p>
                  </div>

                  {/* Operational Tier Specs */}
                  <div className="inspector-specs-grid">
                    <div className="spec-cell">
                      <span className="spec-cell-label">Partnership Tier</span>
                      <span className="spec-cell-value">{selectedPartner.tier}</span>
                    </div>
                    <div className="spec-cell">
                      <span className="spec-cell-label">Integration Category</span>
                      <span className="spec-cell-value">{selectedPartner.category}</span>
                    </div>
                  </div>

                  {/* Joint Solutions Bullets */}
                  <div className="inspector-bullets-section">
                    <h5 className="bullets-title">Joint Capabilities & Solutions</h5>
                    <ul className="bullets-list">
                      {selectedPartner.solutions.map((sol, index) => (
                        <li key={index} className="bullet-item">{sol}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="inspector-actions">
                    <a
                      href={selectedPartner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-inspector-action primary"
                    >
                      Visit Website
                    </a>
                    <button
                      onClick={() => alert(`Opening collaboration case study with ${selectedPartner.name}...`)}
                      className="btn-inspector-action"
                    >
                      Read Case Study
                    </button>
                  </div>

                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', border: '1px dashed #e5e7eb', borderRadius: '16px', background: '#ffffff' }}>
                  Select a profile from the directory list.
                </div>
              )}
            </div>

          </div>

          {/* Become a Partner Call to Action */}
          <section className="partner-cta-card reveal-on-scroll">
            {!isCtaSubmitted ? (
              <form onSubmit={handleCtaSubmit}>
                <h3 className="partner-cta-title">Join Nothric's Partner Program</h3>
                <p className="partner-cta-desc">
                  Interested in co-designing integrations, scaling hardware inference channels, or collaborating on business tools? Let's build together.
                </p>
                <div className="partner-cta-form">
                  <input
                    type="email"
                    required
                    placeholder="Enter corporate email..."
                    value={ctaEmail}
                    onChange={(e) => setCtaEmail(e.target.value)}
                    className="partner-cta-input"
                  />
                  <button type="submit" className="btn-partner-submit">
                    Send Proposal Request
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h3 className="partner-cta-title">Proposal Request Logged</h3>
                <p className="partner-cta-desc" style={{ marginBottom: 0 }}>
                  Thank you. We have recorded your interest from <strong>{ctaEmail}</strong>. Our Partnerships Director reviews inquiries weekly and will follow up shortly.
                </p>
              </div>
            )}
          </section>

          {/* Founders Command Desk Section */}
          <section className="founders-section reveal-on-scroll" style={{ width: '100%', marginTop: '30px' }}>
            <span className="partners-section-label" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', textAlign: 'center', marginBottom: '12px' }}>Nothric Origin</span>
            <h2 className="partners-section-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111827', textAlign: 'center', margin: '0 0 16px 0', letterSpacing: '-0.03em' }}>Our Founders & Team</h2>
            <p style={{ textAlign: 'center', color: '#4b5563', maxWidth: '600px', margin: '0 auto 36px auto', fontSize: '1rem', lineHeight: '1.6' }}>
              Nothric was built from the ground up by Pradeep and Kanha. Today, they lead the Nothric team—a collective of builders, engineers, and researchers scaling distributed agentic intelligence.
            </p>

            <div className="founders-passes-container">
              {/* Pradeep Profile Card */}
              <div className="founder-access-pass">
                <div className="pass-header">
                  <div className="pass-header-logo">
                    <img src="/logo.svg" alt="Nothric logo" style={{ width: '16px', height: '16px' }} />
                    <span>NOTHRIC SYSTEMS</span>
                  </div>
                  <div className="pass-header-auth">PRADEEP</div>
                </div>

                <div className="pass-body">
                  <div className="pass-avatar-box">
                    <div className="pass-avatar-placeholder">P</div>
                  </div>
                  <div className="pass-credentials">
                    <span className="pass-cred-label">OFFICER NAME</span>
                    <span className="pass-cred-value name">PRADEEP</span>
                    
                    <span className="pass-cred-label">ROLE SPECIFICATION</span>
                    <span className="pass-cred-value">Founder & System Architect</span>

                    <span className="pass-cred-label">PRIMARY FOCUS</span>
                    <span className="pass-cred-value auth-list">Core Architecture & Model Alignment</span>
                  </div>
                </div>

                <div className="pass-footer">
                  <span className="pass-stamp-role">FOUNDER</span>
                  <button className="pass-contact-btn" onClick={() => alert("Contact request logged for Pradeep.")}>Contact Lead</button>
                </div>
              </div>

              {/* Kanha Profile Card */}
              <div className="founder-access-pass">
                <div className="pass-header">
                  <div className="pass-header-logo">
                    <img src="/logo.svg" alt="Nothric logo" style={{ width: '16px', height: '16px' }} />
                    <span>NOTHRIC SYSTEMS</span>
                  </div>
                  <div className="pass-header-auth">KANHA</div>
                </div>

                <div className="pass-body">
                  <div className="pass-avatar-box">
                    <div className="pass-avatar-placeholder">K</div>
                  </div>
                  <div className="pass-credentials">
                    <span className="pass-cred-label">OFFICER NAME</span>
                    <span className="pass-cred-value name">KANHA</span>
                    
                    <span className="pass-cred-label">ROLE SPECIFICATION</span>
                    <span className="pass-cred-value">Co-Founder & Systems Director</span>

                    <span className="pass-cred-label">PRIMARY FOCUS</span>
                    <span className="pass-cred-value auth-list">LPUs & Infrastructure Partnerships</span>
                  </div>
                </div>

                <div className="pass-footer">
                  <span className="pass-stamp-role">CO-FOUNDER</span>
                  <button className="pass-contact-btn" onClick={() => alert("Contact request logged for Kanha.")}>Contact Lead</button>
                </div>
              </div>

              {/* Nothric Team Card */}
              <div className="founder-access-pass">
                <div className="pass-header">
                  <div className="pass-header-logo">
                    <img src="/logo.svg" alt="Nothric logo" style={{ width: '16px', height: '16px' }} />
                    <span>NOTHRIC SYSTEMS</span>
                  </div>
                  <div className="pass-header-auth">TEAM</div>
                </div>

                <div className="pass-body">
                  <div className="pass-avatar-box">
                    <div className="pass-avatar-placeholder">H</div>
                  </div>
                  <div className="pass-credentials">
                    <span className="pass-cred-label">GROUP NAME</span>
                    <span className="pass-cred-value name">NOTHRIC TEAM</span>
                    
                    <span className="pass-cred-label">ROLE SPECIFICATION</span>
                    <span className="pass-cred-value">Engineers, Scientists & Designers</span>

                    <span className="pass-cred-label">PRIMARY FOCUS</span>
                    <span className="pass-cred-value auth-list">Building Agentic Canvases</span>
                  </div>
                </div>

                <div className="pass-footer">
                  <span className="pass-stamp-role">THE TEAM</span>
                  <button className="pass-contact-btn" onClick={() => window.navigate('/careers')}>Join Team</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <LandingFooter />

      </div>
    </div>
  )
}
