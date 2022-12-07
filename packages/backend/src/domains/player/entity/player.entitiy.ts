export class Player {
  peerId: string;
  userName: string;
  avata: string;
  isMicOn: boolean;
  roomId: string;

  constructor(peerId: string, userName: string, avata: string, roomId: string) {
    this.peerId = peerId;
    this.userName = userName;
    this.avata = avata;
    this.isMicOn = false;
    this.roomId = roomId;
  }
}
