import React from "react";
import "./visual-aids.css";

interface DivisionVisualAidProps {
  dividend: number;
  divisor: number;
  quotient: number;
}

const getColumnCount = (num: number): number => {
  if (num <= 8) return 2;
  if (num <= 12) return 3;
  if (num <= 16) return 4;
  return 4 + Math.floor((num - 16) / 4);
};

export const DivisionVisualAid: React.FC<DivisionVisualAidProps> = ({ dividend, divisor, quotient }) => {
  const cols = getColumnCount(quotient);

  return (
    <div className="visual-aid-container">
      <div className="division-visual">
        {/* Show dividend dots divided into divisor groups */}
        <div className="groups-container">
          {Array.from({ length: divisor }).map((_, groupIdx) => (
            <div key={`group-${groupIdx}`} className="dot-group" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
              {Array.from({ length: quotient }).map((_, dotIdx) => (
                <div
                  key={`group-${groupIdx}-dot-${dotIdx}`}
                  className="dot filled"
                  aria-label={`group ${groupIdx + 1}, dot ${dotIdx + 1}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Visual label showing the division */}
        <div className="division-label">
          <span className="label-text">{dividend} ÷ {divisor} = {quotient} each</span>
          <span className="label-subtext">{divisor} groups of {quotient}</span>
        </div>
      </div>
    </div>
  );
};
