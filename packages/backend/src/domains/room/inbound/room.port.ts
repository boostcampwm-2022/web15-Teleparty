import { GAME_MODE } from "../entity/room.entity";

export interface RoomPort {
  join: (peerId: string, roomId: string) => void;
  leave: (peerId: string) => void;
  gameStart: (peerId: string, gameMode: GAME_MODE) => void;
  chooseMode: (peerId: string, gameMode: GAME_MODE) => void;
  chatting: (peerId: string, message: string) => void;
  endGame: (roomId: string) => void;
}
