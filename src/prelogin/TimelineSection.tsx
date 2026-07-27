import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import './TimelineSection.css'

interface TimelineEvent {
  date: string
  title: string
  description: string
  days: number
}

const timelineEvents: TimelineEvent[] = [
  {
    date: 'June 2025',
    title: 'The Nothric Spark',
    description: 'The founding idea for Nothric was conceived, aiming to redefine intelligence through agentic models.',
    days: 0
  },
  {
    date: 'July 2025',
    title: 'Connecting the Nodes',
    description: 'Our engineering and design teams assembled globally, kicking off planning for the platform.',
    days: 34
  },
  {
    date: 'July 12, 2025',
    title: 'Creating the Core',
    description: 'The core model pipeline and first stable architecture framework were completed.',
    days: 41
  },
  {
    date: 'July 24, 2025',
    title: 'Powering Up the Grid',
    description: 'NVIDIA GPU compute clusters arrived, scaling up raw computing power for pre-training.',
    days: 53
  },
  {
    date: 'August 24, 2025',
    title: 'Nothric Code Complete',
    description: 'The full implementation and source code of the Nothric workspace and platform were successfully completed.',
    days: 84
  },
  {
    date: 'August 27, 2025',
    title: 'All Systems Verified',
    description: 'All builds, test pipelines, and validations were completed and verified for our first release.',
    days: 87
  },
  {
    date: 'September 1, 2025',
    title: 'Unraveling Nothric',
    description: 'Nothric officially launched to the public worldwide, bringing multi-model agent workflows to everyone.',
    days: 92
  }
]

interface OdometerDigitProps {
  digit: string
}

function OdometerDigit({ digit }: OdometerDigitProps) {
  const num = parseInt(digit, 10) || 0
  
  return (
    <div className="home-odometer-digit-col">
      <div 
        className="home-odometer-digit-strip"
        style={{ transform: `translateY(-${num * 10}%)` }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
          <div key={val} className="home-odometer-digit-val">
            {val}
          </div>
        ))}
      </div>
    </div>
  )
}

interface OdometerNumberProps {
  value: number
}

function OdometerNumber({ value }: OdometerNumberProps) {
  const digits = String(value).split('')
  
  return (
    <div className="home-odometer-wrap">
      {digits.map((char, idx) => {
        const key = digits.length - idx
        return <OdometerDigit key={key} digit={char} />
      })}
    </div>
  )
}

export default function TimelineSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [days, setDays] = useState(0)

  const fillRef = useRef<HTMLDivElement>(null)
  const knobRef = useRef<HTMLButtonElement>(null)
  const lastActiveIndexRef = useRef<number>(0)
  const daysProxy = useRef<{ value: number }>({ value: 0 })

  const updateDaysState = (targetValue: number) => {
    gsap.to(daysProxy.current, {
      value: targetValue,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: () => {
        setDays(Math.round(daysProxy.current.value))
      }
    })
  }

  const handleLineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    let progress = x / width
    if (progress < 0) progress = 0
    if (progress > 1) progress = 1

    const lastIdx = timelineEvents.length - 1
    const activeIdx = Math.round(progress * lastIdx)
    const snappedProgress = activeIdx / lastIdx

    // Smoothly animate the knob and fill line to the snapped milestone progress
    gsap.to(fillRef.current, {
      width: `${snappedProgress * 100}%`,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    })
    gsap.to(knobRef.current, {
      left: `${snappedProgress * 100}%`,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    })

    // Smoothly roll the odometer numbers to the target milestone days
    const targetDays = timelineEvents[activeIdx].days
    updateDaysState(targetDays)

    if (activeIdx !== lastActiveIndexRef.current) {
      lastActiveIndexRef.current = activeIdx
      setActiveIndex(activeIdx)
    }
  }

  const handleLineMouseLeave = () => {
    // Snap back visuals smoothly to the closest active milestone dot
    const targetIdx = lastActiveIndexRef.current
    const targetProgress = targetIdx / (timelineEvents.length - 1)
    
    gsap.to(fillRef.current, {
      width: `${targetProgress * 100}%`,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    })
    gsap.to(knobRef.current, {
      left: `${targetProgress * 100}%`,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto'
    })

    const targetDays = timelineEvents[targetIdx].days
    updateDaysState(targetDays)
  }

  const currentEvent = timelineEvents[activeIndex]

  return (
    <div className="home-timeline-trigger-wrapper">
      <section className="home-timeline-section">
        <div className="home-timeline-container">
          {/* Transition Header: Centered */}
          <div className="timeline-transition-centered">
            <span className="timeline-transition-label">Timeline</span>
            <h2 className="timeline-transition-heading">Our Evolution</h2>
            <p className="timeline-transition-subheading">
              Tracing the key milestones of Nothric from founding spark to public launch.
            </p>
          </div>

          {/* Top Header Information: Left-aligned as original */}
          <div className="home-timeline-header">
            <div className="home-timeline-title">
              <span className="home-timeline-day-suffix">Day</span>
              <OdometerNumber value={days} />
              <span className="home-timeline-day-suffix">of evolution</span>
            </div>
          </div>

          {/* Timeline Slider Track */}
          <div className="home-timeline-slider">
            <div 
              className="home-timeline-line-container"
              onMouseMove={handleLineMouseMove}
              onMouseLeave={handleLineMouseLeave}
            >
              {/* Background track line */}
              <div className="home-timeline-line-bg"></div>
              {/* Active filled line */}
              <div ref={fillRef} className="home-timeline-line-fill"></div>
              
              {/* Timeline nodes/dots */}
              <div className="home-timeline-dots">
                {timelineEvents.map((_, idx) => (
                  <div
                    key={idx}
                    className={`home-timeline-dot ${idx === activeIndex ? 'active' : ''} ${idx < activeIndex ? 'completed' : ''}`}
                    style={{ left: `${(idx / (timelineEvents.length - 1)) * 100}%` }}
                  />
                ))}
              </div>

              {/* Moving Knob Cursor */}
              <button ref={knobRef} className="home-timeline-knob" aria-label="Timeline Cursor"></button>
            </div>

            {/* Start and end dates at bottom of timeline */}
            <div className="home-timeline-dates-row">
              <span className="home-timeline-date-edge">Jun 2025</span>
              <span className="home-timeline-date-edge">Sep 2025</span>
            </div>
          </div>

          {/* Centered details corresponding to the active event with key triggers for transitions */}
          <div key={activeIndex} className="home-timeline-details home-timeline-event-content">
            <span className="home-timeline-event-date">{currentEvent.date}</span>
            <h3 className="home-timeline-event-title">{currentEvent.title}</h3>
            <p className="home-timeline-event-desc">{currentEvent.description}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
