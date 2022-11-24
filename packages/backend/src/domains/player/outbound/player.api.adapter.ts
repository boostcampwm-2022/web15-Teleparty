import { RoomApiController } from "../../room/inbound/room.controller";

import { PlayerApiPort } from "./player.port";

export class PlayerApiAdapter implements PlayerApiPort {
  roomController = RoomApiController;

  joinPlayer(peerId: string, roomId: string) {
    RoomApiController.joinRoom({
      peerId,
      roomId,
    });
    return;
  }

  leavePlayer(peerId: string) {
    RoomApiController.leaveRoom({ peerId });
    return;
  }
}
