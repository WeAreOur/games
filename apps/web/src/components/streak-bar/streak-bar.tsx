import React from "react";
import "./streak-bar.css";

interface StreakBarProps {
  current: number;
  max: number;
  label?: string;
}

export const StreakBar: React.FC<StreakBarProps> = ({ current, max, label = "Progress" }) => {
  return (
    <div className="streak-section">
      {label && <div className="streak-label">{label}</div>}
      <div className="streak-bar">
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} className={`streak-segment ${i < current ? "filled" : ""}`} />
        ))}
      </div>
    </div>
  );
};
