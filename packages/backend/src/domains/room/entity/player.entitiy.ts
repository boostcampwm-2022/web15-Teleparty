export class Player {
  peerId: string;
  userName: string;
  avata: string;
  isMicOn: boolean;
  roomId: string;

  constructor(data: {
    peerId: string;
    userName: string;
    avata: string;
    roomId: string;
  }) {
    const { peerId, userName, avata, roomId } = data;
    this.peerId = peerId;
    this.userName = userName;
    this.avata = avata;
    this.isMicOn = false;
    this.roomId = roomId;
  }
}
