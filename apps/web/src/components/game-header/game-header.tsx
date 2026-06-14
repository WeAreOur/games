import React from "react";
import { useGameEngine } from "../../hooks/useGameEngine";
import "./game-header.css";

interface GameHeaderProps {
  gameType: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameType }) => {
  const { state } = useGameEngine(gameType);

  return (
    <div className="game-header">
      <a href="../" className="games-logo">
        Games
      </a>
      <div className="header-stats">
        <div className="header-stat">
          <div className="stat-number">{state.level}</div>
          <div className="stat-label">Level</div>
        </div>
        <div className="header-stat">
          <div className="stat-number">{state.streak}</div>
          <div className="stat-label">Streak</div>
        </div>
        <div className="header-stat">
          <div className="stat-number">{state.score}</div>
          <div className="stat-label">Score</div>
        </div>
      </div>
    </div>
  );
};
