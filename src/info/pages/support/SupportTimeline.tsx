
import './SupportTimeline.css';

export default function SupportTimeline() {
  return (
    <section className="sla-timeline-section">
      {/* Header */}
      <div className="sla-timeline-header">
        <div className="guarantee-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="badge-icon">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>SLA Promise</span>
        </div>
        <h2 className="guarantee-h2" style={{ textAlign: 'center' }}>
          Our 4-Day Resolution <span>Guarantee</span>
        </h2>
        <p className="guarantee-desc" style={{ textAlign: 'center', margin: '0 auto 60px auto' }}>
          We resolve every ticket with high urgency. If we fail to resolve your issue within 4 days, your account will automatically receive 1 month of Nothric Pro free.
        </p>
      </div>

      {/* Timeline Grid */}
      <div className="timeline-flow-wrapper">
        {/* SVG line connector that sits behind the day nodes */}
        <div className="timeline-svg-connector-wrap">
          <svg className="timeline-svg-connector" viewBox="0 0 800 20" fill="none" preserveAspectRatio="none">
            {/* Background static tapered line */}
            <path d="M 0 7.5 L 800 9.7 L 800 10.3 L 0 12.5 Z" fill="url(#taper-bg-grad)" />
            {/* Animated glowing tapered pulse */}
            <path d="M 0 6 L 800 9.5 L 800 10.5 L 0 14 Z" fill="url(#taper-gradient)" filter="url(#timeline-glow-strong)" />
            
            <defs>
              <linearGradient id="taper-bg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.03)" />
              </linearGradient>
              
              <linearGradient id="taper-gradient" x1="-100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                <animate attributeName="x1" values="-100%;100%" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="x2" values="0%;200%" dur="3.5s" repeatCount="indefinite" />
              </linearGradient>

              <filter id="timeline-glow-strong" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </div>

        <div className="timeline-cards-grid">
          
          {/* Day 1 Card */}
          <div className="timeline-card-wrapper">
            <div className="timeline-day-node">1</div>
            <div className="timeline-glass-card">
              <span className="card-day-label">Day 1</span>
              <h4 className="card-day-title">Log Review</h4>
              <p className="card-day-desc">
                Our team inspects logs, reviews configurations, and triages the issue under <strong>strict SLA</strong>.
              </p>
            </div>
          </div>

          {/* Day 2 Card */}
          <div className="timeline-card-wrapper">
            <div className="timeline-day-node">2</div>
            <div className="timeline-glass-card">
              <span className="card-day-label">Day 2</span>
              <h4 className="card-day-title">Investigation</h4>
              <p className="card-day-desc">
                Engineering reproduces the diagnostics in an <strong>isolated sandbox</strong> environment.
              </p>
            </div>
          </div>

          {/* Day 3 Card */}
          <div className="timeline-card-wrapper">
            <div className="timeline-day-node">3</div>
            <div className="timeline-glass-card">
              <span className="card-day-label">Day 3</span>
              <h4 className="card-day-title">Deploy Fix</h4>
              <p className="card-day-desc">
                Patches are compiled, verified via automated checks, and deployed <strong>directly to production</strong>.
              </p>
            </div>
          </div>

          {/* Day 4 Card: Premium Highlight Card */}
          <div className="timeline-card-wrapper highlight-card-wrapper">
            <div className="timeline-day-node highlight-node">4</div>
            <div className="timeline-glass-card highlight-glass-card">
              <span className="card-day-label highlight-label">Day 4</span>
              <h4 className="card-day-title">SLA Guarantee</h4>
              <p className="card-day-desc">
                Ticket resolved, or your account automatically receives <strong>1 Month Nothric Pro</strong> completely free.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
