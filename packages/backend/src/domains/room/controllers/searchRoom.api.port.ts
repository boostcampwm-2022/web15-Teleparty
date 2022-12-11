import { Room } from "../entity/room.entity";

export interface SearchRoomApiPort {
  searchById: (id: string) => Promise<Room | undefined>;
  getRoomByRoomId: (roomId: string) => Promise<Room | undefined>;
}
