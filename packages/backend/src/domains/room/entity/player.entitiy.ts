export class Player {
  peerId: string;
  userName: string;
  avatar: string;
  isMicOn: boolean;
  roomId: string;

  constructor(data: {
    peerId: string;
    userName: string;
    avatar: string;
    roomId: string;
  }) {
    const { peerId, userName, avatar, roomId } = data;
    this.peerId = peerId;
    this.userName = userName;
    this.avatar = avatar;
    this.isMicOn = false;
    this.roomId = roomId;
  }
}
