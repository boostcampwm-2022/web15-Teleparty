export interface PlayerPort {
  createPlayer: (
    peerId: string,
    userName: string,
    avata: string,
    roomId: string
  ) => void;
}
