'use client';

import React, { useEffect, useRef, useState } from 'react';
import { parsePattern } from '../lib/patterns';

interface PatternPlayerProps {
  patternString: string;
  autoPlay?: boolean;
  onPlayStart?: () => void;
  onPlaybackEnd?: (durationMs: number) => void;
  triggerPlay?: number; // Incrementing number to trigger play
}

export const PatternPlayer: React.FC<PatternPlayerProps> = ({
  patternString,
  autoPlay = false,
  onPlayStart,
  onPlaybackEnd,
  triggerPlay = 0,
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<number, OscillatorNode>>(new Map());
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Initialize audio context on first interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
    };

    // Listen for user interaction to initialize audio
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const playPattern = async () => {
    if (!audioContextRef.current) {
      await new Promise((resolve) => {
        const handler = () => {
          audioContextRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          window.removeEventListener('click', handler);
          resolve(undefined);
        };
        window.addEventListener('click', handler);
      });
    }

    if (!audioContextRef.current || isPlaying) return;

    setIsPlaying(true);
    onPlayStart?.();

    const parsed = parsePattern(patternString);

    // Schedule all notes
    for (const event of parsed.events) {
      // Schedule note on
      timeoutIdsRef.current.push(
        setTimeout(() => {
          if (!audioContextRef.current) return;

          const osc = audioContextRef.current.createOscillator();
          const gain = audioContextRef.current.createGain();

          osc.frequency.value = event.frequency;
          osc.type = 'sine';

          osc.connect(gain);
          gain.connect(audioContextRef.current.destination);

          gain.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);

          osc.start(audioContextRef.current.currentTime);
          osc.stop(audioContextRef.current.currentTime + event.durationMs / 1000);

          oscillatorsRef.current.set(event.startTime, osc);
        }, event.startTime)
      );
    }

    // Schedule completion
    timeoutIdsRef.current.push(
      setTimeout(() => {
        setIsPlaying(false);
        onPlaybackEnd?.(parsed.totalDurationMs);
      }, parsed.totalDurationMs)
    );
  };

  const stopPattern = () => {
    if (!isPlaying) return;

    // Clear all pending timeouts
    timeoutIdsRef.current.forEach((id) => clearTimeout(id));
    timeoutIdsRef.current = [];

    // Stop all oscillators
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    oscillatorsRef.current.clear();

    setIsPlaying(false);
  };

  useEffect(() => {
    if (autoPlay && !isPlaying) {
      playPattern();
    }
  }, [autoPlay, patternString]);

  useEffect(() => {
    if (triggerPlay > 0 && !isPlaying) {
      playPattern();
    }
  }, [triggerPlay]);

  return (
    <div className="flex gap-2">
      <button
        onClick={playPattern}
        disabled={isPlaying}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {isPlaying ? 'Playing...' : 'Play'}
      </button>
      <button
        onClick={stopPattern}
        disabled={!isPlaying}
        className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
      >
        Stop
      </button>
    </div>
  );
};
