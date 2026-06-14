'use client';

import React, { useEffect, useRef, useState } from 'react';
import { parsePattern } from '../lib/patterns';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';

interface PatternVisualizerProps {
  patternString: string;
  isPlaying?: boolean;
  currentTime?: number;
}

// Map note names to VexFlow format (treble clef range: C4-B5)
const NOTE_MAP: Record<string, string> = {
  c3: 'c/4',
  d3: 'd/4',
  e3: 'e/4',
  f3: 'f/4',
  g3: 'g/4',
  a3: 'a/4',
  b3: 'b/4',
};

// Map divisor to note duration
const DURATION_MAP: Record<number, string> = {
  1: 'w', // whole
  2: 'h', // half
  4: 'q', // quarter
  8: '8', // eighth
  16: '16', // sixteenth
};

export const PatternVisualizer: React.FC<PatternVisualizerProps> = ({
  patternString,
  isPlaying = false,
  currentTime = 0,
}) => {
  const parsed = parsePattern(patternString);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<any>(null);
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isPlaying) {
      setActiveNotes(new Set());
      return;
    }

    const active = new Set<number>();
    for (let i = 0; i < parsed.events.length; i++) {
      const event = parsed.events[i];
      if (currentTime >= event.startTime && currentTime < event.startTime + event.durationMs) {
        active.add(i);
      }
    }
    setActiveNotes(active);
  }, [currentTime, isPlaying, patternString]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Clear all previous content
    canvasRef.current.innerHTML = '';

    try {
      // Group events by input (voice)
      const input0Events = parsed.events.filter((e) => e.input === 0);
      const input1Events = parsed.events.filter((e) => e.input === 1);

      // Create separate staves for each hand if both have notes
      if (input0Events.length > 0) {
        renderStave(canvasRef.current, 'input0', 'Input 0 (F key)', input0Events, activeNotes, parsed.events);
      }

      if (input1Events.length > 0) {
        renderStave(canvasRef.current, 'input1', 'Input 1 (J key)', input1Events, activeNotes, parsed.events);
      }
    } catch (error) {
      console.error('Error rendering staff:', error);
    }
  }, [parsed, activeNotes, patternString]);

  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg" style={{ background: '#f5f5f5' }}>
      <h3 className="text-lg font-bold text-gray-900">Musical Notation</h3>
      <div ref={canvasRef} className="overflow-x-auto" />
      <div className="text-xs text-gray-500">
        <p>Total duration: {parsed.totalDurationMs}ms</p>
        {isPlaying && <p>Current time: {currentTime}ms</p>}
      </div>
    </div>
  );
};

function renderStave(
  container: HTMLElement,
  id: string,
  label: string,
  events: any[],
  activeNotes: Set<number>,
  allEvents: any[]
) {
  // Create wrapper for this stave
  const staveWrapper = document.createElement('div');
  staveWrapper.id = `stave-${id}`;
  staveWrapper.className = 'mb-8';

  const labelElem = document.createElement('div');
  labelElem.className = 'text-sm font-semibold text-gray-700 mb-2';
  labelElem.textContent = label;
  staveWrapper.appendChild(labelElem);

  const canvas = document.createElement('div');
  canvas.id = `canvas-${id}`;
  staveWrapper.appendChild(canvas);
  container.appendChild(staveWrapper);

  // Create renderer with appropriate width
  const width = Math.max(400, events.length * 100);
  const renderer = new Renderer(canvas, Renderer.Backends.SVG);
  renderer.resize(width, 150);

  const context = renderer.getContext();
  context.setFont('Arial', 10);

  // Create stave
  const stave = new Stave(10, 40, width - 20);
  stave.addClef('treble');
  stave.addTimeSignature('4/4');
  stave.setContext(context).draw();

  // Create notes from events
  const notes = events
    .map((event, idx) => {
      const globalIndex = allEvents.findIndex(
        (e) => e.input === event.input && e.startTime === event.startTime && e.note === event.note
      );
      const isActive = activeNotes.has(globalIndex);

      const vexNote = new StaveNote({
        keys: [NOTE_MAP[event.note] || 'c/4'],
        duration: DURATION_MAP[event.divisor] || 'q',
        clef: 'treble',
      });

      // Color active notes purple, others black
      if (isActive) {
        vexNote.setStyle({
          fillStyle: '#667eea',
          strokeStyle: '#667eea',
        });
      } else {
        vexNote.setStyle({
          fillStyle: '#000000',
          strokeStyle: '#000000',
        });
      }

      return vexNote;
    });

  // Create voice and add notes
  const voice = new Voice({
    num_beats: 4,
    beat_value: 4,
  });

  voice.addTickables(notes);

  // Format and draw
  const formatter = new Formatter();
  formatter.joinVoices([voice]).format([voice], width - 40);

  voice.draw(context, stave);
}

