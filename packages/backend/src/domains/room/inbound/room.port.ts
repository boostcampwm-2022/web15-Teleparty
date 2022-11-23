export interface RoomPort {
  join: (peerId: string, roomId?: string) => void;
  leave: (peerId: string) => void;
  gameStart: () => void;
  chooseMode: () => void;
}
