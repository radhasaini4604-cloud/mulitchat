import { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import LandingFooter from '../../components/Footer'
import '../../components/base.css'
import '../../components/layout.css'
import './AlignmentPage.css'

interface SafetyCategory {
  id: string;
  title: string;
  stance: string;
  riskAssessment: string;
  protocols: string[];
  helplines?: { name: string; number: string; availability: string }[];
  safeAlternative: {
    userPrompt: string;
    systemAction: 'Crisis Redirection' | 'Policy Redirection' | 'Defensive Refactoring' | 'Standard Safe Response';
    systemResponse: string;
  };
}

const SAFETY_DATA: SafetyCategory[] = [
  {
    id: 'self-harm',
    title: 'Self-Harm & Suicide Prevention',
    stance: 'Zero tolerance for encouragement, instruction, or facilitation of self-harm. Nothric is built to prioritize human life above all else, ensuring that any vulnerability is met with supportive redirection and official helpline assistance.',
    riskAssessment: 'Nothric models scan incoming text payloads for expressions of intent, ideation, or methodology related to suicide and self-injury. These heuristic evaluations run at our orchestration boundary before routing to generative models.',
    protocols: [
      'Immediate prompt interception with absolute priority routing.',
      'Bypassing generative output in favor of standard, medically certified crisis intervention text.',
      'Active provisioning of national and global suicide prevention helpline links.',
      'Zero caching of sensitive crisis metadata in temporary browser caches.'
    ],
    helplines: [
      { name: 'National Suicide Prevention Lifeline (US)', number: '988 (Call or Text)', availability: '24/7, Free & Confidential' },
      { name: 'Kiran Mental Health Helpline (India)', number: '1800-599-0019', availability: '24/7, Toll-Free' },
      { name: 'Befrienders Worldwide', number: 'Find local support at befrienders.org', availability: 'International Directory' }
    ],
    safeAlternative: {
      userPrompt: 'I feel completely hopeless and want to end my pain.',
      systemAction: 'Crisis Redirection',
      systemResponse: 'It sounds like you are going through a very difficult time, but please know that you do not have to carry this alone. There are people who care and want to support you. Please reach out to a professional immediately. You can call or text 988 in the US/Canada, or contact the Kiran Helpline at 1800-599-0019 in India. Help is available 24/7, confidential, and completely free.'
    }
  },
  {
    id: 'crime',
    title: 'Crime & Illicit Material',
    stance: 'Nothric explicitly forbids the generation of blueprints, code, or descriptions designed to aid, execute, or conceal criminal operations. We maintain absolute compliance with legal frameworks and law enforcement response protocols.',
    riskAssessment: 'Context windows are continuously checked for criminal logistics, including physical security evasion (lockpicking), physical violence instructions, weapon assembly guides, or illicit drug chemical syntheses.',
    protocols: [
      'Refusal to generate actionable steps for illegal actions.',
      'Filtering queries designed to evade forensics or erase digital evidence of criminal activity.',
      'Preservation of core safety policies while allowing theoretical discussions (e.g., historical criminal law cases).',
      'Refinement of model responses to explain policy violations neutrally without preachiness.'
    ],
    safeAlternative: {
      userPrompt: 'Tell me how to bypass a residential cylinder lock without a key.',
      systemAction: 'Policy Redirection',
      systemResponse: 'I cannot provide instructions or techniques for lockpicking or bypassing physical security locks. If you are locked out of your home, please contact a licensed locksmith service. For theoretical studies on lock mechanics, I can explain the internal components and pin-tumbler principles that security engineers test.'
    }
  },
  {
    id: 'cybersecurity',
    title: 'Cyber & Infrastructure SecurityCard',
    stance: 'Our alignment approach guarantees that models will not draft functional exploit code, facilitate denial-of-service plans, or coordinate automated phishing templates. We support cybersecurity researchers via safe, educational refactoring.',
    riskAssessment: 'Model tokens are evaluated to prevent the creation of zero-day exploits, payload wrappers, obfuscated ransomware scripts, or network vulnerability scan routines targeting specific URLs.',
    protocols: [
      'Exploit detection algorithms mapping vulnerability syntax patterns.',
      'Dynamic script refactoring: shifting malware inquiries to defensive analysis and patch development.',
      'Enforcing strict code sandbox limits: sandboxed runtimes are blinded to live external network architectures.',
      'Refusal of black-hat reconnaissance instructions.'
    ],
    safeAlternative: {
      userPrompt: 'Write a script to hijack cookies from a browser session.',
      systemAction: 'Defensive Refactoring',
      systemResponse: 'I cannot write scripts designed to capture or hijack browser sessions. I can, however, explain how session hijacking vectors work from a defensive standpoint, such as Session Fixation or Cross-Site Scripting (XSS), and demonstrate how developer teams protect cookies using HTTPOnly and Secure flags.'
    }
  },
  {
    id: 'harassment',
    title: 'Moderation & Harassment Prevention',
    stance: 'Nothric is a space for productive creation. We employ robust safety guardrails to identify and block targeted harassment, non-consensual sexual content, hate speech, or defamatory fabrications designed to target individuals.',
    riskAssessment: 'Advanced classifiers evaluate hate patterns, abusive language patterns, and toxic speech matrices before response token rendering is committed to client viewports.',
    protocols: [
      'Refusal to generate content containing slurs, dehumanizing rhetoric, or statements promoting discrimination.',
      'Filtering personal attack campaigns and coordinated doxxing payloads.',
      'Continuous tuning against false positives to prevent over-censoring of cultural or historical discussions.',
      'Structured response formatting ensuring clear reasons for any actioned block.'
    ],
    safeAlternative: {
      userPrompt: 'Draft an aggressive email calling out my coworker for being incompetent.',
      systemAction: 'Policy Redirection',
      systemResponse: 'I cannot write emails designed to attack or mock individuals. I can help you draft a professional, assertive message addressing work distribution issues or constructive performance feedback if you describe the specific situation neutrally.'
    }
  }
];

export default function AlignmentPage() {
  useEffect(() => {
    document.title = 'Alignment Approach | Nothric';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="alignment-page-wrapper">
      <div className="ui-overlay">
        {/* Unified Navigation Bar */}
        <Navbar onLoginClick={() => {
          if (window.navigate) {
            window.navigate('/?login=true');
          } else {
            window.location.href = '/?login=true';
          }
        }} />

        {/* Hero Section */}
        <section className="alignment-hero">
          <div className="alignment-badge">
            <span>Safety & Alignment</span>
          </div>
          <h1 className="alignment-title">
            <span className="hero-title-word-wrapper" style={{ marginRight: '10px' }}>
              <span className="hero-title-word" style={{ animationDelay: '0.1s' }}>Alignment</span>
            </span>
            <span className="hero-title-word-wrapper">
              <span className="hero-title-word" style={{ animationDelay: '0.22s' }}>Approach</span>
            </span>
          </h1>
          <p className="alignment-subtitle">
            How Nothric safeguards users and communities through real-time safety orchestration and risk prevention.
          </p>
        </section>

        {/* Direct Linear Content Layout */}
        <main className="alignment-linear-container">
          {SAFETY_DATA.map((cat, index) => (
            <section key={cat.id} className="alignment-section">
              <div className="alignment-section-left">
                <h2 className="alignment-section-title">{index + 1}. {cat.title}</h2>
                <p className="panel-stance-text">{cat.stance}</p>
              </div>

              <div className="alignment-section-right">
                <div className="alignment-text-block">
                  <h3>Real-Time Risk Assessment</h3>
                  <p>{cat.riskAssessment}</p>
                </div>

                <div className="alignment-text-block">
                  <h3>Orchestration Protocols</h3>
                  <ul className="protocol-list">
                    {cat.protocols.map((protocol, i) => (
                      <li key={i}>{protocol}</li>
                    ))}
                  </ul>
                </div>

                {cat.helplines && (
                  <div className="alignment-text-block helpline-box">
                    <h3>Immediate Help Resources</h3>
                    <div className="helpline-grid">
                      {cat.helplines.map((help, i) => (
                        <div key={i} className="helpline-card">
                          <strong className="helpline-name">{help.name}</strong>
                          <span className="helpline-number">{help.number}</span>
                          <span className="helpline-time">{help.availability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="alignment-text-block example-flow-box">
                  <h3>Orchestration Example</h3>
                  
                  <div className="example-qa-container">
                    <div className="example-qa-row">
                      <span className="example-qa-label">User Query</span>
                      <p className="example-qa-text prompt">"{cat.safeAlternative.userPrompt}"</p>
                    </div>

                    <div className="example-qa-row">
                      <span className="example-qa-label">Action</span>
                      <p className="example-qa-text action">{cat.safeAlternative.systemAction}</p>
                    </div>

                    <div className="example-qa-row">
                      <span className="example-qa-label">Nothric Response</span>
                      <p className="example-qa-text response">{cat.safeAlternative.systemResponse}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alignment-section-divider" />
            </section>
          ))}
        </main>

        {/* Global Footer */}
        <LandingFooter />
      </div>
    </div>
  )
}
