import { Socket } from "socket.io";
import { PlayerPort } from "./player.port";
import { PlayerService } from "../entity/palyer.service";
import { SocketRouter } from "../../../utils/socketMiddlware";
import { Room } from "../../room/entity/room.entity";
import { SearchRoomController } from "../../room/inbound/SearchRoom.api.controller";

const router = new SocketRouter();
const playerService = new PlayerService();
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
    const searchRoomController: SearchRoomController =
      new SearchRoomController();

    if (roomId) {
      const room: Room | undefined =
        searchRoomController.getRoomByRoomId(roomId);
      if (room) {
        socket.join(room.roomId);
      } else {
        socket.join("123123"); // 나중에 uuid 같은걸로 바꾸기
      }
    } else {
      socket.join("123123"); // 나중에 uuid 같은걸로 바꾸기
      roomId = "123123";
    }

    playerService.createPlayer(socket.id, userName, avata, roomId);
  }
);

router.get("player-quit", (socket: Socket) => {
  playerService.leavePlayer(socket.id);
});

export class PlayerApiController {
  playerService: PlayerPort;

  constructor() {
    this.playerService = new PlayerService();
  }

  getAllPlayer() {
    return this.playerService.getAllPlayer();
  }
}

export const PlayerController = router.router;
