import { Socket } from "socket.io";
import { Player } from "../entity/player.entitiy";

export interface PlayerPort {
  createPlayer: (
    socket: Socket,
    peerId: string,
    userName: string,
    avata: string,
    roomId: string
  ) => void;

  leavePlayer: (peerId: string) => void;

  getAllPlayer: () => Player[];

  sendError: (peerId: string, message: string) => void;
}
