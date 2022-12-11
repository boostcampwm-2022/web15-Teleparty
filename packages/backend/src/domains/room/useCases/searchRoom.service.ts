import { SearchRoomApiPort } from "../controllers/searchRoom.api.port";
import { RoomRepository } from "../presenters/room.repository";
import { RoomRepositoryDataPort } from "../presenters/room.port";

export class SerchRoomApiService implements SearchRoomApiPort {
  repository: RoomRepositoryDataPort = new RoomRepository();
  async searchById(id: string) {
    // console.log("SerchRoomApiService", id);

    const room = await this.repository.findOneByPeerId(id);
    if (!room) return;

    return { ...room };
  }

  getRoomByRoomId(roomId: string) {
    return this.repository.findOneByRoomId(roomId);
  }
}
