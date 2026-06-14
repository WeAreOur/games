import React from "react";
import "./visual-aids.css";

interface AdditionVisualAidProps {
  a: number;
  b: number;
}

const getColumnCount = (num: number): number => {
  if (num <= 8) return 2;
  if (num <= 12) return 3;
  if (num <= 16) return 4;
  return 4 + Math.floor((num - 16) / 4);
};

export const AdditionVisualAid: React.FC<AdditionVisualAidProps> = ({ a, b }) => {
  const colsA = getColumnCount(a);
  const colsB = getColumnCount(b);

  return (
    <div className="visual-aid-container">
      <div className="addition-visual">
        {/* First group - filled dots */}
        <div className="dot-grid" style={{ gridTemplateColumns: `repeat(${colsA}, auto)` }}>
          {Array.from({ length: a }).map((_, i) => (
            <div key={`filled-${i}`} className="dot filled" aria-label={`dot ${i + 1}`} />
          ))}
        </div>

        {/* Second group - outlined dots */}
        <div className="dot-grid" style={{ gridTemplateColumns: `repeat(${colsB}, auto)` }}>
          {Array.from({ length: b }).map((_, i) => (
            <div key={`outlined-${i}`} className="dot outlined" aria-label={`dot ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
