import { Socket } from "socket.io";
import { PlayerPort } from "./player.port";
import { PlayerService } from "../entity/player.service";
import { SocketRouter } from "../../../utils/socketRouter";
import { Room } from "../../room/entity/room.entity";
import { randomUUID } from "crypto";

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
    // 파라미터에 roomId가 있을 때
    if (roomId) {
      const room: Room | undefined = connecter.call("room/get-by-roomId", {
        roomId,
      });

      console.log("player.controller", roomId);

      // 유효하지 않는 방 번호일 떄
      if (!room) {
        console.log("player.controller", "유효하지 않음!!");
        roomId = createUUID();
      } else {
        if (room.players.length === room.maxPlayer) {
          playerService.sendError(socket.id, "방이 가득 찼습니다");
        }

        // 접속이 불가능한 방일 때 ex) 게임 하고 있을 땐 못들어감
        if (!room.state) {
          console.log("player.controller", "이미시작한방");
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
  console.log("disconnect", socket.id);

  playerService.leavePlayer(socket.id);
});

export const PlayerController = router.router;

connecter.register("player/get-all-players", async () => {
  return await playerService.getAllPlayer();
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
