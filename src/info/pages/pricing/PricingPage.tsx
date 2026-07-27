import React from 'react';
import Navbar from '../../components/Navbar';
import LandingFooter from '../../components/Footer';
import PricingCard from './PricingCard';
import SideRays from '../../../components/SideRays/SideRays';
import FaqSection from '../../../prelogin/FaqSection';
import './PricingPage.css';
import userImg1 from './images/image.png';
import userImg2 from './images/image copy.png';
import userImg3 from './images/image copy 2.png';
import userImg4 from './images/image copy 3.png';
import userImg5 from './images/image copy 4.png';

const pricingFaqData = [
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer: "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from your account billing settings. Upgrades apply immediately with pro-rated charges, while downgrades take effect at the end of the current billing cycle."
  },
  {
    question: "How does the custom team billing cycle work?",
    answer: "Selecting the Custom billing cycle allows teams to establish bespoke contracts. This includes customized volume seat pricing, private model endpoints, extended rate limits, and custom billing terms. Contact us to design a plan."
  },
  {
    question: "What payment methods do you support?",
    answer: "We support all major credit/debit cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, and bank transfers via secure Stripe checkout."
  },
  {
    question: "Do I get access to all models on the Pro tier?",
    answer: "Yes, Pro gives you access to all standard open-source and proprietary models. Upgrading to Nothric Group Chat unlocks advanced reasoning models (GPT o1/o3, DeepSeek R1), unlimited image generation, and multi-model voice meets."
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly' | 'custom'>('monthly');

  React.useEffect(() => { document.title = 'User Pricing | Nothric'; }, []);

  // Real pricing mapping
  const pricingData = {
    monthly: {
      pro: { price: '$6', period: '/month' },
      groupchat: { price: '$15', period: '/month' }
    },
    yearly: {
      pro: { price: '$5', period: '/mo (billed yearly)' },
      groupchat: { price: '$12', period: '/mo (billed yearly)' }
    },
    custom: {
      pro: { price: 'Custom', period: ' quote' },
      groupchat: { price: 'Custom', period: ' quote' }
    }
  };

  const currentPrices = pricingData[billingCycle];
  const [activeSpecPlan, setActiveSpecPlan] = React.useState<'pro' | 'groupchat'>('pro');

  // Multi-model capabilities dataset
  const specFeatures = [
    {
      name: 'Context Window',
      pro: { gemini: '128K tokens', gpt: '128K tokens', claude: '200K tokens', deepseek: '64K tokens', grok: '128K tokens', perplexity: '32K tokens' },
      groupchat: { gemini: '2M tokens', gpt: '256K tokens', claude: '500K tokens', deepseek: '128K tokens', grok: '256K tokens', perplexity: '128K tokens' }
    },
    {
      name: 'Image Generation',
      pro: { gemini: '✓ (Imagen 3)', gpt: '✓ (DALL-E 3)', claude: '—', deepseek: '—', grok: '✓ (Flux)', perplexity: '—' },
      groupchat: { gemini: '✓ (Imagen 3 Ultra)', gpt: '✓ (DALL-E 3 HD)', claude: '✓ (SDXL)', deepseek: '✓ (Flux)', grok: '✓ (Flux Pro)', perplexity: '✓ (Multi-engine)' }
    },
    {
      name: 'Live Voice',
      pro: { gemini: 'Limited', gpt: '✓ (Advanced)', claude: '—', deepseek: '—', grok: '—', perplexity: '—' },
      groupchat: { gemini: '✓ (Real-time)', gpt: '✓ (Omni Voice)', claude: '✓ (Audio Input)', deepseek: '—', grok: '✓ (Voice Chat)', perplexity: '—' }
    },
    {
      name: 'Video Making',
      pro: { gemini: '—', gpt: '—', claude: '—', deepseek: '—', grok: '—', perplexity: '—' },
      groupchat: { gemini: '✓ (Veo)', gpt: '✓ (Sora)', claude: '—', deepseek: '—', grok: '✓ (Video)', perplexity: '—' }
    },
    {
      name: 'Live Web Search',
      pro: { gemini: 'Google Search', gpt: 'Bing Search', claude: '—', deepseek: '✓ (Web)', grok: 'Real-time X Search', perplexity: 'Deep Web Search' },
      groupchat: { gemini: 'Google + Grounding', gpt: 'Bing + Grounding', claude: '✓ (Search)', deepseek: '✓ (Search + Citations)', grok: 'Real-time X + Citations', perplexity: 'Pro Research Web' }
    },
    {
      name: 'Speed (tokens/s)',
      pro: { gemini: '120–150 tokens/s', gpt: '100–120 tokens/s', claude: '70–90 tokens/s', deepseek: '50–70 tokens/s', grok: '140–180 tokens/s', perplexity: '80–100 tokens/s' },
      groupchat: { gemini: '240–300 tokens/s', gpt: '200–250 tokens/s', claude: '140–180 tokens/s', deepseek: '120–150 tokens/s', grok: '300–400 tokens/s', perplexity: '160–200 tokens/s' }
    },
    {
      name: 'PDF & Image Input Box',
      pro: { gemini: '✓', gpt: '✓', claude: '✓', deepseek: '—', grok: '✓', perplexity: '✓' },
      groupchat: { gemini: '✓', gpt: '✓', claude: '✓', deepseek: '✓', grok: '✓', perplexity: '✓' }
    },
    {
      name: 'Participate in Collaboration',
      pro: { gemini: '✓', gpt: '✓', claude: '—', deepseek: '✓', grok: '—', perplexity: '—' },
      groupchat: { gemini: '✓', gpt: '✓', claude: '✓', deepseek: '✓', grok: '✓', perplexity: '✓' }
    },
    {
      name: 'Deep Research',
      pro: { gemini: 'Basic', gpt: 'Basic', claude: '✓ (Claude Research)', deepseek: '✓ (Reasoning R1)', grok: '—', perplexity: '✓ (Pro Search)' },
      groupchat: { gemini: '✓ (Deep Agents)', gpt: '✓ (Deep o1/o3 Reasoning)', claude: '✓ (Extended Reasoning)', deepseek: '✓ (Max R1 Reasoning)', grok: '✓ (Grok Reasoning)', perplexity: '✓ (Max Deep Research)' }
    }
  ];

  return (
    <div className="pricing-page-new">
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
        <SideRays
          speed={0}
          rayColor1="#ffffff"
          rayColor2="#888c99"
          intensity={2.2}
          spread={3.0}
          origin="top-left"
          tilt={60}
          saturation={0.5}
          blend={1}
          falloff={1.5}
          opacity={0.85}
        />
      </div>

      <Navbar onLoginClick={() => {
        if ((window as any).navigate) {
          (window as any).navigate('/?login=true');
        } else {
          window.location.href = '/?login=true';
        }
      }} />

      <main className="pricing-main-content">
        <div className="pricing-header">
          <h1 className="pricing-title">Scale Your Nothric</h1>
          <p className="pricing-subtitle">Flexible plans for individuals and teams. Built to grow with you.</p>
        </div>

        <div className="di-radio-wrap">
          <input
            type="radio"
            name="di-radio"
            id="r1"
            className="di-radio-input"
            checked={billingCycle === 'monthly'}
            onChange={() => setBillingCycle('monthly')}
          />
          <input
            type="radio"
            name="di-radio"
            id="r2"
            className="di-radio-input"
            checked={billingCycle === 'yearly'}
            onChange={() => setBillingCycle('yearly')}
          />
          <input
            type="radio"
            name="di-radio"
            id="r3"
            className="di-radio-input"
            checked={billingCycle === 'custom'}
            onChange={() => setBillingCycle('custom')}
          />

          <div className="di-radio-island">
            <label htmlFor="r1" className="di-radio-btn">Monthly</label>
            <label htmlFor="r2" className="di-radio-btn">Yearly</label>
            <label htmlFor="r3" className="di-radio-btn">Custom</label>
            <div className="di-radio-indicator"></div>
          </div>
        </div>

        <div className="pricing-cards-container">
          <PricingCard
            title="Pro"
            price={currentPrices.pro.price}
            period={currentPrices.pro.period}
            description="More capabilities and higher limits for power users."
            buttonText="Get started"
            isDarkButton={false}
            hasPremiumGlow={true}
            features={[
              "Access to open-source models",
              "Increased message & upload limits",
              "Expanded image creation & memory",
              "Access to Nothric Collaboration"
            ]}
          />
          <PricingCard
            title="Nothric Group Chat"
            price={currentPrices.groupchat.price}
            period={currentPrices.groupchat.period}
            description="Maximum performance and resources for scaling teams."
            buttonText="Get started"
            isDarkButton={true}
            className="enterprise-card"
            features={[
              "20x usage with top reasoning models",
              "Unlimited & faster image creation",
              "Deep research & max context window",
              "Multi-models can talk in Collab"
            ]}
          />
        </div>

        <section className="pricing-specs-section">
          <h2 className="specs-title-main">Nothric Spec Details</h2>
          <p className="specs-subtitle-main">Compare model capabilities across plans</p>

          <div className="spec-radio-wrap">
            <input
              type="radio"
              name="spec-radio"
              id="spec-r1"
              className="spec-radio-input"
              checked={activeSpecPlan === 'pro'}
              onChange={() => setActiveSpecPlan('pro')}
            />
            <input
              type="radio"
              name="spec-radio"
              id="spec-r2"
              className="spec-radio-input"
              checked={activeSpecPlan === 'groupchat'}
              onChange={() => setActiveSpecPlan('groupchat')}
            />

            <div className="spec-radio-island">
              <label htmlFor="spec-r1" className="spec-radio-btn">Pro Specs</label>
              <label htmlFor="spec-r2" className="spec-radio-btn">Group Chat Specs</label>
              <div className="spec-radio-indicator"></div>
            </div>
          </div>

          <div className="specs-table-wrapper-new">
            <table className="specs-table-real">
              <thead>
                <tr>
                  <th className="th-feature">Feature / Capability</th>
                  <th>Gemini</th>
                  <th>GPT</th>
                  <th>Claude</th>
                  <th>DeepSeek</th>
                  <th>Grok</th>
                  <th>Perplexity</th>
                </tr>
              </thead>
              <tbody>
                {specFeatures.map((feat, idx) => {
                  const val = feat[activeSpecPlan] as any;
                  return (
                    <tr key={idx} className="spec-table-row">
                      <td className="td-feature">{feat.name}</td>
                      <td className={val.gemini === '—' ? 'val-empty' : 'val-active'}>{val.gemini}</td>
                      <td className={val.gpt === '—' ? 'val-empty' : 'val-active'}>{val.gpt}</td>
                      <td className={val.claude === '—' ? 'val-empty' : 'val-active'}>{val.claude}</td>
                      <td className={val.deepseek === '—' ? 'val-empty' : 'val-active'}>{val.deepseek}</td>
                      <td className={val.grok === '—' ? 'val-empty' : 'val-active'}>{val.grok}</td>
                      <td className={val.perplexity === '—' ? 'val-empty' : 'val-active'}>{val.perplexity}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="pricing-cta-section">
          <div className="cta-wrapper">
            <div className="cta-left-btn-wrap">
              <button className="cta-white-button" onClick={() => {
                if ((window as any).navigate) {
                  (window as any).navigate('/?login=true');
                } else {
                  window.location.href = '/?login=true';
                }
              }}>
                <span className="btn-txt">Explore Nothric — It's Free</span> <span className="arrow">→</span>
              </button>
            </div>

            <div className="cta-right-social">
              <div className="avatar-group">
                <img className="avatar" src={userImg1} alt="User 1" />
                <img className="avatar" src={userImg2} alt="User 2" />
                <img className="avatar" src={userImg3} alt="User 3" />
                <img className="avatar" src={userImg4} alt="User 4" />
                <img className="avatar" src={userImg5} alt="User 5" />
              </div>
              <div className="social-text">
                <span className="social-count">1,000+</span>
                <span className="social-label">creators joined</span>
              </div>
            </div>
          </div>

          <div className="cta-benefits-row">
            <span className="benefit-item">
              <svg className="benefit-tick" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free daily token quota
            </span>
            <span className="benefit-item">
              <svg className="benefit-tick" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Instant model switching
            </span>
            <span className="benefit-item">
              <svg className="benefit-tick" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Bring your own API keys
            </span>
          </div>
        </section>

        <FaqSection faqData={pricingFaqData} />

        <p className="pricing-disclaimer">
          The pricing shown is for demonstration purposes only. Nothric is currently free to use during the preview.
        </p>
      </main>

      <LandingFooter />
    </div>
  );
}
