/**
 * Networking adapter interface for local/p2p/cloud multiplayer
 */

export interface NetworkAdapter {
  init(): Promise<void>;
  connect(peerId: string): Promise<void>;
  disconnect(): Promise<void>;
  send(message: NetworkMessage): Promise<void>;
  onMessage(callback: (message: NetworkMessage) => void): void;
  isConnected(): boolean;
  getPeerId(): string;
}

export interface NetworkMessage {
  type: "command" | "state-sync" | "event" | "heartbeat";
  timestamp: number;
  senderId: string;
  targetId?: string;
  payload: Record<string, unknown>;
}

export type NetworkAdapterType = "local" | "webrtc" | "cloud";
