import './PricingPage.css';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  buttonText: string;
  isDarkButton?: boolean;
  features: string[];
  hasPremiumGlow?: boolean;
  className?: string;
  period?: string;
}

export default function PricingCard({ 
  title, 
  price, 
  description, 
  buttonText, 
  isDarkButton, 
  features,
  hasPremiumGlow,
  className = '',
  period = '/month'
}: PricingCardProps) {
  const cardContent = (
    <div className={`pricing-card ${hasPremiumGlow ? 'premium-card' : ''} ${className}`}>
      {hasPremiumGlow && <div className="premium-ray" />}
      <h3 className="pricing-card-title">{title}</h3>
      <div className="pricing-card-price">
        <span className="price-amount">{price}</span>
        <span className="price-period">{period}</span>
      </div>
      <p className="pricing-card-description">{description}</p>
      
      <button className={`pricing-card-button ${isDarkButton ? 'dark-btn' : 'light-btn'}`}>
        {buttonText}
      </button>

      <ul className="pricing-card-features">
        {features.map((feature, idx) => (
          <li key={idx}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );

  if (hasPremiumGlow) {
    return (
      <div className="premium-outer">
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
