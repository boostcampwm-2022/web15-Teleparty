import { SearchRoomApiPort } from "./searchRoom.api.port";
import { SerchRoomApiService } from "../entity/searchRoom.service";

export class SearchRoomController {
  roomAPI: SearchRoomApiPort = new SerchRoomApiService();
  getRoomByPlayerId(id: string) {
    return this.roomAPI.searchById(id);
  }
  getRoomByRoomId(roomId: string) {
    if (roomId) {
      return this.roomAPI.getRoomByRoomId(roomId);
    }

    return undefined;
  }
}
