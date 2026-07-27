import { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import LandingFooter from '../../components/Footer'
import '../../components/base.css'
import '../../components/layout.css'
import './MissionPage.css'

export default function MissionPage() {
  useEffect(() => {
    document.title = 'Our Mission | Nothric';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mission-page-wrapper">
      {/* Immersive Cosmic background glow */}
      <div className="mission-bg-glow" />

      <div className="ui-overlay">
        {/* Navigation Header */}
        <Navbar onLoginClick={() => {
          if (window.navigate) {
            window.navigate('/?login=true');
          } else {
            window.location.href = '/?login=true';
          }
        }} />

        {/* Main Content (Nothric Charter) */}
        <main className="mission-content">

          <div className="mission-header">
            <div className="mission-meta">Our Mission</div>
            <h1 className="mission-title">
              <span className="hero-title-word-wrapper">
                <span className="hero-title-word">Nothric Charter</span>
              </span>
            </h1>

            <div className="mission-intro-card">
              <p>
                We believe the future of intelligence is collaborative, multi-model, and open. By bringing together the best frontier models side-by-side, we aim to accelerate human productivity and cognitive speed.
              </p>
              <p style={{ margin: 0, fontWeight: 500, color: '#f4f4f5' }}>
                To this end, we commit to the following core principles:
              </p>
            </div>
          </div>

          {/* Core Principles Grid */}
          <div className="mission-principles-grid">
            <div className="mission-card">
              <div className="mission-card-header">
                <h2>Unified access to intelligence</h2>
                <span className="mission-card-num">01</span>
              </div>
              <p>
                We commit to structuring Nothric as a neutral, inclusive ecosystem that bridges competing models (Claude, Gemini, GPT, and open-source models). We ensure that cutting-edge intelligence is never locked inside siloed environments, but is accessible to every team, builder, and developer globally.
              </p>
              <p>
                By providing a unified platform, we reduce friction and avoid the concentration of control over AI access, making it easier for users to switch, compare, and integrate technologies seamlessly.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-card-header">
                <h2>Secure agentic integration</h2>
                <span className="mission-card-num">02</span>
              </div>
              <p>
                We are committed to building security guardrails and privacy configurations directly into our multi-model workflows. We design alignment systems that help users query models responsibly, keeping data private and avoiding the abuse of agentic AI workspaces.
              </p>
              <p>
                We handle prompts and responses securely in transit and at rest, respecting user credentials and API limits while giving teams complete control over their local configurations.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-card-header">
                <h2>Interaction leadership</h2>
                <span className="mission-card-num">03</span>
              </div>
              <p>
                To redefine how humanity interacts with AI, Nothric must pioneer the standard for real-time model communication, side-by-side canvas workspaces, and latency-free routing.
              </p>
              <p>
                We believe that the user interface is just as critical as the underlying intelligence. We will lead in creating seamless, intuitive collaborative workspaces that make AI feel like an extension of human thoughts.
              </p>
            </div>

            <div className="mission-card">
              <div className="mission-card-header">
                <h2>Ecosystem cooperation</h2>
                <span className="mission-card-num">04</span>
              </div>
              <p>
                We actively partner with top frontier labs, cloud providers, and the open-source community. We seek to foster a collaborative culture where model builders, users, and safety researchers cooperate openly to establish fair data practices and standards.
              </p>
              <p>
                We are committed to providing tools that help the community navigate the evolving landscape of AI integrations, publishing setups, and comparative model analysis.
              </p>
            </div>
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  )
}
