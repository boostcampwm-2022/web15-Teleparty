export interface RoomAPIPort {
  gameEnded: (roomId: string) => void;
}
