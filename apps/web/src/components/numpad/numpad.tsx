import React from "react";
import "./numpad.css";

interface NumpadProps {
  onDigit: (digit: string) => void;
}

export const Numpad: React.FC<NumpadProps> = ({ onDigit }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const digit = event.currentTarget.dataset.digit;
    if (digit) {
      onDigit(digit);
    }
  };
  return (
    <div className="numpad">
      <button className="numpad-btn" onClick={handleClick} data-digit="1">1</button>
      <button className="numpad-btn" onClick={handleClick} data-digit="2">2</button>
      <button className="numpad-btn" onClick={handleClick} data-digit="3">3</button>
      <button className="numpad-btn" onClick={handleClick} data-digit="4">4</button>
      <button className="numpad-btn" onClick={handleClick} data-digit="5">5</button>
      <button className="numpad-btn" onClick={handleClick} data-digit="6">6</button>
      <button className="numpad-btn" onClick={handleClick} data-digit="7">7</button>
      <button className="numpad-btn" onClick={handleClick} data-digit="8">8</button>
      <button className="numpad-btn" onClick={handleClick} data-digit="9">9</button>
      <div></div>
      <button className="numpad-btn" onClick={handleClick} data-digit="0">0</button>
    </div>
  );
};
