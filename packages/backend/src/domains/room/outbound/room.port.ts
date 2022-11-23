import { Room } from "../entity/room.entity";

export type PlayerInfo = {
  peerId: string;
  userName: string;
  avataURL: string;
  isHost: boolean;
  isMicOn: boolean;
};
export interface JoinPlayerTotalInfo {
  roomId: string;
  players: PlayerInfo[];
}

export interface RoomEvent {
  join: (data: JoinPlayerTotalInfo) => void;
  newJoin: (data: JoinPlayerTotalInfo) => void;
}

export interface RoomRepository {
  create: (roomId: string) => Room;
  findOneByRoomId: (roomId?: string) => Room | undefined;
  findOneByPeerId: (peerId: string) => Room | undefined;
  findAll: () => Room[];
  updateRoomHostByRoomId: (roomId: string, peerId: string) => void;
  deleteByRoomId: (roomId: string) => void;
  deletePlayerofRoomByPeerId: (peerId: string) => void;
}
