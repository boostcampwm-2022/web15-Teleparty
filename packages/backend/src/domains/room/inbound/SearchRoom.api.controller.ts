import { SearchRoomApiPort } from "./searchRoom.api.port";
import { SerchRoomApiService } from "../entity/searchRoom.service";

import { DomainConnecter } from "../../../utils/domainConnecter";

const connecter = DomainConnecter.getInstance();
const roomAPI: SearchRoomApiPort = new SerchRoomApiService();

connecter.register("room/get-by-playerId", ({ id }: { id: string }) => {
  return roomAPI.searchById(id);
});

connecter.register("room/get-by-roomId", ({ roomId }: { roomId: string }) => {
  if (roomId) {
    return roomAPI.getRoomByRoomId(roomId);
  }

  return undefined;
});
