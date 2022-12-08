import { RoomService } from "../entity/room.service";
import { RoomPort } from "./room.port";
import { SocketRouter } from "../../../utils/socketRouter";
import { Socket } from "socket.io";
import { GAME_MODE } from "../entity/room.entity";
import { DomainConnecter } from "../../../utils/domainConnecter";

const router = new SocketRouter();
const roomService: RoomPort = new RoomService();

router.get(
  "game-start",
  (socket: Socket, { gameMode }: { gameMode: GAME_MODE }) => {
    if (!["CatchMind", "Garticphone"].includes(gameMode)) {
      return;
    }
    // console.log("start-game");
    roomService.gameStart(socket.id, gameMode);
  }
);

router.get(
  "mode-change",
  (socket: Socket, { gameMode }: { gameMode: GAME_MODE }) => {
    if (!["CatchMind", "Garticphone"].includes(gameMode)) {
      return;
    }
    roomService.chooseMode(socket.id, gameMode);
  }
);

router.get("chatting", (socket: Socket, { message }: { message: string }) => {
  roomService.chatting(socket.id, message);
});

// router.get("disconnect", (socket: Socket) => {
//   roomService.leave(socket.id);
// });

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

connecter.register("room/game-end", ({ roomId }: { roomId: string }) => {
  roomService.endGame(roomId);
});
