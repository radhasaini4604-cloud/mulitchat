import { useState, useEffect, useRef } from 'react'
import './HiringProcess.css'

interface ProcessStep {
  num: string
  title: string
  desc: string
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "01",
    title: "Submit Application",
    desc: "Fill out the short form below and attach your resume to get started."
  },
  {
    num: "02",
    title: "GitHub Review",
    desc: "Our team reviews your GitHub profile and past projects to understand your coding depth."
  },
  {
    num: "03",
    title: "Screening Interview",
    desc: "A quick call to learn more about you. Prepare for brief technical questions and a chat about your background."
  },
  {
    num: "04",
    title: "Technical Interview",
    desc: "We will give you a complex coding challenge to assess your engineering skills."
  },
  {
    num: "05",
    title: "Offer Extended",
    desc: "If your mindset and skills align with our goals, we will extend an offer to join Nothric."
  }
]

export default function HiringProcess() {
  const [isActive, setIsActive] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={`hiring-process-section reveal-on-scroll ${isActive ? 'active' : ''}`}>
      <div className="roles-centered-header" style={{ marginBottom: '60px' }}>
        <span className="careers-section-label" style={{ fontSize: '0.8rem', fontWeight: 800, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block' }}>Pathway</span>
        <h2 className="roles-section-title">Hiring Process</h2>
        <p className="roles-section-subtitle">
          This is how you join us to shape the next frontier of software automation.
        </p>
      </div>

      <div className="pipeline-flow-container">
        {/* Animated Laser Beam Connector Line */}
        <div className="pipeline-connector">
          <svg className="pipeline-connector-svg" viewBox="0 0 1000 4" fill="none" preserveAspectRatio="none">
            <line className="guide-line" x1="0" y1="2" x2="1000" y2="2" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
            <line className="pipeline-beam" x1="0" y1="2" x2="1000" y2="2" stroke="url(#beam-glow-grad)" strokeWidth="2" />
            <defs>
              <linearGradient id="beam-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="30%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.75)" />
                <stop offset="70%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Pipeline Step Items */}
        <div className="pipeline-steps-grid">
          {PROCESS_STEPS.map((step) => (
            <div key={step.num} className="pipeline-step-item">
              <div className="step-backlight"></div>
              
              <div className="step-number-wrapper">
                <span className="step-giant-number">{step.num}</span>
              </div>
              
              <div className="step-node-line">
                <div className="step-node-dot">
                  <div className="step-node-inner"></div>
                </div>
              </div>
              
              <div className="step-content">
                <h4 className="step-item-title">{step.title}</h4>
                <p className="step-item-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
