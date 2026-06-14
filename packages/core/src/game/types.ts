/**
 * Core game module interface
 * Every game implements this contract
 */
export interface GameCommand {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface GameEvent {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
}

export interface GameState {
  gameId: string;
  gameType: string;
  roundNumber: number;
  isActive: boolean;
  data: Record<string, unknown>;
}

export interface GameModule {
  name: string;
  version: string;
  init(config: GameConfig): Promise<GameState>;
  handleCommand(state: GameState, command: GameCommand): Promise<GameEvent[]>;
  getState(): GameState;
  reset(): Promise<void>;
}

export interface GameConfig {
  level?: number;
  difficulty?: "easy" | "normal" | "hard";
  timeLimit?: number;
  multiplayer?: boolean;
  [key: string]: unknown;
}

export interface GameRound {
  roundNumber: number;
  startedAt: number;
  endedAt?: number;
  commands: GameCommand[];
  events: GameEvent[];
  result: "win" | "lose" | "draw" | "skip" | null;
  details: Record<string, unknown>;
}
