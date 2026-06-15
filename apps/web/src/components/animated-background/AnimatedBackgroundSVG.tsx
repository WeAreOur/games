import React from "react";
import "./animated-background-svg.css";

export const AnimatedBackgroundSVG: React.FC = () => {
  return (
    <svg
      className="animated-background-svg"
      viewBox="0 0 1200 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#e8d7f1", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#f1e8d7", stopOpacity: 1 }} />
        </linearGradient>

        <filter id="waveBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>

      {/* Base gradient */}
      <rect width="1200" height="1000" fill="url(#bgGradient)" />

      {/* Wave layers - proportional to viewport, each ~200-250px tall */}
      <path
        className="wave wave-1"
        d="M0,350 Q150,300 300,350 T600,350 T900,350 T1200,350 L1200,1000 L0,1000 Z"
        opacity="0.1"
        fill="#9b6db5"
        filter="url(#waveBlur)"
      />

      <path
        className="wave wave-2"
        d="M0,450 Q200,380 400,450 T800,450 T1200,450 L1200,1000 L0,1000 Z"
        opacity="0.1"
        fill="#ae7fc2"
        filter="url(#waveBlur)"
      />

      <path
        className="wave wave-3"
        d="M0,570 Q180,500 360,570 T720,570 T1080,570 T1200,570 L1200,1000 L0,1000 Z"
        opacity="0.15"
        fill="#c197ce"
        filter="url(#waveBlur)"
      />

      <path
        className="wave wave-4"
        d="M0,700 Q200,630 400,700 T800,700 T1200,700 L1200,1000 L0,1000 Z"
        opacity="0.4"
        fill="#d4b0da"
        filter="url(#waveBlur)"
      />
    </svg>
  );
};
