/**
 * Music Echo Game Types
 */

/** Parsed event from pattern notation */
export interface PatternEvent {
  input: 0 | 1; // 0 = left (F key), 1 = right (J key)
  note: string; // e.g., "c3", "e3"
  divisor: number; // 1/2/4/8/16
  startTime: number; // ms from pattern start (calculated at 120 BPM)
  durationMs: number; // duration in milliseconds
  frequency: number; // Hz for audio playback
}

/** Parsed pattern ready for playback or visualization */
export interface ParsedPattern {
  events: PatternEvent[];
  totalDurationMs: number;
  notationString: string; // original pattern string
}

/** User input to compare against expected */
export interface UserInput {
  input: 0 | 1;
  startTime: number;
  durationMs: number;
}
