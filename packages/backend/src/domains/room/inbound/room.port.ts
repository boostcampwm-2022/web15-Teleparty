export interface RoomPort {
  join: (userName: string, roomId?: string) => void;
  leave: () => void;
  gameStart: () => void;
  chooseMode: () => void;
}
