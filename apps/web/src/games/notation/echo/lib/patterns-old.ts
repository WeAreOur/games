/**
 * Pattern and Level Definitions for Music Echo Game
 * 4/4 bar at 120 BPM:
 * - Whole note: 2000ms
 * - Half note: 1000ms
 * - Quarter note: 500ms
 * - Eighth note: 250ms
 * - Sixteenth note: 125ms
 */

import { Note, Pattern, Level, NoteDuration } from "./types";

const DURATION_MAP: Record<NoteDuration, number> = {
  whole: 2000,
  half: 1000,
  quarter: 500,
  eighth: 250,
  sixteenth: 125,
};
const NOTE_DURATIONS = Object.keys(DURATION_MAP) as NoteDuration[];
const HANDS: ("left" | "right" | "both")[] = ["left", "right", "both"];

/**
 * Generate basic note pattern from duration array
 */
function generatePattern(
  durations: NoteDuration[],
  hand: "left" | "right" | "both"
): Pattern {
  let currentTime = 0;
  const notes: Note[] = [];

  const hands = hand === "both" ? ["left", "right"] : [hand];
  const activeDurations = hand === "both" ? durations : durations;

  if (hand === "both") {
    // Both hands play identical pattern
    for (const duration of durations) {
      const durationMs = DURATION_MAP[duration];
      notes.push({ hand: "left", duration, durationMs });
      notes.push({ hand: "right", duration, durationMs });
      currentTime += durationMs;
    }
  } else {
    // Single hand
    for (const duration of durations) {
      const durationMs = DURATION_MAP[duration];
      notes.push({ hand, duration, durationMs });
      currentTime += durationMs;
    }
  }

  return {
    notes,
    hand,
    durationMs: currentTime,
  };
}

/**
 * Level 1: Single hand, various note durations
 */
// const LEVEL_1_PATTERNS: Pattern[] = [
//   generatePattern(["whole"], "left"),
//   generatePattern(["whole"], "right"),
//   generatePattern(["half", "half"], "left"),
//   generatePattern(["half", "half"], "right"),
//   generatePattern(["quarter", "quarter", "quarter", "quarter"], "left"),
//   generatePattern(["quarter", "quarter", "quarter", "quarter"], "right"),
//   generatePattern(["eighth", "eighth", "eighth", "eighth"], "left"),
//   generatePattern(["eighth", "eighth", "eighth", "eighth"], "right"),
//   generatePattern(["sixteenth", "sixteenth", "sixteenth", "sixteenth"], "left"),
//   generatePattern(["sixteenth", "sixteenth", "sixteenth", "sixteenth"], "right"),
// ];

/**
 * Level 2: Both hands, same pattern
 */
// const LEVEL_2_PATTERNS: Pattern[] = [
//   generatePattern(["whole"], "both"),
//   generatePattern(["half", "half"], "both"),
//   generatePattern(["quarter", "quarter", "quarter", "quarter"], "both"),
//   generatePattern(["eighth", "eighth", "eighth", "eighth"], "both"),
//   generatePattern(
//     ["sixteenth", "sixteenth", "sixteenth", "sixteenth"],
//     "both"
//   ),
// ];

/**
 * Level 3: Both hands, different patterns
 */
function generateLevel3Pattern(
  leftDurations: NoteDuration[],
  rightDurations: NoteDuration[]
): Pattern {
  const notes: Note[] = [];
  let leftTime = 0;
  let rightTime = 0;

  // Interleave notes based on timing
  const leftNotes = leftDurations.map((dur) => ({
    hand: "left" as const,
    duration: dur,
    durationMs: DURATION_MAP[dur],
  }));
  const rightNotes = rightDurations.map((dur) => ({
    hand: "right" as const,
    duration: dur,
    durationMs: DURATION_MAP[dur],
  }));

  // Sort by when they should play
  let leftIdx = 0;
  let rightIdx = 0;

  while (leftIdx < leftNotes.length || rightIdx < rightNotes.length) {
    if (leftIdx < leftNotes.length && leftTime <= rightTime) {
      notes.push(leftNotes[leftIdx]);
      leftTime += leftNotes[leftIdx].durationMs;
      leftIdx++;
    } else if (rightIdx < rightNotes.length) {
      notes.push(rightNotes[rightIdx]);
      rightTime += rightNotes[rightIdx].durationMs;
      rightIdx++;
    }
  }

  return {
    notes,
    hand: "both",
    durationMs: Math.max(leftTime, rightTime),
  };
}

// const LEVEL_3_PATTERNS: Pattern[] = [
//   generateLevel3Pattern(["whole"], ["half", "half"]),
//   generateLevel3Pattern(["half", "half"], ["quarter", "quarter", "quarter", "quarter"]),
//   generateLevel3Pattern(
//     ["quarter", "quarter", "quarter", "quarter"],
//     ["eighth", "eighth", "eighth", "eighth"]
//   ),
// ];

/**
 * Get random pattern for a given level
 */
export function getRandomPattern(level: number): Pattern {
  let patterns: Pattern[] = [];

  if (level === 1) {
    // patterns = LEVEL_1_PATTERNS;
  } else if (level === 2) {
    // patterns = LEVEL_2_PATTERNS;
  } else if (level === 3) {
    // patterns = LEVEL_3_PATTERNS;
  } else {
    // Fallback to level 1 for invalid levels
    // patterns = LEVEL_1_PATTERNS;
  }

  // if (patterns.length === 0) {
  //   return LEVEL_1_PATTERNS[0]; // Absolute fallback
  // }

  // return patterns[Math.floor(Math.random() * patterns.length)];
  return `l1r0,l0r1`;
}

/**
 * Get all patterns for a level (for testing)
 */
export function getLevelPatterns(level: number): Pattern[] {
  // if (level === 1) return LEVEL_1_PATTERNS;
  // if (level === 2) return LEVEL_2_PATTERNS;
  // if (level === 3) return LEVEL_3_PATTERNS;
  return [];
}
