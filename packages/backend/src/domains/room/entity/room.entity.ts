import { Player } from "./player.entitiy";

export type GAME_MODE = "CatchMind" | "Garticphone" | "";

export interface RoomData {
  roomId: string;
  players?: Player[];
  host?: string;
  state?: boolean;
  gameMode?: GAME_MODE;
  totalRound?: number;
  roundTime?: number;
  goalScore?: number;
  maxPlayer?: number;
}

export class Room {
  roomId: string;
  players: Player[];
  host: string;
  state: boolean;
  gameMode: GAME_MODE;
  totalRound: number;
  roundTime: number;
  goalScore: number;
  maxPlayer: number;

  constructor(data: RoomData) {
    this.roomId = data.roomId;
    this.players = data.players || [];
    this.host = data.host || "";
    this.state = data.state || true; // 방 입장 여부
    this.gameMode = data.gameMode || "";
    this.totalRound = data.totalRound || 10;
    this.roundTime = data.roundTime || 60;
    this.goalScore = data.goalScore || 3;
    this.maxPlayer = data.maxPlayer || 10;
  }
}
