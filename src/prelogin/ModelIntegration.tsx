import { useState } from 'react';

interface ModelLane {
  id: string;
  name: string;
  badge: string;
  specialty: string;
  examplePrompt: string;
  fullStrengths: string;
  iconColor: string;
  iconSvg: React.ReactNode;
}

export default function ModelIntegration() {
  const [hoveredLane, setHoveredLane] = useState<string | null>(null);

  const lanes: ModelLane[] = [
    {
      id: 'gemini',
      name: 'Gemini 2.5 Flash',
      badge: 'Google',
      specialty: 'Complex Logic & Long Context',
      examplePrompt: 'Summarize this 3-hour audio podcast transcript and extract key developer action items.',
      fullStrengths: 'Routed to Gemini 2.5 Flash because of its massive token context window and high speed. Ideal for multi-modal logic, complex document parsing, and processing raw files.',
      iconColor: '#1a73e8',
      iconSvg: (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
          <path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81" />
        </svg>
      )
    },
    {
      id: 'gpt',
      name: 'GPT 120B',
      badge: 'OpenAI',
      specialty: 'High-Reasoning Open MoE Model',
      examplePrompt: 'Search the web for the latest high-performance CPU benchmarks and return a speed comparison table.',
      fullStrengths: 'Routed to GPT-OSS 120B, OpenAI\'s open-weights model run on Groq LPU hardware for deep agentic reasoning, logic, and extreme performance.',
      iconColor: '#ffffff',
      iconSvg: (
        <svg viewBox="0 0 512 509.639" style={{ width: '16px', height: '16px' }}>
          <path fill="#fff" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/>
          <path fill-rule="nonzero" d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"/>
        </svg>
      )
    },
    {
      id: 'qwen',
      name: 'Qwen Coder',
      badge: 'Alibaba',
      specialty: 'Code Synthesis & Debugging',
      examplePrompt: 'Refactor this legacy React component into a TypeScript functional hook and fix memory leaks.',
      fullStrengths: 'Routed to Qwen 2.5 Coder 32B on Groq, the top-rated open programming model. Outstanding logic for multi-language code generation, refactoring, and inline bug fixing.',
      iconColor: '#131313',
      iconSvg: (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
          <path d="M12.604 1.34c.393.69.784 1.382 1.174 2.075a.18.18 0 00.157.091h5.552c.174 0 .322.11.446.327l1.454 2.57c.19.337.24.478.024.837-.26.43-.513.864-.76 1.3l-.367.658c-.106.196-.223.28-.04.512l2.652 4.637c.172.301.111.494-.043.77-.437.785-.882 1.564-1.335 2.34-.159.272-.352.375-.68.37-.777-.016-1.552-.01-2.327.016a.099.099 0 00-.081.05 575.097 575.097 0 01-2.705 4.74c-.169.293-.38.363-.725.364-.997.003-2.002.004-3.017.002a.537.537 0 01-.465-.271l-1.335-2.323a.09.09 0 00-.083-.049H4.982c-.285.03-.553-.001-.805-.092l-1.603-2.77a.543.543 0 01-.002-.54l1.207-2.12a.198.198 0 000-.197 550.951 550.951 0 01-1.875-3.272l-.79-1.395c-.16-.31-.173-.496.095-.965.465-.813.927-1.625 1.387-2.436.132-.234.304-.334.584-.335a338.3 338.3 0 012.589-.001.124.124 0 00.107-.063l2.806-4.895a.488.488 0 01.422-.246c.524-.001 1.053 0 1.583-.006L11.704 1c.341-.003.724.032.9.34zm-3.432.403a.06.06 0 00-.052.03L6.254 6.788a.157.157 0 01-.135.078H3.253c-.056 0-.07.025-.041.074l5.81 10.156c.025.042.013.062-.034.063l-2.795.015a.218.218 0 00-.2.116l-1.32 2.31c-.044.078-.021.118.068.118l5.716.008c.046 0 .08.02.104.061l1.403 2.454c.046.081.092.082.139 0l5.006-8.76.783-1.382a.055.055 0 01.096 0l1.424 2.53a.122.122 0 00.107.062l2.763-.02a.04.04 0 00.035-.02.041.041 0 000-.04l-2.9-5.086a.108.108 0 010-.113l.293-.507 1.12-1.977c.024-.041.012-.062-.035-.062H9.2c-.059 0-.073-.026-.043-.077l1.434-2.505a.107.107 0 000-.114L9.225 1.774a.06.06 0 00-.053-.031zm6.29 8.02c.046 0 .058.02.034.06l-.832 1.465-2.613 4.585a.056.056 0 01-.05.029.058.058 0 01-.05-.029L8.498 9.841c-.02-.034-.01-.052.028-.054l.216-.012 6.722-.012z" />
        </svg>
      )
    },
    {
      id: 'mistral',
      name: 'Mistral Large',
      badge: 'Mistral AI',
      specialty: 'Copywriting & Text Formatting',
      examplePrompt: 'Draft a premium launch email campaign for Nothric highlighting multi-model capabilities.',
      fullStrengths: 'Routed to Mistral Large for creative text synthesis. Fine-tuned for multilingual summarization, document formatting, and writing polished email copies.',
      iconColor: '#fa500f',
      iconSvg: (
        <svg viewBox="0 0 512 512" style={{ width: '16px', height: '16px' }}>
          <g transform="translate(6 79.299) scale(1.96335)">
            <g transform="scale(1.33333)">
              <path fill="#ffd800" d="M27.153 0h27.169v27.089H27.153zM135.815 0h27.169v27.089h-27.169z"/>
              <path fill="#ffaf00" d="M27.153 27.091h54.329V54.18H27.153zM108.661 27.091h54.329V54.18h-54.329z"/>
              <path fill="#ff8205" d="M27.153 54.168h135.819v27.089H27.153z"/>
              <path fill="#fa500f" d="M27.153 81.259h27.169v27.09H27.153zM81.492 81.259h27.169v27.09H81.492zM135.815 81.259h27.169v27.09h-27.169z"/>
              <path fill="#e10500" d="M-.001 108.339h81.489v27.09H-.001zM108.661 108.339h81.498v27.09h-81.498z"/>
            </g>
          </g>
        </svg>
      )
    },
    {
      id: 'cohere',
      name: 'Command R+',
      badge: 'Cohere',
      specialty: 'RAG & Document Extraction',
      examplePrompt: 'Cross-reference these three PDF financial statements and extract total tax liabilities with page citations.',
      fullStrengths: 'Routed to Command R+ for enterprise RAG. Excels at crawling multiple large files, returning precise inline citations, and parsing JSON structures.',
      iconColor: '#0d3220',
      iconSvg: (
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
          <path d="M8.128 14.099c.592 0 1.77-.033 3.398-.703 1.897-.781 5.672-2.2 8.395-3.656 1.905-1.018 2.74-2.366 2.74-4.18A4.56 4.56 0 0018.1 1H7.549A6.55 6.55 0 001 7.55c0 3.617 2.745 6.549 7.128 6.549z" />
          <path d="M9.912 18.61a4.387 4.387 0 012.705-4.052l3.323-1.38c3.361-1.394 7.06 1.076 7.06 4.715a5.104 5.104 0 01-5.105 5.104l-3.597-.001a4.386 4.386 0 01-4.386-4.387z" />
          <path d="M4.776 14.962A3.775 3.775 0 001 18.738v.489a3.776 3.776 0 007.551 0v-.49a3.775 3.775 0 00-3.775-3.775z" />
        </svg>
      )
    },
    {
      id: 'nemotron',
      name: 'Nemotron 120B',
      badge: 'NVIDIA',
      specialty: 'Structured Data Processing',
      examplePrompt: 'Parse 50,000 system logs, run a statistical classification of error patterns, and isolate root causes.',
      fullStrengths: 'Routed to Nemotron for heavy mathematical workloads. Built to parse huge databases, run complex data schemas, and execute heavy statistical classification.',
      iconColor: '#76b900',
      iconSvg: (
        <svg viewBox="0 0 64 64" fill="currentColor" style={{ width: '16px', height: '16px' }}>
          <path d="M23.862 23.46v-3.816l1.13-.047c10.46-.33 17.313 8.998 17.313 8.998s-7.396 10.27-15.335 10.27a9.73 9.73 0 0 1-3.086-.495v-11.59c4.075.495 4.9 2.285 7.326 6.36l5.44-4.57s-3.98-5.206-10.67-5.206c-.707-.024-1.413.024-2.12.094m0-12.626v5.7l1.13-.07c14.534-.495 24.026 11.92 24.026 11.92S38.136 41.622 26.806 41.622c-.99 0-1.955-.094-2.92-.26v3.533c.8.094 1.625.165 2.426.165 10.553 0 18.185-5.394 25.58-11.754 1.225.99 6.242 3.368 7.28 4.405-7.02 5.89-23.39 10.623-32.67 10.623a23.24 23.24 0 0 1-2.591-.141v4.97H64v-42.33zm0 27.536v3.015C14.1 39.644 11.4 29.49 11.4 29.49s4.688-5.182 12.46-6.03v3.298h-.024c-4.075-.495-7.28 3.32-7.28 3.32s1.814 6.43 7.302 8.29M6.548 29.067s5.77-8.527 17.337-9.422v-3.11C11.07 17.572 0 28.408 0 28.408s6.266 18.138 23.862 19.787v-3.298c-12.908-1.602-17.313-15.83-17.313-15.83z" />
        </svg>
      )
    }
  ];

  // Y center coordinates for paths to match model lane heights
  const laneYCoordinates = [30, 92, 154, 216, 278, 340];
  const hoveredModelDetails = hoveredLane ? lanes.find(l => l.id === hoveredLane) : null;

  return (
    <>
      <style>{`
        .pl-wrapper {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          box-sizing: border-box;
          padding-left: 24px;
          padding-right: 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .pl-node {
          width: 190px;
          flex-shrink: 0;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.015),
            0 6px 12px rgba(0, 0, 0, 0.02),
            0 16px 28px rgba(0, 0, 0, 0.025),
            0 36px 72px rgba(0, 0, 0, 0.035);
          text-align: left;
          z-index: 10;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .pl-node.hovered {
          border-color: rgba(0, 0, 0, 0.15);
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.02),
            0 12px 24px rgba(0, 0, 0, 0.035),
            0 32px 56px rgba(0, 0, 0, 0.05),
            0 72px 110px rgba(0, 0, 0, 0.065);
        }

        .pl-node-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1d1d1f;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pl-node-desc {
          font-size: 0.76rem;
          color: #6e6e73;
          line-height: 1.4;
          margin: 0;
        }

        .pl-svg-connector {
          flex: 1;
          min-width: 40px;
          max-width: 140px;
          height: 370px;
          pointer-events: none;
          z-index: 5;
        }

        .pl-circuit-path {
          stroke: rgba(0, 0, 0, 0.06);
          stroke-width: 1.5;
          fill: none;
          transition: stroke 0.35s ease, stroke-width 0.35s ease;
        }

        .pl-circuit-path.active {
          stroke: rgba(0, 0, 0, 0.22);
          stroke-width: 2.0;
        }

        .pl-lanes-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 380px;
          flex-shrink: 0;
          z-index: 10;
        }

        .pl-lane-card {
          background: #ffffff;
          border: 0.5px solid rgba(0, 0, 0, 0.07);
          border-radius: 9999px;
          padding: 10px 22px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: left;
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.015),
            0 4px 10px rgba(0, 0, 0, 0.02);
        }

        .pl-lane-card:hover {
          transform: scale(1.015);
          border-color: rgba(0, 0, 0, 0.12);
          box-shadow: 
            0 6px 12px rgba(0, 0, 0, 0.03),
            0 12px 24px rgba(0, 0, 0, 0.05);
        }

        .pl-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .pl-lane-card:hover .pl-icon-box {
          background: #ffffff;
          border-color: currentColor;
        }

        .pl-lane-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .pl-lane-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pl-lane-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0;
        }

        .pl-lane-badge {
          font-size: 0.65rem;
          font-weight: 500;
          color: #6e6e73;
          background: rgba(0, 0, 0, 0.04);
          padding: 1px 6px;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .pl-lane-specialty {
          font-size: 0.74rem;
          color: #86868b;
          margin: 0;
        }

        @keyframes textFadeInUp {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pl-animate-text {
          animation: textFadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Mobile Layout Styling */
        @media (max-width: 900px) {
          .pl-wrapper {
            flex-direction: column;
            gap: 24px;
            margin: 40px auto;
          }
          .pl-svg-connector {
            display: none;
          }
          .pl-node {
            width: 100%;
            max-width: 380px;
          }
          .pl-lanes-stack {
            width: 100%;
            max-width: 380px;
          }
          .pl-mobile-arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(0, 0, 0, 0.2);
          }
        }

        @media (min-width: 901px) {
          .pl-mobile-arrow {
            display: none;
          }
        }

      `}</style>

      {/* Interactive Pipeline Diagram */}
      <div className="pl-wrapper">
        {/* Left Side: Input Node */}
        <div className={`pl-node ${hoveredLane ? 'hovered' : ''}`}>
          <div className="pl-node-title" key={hoveredLane ? `${hoveredLane}-left-title` : 'default-left-title'} style={{ transition: 'color 0.3s' }}>
            <span className="pl-animate-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: hoveredModelDetails ? hoveredModelDetails.iconColor : '#86868b', transition: 'color 0.3s' }}>
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                <path d="m21.854 2.147-10.94 10.939"/>
              </svg>
              {hoveredModelDetails ? 'Example Task' : 'Your Prompt'}
            </span>
          </div>
          <p 
            className="pl-node-desc pl-animate-text" 
            key={hoveredLane ? `${hoveredLane}-left-desc` : 'default-left-desc'} 
            style={{ 
              minHeight: '84px',
              fontStyle: hoveredModelDetails ? 'italic' : 'normal'
            }}
          >
            {hoveredModelDetails 
              ? `"${hoveredModelDetails.examplePrompt}"` 
              : 'Enter any prompt—whether it\'s complex code architecture, long audio recordings, or high-speed web searches.'}
          </p>
        </div>

        {/* Left SVG Connectors (Desktop Only) */}
        <svg className="pl-svg-connector" viewBox="0 0 140 370">
          {laneYCoordinates.map((y, index) => {
            const laneId = lanes[index].id;
            const isActive = hoveredLane === laneId;
            return (
              <g key={`left-${laneId}`}>
                <path
                  className={`pl-circuit-path ${isActive ? 'active' : ''}`}
                  d={`M 0 185 C 60 185, 80 ${y}, 140 ${y}`}
                />
              </g>
            );
          })}
        </svg>

        {/* Mobile Spacer Arrow */}
        <div className="pl-mobile-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>

        {/* Middle Stack: Model Lanes */}
        <div className="pl-lanes-stack">
          {lanes.map((lane) => (
            <div
              key={lane.id}
              className="pl-lane-card"
              onMouseEnter={() => setHoveredLane(lane.id)}
              onMouseLeave={() => setHoveredLane(null)}
              style={{
                borderColor: hoveredLane === lane.id ? 'rgba(0, 0, 0, 0.16)' : 'rgba(0, 0, 0, 0.07)'
              }}
            >
              <div
                className="pl-icon-box"
                style={{
                  color: lane.iconColor
                }}
              >
                {lane.iconSvg}
              </div>
              <div className="pl-lane-content">
                <div className="pl-lane-meta">
                  <h4 className="pl-lane-name">{lane.name}</h4>
                  <span className="pl-lane-badge">{lane.badge}</span>
                </div>
                <p className="pl-lane-specialty">{lane.specialty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Spacer Arrow */}
        <div className="pl-mobile-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>

        {/* Right SVG Connectors (Desktop Only) */}
        <svg className="pl-svg-connector" viewBox="0 0 140 370">
          {laneYCoordinates.map((y, index) => {
            const laneId = lanes[index].id;
            const isActive = hoveredLane === laneId;
            return (
              <g key={`right-${laneId}`}>
                <path
                  className={`pl-circuit-path ${isActive ? 'active' : ''}`}
                  d={`M 0 ${y} C 60 ${y}, 80 185, 140 185`}
                />
              </g>
            );
          })}
        </svg>

        {/* Right Side: Output Node */}
        <div className={`pl-node ${hoveredLane ? 'hovered' : ''}`}>
          <div className="pl-node-title" key={hoveredLane ? `${hoveredLane}-right-title` : 'default-right-title'} style={{ transition: 'color 0.3s' }}>
            <span className="pl-animate-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: hoveredModelDetails ? hoveredModelDetails.iconColor : '#86868b', transition: 'color 0.3s' }}>
                <path d="m15 10 5 5-5 5"/>
                <path d="M4 4v7a4 4 0 0 0 4 4h12"/>
              </svg>
              {hoveredModelDetails ? `Routed to ${hoveredModelDetails.name}` : 'Dynamic Router'}
            </span>
          </div>
          <p className="pl-node-desc pl-animate-text" key={hoveredLane ? `${hoveredLane}-right-desc` : 'default-right-desc'} style={{ minHeight: '84px' }}>
            {hoveredModelDetails 
              ? hoveredModelDetails.fullStrengths 
              : 'Nothric automatically analyzes your task query and routes it to the absolute best-performing AI model in real time.'}
          </p>
        </div>
      </div>
    </>
  );
}
