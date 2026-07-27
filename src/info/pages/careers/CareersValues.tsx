import './CareersValues.css'

export default function CareersValues() {
  return (
    <section className="careers-values-section reveal-on-scroll" style={{ width: '100%' }}>
      <span className="careers-section-label" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', textAlign: 'center', marginBottom: '12px' }}>Our DNA</span>
      <h2 className="careers-section-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', textAlign: 'center', margin: '0 0 48px 0', letterSpacing: '-0.03em' }}>How we work</h2>
      
      <div className="careers-values-grid">
        {/* Card 1: Technical Autonomy */}
        <div className="value-card">
          <div className="value-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 className="value-title">Technical Autonomy</h3>
          <p className="value-desc">
            We believe in independence. We trust our engineers to take complete ownership of their systems, make technical decisions, and ship code directly to production.
          </p>
        </div>

        {/* Card 2: Rigor & Craftsmanship */}
        <div className="value-card">
          <div className="value-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          </div>
          <h3 className="value-title">Rigor & Craftsmanship</h3>
          <p className="value-desc">
            We care deeply about system reliability, optimization, and clean architectures. We push boundaries to compile high-performing systems that scale robustly.
          </p>
        </div>

        {/* Card 3: Velocity & Momentum */}
        <div className="value-card">
          <div className="value-icon-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <h3 className="value-title">Velocity & Momentum</h3>
          <p className="value-desc">
            We execute and iterate rapidly. We value shipping, continuous feedback, and active improvements. We build for developers who love to create and deliver fast.
          </p>
        </div>
      </div>
    </section>
  )
}
