export interface GameStats {
  gameName: string;
  totalExercises: number;
  successfulExercises: number;
  failedExercises: number;
  totalTimeSeconds: number;
  sessions: GameSession[];
}

export interface GameSession {
  timestamp: number;
  gameName: string;
  puzzle: string;
  answer: string;
  correct: boolean;
  responseMs: number;
}

class StatsEngineClass {
  private storageKey = "game_sessions";
  private currentProblemStartTime: number = 0;
  private currentGameName: string = "";
  private currentProblem: string = "";

  /**
   * Start tracking a new problem
   */
  problemStart(gameName: string, problem: string): void {
    this.currentGameName = gameName;
    this.currentProblem = problem;
    this.currentProblemStartTime = Date.now();
  }

  /**
   * Get the elapsed time since problemStart was called
   */
  private getElapsedMs(): number {
    if (this.currentProblemStartTime === 0) return 0;
    return Date.now() - this.currentProblemStartTime;
  }

  async recordSession(
    gameName: string,
    puzzle: string,
    answer: string,
    correct: boolean,
    responseMs?: number
  ): Promise<void> {
    // Use elapsed time from problemStart if not explicitly provided
    const finalResponseMs = responseMs ?? this.getElapsedMs();

    const session: GameSession = {
      timestamp: Date.now(),
      gameName,
      puzzle,
      answer,
      correct,
      responseMs: finalResponseMs,
    };

    const sessions = this.getSessions();
    sessions.push(session);
    localStorage.setItem(this.storageKey, JSON.stringify(sessions));

    // Reset timing
    this.currentProblemStartTime = 0;
  }

  private getSessions(): GameSession[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  async getStats(gameName?: string): Promise<GameStats[]> {
    const sessions = this.getSessions();

    const gameMap = new Map<string, GameSession[]>();

    sessions.forEach((session) => {
      if (!gameName || session.gameName === gameName) {
        const existing = gameMap.get(session.gameName) || [];
        gameMap.set(session.gameName, [...existing, session]);
      }
    });

    const stats: GameStats[] = [];
    gameMap.forEach((sessions, name) => {
      const successful = sessions.filter((s) => s.correct).length;
      const failed = sessions.filter((s) => !s.correct).length;
      const totalTime = sessions.reduce((sum, s) => sum + (s.responseMs / 1000), 0);

      stats.push({
        gameName: name,
        totalExercises: sessions.length,
        successfulExercises: successful,
        failedExercises: failed,
        totalTimeSeconds: totalTime,
        sessions,
      });
    });

    return stats.sort((a, b) => b.totalExercises - a.totalExercises);
  }

  async clearStats(): Promise<void> {
    localStorage.removeItem(this.storageKey);
  }
}

export const statsEngine = new StatsEngineClass();
