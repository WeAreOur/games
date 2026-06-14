'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getNoteFrequency } from '../lib/patterns';

interface KeyboardInputProps {
  onInput?: (input: 0 | 1, key: string, time: number) => void;
  isListening?: boolean;
  currentTime?: number;
  patternString?: string;
}

// Map of keys to input numbers
const KEY_MAP: Record<string, 0 | 1> = {
  f: 0,
  j: 1,
};

const KEY_LABELS: Record<0 | 1, string> = {
  0: 'F',
  1: 'J',
};

// Input indices to note mapping (can be customized per pattern)
const INPUT_NOTES: Record<0 | 1, string> = {
  0: 'c3', // F key plays c3
  1: 'e3', // J key plays e3
};

export const KeyboardInput: React.FC<KeyboardInputProps> = ({
  onInput,
  isListening = false,
  currentTime = 0,
  patternString = '',
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const keysHeldRef = useRef<Set<string>>(new Set());
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!isListening) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const input = KEY_MAP[key];

      if (input !== undefined && !keysHeldRef.current.has(key)) {
        e.preventDefault();
        keysHeldRef.current.add(key);
        setPressedKeys((prev) => new Set([...prev, key]));
        onInput?.(input, key.toUpperCase(), currentTime);
        playSound(input);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in KEY_MAP) {
        e.preventDefault();
        keysHeldRef.current.delete(key);
        setPressedKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      keysHeldRef.current.clear();
    };
  }, [isListening, currentTime, onInput]);

  const playSound = (input: 0 | 1) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const noteName = INPUT_NOTES[input];
    const frequency = getNoteFrequency(noteName);

    // Use a short note duration for keyboard feedback
    const duration = 0.2; // 200ms
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = frequency;
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '1rem 0' }}>
      {(['f', 'j'] as const).map((key) => {
        const input = KEY_MAP[key];
        const isPressed = pressedKeys.has(key);

        return (
          <button
            key={key}
            disabled={!isListening}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              fontWeight: isPressed ? 'bold' : 'normal',
              borderRadius: '8px',
              border: '2px solid #ddd',
              background: isPressed ? '#667eea' : '#f5f5f5',
              color: isPressed ? 'white' : '#333',
              cursor: isListening ? 'pointer' : 'not-allowed',
              transition: 'all 0.1s ease',
              transform: isPressed ? 'scale(0.95)' : 'scale(1)',
              opacity: isListening ? 1 : 0.5,
            }}
            onMouseDown={() => {
              if (isListening && !keysHeldRef.current.has(key)) {
                keysHeldRef.current.add(key);
                setPressedKeys((prev) => new Set([...prev, key]));
                onInput?.(input, key.toUpperCase(), currentTime);
                playSound(input);
              }
            }}
            onMouseUp={() => {
              keysHeldRef.current.delete(key);
              setPressedKeys((prev) => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
              });
            }}
            onMouseLeave={() => {
              keysHeldRef.current.delete(key);
              setPressedKeys((prev) => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
              });
            }}
          >
            {KEY_LABELS[input]}
          </button>
        );
      })}
    </div>
  );
};
