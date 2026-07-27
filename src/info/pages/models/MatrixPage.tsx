import { useEffect } from 'react'
import BorderGlow from '../../components/BorderGlow'
import ModelLayout from '../../components/ModelLayout'

export default function MatrixPage() {
  useEffect(() => {
    document.title = 'Matrix | Nothric';
  }, []);

  const glowColors = ['#0f766e', '#2dd4bf', '#ffffff']
  const glows = {
    glow1: 'rgba(15, 118, 110, 0.15)',
    glow2: 'rgba(20, 184, 166, 0.12)',
    glow3: 'rgba(204, 251, 241, 0.25)',
    glow4: 'rgba(15, 118, 110, 0.10)',
    glow5: 'rgba(20, 184, 166, 0.10)'
  }
  const textColor = '#134e4a'

  return (
    <ModelLayout modelKey="matrix" glows={glows}>
      {/* Hero Section (Fold 1) */}
      <main className="hero-content">
        <div className="badge">
          <span className="badge-new">MODEL</span>
          <span className="badge-text">STRUCTURED DATA</span>
        </div>

        <h1 className="hero-title" style={{ textTransform: 'capitalize' }}>
          introducing <span className="highlight-purple" style={{ color: textColor }}>Matrix 2.4</span>
        </h1>
        <p className="hero-subtitle" style={{ marginBottom: '16px' }}>
          Real-Time Visual Comprehension & Structured Outputs. Subsidized cost structure provides ultra-low latency inference for developers globally.
        </p>
        <p className="hero-release-date" style={{ fontSize: '0.95rem', fontWeight: 600, color: textColor, marginBottom: '32px', opacity: 0.9 }}>
          Release Date: Jan 18 2026
        </p>
        <div className="hero-actions">
          <BorderGlow
            edgeSensitivity={20}
            glowColor="176 61 19"
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
          Architectural Overview & Visual Parsing Mechanics
        </h2>
        <p className="premium-reveal-item premium-delay-2" style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.8, marginBottom: '48px' }}>
          Matrix 2.4 represents a paradigm shift in real-time visual computing. Built on Groq's high-throughput Llama 3.2 Vision baseline, the model executes concurrent vision-text evaluation directly on custom LPU (Language Processing Unit) accelerators. By processing raw visual data directly at the hardware layer, Matrix 2.4 translates complex multi-column documents, tables, handwritten invoices, and charts into structured databases or clean tabular representations in a single step, bypassing typical translation latency.
        </p>

        <h3 className="premium-reveal-item premium-delay-3" style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>
          State-of-the-Art Groq Vision Integration
        </h3>
        <p className="premium-reveal-item premium-delay-4" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, marginBottom: '32px' }}>
          The integration of Groq's Llama 3.2 Vision baseline enables Matrix 2.4 to achieve sub-90ms image parsing speeds. Rather than passing visual tokens through separate downstream OCR software or translation middleware, our unified pipeline evaluates visual features and semantic context simultaneously. This yields ultra-low-latency responses that are ideal for interactive, visually intensive applications.
        </p>

        <h3 className="premium-reveal-item premium-delay-5" style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>
          Deterministic Schema Conformance
        </h3>
        <p className="premium-reveal-item premium-delay-6" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, marginBottom: '32px' }}>
          To support enterprise-grade systems, Matrix 2.4 incorporates constrained context-free grammars directly during neural token selection. By restricting token probability maps to specific syntax rules (e.g., valid JSON or query-ready SQL structures), the model guarantees that outputs conform 100% to defined schemas. This native validation eliminates traditional try-catch loops and output correction layers.
        </p>

        <h3 className="premium-reveal-item premium-delay-7" style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '16px', fontWeight: 700 }}>
          Subsidized Computational Economics
        </h3>
        <p className="premium-reveal-item premium-delay-8" style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.7, marginBottom: '0' }}>
          Through Nothric's custom-engineered request routing layer, we consolidate multi-modal compute demands to offer highly subsidized economics. Developers can run high-density document parsing workflows at a fraction of the cost of legacy cloud vision services, making autonomous, large-scale data extraction pipelines viable for any project.
        </p>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section reveal-on-scroll" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 80px 20px' }}>
        <div className="details-header" style={{ marginBottom: '40px', textAlign: 'left' }}>
          <span className="details-subtitle" style={{ color: textColor }}>Capability Benchmarks</span>
          <h2 className="details-title" style={{ fontSize: '2rem', textAlign: 'left' }}>Legacy Pipeline vs. Matrix 2.4</h2>
        </div>

        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Pipeline Feature</th>
                <th>Legacy Vision Mode</th>
                <th className="col-highlight" style={{ color: textColor }}>
                  Matrix 2.4 <span className="badge-best" style={{ background: textColor }}>Best</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Processing Latency</td>
                <td>450ms - 1.2s (Serial OCR + LLM execution)</td>
                <td className="col-highlight" style={{ color: textColor }}>&lt;90ms (Direct visual tokenization)</td>
              </tr>
              <tr>
                <td>OCR Dependency</td>
                <td>Required (Separate text extraction stage)</td>
                <td className="col-highlight" style={{ color: textColor }}>None (Direct native pixel parsing)</td>
              </tr>
              <tr>
                <td>Schema Conformance</td>
                <td>~94% success (Relies on post-parsing Regex/JSON logic)</td>
                <td className="col-highlight" style={{ color: textColor }}>100% Guaranteed (Neural grammar constraints)</td>
              </tr>
              <tr>
                <td>Chart & Table Alignment</td>
                <td>Unstable (Loses spatial relations on wrap-arounds)</td>
                <td className="col-highlight" style={{ color: textColor }}>Stable (Cross-attention mapping)</td>
              </tr>
              <tr>
                <td>JSON Escaping Errors</td>
                <td>Frequent syntax faults with nested quotes</td>
                <td className="col-highlight" style={{ color: textColor }}>0% (Constrained syntax-directed parsing)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Visual Pipeline Flow Cards Section */}
      <section className="capabilities-section reveal-on-scroll" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 80px 20px', textAlign: 'left' }}>
        <div className="details-header" style={{ marginBottom: '40px', textAlign: 'left' }}>
          <span className="details-subtitle" style={{ color: textColor }}>The Pipeline Flow</span>
          <h2 className="details-title" style={{ fontSize: '2rem', textAlign: 'left' }}>How Matrix 2.4 Processes Visual Inputs</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="workspace-columns-responsive">
          {/* Card 1: Capture */}
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
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(19, 78, 74, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, marginBottom: '20px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, margin: '0 0 8px 0' }}>1. Ingestion & Tokenize</h4>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              The system ingests the raw visual asset (invoice, chart, PDF, or image) and maps high-resolution pixels into a spatial coordinate tensor.
            </p>
          </div>

          {/* Card 2: Groq Vision */}
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
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(19, 78, 74, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, marginBottom: '20px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, margin: '0 0 8px 0' }}>2. Groq Vision Analysis</h4>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              The image tensor is routed to Groq's high-speed Llama 3.2 Vision engine to perform sub-90ms optical OCR and semantic character parsing.
            </p>
          </div>

          {/* Card 3: Nothric Summarization/Refinement */}
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
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `rgba(19, 78, 74, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textColor, marginBottom: '20px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h4 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, margin: '0 0 8px 0' }}>3. Nothric Synthesis</h4>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Nothric's native engine summarizes, refines, and translates the data, using grammar constraints to yield flawless JSON or SQL schemas.
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
          {/* Card 1: Groq Vision */}
          <div className="premium-reveal-item premium-delay-2" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', background: 'rgba(19, 78, 74, 0.1)', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <h4 style={{ fontSize: '1rem', color: '#1e293b', margin: 0, fontWeight: 600 }}>Groq Vision</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'left', lineHeight: 1.45, margin: 0 }}>
                Powers our core multi-modal vision models on custom LPU accelerators for sub-90ms image parsing.
              </p>
            </div>
          </div>
          {/* Card 2: Supabase */}
          <div className="premium-reveal-item premium-delay-3" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', background: 'rgba(19, 78, 74, 0.1)', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 11v6c0 1.66 4 3 9 3s9-1.34 9-3v-6"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <h4 style={{ fontSize: '1rem', color: '#1e293b', margin: 0, fontWeight: 600 }}>Supabase</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'left', lineHeight: 1.45, margin: 0 }}>
                Provides robust, cloud-based storage infrastructure for secure and fast image ingestion pipelines.
              </p>
            </div>
          </div>
          {/* Card 3: Nothric Team */}
          <div className="premium-reveal-item premium-delay-4" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '14px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px', background: 'rgba(19, 78, 74, 0.1)', color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <h4 style={{ fontSize: '1rem', color: '#1e293b', margin: 0, fontWeight: 600 }}>Nothric Team</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'left', lineHeight: 1.45, margin: 0 }}>
                Drives structural engineering, pipeline integration, and fine-tuning mechanics for the Matrix models.
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
