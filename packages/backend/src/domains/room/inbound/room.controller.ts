import { RoomService } from "../entity/room.service";
import { SocketRouter } from "../../../utils/socketMiddlware";
import { Socket } from "socket.io";

const router = new SocketRouter();
const roomService = new RoomService();
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

export const RoomApiController = {
  joinRoom: (data: { roomId: string; peerId: string }) => {
    const { peerId, roomId } = data;
    roomService.join(peerId, roomId);

    return;
  },
  leaveRoom: (data: { peerId: string }) => {
    const { peerId } = data;
    roomService.leave(peerId);

    return;
  },
  endGame: (roomId: string) => {
    roomService.endGame(roomId);
  },
};

export const RoomController = router.router;
