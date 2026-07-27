import { useEffect, useRef } from 'react';
import { worldCoastlines } from './worldCoastlines';
import './GlobeSection.css';

const getUnitVector = (latDeg: number, lonDeg: number) => {
  const lat = latDeg * Math.PI / 180;
  const lon = lonDeg * Math.PI / 180;
  const x = -400 * Math.cos(lat) * Math.cos(lon);
  const y = 400 * Math.sin(lat);
  const z = 400 * Math.cos(lat) * Math.sin(lon);
  const len = Math.sqrt(x * x + y * y + z * z);
  return {
    nx: x / len,
    ny: y / len,
    nz: z / len
  };
};

const nyc = getUnitVector(40.7128, -74.0060);
const india = getUnitVector(20.5937, 78.9629);
const russia = getUnitVector(55.7558, 37.6173);

const hubs = [
  { name: "NEW YORK (HQ)", lines: ["NEW YORK (HQ)", "40.7128°N,", "74.0060°W"], vec: nyc, isHQ: true },
  { name: "INDIA", lines: ["INDIA", "20.5937°N,", "78.9629°E"], vec: india, isHQ: false },
  { name: "RUSSIA", lines: ["RUSSIA", "55.7558°N,", "37.6173°E"], vec: russia, isHQ: false }
];

const gridLines: { nx: number; ny: number; nz: number }[][] = [];

// Latitude circles
for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
  const line: { nx: number; ny: number; nz: number }[] = [];
  for (let lonDeg = 0; lonDeg <= 360; lonDeg += 5) {
    line.push(getUnitVector(latDeg, lonDeg));
  }
  gridLines.push(line);
}

// Longitude meridians
for (let lonDeg = 0; lonDeg < 360; lonDeg += 30) {
  const line: { nx: number; ny: number; nz: number }[] = [];
  for (let latDeg = -80; latDeg <= 80; latDeg += 5) {
    line.push(getUnitVector(latDeg, lonDeg));
  }
  gridLines.push(line);
}

const coastlinePaths = worldCoastlines.map((path) =>
  path.map((coord) => {
    const lon = coord[0] * Math.PI / 180;
    const lat = coord[1] * Math.PI / 180;
    const x = -400 * Math.cos(lat) * Math.cos(lon);
    const y = 400 * Math.sin(lat);
    const z = 400 * Math.cos(lat) * Math.sin(lon);
    const len = Math.sqrt(x * x + y * y + z * z);
    return {
      nx: x / len,
      ny: y / len,
      nz: z / len
    };
  })
);

interface GlobeSectionProps {
  tag?: string;
  title?: string;
  points?: { boldText: string; normalText: string }[];
  metrics?: { num: string; label: string }[];
  showConnections?: boolean;
}

