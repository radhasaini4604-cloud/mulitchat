import React from 'react';

interface DotCanvasProps {
  style?: React.CSSProperties;
}

export default function DotCanvas({ style }: DotCanvasProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.12) 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px',
        opacity: 0.95,
        ...style,
      }}
    />
  );
}
