import React, { useEffect, useState, useRef } from "react";
import { useGameEngine } from "../../../hooks/useGameEngine";
import { getRandomPattern, parsePattern } from "./lib/patterns";
import { PatternPlayer } from "./components/PatternPlayer";
import { PatternVisualizer } from "./components/PatternVisualizer";
import { KeyboardInput } from "./components/KeyboardInput";
import { GameHeader } from "../../../components/game-header";
import { Confetti, triggerConfetti } from "../../../components/confetti";
import { Toast, triggerToast } from "../../../components/toast/toast";

const GAME_NAME = "echo";

interface UserInput {
  input: 0 | 1;
  time: number;
  key: string;
}

export const EchoGame: React.FC = () => {
  const { state } = useGameEngine(GAME_NAME);
  const [patternString, setPatternString] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackPhase, setPlaybackPhase] = useState<0 | 1>(0); // 0 = listen, 1 = repeat
  const [userInputs, setUserInputs] = useState<UserInput[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(0); // Counter to trigger second playback
  const [expectedEvents, setExpectedEvents] = useState<any[]>([]); // For debugging
  const userInputsRef = useRef<UserInput[]>([]);
  const animationFrameRef = useRef<number>();
  const playPhaseTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const listeningTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    try {
      const newPattern = getRandomPattern(state.level);
      setPatternString(newPattern);
      setCurrentTime(0);
      setIsPlaying(false);
      setPlaybackPhase(0);
      setUserInputs([]);
      userInputsRef.current = [];
      setIsListening(false);

      // Clear any pending timeouts
      if (playPhaseTimerRef.current) clearTimeout(playPhaseTimerRef.current);
      if (listeningTimeoutRef.current) clearTimeout(listeningTimeoutRef.current);
    } catch (error) {
      console.error("Failed to generate pattern:", error);
    }
  }, [state.level]);

  // Track playback time for visualizer
  useEffect(() => {
    if (!isPlaying) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      setCurrentTime(elapsed);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Handle playback ending - play again in listening mode
  const handlePlaybackEnd = (durationMs: number) => {
    if (playbackPhase === 0) {
      // First playback done, prepare for second playback with listening
      setIsPlaying(false); // Stop the animation frame
      setCurrentTime(0); // IMMEDIATELY reset timer before starting second phase
      setPlaybackPhase(1);
      setIsListening(true);
      userInputsRef.current = []; // Clear inputs for new round
      setUserInputs([]); // Reset user inputs before second phase

      // Trigger second playback to start
      setPlayTrigger((prev) => prev + 1);

      // Schedule evaluation at the end of the pattern duration
      listeningTimeoutRef.current = setTimeout(() => {
        setIsListening(false);
        setIsPlaying(false);
        setCurrentTime(0);

      // Evaluate performance
        const evaluation = evaluatePerformance();
        const isCorrect = evaluation.isCorrect;

        // Log all the data for debugging
        console.group("=== ECHO EVALUATION ===");
        console.log("Pattern string:", patternString);
        console.log("Expected events count:", evaluation.expected.length);
        console.log("User inputs count:", userInputs.length);
        console.table(evaluation.expected.map((e, i) => ({
          index: i,
          input: e.input,
          note: e.note,
          startTime: e.startTime,
          durationMs: e.durationMs,
          divisor: e.divisor,
        })));
        console.table(userInputsRef.current.map((u, i) => ({
          index: i,
          input: u.input,
          key: u.key,
          time: u.time,
        })));
        console.log("Result:", isCorrect ? "✓ PASS" : "✗ FAIL");
        console.groupEnd();

        // Update expected events for display
        setExpectedEvents(evaluation.expected);

        if (isCorrect) {
          triggerConfetti(); // Trigger confetti animation
          triggerToast({ message: "✓ Correct! Pattern matched!", type: "success" });
        } else {
          triggerToast({ message: "✗ Pattern didn't match. Try again!", type: "error" });
        }

        // Delay reset and auto-advance
        setTimeout(() => {
          if (isCorrect) {
            // Auto-advance to next level after success
            setPlaybackPhase(0);
            setPlayTrigger(0);
            userInputsRef.current = [];
            setUserInputs([]);
            setExpectedEvents([]);
            setIsListening(false);
            setIsPlaying(false);
            setCurrentTime(0);
            // Trigger next pattern to load
            try {
              const newPattern = getRandomPattern(state.level);
              setPatternString(newPattern);
            } catch (error) {
              console.error("Failed to generate pattern:", error);
            }
          } else {
            resetGame(); // Just reset without advancing on failure
          }
        }, 2000); // Wait 2 seconds before advancing
      }, durationMs);
    }
  };

  // Reset game state for next round
  const resetGame = () => {
    playPhaseTimerRef.current && clearTimeout(playPhaseTimerRef.current);
    listeningTimeoutRef.current && clearTimeout(listeningTimeoutRef.current);
    userInputsRef.current = []; // Clear ref
    setPlaybackPhase(0);
    setPlayTrigger(0);
    setUserInputs([]);
    setExpectedEvents([]);
    setIsListening(false);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleUserInput = (input: 0 | 1, key: string, time: number) => {
    const newInput = { input, time, key };
    userInputsRef.current.push(newInput); // Immediately add to ref
    setUserInputs((prev) => [...prev, newInput]); // Also update state for display
  };

  // Evaluate if user inputs match the expected pattern
  const evaluatePerformance = () => {
    if (!patternString) return { isCorrect: false, expected: [] };

    const parsed = parsePattern(patternString);
    
    // Get expected events (events in the pattern)
    const expectedEvts = parsed.events;
    
    // Use the ref to get actual captured inputs
    const actualInputs = userInputsRef.current;
    
    // Tolerance for timing (in ms) - user has +/- 400ms window (very forgiving)
    const TIMING_TOLERANCE = 400;
    
    // Check if user inputs match expected pattern
    if (actualInputs.length !== expectedEvts.length) {
      console.error(`Input count mismatch: got ${actualInputs.length}, expected ${expectedEvts.length}`);
      return { isCorrect: false, expected: expectedEvts };
    }

    for (let i = 0; i < actualInputs.length; i++) {
      const userInput = actualInputs[i];
      const expectedEvent = expectedEvts[i];

      // Check if input type matches
      if (userInput.input !== expectedEvent.input) {
        console.error(`Input type mismatch at ${i}: got ${userInput.input}, expected ${expectedEvent.input}`);
        return { isCorrect: false, expected: expectedEvts };
      }

      // Check if timing is within tolerance
      const timingDiff = Math.abs(userInput.time - expectedEvent.startTime);
      console.log(`Event ${i}: user=${userInput.time}ms, expected=${expectedEvent.startTime}ms, diff=${timingDiff}ms`);
      if (timingDiff > TIMING_TOLERANCE) {
        console.error(`Timing out of tolerance: ${timingDiff}ms > ${TIMING_TOLERANCE}ms`);
        return { isCorrect: false, expected: expectedEvts };
      }
    }

    console.log("✓ All inputs matched!");
    return { isCorrect: true, expected: expectedEvts };
  };

  if (!patternString) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading pattern for level {state.level}...</p>
      </div>
    );
  }

  return (
    <div>
      <Confetti />
      <Toast />
      <GameHeader gameType={GAME_NAME} />

      <div style={{ padding: "2rem" }}>
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Echo Game</h1>

        {/* Status */}
        {isPlaying && (
          <div style={{ textAlign: "center", marginBottom: "1rem", fontSize: "14px", color: "#667eea", fontWeight: "bold" }}>
            {playbackPhase === 0 ? "🎵 Listen to the pattern..." : "🎹 Now play along (F and J keys)"}
          </div>
        )}

        {!isPlaying && playbackPhase === 0 && !isListening && (
          <div style={{ textAlign: "center", marginBottom: "1rem", fontSize: "14px", color: "#666" }}>
            👇 Click Play to start
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Player Controls */}
          <div style={{ textAlign: "center" }}>
            <PatternPlayer
              patternString={patternString}
              autoPlay={playbackPhase === 0 && !isPlaying && patternString !== null}
              onPlayStart={() => setIsPlaying(true)}
              onPlaybackEnd={handlePlaybackEnd}
              triggerPlay={playTrigger}
            />
          </div>

          {/* Visualizer */}
          <PatternVisualizer
            patternString={patternString}
            isPlaying={isPlaying}
            currentTime={currentTime}
          />

          {/* Keyboard Input */}
          <KeyboardInput
            isListening={isListening}
            currentTime={currentTime}
            onInput={handleUserInput}
            patternString={patternString || ""}
          />

          {/* User Inputs Display */}
          {userInputs.length > 0 && (
            <div style={{ background: "#f0f0f0", padding: "1rem", borderRadius: "4px" }}>
              <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>Your inputs vs Expected:</p>
              <div style={{ fontSize: "12px", fontFamily: "monospace", lineHeight: "1.6" }}>
                {userInputs.map((input, idx) => {
                  const expected = expectedEvents[idx];
                  const diff = expected ? input.time - expected.startTime : 0;
                  const isMatch = expected && Math.abs(diff) <= 400;
                  const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
                  return (
                    <div
                      key={idx}
                      style={{
                        marginBottom: "0.5rem",
                        padding: "0.5rem",
                        background: isMatch ? "#d4f4dd" : "#ffd4d4",
                        borderRadius: "4px",
                      }}
                    >
                      {input.key}: {input.time}ms {expected ? `(expected ${expected.startTime}ms, diff ${diffStr}ms)` : "(no expected)"}
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: "11px", color: "#666", marginTop: "0.5rem" }}>
                {expectedEvents.length} events expected
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

