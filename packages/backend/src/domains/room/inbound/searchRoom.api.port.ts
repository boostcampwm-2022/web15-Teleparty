import { Room } from "../entity/room.entity";

export interface SearchRoomApiPort {
  searchById: (id: string) => Room | undefined;
  getRoomByRoomId: (roomId: string) => Room | undefined;
}
