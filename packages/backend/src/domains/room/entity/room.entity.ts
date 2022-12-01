export type GAME_MODE = "CatchMind" | "Garticphone" | "";

export class Room {
  roomId: string;
  players: string[];
  host: string;
  state: boolean;
  gameMode: GAME_MODE;
  totalRound: number;
  roundTime: number;
  goalScore: number;
  maxPlayer: number;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.players = [];
    this.host = "";
    this.state = true; // 방 입장 여부
    this.gameMode = "";
    this.totalRound = 10;
    this.roundTime = 60;
    this.goalScore = 3;
    this.maxPlayer = 10;
  }
}
