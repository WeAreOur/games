import React from "react";
import "./game-footer.css";

interface GameFooterProps {
  onRestart: () => void;
  onToggleNumpad?: () => void;
  showNumpadToggle?: boolean;
}

export const GameFooter: React.FC<GameFooterProps> = ({
  onRestart,
  onToggleNumpad,
  showNumpadToggle = true,
}) => {
  return (
    <div className="game-footer">
      {onToggleNumpad && showNumpadToggle && (
        <button className="toggle-numpad-btn" onClick={onToggleNumpad}>
          📱 Numpad
        </button>
      )}
      <button className="restart-btn-footer" onClick={onRestart}>
        🔄 Restart
      </button>
    </div>
  );
};