export default function GlobeSection({
  tag = "Global Network",
  title = "We're always fast, wherever you are",
  points = [
    {
      boldText: "Speed, anywhere:",
      normalText: "We route your queries through Cloudflare edge servers in over 300 cities globally. This means no matter where you are calling the models from, you will automatically connect to the closest possible entry point to reduce physical network distance."
    },
    {
      boldText: "No slow queues:",
      normalText: "Instead of sending all requests to a single main center, we route your queries directly to the nearest active GPU hardware. This avoids bottlenecks, bypasses heavy traffic, and gets you instant answers."
    },
    {
      boldText: "Always online:",
      normalText: "Our network monitors server cluster health in real-time. If a GPU goes down or is under too much load, another edge server instantly takes over the work. You won't experience lag or downtime."
    }
  ],
  metrics = [
    { num: "300+", label: "global routing cities" },
    { num: "99.99%", label: "network routing uptime" }
  ],
  showConnections = true
}: GlobeSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const showConnectionsRef = useRef(showConnections);

  useEffect(() => {
    showConnectionsRef.current = showConnections;
  }, [showConnections]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 600;
    const height = 600;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    const radius = 500;
    const cameraZ = 1500;
    const fov = 60;
    const fovRad = (fov / 2) * Math.PI / 180;
    const projScale = (height / 2) / Math.tan(fovRad);

    let rotationY = 0;
    let rotationX = 0.2; // Default tilt

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRotationY = 0;
    let startRotationX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      startRotationY = rotationY;
      startRotationX = rotationX;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - startX;
      const dy = clientY - startY;

      rotationY = startRotationY + dx * 0.007;
      rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, startRotationX - dy * 0.007));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    let animationFrameId: number | null = null;
    let isIntersecting = false;

    function animate() {
      if (!ctx || !isIntersecting) return;
      ctx.clearRect(0, 0, width, height);

      // Rotation X & Y calculation (pause auto-rotation Y during dragging)
      if (!isDragging) {
        rotationY += 0.007;
      }
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      // Transparent sphere backing (no grey border)
      const projectedRadius = radius * (projScale / cameraZ);
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, projectedRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'transparent';
      ctx.fill();
      ctx.strokeStyle = 'transparent';
      ctx.stroke();

      // Draw coastlines in fine 1.0px solid black
      coastlinePaths.forEach((path) => {
        const projectedPoints: { sx: number; sy: number; front: boolean }[] = [];

        path.forEach((pt) => {
          const scale = radius;
          const wx = pt.nx * scale;
          const wy = pt.ny * scale;
          const wz = pt.nz * scale;

          const r1x = wx * cosY - wz * sinY;
          const r1z = wx * sinY + wz * cosY;
          const r1y = wy;

          const rx = r1x;
          const ry = r1y * cosX - r1z * sinX;
          const rz = r1y * sinX + r1z * cosX;

          const eyeZ = cameraZ - rz;
          if (eyeZ <= 0) return;

          const sx = (rx * projScale) / eyeZ + width / 2;
          const sy = -(ry * projScale) / eyeZ + height / 2;

          projectedPoints.push({ sx, sy, front: rz > -100 });
        });

        if (projectedPoints.length > 1) {
          ctx.beginPath();
          let drawing = false;

          for (let i = 0; i < projectedPoints.length; i++) {
            const p = projectedPoints[i];
            if (p.front) {
              if (!drawing) {
                ctx.moveTo(p.sx, p.sy);
                drawing = true;
              } else {
                ctx.lineTo(p.sx, p.sy);
              }
            } else {
              drawing = false;
            }
          }

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      });

      if (showConnectionsRef.current) {
        const connections = [
          { from: india, to: nyc, name: "India-NYC", height: 40, color: 'rgba(125, 129, 135, 0.75)' },
          { from: nyc, to: russia, name: "NYC-Russia", height: 40, color: 'rgba(125, 129, 135, 0.75)' }
        ];

        connections.forEach((conn) => {
          const pointsOnArc: { sx: number; sy: number; depth: number }[] = [];
          const steps = 30;
          
          for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const x = conn.from.nx * (1 - t) + conn.to.nx * t;
            const y = conn.from.ny * (1 - t) + conn.to.ny * t;
            const z = conn.from.nz * (1 - t) + conn.to.nz * t;
            const len = Math.sqrt(x * x + y * y + z * z);
            if (len === 0) continue;
            const nx = x / len;
            const ny = y / len;
            const nz = z / len;

            const arcHeight = conn.height * Math.sin(t * Math.PI);
            const scale = radius + arcHeight;

            const wx = nx * scale;
            const wy = ny * scale;
            const wz = nz * scale;

            const r1x = wx * cosY - wz * sinY;
            const r1z = wx * sinY + wz * cosY;
            const r1y = wy;

            const rx = r1x;
            const ry = r1y * cosX - r1z * sinX;
            const rz = r1y * sinX + r1z * cosX;

            const eyeZ = cameraZ - rz;
            if (eyeZ <= 0) continue;

            const sx = (rx * projScale) / eyeZ + width / 2;
            const sy = -(ry * projScale) / eyeZ + height / 2;

            pointsOnArc.push({ sx, sy, depth: rz });
          }

          if (pointsOnArc.length > 1) {
            ctx.beginPath();
            ctx.moveTo(pointsOnArc[0].sx, pointsOnArc[0].sy);
            for (let k = 1; k < pointsOnArc.length; k++) {
              ctx.lineTo(pointsOnArc[k].sx, pointsOnArc[k].sy);
            }
            ctx.strokeStyle = conn.color;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            const speedFactor = 0.0008;
            const seedOffset = conn.name === "India-NYC" ? 0.0 : 0.5;
            const travelT = ((Date.now() * speedFactor) + seedOffset) % 1.0;
            
            const idx = Math.floor(travelT * (pointsOnArc.length - 1));
            const nextIdx = Math.min(idx + 1, pointsOnArc.length - 1);
            const subT = (travelT * (pointsOnArc.length - 1)) - idx;
            
            const ptA = pointsOnArc[idx];
            const ptB = pointsOnArc[nextIdx];
            
            if (ptA && ptB) {
              const dotSx = ptA.sx * (1 - subT) + ptB.sx * subT;
              const dotSy = ptA.sy * (1 - subT) + ptB.sy * subT;
              const dotDepth = ptA.depth * (1 - subT) + ptB.depth * subT;

              const normDepth = Math.max(0, Math.min(1, (dotDepth + radius) / (2 * radius)));
              const alpha = 0.2 + 0.8 * normDepth;

              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.beginPath();
              ctx.arc(dotSx, dotSy, 3.5, 0, 2 * Math.PI);
              ctx.fill();

              ctx.strokeStyle = `rgba(125, 129, 135, ${alpha * 0.5})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(dotSx, dotSy, 7, 0, 2 * Math.PI);
              ctx.stroke();
            }
          }
        });

        hubs.forEach((hub) => {
          const wx = hub.vec.nx * radius;
          const wy = hub.vec.ny * radius;
          const wz = hub.vec.nz * radius;

          const r1x = wx * cosY - wz * sinY;
          const r1z = wx * sinY + wz * cosY;
          const r1y = wy;

          const rx = r1x;
          const ry = r1y * cosX - r1z * sinX;
          const rz = r1y * sinX + r1z * cosX;

          const eyeZ = cameraZ - rz;
          if (eyeZ <= 0) return;

          const sx = (rx * projScale) / eyeZ + width / 2;
          const sy = -(ry * projScale) / eyeZ + height / 2;

          const normDepth = Math.max(0, Math.min(1, (rz + radius) / (2 * radius)));
          const alpha = 0.2 + 0.8 * normDepth;

          if (rz > -100) {
            ctx.fillStyle = `rgba(125, 129, 135, ${alpha})`;
            ctx.fillRect(sx - 4, sy - 4, 8, 8);

            let offsetY = -8;
            hub.lines.forEach((line, lineIdx) => {
              ctx.fillStyle = lineIdx === 0 
                ? `rgba(255, 255, 255, ${alpha * 0.95})` 
                : `rgba(161, 161, 170, ${alpha * 0.75})`;
              ctx.font = lineIdx === 0
                ? `700 9.5px "SF Pro Text", -apple-system, BlinkMacSystemFont, monospace, sans-serif`
                : `500 8.5px "SF Pro Text", -apple-system, BlinkMacSystemFont, monospace, sans-serif`;
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.fillText(`  ${line}`, sx + 6, sy + offsetY);
              offsetY += 10;
            });
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        if (!animationFrameId) {
          animate();
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    }, {
      root: null,
      rootMargin: '200px',
      threshold: 0
    });

    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, []);

  return (
    <section className="globe-showcase-section">
      <div className="globe-section-wrapper">
        <div className="globe-text-col">
          <span className="globe-section-tag">{tag}</span>
          <h2 className="globe-section-title">{title}</h2>

          <div className="globe-points-list">
            {points.map((pt, idx) => (
              <div key={idx} className="globe-point-item">
                <span className="globe-point-bullet">•</span>
                <p className="globe-point-text">
                  <strong>{pt.boldText}</strong> {pt.normalText}
                </p>
              </div>
            ))}
          </div>

          <div className="globe-metrics">
            {metrics.map((m, idx) => (
              <div key={idx} className="globe-metric-item">
                <span className="globe-metric-num">{m.num}</span>
                <span className="globe-metric-lbl">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="globe-canvas-col">
          <canvas ref={canvasRef} className="globe-canvas" />
        </div>
      </div>
    </section>
  );
}
