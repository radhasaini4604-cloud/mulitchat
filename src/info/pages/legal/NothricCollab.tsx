

import { useEffect, useState } from "react";
import "./collab.css";
import LandingFooter from "../../components/Footer";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    const addScript = () => {
      const id = "google-translate-script";
      if (document.getElementById(id)) return;
      
      const script = document.createElement("script");
      script.id = id;
      script.type = "text/javascript";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: "en"
        }, "google_translate_element");
      }
    };

    addScript();
  }, []);

  return <div id="google_translate_element" style={{ display: "inline-block" }} />;
};

/* ── Professional SVG icons ── */
function IconLightbulb({ size = 18, color = "#111" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 1 0 14c-2 0-3-1-3-1" />
      <path d="M12 2a7 7 0 0 0 0 14" />
      <path d="M12 16v-3" />
      <path d="M8.5 12.5a4.5 4.5 0 1 1 7 0" />
    </svg>
  );
}

function IconLink({ size = 18, color = "#111" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function IconTyping({ size = 16, color = "#888" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function IconBrain({ size = 18, color = "#111" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0V8a3 3 0 0 0-3-3z" />
      <path d="M12 10v11" />
      <path d="M7 15a3 3 0 1 1 0-6" />
      <path d="M17 15a3 3 0 1 0 0-6" />
      <path d="M8 21h8" />
    </svg>
  );
}

/* Avatar bubble */
function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
    }}>
      {initials}
    </div>
  );
}

