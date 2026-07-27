import { useState, useEffect, useRef } from 'react';
import './ComparisonSection.css';

export default function ComparisonSection() {
  const [isAnimate, setIsAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector('.entropy-page');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnimate(true);
          observer.disconnect();
        }
      },
      { 
        root: scrollContainer,
        threshold: 0.15 
      }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`comparison-section-container lift-up-container ${isAnimate ? 'animated' : ''}`}>
      <h3 className="body-section-title" style={{ textAlign: 'center', margin: '0 0 8px 0' }}>Entropy 3.5 vs. Native Gemini 3.5 Flash</h3>
      <p className="chart-subtitle-clean" style={{ textAlign: 'center', marginBottom: '28px' }}>The difference between a raw general model and a tailored developer companion</p>
      
      <p className="performance-info-text" style={{ marginBottom: '24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 32px' }}>
        Even though Entropy 3.5 is built on Google's Gemini 3.5 Flash, they act very differently. Think of raw Gemini as a general assistant, while Entropy is custom-tailored to live in your workspace—focused on writing code, using tools, and chatting like a real human peer.
      </p>

      {/* Two Graphs Row */}
      <div className="graphs-comparison-row">
        {/* Graph 1: OSWorld-Verified */}
        <div className="graph-comparison-card">
          <div className="card-header-clean">
            <span className="card-title-clean">OSWorld Success Rate</span>
            <span className="card-subtitle-sub">How well it controls folders, files, and workspace tools (%)</span>
          </div>
          <svg viewBox="0 0 240 180" className="comparison-svg">
            {/* Grid Lines */}
            <line x1="40" y1="125" x2="220" y2="125" stroke="#f1f1f3" strokeWidth="1" />
            <line x1="40" y1="100" x2="220" y2="100" stroke="#f1f1f3" strokeWidth="1" />
            <line x1="40" y1="75" x2="220" y2="75" stroke="#f1f1f3" strokeWidth="1" />
            <line x1="40" y1="50" x2="220" y2="50" stroke="#f1f1f3" strokeWidth="1" />
            <line x1="40" y1="25" x2="220" y2="25" stroke="#f1f1f3" strokeWidth="1" />

            {/* Axes */}
            <line x1="40" y1="150" x2="220" y2="150" stroke="#d2d2d7" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="150" stroke="#d2d2d7" strokeWidth="1" />

            {/* Axis Title */}
            <text x="130" y="174" className="chart-label-light axis-title" style={{ fontSize: '7px' }} textAnchor="middle">Number of tool yields</text>
            <text x="14" y="85" className="chart-label-light axis-title" style={{ fontSize: '7px' }} transform="rotate(-90, 14, 85)" textAnchor="middle">Score (%)</text>

            {/* Y Labels */}
            <text x="32" y="152" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">35%</text>
            <text x="32" y="127" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">45%</text>
            <text x="32" y="102" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">55%</text>
            <text x="32" y="77" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">65%</text>
            <text x="32" y="52" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">75%</text>
            <text x="32" y="27" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">85%</text>

            {/* X Labels */}
            <text x="40" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">0</text>
            <text x="85" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">4</text>
            <text x="130" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">8</text>
            <text x="175" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">12</text>
            <text x="220" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">16</text>

            {/* Legend */}
            <g transform="translate(48, 28)">
              <circle cx="5" cy="5" r="3" fill="#1d1d1f" />
              <text x="12" y="8" className="chart-label-light" style={{ fontSize: '5.5px', fontWeight: 600, fill: '#1d1d1f' }}>Entropy 3.5</text>
              <circle cx="70" cy="5" r="3" fill="#8e8e93" />
              <text x="77" y="8" className="chart-label-light" style={{ fontSize: '5.5px', fill: '#8e8e93' }}>Gemini 3.5 Flash</text>
            </g>

            {/* Gemini 3.5 Flash Curve */}
            <path
              d="M 80 145 L 120 110 L 160 95 L 180 88 L 200 82"
              fill="none"
              stroke="#8e8e93"
              strokeWidth="1"
              style={{ strokeDasharray: '200', strokeDashoffset: isAnimate ? '0' : '200', transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
            {isAnimate && (
              <>
                <circle cx="80" cy="145" r="2" fill="#8e8e93" />
                <circle cx="120" cy="110" r="2" fill="#8e8e93" />
                <circle cx="160" cy="95" r="2" fill="#8e8e93" />
                <circle cx="180" cy="88" r="2" fill="#8e8e93" />
                <circle cx="200" cy="82" r="2" fill="#8e8e93" />
              </>
            )}

            {/* Entropy 3.5 Curve */}
            <path
              d="M 60 130 L 100 75 L 140 55 L 180 48 L 200 42"
              fill="none"
              stroke="#1d1d1f"
              strokeWidth="1"
              style={{ strokeDasharray: '200', strokeDashoffset: isAnimate ? '0' : '200', transition: 'stroke-dashoffset 1.5s ease-out 0.2s' }}
            />
            {isAnimate && (
              <>
                <circle cx="60" cy="130" r="2.5" fill="#1d1d1f" />
                <circle cx="100" cy="75" r="2.5" fill="#1d1d1f" />
                <circle cx="140" cy="55" r="2.5" fill="#1d1d1f" />
                <circle cx="180" cy="48" r="2.5" fill="#1d1d1f" />
                <circle cx="200" cy="42" r="2.5" fill="#1d1d1f" />
              </>
            )}
          </svg>
        </div>

        {/* Graph 2: Tau2-bench */}
        <div className="graph-comparison-card">
          <div className="card-header-clean">
            <span className="card-title-clean">Tau2-bench accuracy</span>
            <span className="card-subtitle-sub">Tool use consistency over context load (%)</span>
          </div>
          <svg viewBox="0 0 240 180" className="comparison-svg">
            {/* Grid Lines */}
            <line x1="40" y1="125" x2="220" y2="125" stroke="#f1f1f3" strokeWidth="1" />
            <line x1="40" y1="100" x2="220" y2="100" stroke="#f1f1f3" strokeWidth="1" />
            <line x1="40" y1="75" x2="220" y2="75" stroke="#f1f1f3" strokeWidth="1" />
            <line x1="40" y1="50" x2="220" y2="50" stroke="#f1f1f3" strokeWidth="1" />
            <line x1="40" y1="25" x2="220" y2="25" stroke="#f1f1f3" strokeWidth="1" />

            {/* Axes */}
            <line x1="40" y1="150" x2="220" y2="150" stroke="#d2d2d7" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="150" stroke="#d2d2d7" strokeWidth="1" />

            {/* Axis Title */}
            <text x="130" y="174" className="chart-label-light axis-title" style={{ fontSize: '7px' }} textAnchor="middle">Output tokens</text>
            <text x="14" y="85" className="chart-label-light axis-title" style={{ fontSize: '7px' }} transform="rotate(-90, 14, 85)" textAnchor="middle">Accuracy</text>

            {/* Y Labels */}
            <text x="32" y="152" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">50%</text>
            <text x="32" y="127" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">60%</text>
            <text x="32" y="102" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">70%</text>
            <text x="32" y="77" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">80%</text>
            <text x="32" y="52" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">90%</text>
            <text x="32" y="27" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">100%</text>

            {/* X Labels */}
            <text x="40" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">0</text>
            <text x="65" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">2k</text>
            <text x="90" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">4k</text>
            <text x="115" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">6k</text>
            <text x="140" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">8k</text>
            <text x="165" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">10k</text>
            <text x="190" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">12k</text>
            <text x="215" y="160" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="middle">14k</text>

            {/* Legend */}
            <g transform="translate(48, 28)">
              <circle cx="5" cy="5" r="3" fill="#1d1d1f" />
              <text x="12" y="8" className="chart-label-light" style={{ fontSize: '5.5px', fontWeight: 600, fill: '#1d1d1f' }}>Entropy 3.5</text>
              <circle cx="70" cy="5" r="3" fill="#8e8e93" />
              <text x="77" y="8" className="chart-label-light" style={{ fontSize: '5.5px', fill: '#8e8e93' }}>Gemini 3.5 Flash</text>
            </g>

            {/* Gemini 3.5 Flash Curve */}
            <path
              d="M 60 135 L 100 102 L 140 68 L 180 58 L 220 52"
              fill="none"
              stroke="#8e8e93"
              strokeWidth="1"
              style={{ strokeDasharray: '200', strokeDashoffset: isAnimate ? '0' : '200', transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
            {isAnimate && (
              <>
                <circle cx="60" cy="135" r="2" fill="#8e8e93" />
                <circle cx="100" cy="102" r="2" fill="#8e8e93" />
                <circle cx="140" cy="68" r="2" fill="#8e8e93" />
                <circle cx="180" cy="58" r="2" fill="#8e8e93" />
                <circle cx="220" cy="52" r="2" fill="#8e8e93" />
              </>
            )}

            {/* Entropy 3.5 Curve */}
            <path
              d="M 60 125 L 100 60 L 140 42 L 180 38"
              fill="none"
              stroke="#1d1d1f"
              strokeWidth="1"
              style={{ strokeDasharray: '200', strokeDashoffset: isAnimate ? '0' : '200', transition: 'stroke-dashoffset 1.5s ease-out 0.2s' }}
            />
            {isAnimate && (
              <>
                <circle cx="60" cy="125" r="2.5" fill="#1d1d1f" />
                <circle cx="100" cy="60" r="2.5" fill="#1d1d1f" />
                <circle cx="140" cy="42" r="2.5" fill="#1d1d1f" />
                <circle cx="180" cy="38" r="2.5" fill="#1d1d1f" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Comparison Table below */}
      <div className="feature-comparison-table-wrapper">
        <table className="evaluation-table spec-comparison-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>What changes?</th>
              <th style={{ width: '38%' }}>Entropy 3.5 (Tuned)</th>
              <th style={{ width: '37%' }}>Native Gemini 3.5 Flash</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="highlight">Persona & Tone</td>
              <td>Talks like a friendly coding partner. Uses simple human terms and knows your project files.</td>
              <td>Sounds like a standard helpful AI. Very formal and sometimes writes too much text.</td>
            </tr>
            <tr>
              <td className="highlight">Workspace Integration</td>
              <td className="highlight">Can read your workspace files, run terminal commands, and edit code directly.</td>
              <td>Just chats in a box. Cannot see your actual files or run code.</td>
            </tr>
            <tr>
              <td className="highlight">Doing Tasks on Auto-Pilot</td>
              <td>Breaks a big goal into steps, executes them, checks for errors, and fixes them on its own.</td>
              <td>Gives you a single text response. You have to copy-paste the steps yourself.</td>
            </tr>
            <tr>
              <td className="highlight">Handling Big Files</td>
              <td>Stays sharp when reading huge codebases. Doesn't miss important details in the middle of files.</td>
              <td>Can lose track of details or get confused when you upload too many files at once.</td>
            </tr>
            <tr>
              <td className="highlight">Response Speed</td>
              <td className="highlight">Extremely fast. Your code context is pre-loaded on our servers for quick replies.</td>
              <td>Goes through standard public queues, which can feel slower during peak hours.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
