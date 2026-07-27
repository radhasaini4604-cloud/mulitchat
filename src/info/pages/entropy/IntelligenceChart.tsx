import { useState, useEffect, useRef } from 'react';

export default function IntelligenceChart() {
  const [activeLine, setActiveLine] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; text: string } | null>(null);
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
    <div ref={containerRef} className={`performance-row-vertical lift-up-container ${isAnimate ? 'animated' : ''}`}>
      <div className="performance-info-block">
        <h4 className="chart-title">Intelligence Index vs. Context Length</h4>
        <p className="chart-subtitle-clean">Factual reasoning and logic index as file size increases (higher is better)</p>
        <p className="performance-info-text">
          The Intelligence Index tracks how effectively a model retains reasoning, factual retrieval, and code synthesis capabilities under high context loads. While standard lightweight models show a noticeable drop in accuracy as files and chats grow, Entropy 3.5 remains remarkably stable up to its 128k limit, ensuring reliable answers for long-document tasks.
        </p>
      </div>
      <div className="performance-chart-block light-theme">
        <div className="chart-svg-wrapper">
          <svg viewBox="0 0 500 330" className="chart-svg">
            <defs>
              <linearGradient id="entropy-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bca5ff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#bca5ff" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="gpt-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#334155" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="claude-grad-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#64748b" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="claude-grad-2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Title */}
            <text x="24" y="32" className="chart-title-light">NVIDIA RULER Benchmark Accuracy vs. Context Length</text>

            {/* Legend */}
            <g transform="translate(24, 52)">
              <g
                className="legend-item"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveLine('entropy')}
                onMouseLeave={() => setActiveLine(null)}
              >
                <circle cx="10" cy="10" r="4.5" fill="#bca5ff" />
                <text x="20" y="13" className="chart-legend-light" style={{ fontWeight: 600, fill: '#000' }}>Entropy 3.5</text>
              </g>
              
              <g
                className="legend-item"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveLine('gpt55')}
                onMouseLeave={() => setActiveLine(null)}
                transform="translate(100, 0)"
              >
                <circle cx="10" cy="10" r="4.5" fill="#334155" />
                <text x="20" y="13" className="chart-legend-light">GPT-5.5</text>
              </g>

              <g
                className="legend-item"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveLine('claude47')}
                onMouseLeave={() => setActiveLine(null)}
                transform="translate(180, 0)"
              >
                <circle cx="10" cy="10" r="4.5" fill="#64748b" />
                <text x="20" y="13" className="chart-legend-light">Claude Opus 4.7</text>
              </g>

              <g
                className="legend-item"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setActiveLine('claude46')}
                onMouseLeave={() => setActiveLine(null)}
                transform="translate(280, 0)"
              >
                <circle cx="10" cy="10" r="4.5" fill="#94a3b8" />
                <text x="20" y="13" className="chart-legend-light">Claude Opus 4.6</text>
              </g>
            </g>

            {/* Grid Lines */}
            <line x1="60" y1="80" x2="480" y2="80" stroke="#e5e5e7" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="120" x2="480" y2="120" stroke="#e5e5e7" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="160" x2="480" y2="160" stroke="#e5e5e7" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="200" x2="480" y2="200" stroke="#e5e5e7" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="60" y1="240" x2="480" y2="240" stroke="#e5e5e7" strokeWidth="1" strokeDasharray="3 3" />

            {/* Axes */}
            <line x1="60" y1="80" x2="60" y2="280" stroke="#d2d2d7" strokeWidth="1" />
            <line x1="60" y1="280" x2="480" y2="280" stroke="#d2d2d7" strokeWidth="1" />

            {/* Y-Axis ticks and labels */}
            <line x1="56" y1="280" x2="60" y2="280" stroke="#d2d2d7" strokeWidth="1" />
            <text x="50" y="283" className="chart-label-light" textAnchor="end">0%</text>

            <line x1="56" y1="240" x2="60" y2="240" stroke="#d2d2d7" strokeWidth="1" />
            <text x="50" y="243" className="chart-label-light" textAnchor="end">20%</text>

            <line x1="56" y1="200" x2="60" y2="200" stroke="#d2d2d7" strokeWidth="1" />
            <text x="50" y="203" className="chart-label-light" textAnchor="end">40%</text>

            <line x1="56" y1="160" x2="60" y2="160" stroke="#d2d2d7" strokeWidth="1" />
            <text x="50" y="163" className="chart-label-light" textAnchor="end">60%</text>

            <line x1="56" y1="120" x2="60" y2="120" stroke="#d2d2d7" strokeWidth="1" />
            <text x="50" y="123" className="chart-label-light" textAnchor="end">80%</text>

            <line x1="56" y1="80" x2="60" y2="80" stroke="#d2d2d7" strokeWidth="1" />
            <text x="50" y="83" className="chart-label-light" textAnchor="end">100%</text>

            {/* Y-Axis Title */}
            <text x="20" y="180" className="chart-label-light axis-title" transform="rotate(-90, 20, 180)" textAnchor="middle">
              RULER Benchmark Accuracy (%)
            </text>

            {/* X-Axis ticks and labels */}
            <line x1="60" y1="280" x2="60" y2="284" stroke="#d2d2d7" strokeWidth="1" />
            <text x="60" y="296" className="chart-label-light" textAnchor="middle">0</text>

            <line x1="120" y1="280" x2="120" y2="284" stroke="#d2d2d7" strokeWidth="1" />
            <text x="120" y="296" className="chart-label-light" textAnchor="middle">4K</text>

            <line x1="180" y1="280" x2="180" y2="284" stroke="#d2d2d7" strokeWidth="1" />
            <text x="180" y="296" className="chart-label-light" textAnchor="middle">8K</text>

            <line x1="240" y1="280" x2="240" y2="284" stroke="#d2d2d7" strokeWidth="1" />
            <text x="240" y="296" className="chart-label-light" textAnchor="middle">16K</text>

            <line x1="300" y1="280" x2="300" y2="284" stroke="#d2d2d7" strokeWidth="1" />
            <text x="300" y="296" className="chart-label-light" textAnchor="middle">32K</text>

            <line x1="360" y1="280" x2="360" y2="284" stroke="#d2d2d7" strokeWidth="1" />
            <text x="360" y="296" className="chart-label-light" textAnchor="middle">64K</text>

            <line x1="420" y1="280" x2="420" y2="284" stroke="#d2d2d7" strokeWidth="1" />
            <text x="420" y="296" className="chart-label-light" textAnchor="middle">128K</text>

            {/* X-Axis Title */}
            <text x="270" y="314" className="chart-label-light axis-title" textAnchor="middle">
              Context Volume (Tokens)
            </text>

            {/* Area Gradient Fills */}
            <path
              d="M 78 280 L 78 203 L 110 130 L 135 84 L 198 96 L 277 122 L 380 90 L 413 113 L 413 280 Z"
              fill="url(#entropy-grad)"
              stroke="none"
              opacity={activeLine && activeLine !== 'entropy' ? 0.05 : 1}
              style={{ transition: 'opacity 0.25s' }}
            />
            <path
              d="M 80 280 L 80 266 L 125 187 L 200 204 L 364 202 L 410 160 L 410 280 Z"
              fill="url(#gpt-grad)"
              stroke="none"
              opacity={activeLine && activeLine !== 'gpt55' ? 0.05 : 1}
              style={{ transition: 'opacity 0.25s' }}
            />
            <path
              d="M 98 280 L 98 249 L 169 205 L 229 252 L 321 242 L 386 190 L 386 280 Z"
              fill="url(#claude-grad-1)"
              stroke="none"
              opacity={activeLine && activeLine !== 'claude47' ? 0.05 : 1}
              style={{ transition: 'opacity 0.25s' }}
            />
            <path
              d="M 171 280 L 171 244 L 243 207 L 317 154 L 377 156 L 377 280 Z"
              fill="url(#claude-grad-2)"
              stroke="none"
              opacity={activeLine && activeLine !== 'claude46' ? 0.05 : 1}
              style={{ transition: 'opacity 0.25s' }}
            />

            {/* Claude Opus 4.6 (Light Slate Gray) Line */}
            <path
              d="M 171 244 L 243 207 L 317 154 L 377 156"
              fill="none"
              stroke="#94a3b8"
              strokeWidth={activeLine === 'claude46' ? 2.5 : 1.2}
              opacity={activeLine && activeLine !== 'claude46' ? 0.2 : 1}
              style={{ transition: 'stroke-width 0.25s, opacity 0.25s' }}
            />
            <circle cx="171" cy="244" r="2" fill="#94a3b8" opacity={activeLine && activeLine !== 'claude46' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="243" cy="207" r="2" fill="#94a3b8" opacity={activeLine && activeLine !== 'claude46' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="317" cy="154" r="2" fill="#94a3b8" opacity={activeLine && activeLine !== 'claude46' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="377" cy="156" r="2" fill="#94a3b8" opacity={activeLine && activeLine !== 'claude46' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />

            {/* Claude Opus 4.7 (Muted Slate Gray) Line */}
            <path
              d="M 98 249 L 169 205 L 229 252 L 321 242 L 386 190"
              fill="none"
              stroke="#64748b"
              strokeWidth={activeLine === 'claude47' ? 2.5 : 1.2}
              opacity={activeLine && activeLine !== 'claude47' ? 0.2 : 1}
              style={{ transition: 'stroke-width 0.25s, opacity 0.25s' }}
            />
            <circle cx="98" cy="249" r="2" fill="#64748b" opacity={activeLine && activeLine !== 'claude47' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="169" cy="205" r="2" fill="#64748b" opacity={activeLine && activeLine !== 'claude47' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="229" cy="252" r="2" fill="#64748b" opacity={activeLine && activeLine !== 'claude47' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="321" cy="242" r="2" fill="#64748b" opacity={activeLine && activeLine !== 'claude47' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="386" cy="190" r="2" fill="#64748b" opacity={activeLine && activeLine !== 'claude47' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />

            {/* GPT-5.5 (Dark Slate Gray) Line */}
            <path
              d="M 80 266 L 125 187 L 200 204 L 364 202 L 410 160"
              fill="none"
              stroke="#334155"
              strokeWidth={activeLine === 'gpt55' ? 2.5 : 1.2}
              opacity={activeLine && activeLine !== 'gpt55' ? 0.2 : 1}
              style={{ transition: 'stroke-width 0.25s, opacity 0.25s' }}
            />
            <circle cx="80" cy="266" r="2" fill="#334155" opacity={activeLine && activeLine !== 'gpt55' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="125" cy="187" r="2" fill="#334155" opacity={activeLine && activeLine !== 'gpt55' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="200" cy="204" r="2" fill="#334155" opacity={activeLine && activeLine !== 'gpt55' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="364" cy="202" r="2" fill="#334155" opacity={activeLine && activeLine !== 'gpt55' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="410" cy="160" r="2" fill="#334155" opacity={activeLine && activeLine !== 'gpt55' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />

            {/* Entropy 3.5 (Vibrant Lavender) Line */}
            <path
              d="M 78 203 L 110 130 L 135 84 L 198 96 L 277 122 L 380 90 L 413 113"
              fill="none"
              stroke="#bca5ff"
              strokeWidth={activeLine === 'entropy' ? 3.0 : 1.8}
              opacity={activeLine && activeLine !== 'entropy' ? 0.2 : 1}
              style={{ transition: 'stroke-width 0.25s, opacity 0.25s' }}
            />
            <circle cx="78" cy="203" r="2.5" fill="#bca5ff" opacity={activeLine && activeLine !== 'entropy' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="110" cy="130" r="2.5" fill="#bca5ff" opacity={activeLine && activeLine !== 'entropy' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="135" cy="84" r="2.5" fill="#bca5ff" opacity={activeLine && activeLine !== 'entropy' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="198" cy="96" r="2.5" fill="#bca5ff" opacity={activeLine && activeLine !== 'entropy' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="277" cy="122" r="2.5" fill="#bca5ff" opacity={activeLine && activeLine !== 'entropy' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="380" cy="90" r="2.5" fill="#bca5ff" opacity={activeLine && activeLine !== 'entropy' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />
            <circle cx="413" cy="113" r="2.5" fill="#bca5ff" opacity={activeLine && activeLine !== 'entropy' ? 0.2 : 1} style={{ transition: 'opacity 0.25s' }} />

            {/* Transparent Hover Areas for points */}
            {/* Entropy 3.5 Hover Targets */}
            <circle cx="78" cy="203" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 78, y: 203, text: 'Entropy 3.5 (4.8K): 38.5%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="110" cy="130" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 110, y: 130, text: 'Entropy 3.5 (6.5K): 75.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="135" cy="84" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 135, y: 84, text: 'Entropy 3.5 (8.2K): 98.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="198" cy="96" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 198, y: 96, text: 'Entropy 3.5 (15.1K): 92.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="277" cy="122" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 277, y: 122, text: 'Entropy 3.5 (32.3K): 79.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="380" cy="90" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 380, y: 90, text: 'Entropy 3.5 (87.1K): 95.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="413" cy="113" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 413, y: 113, text: 'Entropy 3.5 (120K): 83.5%' })} onMouseLeave={() => setHoveredPoint(null)} />

            {/* GPT-5.5 Hover Targets */}
            <circle cx="80" cy="266" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 80, y: 266, text: 'GPT-5.5 (4.8K): 7.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="125" cy="187" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 125, y: 187, text: 'GPT-5.5 (7.5K): 46.5%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="200" cy="204" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 200, y: 204, text: 'GPT-5.5 (15.4K): 38.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="364" cy="202" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 364, y: 202, text: 'GPT-5.5 (74.7K): 39.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="410" cy="160" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 410, y: 160, text: 'GPT-5.5 (116K): 60.0%' })} onMouseLeave={() => setHoveredPoint(null)} />

            {/* Claude Opus 4.7 Hover Targets */}
            <circle cx="98" cy="249" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 98, y: 249, text: 'Claude Opus 4.7 (5.8K): 15.5%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="169" cy="205" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 169, y: 205, text: 'Claude Opus 4.7 (11.4K): 37.5%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="229" cy="252" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 229, y: 252, text: 'Claude Opus 4.7 (20.4K): 14.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="321" cy="242" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 321, y: 242, text: 'Claude Opus 4.7 (49.4K): 19.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="386" cy="190" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 386, y: 190, text: 'Claude Opus 4.7 (92.3K): 45.0%' })} onMouseLeave={() => setHoveredPoint(null)} />

            {/* Claude Opus 4.6 Hover Targets */}
            <circle cx="171" cy="244" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 171, y: 244, text: 'Claude Opus 4.6 (11.6K): 18.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="243" cy="207" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 243, y: 207, text: 'Claude Opus 4.6 (23.3K): 36.5%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="317" cy="154" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 317, y: 154, text: 'Claude Opus 4.6 (47.5K): 63.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
            <circle cx="377" cy="156" r="10" fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint({ x: 377, y: 156, text: 'Claude Opus 4.6 (84.6K): 62.0%' })} onMouseLeave={() => setHoveredPoint(null)} />
          </svg>
          {hoveredPoint && (
            <div
              className="chart-tooltip"
              style={{
                left: `${(hoveredPoint.x / 500) * 100}%`,
                top: `${((hoveredPoint.y - 12) / 330) * 100}%`
              }}
            >
              {hoveredPoint.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
