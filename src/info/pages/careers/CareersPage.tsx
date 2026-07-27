import { useState, useRef, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import LandingFooter from '../../components/Footer'
import '../../components/base.css'
import '../../components/layout.css'
import './CareersPage.css'
import CareersForm from './CareersForm'
import GlobeSection from '../../../prelogin/GlobeSection'
import HiringProcess from './HiringProcess'

interface JobPosition {
  id: string
  title: string
  department: string
  locations: string[]
  type: string
  focus: string
  stack: string[]
}

const OPEN_ROLES: JobPosition[] = [
  {
    id: 'role-1',
    title: 'Senior Software Engineer, Agentic Systems',
    department: 'Engineering',
    locations: ['Remote', 'Palo Alto, CA'],
    type: 'Full-time',
    focus: 'Architect and build highly secure multi-agent runtimes, sandboxed execution environments, and real-time collaborative state synchronization engines.',
    stack: ['TypeScript', 'Node.js', 'Docker', 'WebSockets', 'gRPC']
  },
  {
    id: 'role-2',
    title: 'Software Engineer - Network (C++)',
    department: 'Engineering',
    locations: ['Palo Alto, CA', 'Seattle, WA'],
    type: 'Full-time',
    focus: 'Build and optimize low-latency network transfer systems, custom RPC protocols, and high-performance communication systems for ML model execution pipelines.',
    stack: ['C++', 'Linux Systems', 'eBPF', 'TCP/IP', 'gRPC']
  },
  {
    id: 'role-3',
    title: 'Member of Technical Staff - Model Training',
    department: 'Research',
    locations: ['Austin, TX', 'New York, NY', 'Palo Alto, CA', 'Seattle, WA'],
    type: 'Full-time',
    focus: 'Develop infrastructure for pre-training and fine-tuning large reasoning models across high-speed InfiniBand connected H100/A100 clusters.',
    stack: ['PyTorch', 'CUDA', 'Megatron-LM', 'Deepspeed', 'Python']
  },
  {
    id: 'role-4',
    title: 'Network Engineer - ML Infrastructure (High-Speed Interconnects)',
    department: 'Engineering',
    locations: ['Palo Alto, CA'],
    type: 'Full-time',
    focus: 'Design, configure, and maintain our high-performance computing cluster network topology, optimizing for InfiniBand, RoCE, and high-throughput fabric interconnects.',
    stack: ['InfiniBand', 'RoCE v2', 'Leaf-Spine Fabrics', 'BGP', 'Hardware Orchestration']
  },
  {
    id: 'role-5',
    title: 'Exceptional Software Engineer',
    department: 'Engineering',
    locations: ['Austin, TX', 'New York, NY', 'Palo Alto, CA', 'Seattle, WA'],
    type: 'Full-time',
    focus: 'A generalist role for cracked system builders who learn any language or system instantly and ship extremely reliable, production-grade features end-to-end.',
    stack: ['Polyglot', 'Rust', 'Go', 'React', 'System Design']
  },
  {
    id: 'role-6',
    title: 'AI Research Scientist, Reasoning',
    department: 'Research',
    locations: ['Hybrid (Bengaluru)', 'Palo Alto, CA'],
    type: 'Full-time',
    focus: 'Research and deploy novel alignment paradigms, reinforcement learning frameworks, and structured planning trees to push the frontiers of model reasoning capabilities.',
    stack: ['LLM Architectures', 'RLHF / DPO', 'MCTS', 'Python', 'PyTorch']
  },
  {
    id: 'role-7',
    title: 'Product Designer, Developer Experience',
    department: 'Design',
    locations: ['Remote', 'San Francisco, CA'],
    type: 'Full-time',
    focus: 'Design the future of collaborative human-agent workspaces, interactive command playgrounds, and real-time visualization dashboards for agent execution.',
    stack: ['Figma', 'UI/UX Design', 'Design Systems', 'HTML/CSS Prototyping']
  },
  {
    id: 'role-8',
    title: 'Developer Relations Specialist',
    department: 'DevRel',
    locations: ['Remote'],
    type: 'Full-time',
    focus: 'Advocate for developers building on Nothric. Write high-quality technical guides, build open-source starter templates, and host agent hackathons.',
    stack: ['DevRel', 'Technical Writing', 'API Design', 'Node.js', 'Next.js']
  }
]

interface DnaPoint {
  title: string
  description: string
  details: string[]
}

const DNA_POINTS: DnaPoint[] = [
  {
    title: 'Velocity in work',
    description: 'We move with urgency and momentum. We iterate fast, ship early, and constantly refine our systems based on real-world feedback loops.',
    details: [
      'Rapid deployment cycles that prioritize speed over consensus.',
      'Instant feedback systems to measure agent performance in production.',
      'Building momentum through quick, decisive iterations.'
    ]
  },
  {
    title: 'Depth over expansion',
    description: 'We prioritize deep technical solving and core model capabilities over superficial features. We value rigor, focus, and engineering depth.',
    details: [
      'Architecting robust sandboxing environments and execution layers.',
      'Focusing on high-performing models that solve hard reasoning tasks.',
      'Avoiding feature bloat to concentrate on foundational capabilities.'
    ]
  },
  {
    title: 'Curiosity',
    description: 'We are driven by a relentless desire to understand how complex systems behave. We explore new paradigms, question assumptions, and learn continuously.',
    details: [
      'Deep investigation into frontier agentic runtimes.',
      'Exploring and prototyping novel model evaluation setups.',
      'Supporting a culture of learning and continuous discovery.'
    ]
  },
  {
    title: 'High Agency',
    description: 'We expect everyone to operate with full autonomy and ownership. We do not wait for permission; we identify problems and build solutions.',
    details: [
      'End-to-end responsibility of core product and infra components.',
      'Direct contribution to technical decision making and direction.',
      'Operating with high trust, alignment, and velocity.'
    ]
  }
]

export default function CareersPage() {
  const rolesRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = 'Careers | Nothric';
  }, []);

  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-1')
  const [activePointIdx, setActivePointIdx] = useState<number>(0)
  const pointRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleApplyClick = (roleTitle: string) => {
    const idMap: { [key: string]: string } = {
      'Senior Software Engineer, Agentic Systems': 'role-1',
      'Software Engineer - Network (C++)': 'role-2',
      'Member of Technical Staff - Model Training': 'role-3',
      'Network Engineer - ML Infrastructure (High-Speed Interconnects)': 'role-4',
      'Exceptional Software Engineer': 'role-5',
      'AI Research Scientist, Reasoning': 'role-6',
      'Product Designer, Developer Experience': 'role-7',
      'Developer Relations Specialist': 'role-8'
    }
    const roleId = idMap[roleTitle] || 'role-1'
    setSelectedRoleId(roleId)

    // Scroll to the form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  useEffect(() => {
    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: '-35% 0px -35% 0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = pointRefs.current.indexOf(entry.target as HTMLDivElement)
          if (index !== -1) {
            setActivePointIdx(index)
          }
        }
      })
    }, observerOptions)

    pointRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleScrollToRoles = (e: React.MouseEvent) => {
    e.preventDefault()
    rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filteredRoles = OPEN_ROLES;

  return (
    <div className="careers-page-wrapper" style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', backgroundColor: '#020205' }}>

      {/* Main scrolling overlay */}
      <div ref={scrollContainerRef} className="ui-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', zIndex: 10, padding: 0 }}>

        {/* FIRST FOLD: Hero splash occupying exactly 100vh */}
        <div className="careers-first-fold" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', position: 'relative', overflow: 'visible' }}>

          {/* Ambient glows */}
          <div className="ambient-glows">
            <div className="glow-nebula" />
            <div className="glow-planet" />
            <div className="light-streak streak-1" />
            <div className="light-streak streak-2" />
          </div>

          {/* Faint HUD Grid lines */}
          <div className="grid-lines">
            <div className="grid-line" />
            <div className="grid-line" />
            <div className="grid-line" />
          </div>

          {/* Left HUD Bracket SVG */}
          <div className="hud-bracket hud-bracket-left">
            <svg viewBox="0 0 100 1000" preserveAspectRatio="none">
              <path className="hud-line" fill="none" d="M 0, 150 L 50, 150 L 80, 190 L 80, 810 L 50, 850 L 0, 850" />
              <path className="hud-line-glow" fill="none" d="M 0, 150 L 50, 150 L 80, 190 L 80, 810 L 50, 850 L 0, 850" />
              <path className="hud-line" fill="none" d="M 0, 170 L 40, 170 L 65, 200 L 65, 800 L 40, 830 L 0, 830" style={{ opacity: 0.5 }} />
              <circle cx="80" cy="190" r="1.5" fill="rgba(255,255,255,0.4)" />
              <circle cx="80" cy="810" r="1.5" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>

          {/* Right HUD Bracket SVG */}
          <div className="hud-bracket hud-bracket-right">
            <svg viewBox="0 0 100 1000" preserveAspectRatio="none">
              <path className="hud-line" fill="none" d="M 100, 150 L 50, 150 L 20, 190 L 20, 810 L 50, 850 L 100, 850" />
              <path className="hud-line-glow" fill="none" d="M 100, 150 L 50, 150 L 20, 190 L 20, 810 L 50, 850 L 100, 850" />
              <path className="hud-line" fill="none" d="M 100, 170 L 60, 170 L 35, 200 L 35, 800 L 60, 830 L 100, 830" style={{ opacity: 0.5 }} />
              <circle cx="20" cy="190" r="1.5" fill="rgba(255,255,255,0.4)" />
              <circle cx="20" cy="810" r="1.5" fill="rgba(255,255,255,0.4)" />
            </svg>
          </div>

          {/* Unified Navigation Bar */}
          <Navbar />

          {/* Centered Hero Heading */}
          <div className="careers-hero-content">
            <section className="careers-hero">
              <div className="glass-pill-container">
                <span className="glass-pill-badge">Core</span>
                <span className="glass-pill-text">Beyond Standard Intelligence</span>
              </div>
              <h1 className="careers-title">
                Build the Future of <span className="highlight-purple">Agentic AI</span>
              </h1>
              <p className="careers-subtitle">
                We build specialized models, multi-agent runtimes, and collaborative interfaces for developer agent execution. Join us in shaping the next frontier of software automation.
              </p>
            </section>

            {/* Action CTAs */}
            <div className="careers-actions">
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="careers-pill-btn primary"
              >
                Apply Now <span className="careers-btn-arrow">↗</span>
              </button>
              <button onClick={handleScrollToRoles} className="careers-pill-btn outline">
                Open Roles
              </button>
            </div>
          </div>

          {/* Scroll Down Indicator */}
          <div className="careers-scroll-down" onClick={(e) => {
            e.preventDefault();
            const nextSec = document.querySelector('.careers-transition-zone');
            nextSec?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}>
            <span className="scroll-text">Scroll Down</span>
            <div className="scroll-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>
          </div>

        </div>

        {/* TRANSITION ZONE: Adds space and connector header between first and second fold */}
        <div className="careers-transition-zone">
          <div className="vertical-connector-line" />
          <span className="careers-section-label">Core Philosophy</span>
          <h2 className="careers-transition-heading">Operating at Nothric</h2>
          <p className="careers-transition-subheading">
            Our values aren't just words on a wall. They represent the foundational principles we live by to build the next generation of developer agents.
          </p>
        </div>

        {/* SECOND FOLD: DNA of Nothric Section */}
        <section className="why-nothric-section">
          <div className="glow-second-left" />
          <div className="glow-second-right" />
          <div className="why-nothric-left">
            <span className="careers-section-label">Why Nothric</span>
            <h2 className="why-nothric-title">DNA of Nothric</h2>
            <p className="why-nothric-subtitle">
              Our core operating principles and values that guide how we work and build the future of agentic AI.
            </p>
          </div>

          <div className="why-nothric-right">
            {DNA_POINTS.map((point, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  pointRefs.current[idx] = el
                }}
                className={`why-nothric-point-block ${activePointIdx === idx ? 'active' : 'inactive'}`}
              >
                <h3 className="why-nothric-point-heading">{point.title}</h3>
                <p className="why-nothric-point-desc">{point.description}</p>
                <div className="why-nothric-details-list">
                  {point.details.map((detail, dIdx) => (
                    <div key={dIdx} className="why-nothric-detail-item">
                      <span className="detail-bullet-icon">✦</span>
                      <span className="why-nothric-detail-text">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* THIRD FOLD: Featured Roles */}
        <section ref={rolesRef} className="featured-roles-section">
          <div className="roles-grid-layout">

            {/* Centered Header Above the Cards */}
            <div className="roles-centered-header">
              <span className="careers-section-label">Join us</span>
              <h2 className="roles-section-title">Featured roles</h2>
              <p className="roles-section-subtitle">
                We are always looking for high-agency, depth-focused builders to join our core team.
              </p>
            </div>

            {/* Grid of Job Cards */}
            <div className="roles-list-container-new">
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    className="role-grid-card"
                    onClick={() => handleApplyClick(role.title)}
                  >
                    <div className="role-card-header">
                      <span className="role-card-dept">{role.department}</span>
                      <span className="role-card-arrow">↗</span>
                    </div>

                    <h3 className="role-card-title">{role.title}</h3>

                    <div className="role-card-locations">
                      {role.locations.map((loc, lIdx) => (
                        <span key={lIdx} className="role-card-loc">
                          <span className="loc-dot" /> {loc}
                        </span>
                      ))}
                    </div>

                    <div className="role-card-stack">
                      {role.stack.map((tech, tIdx) => (
                        <span key={tIdx} className="role-card-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-roles-msg">
                  No open positions listed in this segment.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Global Routing Network Globe Section */}
        <GlobeSection
          tag="Global Team"
          title="Collaboration across borders"
          points={[
            {
              boldText: "Remote-first culture:",
              normalText: "We operate as a distributed team. You can work from anywhere in the world, with core hubs to sync and brainstorm."
            },
            {
              boldText: "High agency & focus:",
              normalText: "We prioritize async communication and trust. You own your time and structure your hours for deep, uninterrupted focus."
            },
            {
              boldText: "Global integration:",
              normalText: "Even when working across timezones, our systems and team channels keep us aligned without redundant sync meetings."
            }
          ]}
          metrics={[
            { num: "100%", label: "remote & distributed team" },
            { num: "4+", label: "timezones coordinated daily" }
          ]}
          showConnections={true}
        />

        {/* Pathway / Hiring Process Fold */}
        <HiringProcess />

        {/* FOURTH FOLD: Application Submission Form */}
        <CareersForm
          formRef={formRef}
          selectedRoleId={selectedRoleId}
          setSelectedRoleId={setSelectedRoleId}
        />

        {/* Page Conclusion */}
        <div className="careers-footer-divider">
          <div className="divider-line left"></div>
          <div className="divider-content">
            <span className="divider-tag-highlight">Let's build the future together. See you at Nothric.</span>
          </div>
          <div className="divider-line right"></div>
        </div>

        {/* Footer */}
        <LandingFooter />
      </div>
    </div>
  )
}
