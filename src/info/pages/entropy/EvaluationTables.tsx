import { useState } from 'react';
import './EvaluationTables.css';

interface EvaluationMetric {
  name: string;
  entropyVal: string;
  vectorVal: string;
}

const categoriesData: Record<string, { title: string; desc: string; metrics: EvaluationMetric[] }> = {
  reasoning: {
    title: "1. Abstract Reasoning",
    desc: "Evaluates zero-shot logical deduction, pattern matching, non-verbal cognitive tests, and solving complex logic grids.",
    metrics: [
      { name: "ARC-AGI (Logic Puzzle)", entropyVal: "64.2%", vectorVal: "41.0%" },
      { name: "MGP-Pro", entropyVal: "78.5%", vectorVal: "55.2%" },
      { name: "LOGIQA (Logical Deduction)", entropyVal: "89.4%", vectorVal: "70.1%" },
      { name: "Puzzle-Matrix", entropyVal: "82.0%", vectorVal: "63.4%" }
    ]
  },
  academic: {
    title: "2. Academic Performance",
    desc: "Tracks general and specific subject knowledge across high-school and graduate-level examinations, math problems, and science.",
    metrics: [
      { name: "MMLU (General Knowledge)", entropyVal: "79.0%", vectorVal: "68.5%" },
      { name: "GPQA (Graduate Science)", entropyVal: "48.2%", vectorVal: "32.0%" },
      { name: "GSM8K (Multistep Math)", entropyVal: "86.4%", vectorVal: "71.2%" },
      { name: "MATH (Advanced Math)", entropyVal: "51.0%", vectorVal: "34.5%" }
    ]
  },
  coding: {
    title: "3. Coding & Synthesis",
    desc: "Assesses logic generation accuracy, syntax verification, structural pattern recognition, and software engineering capabilities.",
    metrics: [
      { name: "HumanEval (Python)", entropyVal: "84.1%", vectorVal: "64.5%" },
      { name: "MBPP (Basic Python)", entropyVal: "89.0%", vectorVal: "72.8%" },
      { name: "SWE-bench (Software Issues)", entropyVal: "26.8%", vectorVal: "10.5%" },
      { name: "Code Debugging Success", entropyVal: "91.2%", vectorVal: "74.0%" }
    ]
  },
  tool: {
    title: "4. Tool Use & API Chaining",
    desc: "Measures formatting strictness during JSON schema generation, function call accuracy, and multi-turn API parameter chaining.",
    metrics: [
      { name: "Single Function Calling", entropyVal: "97.8%", vectorVal: "88.5%" },
      { name: "Multi-turn Tool Chaining", entropyVal: "88.4%", vectorVal: "62.0%" },
      { name: "JSON Schema Compliance", entropyVal: "99.2%", vectorVal: "84.5%" },
      { name: "API Format Correctness", entropyVal: "96.0%", vectorVal: "86.2%" }
    ]
  },
  hardware: {
    title: "5. Pricing & Hardware Efficiency",
    desc: "Summarizes runtime context limitations, average response latency, hosting architecture, and public pricing tiers.",
    metrics: [
      { name: "Input Cost (per 1M tokens)", entropyVal: "$1.50", vectorVal: "$0.15" },
      { name: "Output Cost (per 1M tokens)", entropyVal: "$4.50", vectorVal: "$0.60" },
      { name: "Response Latency (subagent)", entropyVal: "~220ms", vectorVal: "~90ms" },
      { name: "Max Context Limit", entropyVal: "128,000", vectorVal: "8,000" },
      { name: "Inference Infrastructure", entropyVal: "Nothric Cluster", vectorVal: "LPU Node" }
    ]
  }
};

