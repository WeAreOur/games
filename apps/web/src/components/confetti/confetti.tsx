import React, { useEffect, useRef } from "react";

// Singleton event emitter for confetti triggers
class ConfettiEmitter extends EventTarget {
  trigger() {
    this.dispatchEvent(new Event("trigger"));
  }
}

const emitter = new ConfettiEmitter();
export const triggerConfetti = () => emitter.trigger();

export const Confetti: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleTrigger = () => {
      if (!containerRef.current) return;

      const canvas = document.createElement("canvas");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "9999";
      containerRef.current.appendChild(canvas);

      const ctx = canvas.getContext("2d")!;
      const particles: any[] = [];

      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: -10,
          vx: (Math.random() - 0.5) * 8,
          vy: Math.random() * 4 + 4,
          gravity: 0.1,
          life: 1,
          decay: Math.random() * 0.01 + 0.005,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let hasActive = false;

        particles.forEach((p) => {
          if (p.life > 0) {
            hasActive = true;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life -= p.decay;

            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 5, 5);
          }
        });

        if (hasActive) {
          requestAnimationFrame(animate);
        } else {
          containerRef.current?.removeChild(canvas);
        }
      };

      animate();
    };

    emitter.addEventListener("trigger", handleTrigger);
    return () => emitter.removeEventListener("trigger", handleTrigger);
  }, []);

  return <div ref={containerRef} style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />;
};
