import { Player } from "../entity/player.entitiy";
import { GAME_MODE } from "../entity/room.entity";

export interface RoomPort {
  createPlayer: (data: {
    peerId: string;
    userName: string;
    avata: string;
    roomId: string | null;
  }) => Promise<Player | undefined>;
  join: (player: Player) => void;
  leave: (peerId: string) => void;
  checkPlayer: (peerId: string) => boolean;
  gameStart: (peerId: string, gameMode: GAME_MODE) => void;
  chooseMode: (peerId: string, gameMode: GAME_MODE) => void;
  chatting: (peerId: string, message: string) => void;
  endGame: (roomId: string) => void;
}
