import { Socket } from "socket.io";
import { PlayerPort } from "./player.port";
import { PlayerService } from "../entity/player.service";
import { SocketRouter } from "../../../utils/socketRouter";
import { Room } from "../../room/entity/room.entity";
import { randomUUID } from "crypto";
// import { SearchRoomController } from "../../room/inbound/SearchRoom.api.controller";

import { DomainConnecter } from "../../../utils/domainConnecter";

const router = new SocketRouter();
const playerService: PlayerPort = new PlayerService();

const connecter = DomainConnecter.getInstance();

router.get(
  "join",
  (
    socket: Socket,
    {
      userName,
      avata,
      roomId,
    }: { userName: string; avata: string; roomId: string | null }
  ) => {
    // const searchRoomController: SearchRoomController =
    //   new SearchRoomController();

    // 파라미터에 roomId가 있을 때
    if (roomId) {
      const room: Room | undefined = connecter.call("room/get-by-roomId", {
        roomId,
      });

      // 유효하지 않는 방 번호일 떄
      if (!room) {
        // console.log("player.controller", "유효하지 않음!!");
        roomId = roomId || createUUID();
      } else {
        if (room.players.length === room.maxPlayer) {
          // console.log("방이 가득참");
          playerService.sendError(socket.id, "방이 가득 찼습니다");
          return;
        }

        // 접속이 불가능한 방일 때 ex) 게임 하고 있을 땐 못들어감
        if (!room.state) {
          // console.log("player.controller", "이미시작한방");
          playerService.sendError(socket.id, "이미 게임을 시작한 방입니다.");
          return;
        }
      }
    } else {
      console.log("player.controller", "파라미터에 roomId  없음");
      roomId = createUUID();
    }

    playerService.createPlayer(socket, socket.id, userName, avata, roomId);
  }
);

router.get("disconnect", (socket: Socket) => {
  // console.log("\x1b[31mdisconnect\x1b[31m", socket.id);

  playerService.leavePlayer(socket.id);
});

// router.get("player-quit", (socket: Socket) => {
//   playerService.leavePlayer(socket.id);
// });

export const PlayerController = router.router;

connecter.register("player/get-all-players", () => {
  return playerService.getAllPlayer();
});

const createUUID = () => {
  let uuid = randomUUID();

  // 혹시 roomId가 중복될 수도 있기 때문에
  // 새로운 UUID가 나올때까지 반복
  while (
    connecter.call("room/get-by-roomId", {
      uuid,
    })
  ) {
    uuid = randomUUID();
  }

  return uuid;
};
