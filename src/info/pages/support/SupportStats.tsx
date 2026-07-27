import React, { useState, useEffect, useRef } from 'react';
import './SupportStats.css';

interface RollingNumberProps {
  target: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}

const RollingNumber: React.FC<RollingNumberProps> = ({ target, duration = 1200, decimals = 0, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = target;
    const totalMiliseconds = duration;
    const incrementTime = 20;
    const totalSteps = totalMiliseconds / incrementTime;
    const increment = (end - start) / totalSteps;

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(current);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  const formatValue = (val: number) => {
    if (decimals === 0 && val >= 1000) {
      return Math.floor(val).toLocaleString();
    }
    return val.toFixed(decimals);
  };

  return (
    <span ref={elementRef}>
      {formatValue(count)}
      {suffix}
    </span>
  );
};

export default function SupportStats() {
  return (
    <section className="support-stats-section">
      {/* Ambient Background Glows */}
      <div className="stats-bg-glow glow-left" />
      <div className="stats-bg-glow glow-right" />

      {/* Centered Header */}
      <div className="stats-section-header">
        <h2 className="guarantee-h2" style={{ textAlign: 'center', margin: 0 }}>
          Our <span>Track Record</span>
        </h2>
      </div>

      <div className="stats-columns-grid">
        {/* Left Column: Text description */}
        <div className="stats-text-col">
          <h3 className="stats-sub-h3">
            Engineered for Resolution Speed
          </h3>
          <p className="guarantee-desc" style={{ maxWidth: 'none' }}>
            We built Nothric to run on ultra-reliable infrastructure, and our support team works with the same engineering focus. By routing technical queries directly to senior developers rather than basic support tiers, we eliminate typical round-trips. We resolve technical blockages quickly, keeping your AI workflows running smoothly.
          </p>
        </div>

        {/* Right Column: Clean, minimal stats items */}
        <div className="stats-data-col">
          
          {/* Stat Item 1: Queries Solved */}
          <div className="stats-data-item">
            <div className="stat-number">
              <RollingNumber target={5000} suffix="+" />
            </div>
            <div className="stat-info">
              <h4 className="stat-label">Inquiries Solved</h4>
              <p className="stat-desc">Successfully triaged and resolved by our dedicated engineering team.</p>
            </div>
          </div>

          {/* Stat Item 2: Avg Time */}
          <div className="stats-data-item">
            <div className="stat-number">
              <RollingNumber target={2.7} decimals={1} suffix="" />
              <span className="stat-number-unit">d</span>
            </div>
            <div className="stat-info">
              <h4 className="stat-label">Avg. Resolution Time</h4>
              <p className="stat-desc">Our average end-to-end turnaround time from initial ticket review.</p>
            </div>
          </div>

          {/* Stat Item 3: Satisfaction Feedback */}
          <div className="stats-data-item">
            <div className="stat-number">
              <RollingNumber target={4.7} decimals={1} suffix="" />
              <span className="stat-number-unit">★</span>
            </div>
            <div className="stat-info">
              <h4 className="stat-label">Customer Satisfaction</h4>
              <p className="stat-desc">Consistently rated outstanding based on post-resolution feedback.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
