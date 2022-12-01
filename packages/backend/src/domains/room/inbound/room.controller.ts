import { RoomService } from "../entity/room.service";
import { RoomPort } from "./room.port";
import { SocketRouter } from "../../../utils/socketRouter";
import { Socket } from "socket.io";

import { DomainConnecter } from "../../../utils/domainConnecter";

const router = new SocketRouter();
const roomService: RoomPort = new RoomService();

router.get(
  "game-start",
  (socket: Socket, { gameMode }: { gameMode: string }) => {
    roomService.gameStart(socket.id, gameMode);
  }
);

router.get(
  "mode-change",
  (socket: Socket, { gameMode }: { gameMode: string }) => {
    roomService.chooseMode(socket.id, gameMode);
  }
);

router.get(
  "chatting",
  (
    socket: Socket,
    { peerId, message }: { peerId: string; message: string }
  ) => {
    roomService.chatting(socket.id, message);
  }
);

export const RoomController = router.router;

const connecter = DomainConnecter.getInstance();

connecter.register("room/join", (data: { roomId: string; peerId: string }) => {
  const { peerId, roomId } = data;
  roomService.join(peerId, roomId);

  return;
});

connecter.register("room/leave", (data: { peerId: string }) => {
  const { peerId } = data;
  roomService.leave(peerId);

  return;
});

connecter.register("room/end-game", ({ roomId }: { roomId: string }) => {
  roomService.endGame(roomId);
});
