import React, { useEffect, useState } from "react";
import { statsEngine } from "../../hooks/useStatsEngine";
import "./stats-content.css";

interface Session {
  puzzle: string;
  answer: string;
  correct: boolean;
}

interface GameStats {
  gameName: string;
  totalExercises: number;
  successfulExercises: number;
  failedExercises: number;
  totalTimeSeconds: number;
  sessions: Session[];
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

function SummaryTile({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="tile">
      <div className="tile-value">{value}</div>
      <div className="tile-label">{label}</div>
    </div>
  );
}

function MiniTile({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="mini-tile">
      <div className="mini-value">{value}</div>
      <div className="mini-label">{label}</div>
    </div>
  );
}

function ProblemRow({
  puzzle,
  answer,
  correct,
}: {
  puzzle: string;
  answer: string;
  correct: boolean;
}) {
  const statusClass = correct ? "correct" : "incorrect";
  const status = correct ? "✓" : "✗";

  return (
    <div className={`problem-row ${statusClass}`}>
      <div className="problem-num"></div>
      <div className="problem-puzzle">{puzzle}</div>
      <div className="problem-answer">{answer}</div>
      <div className="problem-status">{status}</div>
    </div>
  );
}

function GameCard({ game }: { game: GameStats }) {
  const gameSuccessRate =
    game.totalExercises > 0
      ? Math.round((game.successfulExercises / game.totalExercises) * 100)
      : 0;
  const gameTimeFormatted = formatTime(game.totalTimeSeconds);

  return (
    <div className="game-card">
      <div className="game-header">
        <h3 className="game-title">{game.gameName}</h3>
        <div className="game-tiles">
          <MiniTile value={game.totalExercises} label="exercises" />
          <MiniTile value={`${gameSuccessRate}%`} label="correct" />
          <MiniTile value={gameTimeFormatted} label="played" />
        </div>
      </div>

      <div className="problems-list">
        {game.sessions.map((session) => (
          <ProblemRow
            key={`${session.puzzle}-${session.answer}`}
            puzzle={session.puzzle}
            answer={session.answer}
            correct={session.correct}
          />
        ))}
      </div>
    </div>
  );
}

export function StatsContent() {
  const [stats, setStats] = useState<GameStats[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await statsEngine.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const handleClearStats = async () => {
    if (confirm("Are you sure? This cannot be undone.")) {
      await statsEngine.clearStats();
      setStats([]);
      // Reload stats
      const data = await statsEngine.getStats();
      setStats(data);
    }
  };

  if (loading) {
    return <div className="loading">Loading stats...</div>;
  }

  if (!stats || stats.length === 0) {
    return (
      <div className="no-data">
        <p>No exercises yet. Start playing to see your progress!</p>
      </div>
    );
  }

  const totalExercises = stats.reduce((sum, game) => sum + game.totalExercises, 0);
  const totalSuccess = stats.reduce((sum, game) => sum + game.successfulExercises, 0);
  const successRate = totalExercises > 0 ? Math.round((totalSuccess / totalExercises) * 100) : 0;
  const totalTimeSeconds = stats.reduce((sum, game) => sum + game.totalTimeSeconds, 0);
  const totalTimeFormatted = formatTime(totalTimeSeconds);

  return (
    <>
      <div className="summary-section">
        <SummaryTile value={totalExercises} label="exercises" />
        <SummaryTile value={`${successRate}%`} label="correct" />
        <SummaryTile value={totalTimeFormatted} label="played" />
      </div>

      <div className="games-section">
        <h2>By Game</h2>
        {stats.map((game) => (
          <GameCard key={game.gameName} game={game} />
        ))}
      </div>

      <button className="clear-button" onClick={handleClearStats}>
        Clear All Stats
      </button>
    </>
  );
}
