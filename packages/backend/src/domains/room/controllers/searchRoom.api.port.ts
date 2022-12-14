import { Room, RoomData } from "../entity/room.entity";

export interface SearchRoomApiPort {
  searchById: (id: string) => Promise<RoomData | undefined>;
  // getRoomByRoomId: (roomId: string) => Promise<Room | undefined>;
}
