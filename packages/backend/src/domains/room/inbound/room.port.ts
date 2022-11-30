export interface RoomPort {
  join: (peerId: string, roomId: string) => void;
  leave: (peerId: string) => void;
  gameStart: (peerId: string, gameMode: string) => void;
  chooseMode: (peerId: string, gameMode: string) => void;
  chatting: (peerId: string, message: string) => void;
  endGame: (roomId: string) => void;
}