export default function EvaluationTables() {
  const [activeTab, setActiveTab] = useState<string>('reasoning');

  const currentData = categoriesData[activeTab];

  return (
    <div className="evaluations-container">
      <p className="evaluations-intro-text">
        We have subjected Entropy 3.5 to rigorous benchmarking against our previous flagship, <strong>Vector 4.2 Instant</strong> (built on Groq's high-speed LPU architecture). While Vector 4.2 remains a fast option for high-throughput, simple generation, Entropy 3.5 offers a major leap forward across all complex cognitive dimensions.
      </p>

      {/* Tabs list */}
      <div className="evaluations-tabs">
        {Object.entries(categoriesData).map(([key, cat]) => {
          const labels: Record<string, string> = {
            reasoning: "Reasoning",
            academic: "Academic",
            coding: "Coding",
            tool: "Tools",
            hardware: "Hardware"
          };
          return (
            <button
              key={key}
              className={`eval-tab-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {labels[key] || cat.title}
            </button>
          );
        })}
      </div>

      {/* Tab contents */}
      <div className="eval-table-wrapper" key={activeTab}>
        <h4 className="evaluations-title">{currentData.title}</h4>
        <p className="evaluations-text">{currentData.desc}</p>

        <table className="evaluation-table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Benchmark</th>
              <th style={{ width: '30%' }}>Entropy 3.5</th>
              <th style={{ width: '30%' }}>Vector 4.2</th>
            </tr>
          </thead>
          <tbody>
            {currentData.metrics.map((m, idx) => (
              <tr key={idx}>
                <td>{m.name}</td>
                <td className="highlight">{m.entropyVal}</td>
                <td>{m.vectorVal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {activeTab === 'coding' && (
          <p className="chart-source-line" style={{ margin: '8px 0 16px 8px', fontSize: '10px' }}>
            The coding benchmark data for Vector 4.2 is sourced from <a href="https://console.groq.com/docs/model/llama-3.3-70b-versatile" target="_blank" rel="noopener noreferrer" style={{ color: '#86868b', textDecoration: 'underline' }}>Groq</a>'s Llama 3.3 70B model.
          </p>
        )}
      </div>

      {/* Workspace Capabilities Comparison Table */}
      <div className="capabilities-comparison-table-wrapper" style={{ marginTop: '64px' }}>
        <h4 className="evaluations-title" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1d1d1f', margin: '0 0 8px 0' }}>Direct Capabilities</h4>
        <p className="evaluations-text" style={{ fontSize: '0.95rem', fontWeight: 300, color: '#515154', margin: '0 0 20px 0' }}>
          Unlike benchmark scores, these features directly alter your day-to-day work environment, comparing direct multimodal inputs and active search capabilities.
        </p>

        <table className="evaluation-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Feature / Input format</th>
              <th style={{ width: '30%' }}>Entropy 3.5</th>
              <th style={{ width: '30%' }}>Vector 4.2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ fontWeight: 500, color: '#1d1d1f' }}>PDF & Document Reading</td>
              <td className="highlight">
                <div style={{ color: '#1d1d1f', fontWeight: 600 }}>✓ Yes, up to 128k tokens</div>
              </td>
              <td>
                <div style={{ color: '#86868b' }}>✗ No, text-only sandbox</div>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500, color: '#1d1d1f' }}>Voice Message Transcription</td>
              <td className="highlight">
                <div style={{ color: '#1d1d1f', fontWeight: 600 }}>✓ Yes, direct audio parsing</div>
              </td>
              <td>
                <div style={{ color: '#86868b' }}>✗ No, unsupported</div>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500, color: '#1d1d1f' }}>Image Scanning (In-Chat Vision)</td>
              <td className="highlight">
                <div style={{ color: '#1d1d1f', fontWeight: 600 }}>✓ Yes, live image scanner & OCR</div>
              </td>
              <td>
                <div style={{ color: '#86868b' }}>✗ No, text-only inputs</div>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500, color: '#1d1d1f' }}>Real-time Web Search</td>
              <td className="highlight">
                <div style={{ color: '#1d1d1f', fontWeight: 600 }}>✓ Yes, live web search query</div>
              </td>
              <td>
                <div style={{ color: '#86868b' }}>✗ No, static data snapshot</div>
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 500, color: '#1d1d1f' }}>Direct Image Generation</td>
              <td className="highlight">
                <div style={{ color: '#1d1d1f', fontWeight: 600 }}>
                  ✓ Yes, via <a href="https://developers.cloudflare.com/workers-ai/models/flux-2-dev/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#1d1d1f' }}>Cloudflare</a> integration (limited)
                </div>
              </td>
              <td>
                <div style={{ color: '#86868b' }}>✗ No, unsupported</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
