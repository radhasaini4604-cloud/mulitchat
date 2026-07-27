import { useState, useEffect } from 'react';
import { Grainient } from './Grainient';

const statusLines = [
  "Creating image",
  "Getting more pixels",
  "Adding details",
  "Last tweaks",
  "Finalizing"
];

export function GrainientTest() {
  const [statusText, setStatusText] = useState(statusLines[0]);
  const [percentage, setPercentage] = useState(0);
  const [key, setKey] = useState(0); // Trigger simulation reload

  useEffect(() => {
    setPercentage(0);
    setStatusText(statusLines[0]);

    const interval = setInterval(() => {
      setPercentage((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
          setStatusText("Finished");
          return 100;
        }

        // Map 100% to the 5 status lines (20% range each)
        const stage = Math.min(Math.floor(next / 20), statusLines.length - 1);
        setStatusText(statusLines[stage]);
        return next;
      });
    }, 100); // 100ms * 100 steps = 10 seconds total simulation duration

    return () => clearInterval(interval);
  }, [key]);

  const handleRestart = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
      color: '#f4f4f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      gap: '24px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Nothric Image Pipeline
        </h2>
        <p style={{ color: '#71717a', fontSize: '0.88rem' }}>
          Shimmering WebGL gradient with dynamic status overlay
        </p>
      </div>
      
      {/* 1:1 Rendering Card */}
      <div style={{ 
        position: 'relative', 
        width: '320px', 
        height: '320px', 
        borderRadius: '24px', 
        overflow: 'hidden', 
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
      }}>
        {/* WebGL background mesh */}
        <Grainient
          color1="#c7c4d4"
          color2="#784ca1"
          color3="#d5d1c5"
          timeSpeed={4}
          colorBalance={0.05}
          warpStrength={1}
          warpFrequency={3.7}
          warpSpeed={4.1}
          warpAmplitude={50}
          blendAngle={148}
          blendSoftness={0.64}
          rotationAmount={1190}
          noiseScale={0.8}
          grainAmount={0.1}
          grainScale={3.4}
          grainAnimated={false}
          contrast={1.5}
          gamma={0.75}
          saturation={1}
          centerX={0}
          centerY={0.04}
          zoom={0.85}
        />

        {/* Dynamic status text overlay at the top left inside the card */}
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '18px',
          zIndex: 10,
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textShadow: '0 1px 4px rgba(0,0,0,0.2)'
        }}>
          {/* Pulsing indicator dot */}
          <span style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: percentage < 100 ? '#f472b6' : '#10b981', // pink while generating, green when finished
            boxShadow: percentage < 100 ? '0 0 8px #f472b6' : '0 0 8px #10b981',
            transition: 'background-color 0.3s, box-shadow 0.3s'
          }} />
          <span>{statusText}</span>
        </div>
      </div>

      {/* Control panel */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        maxWidth: '400px'
      }}>
        <button 
          onClick={handleRestart}
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Replay
        </button>
        <span style={{ fontSize: '0.78rem', color: '#71717a', lineHeight: 1.4 }}>
          Observe the clean overlay, pulsing status dot, and stages transition over a 10s window.
        </span>
      </div>
    </div>
  );
}