/* Chat message bubble */
function Message({
  sender,
  model,
  avatarColor,
  isUser,
  isBot,
  children,
}: {
  sender: string;
  model?: string;
  avatarColor: string;
  isUser?: boolean;
  isBot?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <Avatar initials={sender.charAt(0)} color={avatarColor} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 600, fontSize: 13.5, color: "#111" }}>{sender}</span>
          {model && (
            <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>→ {model}</span>
          )}
          {isBot && (
            <span style={{
              fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
              color: "#2563eb", background: "#eff6ff", borderRadius: 4, padding: "2px 6px",
            }}>
              AI
            </span>
          )}
        </div>
        <div style={{
          fontSize: 14, lineHeight: 1.65, color: "#333",
          background: isUser ? "#f5f5f5" : "#fff",
          border: isUser ? "1px solid #eee" : "1px solid #e5e5e5",
          borderRadius: 12, padding: "12px 16px",
          maxWidth: "100%",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const sections = [
  { id: "what-is", label: "What is Nothric Collab?" },
  { id: "how-it-works", label: "How It Works" },
  { id: "create-room", label: "Creating a Room" },
  { id: "invite", label: "Inviting Your Team" },
  { id: "inside-room", label: "Inside a Room" },
  { id: "ai-models", label: "AI Models" },
  { id: "real-time", label: "Real-Time Features" },
  { id: "history", label: "Chat History" },
  { id: "use-cases", label: "Use Cases" },
  { id: "faq", label: "FAQ" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

export default function NothricCollab() {
  const active = useActiveSection(sections.map((s) => s.id));

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      background: "#ffffff",
      color: "#111111",
      minHeight: "100vh",
    }}>
      {/* Top nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e5e5e5", padding: "0 40px",
        display: "flex", alignItems: "center", height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: "#111",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="5" cy="8" r="2.5" fill="white" />
              <circle cx="11" cy="8" r="2.5" fill="white" opacity="0.6" />
              <path d="M7.5 8 C7.5 6 9 5 10 6" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" }}>Nothric</span>
          <span style={{ fontSize: 13, color: "#666", marginLeft: 4, paddingLeft: 12, borderLeft: "1px solid #ddd" }}>
            Collab Documentation
          </span>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <GoogleTranslate />
        </div>
      </header>

      <div style={{ display: "flex", maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Sticky sidebar */}
        <aside style={{
          width: 240, flexShrink: 0, position: "sticky", top: 60,
          height: "calc(100vh - 60px)", overflowY: "auto",
          padding: "40px 0", borderRight: "1px solid #ebebeb",
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#999", marginBottom: 16, paddingLeft: 4,
          }}>
            On this page
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  textAlign: "left", padding: "6px 12px 6px 4px",
                  fontSize: 13.5,
                  fontWeight: active === s.id ? 600 : 400,
                  color: active === s.id ? "#111" : "#666",
                  borderLeft: active === s.id ? "2px solid #111" : "2px solid transparent",
                  transition: "all 0.15s ease", lineHeight: 1.4,
                }}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: "56px 0 100px 64px", maxWidth: 760 }}>

          {/* Hero */}
          <div style={{ marginBottom: 64 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#f4f4f4", borderRadius: 20, padding: "4px 12px", marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: "#444" }}>Now available in Nothric</span>
            </div>
            <h1 style={{
              fontSize: 44, fontWeight: 800, letterSpacing: "-1.2px",
              lineHeight: 1.1, margin: "0 0 20px", color: "#0a0a0a",
            }}>
              Nothric Collab
            </h1>
            <p style={{ fontSize: 18, color: "#555", lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
              The first platform where your entire team can prompt AI models together —
              in the same room, in real time. Think of it as your team&apos;s shared thinking
              space, powered by the world&apos;s best AI.
            </p>
          </div>

          <Divider />

          <Section id="what-is" title="What is Nothric Collab?">
            <p>
              Nothric Collab is a real-time collaborative AI chat experience built directly into Nothric.
              Unlike traditional AI tools where each person works in their own isolated session, Collab
              brings your entire team into a shared room where everyone sees the same conversation unfold
              — live, together.
            </p>
            <p>
              It&apos;s the difference between passing notes and having a real conversation. When one person
              sends a prompt and an AI responds, everyone in the room sees it instantly. Anyone can follow
              up, switch AI models, or build on what was just said — creating a genuinely collaborative
              intelligence workflow that no other platform offers.
            </p>
            <Callout icon={<IconLightbulb />}>
              Nothric Collab is the only AI platform where multiple people can actively participate in
              the same AI conversation simultaneously — not just view it, but contribute to it.
            </Callout>
          </Section>

          <Divider />

          <Section id="how-it-works" title="How It Works">
            <p>
              Collab rooms are shared AI workspaces. Each room has its own unique link that you can
              share with anyone on your team. Once everyone is in the room, you&apos;re all looking at the
              same conversation thread. Prompts sent by any participant appear for everyone, and AI
              responses are delivered to the whole room in real time.
            </p>
            <p>
              There&apos;s no setup, no configuration, and no technical knowledge required. You create a room
              in one click, share a link, and your team joins instantly — just like joining a video call.
            </p>
            <StepList steps={[
              { number: "01", title: "Create a Collab Room", desc: "Click the Collab icon in the sidebar and press \u201cStart a Room\u201d. Your room is created instantly with a unique shareable link." },
              { number: "02", title: "Share with your team", desc: "Copy the room link and send it via any channel — chat, email, or wherever your team communicates." },
              { number: "03", title: "Collaborate in real time", desc: "Everyone who joins sees the same live conversation. Any member can send prompts, switch AI models, or react to responses." },
              { number: "04", title: "Pick up where you left off", desc: "Every session is automatically saved. Come back anytime to review the full conversation history." },
            ]} />
          </Section>

          <Divider />

          <Section id="create-room" title="Creating a Room">
            <p>
              Creating a Collab room is a one-click action. Navigate to <Code>Collab</Code> in your
              Nothric sidebar — it lives alongside your other workspaces. You&apos;ll see a page showing any
              previous rooms you&apos;ve created, along with a prominent <strong>&quot;Start a Room&quot;</strong> button.
            </p>
            <p>
              When you start a new room, Nothric generates a unique room code and attaches it to a
              permanent link. That link is yours to share with anyone. You can optionally give your room
              a name to make it easier to find later.
            </p>
            <InfoGrid items={[
              { title: "Instant creation", desc: "Rooms are live the moment you create them. No waiting, no loading." },
              { title: "Unique link", desc: "Every room gets a permanent, shareable URL. One link, no expiry." },
              { title: "Optional naming", desc: "Give your room a name like \u201cProduct Brainstorm\u201d to find it easily later." },
              { title: "Full control", desc: "As the room creator, you control when the session ends." },
            ]} />
          </Section>

          <Divider />

          <Section id="invite" title="Inviting Your Team">
            <p>
              Once your room is created, a modal appears with your room link and a one-click{" "}
              <strong>Copy Link</strong> button. Paste the link anywhere — Slack, WhatsApp, email,
              Discord — and anyone who opens it can join.
            </p>
            <p>
              Team members who already have a Nothric account are dropped directly into the room. Those
              who don&apos;t yet have an account are guided through a quick sign-in, then automatically
              redirected into your room. No extra steps, no confusion.
            </p>
            <Callout icon={<IconLink />}>
              Think of Collab room links like Google Meet links — anyone with the link can join.
              The only requirement is a Nothric account, which takes under a minute to create.
            </Callout>
          </Section>

          <Divider />

          <Section id="inside-room" title="Inside a Room">
            <p>
              The Collab room interface is designed to feel familiar and immediate. The main area is a
              shared chat thread — clean, chronological, and live. Every message shows who sent it, which
              AI model responded, and the full exchange.
            </p>
            <p>
              On the side, a <strong>PeopleCard panel</strong> shows everyone currently in the room with
              their name, avatar, and live online status. When someone is composing a message, everyone
              else sees a typing indicator — <em>&quot;Alex is typing…&quot;</em> — so the room feels alive.
            </p>

            {/* Chat UI mockup */}
            <div style={{
              background: "#fff", border: "1px solid #e8e8e8", borderRadius: 14,
              overflow: "hidden", margin: "28px 0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}>
              {/* Top bar */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafafa",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar initials="A" color="#111" />
                  <Avatar initials="Y" color="#444" />
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 500, color: "#fff", background: "#111",
                    borderRadius: 6, padding: "5px 12px", letterSpacing: "0.02em",
                  }}>PeopleCard</span>
                  <span style={{
                    fontSize: 12, fontWeight: 500, color: "#555", background: "#f0f0f0",
                    borderRadius: 6, padding: "5px 12px",
                  }}>Leave</span>
                </div>
              </div>

              {/* Messages */}
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 18 }}>
                <Message sender="Alex" model="GPT-4o" avatarColor="#111" isUser>
                  Explain quantum computing in simple terms
                </Message>
                <Message sender="GPT-4o" avatarColor="#2563eb" isBot>
                  Think of it like a coin spinning — it&apos;s heads and tails at the same time until you look at it. That&apos;s the basic idea of superposition.
                </Message>
                <Message sender="You" model="Claude" avatarColor="#444" isUser>
                  Now explain it for a 5 year old
                </Message>
                <Message sender="Claude" avatarColor="#d97706" isBot>
                  Imagine you have a magic box that can be both open and closed until someone peeks inside. Quantum particles work like that magic box!
                </Message>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#999", fontSize: 13, fontStyle: "italic", paddingLeft: 4 }}>
                  <IconTyping size={14} />
                  <span>Alex is typing...</span>
                </div>
              </div>

              {/* Input bar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 20px", borderTop: "1px solid #f0f0f0", background: "#fafafa",
              }}>
                <div style={{
                  flex: 1, background: "#fff", border: "1px solid #e0e0e0", borderRadius: 10,
                  padding: "10px 14px", fontSize: 14, color: "#aaa",
                }}>
                  Type your prompt...
                </div>
                <button style={{
                  background: "#111", color: "#fff", border: "none", borderRadius: 10,
                  padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  Send
                </button>
              </div>
            </div>

            <InfoGrid items={[
              { title: "Shared thread", desc: "One continuous conversation that every participant sees and contributes to." },
              { title: "PeopleCard panel", desc: "See who's in the room with live online status and avatars." },
              { title: "Typing indicators", desc: "Real-time \u201cAlex is typing\u2026\u201d signals so the room feels alive." },
              { title: "Reactions", desc: "Respond to AI outputs with quick upvote / downvote reactions." },
            ]} />
          </Section>

          <Divider />

          <Section id="ai-models" title="AI Models">
            <p>
              Nothric Collab gives every participant the freedom to choose which AI model handles their
              prompt. You&apos;re not locked into one model per room — different team members can send prompts
              to different models within the same conversation.
            </p>
            <p>
              This is especially powerful when comparing how different AI models approach the same
              problem, or when different team members have preferences for different models based on
              the task at hand.
            </p>
            <Callout icon={<IconBrain />}>
              Every message in the thread is labeled with the AI model that responded, so you always
              know which model produced which output. Compare responses side by side, in context, as a team.
            </Callout>
          </Section>

          <Divider />

          <Section id="real-time" title="Real-Time Features">
            <p>
              Everything in Nothric Collab happens live. There are no page refreshes, no &quot;reload to see
              new messages&quot;, and no delay. The moment anyone in the room sends a message or receives an
              AI response, it appears instantly for every participant.
            </p>
            <FeatureList items={[
              { title: "Live message delivery", desc: "Prompts and AI responses appear in real time for every participant the moment they're generated." },
              { title: "Typing indicators", desc: "See exactly who is composing a message before they send it, keeping the conversation flow natural." },
              { title: "Presence awareness", desc: "The PeopleCard panel shows who's actively in the room at any given moment, with live online status." },
              { title: "Room state sync", desc: "If the room creator ends the session, every participant is notified immediately." },
            ]} />
          </Section>

          <Divider />

          <Section id="history" title="Chat History">
            <p>
              Every Collab session is automatically saved. When a room ends or you choose to leave, the
              entire conversation — every prompt, every AI response, from every participant — is preserved
              and accessible.
            </p>
            <p>
              You&apos;ll find your past rooms listed on the Collab page in the sidebar. Open any room to
              review its full history. This makes Collab rooms useful not just as live workspaces, but as
              a permanent record of your team&apos;s AI-powered thinking sessions.
            </p>
            <InfoGrid items={[
              { title: "Auto-saved", desc: "Everything is saved automatically. You never need to export or copy anything manually." },
              { title: "Full context", desc: "The complete conversation is preserved — who said what, which model responded, and in what order." },
              { title: "Always accessible", desc: "Anyone who was in the room can revisit the history at any time, even months later." },
              { title: "Past rooms list", desc: "Find all your previous rooms neatly listed on the Collab landing page." },
            ]} />
          </Section>

          <Divider />

          <Section id="use-cases" title="Use Cases">
            <p>Nothric Collab changes how teams interact with AI. Here are some of the most powerful ways teams are using it:</p>
            <UseCaseList items={[
              { title: "Team brainstorming", desc: "Bring your whole team into a single AI session to explore ideas together. Anyone can build on what the AI says — no more copying prompts between chat windows.", tag: "Most popular" },
              { title: "Code review & debugging", desc: "Engineering teams can share a Collab room to walk through a problem with AI together, seeing each other's questions and the AI's answers in real time.", tag: "Engineering" },
              { title: "Content creation", desc: "Writers, marketers, and editors can collaborate on drafts, iterate on copy, and compare responses from multiple AI models in the same session.", tag: "Creative" },
              { title: "Research & analysis", desc: "Researchers and analysts can share a room to jointly query AI about a topic, building a shared knowledge base from the conversation.", tag: "Research" },
              { title: "Teaching & learning", desc: "Instructors can create rooms where students explore topics with AI together, making the learning process visible and shared.", tag: "Education" },
              { title: "Client workshops", desc: "Agencies and consultants can invite clients into a Collab room to co-create with AI in real time — making the process transparent and engaging.", tag: "Client work" },
            ]} />
          </Section>

          <Divider />

          <Section id="faq" title="FAQ">
            <FAQList items={[
              { q: "How many people can join a single Collab room?", a: "Collab rooms support multiple simultaneous participants. Your entire team can be in the same room at once, with full real-time sync for everyone." },
              { q: "Does everyone need a Nothric account to join?", a: "Yes, a Nothric account is required to enter a room. If someone opens a room link without being signed in, they'll be prompted to create an account or log in first — then automatically redirected into the room." },
              { q: "Can I use different AI models within the same room?", a: "Absolutely. Each message can be sent to a different AI model. Different team members can use different models in the same conversation. Every response is labeled with the model that generated it." },
              { q: "What happens when I leave a room?", a: "Leaving a room removes you from the active session. The conversation continues for any remaining participants. You can always return later to view the full history." },
              { q: "Can I end a room for everyone?", a: "Yes — the person who created the room can end it for all participants at any time. Everyone in the room will be notified immediately. The conversation history is preserved after the room ends." },
              { q: "Is the conversation history private?", a: "Room history is only accessible to people who were participants in that room. It's not shared publicly or accessible to people who weren't part of the session." },
              { q: "Can I revisit old rooms?", a: "Yes. Your Collab page lists all your past rooms. Click on any room to view the complete conversation history from that session." },
              { q: "Is Nothric Collab available on all plans?", a: "Nothric Collab is available to Nothric users. Check the Nothric pricing page for plan-specific details on room limits and features." },
            ]} />
          </Section>

          {/* Footer CTA */}
          <div style={{
            marginTop: 80, padding: "40px", background: "#f7f7f7",
            borderRadius: 16, textAlign: "center",
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.5px" }}>
              Ready to try Nothric Collab?
            </h2>
            <p style={{ color: "#555", marginBottom: 24, fontSize: 15 }}>
              Open Nothric, click <strong>Collab</strong> in the sidebar, and start your first room in seconds.
            </p>
            <button style={{
              background: "#111", color: "#fff", border: "none", borderRadius: 10,
              padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer",
              letterSpacing: "-0.2px",
            }}>
              Start a Collab Room →
            </button>
          </div>

          {/* Footer links */}
        </main>
      </div>

      <LandingFooter />
    </div>
  );
}

/* ── Sub-components ── */

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ scrollMarginTop: 80, marginBottom: 56 }}>
      <h2 style={{ fontSize: 26, fontWeight: 750, letterSpacing: "-0.5px", marginBottom: 20, color: "#0a0a0a" }}>
        {title}
      </h2>
      <div style={{ color: "#3a3a3a", fontSize: 15.5, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 16 }}>
        {children}
      </div>
    </section>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid #ebebeb", margin: "0 0 56px" }} />;
}

