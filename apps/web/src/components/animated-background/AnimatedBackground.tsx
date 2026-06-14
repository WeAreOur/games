import React, { useEffect, useRef } from "react";
import "./animated-background.css";

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match window
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const animate = (timestamp: number) => {
      timeRef.current = timestamp / 1000; // Convert to seconds

      // Clear with base gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#e8d7f1");
      gradient.addColorStop(1, "#f1e8d7");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add wave effect with reduced opacity and blur
      const waveAmplitude = 80;
      const waveFrequency = 0.008;

      // Apply blur to waves
      ctx.filter = "blur(8px)";

      for (let i = 0; i < 4; i++) {
        const hue = 280 + i * 15; // Purple/pink range
        ctx.fillStyle = `hsla(${hue}, 70%, 65%, ${0.08 - i * 0.015})`; // Increased opacity
        
        // Different speed for each wave
        const waveSpeed = timeRef.current * (0.8 + i * 0.4);
        
        const yOffset =
          canvas.height * 0.25 +
          i * 120 +
          Math.sin(waveSpeed + i * 0.5) * waveAmplitude * 1.5;

        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 8) {
          const y =
            yOffset +
            Math.sin((x + timeRef.current * (50 + i * 20)) * waveFrequency + i) *
              waveAmplitude;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fill();
      }

      // Reset filter for next frame
      ctx.filter = "none";

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="animated-background-canvas" />;
};
