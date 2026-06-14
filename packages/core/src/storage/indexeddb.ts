import type { StorageAdapter } from "./types";

const DB_NAME = "weareour-games";
const DB_VERSION = 1;

export class IndexedDbAdapter implements StorageAdapter {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Player scores
        if (!db.objectStoreNames.contains("playerScores")) {
          db.createObjectStore("playerScores", { keyPath: "playerId" });
        }

        // Session scores
        if (!db.objectStoreNames.contains("sessionScores")) {
          const store = db.createObjectStore("sessionScores", { keyPath: "sessionId" });
          store.createIndex("playerId", "playerId", { unique: false });
        }

        // Game scores
        if (!db.objectStoreNames.contains("gameScores")) {
          const store = db.createObjectStore("gameScores", { keyPath: "gameScoreId" });
          store.createIndex("sessionId", "sessionId", { unique: false });
        }

        // Game state
        if (!db.objectStoreNames.contains("gameState")) {
          db.createObjectStore("gameState", { keyPath: "sessionId" });
        }
      };
    });
  }

  async getPlayerScore(playerId: string): Promise<Record<string, unknown> | null> {
    const store = this.getStore("playerScores", "readonly");
    return this.promiseQuery(store.get(playerId));
  }

  async setPlayerScore(playerId: string, score: Record<string, unknown>): Promise<void> {
    const store = this.getStore("playerScores", "readwrite");
    const scoreWithId = { ...score, playerId };
    return this.promiseWrite(store.put(scoreWithId));
  }

  async getSessionScore(sessionId: string): Promise<Record<string, unknown> | null> {
    const store = this.getStore("sessionScores", "readonly");
    return this.promiseQuery(store.get(sessionId));
  }

  async setSessionScore(sessionId: string, score: Record<string, unknown>): Promise<void> {
    const store = this.getStore("sessionScores", "readwrite");
    const scoreWithId = { ...score, sessionId };
    return this.promiseWrite(store.put(scoreWithId));
  }

  async getAllSessionScores(playerId: string): Promise<Record<string, unknown>[]> {
    const store = this.getStore("sessionScores", "readonly");
    const index = store.index("playerId");
    return this.promiseQueryAll(index.getAll(playerId));
  }

  async getGameScore(gameScoreId: string): Promise<Record<string, unknown> | null> {
    const store = this.getStore("gameScores", "readonly");
    return this.promiseQuery(store.get(gameScoreId));
  }

  async addGameScore(gameScore: Record<string, unknown>): Promise<void> {
    const store = this.getStore("gameScores", "readwrite");
    return this.promiseWrite(store.add(gameScore as any));
  }

  async getGameScoresForSession(sessionId: string): Promise<Record<string, unknown>[]> {
    const store = this.getStore("gameScores", "readonly");
    const index = store.index("sessionId");
    return this.promiseQueryAll(index.getAll(sessionId));
  }

  async getGameState(sessionId: string): Promise<Record<string, unknown> | null> {
    const store = this.getStore("gameState", "readonly");
    return this.promiseQuery(store.get(sessionId));
  }

  async setGameState(sessionId: string, state: Record<string, unknown>): Promise<void> {
    const store = this.getStore("gameState", "readwrite");
    return this.promiseWrite(store.put({ sessionId, ...state }));
  }

  async clear(): Promise<void> {
    if (!this.db) return;

    const storeNames = ["playerScores", "sessionScores", "gameScores", "gameState"];
    const tx = this.db.transaction(storeNames, "readwrite");

    for (const storeName of storeNames) {
      const store = tx.objectStore(storeName);
      store.clear();
    }

    return new Promise((resolve, reject) => {
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => resolve();
    });
  }

  private getStore(
    storeName: string,
    mode: IDBTransactionMode
  ): IDBObjectStore {
    if (!this.db) {
      throw new Error("Database not initialized");
    }
    return this.db.transaction(storeName, mode).objectStore(storeName);
  }

  private promiseQuery<T>(request: IDBRequest<T>): Promise<T | null> {
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result ?? null);
    });
  }

  private promiseWrite(request: IDBRequest<IDBValidKey>): Promise<void> {
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private promiseQueryAll<T>(request: IDBRequest<T[]>): Promise<T[]> {
    return new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}
