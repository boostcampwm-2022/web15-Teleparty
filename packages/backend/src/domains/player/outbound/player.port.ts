import { Player } from "../entity/player.entitiy";

export interface PlayerApiPort {
  joinPlayer: (peerId: string, roomId: string) => void;
  leavePlayer: (peerId: string) => void;
}

export interface PlayerRepository {
  create: (peerId: string, userName: string, avata: string) => Player;
  deleteByPeerId: (peerId: string) => void;
  findOneByPeerId: (peerId: string) => Player | undefined;
  findAll: () => Player[];
}
