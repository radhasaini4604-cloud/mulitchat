
import './SupportCTA.css';

export default function SupportCTA() {
  return (
    <section className="support-cta-section">
      {/* Background glow */}
      <div className="support-cta-glow" />

      {/* Glassmorphic CTA Card */}
      <div className="support-cta-card">
        <h2 className="cta-title">
          Still need <span>answers?</span>
        </h2>
        <p className="cta-desc">
          Can't find what you are looking for? Chat with our developer community on Discord, read our documentation, or check our real-time system status tracker.
        </p>
        
        <div className="cta-buttons">
          <a 
            href="https://discord.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="cta-btn btn-primary"
          >
            Join Community
          </a>
          
          <a 
            href="/api-guide" 
            className="cta-btn btn-secondary"
          >
            API Guide
          </a>
          
          <a 
            href="https://status.nothric.dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="cta-btn btn-tertiary"
          >
            System Status ↗
          </a>
        </div>
      </div>
    </section>
  );
}
