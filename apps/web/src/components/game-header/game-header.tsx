import React from "react";
import { useGameEngine } from "../../hooks/useGameEngine";
import "./game-header.css";

export const GameHeader: React.FC = () => {
  const { state } = useGameEngine();

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
