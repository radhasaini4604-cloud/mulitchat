import { useState } from 'react';
import './SupportFAQ.css';

const FAQ_ITEMS = [
  {
    question: "Does Nothric have its own AI model?",
    answer: "No. Nothric brings together AI models from multiple providers in a single, seamless experience.",
    category: "AI MODELS",
    bullets: [
      "Access OpenAI, Anthropic, and Llama.",
      "Switch dynamically between different engines.",
      "Unified system interface for all models."
    ]
  },
  {
    question: "Is Nothric free to use?",
    answer: "Yes. Nothric is currently free to use during this preview. Any future pricing changes will be announced in advance.",
    category: "PRICING",
    bullets: [
      "Zero monthly subscriptions during preview.",
      "No credit card required to sign up.",
      "Future billing updates shared well in advance."
    ]
  },
  {
    question: "How do I add my own API keys?",
    answer: "You can add your keys inside the Settings page. This allows you to bypass default rate limits and query models directly using your personal accounts.",
    category: "DEVELOPER CONFIGS",
    bullets: [
      "Bypass daily preview rate quotas.",
      "Direct pay-as-you-go provider rates.",
      "Encrypted keys database storage."
    ]
  },
  {
    question: "Is my chat data private and secure?",
    answer: "Yes. We encrypt all prompts and model responses. Your data is private, sandboxed, and never used to train public LLM models.",
    category: "DATA PRIVACY",
    bullets: [
      "AES-256 standard encryption keys.",
      "Zero training reuse on prompts/responses.",
      "Secure user sandboxed storage."
    ]
  },
  {
    question: "What happens if a query fails or errors?",
    answer: "If a request fails, Nothric automatically retries the connection or routes it to an alternative model engine to prevent workflows from stopping.",
    category: "SYSTEM RESILIENCE",
    bullets: [
      "Automated connection retry triggers.",
      "Model failover fallback routes.",
      "Dedicated infrastructure checks."
    ]
  }
];

export default function SupportFAQ() {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number>(0);

  return (
    <section className="support-faq-section">
      {/* Header */}
      <div className="faq-section-title-wrap">
        <h2 className="guarantee-h2" style={{ textAlign: 'center', margin: 0 }}>
          Frequently Asked <span>Questions</span>
        </h2>
        <p className="faq-section-subtitle">
          Got questions? We have answers. Find general information about models, billing, and system configurations below.
        </p>
      </div>

      <div className="faq-inspector-grid">
        {/* Left Column: Cardless interactive list of questions */}
        <div className="faq-inspector-nav">
          {FAQ_ITEMS.map((item, index) => {
            const isActive = activeFaqIndex === index;
            return (
              <button
                key={index}
                className={`faq-inspector-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveFaqIndex(index)}
              >
                <span className="faq-nav-number">{(index + 1).toString().padStart(2, '0')}</span>
                <span className="faq-nav-text">{item.question}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Typographic detail viewer panel */}
        <div className="faq-inspector-viewport" key={activeFaqIndex}>
          <div className="faq-viewport-glow-line" />
          <span className="card-day-label" style={{ color: '#71717a', fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '8px', display: 'block' }}>
            {FAQ_ITEMS[activeFaqIndex].category}
          </span>
          <h3 className="faq-viewport-question">
            {FAQ_ITEMS[activeFaqIndex].question}
          </h3>
          <p className="faq-viewport-answer">
            {FAQ_ITEMS[activeFaqIndex].answer}
          </p>
          <div className="faq-viewport-bullets">
            {FAQ_ITEMS[activeFaqIndex].bullets.map((bullet, idx) => (
              <div key={idx} className="faq-bullet-item">
                <span className="faq-bullet-dot" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
