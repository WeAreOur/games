import { useEffect, useState } from "react";
import { gameEngine, type GameEngineState } from "./gameEngine";

export const useGameEngine = () => {
  const [state, setState] = useState<GameEngineState>(gameEngine.getState());

  useEffect(() => {
    // Initialize engine on first use (async, will emit statechange when done)
    gameEngine.init().catch(console.error);

    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<GameEngineState>;
      setState(customEvent.detail);
    };

    gameEngine.addEventListener("statechange", handleStateChange);
    return () => gameEngine.removeEventListener("statechange", handleStateChange);
  }, []);

  return {
    state,
    addToScore: (delta: number) => gameEngine.addToScore(delta),
    setStreak: (value: number) => gameEngine.setStreak(value),
    setLevel: (value: number) => gameEngine.setLevel(value),
    restart: () => gameEngine.restart(),
  };
};
