import { Room } from "../entity/room.entity";
import { RoomRepository } from "./room.repository";

export class RoomRepositoryImpl implements RoomRepository {
  private rooms: Room[];

  constructor() {
    this.rooms = [];
  }

  create(roomId: string) {
    const room = new Room(roomId);
    this.rooms.push(room);
    return room;
  }

  findRoomIdByRoomId(roomId?: string) {
    const room = this.rooms.find((room) => room.roomId === roomId);
    return room;
  }
}