function Callout({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", gap: 14, background: "#f7f7f7", border: "1px solid #e8e8e8",
      borderRadius: 10, padding: "16px 20px", fontSize: 14.5, lineHeight: 1.7,
      color: "#333", margin: "8px 0", alignItems: "flex-start",
    }}>
      <span style={{ flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      background: "#f0f0f0", border: "1px solid #e0e0e0", borderRadius: 5,
      padding: "1px 6px", fontSize: 13,
      fontFamily: '"SF Mono", "Fira Code", monospace', color: "#1a1a1a",
    }}>
      {children}
    </code>
  );
}

function StepList({ steps }: { steps: { number: string; title: string; desc: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "8px 0" }}>
      {steps.map((step, i) => (
        <div key={step.number} style={{ display: "flex", gap: 20, paddingBottom: i < steps.length - 1 ? 28 : 0, position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#111", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {step.number}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 1, flex: 1, background: "#ddd", marginTop: 8, minHeight: 24 }} />
            )}
          </div>
          <div style={{ paddingTop: 6 }}>
            <p style={{ fontWeight: 600, margin: "0 0 6px", color: "#111", fontSize: 15 }}>{step.title}</p>
            <p style={{ margin: 0, color: "#555", fontSize: 14.5, lineHeight: 1.7 }}>{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoGrid({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "8px 0" }}>
      {items.map((item) => (
        <div key={item.title} style={{
          padding: "18px 20px", border: "1px solid #e8e8e8",
          borderRadius: 10, background: "#fafafa",
        }}>
          <p style={{ fontWeight: 600, margin: "0 0 6px", fontSize: 14, color: "#111" }}>{item.title}</p>
          <p style={{ margin: 0, fontSize: 13.5, color: "#666", lineHeight: 1.65 }}>{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function FeatureList({ items }: { items: { title: string; desc: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, margin: "8px 0" }}>
      {items.map((item) => (
        <div key={item.title} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#111", flexShrink: 0, marginTop: 7 }} />
          <div>
            <p style={{ fontWeight: 600, margin: "0 0 4px", fontSize: 15, color: "#111" }}>{item.title}</p>
            <p style={{ margin: 0, color: "#555", fontSize: 14.5, lineHeight: 1.7 }}>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function UseCaseList({ items }: { items: { title: string; desc: string; tag: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "8px 0" }}>
      {items.map((item) => (
        <div key={item.title} style={{
          padding: "20px 22px", border: "1px solid #e8e8e8", borderRadius: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <p style={{ fontWeight: 650, margin: 0, fontSize: 15, color: "#111" }}>{item.title}</p>
            <span style={{
              fontSize: 11, fontWeight: 600, background: "#111", color: "#fff",
              borderRadius: 20, padding: "2px 9px", letterSpacing: "0.02em",
            }}>
              {item.tag}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.7 }}>{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function FAQList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, margin: "8px 0" }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderTop: i === 0 ? "1px solid #e8e8e8" : "none", borderBottom: "1px solid #e8e8e8" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              background: "none", border: "none", cursor: "pointer", width: "100%",
              textAlign: "left", padding: "18px 0",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 15, color: "#111", lineHeight: 1.4 }}>{item.q}</span>
            <span style={{
              fontSize: 20, color: "#888", flexShrink: 0,
              transform: open === i ? "rotate(45deg)" : "none",
              transition: "transform 0.2s ease", display: "inline-block",
            }}>+</span>
          </button>
          {open === i && (
            <p style={{ margin: "0 0 18px", fontSize: 14.5, color: "#555", lineHeight: 1.75 }}>{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
