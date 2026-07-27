import { useState, useEffect } from 'react'
import gsap from 'gsap'

export default function OverviewSection() {
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const models = [
    { id: 'gemini', name: 'Gemini', pathD: 'M 140 49 C 200 49, 230 170, 283 170', tooltip: 'Gemini API Key' },
    { id: 'groq', name: 'Groq', pathD: 'M 140 99 C 200 99, 230 170, 283 170', tooltip: 'Groq API Key' },
    { id: 'mistral', name: 'Mistral', pathD: 'M 140 149 C 200 149, 230 170, 283 170', tooltip: 'Mistral API Key' },
    { id: 'cohere', name: 'Cohere', pathD: 'M 140 199 C 200 199, 230 170, 283 170', tooltip: 'Cohere API Key' },
    { id: 'nvidia', name: 'NVIDIA', pathD: 'M 140 249 C 200 249, 230 170, 283 170', tooltip: 'NVIDIA API Key' },
    { id: 'tavily', name: 'Tavily', pathD: 'M 140 299 C 200 299, 230 170, 283 170', tooltip: 'Tavily API Key' }
  ];

  useEffect(() => {
    // 1. Initialize paths with strokeDasharray and strokeDashoffset matching their length
    const leftPaths = document.querySelectorAll('.left-path');
    leftPaths.forEach((path: any) => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });

    const rightPath: any = document.querySelector('.right-path');
    if (rightPath) {
      const len = rightPath.getTotalLength();
      rightPath.style.strokeDasharray = len;
      rightPath.style.strokeDashoffset = len;
    }

    // Set initial opacity of nodes to animate
    gsap.set('.center-node', { opacity: 0.3, scale: 0.95 });
    gsap.set('.right-node', { opacity: 0, scale: 0.9 });

    // 2. Set up IntersectionObserver to trigger the reveal animation once
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tl = gsap.timeline();

          // Animate left paths drawing into center
          tl.fromTo('.left-path',
            { strokeDashoffset: (_, el: any) => el.getTotalLength() },
            { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out', stagger: 0.08 }
          );

          // Animate center node processing activation
          tl.fromTo('.center-node',
            { opacity: 0.3, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
            '-=0.8'
          );

          // Animate right path drawing out to response
          tl.fromTo('.right-path',
            { strokeDashoffset: (_, el: any) => el.getTotalLength() },
            { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' },
            '-=0.2'
          );

          // Animate right response node appearing
          tl.fromTo('.right-node',
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' },
            '-=0.1'
          );

          observer.disconnect();
        }
      });
    }, { threshold: 0.15 });

    const container = document.querySelector('.api-diagram-container');
    if (container) {
      observer.observe(container);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="overview" className="api-guide-text-section">
      <h3 className="api-guide-section-heading">Introduction</h3>
      <p className="api-guide-paragraph">
        Think of Nothric as a universal remote control. By default, it comes with a built-in battery (our shared free limits) so you can use the AI immediately. However, if that battery runs out because many people are using it at the same time, you can plug in your own power cords—your own <strong>API Keys</strong>.
      </p>

      <div className="api-guide-inner-divider" />

      <h4 className="api-guide-subsection-heading">What is an API?</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p className="api-guide-paragraph">
          An <strong>API (Application Programming Interface)</strong> is a way for different applications to talk  with each other. Instead of talking directly, one application sends a request through an API, and the other application processes it and sends back a response. APIs make it possible for apps and services to work together quickly, securely, and automatically.
        </p>

        <p className="api-guide-paragraph">
          The easiest way to understand an API is to think of a restaurant:
        </p>
        <ul className="api-guide-bullets" style={{ paddingLeft: '20px', gap: '12px' }}>
          <li className="api-guide-bullet-item" style={{ listStyleType: 'none', paddingLeft: '20px' }}>
            <strong>The Client (You):</strong> You sit at a table looking at the menu, wanting to order food.
          </li>
          <li className="api-guide-bullet-item" style={{ listStyleType: 'none', paddingLeft: '20px' }}>
            <strong>The Server (The Kitchen):</strong> This is the system that prepares the data or the meal.
          </li>
          <li className="api-guide-bullet-item" style={{ listStyleType: 'none', paddingLeft: '20px' }}>
            <strong>The API (The Waiter):</strong> The waiter takes your order (the request), delivers it to the kitchen, and brings back your food (the response). You never have to step into the kitchen yourself.
          </li>
        </ul>

        {/* Outer Scrollable Wrapper for Mobile Responsiveness */}
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {/* Visual Node Diagram */}
          <div className="api-diagram-container" style={{
            position: 'relative',
            width: '796px',
            height: '340px',
            background: 'transparent',
            boxSizing: 'border-box',
            overflow: 'hidden',
            margin: '20px 0'
          }}>
            {/* SVG Connector lines */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'auto', zIndex: 1 }}>
              {models.map((model) => {
                const isHovered = hoveredModel === model.id;
                return (
                  <g key={model.id}>
                    {/* Invisible thick path for easy hovering */}
                    <path
                      d={model.pathD}
                      stroke="transparent"
                      strokeWidth="20"
                      fill="none"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredModel(model.id)}
                      onMouseLeave={() => setHoveredModel(null)}
                    />
                    {/* Static Solid Line (Drawing Revealed by GSAP) */}
                    <path
                      className="left-path"
                      d={model.pathD}
                      stroke={isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.22)'}
                      strokeWidth={isHovered ? '2.5' : '1.5'}
                      fill="none"
                      style={{
                        pointerEvents: 'none',
                        transition: 'stroke 0.2s, stroke-width 0.2s'
                      }}
                    />
                  </g>
                );
              })}

              {/* Right Connector Line */}
              <path
                className="right-path"
                d="M 503 170 H 646"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>

            {/* Interactive Floating Tooltip */}
            {hoveredModel && (
              <div style={{
                position: 'absolute',
                left: '211px',
                top: hoveredModel === 'gemini' ? '49px'
                  : hoveredModel === 'groq' ? '99px'
                    : hoveredModel === 'mistral' ? '149px'
                      : hoveredModel === 'cohere' ? '199px'
                        : hoveredModel === 'nvidia' ? '249px'
                          : '299px',
                background: '#ffffff',
                color: '#000000',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                pointerEvents: 'none',
                zIndex: 10,
                boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                whiteSpace: 'nowrap',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.15s ease'
              }}>
                {models.find(m => m.id === hoveredModel)?.tooltip}
              </div>
            )}

            {/* Left Column: 6 Model Provider Nodes */}
            <div style={{
              position: 'absolute',
              left: '0px',
              top: '26px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 2,
              width: '140px'
            }}>
              {models.map((model) => {
                const isHovered = hoveredModel === model.id;
                return (
                  <div
                    key={model.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isHovered ? '#2a2a2a' : '#202020',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: isHovered ? '#ffffff' : '#a1a1aa',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      height: '38px',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={() => setHoveredModel(model.id)}
                    onMouseLeave={() => setHoveredModel(null)}
                  >
                    <span>{model.name}</span>
                    <span style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: isHovered ? '#ffffff' : '#a1a1aa',
                      boxShadow: isHovered ? '0 0 6px #ffffff' : 'none',
                      transition: 'all 0.2s'
                    }} />
                  </div>
                );
              })}
            </div>

            {/* Center Column: Nothric Node */}
            <div className="center-node" style={{
              position: 'absolute',
              left: '283px',
              top: '104px',
              height: '132px',
              boxSizing: 'border-box',
              zIndex: 2,
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '20px 24px',
              width: '220px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {/* Subtle glowing borders */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '2px', background: 'linear-gradient(to bottom, #ffffff, transparent)' }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '2px', background: 'linear-gradient(to bottom, #ffffff, transparent)' }} />

              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.04em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                Nothric Core
              </div>
              <div style={{ fontSize: '13px', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>+</span> System Prompt
              </div>
              <div style={{ fontSize: '13px', color: '#a1a1aa', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#ffffff', fontWeight: 'bold' }}>+</span> Integration Layer
              </div>
            </div>

            {/* Right Column: Nothric Response Node */}
            <div className="right-node" style={{
              position: 'absolute',
              left: '646px',
              top: '151px',
              height: '38px',
              boxSizing: 'border-box',
              zIndex: 2,
              width: '150px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                height: '100%',
                boxSizing: 'border-box'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                <span>Nothric Response</span>
              </div>
            </div>
          </div>
        </div>

        <div className="api-guide-inner-divider" />

        <h4 className="api-guide-subsection-heading">SecurityCard & Privacy</h4>
        <p className="api-guide-paragraph">
          We built Nothric with privacy at its core. Your keys are saved only inside your web browser on your own computer (like a cookie). They are never saved on our servers, and we can never see them. When you ask a question, your browser talks directly to Google or Groq using your card, with no middleman.
        </p>

        <div className="api-guide-inner-divider" />

        <h4 className="api-guide-subsection-heading">Cost & Free Plans</h4>
        <p className="api-guide-paragraph">
          Almost all of these services offer generous <strong>free plans</strong> just for signing up. Even if you choose to use their paid plans, they only charge for exactly what you write or read. For a normal user, this usually amounts to just a few cents or a couple of dollars a month.
        </p>
      </div>
    </section>
  )
}
