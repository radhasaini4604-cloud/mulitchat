import React from 'react';
import Navbar from '../../components/Navbar';
import LandingFooter from '../../components/Footer';
import ContactForm from './ContactForm';
import './ContactPage.css';
import userImg1 from '../pricing/images/image.png';
import userImg2 from '../pricing/images/image copy.png';
import userImg3 from '../pricing/images/image copy 2.png';
import userImg4 from '../pricing/images/image copy 3.png';
import userImg5 from '../pricing/images/image copy 4.png';

export default function ContactPage() {
  const [activeTab, setActiveTab] = React.useState('vercel');

  const testimonials = [
    {
      id: 'vercel',
      name: 'Vercel',
      quote: 'Nothric is transforming workflows for developers. Simple interface, easy integrations, handy templates. What else could we ask for.',
      author: 'Guillermo Rauch',
      role: 'CEO at Vercel',
      avatar: userImg1,
      logo: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 22.5L12 1.5L0 22.5H24Z"/>
        </svg>
      )
    },
    {
      id: 'supabase',
      name: 'Supabase',
      quote: "Nothric's database automation and natural language query translation have cut our query-building time by 80%. A game-changer for database developers.",
      author: 'Paul Copplestone',
      role: 'CEO at Supabase',
      avatar: userImg2,
      logo: (
        <svg viewBox="0 0 109 113" fill="none" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint0_linear)"/>
          <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z" fill="url(#paint1_linear)" fillOpacity="0.2"/>
          <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z" fill="#3ECF8E"/>
          <defs>
            <linearGradient id="paint0_linear" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
              <stop stopColor="#249361"/>
              <stop offset="1" stopColor="#3ECF8E"/>
            </linearGradient>
            <linearGradient id="paint1_linear" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
              <stop/>
              <stop offset="1" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'stripe',
      name: 'Stripe',
      quote: "Building AI-assisted billing flows with Nothric's custom agent endpoints was completely seamless. Highly recommended for scaling systems.",
      author: 'Patrick Collison',
      role: 'CEO at Stripe',
      avatar: userImg3,
      logo: (
        <svg role="img" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <title>Stripe</title>
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
        </svg>
      )
    },
    {
      id: 'linear',
      name: 'Linear',
      quote: "Nothric feels like the Linear of AI. The attention to details, speed of execution, and command menu interactions are state of the art.",
      author: 'Karri Saarinen',
      role: 'CEO at Linear',
      avatar: userImg4,
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 100 100">
          <path fill="#5E6AD2" d="M1.225 61.523c-.222-.949.908-1.546 1.597-.857l36.512 36.512c.69.69.092 1.82-.857 1.597-18.425-4.323-32.93-18.827-37.252-37.252ZM.002 46.889a.99.99 0 0 0 .29.76L52.35 99.71c.201.2.478.307.76.29 2.37-.149 4.695-.46 6.963-.927.765-.157 1.03-1.096.478-1.648L2.576 39.448c-.552-.551-1.491-.286-1.648.479a50.067 50.067 0 0 0-.926 6.962ZM4.21 29.705a.988.988 0 0 0 .208 1.1l64.776 64.776c.289.29.726.375 1.1.208a49.908 49.908 0 0 0 5.185-2.684.981.981 0 0 0 .183-1.54L8.436 24.336a.981.981 0 0 0-1.541.183 49.896 49.896 0 0 0-2.684 5.185Zm8.448-11.631a.986.986 0 0 1-.045-1.354C21.78 6.46 35.111 0 49.952 0 77.592 0 100 22.407 100 50.048c0 14.84-6.46 28.172-16.72 37.338a.986.986 0 0 1-1.354-.045L12.659 18.074Z"/>
        </svg>
      )
    },
    {
      id: 'clerk',
      name: 'Clerk',
      quote: "Securing our agent environments with Nothric was a breeze. The team understands developer needs on a fundamental level.",
      author: 'Colin Sidoti',
      role: 'CEO at Clerk',
      avatar: userImg5,
      logo: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 128 128" width="28" height="28">
          <circle cx="64" cy="64" r="20" fill="#fff"/>
          <path fill="#fff" fillOpacity=".4" d="M99.572 10.788c1.999 1.34 2.17 4.156.468 5.858L85.424 31.262c-1.32 1.32-3.37 1.53-5.033.678A35.846 35.846 0 0 0 64 28c-19.882 0-36 16.118-36 36a35.846 35.846 0 0 0 3.94 16.391c.851 1.663.643 3.712-.678 5.033L16.646 100.04c-1.702 1.702-4.519 1.531-5.858-.468C3.974 89.399 0 77.163 0 64 0 28.654 28.654 0 64 0c13.163 0 25.399 3.974 35.572 10.788Z"/>
          <path fill="#fff" d="M100.04 111.354c1.702 1.702 1.531 4.519-.468 5.858C89.399 124.026 77.164 128 64 128c-13.164 0-25.399-3.974-35.572-10.788-2-1.339-2.17-4.156-.468-5.858l14.615-14.616c1.322-1.32 3.37-1.53 5.033-.678A35.847 35.847 0 0 0 64 100a35.846 35.846 0 0 0 16.392-3.94c1.662-.852 3.712-.643 5.032.678l14.616 14.616Z"/>
        </svg>
      )
    }
  ];

  const activeQuote = testimonials.find((t) => t.id === activeTab) || testimonials[0];

  React.useEffect(() => {
    document.title = 'Contact Sales | Nothric';
  }, []);

  return (
    <div className="contact-page-new">
      {/* Premium custom high-tech background (No SideRays) */}
      <div className="contact-bg-glow" />

      {/* Massive blurred "CONTACT" word in the background */}
      <div className="bg-contact-text">CONTACT</div>

      {/* Decorative Circuit Lines on Left & Right */}
      <div className="circuit-lines-container">
        {/* Left Circuit Line */}
        <svg className="circuit-line left" width="280" height="180" viewBox="0 0 280 180" fill="none">
          <path d="M0 40 H120 L160 110 H280" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
          <path d="M0 40 H120 L160 110 H280" stroke="url(#glowGradientLeft)" strokeWidth="2" strokeDasharray="60 160" strokeDashoffset="0">
            <animate attributeName="strokeDashoffset" values="220;0" dur="5s" repeatCount="indefinite" />
          </path>
          <defs>
            <linearGradient id="glowGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Right Circuit Line */}
        <svg className="circuit-line right" width="280" height="180" viewBox="0 0 280 180" fill="none">
          <path d="M280 40 H160 L120 110 H0" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
          <path d="M280 40 H160 L120 110 H0" stroke="url(#glowGradientRight)" strokeWidth="2" strokeDasharray="60 160" strokeDashoffset="0">
            <animate attributeName="strokeDashoffset" values="0;220" dur="5s" repeatCount="indefinite" />
          </path>
          <defs>
            <linearGradient id="glowGradientRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Navbar with Transparent Style */}
      <Navbar onLoginClick={() => {
        if ((window as any).navigate) {
          (window as any).navigate('/?login=true');
        } else {
          window.location.href = '/?login=true';
        }
      }} />

      {/* Main Content Area */}
      <main className="contact-main-content">
        <div className="contact-content-grid">
          
          {/* Left Column: Get In Touch Info */}
          <div className="contact-info-col">
            {/* Title & Subtitle */}
            <h1 className="contact-h1">Get in touch</h1>
            <p className="contact-desc">
              Ready to explore the next nothric? Drop us a line and let's build the future together.
            </p>

            {/* Info Cards */}
            <div className="contact-cards-list">
              
              {/* Email Card */}
              <a href="mailto:nothric07@gmail.com" className="info-card-item">
                <div className="card-left-section">
                  <div className="icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div className="text-details">
                    <span className="card-label">Email us</span>
                    <span className="card-value">nothric07@gmail.com</span>
                  </div>
                </div>
                <div className="card-arrow-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </a>

              {/* Phone Card */}
              <a href="tel:+914909429571" className="info-card-item">
                <div className="card-left-section">
                  <div className="icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div className="text-details">
                    <span className="card-label">Call us</span>
                    <span className="card-value">+91 4909429571</span>
                  </div>
                </div>
                <div className="card-arrow-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </a>

              {/* Location Card */}
              <a href="https://maps.google.com/?q=Jodhpur,India" target="_blank" rel="noopener noreferrer" className="info-card-item">
                <div className="card-left-section">
                  <div className="icon-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="text-details">
                    <span className="card-label">Our location</span>
                    <span className="card-value">Jodhpur, India</span>
                  </div>
                </div>
                <div className="card-arrow-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </a>

            </div>

            {/* Availability & Social Section */}
            <div className="contact-extra-info">
              <h4 className="extra-info-title">Other platforms to connect</h4>
              
              {/* Social Links */}
              <div className="social-links-row">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="X (Twitter)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Discord">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-col">
            <div className="contact-form-glass-card">
              <ContactForm />
            </div>
          </div>

        </div>

        {/* Section 2: Trust & Testimonials (Vercel, Supabase, Stripe, Linear, Clerk) */}
        <div className="contact-divider" />
        
        <section className="contact-trust-section">
          {/* Nav Pills for switching companies */}
          <div className="trust-nav-pills">
            {testimonials.map((t) => (
              <button 
                key={t.id} 
                className={`trust-pill-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Testimonial Box matching design mockup */}
          <div className="trust-testimonial-box">
            {/* Logo in Glowing circular button */}
            <div className="trust-logo-circle">
              {activeQuote.logo}
            </div>

            {/* Quote statement in premium text style */}
            <blockquote className="trust-quote">
              "{activeQuote.quote}"
            </blockquote>

            {/* Author profile credits */}
            <div className="trust-author-details">
              <img className="trust-author-avatar" src={activeQuote.avatar} alt={activeQuote.author} />
              <div className="trust-author-text">
                <span className="trust-author-name">{activeQuote.author}</span>
                <span className="trust-author-role">{activeQuote.role}</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <p className="contact-disclaimer">
        The testimonials and reviews shown are for demonstration purposes only.
      </p>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
