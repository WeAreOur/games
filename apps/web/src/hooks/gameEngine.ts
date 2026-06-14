import { IndexedDbAdapter } from "@weareour/core";

export type GameEngineState = {
  // Global - persists across all games
  globalScore: number;
  // Per-game - resets when restarting that game
  level: number;
  streak: number;
};

type PersistedState = {
  globalScore: number;
  gameStates: Record<string, { level: number; streak: number }>;
};

class GameEngineClass extends EventTarget {
  private state: GameEngineState = { globalScore: 0, level: 1, streak: 0 };
  private db: IndexedDbAdapter | null = null;
  private currentGameType: string = "default";
  private persistedGameStates: Record<string, { level: number; streak: number }> = {};
  private readonly SESSION_ID = "default-session";

  async init() {
    if (this.db) return; // Already initialized

    try {
      this.db = new IndexedDbAdapter();
      await this.db.init();

      // Load persisted state
      const persistedData = await this.db.getGameState(this.SESSION_ID);
      if (persistedData) {
        const data = persistedData as unknown as PersistedState;
        this.state.globalScore = data.globalScore ?? 0;
        this.persistedGameStates = data.gameStates ?? {};
        this.loadGameState(this.currentGameType);
      }
      // Emit state change after loading so components re-render with persisted values
      this.emitStateChange();
    } catch (error) {
      console.warn("Failed to initialize DB:", error);
    }
  }

  /**
   * Switch to a different game type and load its state
   */
  setGameType(gameType: string) {
    this.currentGameType = gameType;
    this.loadGameState(gameType);
    this.emitStateChange();
  }

  private loadGameState(gameType: string) {
    const gameState = this.persistedGameStates[gameType];
    if (gameState) {
      this.state.level = gameState.level;
      this.state.streak = gameState.streak;
    } else {
      this.state.level = 1;
      this.state.streak = 0;
    }
  }

  getState(): GameEngineState {
    return { ...this.state };
  }

  addToScore(delta: number) {
    this.state.globalScore = Math.max(0, this.state.globalScore + delta);
    this.emitStateChange();
    this.persistState();
  }

  setStreak(value: number) {
    this.state.streak = value;
    this.savePerGameState();
    this.emitStateChange();
  }

  setLevel(value: number) {
    this.state.level = value;
    this.savePerGameState();
    this.emitStateChange();
  }

  /**
   * Restart a game - resets level and streak only for that game type
   */
  restart(gameType: string = this.currentGameType) {
    const previousGameType = this.currentGameType;
    this.currentGameType = gameType;
    this.state.level = 1;
    this.state.streak = 0;
    this.savePerGameState();
    this.currentGameType = previousGameType;
    this.emitStateChange();
  }

  private savePerGameState() {
    this.persistedGameStates[this.currentGameType] = {
      level: this.state.level,
      streak: this.state.streak,
    };
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
        const data: PersistedState = {
          globalScore: this.state.globalScore,
          gameStates: this.persistedGameStates,
        };
        await this.db.setGameState(this.SESSION_ID, data);
      } catch (error) {
        console.warn("Failed to persist state:", error);
      }
    }
  }
}

export const gameEngine = new GameEngineClass();
