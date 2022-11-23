import { RoomController } from "../../room/inbound/room.controller";

import { PlayerApiPort } from "./player.port";

export class PlayerApiAdapter implements PlayerApiPort {
  roomController: RoomController;

  constructor() {
    this.roomController = new RoomController();
  }

  joinPlayer(peerId: string, roomId: string) {
    this.roomController.joinRoom(peerId, roomId);
    return;
  }
}
