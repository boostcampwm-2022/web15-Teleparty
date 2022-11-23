import { Player } from "../entity/player.entitiy";

export interface PlayerApiPort {
  joinPlayer: (peerId: string, roomId: string) => void;
}

export interface PlayerRepository {
  create: (peerId: string, userName: string, avata: string) => Player;
}
