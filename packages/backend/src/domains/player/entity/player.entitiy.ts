export class Player {
  peerId: string;
  userName: string;
  avata: string;
  isMicOn: boolean;

  constructor(peerId: string, userName: string, avata: string) {
    this.peerId = peerId;
    this.userName = userName;
    this.avata = avata;
    this.isMicOn = false;
  }
}
