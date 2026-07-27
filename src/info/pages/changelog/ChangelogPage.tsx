import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import LandingFooter from '../../components/Footer'
import '../../components/base.css'
import '../../components/layout.css'
import './ChangelogPage.css'

interface ChangelogPost {
  version: string
  date: string
  title: string
  tags: { text: string; type: 'new' | 'upgrade' | 'security' }[]
  intro: string
  details: string[]
}

export default function ChangelogPage() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Changelog | Nothric';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    const elements = document.querySelectorAll('.ui-overlay .reveal-on-scroll, .ui-overlay .changelog-post')
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const changelogPosts: ChangelogPost[] = [
    {
      version: 'v4.8.0-frontier',
      date: 'August 28, 2026',
      title: 'Frontier Model Hub & Single Model Workspace',
      tags: [
        { text: 'New Models', type: 'new' },
        { text: 'Interface', type: 'upgrade' }
      ],
      intro: 'We have integrated the industry\'s leading frontier models directly into our core routing framework, accompanied by a dedicated single-model workspace for focused dialogue.',
      details: [
        'Frontier Models: Integrated native access to Gemini 3.1 Pro, Claude 3.5, and GPT-5.5 models.',
        'Single Model Chat: Allows users to bypass multi-agent consensus loops and talk directly with a single specific model.',
        'Latency Tuning: Optimized route mapping to lower token retrieval latency by 12% across frontier nodes.'
      ]
    },
    {
      version: 'v4.6.0-core',
      date: 'August 12, 2026',
      title: 'Auto Nothric Consensus Router',
      tags: [
        { text: 'Core Engine', type: 'upgrade' }
      ],
      intro: 'Introducing Auto Nothric, our meta-routing intelligence that dynamically analyzes user prompts to select and trigger the optimal combination of models.',
      details: [
        'Smart Routing: Automatically routes code queries to Mistral, conversational prompts to Gemini, and vision files to Qwen.',
        'Token Calibration: Optimizes token costs by dynamically skipping consensus verification when a single model is sufficient.'
      ]
    },
    {
      version: 'v4.3.0-collab',
      date: 'July 24, 2026',
      title: 'Multi-Model Discussions inside Collab',
      tags: [
        { text: 'Collab', type: 'upgrade' }
      ],
      intro: 'To preserve the core multi-agent synergy of Nothric, we have upgraded our real-time collaboration whiteboard to support simultaneous multi-model discussions.',
      details: [
        'Multi-Agent Whiteboard: Teams can now summon and run multiple models simultaneously on the collaborative whiteboard canvas.',
        'Room Mentions: Easily coordinate tasks during team brainstorms by tagging specific agents (e.g. `@gemini`, `@mistral`).'
      ]
    },
    {
      version: 'v4.2.0-collab',
      date: 'July 14, 2026',
      title: 'Single-Model Canvas Integration in Collab',
      tags: [
        { text: 'Collab', type: 'new' }
      ],
      intro: 'Based on high developer demand, we have brought our first dedicated model assistant directly into the real-time collaboration rooms.',
      details: [
        'Collaborative Mistral: Integrated a single-agent Mistral model inside the shared rooms to assist with real-time editing.',
        'State Sync: Real-time listeners automatically sync the model\'s outputs to all active whiteboard participants.'
      ]
    },
    {
      version: 'v4.0.0-collab',
      date: 'July 04, 2026',
      title: 'Nothric Collab Live Beta Launch',
      tags: [
        { text: 'Collab', type: 'new' }
      ],
      intro: 'We are thrilled to launch the live beta of Nothric Collab, our real-time collaborative workspace designed exclusively for human-to-human user coordination.',
      details: [
        'Shared Workspace: Secure, low-latency sandbox enabling teams to chat, draw, and share workspaces in real-time.',
        'Live Cursor Tracking: Real-time UI syncing showing exactly where collaborators are focusing on the screen.'
      ]
    },
    {
      version: 'v3.5.0-core',
      date: 'June 20, 2026',
      title: 'Flagship Gemini 3.5 Launch & Immersive UI Controls',
      tags: [
        { text: 'New Model', type: 'new' },
        { text: 'Steerability', type: 'upgrade' }
      ],
      intro: 'We are thrilled to launch Gemini 3.5, our flagship conversational model optimized specifically for emotional intelligence, colloquial Hinglish translation, and zero-posturing natural dialogue.',
      details: [
        'India-Centric Nuance: Native vocabulary parsing curating slang and modern code-switching patterns.',
        'Immersive UI overrides: Globally hidden Chrome/browser native scrollbars to optimize coding workspace views.',
        'Right-Side Navigation Spy: Dynamic expanding line indicators (- active, _ inactive) scrolling sections smoothly.',
        'Migration Tuning Guide: Built-in documentation outlining dynamic length calibration, literalism checks, and tool effort tuning options.'
      ]
    },
    {
      version: 'v3.2.0-core',
      date: 'May 28, 2026',
      title: 'Custom Instructions & User Preferences',
      tags: [
        { text: 'Core Engine', type: 'new' }
      ],
      intro: 'Users can now configure persistent custom instructions and system preferences to guide Nothric\'s persona and outputs globally.',
      details: [
        'System Guidelines: Save background info and formatting preferences to automatically customize all future chat sessions.',
        'Strict Formatting: Enforce output constraints (like JSON-only schemas or code blocks without explanations).'
      ]
    },
    {
      version: 'v3.0.0-rag',
      date: 'May 10, 2026',
      title: 'PDF Parsing & Native File Support',
      tags: [
        { text: 'New Feature', type: 'new' }
      ],
      intro: 'Nothric now natively supports document uploads, allowing you to parse PDFs, CSVs, text logs, and codebases directly.',
      details: [
        'PDF OCR: Client-side rendering and data extraction for complex reports, gpt maps, and code scripts.',
        'Auto-Indexing: Document contents are automatically split and indexed via Gpt 5.8 embeddings for RAG searches.'
      ]
    },
    {
      version: 'v2.8.0-voice',
      date: 'April 22, 2026',
      title: 'Real-Time Duplex Voice Conversations',
      tags: [
        { text: 'Voice', type: 'upgrade' }
      ],
      intro: 'We have launched duplex voice conversations, allowing you to speak and interact naturally with Nothric with ultra-low latency.',
      details: [
        'Live Interruptions: Speak naturally and interrupt the model mid-flow; audio leveling instantly adapts to active voice prompts.',
        'Duplex Audio Tuning: Lowered total round-trip voice processing latency to average below 280ms.'
      ]
    },
    {
      version: 'v2.7.0-voice',
      date: 'April 08, 2026',
      title: 'Voice Detection & Speech-to-Text Translation',
      tags: [
        { text: 'Voice', type: 'new' }
      ],
      intro: 'Nothric now supports speech inputs via our custom multi-lingual Speech-to-Text translation engine.',
      details: [
        'Speech Recognition: Converts spoken inputs to clean textual prompts instantly with 98.7% accuracy.',
        'Colloquial Recognition: Automatically parses multi-lingual colloquial terms and Hinglish voice inputs.'
      ]
    },
    {
      version: 'v2.5.5-imagine',
      date: 'March 18, 2026',
      title: 'Flux Dev & Flux Klev Expansion',
      tags: [
        { text: 'New Models', type: 'new' },
        { text: 'Imagine', type: 'upgrade' }
      ],
      intro: 'Just four days after our image engine launch, we have expanded our visual rendering pipelines with two additional high-fidelity models.',
      details: [
        'Flux Dev: Optimized for complex instruction following, detailed text layouts, and photorealistic accuracy.',
        'Flux Klev: Specially tuned for gpt-like graphics, digital illustrations, and high-contrast color balances.'
      ]
    },
    {
      version: 'v2.5.0-imagine',
      date: 'March 14, 2026',
      title: 'Flux Schnell & Nothric Imagine Launch',
      tags: [
        { text: 'New Model', type: 'new' },
        { text: 'Imagine', type: 'new' }
      ],
      intro: 'We are proud to introduce Nothric Imagine, powered by Flux Schnell, our ultra-fast visual asset generator.',
      details: [
        'Flux Schnell: Generates beautiful 1024x1024 images in less than 950ms under heavy concurrent workloads.',
        'Prompt expansion: Leverages Mistral reasoning loops to enrich simple text ideas into descriptive image generation prompts.'
      ]
    },
    {
      version: 'v2.2.0-gpt',
      date: 'February 28, 2026',
      title: 'Gpt 5.8 Dense Context Retrieval',
      tags: [
        { text: 'Performance', type: 'upgrade' }
      ],
      intro: 'Released Gpt 5.8, our upgraded semantic indexing model optimized for high-density document search and visual layout RAG.',
      details: [
        'Dimensional Precision: Support for 1536-dimensional embeddings with absolute cosine similarity sorting.',
        'Cache Indexing: Bypassed database latency by keeping active context vectors loaded in hardware LPUs.'
      ]
    },
    {
      version: 'v2.1.0-gpt',
      date: 'February 14, 2026',
      title: 'Gpt 5.7 Real-time Embedding Search',
      tags: [
        { text: 'New Model', type: 'new' }
      ],
      intro: 'Released Gpt 5.7, our first high-dimensional embedding model optimized for dense semantic database retrievals.',
      details: [
        'Sub-80ms Search: Achieved zero cold start times during retrieval queries on local databases.',
        'LPU Offloading: Offloads index arrays to local hardware layers, lowering processing costs.'
      ]
    },
    {
      version: 'v1.3.0-qwen',
      date: 'January 18, 2026',
      title: 'Qwen 1.3 Vision Schema Parser',
      tags: [
        { text: 'New Model', type: 'new' },
        { text: 'Visual', type: 'upgrade' }
      ],
      intro: 'Introducing Qwen 1.3, our first visual model designed for character OCR extraction and visual-to-JSON mappings.',
      details: [
        'Sub-90ms OCR: Instantly compiles invoice screenshots, visual tables, and manual forms into clean data structures.',
        'Spatial Bounding: Guarantees 100% compliant parsing coordinate margins for all structural elements.'
      ]
    },
    {
      version: 'v1.1.0-mistral',
      date: 'November 06, 2025',
      title: 'Mistral 4.6 Sandbox Compiler',
      tags: [
        { text: 'SecurityCard', type: 'security' },
        { text: 'Upgrade', type: 'upgrade' }
      ],
      intro: 'We have launched Mistral 4.6, delivering sandboxed code execution, automated compilation loops, and reasoning checks.',
      details: [
        'Secure Sandboxing: Allows Mistral to securely compile, run, and verify python, javascript, and shell scripts in real-time.',
        'Vulnerability Filtering: Scans dependencies and outputs for memory leaks, buffer overflows, and injection exploits.'
      ]
    },
    {
      version: 'v1.0.0-mistral',
      date: 'October 10, 2025',
      title: 'Mistral 1.0 Reasoning Model Launch',
      tags: [
        { text: 'New Model', type: 'new' }
      ],
      intro: 'Nothric is officially live! We are launching Mistral 1.0, our first reasoning model designed for step-by-step logic.',
      details: [
        'Reasoning Cycles: Uses verification loops to double-check logical steps and correct errors before outputs start streaming.',
        'Ultra-Fast Streams: Streaming engine optimizes token generation, lowering first-token response times below 15ms.'
      ]
    },
    {
      version: 'v0.1.0-origin',
      date: 'October 01, 2025',
      title: 'Nothric Headquarters Established',
      tags: [
        { text: 'Origin', type: 'new' }
      ],
      intro: 'Nothric is founded! We have set up our operations headquarters and began constructing our core AI engine cluster.',
      details: [
        'Cluster Build: Configured our first high-performance accelerator cluster to train future reasoning and vision models.',
        'Founder Operations: Setup low-latency workflows and established the main engineering desk to develop agentic workspaces.'
      ]
    }
  ];

  const getChangelogMarkdown = () => {
    return changelogPosts.map(post => {
      return `## ${post.title} (${post.version}) - ${post.date}\n\n${post.intro}\n\n${post.details.map(d => `* ${d}`).join('\n')}`;
    }).join('\n\n');
  };

  const handleCopyLLM = () => {
    navigator.clipboard.writeText(getChangelogMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleViewMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([getChangelogMarkdown()], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "nothric_changelog.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="changelog-page-wrapper">
      <div className="ui-overlay">
        {/* Navigation Header */}
        <Navbar />

        {/* Content Body */}
        <div className="changelog-content">
          {/* Hero Header */}
          <section className="changelog-hero">
            <span className="changelog-pretitle">What's New</span>
            <h1 className="changelog-title">Changelog</h1>
            <p className="changelog-hero-subtitle">The latest fixes, features, and improvements shipping to nothric.</p>

            <div className="changelog-actions">
              <button className="changelog-action-btn" onClick={handleCopyLLM}>
                <svg className="action-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                Copy for LLM
              </button>
              <button className="changelog-action-btn" onClick={handleViewMarkdown}>
                <svg className="action-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                View as Markdown
              </button>
              <a href="/docs" className="changelog-pill-btn primary">
                Read docs <span className="arrow">›</span>
              </a>
              <a href="/gemini" className="changelog-pill-btn outline">
                Meet gemini-3.5 <span className="arrow">↗</span>
              </a>
            </div>
          </section>

          {/* Vertical Timeline */}
          <div className="changelog-timeline-container">
            {changelogPosts.map((post, index) => {
              const monthName = post.date.split(' ')[0];
              const isFirstPostOfMonth = index === 0 || changelogPosts[index - 1].date.split(' ')[0] !== monthName;
              const dateDay = post.date.split(',')[0]; // e.g. "June 20"

              return (
                <div key={index} className="changelog-post">
                  {/* Left Column: Date */}
                  <div className="changelog-left">
                    <span className="changelog-date-label">{dateDay}</span>
                  </div>

                  {/* Middle Column: Line and Dot */}
                  <div className="changelog-middle">
                    <div className="changelog-dot" />
                  </div>

                  {/* Right Column: Month Header and Content */}
                  <div className="changelog-right">
                    {isFirstPostOfMonth && (
                      <h2 className="changelog-month-header">{monthName}</h2>
                    )}
                    
                    <div className="changelog-post-body">
                      <h3 className="changelog-post-title">{post.title}</h3>
                      <div className="changelog-tags-row">
                        <span className="changelog-version-label">{post.version}</span>
                        {post.tags.map((tag, tIdx) => (
                          <span key={tIdx} className={`changelog-tag ${tag.type}`}>
                            {tag.text}
                          </span>
                        ))}
                      </div>
                      
                      <p className="changelog-intro-text">{post.intro}</p>
                      
                      <ul className="changelog-list">
                        {post.details.map((detail, dIdx) => {
                          const separator = detail.includes(':') ? ':' : '—';
                          const parts = detail.split(separator);
                          const leadText = parts[0].trim();
                          const descText = parts.slice(1).join(separator).trim();

                          return (
                            <li key={dIdx} className="changelog-list-item">
                              <span className="changelog-list-lead">{leadText}</span>
                              {descText && (
                                <>
                                  <span className="changelog-list-dash"> — </span>
                                  <span className="changelog-list-desc">{descText}</span>
                                </>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {copied && (
          <div className="changelog-toast">
            Changelog copied to clipboard!
          </div>
        )}

        <LandingFooter />
      </div>
    </div>
  )
}
