import { ChatService } from "../entity/chat.service";

import { SocketRouter } from "../../../utils/socketRouter";
// import { SearchRoomController } from "../../room/inbound/SearchRoom.api.controller";
// import { Socket } from "socket.io";

const router = new SocketRouter();

// const chat = new ChatService();
// const roomSearcher = new SearchRoomController();

// router.get(
//   "chatting",
//   (
//     socket: Socket,
//     { message, peerId }: { message: string; peerId: string }
//   ) => {
//     const room = roomSearcher.getRoomByPlayerId(socket.id);
//     if (room) chat.chatToRoom({ message, id: peerId }, room.roomId);
//   }
// );

export const ChatRouter = router.router;

export class ChatInController {
  chat: ChatService;

  constructor() {
    this.chat = new ChatService();
  }

  send(message: string, senderId: string, roomId: string) {
    this.chat.chatToRoom({ message, id: senderId }, roomId);
  }
}
