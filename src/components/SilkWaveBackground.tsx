import React, { useEffect, useRef, useState } from 'react';

/**
 * SilkWaveBackground Component
 * Renders the exact Royal Cobalt Blue Silk / Satin liquid fabric wave texture
 * and bakes its SVG Gaussian blur pass once into a lightweight 1440x900 canvas
 * so zooming never re-rasterizes the full-screen SVG filter.
 */
export const SilkWaveBackground: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bakedReady, setBakedReady] = useState(false);

  useEffect(() => {
    const svgEl = svgRef.current;
    const canvasEl = canvasRef.current;
    if (!svgEl || !canvasEl || typeof XMLSerializer === 'undefined') return;

    let cancelled = false;
    let objectUrl: string | null = null;

    try {
      const serialized = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
      objectUrl = URL.createObjectURL(blob);

      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
        if (cancelled) return;
        const ctx = canvasEl.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);
        setBakedReady(true);
      };
      img.onerror = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };
      img.src = objectUrl;
    } catch {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    }

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  return (
    <div className="silk-wave-bg-container" aria-hidden="true">
      <canvas
        ref={canvasRef}
        width={1440}
        height={900}
        className="silk-wave-svg"
        style={bakedReady ? undefined : { opacity: 0, pointerEvents: 'none' }}
      />

      {!bakedReady && (
        <svg
          ref={svgRef}
          className="silk-wave-svg"
          width={1440}
          height={900}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Base Silk Radial Shading */}
            <radialGradient id="silk-spot-1" cx="30%" cy="25%" r="68%">
              <stop offset="0%" stopColor="#1E6BFF" stopOpacity="0.82" />
              <stop offset="48%" stopColor="#0047FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#001F8A" stopOpacity="1" />
            </radialGradient>

            <radialGradient id="silk-spot-2" cx="76%" cy="66%" r="72%">
              <stop offset="0%" stopColor="#2977FF" stopOpacity="0.72" />
              <stop offset="52%" stopColor="#003EE0" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#001466" stopOpacity="1" />
            </radialGradient>

            {/* Silk Fold Gradients */}
            <linearGradient id="wave-fold-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#001254" stopOpacity="0.72" />
              <stop offset="32%" stopColor="#003CE0" stopOpacity="0.34" />
              <stop offset="52%" stopColor="#4A8DFF" stopOpacity="0.68" />
              <stop offset="72%" stopColor="#002DB3" stopOpacity="0.46" />
              <stop offset="100%" stopColor="#000E42" stopOpacity="0.82" />
            </linearGradient>

            <linearGradient id="wave-fold-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5CA0FF" stopOpacity="0.62" />
              <stop offset="28%" stopColor="#0047FF" stopOpacity="0.38" />
              <stop offset="58%" stopColor="#001A7A" stopOpacity="0.82" />
              <stop offset="78%" stopColor="#0038D6" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#458CFF" stopOpacity="0.54" />
            </linearGradient>

            <linearGradient id="wave-sheen" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#70B0FF" stopOpacity="0.48" />
              <stop offset="50%" stopColor="#0047FF" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#001878" stopOpacity="0.68" />
            </linearGradient>

            <filter id="silk-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="35" />
            </filter>
          </defs>

          {/* Base Solid Royal Blue */}
          <rect width="100%" height="100%" fill="#0035D1" />
          <rect width="100%" height="100%" fill="url(#silk-spot-1)" />
          <rect width="100%" height="100%" fill="url(#silk-spot-2)" />

          {/* Original Softly-Blurred Silk Ripple Folds */}
          <g filter="url(#silk-blur)" opacity="0.95">
            <path
              d="M-200,-100 C300,150 200,450 700,500 C1100,540 1200,300 1600,600 L1600,1100 L-200,1100 Z"
              fill="url(#wave-fold-1)"
            />

            <path
              d="M-100,400 C400,200 650,550 1100,250 C1350,80 1500,200 1650,-50 L1650,-200 L-100,-200 Z"
              fill="url(#wave-fold-2)"
            />

            <path
              d="M200,-100 C500,350 450,700 950,750 C1350,790 1400,500 1700,900 L1700,1100 L200,1100 Z"
              fill="url(#wave-sheen)"
              opacity="0.7"
            />

            <ellipse
              cx="650"
              cy="380"
              rx="560"
              ry="290"
              transform="rotate(-25 650 380)"
              fill="#3B85FF"
              opacity="0.3"
            />

            <path
              d="M-150,150 Q450,550 850,300 T1600,750"
              stroke="#000E4A"
              strokeWidth="80"
              strokeLinecap="round"
              fill="none"
              opacity="0.45"
            />

            <path
              d="M-50,50 Q550,450 950,200 T1650,650"
              stroke="#6BB0FF"
              strokeWidth="36"
              strokeLinecap="round"
              fill="none"
              opacity="0.35"
            />
          </g>
        </svg>
      )}

      {/* CSS Ambient Light Shimmer Overlay */}
      <div className="silk-sheen-overlay"></div>
    </div>
  );
};
