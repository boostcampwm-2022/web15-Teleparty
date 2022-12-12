import { GAME_MODE, RoomData } from "../../../types/room";
import { Player } from "./player.entitiy";

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
    this.state = data.state !== undefined ? data.state : true; // 방 입장 여부
    this.gameMode = data.gameMode || "";
    this.totalRound = data.totalRound || 10;
    this.roundTime = data.roundTime || 60;
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
}
