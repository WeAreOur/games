import type { NetworkAdapter, NetworkMessage } from "./types";

/**
 * Local network adapter - for single-player mode
 * Acts as a simple message bus
 */
export class LocalNetworkAdapter implements NetworkAdapter {
  private peerId: string;
  private messageHandlers: Array<(msg: NetworkMessage) => void> = [];
  private connected = false;

  constructor() {
    this.peerId = `local-${Math.random().toString(36).slice(2, 9)}`;
  }

  async init(): Promise<void> {
    this.connected = true;
  }

  async connect(_peerId: string): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  async send(message: NetworkMessage): Promise<void> {
    if (!this.connected) {
      throw new Error("Not connected");
    }
    // In local mode, immediately deliver message back to self
    setTimeout(() => {
      this.messageHandlers.forEach((handler) => handler(message));
    }, 0);
  }

  onMessage(callback: (message: NetworkMessage) => void): void {
    this.messageHandlers.push(callback);
  }

  isConnected(): boolean {
    return this.connected;
  }

  getPeerId(): string {
    return this.peerId;
  }
}
