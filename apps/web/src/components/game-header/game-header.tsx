import React from "react";
import { useGameEngine } from "../../hooks/useGameEngine";
import "./game-header.css";

export const GameHeader: React.FC = () => {
  const { state } = useGameEngine();

  return (
    <div className="game-header">
      <a href="/games/" className="games-logo">
        Games
      </a>
      <div className="header-stats">
        <div className="header-stat">Level: <span>{state.level}</span></div>
        <div className="header-stat">Streak: <span>{state.streak}</span></div>
        <div className="header-stat">Score: <span>{state.score}</span></div>
      </div>
    </div>
  );
};
