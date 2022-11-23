export class Room {
  roomId: string;
  players: string[];
  host: string;
  state: boolean;

  constructor(roomId: string) {
    this.roomId = roomId;
    this.players = [];
    this.host = "";
    this.state = false;
  }
}
