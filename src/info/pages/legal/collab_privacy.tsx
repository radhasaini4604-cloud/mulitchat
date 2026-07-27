import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import LandingFooter from '../../components/Footer';

const SECTIONS = [
  { id: "information-we-collect", title: "Information We Collect" },
  { id: "use-of-information", title: "How We Use Your Information" },
  { id: "room-visibility", title: "Room Conversations & Visibility" },
  { id: "ai-providers", title: "AI Model Providers" },
  { id: "data-sharing", title: "Data Sharing & Disclosure" },
  { id: "data-retention", title: "Data Retention" },
  { id: "data-security", title: "Data SecurityCard" },
  { id: "your-rights", title: "Your Rights & Choices" },
  { id: "cookies-tracking", title: "Cookies & Tracking" },
  { id: "children-privacy", title: "Children's Privacy" },
  { id: "changes-policy", title: "Changes to This Policy" },
  { id: "contact-us", title: "Contact Us" }
];

export default function Privacy() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    document.title = 'Collab Privacy Policy | Nothric';
  }, []);

  // IntersectionObserver to sync scroll position with sidebar highlights
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -75% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: "#09090a",
      color: "#f4f4f5",
      minHeight: "100vh",
    }}>
      <Navbar />

      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "120px 32px 80px 32px",
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: "64px",
        alignItems: "start",
        boxSizing: "border-box"
      }}>
        {/* Sidebar */}
        <nav className="privacy-terms-sidebar" style={{ position: "sticky", top: "80px" }}>
          <p style={{
            fontSize: "10.5px",
            fontWeight: "600",
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "12px",
            margin: "0 0 12px 0",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
              <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
              <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
            </svg>
            On this page
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: isActive ? "#ef4444" : "#71717a",
                      borderLeft: `2px solid ${isActive ? "#ef4444" : "transparent"}`,
                      textDecoration: "none",
                      lineHeight: "1.4",
                      padding: "4px 0 4px 12px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#ef4444";
                        e.currentTarget.style.borderLeftColor = "#ef4444";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#71717a";
                        e.currentTarget.style.borderLeftColor = "transparent";
                      }
                    }}
                  >
                    {s.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <main style={{ minWidth: 0 }}>
          <div className="privacy-terms-hero" style={{ marginBottom: "48px", paddingBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", padding: "4px 10px", marginBottom: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: "500", color: "#a1a1aa" }}>Last updated: July 17, 2026</span>
            </div>
            <h1 style={{ fontSize: "36px", fontWeight: "600", fontFamily: "'Source Serif 4', Georgia, serif", letterSpacing: "-0.02em", color: "#ffffff", margin: "0 0 14px 0", lineHeight: 1.2 }}>
              Collab Privacy Policy
            </h1>
            <p style={{ fontSize: "15px", color: "#a1a1aa", margin: 0, maxWidth: "620px", lineHeight: 1.7 }}>
              This Privacy Policy describes how Nothric collects, uses, stores, and shares your information when you use Nothric Collab.
            </p>
          </div>

          <Section id="information-we-collect" title="1. Information We Collect" index={1} total={SECTIONS.length}>
            <p>
              We collect information in two ways: information you provide directly, and information
              collected automatically as you use the service.
            </p>
            <p style={{ fontWeight: 650, color: "#f4f4f5" }}>Information you provide</p>
            <BulletList items={[
              "Account information — your name and email address when you register for a Nothric account.",
              "Room content — messages, prompts, and any other content you send within a Collab room.",
              "Room metadata — room names, creation timestamps, and participant lists.",
              "Communications — any messages you send to our support team.",
            ]} />
            <p style={{ fontWeight: 650, color: "#f4f4f5" }}>Information collected automatically</p>
            <BulletList items={[
              "Usage data — which features you use, how frequently you use them, and general interaction patterns.",
              "Device and browser information — browser type, operating system, and screen resolution.",
              "IP address and approximate location — used for security, fraud prevention, and regional compliance.",
              "Session data — timestamps of when you join or leave rooms, and session duration.",
            ]} />
          </Section>

          <Section id="use-of-information" title="2. How We Use Your Information" index={2} total={SECTIONS.length}>
            <p>
              We use the information we collect strictly to operate, maintain, and improve Nothric Collab.
              Specifically, we use your data to:
            </p>
            <BulletList items={[
              "Provide and deliver the Collab service, including creating rooms, storing conversation history, and enabling real-time collaboration.",
              "Authenticate your identity and keep your account secure.",
              "Process and route messages to the appropriate AI model providers on your behalf.",
              "Detect and prevent abuse, fraud, spam, and violations of our Terms of Service.",
              "Respond to your support requests, questions, and account appeals.",
              "Analyse aggregated, anonymised usage patterns to improve product features and performance.",
              "Send you important service-related notifications, such as changes to these terms or your account status.",
            ]} />
            <p>
              We do not sell your personal data. We do not use the content of your Collab conversations
              to train AI models without your explicit consent.
            </p>
          </Section>

          <Section id="room-visibility" title="3. Room Conversations and Visibility" index={3} total={SECTIONS.length}>
            <p>
              All messages sent within a Collab room are visible to every participant currently in
              that room, in real time. This is a core feature of the service. You should treat Collab
              rooms as shared spaces and avoid entering sensitive, confidential, or personally
              identifiable information that you would not want other participants to see.
            </p>
            <p>
              Room history is retained after a session ends and remains accessible to participants who
              were present during that session. Room creators may end a room, but the historical record
              of the conversation is preserved for all prior participants.
            </p>
            <p>
              Nothric staff do not routinely access the content of your conversations. We may review
              conversation content only in limited circumstances, such as investigating a reported
              violation of our Terms of Service or responding to a valid legal request.
            </p>
          </Section>

          <Section id="ai-providers" title="4. AI Model Providers" index={4} total={SECTIONS.length}>
            <p>
              Nothric Collab integrates with third-party AI model providers, including but not limited
              to OpenAI, Google, and Anthropic. When you send a prompt in a Collab room, that prompt
              is transmitted to the selected AI provider in order to generate a response.
            </p>
            <p>
              Each provider operates under its own privacy policy and data handling terms. We encourage
              you to review the policies of the relevant providers:
            </p>
            <BulletList items={[
              "OpenAI (GPT-4o, GPT-4) — openai.com/policies/privacy-policy",
              "Google (Gemini) — policies.google.com/privacy",
              "Anthropic (Claude) — anthropic.com/privacy",
            ]} />
            <p>
              Nothric does not control how these providers store or process data transmitted to their
              APIs. We select providers that maintain strong data protection practices and, where
              available, we use API configurations that opt out of training data use.
            </p>
          </Section>

          <Section id="data-sharing" title="5. Data Sharing and Disclosure" index={5} total={SECTIONS.length}>
            <p>
              We do not sell, rent, or trade your personal information to third parties for their own
              marketing or commercial purposes. We may share your information only in the following
              limited circumstances:
            </p>
            <BulletList items={[
              "With AI model providers — solely to process your prompts and return AI-generated responses, as described in Section 4.",
              "With service providers — trusted third parties who assist in operating our infrastructure (e.g., cloud hosting, analytics), who are contractually bound to handle data securely and only for the purposes we specify.",
              "For legal compliance — when required by law, court order, or a valid governmental request, or where we believe disclosure is necessary to protect the rights, safety, or property of Nothric or its users.",
              "In connection with a business transfer — if Nothric is acquired, merged, or undergoes a significant asset transfer, your information may be transferred as part of that transaction. You will be notified in advance of any such change.",
            ]} />
          </Section>

          <Section id="data-retention" title="6. Data Retention" index={6} total={SECTIONS.length}>
            <p>
              We retain your account information and room history for as long as your account remains
              active. If you delete your account, we will remove your personal information from our
              active systems within 30 days, subject to any retention obligations required by law.
            </p>
            <p>
              Aggregated and anonymised data — which cannot be used to identify you — may be retained
              indefinitely for analytical and product improvement purposes.
            </p>
            <p>
              Messages and content within Collab rooms are retained for the benefit of all room
              participants. If you wish to remove specific content you have sent, please contact us at{" "}
              <a href="mailto:privacy@nothric.app" style={{ color: "#ef4444", textDecoration: "underline", fontWeight: 500 }}>
                privacy@nothric.app
              </a>{" "}
              and we will assess your request on a case-by-case basis.
            </p>
          </Section>

          <Section id="data-security" title="7. Data SecurityCard" index={7} total={SECTIONS.length}>
            <p>
              We take the security of your data seriously. Nothric employs industry-standard safeguards
              to protect your information, including:
            </p>
            <BulletList items={[
              "Encryption in transit — all data transmitted between your browser and our servers is encrypted using TLS (Transport Layer SecurityCard).",
              "Encryption at rest — stored conversation data and account information is encrypted at the database level.",
              "Access controls — internal access to user data is restricted on a strict need-to-know basis, and all access is logged and audited.",
              "Regular security reviews — we conduct periodic security assessments to identify and remediate potential vulnerabilities.",
            ]} />
            <p>
              While we take every reasonable precaution, no system is entirely immune to risk. In the
              unlikely event of a data breach that affects your personal information, we will notify
              you promptly in accordance with applicable law.
            </p>
          </Section>

          <Section id="your-rights" title="8. Your Rights and Choices" index={8} total={SECTIONS.length}>
            <p>
              Depending on your location, you may have certain rights regarding your personal data.
              These may include the right to:
            </p>
            <BulletList items={[
              "Access — request a copy of the personal data we hold about you.",
              "Correction — request that inaccurate or incomplete information be corrected.",
              "Deletion — request that your personal data be deleted, subject to any legal retention obligations.",
              "Portability — request your data in a structured, machine-readable format.",
              "Objection — object to certain processing activities, such as analytical data use.",
              "Withdrawal of consent — where processing is based on your consent, you may withdraw it at any time without affecting the lawfulness of prior processing.",
            ]} />
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:privacy@nothric.app" style={{ color: "#ef4444", textDecoration: "underline", fontWeight: 500 }}>
                privacy@nothric.app
              </a>. We will respond to all valid requests within 30 days.
            </p>
          </Section>

          <Section id="cookies-tracking" title="9. Cookies and Tracking" index={9} total={SECTIONS.length}>
            <p>
              Nothric uses a limited set of cookies and similar technologies to operate the service effectively:
            </p>
            <BulletList items={[
              "Essential cookies — required for authentication, session management, and core platform functionality. These cannot be disabled without breaking the service.",
              "Analytics cookies — used to understand how users interact with the platform in aggregate. This data is anonymised and does not identify individual users.",
            ]} />
            <p>
              We do not use third-party advertising cookies or tracking pixels. You can manage cookie
              preferences in your browser settings at any time, though disabling essential cookies
              will prevent you from using Collab.
            </p>
          </Section>

          <Section id="children-privacy" title="10. Children's Privacy" index={10} total={SECTIONS.length}>
            <p>
              Nothric Collab is not intended for use by individuals under the age of 13. We do not
              knowingly collect personal information from children under 13. If we become aware that
              a child under 13 has provided us with personal data, we will take steps to delete that
              information promptly. If you believe a child has registered an account, please contact
              us at{" "}
              <a href="mailto:privacy@nothric.app" style={{ color: "#ef4444", textDecoration: "underline", fontWeight: 500 }}>
                privacy@nothric.app
              </a>.
            </p>
          </Section>

          <Section id="changes-policy" title="11. Changes to This Policy" index={11} total={SECTIONS.length}>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices,
              legal obligations, or the service itself. When we do, we will update the &ldquo;Last updated&rdquo;
              date at the top of this page. For material changes, we will notify you directly within
              the Nothric application or via the email address associated with your account.
            </p>
            <p>
              Continued use of Nothric Collab following any update constitutes your acceptance of the
              revised Privacy Policy.
            </p>
          </Section>

          <Section id="contact-us" title="12. Contact Us" index={12} total={SECTIONS.length}>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or the
              handling of your personal data, please reach out to our privacy team at{" "}
              <a href="mailto:privacy@nothric.app" style={{ color: "#ef4444", textDecoration: "underline", fontWeight: 500 }}>
                privacy@nothric.app
              </a>.
            </p>
            <p>
              We are committed to resolving all privacy-related enquiries promptly and transparently.
            </p>
          </Section>
        </main>
      </div>

      <LandingFooter />
    </div>
  );
}

function Section({ id, title, index, total, children }: { id: string; title: string; index: number; total: number; children: React.ReactNode }) {
  return (
    <section
      id={id}
      style={{
        marginBottom: "40px",
        paddingBottom: "40px",
        borderBottom: index < total ? "1px solid rgba(255,255,255,0.08)" : "none"
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.01em", color: "#ffffff", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px 0" }}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: "bold",
          color: "#ef4444",
          flexShrink: 0,
          width: "24px",
          height: "24px",
          borderRadius: "6px",
          background: "rgba(239, 68, 68, 0.12)"
        }}>
          {index}
        </span>
        {title}
      </h2>
      <div style={{ color: "#a1a1aa", fontSize: "14px", lineHeight: 1.72, display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "8px 0", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, lineHeight: 1.8 }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%", background: "#ef4444",
            flexShrink: 0, marginTop: 10,
          }} />
          <span style={{ color: "#a1a1aa", fontSize: "14px" }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
