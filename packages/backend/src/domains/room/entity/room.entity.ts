import { GAME_MODE } from "../../../types/room";
import { Player } from "./player.entitiy";

export interface GarticGameData {
  roomId: string;
  gameMode: GAME_MODE;
  players: string[];
  totalRound: number;
  drawTime: number;
  KeywordTime: number;
  goalScore: number;
}
export interface CatchMindGameData {
  roomId: string;
  gameMode: GAME_MODE;
  players: string[];
  totalRound: number;
  roundTime: number;
  goalScore: number;
}

export type GameData = GarticGameData | CatchMindGameData;

export interface RoomData {
  roomId: string;
  players?: Player[];
  host?: string;
  state?: boolean;
  gameMode?: GAME_MODE;
  totalRound?: number;
  catchMindRoundTime?: number;
  garticdrawTime?: number;
  garticKeywordTime?: number;
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
  catchMindRoundTime: number;
  garticdrawTime: number;
  garticKeywordTime: number;
  goalScore: number;
  maxPlayer: number;

  constructor(data: RoomData) {
    this.roomId = data.roomId;
    this.players = data.players || [];
    this.host = data.host || "";
    this.state = data.state !== undefined ? data.state : true; // 방 입장 여부
    this.gameMode = data.gameMode || "CatchMind"; // 방 생성시 기본 모드 캐치마인드
    this.totalRound = data.totalRound || 10;
    this.catchMindRoundTime = data.catchMindRoundTime || 60;
    this.garticdrawTime = data.garticdrawTime || 90;
    this.garticKeywordTime = data.garticKeywordTime || 45;
    this.goalScore = data.goalScore || 3;
    this.maxPlayer = data.maxPlayer || 10;
  }

  getPlayerId() {
    return this.players.map((player) => player.peerId);
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }

  leavePlayer(peerId: string) {
    if (this.players.length === 1) {
      return;
    }

    this.players = this.players.filter((player) => player.peerId !== peerId);

    if (this.host === peerId) {
      this.changeHost();
    }
  }

  changeHost() {
    const newHost = this.players.find((player) => player.peerId !== this.host);
    if (!newHost) {
      return;
    }

    this.host = newHost.peerId;
  }

  changeGameMode(gameMode: GAME_MODE) {
    this.gameMode = gameMode;
  }

  changeState(state: boolean) {
    this.state = state;
  }

  checkMaxPlayer() {
    return this.players.length === this.maxPlayer;
  }

  checkHost(peerId: string) {
    return this.host === peerId;
  }
  get garticGameData() {
    return {
      roomId: this.roomId,
      gameMode: this.gameMode,
      players: this.players.map((player) => player.peerId),
      totalRound: this.totalRound,
      drawTime: this.garticdrawTime,
      KeywordTime: this.garticKeywordTime,
      goalScore: this.goalScore,
    };
  }

  get catchMindGameData() {
    return {
      roomId: this.roomId,
      gameMode: this.gameMode,
      players: this.players.map((player) => player.peerId),
      totalRound: this.totalRound,
      roundTime: this.catchMindRoundTime,
      goalScore: this.goalScore,
    };
  }
}
