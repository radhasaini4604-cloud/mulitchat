import { useState, useEffect, useRef } from 'react';
import './ComparisonGraphs.css';

export default function ComparisonGraphs() {
  const [isAnimate, setIsAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnimate(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.15 
      }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="comparison-graphs-section">
      <div className={`comparison-section-container lift-up-container ${isAnimate ? 'animated' : ''}`}>
        <h3 className="body-section-title" style={{ textAlign: 'center', margin: '0 0 8px 0' }}>
          Nothric is much faster and cheaper
        </h3>
        <p className="chart-subtitle-clean" style={{ textAlign: 'center', marginBottom: '28px' }}>
          Get extreme speed and save money on every request
        </p>
        
        <p className="performance-info-text" style={{ marginBottom: '24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 32px' }}>
          We connect you directly to the fastest hardware. You get ultra-fast speeds for chatting and writing code, while paying a lot less than standard expensive APIs.
        </p>

        {/* Two Graphs Row */}
        <div className="graphs-comparison-row">
          {/* Graph 1: Speed (Tokens Per Second) */}
          <div className="graph-comparison-card">
            <div className="card-header-clean">
              <span className="card-title-clean">Generation Speed</span>
              <span className="card-subtitle-sub">Tokens generated per second (Higher is better)</span>
            </div>
            
            <svg viewBox="0 0 240 180" className="comparison-svg">
              {/* Grid Lines */}
              <line x1="40" y1="125" x2="220" y2="125" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
              <line x1="40" y1="100" x2="220" y2="100" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
              <line x1="40" y1="75" x2="220" y2="75" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
              <line x1="40" y1="50" x2="220" y2="50" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
              <line x1="40" y1="25" x2="220" y2="25" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />

              {/* Axes */}
              <line x1="40" y1="150" x2="220" y2="150" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
              <line x1="40" y1="20" x2="40" y2="150" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />

              {/* Axis Titles */}
              <text x="130" y="174" fill="#a1a1aa" style={{ fontSize: '7px', fontFamily: 'Inter, sans-serif' }} textAnchor="middle">Concurrent Requests</text>
              <text x="14" y="85" fill="#a1a1aa" style={{ fontSize: '6px', fontFamily: 'Inter, sans-serif' }} transform="rotate(-90, 14, 85)" textAnchor="middle">Tokens / Sec</text>

              {/* Y Labels */}
              <text x="32" y="152" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">0</text>
              <text x="32" y="127" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">100</text>
              <text x="32" y="102" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">200</text>
              <text x="32" y="77" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">300</text>
              <text x="32" y="52" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">400</text>
              <text x="32" y="27" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">500+</text>

              {/* X Labels */}
              <text x="40" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">0</text>
              <text x="85" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">10</text>
              <text x="130" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">20</text>
              <text x="175" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">30</text>
              <text x="220" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">50+</text>

              {/* Legend */}
              <g transform="translate(48, 28)">
                <circle cx="5" cy="5" r="2" fill="#ffffff" />
                <text x="12" y="8" fill="#ffffff" style={{ fontSize: '5.5px', fontWeight: 500 }}>Nothric</text>
                <circle cx="50" cy="5" r="2" fill="#7d8187" />
                <text x="57" y="8" fill="#a1a1aa" style={{ fontSize: '5.5px' }}>Other APIs</text>
              </g>

              {/* Standard Providers Curve */}
              <path
                d="M 80 145 L 120 110 L 160 95 L 180 88 L 200 82"
                fill="none"
                stroke="#7d8187"
                strokeWidth="0.8"
                style={{ strokeDasharray: '200', strokeDashoffset: isAnimate ? '0' : '200', transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
              {isAnimate && (
                <>
                  <circle cx="80" cy="145" r="1.2" fill="#7d8187" />
                  <circle cx="120" cy="110" r="1.2" fill="#7d8187" />
                  <circle cx="160" cy="95" r="1.2" fill="#7d8187" />
                  <circle cx="180" cy="88" r="1.2" fill="#7d8187" />
                  <circle cx="200" cy="82" r="1.2" fill="#7d8187" />
                </>
              )}

              {/* Nothric Performance Curve */}
              <path
                d="M 60 130 L 100 75 L 140 55 L 180 48 L 200 42"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.9"
                style={{ strokeDasharray: '200', strokeDashoffset: isAnimate ? '0' : '200', transition: 'stroke-dashoffset 1.5s ease-out 0.2s' }}
              />
              {isAnimate && (
                <>
                  <circle cx="60" cy="130" r="1.3" fill="#ffffff" />
                  <circle cx="100" cy="75" r="1.3" fill="#ffffff" />
                  <circle cx="140" cy="55" r="1.3" fill="#ffffff" />
                  <circle cx="180" cy="48" r="1.3" fill="#ffffff" />
                  <circle cx="200" cy="42" r="1.3" fill="#ffffff" />
                </>
              )}
            </svg>
          </div>

          {/* Graph 2: Cost ($ per Million Tokens) */}
          <div className="graph-comparison-card">
            <div className="card-header-clean">
              <span className="card-title-clean">Inference Cost</span>
              <span className="card-subtitle-sub">Price in USD per million tokens (Lower is better)</span>
            </div>
            
            <svg viewBox="0 0 240 180" className="comparison-svg">
              {/* Grid Lines */}
              <line x1="40" y1="125" x2="220" y2="125" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
              <line x1="40" y1="100" x2="220" y2="100" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
              <line x1="40" y1="75" x2="220" y2="75" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
              <line x1="40" y1="50" x2="220" y2="50" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />
              <line x1="40" y1="25" x2="220" y2="25" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.4" />

              {/* Axes */}
              <line x1="40" y1="150" x2="220" y2="150" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />
              <line x1="40" y1="20" x2="40" y2="150" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" />

              {/* Axis Titles */}
              <text x="130" y="174" fill="#a1a1aa" style={{ fontSize: '7px', fontFamily: 'Inter, sans-serif' }} textAnchor="middle">Context Window</text>
              <text x="14" y="85" fill="#a1a1aa" style={{ fontSize: '6px', fontFamily: 'Inter, sans-serif' }} transform="rotate(-90, 14, 85)" textAnchor="middle">Cost ($/1M tokens)</text>

              {/* Y Labels */}
              <text x="32" y="152" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">Free</text>
              <text x="32" y="127" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">$0.50</text>
              <text x="32" y="102" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">$1.00</text>
              <text x="32" y="77" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">$1.50</text>
              <text x="32" y="52" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">$2.00</text>
              <text x="32" y="27" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="end">$2.50</text>

              {/* X Labels */}
              <text x="40" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">0</text>
              <text x="85" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">8k</text>
              <text x="130" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">16k</text>
              <text x="175" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">24k</text>
              <text x="220" y="160" fill="#a1a1aa" style={{ fontSize: '6px' }} textAnchor="middle">32k</text>

              {/* Legend */}
              <g transform="translate(48, 28)">
                <circle cx="5" cy="5" r="2" fill="#ffffff" />
                <text x="12" y="8" fill="#ffffff" style={{ fontSize: '5.5px', fontWeight: 500 }}>Nothric</text>
                <circle cx="50" cy="5" r="2" fill="#7d8187" />
                <text x="57" y="8" fill="#a1a1aa" style={{ fontSize: '5.5px' }}>Other APIs</text>
              </g>

              {/* Standard Providers Curve (Higher cost) */}
              <path
                d="M 60 110 L 100 68 L 140 50 L 180 42 L 220 38"
                fill="none"
                stroke="#7d8187"
                strokeWidth="0.8"
                style={{ strokeDasharray: '200', strokeDashoffset: isAnimate ? '0' : '200', transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
              {isAnimate && (
                <>
                  <circle cx="60" cy="110" r="1.2" fill="#7d8187" />
                  <circle cx="100" cy="68" r="1.2" fill="#7d8187" />
                  <circle cx="140" cy="50" r="1.2" fill="#7d8187" />
                  <circle cx="180" cy="42" r="1.2" fill="#7d8187" />
                  <circle cx="220" cy="38" r="1.2" fill="#7d8187" />
                </>
              )}

              {/* Nothric Cost Curve (Lower cost) */}
              <path
                d="M 60 140 L 100 115 L 140 85 L 180 75 L 220 70"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.9"
                style={{ strokeDasharray: '200', strokeDashoffset: isAnimate ? '0' : '200', transition: 'stroke-dashoffset 1.5s ease-out 0.2s' }}
              />
              {isAnimate && (
                <>
                  <circle cx="60" cy="140" r="1.3" fill="#ffffff" />
                  <circle cx="100" cy="115" r="1.3" fill="#ffffff" />
                  <circle cx="140" cy="85" r="1.3" fill="#ffffff" />
                  <circle cx="180" cy="75" r="1.3" fill="#ffffff" />
                  <circle cx="220" cy="70" r="1.3" fill="#ffffff" />
                </>
              )}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
