import { useEffect } from 'react'
import BorderGlow from '../../components/BorderGlow'
import ModelLayout from '../../components/ModelLayout'

export default function VectorPage() {
  useEffect(() => {
    document.title = 'Vector | Nothric';
  }, []);

  const glowColors = ['#f59e0b', '#fbbf24', '#ffffff']
  const glows = {
    glow1: 'rgba(217, 119, 6, 0.15)',
    glow2: 'rgba(245, 158, 11, 0.12)',
    glow3: 'rgba(253, 230, 138, 0.25)',
    glow4: 'rgba(217, 119, 6, 0.10)',
    glow5: 'rgba(245, 158, 11, 0.10)'
  }
  const textColor = '#78350f'

  return (
    <ModelLayout modelKey="vector" glows={glows}>
      {/* Hero Section (Fold 1) */}
      <main className="hero-content" style={{ maxWidth: '900px' }}>
        <div className="badge">
          <span className="badge-new">MODEL</span>
          <span className="badge-text">HIGH-DIMENSIONAL</span>
        </div>

        <h1 className="hero-title" style={{ textTransform: 'capitalize' }}>
          introducing <span className="highlight-purple" style={{ color: textColor }}>Vector 7.4</span>
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '16px', maxWidth: '780px' }}>
          Subsidized cost structure delivers ultra-low latency inference globally.
          <br />
          Engineered for high-speed semantic processing.
        </p>
        <p className="hero-release-date" style={{ fontSize: '0.95rem', fontWeight: 600, color: textColor, marginBottom: '32px', opacity: 0.9 }}>
          Release Date: 24-Feb-2026
        </p>
        <div className="hero-actions">
          <BorderGlow
            edgeSensitivity={20}
            glowColor="22 78 26"
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
          <h2 className="details-title">Built on Llama 3.70b on Groq</h2>
        </div>

        <div className="details-grid">
          {/* Left Column: Pipeline Visualizer */}
          <div className="pipeline-container reveal-on-scroll reveal-delay-1">
            <div>
              <div className="pipeline-node">
                <div className="pipeline-node-num">1</div>
                <div className="pipeline-node-content">
                  <span className="pipeline-node-text">Llama 3.70b Base</span>
                  <span className="pipeline-node-subtext">Ultra-rich, multi-lingual model trained on massive corpus.</span>
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
                  <span className="pipeline-node-text">Groq LPU Processing</span>
                  <span className="pipeline-node-subtext">Sub-60ms time-to-first-token running on customized LPU architectures.</span>
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
                  <span className="pipeline-node-text">Embedding Vector Alignment</span>
                  <span className="pipeline-node-subtext">Custom normalization steps mapping query terms directly to semantic vectors.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Explanations */}
          <div className="details-content">
            <div className="feature-item reveal-on-scroll reveal-delay-1">
              <div className="feature-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="feature-title">Why Llama 3.70b?</h3>
                <p className="feature-description">Llama 3.70b is one of the most capable models for semantic querying. Hosted on Groq infrastructure, it achieves zero-queue parallel requests.</p>
              </div>
            </div>
            <div className="feature-item reveal-on-scroll reveal-delay-2">
              <div className="feature-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div>
                <h3 className="feature-title">High-Dimensional Mapping</h3>
                <p className="feature-description">Generates dense 1536-dimension embeddings perfect for RAG, classification, and vector database indices.</p>
              </div>
            </div>
            <div className="feature-item reveal-on-scroll reveal-delay-3">
              <div className="feature-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div>
                <h3 className="feature-title">Zero Token Waste</h3>
                <p className="feature-description">Highly compressed embedding representation means you pay less per request while securing high semantic accuracy.</p>
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
                  Vector 7.4 <span className="badge-best" style={{ background: textColor }}>Best</span>
                </th>
                <th>Standard Llama 3.70b (Other clouds)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>API Cost (per Million Tokens)</td>
                <td className="col-highlight" style={{ color: textColor }}>$0.05 (Subsidized)</td>
                <td>$0.59 (11.8x higher)</td>
              </tr>
              <tr>
                <td>Response Latency (TTFT)</td>
                <td className="col-highlight" style={{ color: textColor }}>~60ms</td>
                <td>~350ms</td>
              </tr>
              <tr>
                <td>Throughput Rate</td>
                <td className="col-highlight" style={{ color: textColor }}>300+ tokens/sec</td>
                <td>55 tokens/sec</td>
              </tr>
              <tr>
                <td>Context Limit</td>
                <td className="col-highlight" style={{ color: textColor }}>128K tokens</td>
                <td>32K tokens</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Model Overview Section */}
      <section className="reveal-on-scroll" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'left' }}>
        <h3 className="premium-reveal-item premium-delay-1" style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          Vector 7.4 Model Overview
        </h3>
        <p className="premium-reveal-item premium-delay-2" style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, marginBottom: '32px' }}>
          Vector 7.4 is a frontier-class, high-dimensional inference model meticulously engineered to power complex autonomous agents, multi-step reasoning loops, and massive semantic retrieval operations. By compiling unstructured context directly into dense 1536-dimension embeddings, Vector 7.4 achieves absolute query precision at sub-second speeds. The architecture is natively designed to bypass standard cloud computing queue delays, making it the premier engine for enterprise-grade vector indexing, semantic search, and real-time retrieval-augmented generation (RAG) pipelines.
        </p>

        <h4 className="premium-reveal-item premium-delay-3" style={{ fontSize: '1.2rem', color: '#1e293b', marginBottom: '16px' }}>Core Specifications</h4>
        <ul className="premium-reveal-item premium-delay-4" style={{ color: '#475569', lineHeight: 1.8, paddingLeft: '24px', fontSize: '1.05rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li>
            <strong style={{ color: '#334155' }}>Super Fast Execution Speed:</strong> Compresses time-to-first-token down to a sub-60ms window, delivering near-instantaneous responses that allow agents to execute multiple parallel background calls without compounding latency.
          </li>
          <li>
            <strong style={{ color: '#334155' }}>Beyond 70 Billion Parameters:</strong> Harnesses an ultra-deep Llama 3 70B parameter baseline, enriched through specialized post-training optimization to offer advanced reasoning, reasoning paths, and math comprehension.
          </li>
          <li>
            <strong style={{ color: '#334155' }}>Powered by LPU and Nothric GPU:</strong> Integrates a synchronized hardware routing layer that maps lightweight tasks to Groq's custom LPU architectures, while offloading high-dimensional matrix mathematics to dedicated Nothric GPU clusters.
          </li>
          <li>
            <strong style={{ color: '#334155' }}>Supported with Real-Time Web Search:</strong> Natively queries live web indexes on-the-fly, allowing the model to ground its reasoning steps in verified, real-time facts and prevent hallucination during time-sensitive tasks.
          </li>
          <li>
            <strong style={{ color: '#334155' }}>More Refined System Prompt:</strong> Features strict steering capabilities that allow developers to lock in system instructions, ensuring the model never breaks character or violates structural output formats (JSON/Markdown).
          </li>
        </ul>
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
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 className="capability-title">Semantic Search Engine</h3>
            <p className="capability-description">Search millions of documents, logs, and files by their actual meaning instead of simple keywords. Find the exact information you need in milliseconds.</p>
          </div>
          <div className="capability-card reveal-on-scroll reveal-delay-2">
            <div className="capability-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
                <line x1="9" y1="2" x2="9" y2="22" />
                <line x1="15" y1="2" x2="15" y2="22" />
              </svg>
            </div>
            <h3 className="capability-title">Smart Knowledge Retrieval</h3>
            <p className="capability-description">Connect your private company databases or document folders directly to the model. It reads and pulls the correct paragraphs to answer customer questions factually.</p>
          </div>
          <div className="capability-card reveal-on-scroll reveal-delay-3">
            <div className="capability-icon-wrapper" style={{ color: textColor, background: `rgba(147, 139, 180, 0.15)` }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="capability-title">Automatic Ticket Grouping</h3>
            <p className="capability-description">Organize thousands of incoming customer tickets, emails, or user requests automatically. It groups similar issues together without any manual tags.</p>
          </div>
        </div>
      </section>

      {/* Collaboration Partners Section */}
      <section className="reveal-on-scroll" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 20px 40px 20px', textAlign: 'left' }}>
        <h3 className="premium-reveal-item premium-delay-1" style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>Collaboration Partners</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {/* Card 1 */}
          <div className="premium-reveal-item premium-delay-2" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="2" width="20" height="20" rx="2" ry="2" /><path d="M6 12h12M12 6v12" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <h4 style={{ fontSize: '1rem', color: '#1e293b', margin: 0, fontWeight: 600 }}>Groq</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'left', lineHeight: 1.45, margin: 0 }}>
                Provides the ultra-fast LPU hardware infrastructure to run Llama 3 70B with sub-60ms processing speeds.
              </p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="premium-reveal-item premium-delay-3" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <h4 style={{ fontSize: '1rem', color: '#1e293b', margin: 0, fontWeight: 600 }}>Tavily API</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'left', lineHeight: 1.45, margin: 0 }}>
                Powers our real-time search interface, enabling the model to retrieve current web information.
              </p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="premium-reveal-item premium-delay-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <h4 style={{ fontSize: '1rem', color: '#1e293b', margin: 0, fontWeight: 600 }}>Google Cloud</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'left', lineHeight: 1.45, margin: 0 }}>
                Hosts our supplemental models, databases, and general cloud computing infrastructure.
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
