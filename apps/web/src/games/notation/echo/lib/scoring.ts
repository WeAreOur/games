/**
 * Scoring logic for Music Echo Game
 * - 5 points for correct timing (starting note within tolerance)
 * - 5 points for correct duration (holding note for correct length)
 */

import { Note, UserInput, NoteMatch, PlaybackNote } from "./types";

const TIMING_TOLERANCE_MS = 150; // ±150ms tolerance for note start
const DURATION_TOLERANCE_RATIO = 0.2; // ±20% tolerance for duration

/**
 * Calculate how well a user's input matched an expected note
 */
export function scoreUserInput(
  expected: PlaybackNote,
  actual: UserInput | null
): NoteMatch | null {
  if (!actual) {
    // User didn't play this note
    return null;
  }

  // Check if it's the right hand
  if (actual.hand !== expected.note.hand) {
    return null;
  }

  // Calculate timing score (0-5)
  const timingDiff = Math.abs(actual.startTime - expected.startTime);
  const timingScore = Math.max(
    0,
    5 - Math.floor((timingDiff / TIMING_TOLERANCE_MS) * 5)
  );

  // Calculate duration score (0-5)
  const actualDuration = actual.endTime - actual.startTime;
  const expectedDuration = expected.endTime - expected.startTime;
  const durationDiff = Math.abs(actualDuration - expectedDuration);
  const durationTolerance = expectedDuration * DURATION_TOLERANCE_RATIO;
  const durationScore = Math.max(
    0,
    5 - Math.floor((durationDiff / durationTolerance) * 5)
  );

  return {
    expected,
    actual,
    timingScore: Math.round(timingScore),
    durationScore: Math.round(durationScore),
  };
}

/**
 * Calculate total score for a round
 */
export function calculateRoundScore(matches: NoteMatch[]): number {
  return matches.reduce((sum, match) => sum + match.timingScore + match.durationScore, 0);
}

/**
 * Get max possible score for a pattern (per note: 5 timing + 5 duration)
 */
export function getMaxPatternScore(noteCount: number): number {
  return noteCount * 10; // 5 for timing + 5 for duration per note
}
