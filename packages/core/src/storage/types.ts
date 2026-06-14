/**
 * Storage adapter interface for multi-backend support
 */

export interface StorageAdapter {
  init(): Promise<void>;
  
  // Player scores
  getPlayerScore(playerId: string): Promise<Record<string, unknown> | null>;
  setPlayerScore(playerId: string, score: Record<string, unknown>): Promise<void>;
  
  // Session scores
  getSessionScore(sessionId: string): Promise<Record<string, unknown> | null>;
  setSessionScore(sessionId: string, score: Record<string, unknown>): Promise<void>;
  getAllSessionScores(playerId: string): Promise<Record<string, unknown>[]>;
  
  // Game scores (rounds)
  getGameScore(gameScoreId: string): Promise<Record<string, unknown> | null>;
  addGameScore(gameScore: Record<string, unknown>): Promise<void>;
  getGameScoresForSession(sessionId: string): Promise<Record<string, unknown>[]>;
  
  // Game state
  getGameState(sessionId: string): Promise<Record<string, unknown> | null>;
  setGameState(sessionId: string, state: Record<string, unknown>): Promise<void>;
  
  // Clear all data
  clear(): Promise<void>;
}

export type StorageAdapterType = "indexeddb" | "localstorage" | "memory" | "cloud";
