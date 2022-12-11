import { SearchRoomApiPort } from "./searchRoom.api.port";
import { SerchRoomApiService } from "../useCases/searchRoom.service";

import { DomainConnecter } from "../../../utils/domainConnecter";

const connecter = DomainConnecter.getInstance();
const roomAPI: SearchRoomApiPort = new SerchRoomApiService();

connecter.register("room/get-by-playerId", async ({ id }: { id: string }) => {
  return await roomAPI.searchById(id);
});

// connecter.register(
//   "room/get-by-roomId",
//   async ({ roomId }: { roomId: string }) => {
//     if (roomId) {
//       return await roomAPI.getRoomByRoomId(roomId);
//     }

//     return undefined;
//   }
// );
