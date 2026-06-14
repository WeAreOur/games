/**
 * Three-domain score model
 */

export interface PlayerScore {
  playerId: string;
  createdAt: number;
  updatedAt: number;
  gameStats: Record<string, GameTypeStats>;
  totalPoints: number;
  totalSessions: number;
}

export interface GameTypeStats {
  gameType: string;
  totalRounds: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skipped: number;
  totalPoints: number;
  highestStreak: number;
  highestLevel: number;
  averageResponseTime: number;
}

export interface SessionScore {
  sessionId: string;
  playerId: string;
  gameType: string;
  startedAt: number;
  endedAt?: number;
  score: number;
  streak: number;
  currentLevel: number;
  roundCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  duration: number;
}

export interface GameScore {
  gameScoreId: string;
  sessionId: string;
  gameType: string;
  roundNumber: number;
  startedAt: number;
  endedAt?: number;
  responseTime: number;
  answered: string;
  correct: boolean;
  isSkipped: boolean;
  pointsDelta: number;
  levelAtTime: number;
  streakAtTime: number;
  details: Record<string, unknown>;
}

export interface ScoreContext {
  player?: PlayerScore;
  session?: SessionScore;
  game?: GameScore;
}
