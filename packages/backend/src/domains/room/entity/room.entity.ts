export class Room {
  roomId: string;
  players: string[];
  host: string;
  state: boolean;
  gameMode: string;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.players = [];
    this.host = "";
    this.state = true; // 방 입장 여부
    this.gameMode = "";
  }
}
