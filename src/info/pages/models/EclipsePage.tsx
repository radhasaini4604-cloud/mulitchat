import { useEffect } from 'react'
import BorderGlow from '../../components/BorderGlow'
import ModelLayout from '../../components/ModelLayout'

export default function EclipsePage() {
  useEffect(() => {
    document.title = 'Eclipse | Nothric';
  }, []);

  const glowColors = ['#be185d', '#fda4af', '#ffffff']
  const glows = {
    glow1: 'rgba(190, 24, 93, 0.15)',
    glow2: 'rgba(225, 29, 72, 0.12)',
    glow3: 'rgba(254, 226, 226, 0.25)',
    glow4: 'rgba(190, 24, 93, 0.10)',
    glow5: 'rgba(225, 29, 72, 0.10)'
  }
  const textColor = '#831843'

  return (
    <ModelLayout modelKey="eclipse" glows={glows}>
      {/* Hero Section (Fold 1) */}
      <main className="hero-content">
        <div className="badge">
          <span className="badge-new">MODEL</span>
          <span className="badge-text">FRONTIER REASONING</span>
        </div>

        <h1 className="hero-title" style={{ textTransform: 'capitalize' }}>
          introducing <span className="highlight-purple" style={{ color: textColor }}>Eclipse 4.2</span>
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '16px' }}>
          High-Tier Multi-Step Autonomous Planning & Action. Subsidized cost structure provides ultra-low latency inference for developers globally.
        </p>
        <p className="hero-release-date" style={{ fontSize: '0.95rem', fontWeight: 600, color: textColor, marginBottom: '32px', opacity: 0.9 }}>
          Release Date: Our first model on 01-Sep-2025
        </p>
        <div className="hero-actions">
          <BorderGlow
            edgeSensitivity={20}
            glowColor="336 69 30"
            backgroundColor="#0f172a"
            borderRadius={16}
            glowRadius={50}
            glowIntensity={2.5}
            coneSpread={30}
            animated={true}
            colors={glowColors}
            className="btn-primary-glow"
          >
            <button className="btn-primary-inner">Get started</button>
          </BorderGlow>
          <a
            href="#/docs"
            className="btn-secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Read docs
          </a>
        </div>
      </main>

      {/* Detailed Technical Specs Section (Typographic Layout) */}
      <section className="details-section reveal-on-scroll" id="about" style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px', textAlign: 'left' }}>
        <h2 className="premium-reveal-item premium-delay-1" style={{ fontSize: '2.5rem', color: textColor, marginBottom: '24px', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Architectural Overview & Agentic Execution Loops
        </h2>
        <p className="premium-reveal-item premium-delay-2" style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.8, marginBottom: '48px' }}>
          Eclipse 4.2 represents a milestone in multi-agent autonomous reasoning. Built on a foundation of GPT Next reasoning baseline weights, the model specializes in open-ended, complex planning. Rather than solving problems linearly, Eclipse decomposes high-level goals into modular, parallel task trees, spawning dedicated sub-agents to execute shell scripts, compile code, search the web, and inspect environments simultaneously, reporting results back to a central orchestrator.
        </p>

        <h3 className="premium-reveal-item premium-delay-3" style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>
          Multi-Subagent Instantiation
        </h3>
        <p className="premium-reveal-item premium-delay-4" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, marginBottom: '32px' }}>
          By allocating tasks to isolated sub-agents, Eclipse 4.2 executes parallel software engineering operations. If a project requires adding test coverage while upgrading code models, separate sub-agents conduct these modifications simultaneously in sandboxed worktrees, accelerating development velocity and preventing global code state corruption.
        </p>

        <h3 className="premium-reveal-item premium-delay-5" style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>
          Interactive Tool-Use Integration
        </h3>
        <p className="premium-reveal-item premium-delay-6" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, marginBottom: '32px' }}>
          Unlike standard conversational APIs, Eclipse natively drives automated developer tools. The system directly navigates headless web browsers, reads and writes files in local workspaces, and runs terminal commands within secure sandboxed hosts. This direct interface enables true autonomous problem solving without requiring developer manual intervention.
        </p>

        <h3 className="premium-reveal-item premium-delay-7" style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>
          Self-Correction & Refinement Loops
        </h3>
        <p className="premium-reveal-item premium-delay-8" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, marginBottom: '0' }}>
          Every execution is verified before final delivery. Sub-agents run compilers, tests, and linters dynamically inside their containers. If a runtime warning or missing dependency is flagged, Eclipse initiates self-correction loops automatically, editing code configurations until the environment builds cleanly and compiles with zero faults.
        </p>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section reveal-on-scroll" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 80px 20px' }}>
        <div className="details-header" style={{ marginBottom: '40px', textAlign: 'left' }}>
          <span className="details-subtitle" style={{ color: textColor }}>Capability Benchmarks</span>
          <h2 className="details-title" style={{ fontSize: '2rem', textAlign: 'left' }}>Legacy Models vs. Eclipse 4.2</h2>
        </div>

        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Agentic Capability</th>
                <th>Legacy Single-Agent Models</th>
                <th className="col-highlight" style={{ color: textColor }}>
                  Eclipse 4.2 <span className="badge-best" style={{ background: textColor }}>Best</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Autonomous Goal Splits</td>
                <td>Serial (Single execution context thread)</td>
                <td className="col-highlight" style={{ color: textColor }}>Parallel (Spawns up to 10 sub-agents concurrently)</td>
              </tr>
              <tr>
                <td>Sandboxed Execution</td>
                <td>Requires manual environment configurations</td>
                <td className="col-highlight" style={{ color: textColor }}>Native (Secure cloud shell environments provided)</td>
              </tr>
              <tr>
                <td>Compiler Verification</td>
                <td>None (Output text is unverified syntactically)</td>
                <td className="col-highlight" style={{ color: textColor }}>Automatic (Builds, tests, and refines loops inside sandbox)</td>
              </tr>
              <tr>
                <td>Tool-Use Integration</td>
                <td>Limited (API readouts and text generation only)</td>
                <td className="col-highlight" style={{ color: textColor }}>Full (Drives browsers, shell terminals, and file editors)</td>
              </tr>
              <tr>
                <td>Pricing Profile</td>
                <td>$15.00 per 1M Tokens (Standard pricing models)</td>
                <td className="col-highlight" style={{ color: textColor }}>$1.20 per 1M Tokens (Subsidized routing rate)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Visual Pipeline Flow Cards Section */}
      <section className="capabilities-section reveal-on-scroll" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 80px 20px', textAlign: 'left' }}>
        <div className="details-header" style={{ marginBottom: '40px', textAlign: 'left' }}>
          <span className="details-subtitle" style={{ color: textColor }}>The Orchestrator Loop</span>
          <h2 className="details-title" style={{ fontSize: '2rem', textAlign: 'left' }}>How Eclipse 4.2 Solves Tasks</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="workspace-columns-responsive">
          {/* Card 1: Goal Split */}
          <div 
            style={{ 
              background: 'rgba(255, 255, 255, 0.6)', 
              backdropFilter: 'blur(20px)', 
              WebkitBackdropFilter: 'blur(20px)', 
              border: '1px solid rgba(15, 23, 42, 0.08)', 
              borderRadius: '16px', 
              padding: '24px', 
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(131, 24, 67, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, marginBottom: '20px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, margin: '0 0 8px 0' }}>1. Decompose Goal</h4>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Eclipse analyzes the main objective, performs research, and breaks it down into a multi-step task list.
            </p>
          </div>

          {/* Card 2: Dispatch Subagents */}
          <div 
            style={{ 
              background: 'rgba(255, 255, 255, 0.6)', 
              backdropFilter: 'blur(20px)', 
              WebkitBackdropFilter: 'blur(20px)', 
              border: '1px solid rgba(15, 23, 42, 0.08)', 
              borderRadius: '16px', 
              padding: '24px', 
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(131, 24, 67, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, marginBottom: '20px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, margin: '0 0 8px 0' }}>2. Parallel Dispatch</h4>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              The central orchestrator spawns multiple sub-agents concurrently, routing target tasks to dedicated sandboxed execution runners.
            </p>
          </div>

          {/* Card 3: Verify & Compile */}
          <div 
            style={{ 
              background: 'rgba(255, 255, 255, 0.6)', 
              backdropFilter: 'blur(20px)', 
              WebkitBackdropFilter: 'blur(20px)', 
              border: '1px solid rgba(15, 23, 42, 0.08)', 
              borderRadius: '16px', 
              padding: '24px', 
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(15, 23, 42, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.02)';
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(131, 24, 67, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, marginBottom: '20px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, margin: '0 0 8px 0' }}>3. Verify & Compile</h4>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Eclipse consolidates sub-agent outputs, runs compilers or tests inside the sandbox, and executes self-correction loops until verified.
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration Partners Section */}
      <section className="reveal-on-scroll" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 40px 20px', textAlign: 'left' }}>
        <h3 className="premium-reveal-item premium-delay-1" style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', fontWeight: 700 }}>
          Collaboration Partners
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }} className="workspace-columns-responsive">
          {/* Card 1: OpenAI */}
          <div className="premium-reveal-item premium-delay-2" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', background: 'rgba(131, 24, 67, 0.1)', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <h4 style={{ fontSize: '1rem', color: '#1e293b', margin: 0, fontWeight: 600 }}>OpenAI</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'left', lineHeight: 1.45, margin: 0 }}>
                Provides core GPT Next model weights for high-fidelity multi-step reasoning capabilities.
              </p>
            </div>
          </div>
          {/* Card 2: Antigravity IDE */}
          <div className="premium-reveal-item premium-delay-3" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', background: 'rgba(131, 24, 67, 0.1)', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <h4 style={{ fontSize: '1rem', color: '#1e293b', margin: 0, fontWeight: 600 }}>Antigravity 2.0</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'left', lineHeight: 1.45, margin: 0 }}>
                Hosts sandboxed terminals, filesystem APIs, and test containers for runtime validation.
              </p>
            </div>
          </div>
          {/* Card 3: Nothric Team */}
          <div className="premium-reveal-item premium-delay-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', background: 'rgba(131, 24, 67, 0.1)', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <h4 style={{ fontSize: '1rem', color: '#1e293b', margin: 0, fontWeight: 600 }}>Nothric Team</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'left', lineHeight: 1.45, margin: 0 }}>
                Orchestrates central query parsing, sub-agent spawning, task list assembly, and output verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer before footer */}
      <div style={{ height: '64px' }} />
    </ModelLayout>
  )
}
