import { IndexedDbAdapter } from "@weareour/core";
import { clearGameHistory } from "./components/history";

export interface GameEngineState {
  score: number;
  streak: number;
  level: number;
}

class GameEngineClass extends EventTarget {
  private state: GameEngineState = {
    score: 0,
    streak: 0,
    level: 1,
  };
  private db: IndexedDbAdapter | null = null;

  async init() {
    if (this.db) return; // Already initialized
    this.db = new IndexedDbAdapter();
    await this.db.init();
    clearGameHistory();
  }

  getState(): GameEngineState {
    return structuredClone(this.state);
  }

  private emitChange() {
    this.dispatchEvent(new CustomEvent("statechange", { detail: this.state }));
  }

  addToScore(delta: number) {
    this.state.score = Math.max(0, this.state.score + delta);
    this.emitChange();
  }

  setStreak(value: number) {
    this.state.streak = value;
    this.emitChange();
  }

  setLevel(value: number) {
    this.state.level = value;
    this.emitChange();
  }

  restart() {
    this.state = { score: 0, streak: 0, level: 1 };
    clearGameHistory();
    this.emitChange();
  }
}

export const gameEngine = new GameEngineClass();
