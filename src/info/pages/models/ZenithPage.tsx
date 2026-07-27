import { useEffect } from 'react'
import BorderGlow from '../../components/BorderGlow'
import ModelLayout from '../../components/ModelLayout'

export default function ZenithPage() {
  useEffect(() => {
    document.title = 'Zenith | Nothric';
  }, []);

  const glowColors = ['#1d4ed8', '#60a5fa', '#ffffff']
  const glows = {
    glow1: 'rgba(29, 78, 216, 0.15)',
    glow2: 'rgba(59, 130, 246, 0.12)',
    glow3: 'rgba(219, 234, 254, 0.25)',
    glow4: 'rgba(29, 78, 216, 0.10)',
    glow5: 'rgba(59, 130, 246, 0.10)'
  }
  const textColor = '#1e3a8a'

  return (
    <ModelLayout modelKey="zenith" glows={glows}>
      {/* Hero Section (Fold 1) */}
      <main className="hero-content">
        <div className="badge">
          <span className="badge-new">MODEL</span>
          <span className="badge-text">ANALYTICAL ELITE</span>
        </div>

        <h1 className="hero-title" style={{ textTransform: 'capitalize' }}>
          introducing <span className="highlight-purple" style={{ color: textColor }}>Zenith 1.1</span>
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '16px' }}>
          Frontier Logic, Code Generation, and Synthesis. Subsidized cost structure provides ultra-low latency inference for developers globally.
        </p>
        <p className="hero-release-date" style={{ fontSize: '0.95rem', fontWeight: 600, color: textColor, marginBottom: '32px', opacity: 0.9 }}>
          Release Date: 01-Nov-2025
        </p>
        <div className="hero-actions">
          <BorderGlow
            edgeSensitivity={20}
            glowColor="224 64 33"
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

      {/* Model Technical Specifications Section (Fold 2) */}
      <section className="details-section" id="about">
        <div className="details-header reveal-on-scroll">
          <span className="details-subtitle">Model Architecture</span>
          <h2 className="details-title">Built on Claude 4.6 Opus</h2>
        </div>

        <div className="details-grid">
          {/* Left Column: Pipeline Visualizer */}
          <div className="pipeline-container reveal-on-scroll reveal-delay-1">
            <div>
              <div className="pipeline-node">
                <div className="pipeline-node-num">1</div>
                <div className="pipeline-node-content">
                  <span className="pipeline-node-text">Claude 4.6 Opus Base</span>
                  <span className="pipeline-node-subtext">Maximum analytical intelligence, code planning, and cross-functional logic.</span>
                </div>
              </div>
              <div className="pipeline-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <div className="pipeline-node">
                <div className="pipeline-node-num">2</div>
                <div className="pipeline-node-content">
                  <span className="pipeline-node-text">Nothric Execution Sandbox</span>
                  <span className="pipeline-node-subtext">A secure cloud environment where Zenith compiles code, checks syntax, and executes tests before replying.</span>
                </div>
              </div>
              <div className="pipeline-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div>
              <div className="pipeline-node" style={{ borderColor: 'rgba(147, 139, 180, 0.3)' }}>
                <div className="pipeline-node-num" style={{ background: textColor, color: '#ffffff' }}>3</div>
                <div className="pipeline-node-content">
                  <span className="pipeline-node-text">Auto-Refinement Loops</span>
                  <span className="pipeline-node-subtext">Iterative self-debugging loops that resolve compiler errors autonomously.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Explanations */}
          <div className="details-content">
            <div className="feature-item reveal-on-scroll reveal-delay-1">
              <div className="feature-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div>
                <h3 className="feature-title">Why Claude 4.6 Opus?</h3>
                <p className="feature-description">Zenith uses the world's most intelligent logic engine to draft code, evaluate structural designs, and review system implementations.</p>
              </div>
            </div>
            <div className="feature-item reveal-on-scroll reveal-delay-2">
              <div className="feature-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                </svg>
              </div>
              <div>
                <h3 className="feature-title">Sandboxed Compiler</h3>
                <p className="feature-description">Direct connection to a secure developer environment. Zenith tests its changes automatically so you only get working code.</p>
              </div>
            </div>
            <div className="feature-item reveal-on-scroll reveal-delay-3">
              <div className="feature-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="feature-title">Autocorrect Logic</h3>
                <p className="feature-description">Questions its own logic. Corrects structural syntax, missing variables, or runtime warnings before finishing the request.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost & Benchmark Comparison Section (Fold 3) */}
      <section className="comparison-section reveal-on-scroll">
        <div className="details-header">
          <span className="details-subtitle" style={{ color: textColor }}>Nothric Subsidized Economics</span>
          <h2 className="details-title">Unified Architecture Pricing</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '12px', maxWidth: '600px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
            Original platforms charge significant premiums. By consolidating requests onto our unified routing layers, Nothric offers massive savings.
          </p>
        </div>

        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Metric / Capability</th>
                <th className="col-highlight" style={{ color: textColor }}>
                  Zenith 1.1 <span className="badge-best" style={{ background: textColor }}>Best</span>
                </th>
                <th>Standard Claude Opus API (Anthropic)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>API Cost (per Million Tokens)</td>
                <td className="col-highlight" style={{ color: textColor }}>$1.50 (Subsidized)</td>
                <td>$15.00 (10x higher)</td>
              </tr>
              <tr>
                <td>Code Compilation Rate</td>
                <td className="col-highlight" style={{ color: textColor }}>98.4% working first-run</td>
                <td>83% working first-run</td>
              </tr>
              <tr>
                <td>Developer Sandbox Cost</td>
                <td className="col-highlight" style={{ color: textColor }}>$0.00 (Included)</td>
                <td>+$50.00 / month (seat fee)</td>
              </tr>
              <tr>
                <td>Multi-File Refactoring</td>
                <td className="col-highlight" style={{ color: textColor }}>Supported natively</td>
                <td>Requires custom script setup</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Custom Comparison Section */}
      <section className="comparison-section reveal-on-scroll">
        <div className="details-header">
          <span className="details-subtitle" style={{ color: textColor }}>Understanding which frontier model to choose</span>
          <h2 className="details-title">Zenith vs Eclipse</h2>
        </div>
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th className="col-highlight" style={{ color: textColor }}>
                  Zenith 1.1 <span className="badge-best" style={{ background: textColor }}>Current</span>
                </th>
                <th>Eclipse 4.2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Core Focus</td>
                <td className="col-highlight" style={{ color: textColor }}>Deep Single-Threaded Logic & Code Generation</td>
                <td>Multi-Agent Autonomous Workflows</td>
              </tr>
              <tr>
                <td>Architecture</td>
                <td className="col-highlight" style={{ color: textColor }}>Claude 4.6 Opus + Secure Sandbox Compiler</td>
                <td>GPT Next + Parallel Subagent Orchestrator</td>
              </tr>
              <tr>
                <td>Ideal Use Cases</td>
                <td className="col-highlight" style={{ color: textColor }}>Complex algorithms, large refactors, proofs</td>
                <td>Open-ended research, system migrations</td>
              </tr>
              <tr>
                <td>Execution Style</td>
                <td className="col-highlight" style={{ color: textColor }}>Serial, intense analytical reasoning</td>
                <td>Parallel tasks across browser and shell tools</td>
              </tr>
              <tr>
                <td>Pricing Profile</td>
                <td className="col-highlight" style={{ color: textColor }}>$1.50 per 1M Tokens</td>
                <td>$1.20 per 1M Tokens</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Model Capabilities Grid Section (Fold 4) */}
      <section className="capabilities-section reveal-on-scroll" id="features">
        <div className="details-header">
          <span className="details-subtitle">Capabilities</span>
          <h2 className="details-title">Engineered For Autonomous Scaling</h2>
        </div>

        <div className="capabilities-grid">
          <div className="capability-card reveal-on-scroll reveal-delay-1">
            <div className="capability-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h3 className="capability-title">Full-Stack Development</h3>
            <p className="capability-description">Let Zenith build clean React UIs, design Express backends, and hook up relational databases all within one execution.</p>
          </div>
          <div className="capability-card reveal-on-scroll reveal-delay-2">
            <div className="capability-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </div>
            <h3 className="capability-title">Automatic Testing</h3>
            <p className="capability-description">Automatically drafts and runs Mocha, Jest, or PyTest suites inside its sandbox to verify performance characteristics.</p>
          </div>
          <div className="capability-card reveal-on-scroll reveal-delay-3">
            <div className="capability-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h3 className="capability-title">SecurityCard Auditing</h3>
            <p className="capability-description">Reviews existing repositories for injection vectors, buffer overflows, and memory leaks, providing exact secure refactoring patterns.</p>
          </div>
        </div>
      </section>
    </ModelLayout>
  )
}
