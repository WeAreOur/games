import React, { useEffect, useRef, useState } from "react";
import "./countdown-bar.css";

interface CountdownBarProps {
  onTimeout?: () => void;
  duration?: number; // in milliseconds
}

class CountdownEmitter extends EventTarget {
  pause() {
    this.dispatchEvent(new Event("pause"));
  }
  reset() {
    this.dispatchEvent(new Event("reset"));
  }
}

const emitter = new CountdownEmitter();
export const triggerTimeoutPause = () => emitter.pause();
export const triggerTimeoutReset = () => emitter.reset();

export const CountdownBar: React.FC<CountdownBarProps> = ({ onTimeout, duration = 30000 }) => {
  const [percent, setPercent] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedAtPauseRef = useRef<number>(0);

  const startCountdown = () => {
    setPercent(100);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    elapsedAtPauseRef.current = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current + elapsedAtPauseRef.current;
      const newPercent = Math.max(0, 100 - (elapsed / duration) * 100);
      setPercent(newPercent);

      if (newPercent <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        onTimeout?.();
      }
    }, 50);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      onTimeout?.();
    }, duration);
  };

  const handlePause = () => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    elapsedAtPauseRef.current += Date.now() - startTimeRef.current;
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    startCountdown();
  };

  useEffect(() => {
    emitter.addEventListener("pause", handlePause);
    emitter.addEventListener("reset", handleReset);
    return () => {
      emitter.removeEventListener("pause", handlePause);
      emitter.removeEventListener("reset", handleReset);
    };
  }, []);

  useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [duration, onTimeout]);

  return <div className="countdown-bar" style={{ width: `${percent}%` }} />;
};
