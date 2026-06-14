import React from "react";
import "./visual-aids.css";

interface MultiplicationVisualAidProps {
  a: number;
  b: number;
  product: number;
}

export const MultiplicationVisualAid: React.FC<MultiplicationVisualAidProps> = ({ a, b }) => {
  return (
    <div className="visual-aid-container">
      <div className="multiplication-visual">
        {/* Grid visualization - a rows × b columns */}
        <div className="dot-grid" style={{ gridTemplateColumns: `repeat(${b}, auto)` }}>
          {Array.from({ length: a * b }).map((_, i) => (
            <div key={`grid-dot-${i}`} className="dot filled purple" aria-label={`grid dot ${i + 1}`} />
          ))}
        </div>

        {/* Visual label showing dimensions */}
        <div className="grid-dimensions">
          <span className="dimension-label">{a} rows</span>
          <span className="dimension-label">×</span>
          <span className="dimension-label">{b} columns</span>
        </div>
      </div>
    </div>
  );
};
