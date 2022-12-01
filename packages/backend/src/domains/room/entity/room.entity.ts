export class Room {
  roomId: string;
  players: string[];
  host: string;
  state: boolean;
  gameMode: string;
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
    this.roundTime = 60000;
    this.goalScore = 3;
    this.maxPlayer = 10;
  }
}
