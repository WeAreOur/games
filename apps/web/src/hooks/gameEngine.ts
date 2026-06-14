import { IndexedDbAdapter } from "@weareour/core";

export type GameEngineState = {
  score: number;
  streak: number;
  level: number;
};

class GameEngineClass extends EventTarget {
  private state: GameEngineState = { score: 0, streak: 0, level: 1 };
  private db: IndexedDbAdapter | null = null;
  private readonly SESSION_ID = "default-session";

  async init() {
    if (this.db) return; // Already initialized

    try {
      this.db = new IndexedDbAdapter();
      await this.db.init();

      // Load persisted state
      const persistedData = await this.db.getGameState(this.SESSION_ID);
      if (persistedData) {
        this.state = {
          score: persistedData.score as number,
          streak: persistedData.streak as number,
          level: persistedData.level as number,
        };
      }
      // Emit state change after loading so components re-render with persisted values
      this.emitStateChange();
    } catch (error) {
      console.warn("Failed to initialize DB:", error);
    }
  }

  getState(): GameEngineState {
    return { ...this.state };
  }

  addToScore(delta: number) {
    this.state.score = Math.max(0, this.state.score + delta);
    this.emitStateChange();
    this.persistState();
  }

  setStreak(value: number) {
    this.state.streak = value;
    this.emitStateChange();
    this.persistState();
  }

  setLevel(value: number) {
    this.state.level = value;
    this.emitStateChange();
    this.persistState();
  }

  restart() {
    this.state = { score: 0, streak: 0, level: 1 };
    this.emitStateChange();
    this.persistState();
  }

  private emitStateChange() {
    this.dispatchEvent(
      new CustomEvent("statechange", { detail: { ...this.state } })
    );
  }

  private async persistState() {
    if (this.db) {
      try {
        await this.db.setGameState(this.SESSION_ID, this.state);
      } catch (error) {
        console.warn("Failed to persist state:", error);
      }
    }
  }
}

export const gameEngine = new GameEngineClass();
