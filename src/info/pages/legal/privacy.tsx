import { useEffect, useState } from 'react';
import '../../components/base.css';
import '../../components/layout.css';
import Navbar from '../../components/Navbar';
import LandingFooter from '../../components/Footer';

const SECTIONS = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: [
      { subtitle: "Account Information", text: "When you create a Nothric account, we collect your name, email address, and authentication credentials. If you sign in via Google or GitHub, we receive your profile information from those providers as permitted by their privacy policies." },
      { subtitle: "Usage Data & AI Interactions", text: "We collect data about how you interact with our platform, including prompts, queries, and model outputs. This data helps us deliver, improve, and personalize the service. We do not sell your conversation data to third parties." },
      { subtitle: "Device & Technical Data", text: "We automatically collect information about your browser, IP address, operating system, referral URLs, and session activity. This information is used for security, fraud prevention, and service optimization." },
      { subtitle: "Cookies & Tracking Technologies", text: "We use strictly necessary cookies for authentication and session management, and optional analytics cookies to understand usage patterns. You can manage cookie preferences at any time through your account settings." },
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: [
      { subtitle: "Providing the Service", text: "Your information is used to operate, maintain, and improve Nothric — including processing your AI requests, managing your account, and delivering customer support." },
      { subtitle: "AI Model Improvement", text: "We may use de-identified and aggregated interaction data to improve our models and service quality. We will never use your personally identifiable conversations to train models shared with other users without your explicit consent. You can opt out of model improvement usage in your privacy settings." },
      { subtitle: "Communications", text: "We may send you transactional emails (account activity, security alerts) and, with your consent, product updates and announcements. You can unsubscribe from marketing communications at any time." },
      { subtitle: "SecurityCard & Compliance", text: "We use your data to detect, investigate, and prevent fraudulent or unauthorized activity, and to comply with legal obligations." },
    ],
  },
  {
    id: "data-sharing",
    title: "Data Sharing & Disclosure",
    content: [
      { subtitle: "Service Providers", text: "We share data with trusted vendors who assist in operating our infrastructure, including cloud hosting, analytics, and customer support tools. These providers are contractually bound to protect your data and may only process it on our behalf." },
      { subtitle: "Legal Requirements", text: "We may disclose your information if required by law, court order, or governmental authority, or where we believe disclosure is necessary to protect our rights, your safety, or the safety of others." },
      { subtitle: "Business Transfers", text: "In the event of a merger, acquisition, or sale of assets, your data may be transferred to a successor entity. We will notify you before your data is transferred and becomes subject to a different privacy policy." },
      { subtitle: "No Sale of Personal Data", text: "We do not sell, rent, or trade your personal information to third parties for their marketing purposes." },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: [
      { subtitle: "Retention Periods", text: "We retain your account data for as long as your account is active. Conversation logs are retained for up to 90 days by default and can be deleted on request. Anonymized and aggregated usage analytics may be retained indefinitely." },
      { subtitle: "Account Deletion", text: "When you delete your account, we delete or anonymize your personal data within 30 days, except where retention is required by law or legitimate business interests (e.g., fraud prevention records)." },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights & Choices",
    content: [
      { subtitle: "Access & Portability", text: "You have the right to request a copy of the personal data we hold about you in a structured, machine-readable format." },
      { subtitle: "Correction & Deletion", text: "You can correct inaccurate information or request deletion of your personal data at any time through your account settings or by contacting privacy@endurance.ai." },
      { subtitle: "Opt-Out Rights", text: "California residents and EEA/UK residents have additional rights under CCPA and GDPR respectively, including the right to object to certain processing activities and to withdraw consent at any time." },
      { subtitle: "Do Not Track", text: "Our platform responds to browser Do Not Track signals by disabling optional analytics cookies. Essential cookies required for authentication remain active." },
    ],
  },
  {
    id: "security",
    title: "SecurityCard",
    content: [
      { subtitle: "Our Commitments", text: "We protect your data using industry-standard security measures including AES-256 encryption at rest, TLS 1.3 in transit, regular penetration testing, and SOC 2 Type II compliance. Access to user data is restricted to authorized personnel on a need-to-know basis." },
      { subtitle: "Breach Notification", text: "In the event of a data breach that poses a risk to your rights and freedoms, we will notify you and the relevant regulatory authority within 72 hours as required by applicable law." },
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: [
      { subtitle: "Age Restriction", text: "Nothric is not directed to children under the age of 13 (or 16 in the EEA/UK). We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately." },
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: [
      { subtitle: "Notification", text: "We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a prominent notice on our platform at least 30 days before the changes take effect. Continued use of Nothric after the effective date constitutes acceptance of the updated policy." },
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    content: [
      { subtitle: "Privacy Inquiries", text: "For questions, concerns, or requests related to this Privacy Policy, contact our Data Protection Officer at privacy@endurance.ai or write to: Nothric Team, Attn: Privacy Team, 100 Technology Square, San Francisco, CA 94107, United States." },
    ],
  },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    document.title = 'Privacy Policy | Nothric';
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
    <div
      className="privacy-terms-container"
      style={{
        backgroundColor: "#09090a",
        color: "#f4f4f5",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif"
      }}
    >
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
              Privacy Policy
            </h1>
            <p style={{ fontSize: "15px", color: "#a1a1aa", margin: 0, maxWidth: "620px", lineHeight: 1.7 }}>
              At Nothric, your privacy is foundational — not an afterthought. This policy explains what data we collect, why we collect it, and the controls you have over it.
            </p>
          </div>

          {SECTIONS.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="privacy-terms-section"
              style={{
                marginBottom: "40px",
                paddingBottom: "40px",
                borderBottom: i < SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none"
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
                  {i + 1}
                </span>
                {section.title}
              </h2>
              {section.content.map((block) => (
                <div key={block.subtitle} style={{ marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#f4f4f5", margin: "0 0 6px 0", letterSpacing: "0.01em" }}>{block.subtitle}</h3>
                  <p style={{ fontSize: "14px", color: "#a1a1aa", margin: 0, lineHeight: 1.72 }}>{block.text}</p>
                </div>
              ))}
            </section>
          ))}
        </main>
      </div>

      <LandingFooter />
    </div>
  );
}
