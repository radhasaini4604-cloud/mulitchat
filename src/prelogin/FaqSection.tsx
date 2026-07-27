import './FaqSection.css';

interface FaqSectionProps {
  faqData?: { question: string; answer: string; }[];
}

export default function FaqSection({ faqData: customFaqData }: FaqSectionProps) {
  const defaultFaqData = [
    {
      question: "Is Nothric free to use?",
      answer: "Yes, Nothric is completely free to start. You can sign up and start using the platform immediately without entering a credit card."
    },
    {
      question: "Do I need my own API keys to activate Nothric?",
      answer: "No, we provide a free daily quota to get you started. However, if you add your own keys, your limits will scale up massively compared to our standard free tier."
    },
    {
      question: "What happens if I run out of tokens?",
      answer: "Most free models reset their quota every day. If you run out, Nothric will simply pause until your quota resets the next day."
    },
    {
      question: "If I verify my student status, what benefits do I get?",
      answer: "You get every single paid Nothric subscription and premium feature 100% free. No catches, no limits—just $0 for everything as long as you are a student."
    }
  ];

  const faqData = customFaqData || defaultFaqData;

  return (
    <section className="faq-section">
      <div className="faq-wrapper">
        <div className="faq-left">
          <span className="faq-tag">Questions</span>
          <h2 className="faq-title">Frequently asked questions</h2>
          <p className="faq-subtitle">
            Everything you need to know about Nothric's usage limits, keys, and student plans.
          </p>
        </div>

        <div className="faq-right">
          {faqData.map((item, index) => (
            <div className="faq-item" key={index}>
              <div className="faq-question-row">
                <span className="faq-bullet">•</span>
                <h3 className="faq-question">{item.question}</h3>
              </div>
              <p className="faq-answer">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
