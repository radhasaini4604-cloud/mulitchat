import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import LandingFooter from '../../components/Footer';
import './EntropyPage.css';
import '../../components/layout.css';
import entropyFlowImg from './entropy_flow.png';
import IntelligenceChart from './IntelligenceChart';
import AccuracyChart from './AccuracyChart';
import EvaluationTables from './EvaluationTables';
import ComparisonSection from './ComparisonSection';
import summaryAudio from './summary.mp3';

export default function EntropyPage() {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => new Audio(summaryAudio));
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(77); // Default to 77s (1:17)
  const [isDragging, setIsDragging] = useState(false);
  const [trackWidth, setTrackWidth] = useState(1000);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Entropy | Nothric';
  }, []);

  const formatTime = (timeInSeconds: number) => {
    const totalSecs = Math.max(0, Math.floor(timeInSeconds));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMouseMoveTrack = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    setHoverTime(percentage * duration);
    setHoverX(clickX);
  };

  const handleMouseLeaveTrack = () => {
    setHoverTime(null);
  };

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audio]);

  useEffect(() => {
    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => {
      if (audio.duration) {
        setDuration(audio.duration);
      }
    };
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, [audio, isDragging]);

  useEffect(() => {
    if (!trackRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setTrackWidth(entry.contentRect.width);
      }
    });
    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDrag = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    setCurrentTime(percentage * duration);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleDrag(e.clientX);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragging(false);
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = clickX / rect.width;
        audio.currentTime = percentage * duration;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration, audio]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDrag(e.clientX);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.log("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const sections = document.querySelectorAll('.content-body section');
    const scrollContainer = document.querySelector('.entropy-page');
    if (!scrollContainer) return;

    const observerOptions = {
      root: scrollContainer,
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleCopy = () => {
    const textToCopy = `Welcome to this audio overview of Entropy 3.5, released on May 7, 2026. 

Entropy 3.5 represents our most advanced reasoning model to date. Built on Google Gemini's foundational intelligence, it is designed to act as a thoughtful partner for complex development and analytical work. 

Unlike previous models like Vector 4.2, which focused purely on raw speed, Entropy 3.5 introduces deep conversational understanding and a suite of direct capabilities right in your chat. This includes native PDF reading, voice message transcription, real-time web search powered by Tavily, and visual scanning for documents and layouts. It also features direct image generation integrated via Cloudflare Workers AI.

In standard evaluations, Entropy 3.5 outperforms Vector across abstract logic, academic benchmarks, complex coding pipelines, and strict tool compliance. Leading teams at WPP, Rivian, Box, and Databricks are already using it to draft reports, debug software, and review legal files. They highlight its ability to challenge incorrect assumptions, ask clarifying questions, and honestly admit when it lacks enough information.

While it is a massive step forward, we want to be transparent about its limitations. As an early-stage model, it can sometimes trigger image generation when not requested, can occasionally hallucinate plausible-sounding errors, and experience rendering overhead during extremely large chats.

Thank you for listening, and we invite you to experience the reasoning power of Entropy 3.5 today.`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="entropy-page">
      {/* Header / Navbar */}
      <Navbar />

      <main className="entropy-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-meta">
            <span className="hero-date">May 7, 2026</span>
            <span className="hero-category">Product</span>
          </div>

          <h1 className="hero-title">Introducing Entropy 3.5</h1>

          <div className="hero-actions">
            <button className="hero-primary-btn" onClick={() => { window.open('https://nothric.online', '_blank'); }}>
              Try Entropy 3.5
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="try-arrow-icon"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
            </button>
            <a href="#work" className="hero-secondary-link">
              Try Entropy for Work
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="chevron-right-icon"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </div>
        </section>

        {/* Separator / Media controls bar */}
        <div className="media-bar" style={{ position: 'relative' }}>
          {/* Custom Interactive Progress Border */}
          <div
            ref={trackRef}
            className="media-progress-track"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '16px',
              cursor: 'pointer',
              zIndex: 10
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMoveTrack}
            onMouseLeave={handleMouseLeaveTrack}
          >
            {/* Background Grey Border */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '16px',
              borderTop: '1px solid #e5e5e5',
              borderLeft: '1px solid #e5e5e5',
              borderRight: '1px solid #e5e5e5',
              borderRadius: '16px 16px 0 0',
              pointerEvents: 'none'
            }} />

            {/* Foreground Black Border Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '16px',
              width: `${(currentTime / duration) * 100}%`,
              overflow: 'hidden',
              pointerEvents: 'none'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${trackWidth}px`,
                height: '16px',
                borderTop: '1px solid #000000',
                borderLeft: '1px solid #000000',
                borderRight: '1px solid #000000',
                borderRadius: '16px 16px 0 0'
              }} />
            </div>

            {/* Hover Tooltip showing time */}
            {hoverTime !== null && (
              <div style={{
                position: 'absolute',
                top: '-32px',
                left: `${hoverX}px`,
                transform: 'translateX(-50%)',
                background: '#1d1d1f',
                color: '#ffffff',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 100
              }}>
                {formatTime(hoverTime)}
              </div>
            )}
          </div>

          <div className="media-bar-container">
            <div className="media-left">
              <button className="media-play-btn" onClick={togglePlay}>
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="play-icon"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="play-icon"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                )}
                <span className="media-play-text">{isPlaying ? 'Pause article' : 'Listen to article'}</span>
                <span className="media-duration">{formatTime(duration - currentTime)}</span>
              </button>
            </div>
            <div className="media-right">
              <button className="media-share-btn" onClick={handleCopy}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="share-icon"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <span>{copied ? 'Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <section className="content-section">
          <div className="content-container">
            <div className="content-sidebar">
              <h2 className="sidebar-title">TABLE OF CONTENTS</h2>
              <ul className="sidebar-menu">
                <li className={activeSection === 'intro' ? 'active' : ''}><a href="#intro">Intro</a></li>
                <li className={activeSection === 'overview' ? 'active' : ''}><a href="#overview">Overview</a></li>
                <li className={activeSection === 'capabilities' ? 'active' : ''}><a href="#capabilities">Capabilities</a></li>
                <li className={activeSection === 'performance' ? 'active' : ''}><a href="#performance">Performance</a></li>
                <li className={activeSection === 'comparison' ? 'active' : ''}><a href="#comparison">Entropy vs Gemini</a></li>
                <li className={activeSection === 'evaluations' ? 'active' : ''}><a href="#evaluations">Evaluations</a></li>
                <li className={activeSection === 'limitations' ? 'active' : ''}><a href="#limitations">Limitations</a></li>
                <li className={activeSection === 'collaboration' ? 'active' : ''}><a href="#collaboration">Collaboration</a></li>
              </ul>
            </div>

            <div className="content-body">
              <section id="intro">
                <p>
                  We've launched Entropy 3.5, our most sophisticated generative model engineered specifically for advanced computation, coding, and logical reasoning. Built on Nothric's next-generation architectures, the model sets new thresholds in multi-turn instruction processing and context management.
                </p>
                <p>
                  Entropy 3.5 integrates natively with Nothric platforms to facilitate seamless workflows across enterprise development, academic research, and complex data modeling.
                </p>
              </section>

              <section id="overview">
                <h3 className="body-section-title">Overview</h3>
                <p>
                  Entropy 3.5 represents a major milestone in high-speed, cost-effective artificial intelligence, built directly on top of the advanced <a href="https://deepmind.google/models/gemini/flash/" target="_blank" rel="noopener noreferrer" className="body-link">Gemini 3.5 Flash by Google DeepMind</a> architecture. By merging this rapid, low-latency framework with Nothric’s specialized instruction tuning, we have delivered a model that responds almost instantaneously while seamlessly handling complex reasoning challenges.
                </p>
                <p>
                  This model is engineered specifically to power high-throughput, day-to-day productivity workflows—from drafting structured, creative content to debugging software systems in real time. Rather than relying on heavier, slower reasoning engines, Entropy 3.5 provides the ultimate balance of speed and analytical performance.
                </p>
                <p>
                  Deeply integrated into the Nothric workspace, advanced conversational and programmatic assistance is now available to everyone. This ensures that precise, actionable guidance is always at your fingertips, whether you are engineering a new application or compiling executive reports.
                </p>
              </section>

              <section id="capabilities">
                <h3 className="body-section-title">Capabilities</h3>
                <p>
                  With advanced logic and contextual reasoning, Entropy 3.5 is trained to handle complex tasks. The model excels at automating multi-turn instructions and analyzing huge files. Here are its core strengths:
                </p>

                <h4 className="body-subsection-title">Key Highlights</h4>
                <ul className="body-bullet-list">
                  <li>
                    <strong>Instant Answers:</strong> Experience ultra-low-latency responses that provide immediate code explanations, drafts, and formatted tables. This allows developers and writers to maintain momentum without waiting for slow processing queues.
                  </li>
                  <li>
                    <strong>Large Context Window:</strong> Upload long source code folders, multiple database logs, or extensive PDF reports all at once. The system tracks context and identifies connections across 128,000 tokens without any loss of accuracy.
                  </li>
                  <li>
                    <strong>Agentic Capabilities:</strong> It acts as an autonomous worker, breaking down large objectives to plan, execute, and complete multi-step tasks without human intervention. It launches specialized sub-agents to solve complex, parallel sub-tasks on its own.
                  </li>
                  <li>
                    <strong>Nothric Integration:</strong> Built directly into the Nothric workspace, the model has instant access to your ongoing projects and settings. This native integration ensures the model is always active and ready to help right where you work.
                  </li>
                </ul>

                <p>
                  By combining speed, context, and agentic autonomy, Entropy 3.5 stands out as the ultimate companion for modern developers, researchers, and creators looking to scale their daily workflows.
                </p>

                <div className="diagram-container">
                  <img src={entropyFlowImg} alt="Entropy 3.5 System Execution Flow" className="system-diagram" />
                </div>
              </section>

              <section id="performance">
                <h3 className="body-section-title">Performance</h3>
                <p>
                  Entropy 3.5 sets new milestones on popular industry benchmarks, demonstrating a substantial performance leap over previous generations. By utilizing optimized attention caching, the model maintains high accuracy and speed even under maximum context load.
                </p>

                <div className="performance-container">
                  {/* Row 1: Intelligence Index Chart */}
                  <IntelligenceChart />

                  {/* Row 2: Accuracy Chart */}
                  <AccuracyChart />
                </div>
              </section>

              <section id="comparison">
                <ComparisonSection />
              </section>

              <section id="evaluations" style={{ marginTop: '80px', paddingTop: '20px' }}>
                <h3 className="body-section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Evaluations</h3>
                <EvaluationTables />
              </section>

              <section id="limitations" style={{ marginTop: '80px', paddingTop: '20px' }}>
                <h3 className="body-section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Limitations</h3>
                <p className="limitations-intro" style={{ fontSize: '1.05rem', fontWeight: 300, lineHeight: 1.6, color: '#1d1d1f', marginBottom: '36px' }}>
                  While Entropy 3.5 is our most advanced release to date, we believe in sharing our research and development boundaries transparently. Here are the core technical constraints and challenges we are currently working to solve:
                </p>

                <div className="limitations-list" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div className="limitation-block">
                    <h4 className="body-subsection-title" style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 600, color: '#1d1d1f' }}>1. Ongoing Development & Capabilities</h4>
                    <p className="limitations-text" style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, color: '#515154', margin: '0' }}>
                      We are still actively in the development phase. Because of this, certain integrated features—such as native image generation—are not yet fully available in this version.
                    </p>
                  </div>

                  <div className="limitation-block">
                    <h4 className="body-subsection-title" style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 600, color: '#1d1d1f' }}>2. Large Conversations</h4>
                    <p className="limitations-text" style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, color: '#515154', margin: '0' }}>
                      Extremely large chats containing massive logs or heavy codebase contexts can sometimes lead to performance overhead or rendering lag within the workspace interface.
                    </p>
                  </div>

                  <div className="limitation-block">
                    <h4 className="body-subsection-title" style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 600, color: '#1d1d1f' }}>3. Hallucinations & Plausible Factual Errors</h4>
                    <p className="limitations-text" style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, color: '#515154', margin: '0 0 12px 0' }}>
                      Entropy sometimes writes plausible-sounding but incorrect or nonsensical answers. Fixing this issue is challenging because:
                    </p>
                    <ul className="body-bullet-list" style={{ paddingLeft: '20px', margin: '0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <li style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, color: '#515154' }}>
                        <strong>No Source of Truth:</strong> During Reinforcement Learning (RL) training, there is currently no objective source of truth to check reasoning paths.
                      </li>
                      <li style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, color: '#515154' }}>
                        <strong>Excessive Caution:</strong> Training the model to be more cautious often causes it to decline questions that it actually has the knowledge to answer correctly.
                      </li>
                      <li style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, color: '#515154' }}>
                        <strong>Supervised Training Misalignment:</strong> Supervised training can mislead the model because the ideal answer depends on <a href="https://www.alignmentforum.org/posts/BgoKdAzogxmgkuuAt/behavior-cloning-is-miscalibrated" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#1d1d1f', fontWeight: 500 }}>what the model knows</a>, rather than what the human demonstrator knows.
                      </li>
                    </ul>
                  </div>

                  <div className="limitation-block">
                    <h4 className="body-subsection-title" style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 600, color: '#1d1d1f' }}>4. Intent Guessing vs. Clarification</h4>
                    <p className="limitations-text" style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, color: '#515154', margin: '0' }}>
                      Ideally, the model would ask clarifying questions when a user provides an ambiguous query. Instead, our current models usually guess what the user intended, which can occasionally lead to misaligned outputs.
                    </p>
                  </div>

                  <div className="limitation-block">
                    <h4 className="body-subsection-title" style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 600, color: '#1d1d1f' }}>5. Terminal Tool Side-Effects</h4>
                    <p className="limitations-text" style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, color: '#515154', margin: '0' }}>
                      When given access to execute terminal shell commands, the model can automate script runs, package installations, and builds. However, it cannot always foresee the side-effects that a shell command might have on your system environment or configuration. Always review shell operations before letting an agent perform modifying terminal runs.
                    </p>
                  </div>

                  <div className="limitation-block">
                    <h4 className="body-subsection-title" style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 600, color: '#1d1d1f' }}>6. Unprompted Image Generation</h4>
                    <p className="limitations-text" style={{ fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.5, color: '#515154', margin: '0' }}>
                      Sometimes, the model might trigger image generation when it isn't actually needed or requested. This happens because the model's image generation trigger relies on keyword instructions in the system prompt rather than being natively trained end-to-end (like ChatGPT or Gemini). We are actively fine-tuning this trigger boundary to prevent unnecessary image generation cycles.
                    </p>
                  </div>
                </div>
              </section>

              <section id="collaboration" style={{ marginTop: '80px', paddingTop: '20px', borderTop: '1px solid #e5e5e7' }}>
                <h3 className="body-section-title" style={{ textAlign: 'center', marginBottom: '8px' }}>Partners & Collaboration</h3>
                <p className="chart-subtitle-clean" style={{ textAlign: 'center', marginBottom: '48px', color: '#86868b' }}>The technologies and teams behind the creation of Entropy 3.5</p>

                <div className="partners-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px 32px' }}>

                  {/* Google Gemini */}
                  <div className="partner-block" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg fill="#1d1d1f" fillRule="evenodd" height="18" width="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" /></svg>
                      Google Gemini
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#515154', lineHeight: 1.5, fontWeight: 300 }}>
                      Acts as the core foundational brain of Entropy 3.5, providing the robust context reasoning and multi-turn capabilities.
                    </p>
                  </div>

                  {/* Tavily */}
                  <div className="partner-block" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 5H3" /><path d="M10 12H3" /><path d="M10 19H3" /><circle cx="17" cy="15" r="3" /><path d="m21 19-1.9-1.9" /></svg>
                      Tavily AI
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#515154', lineHeight: 1.5, fontWeight: 300 }}>
                      Powers our real-time search capabilities, allowing the model to pull live web documentation and verify facts in active chat loops.
                    </p>
                  </div>

                  {/* Groq & Gemini Vision */}
                  <div className="partner-block" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7v10" /><path d="M6 5v14" /><rect width="12" height="18" x="10" y="3" rx="2" /></svg>
                      Groq & Gemini Vision
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#515154', lineHeight: 1.5, fontWeight: 300 }}>
                      Gives the model its in-chat image scanning and object detection power, executing rapid image OCR pipelines natively.
                    </p>
                  </div>

                  {/* Cloudflare */}
                  <div className="partner-block" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
                      Cloudflare Workers AI
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#515154', lineHeight: 1.5, fontWeight: 300 }}>
                      Powers direct Flux image generation in the chat, alongside automated voice parsing models to transcribe audio inputs.
                    </p>
                  </div>

                  {/* Nvidia */}
                  <div className="partner-block" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" /></svg>
                      Nvidia Compute
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#515154', lineHeight: 1.5, fontWeight: 300 }}>
                      Provides the supercharged GPU cluster infrastructure to run extensive instruction training, scaling capabilities to the top level.
                    </p>
                  </div>

                  {/* Nothric Team */}
                  <div className="partner-block" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: '#1d1d1f', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d1d1f" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                      Nothric Team
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#515154', lineHeight: 1.5, fontWeight: 300 }}>
                      Responsible for designing, orchestrating, and building the fine-tuning logic, system prompts, and custom workspace integrations.
                    </p>
                  </div>

                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      {/* Standard Unified Footer */}
      <style>{`
        .testimonials-section { background: #000; padding: 60px 40px 70px; width: 100%; box-sizing: border-box; }
        .testimonials-tabs { display: flex; justify-content: center; gap: 4px; flex-wrap: wrap; margin-bottom: 52px; }
        .testimonials-tab-btn { background: none; border: none; color: #666; font-size: 0.85rem; padding: 8px 16px; cursor: pointer; border-radius: 20px; transition: color 0.2s, background 0.2s; white-space: nowrap; font-family: inherit; letter-spacing: 0.01em; }
        .testimonials-tab-btn.active { background: #fff; color: #000; font-weight: 600; }
        .testimonials-tab-btn:not(.active):hover { color: #ccc; }
        .testimonials-quote { font-size: clamp(1.2rem, 2.2vw, 1.75rem); font-weight: 400; color: #fff; line-height: 1.55; text-align: center; max-width: 820px; margin: 0 auto 32px; font-style: normal; letter-spacing: -0.01em; }
        .testimonials-attribution { text-align: center; color: #888; font-size: 0.9rem; font-weight: 300; }
        @keyframes quoteFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .testimonials-body { animation: quoteFade 0.35s ease; }
      `}</style>

      <div className="testimonials-section">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Company Tabs */}
          <div className="testimonials-tabs">
            {[
              { id: 0, label: 'WPP' },
              { id: 1, label: 'Rivian' },
              { id: 2, label: 'Kogan.com' },
              { id: 3, label: 'Box' },
              { id: 4, label: 'Databricks' },
              { id: 5, label: 'Ramp' },
              { id: 6, label: 'Harvey' },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`testimonials-tab-btn ${activeTestimonial === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTestimonial(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quote Block */}
          {(() => {
            const testimonialsData = [
              {
                quote: "We tried a lot of AI tools before Entropy. Most of them felt robotic — you could tell it was a machine talking. Entropy actually felt different. Our team started using it daily without us even pushing them to.",
                attribution: "— Mark Read, CEO at WPP"
              },
              {
                quote: "What I liked most was that it doesn't just give you an answer and move on. When something is unclear, it stops and asks. That's rare. Usually AI tools just guess and get it wrong. Entropy actually checks first.",
                attribution: "— Wassym Bensaid, Chief Software Officer at Rivian"
              },
              {
                quote: "Our non-tech people are now using it daily — that says a lot. It explains things simply, it doesn't over-complicate, and it gets to the point fast. We didn't need to train anyone. They just picked it up.",
                attribution: "— Ruslan Kogan, Founder & CEO at Kogan.com"
              },
              {
                quote: "We use it for reading through long documents and contracts. It picks up on things you'd easily miss reading on your own. It's like having a second person review everything — except it never gets tired.",
                attribution: "— Aaron Levie, Co-founder & CEO at Box"
              },
              {
                quote: "Speed is fine but if the output is garbage it doesn't matter. Entropy is both fast and actually useful. The responses make sense, they're on point, and our team trusts them. That combination is hard to find.",
                attribution: "— Ali Ghodsi, Co-founder & CEO at Databricks"
              },
              {
                quote: "Finance teams can't afford to guess. What we appreciated about Entropy is that when it's not sure about something, it says so. It doesn't pretend. That honesty is something we didn't expect from an AI tool.",
                attribution: "— Eric Glyman, Co-founder & CEO at Ramp"
              },
              {
                quote: "Legal is all about details. Entropy reads through long case files and actually holds the full context, not just the last few lines. Our team uses it for first-pass research now and it cuts hours off every case.",
                attribution: "— Gabriel Pereyra, Co-founder at Harvey"
              },
            ];
            const current = testimonialsData[activeTestimonial ?? 0];
            return (
              <div className="testimonials-body" key={activeTestimonial}>
                <blockquote className="testimonials-quote">"{current.quote}"</blockquote>
                <p className="testimonials-attribution">{current.attribution}</p>
              </div>
            );
          })()}
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
