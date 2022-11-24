import { Player } from "../entity/player.entitiy";

export interface PlayerPort {
  createPlayer: (
    peerId: string,
    userName: string,
    avata: string,
    roomId: string
  ) => void;

  leavePlayer: (peerId: string) => void;

  getAllPlayer: () => Player[];
}
