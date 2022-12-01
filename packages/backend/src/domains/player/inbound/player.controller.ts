import { Socket } from "socket.io";
import { PlayerPort } from "./player.port";
import { PlayerService } from "../entity/palyer.service";
import { SocketRouter } from "../../../utils/socketRouter";
import { Room } from "../../room/entity/room.entity";
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
        roomId = "123123"; // 나중에 uuid 같은걸로 바꾸기
      } else {
        // 접속이 불가능한 방일 때 ex) 게임 하고 있을 땐 못들어감
        if (!room.state) {
          playerService.sendError(socket.id, "이미 게임을 시작한 방입니다.");
        }
      }
    } else {
      roomId = "123123"; // 나중에 uuid 같은걸로 바꾸기
    }

    playerService.createPlayer(socket, socket.id, userName, avata, roomId);
  }
);

router.get("disconnect", (socket: Socket) => {
  playerService.leavePlayer(socket.id);
});

router.get("player-quit", (socket: Socket) => {
  playerService.leavePlayer(socket.id);
});

export const PlayerController = router.router;

connecter.register("player/get-all-players", () => {
  return playerService.getAllPlayer();
});
