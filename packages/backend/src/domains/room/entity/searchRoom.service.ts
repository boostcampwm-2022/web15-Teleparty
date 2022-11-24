import { SearchRoomApiPort } from "../inbound/searchRoom.api.port";
import { RoomRepository } from "../outbound/room.repository";
import { RoomRepositoryDataPort } from "../outbound/room.port";

export class SerchRoomApiService implements SearchRoomApiPort {
  repository: RoomRepositoryDataPort = new RoomRepository();
  searchById(id: string) {
    const room = this.repository.findOneByPeerId(id);
    if (!room) return;

    return { ...room };
  }

  getRoomByRoomId(roomId: string) {
    return this.repository.findOneByRoomId(roomId);
  }
}
