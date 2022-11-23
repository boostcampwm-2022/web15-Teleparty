import { RoomPort } from "../inbound/room.port";
import { RoomRepository } from "../outbound/room.repository";
import { RoomRepositoryImpl } from "../outbound/room.repositoryImpl";

export class RoomService implements RoomPort {
  roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepositoryImpl();
  }

  join(userName: string, roomId?: string) {
    const room = this.roomRepository.findRoomIdByRoomId(roomId);

    if (!room) {
      const newRoom = this.roomRepository.create("123123");
    }

    return;
  }
  leave() {
    return;
  }
  gameStart() {
    return;
  }
  chooseMode() {
    return;
  }
}
