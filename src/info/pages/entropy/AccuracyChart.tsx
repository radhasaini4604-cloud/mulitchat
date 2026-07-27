import { useState, useEffect, useRef } from 'react';
import './AccuracyChart.css';

export default function AccuracyChart() {
  const [selectedBenchmark, setSelectedBenchmark] = useState<'mmlu' | 'humaneval' | 'gsm8k'>('mmlu');
  const [hoveredBar, setHoveredBar] = useState<{ x: number; y: number; text: string } | null>(null);
  const [isAnimate, setIsAnimate] = useState(false);
  const [tabAnimate, setTabAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const scrollContainer = document.querySelector('.entropy-page');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnimate(true);
          isVisibleRef.current = true;
          setTabAnimate(true);
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

  useEffect(() => {
    if (!isVisibleRef.current) return;
    setTabAnimate(false);
    const timer = setTimeout(() => {
      setTabAnimate(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [selectedBenchmark]);

  return (
    <div ref={containerRef} className={`performance-row-vertical lift-up-container ${isAnimate ? 'animated' : ''}`}>
      <div className="performance-info-block">
        <h4 className="chart-title">Benchmark Accuracy</h4>
        <p className="chart-subtitle-clean">Direct comparison across core task categories (higher is better)</p>
        <p className="performance-info-text">
          We benchmarked Entropy 3.5 against leading light-weight models in its tier. In math reasoning (GSM8K) and general knowledge (MMLU), it matches or exceeds competitor models like GPT-4o-mini and Claude 3 Haiku. In software development tasks (HumanEval), Entropy 3.5 delivers premium, production-ready code outputs with a significant efficiency gain.
        </p>
      </div>
      <div className="performance-chart-block accuracy-chart-block">
        {/* Interactive Segmented Tabs */}
        <div className="benchmark-tabs-container">
          <button
            className={`benchmark-tab-btn ${selectedBenchmark === 'mmlu' ? 'active' : ''}`}
            onClick={() => setSelectedBenchmark('mmlu')}
          >
            MMLU (Knowledge)
          </button>
          <button
            className={`benchmark-tab-btn ${selectedBenchmark === 'humaneval' ? 'active' : ''}`}
            onClick={() => setSelectedBenchmark('humaneval')}
          >
            HumanEval (Coding)
          </button>
          <button
            className={`benchmark-tab-btn ${selectedBenchmark === 'gsm8k' ? 'active' : ''}`}
            onClick={() => setSelectedBenchmark('gsm8k')}
          >
            GSM8K (Math)
          </button>
        </div>

        <div className="chart-svg-wrapper">
          <svg viewBox="0 0 240 180" className="chart-svg">
            {/* Axes */}
            <line x1="40" y1="150" x2="220" y2="150" stroke="#d2d2d7" strokeWidth="1" />
            <line x1="40" y1="30" x2="40" y2="150" stroke="#d2d2d7" strokeWidth="1" />

            {/* Y-Axis Labels */}
            <text x="32" y="32" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">100%</text>
            <text x="32" y="62" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">75%</text>
            <text x="32" y="92" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">50%</text>
            <text x="32" y="122" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">25%</text>
            <text x="32" y="152" className="chart-label-light" style={{ fontSize: '6px' }} textAnchor="end">0%</text>

            {/* Dynamic Benchmark rendering based on selection */}
            {selectedBenchmark === 'mmlu' && (
              <>
                {/* Claude 3 Haiku */}
                <rect
                  x="65" y={tabAnimate ? 59.76 : 150} width="18" height={tabAnimate ? 90.24 : 0} fill="#eeeeef" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.0s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.0s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 74, y: 59.76, text: 'Claude 3 Haiku (MMLU): 75.2%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="74" y="54.76" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.4s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">75.2%</text>
                <text x="74" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">Haiku</text>

                {/* Claude Opus 4.7 */}
                <rect
                  x="93" y={tabAnimate ? 52.2 : 150} width="18" height={tabAnimate ? 97.8 : 0} fill="#e1e1e3" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 102, y: 52.2, text: 'Claude Opus 4.7 (MMLU): 81.5%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="102" y="47.2" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.5s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">81.5%</text>
                <text x="102" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">Opus 4.7</text>

                {/* Gemini 3.1 Pro Preview */}
                <rect
                  x="121" y={tabAnimate ? 49.44 : 150} width="18" height={tabAnimate ? 100.56 : 0} fill="#c5c5c7" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 130, y: 49.44, text: 'Gemini 3.1 Pro Preview (MMLU): 83.8%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="130" y="44.44" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.6s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">83.8%</text>
                <text x="130" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">Gem 3.1</text>

                {/* GPT-4o-mini */}
                <rect
                  x="149" y={tabAnimate ? 51.6 : 150} width="18" height={tabAnimate ? 98.4 : 0} fill="#8e8e93" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 158, y: 51.6, text: 'GPT-4o-mini (MMLU): 82.0%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="158" y="46.6" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.7s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">82.0%</text>
                <text x="158" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">GPT-4o-m</text>

                {/* Entropy 3.5 (Flash) - Dark Shade / Most Powerful */}
                <rect
                  x="177" y={tabAnimate ? 47.52 : 150} width="18" height={tabAnimate ? 102.48 : 0} fill="#1d1d1f" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 186, y: 47.52, text: 'Entropy 3.5 (MMLU): 85.4%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="186" y="42.52" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.8s' : 'none', fontSize: '5px', fontWeight: 600, fill: '#1d1d1f' }} textAnchor="middle">85.4%</text>
                <text x="186" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px', fontWeight: 600, fill: '#1d1d1f' }} textAnchor="middle">Entropy 3.5</text>
              </>
            )}

            {selectedBenchmark === 'humaneval' && (
              <>
                {/* Claude 3 Haiku */}
                <rect
                  x="65" y={tabAnimate ? 58.92 : 150} width="18" height={tabAnimate ? 91.08 : 0} fill="#eeeeef" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.0s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.0s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 74, y: 58.92, text: 'Claude 3 Haiku (HumanEval): 75.9%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="74" y="53.92" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.4s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">75.9%</text>
                <text x="74" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">Haiku</text>

                {/* Claude Opus 4.7 */}
                <rect
                  x="93" y={tabAnimate ? 48.24 : 150} width="18" height={tabAnimate ? 101.76 : 0} fill="#e1e1e3" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 102, y: 48.24, text: 'Claude Opus 4.7 (HumanEval): 84.8%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="102" y="43.24" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.5s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">84.8%</text>
                <text x="102" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">Opus 4.7</text>

                {/* Gemini 3.1 Pro Preview */}
                <rect
                  x="121" y={tabAnimate ? 43.8 : 150} width="18" height={tabAnimate ? 106.2 : 0} fill="#c5c5c7" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 130, y: 43.8, text: 'Gemini 3.1 Pro Preview (HumanEval): 88.5%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="130" y="38.8" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.6s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">88.5%</text>
                <text x="130" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">Gem 3.1</text>

                {/* GPT-4o-mini */}
                <rect
                  x="149" y={tabAnimate ? 45.36 : 150} width="18" height={tabAnimate ? 104.64 : 0} fill="#8e8e93" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 158, y: 45.36, text: 'GPT-4o-mini (HumanEval): 87.2%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="158" y="40.36" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.7s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">87.2%</text>
                <text x="158" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">GPT-4o-m</text>

                {/* Entropy 3.5 (Flash) - Dark Shade / Most Powerful */}
                <rect
                  x="177" y={tabAnimate ? 41.4 : 150} width="18" height={tabAnimate ? 108.6 : 0} fill="#1d1d1f" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 186, y: 41.4, text: 'Entropy 3.5 (HumanEval): 90.5%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="186" y="36.4" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.8s' : 'none', fontSize: '5px', fontWeight: 600, fill: '#1d1d1f' }} textAnchor="middle">90.5%</text>
                <text x="186" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px', fontWeight: 600, fill: '#1d1d1f' }} textAnchor="middle">Entropy 3.5</text>
              </>
            )}

            {selectedBenchmark === 'gsm8k' && (
              <>
                {/* Claude 3 Haiku */}
                <rect
                  x="65" y={tabAnimate ? 57.12 : 150} width="18" height={tabAnimate ? 92.88 : 0} fill="#eeeeef" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.0s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.0s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 74, y: 57.12, text: 'Claude 3 Haiku (GSM8K): 77.4%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="74" y="52.12" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.4s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">77.4%</text>
                <text x="74" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">Haiku</text>

                {/* Claude Opus 4.7 */}
                <rect
                  x="93" y={tabAnimate ? 50.16 : 150} width="18" height={tabAnimate ? 99.84 : 0} fill="#e1e1e3" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 102, y: 50.16, text: 'Claude Opus 4.7 (GSM8K): 83.2%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="102" y="45.16" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.5s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">83.2%</text>
                <text x="102" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">Opus 4.7</text>

                {/* Gemini 3.1 Pro Preview */}
                <rect
                  x="121" y={tabAnimate ? 44.64 : 150} width="18" height={tabAnimate ? 105.36 : 0} fill="#c5c5c7" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 130, y: 44.64, text: 'Gemini 3.1 Pro Preview (GSM8K): 87.8%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="130" y="39.64" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.6s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">87.8%</text>
                <text x="130" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">Gem 3.1</text>

                {/* GPT-4o-mini */}
                <rect
                  x="149" y={tabAnimate ? 46.8 : 150} width="18" height={tabAnimate ? 103.2 : 0} fill="#8e8e93" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 158, y: 46.8, text: 'GPT-4o-mini (GSM8K): 86.0%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="158" y="41.8" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.7s' : 'none', fontSize: '5px', fontWeight: 500 }} textAnchor="middle">86.0%</text>
                <text x="158" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px' }} textAnchor="middle">GPT-4o-m</text>

                {/* Entropy 3.5 (Flash) - Dark Shade / Most Powerful */}
                <rect
                  x="177" y={tabAnimate ? 42.24 : 150} width="18" height={tabAnimate ? 107.76 : 0} fill="#1d1d1f" rx="2" 
                  style={{ transition: tabAnimate ? 'y 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, height 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s' : 'none' }}
                  onMouseEnter={() => setHoveredBar({ x: 186, y: 42.24, text: 'Entropy 3.5 (GSM8K): 89.8%' })}
                  onMouseLeave={() => setHoveredBar(null)}
                />
                <text x="186" y="37.24" className="chart-label-light" style={{ opacity: tabAnimate ? 1 : 0, transition: tabAnimate ? 'opacity 0.4s ease-out 0.8s' : 'none', fontSize: '5px', fontWeight: 600, fill: '#1d1d1f' }} textAnchor="middle">89.8%</text>
                <text x="186" y="162" className="chart-label-light axis-title" style={{ fontSize: '4.2px', fontWeight: 600, fill: '#1d1d1f' }} textAnchor="middle">Entropy 3.5</text>
              </>
            )}
          </svg>
          {hoveredBar && (
            <div
              className="chart-tooltip"
              style={{
                left: `${(hoveredBar.x / 240) * 100}%`,
                top: `${((hoveredBar.y - 12) / 180) * 100}%`
              }}
            >
              {hoveredBar.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
