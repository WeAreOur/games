import React, { useEffect, useState, useCallback } from "react";
import { useGameEngine } from "../../hooks/useGameEngine";
import { GameHeader } from "../../components/game-header";
import { GameFooter } from "../../components/game-footer";
import { CenteredCardLayout } from "../../components/centered-card-layout";
import { Confetti, triggerConfetti } from "../../components/confetti";
import { Toast, triggerToast } from "../../components/toast";
import { StreakBar } from "../../components/streak-bar";
import { Numpad } from "../../components/numpad";
import { ProblemDisplay } from "../../components/problem-display";
import { CountdownBar, triggerTimeoutPause, triggerTimeoutReset } from "../../components/countdown-bar";
import { statsEngine } from "../../hooks/useStatsEngine";
import { AdditionVisualAid } from "../../components/visual-aids";
import "./addition.css";

// ==== GAME LOGIC ====

interface Problem {
  problem: string; // "42+_=100"
  answer: string; // "58"
  a: number;
  b: number;
  sum: number;
}

const generateProblem = (level: number): Problem => {
  const MAX_NUMBER = Math.pow(10, level);
  const a = Math.round(Math.random() * MAX_NUMBER);
  const b = Math.round(Math.random() * MAX_NUMBER);
  const sum = a + b;

  const position = Math.floor(Math.random() * 3);
  const parts = [String(a), String(b), String(sum)];
  const answer = parts[position];
  parts[position] = "_";

  return {
    problem: `${parts[0]}+${parts[1]}=${parts[2]}`,
    answer,
    a,
    b,
    sum,
  };
};

const validateAnswer = (userAnswer: string, problem: Problem): boolean => {
  return userAnswer === problem.answer;
};

// ==== COMPONENT ====

export const AdditionGame: React.FC = () => {
  const { state, addToScore, setStreak, setLevel, restart } = useGameEngine();

  const [answer, setAnswer] = useState("");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loseMessage, setLoseMessage] = useState<string | null>(null);
  const [showNumpad, setShowNumpad] = useState(false);

  // Generate first problem on mount
  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = useCallback(() => {
    const newProblem = generateProblem(state.level);
    setProblem(newProblem);
    setAnswer("");
    triggerTimeoutReset();
  }, [state.level]);

  const handleTimeout = useCallback(() => {
    handleSkip();
  }, [state.level, state.streak]);

  const handleSkip = useCallback(() => {
    if (!problem) return;
    triggerTimeoutPause();
    setStreak(0);

    triggerToast({ message: "⏭ Skipped", type: "info" });
    generateNewProblem();
  }, [problem, state.level]);

  const handleAnswer = useCallback(
    (digit: string) => {
      if (!problem) return;
      setLoseMessage(null);
      const newAnswer = answer + digit;
      setAnswer(newAnswer);

      if (newAnswer.length === problem.answer.length) {
        triggerTimeoutPause();
        const isCorrect = validateAnswer(newAnswer, problem);
        const pointsDelta = isCorrect ? 10 * state.level : -5 * state.level;
        const newStreak = isCorrect ? state.streak + 1 : 0;
        const newLevel = isCorrect && newStreak > 10 ? state.level + 1 : state.level;

        addToScore(pointsDelta);
        setStreak(newLevel > state.level ? 0 : newStreak);
        setLevel(newLevel);

        statsEngine.recordSession("Addition", problem.problem, newAnswer, isCorrect, 0);

        if (isCorrect) {
          triggerToast({ message: "✓ Correct!", type: "success" });
          triggerConfetti();
        } else {
          triggerToast({ message: "✗ Wrong!", type: "error" });
          setLoseMessage(`${problem.a} + ${problem.b} = ${problem.sum}`);
        }

        generateNewProblem();
      }
    },
    [answer, problem, state]
  );

  const handleRestart = useCallback(() => {
    restart();
    generateNewProblem();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        handleAnswer(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setAnswer((prev) => prev.slice(0, -1));
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAnswer, handleSkip]);

  if (!problem) return <div>Loading...</div>;

  return (
    <>
      <GameHeader />
      <GameFooter onRestart={handleRestart} onToggleNumpad={() => setShowNumpad(!showNumpad)} />

      <CenteredCardLayout>
        <CountdownBar onTimeout={handleTimeout} />

        <div className="game-board">
          {state.level === 1 && <AdditionVisualAid a={problem.a} b={problem.b} />}
          <ProblemDisplay problem={problem.problem} answer={answer} />

          {loseMessage && <div className="lose-message">Correct: {loseMessage}</div>}
        </div>

        <StreakBar current={state.streak} max={10} label="Level Up Progress" />
        
        <div className={`numpad-wrapper ${showNumpad ? "show" : ""}`}>
          <Numpad onDigit={handleAnswer} />
        </div>
      </CenteredCardLayout>

      <Confetti />
      <Toast />
    </>
  );
};
