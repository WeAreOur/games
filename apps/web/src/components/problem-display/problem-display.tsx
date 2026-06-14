import React from "react";
import "./problem-display.css";

interface ProblemDisplayProps {
  problem: string; // e.g., "?+40=80" or "3+?=6"
  answer?: string; // e.g., "something"
}

export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({ problem, answer }) => {
  const parts = problem.split("").map((char, i) => {
    let type = "default";

    if (char === "?") {
      type = "missing";
    } else if (["+", "-", "*", "/"].includes(char)) {
      type = "operator";
    } else if (char === "=") {
      type = "equals";
    }

    return (
      <span key={i} className={`part part-${type}`}>
        {char}
      </span>
    );
  });

  return (
    <div className="problem-display">
      <div className="equation">{parts}</div>
      {answer && <div className="answer-display">{answer}</div>}
    </div>
  );
};
