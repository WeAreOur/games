/**
 * Pattern Notation System for Echo Game
 * 
 * Musical tablature-like format with two input columns (left/right)
 * Each line represents events happening at the same time.
 * 
 * Format: "[left notes]|[right notes]"
 * - Either side can be empty (no event on that input at this time)
 * - note,divisor: pitch (c3, d3, e3, g3, etc.) and duration (1/2/4/8/16)
 * - '|' separates input 0 (left/F key) from input 1 (right/J key)
 * - '\n' separates sequential events in time
 * 
 * Examples:
 * c3,1|       <- input 0: c3 whole, input 1: no event
 * |c3,1       <- input 0: no event, input 1: c3 whole
 * 
 * Current: 120 BPM (whole note = 2000ms)
 */

import { PatternEvent, ParsedPattern } from "./types";

// At 120 BPM, a whole note is 2000ms
const BASE_DURATION_MS = 2000;

/**
 * Get duration in ms for a divisor (1/2/4/8/16)
 */
function getDurationMs(divisor: number): number {
  return BASE_DURATION_MS / divisor;
}

/**
 * Get frequency for a note name (e.g., "c3" -> 130.81 Hz)
 * Uses equal temperament tuning based on A4 = 440 Hz
 */
export function getNoteFrequency(noteName: string): number {
  const noteToSemitone: Record<string, number> = {
    c: -9, d: -7, e: -5, f: -4, g: -2, a: 0, b: 2,
  };
  
  const match = noteName.toLowerCase().match(/([a-g])(\d)/);
  if (!match) return 440;
  
  const note = match[1];
  const octave = parseInt(match[2]);
  
  const semitone = (noteToSemitone[note] || 0) + (octave - 4) * 12;
  return 440 * Math.pow(2, semitone / 12);
}

/**
 * Parse pattern notation string into events
 * Shared utility for player and visualizer
 */
export function parsePattern(notation: string): ParsedPattern {
  const lines = notation.trim().split("\n");
  const events: PatternEvent[] = [];
  let currentTime = 0;

  for (const line of lines) {
    const parts = line.split("|");
    const leftPart = parts[0]?.trim() || "";
    const rightPart = parts[1]?.trim() || "";
    let maxLineDuration = 0;

    // Parse input 0 (left)
    if (leftPart) {
      const [noteName, divisorStr] = leftPart.split(",").map(p => p.trim());
      const divisor = parseInt(divisorStr);
      
      if (noteName && divisor > 0 && noteName !== "s") {
        const durationMs = getDurationMs(divisor);
        const frequency = getNoteFrequency(noteName);
        
        events.push({
          input: 0,
          note: noteName,
          divisor,
          startTime: currentTime,
          durationMs,
          frequency,
        });
        
        maxLineDuration = Math.max(maxLineDuration, durationMs);
      }
    }

    // Parse input 1 (right)
    if (rightPart) {
      const [noteName, divisorStr] = rightPart.split(",").map(p => p.trim());
      const divisor = parseInt(divisorStr);
      
      if (noteName && divisor > 0 && noteName !== "s") {
        const durationMs = getDurationMs(divisor);
        const frequency = getNoteFrequency(noteName);
        
        events.push({
          input: 1,
          note: noteName,
          divisor,
          startTime: currentTime,
          durationMs,
          frequency,
        });
        
        maxLineDuration = Math.max(maxLineDuration, durationMs);
      }
    }

    currentTime += maxLineDuration;
  }

  return {
    events,
    totalDurationMs: currentTime,
    notationString: notation,
  };
}

/**
 * Pattern library by level
 */
const PATTERN_LIBRARY: Record<number, string[]> = {
  1: [
    "c3,1|",
    "g3,1|",
    "e3,1|",
    "c3,2|\nc3,2|",
    "e3,2|\ng3,2|",
    "g3,4|\ne3,4|\ng3,4|\ne3,4|",
  ],
  2: [
    "c3,1|c3,1",
    "c3,2|c3,2\nc3,2|c3,2",
    "c3,4|c3,4\ne3,4|e3,4\ng3,4|g3,4\ne3,4|e3,4",
    "|e3,1\ne3,1|",
    "|g3,2\ng3,2|",
  ],
  3: [
    "c3,1|\n|g3,2",
    "c3,2|\nc3,2|e3,2\n|e3,2",
    "c3,4|\ne3,4|g3,4\n|g3,4\ng3,4|",
  ],
};

/**
 * Get a random pattern string for the given level
 */
export function getRandomPattern(level: number): string {
  const patterns = PATTERN_LIBRARY[level] ?? PATTERN_LIBRARY[1];
  return patterns[Math.floor(Math.random() * patterns.length)];
}

/**
 * Get all patterns for a level
 */
export function getAllPatterns(level: number): string[] {
  return PATTERN_LIBRARY[level] ?? PATTERN_LIBRARY[1];
}
