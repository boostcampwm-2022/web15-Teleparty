import { RoomService } from "../entity/room.service";
import { RoomPort } from "./room.port";

export class RoomController {
  roomService: RoomPort;

  constructor() {
    this.roomService = new RoomService();
  }

  joinRoom(data: { roomId: string; peerId: string }) {
    const { peerId, roomId } = data;
    this.roomService.join(peerId, roomId);

    return;
  }
  leaveRoom(data: { peerId: string }) {
    const { peerId } = data;
    this.roomService.leave(peerId);

    return;
  }
  gameStart(data: { peerId: string; gameMode: string }) {
    const { peerId, gameMode } = data;
    this.roomService.gameStart(peerId, gameMode);

    return;
  }
  chooseMode(data: { peerId: string; gameMode: string }) {
    const { peerId, gameMode } = data;
    this.roomService.chooseMode(peerId, gameMode);

    return;
  }

  sendChatting(data: { peerId: string; message: string }) {
    const { peerId, message } = data;
    this.roomService.chatting(peerId, message);

    return;
  }
}
