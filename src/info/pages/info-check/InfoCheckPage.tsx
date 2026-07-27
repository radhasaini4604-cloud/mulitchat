import { useEffect } from 'react';
import '../../components/layout.css';
import Navbar from '../../components/Navbar';
import LandingFooter from '../../components/Footer';
import './InfoCheckPage.css';

export default function InfoCheckPage() {
  useEffect(() => {
    document.title = 'Info Check | Nothric';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="infocheck-page">
      <Navbar />

      <main className="infocheck-content">
        <h1 className="infocheck-title">Check Critical Information</h1>
        <p className="infocheck-subtitle">Why you see this message</p>

        <div className="infocheck-body">
          <p>
            Nothric is designed to be helpful, but like any AI system, it can occasionally generate information that is incomplete, outdated, or incorrect. This reminder is shown to encourage you to verify important details before relying on them.
          </p>
          <p>
            For everyday conversations, this usually isn't necessary. However, when a response could affect your health, finances, legal matters, education, work, or personal safety, it's always a good idea to confirm the information using trusted sources.
          </p>

          <h2>What counts as critical information?</h2>
          <p>You should verify AI-generated information if it involves:</p>
          <ul>
            <li>Medical advice or health-related decisions</li>
            <li>Legal information or regulatory requirements</li>
            <li>Financial guidance, investments, taxes, or insurance</li>
            <li>Safety instructions or emergency situations</li>
            <li>Academic or research citations</li>
            <li>News and current events, which can change quickly</li>
            <li>Technical configurations where mistakes could cause data loss or security issues</li>
            <li>Important personal or business decisions</li>
          </ul>

          <h2>How to verify information</h2>
          <p>A few simple checks can make a big difference:</p>
          <ul>
            <li>Compare the information with official websites or trusted organizations.</li>
            <li>Cross-check important facts using more than one reliable source.</li>
            <li>Look at the publication date to ensure the information is current.</li>
            <li>When appropriate, consult a qualified professional.</li>
          </ul>

          <h2>Our approach</h2>
          <p>
            Nothric aims to provide accurate, balanced, and useful responses. It avoids presenting uncertain information as fact and may indicate when something is unclear or when multiple viewpoints exist.
          </p>
          <p>
            Even with these safeguards, no AI system is perfect. Human judgment remains important, especially when decisions have real-world consequences.
          </p>

          <h2>When you don't need to worry</h2>
          <p>
            For casual conversations, brainstorming, writing help, explanations, coding assistance, language learning, or creative ideas, this reminder is simply a general precaution. Most interactions don't require additional verification.
          </p>

          <h2>A simple rule to remember</h2>
          <p>
            If the information could significantly affect your health, money, legal rights, safety, or future decisions, take a moment to verify it with a trusted source before acting on it.
          </p>
          <p>
            That small step can help you make more confident and informed decisions.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
