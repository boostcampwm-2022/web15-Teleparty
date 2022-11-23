import { Room } from "../entity/room.entity";

export interface RoomRepository {
  create: (roomId: string) => Room;
  findRoomIdByRoomId: (roomId?: string) => Room | undefined;
}
