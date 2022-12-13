import { RoomService } from "../useCases/room.service";
import { RoomPort } from "./room.port";
import { SocketRouter } from "../../../utils/socketRouter";
import { Socket } from "socket.io";
import { GAME_MODE } from "../entity/room.entity";
import { DomainConnecter } from "../../../utils/domainConnecter";

const router = new SocketRouter();
const roomService: RoomPort = new RoomService();

router.get(
  "join",
  async (
    socket: Socket,
    {
      userName,
      avata,
      roomId,
    }: { userName: string; avata: string; roomId: string | null }
  ) => {
    if (roomService.checkPlayer(socket.id)) {
      return;
    }

    const player = await roomService.createPlayer({
      peerId: socket.id,
      userName,
      avata,
      roomId,
    });

    if (!player) {
      // 플레이어 생성 실패
      return;
    }

    // console.log("새로운 플레이어", player);

    socket.join(player.roomId); // 소캣 방에 넣기

    roomService.join(player);
  }
);

router.get("disconnect", (socket: Socket) => {
  console.log("disconnect", socket.id);
  roomService.leave(socket.id);
});

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

export const RoomController = router.router;

const connecter = DomainConnecter.getInstance();

connecter.register("room/game-end", ({ roomId }: { roomId: string }) => {
  roomService.endGame(roomId);
});
