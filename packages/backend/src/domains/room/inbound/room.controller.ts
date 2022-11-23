import { RoomService } from "../entity/room.service";
import { RoomPort } from "./room.port";

export class RoomController {
  roomService: RoomPort;

  constructor() {
    this.roomService = new RoomService();
  }

  joinRoom(data: { userName: string; roomId: string }) {
    const { userName, roomId } = data;

    this.roomService.join(userName, roomId);

    return;
  }
  leaveRoom() {
    return;
  }
  gameStart() {
    return;
  }
  chooseMode() {
    return;
  }
}
