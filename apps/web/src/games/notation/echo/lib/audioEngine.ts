/**
 * Web Audio API Engine for MIDI-like note playback
 * Uses oscillators to generate simple sine wave tones
 */

interface PlayingNote {
  oscillator: OscillatorNode;
  gain: GainNode;
  startTime: number;
}

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private playingNotes: Map<string, PlayingNote> = new Map();
  private masterGain: GainNode | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === "undefined") return;
    
    this.audioContext = new (window as any).AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.3; // Safe volume
    this.masterGain.connect(this.audioContext.destination);
  }

  /**
   * Play a note with duration
   * frequency: Hz (e.g., 440 for A4)
   * duration: milliseconds
   * key: unique identifier for tracking this note
   */
  playNote(
    frequency: number,
    durationMs: number,
    key: string = `${frequency}-${Date.now()}`
  ): Promise<void> {
    if (!this.audioContext || !this.masterGain) return Promise.resolve();

    const now = this.audioContext.currentTime;
    const duration = durationMs / 1000;

    // Create oscillator
    const oscillator = this.audioContext.createOscillator();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    // Create gain envelope for smooth attack/release
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.05); // attack
    gain.gain.linearRampToValueAtTime(0, now + duration - 0.05); // release

    // Connect
    oscillator.connect(gain);
    gain.connect(this.masterGain);

    // Play
    oscillator.start(now);
    oscillator.stop(now + duration);

    // Track
    this.playingNotes.set(key, {
      oscillator,
      gain,
      startTime: now,
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        this.playingNotes.delete(key);
        resolve();
      }, durationMs);
    });
  }

  /**
   * Stop all playing notes
   */
  stopAll(): void {
    this.playingNotes.forEach(({ oscillator }) => {
      try {
        oscillator.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.playingNotes.clear();
  }

  /**
   * Get MIDI note frequency in Hz
   */
  static midiToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  /**
   * Convert note name to frequency (e.g., "C4" -> 262 Hz)
   */
  static noteToFrequency(note: string): number {
    const noteMap: Record<string, number> = {
      C: 0,
      D: 2,
      E: 4,
      F: 5,
      G: 7,
      A: 9,
      B: 11,
    };

    const matches = note.match(/([A-G])(\d)/);
    if (!matches) return 440; // default A4

    const noteName = matches[1];
    const octave = parseInt(matches[2]);
    const midiNote = octave * 12 + (noteMap[noteName] || 0) + 12;

    return this.midiToFrequency(midiNote);
  }
}

export const audioEngine = new AudioEngine();
