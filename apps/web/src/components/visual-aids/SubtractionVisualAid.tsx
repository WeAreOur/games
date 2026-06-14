import React from "react";
import "./visual-aids.css";

interface SubtractionVisualAidProps {
  a: number;
  b: number;
  result: number;
}

const getColumnCount = (num: number): number => {
  if (num <= 8) return 2;
  if (num <= 12) return 3;
  if (num <= 16) return 4;
  return 4 + Math.floor((num - 16) / 4);
};

export const SubtractionVisualAid: React.FC<SubtractionVisualAidProps> = ({ a, b, result }) => {
  const cols = getColumnCount(a);

  return (
    <div className="visual-aid-container">
      <div className="subtraction-visual">
        {/* Minuend row - shows total dots (some filled for remaining, some outlined for removed) */}
        <div className="dot-grid" style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}>
          {/* Filled dots = result (what remains) */}
          {Array.from({ length: result }).map((_, i) => (
            <div key={`remaining-${i}`} className="dot filled" aria-label={`remaining dot ${i + 1}`} />
          ))}
          {/* Outlined dots = amount removed */}
          {Array.from({ length: b }).map((_, i) => (
            <div key={`removed-${i}`} className="dot outlined" aria-label={`removed dot ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
