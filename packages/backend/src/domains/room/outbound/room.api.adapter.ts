import { RoomApiPort } from "./room.port";
import { ChatInController } from "../../chat/inbound/chatIn.controller";

export class RoomApiAdapter implements RoomApiPort {
  chatController: ChatInController;
  constructor() {
    this.chatController = new ChatInController();
  }
  chatting(peerId: string, roomId: string, message: string) {
    this.chatController.send(message, peerId, roomId);
  }
  gameStart(roomId: string, gameMode: string) {
    // game controller gameStart 보냄
    console.log(roomId, gameMode, "gameStart");

    return;
  }
}
