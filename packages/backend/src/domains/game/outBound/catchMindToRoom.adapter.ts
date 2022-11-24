import { CatchMindToRoom } from "./catchMindToRoom.port";
import { RoomApiController } from "../../room/inbound/room.controller";

export class CatchMindToRoomAdapter implements CatchMindToRoom {
  // roomController: RoomApiController = new RoomApiController();
  gameEnded(roomId: string) {
    RoomApiController.endGame(roomId);
  }
}
