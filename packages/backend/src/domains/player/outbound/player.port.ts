import { Player } from "../entity/player.entitiy";

export interface PlayerApiPort {
  joinPlayer: (peerId: string, roomId: string) => void;
  leavePlayer: (peerId: string) => void;
}

export interface PlayerRepositoryDataPort {
  create: (
    peerId: string,
    userName: string,
    avata: string,
    roomId: string
  ) => Player;
  deleteByPeerId: (peerId: string) => void;
  findOneByPeerId: (peerId: string) => Promise<Player | undefined>;
  findAll: () => Promise<Player[] | undefined>;
}

export interface ErrorMsg {
  message: string;
}

export interface PlayerEvent {
  error: (peerId: string, msg: ErrorMsg) => void;
}
