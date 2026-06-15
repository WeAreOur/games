import React, { useEffect, useRef, useCallback } from "react";
import "./confetti-svg.css";

// Simple callback-based event system
interface ConfettiListener {
  (): void;
}

const listeners = new Set<ConfettiListener>();

export const triggerConfetti = () => {
  listeners.forEach((listener) => listener());
};

export const addConfettiListener = (listener: ConfettiListener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const ConfettiSVG: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleCountRef = useRef(0);

  const handleTrigger = useCallback(() => {
    if (!containerRef.current) return;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "confetti-svg");
    svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    svg.setAttribute("width", String(window.innerWidth));
    svg.setAttribute("height", String(window.innerHeight));
    svg.style.position = "fixed";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "1";

    const particles: any[] = [];
    particleCountRef.current++;

    // Create 50 confetti particles as circles
    for (let i = 0; i < 50; i++) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const x = Math.random() * window.innerWidth;
      const y = -20;
      const hue = Math.random() * 360;
      const duration = Math.random() * 1 + 1.5; // 1.5-2.5 seconds
      const delay = Math.random() * 0.1;
      const drift = (Math.random() - 0.5) * 100; // -50 to +50px horizontal drift

      circle.setAttribute("cx", String(x));
      circle.setAttribute("cy", String(y));
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", `hsl(${hue}, 100%, 50%)`);
      circle.setAttribute("class", "particle-fall");
      circle.style.setProperty("--duration", `${duration}s`);
      circle.style.setProperty("--delay", `${delay}s`);
      circle.style.setProperty("--drift", `${drift}px`);

      svg.appendChild(circle);
      particles.push(circle);
    }

    containerRef.current.appendChild(svg);

    // Remove SVG after animation completes
    const maxDuration = 2.5 + 0.1; // Max duration (2.5s) + max delay (0.1s) + buffer
    setTimeout(() => {
      if (containerRef.current?.contains(svg)) {
        containerRef.current.removeChild(svg);
      }
    }, maxDuration * 1000);
  }, []);

  useEffect(() => addConfettiListener(handleTrigger), [handleTrigger]);

  return <div ref={containerRef} style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />;
};
