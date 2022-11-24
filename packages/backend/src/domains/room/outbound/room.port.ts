import { Room } from "../entity/room.entity";

export type PlayerInfo = {
  peerId: string;
  userName: string;
  avataURL: string;
  isHost: boolean;
  isMicOn: boolean;
};

export type GameMode = {
  gameMode: string;
};
export interface JoinPlayerTotalInfo {
  roomId: string;
  players: PlayerInfo[];
}

export interface RoomEvent {
  join: (data: JoinPlayerTotalInfo) => void;
  newJoin: (data: JoinPlayerTotalInfo) => void;
  modeChange: (data: GameMode) => void;
}

export interface RoomApiPort {
  gameStart: (roomId: string, gameMode: string) => void;
}

export interface RoomRepository {
  create: (roomId: string) => Room;
  findOneByRoomId: (roomId?: string) => Room | undefined;
  findOneByPeerId: (peerId: string) => Room | undefined;
  findAll: () => Room[];
  updateHostByRoomId: (roomId: string, peerId: string) => void;
  updateStateByRoomId: (roomId: string, state: boolean) => void;
  updateGameModeByRoomId: (roomId: string, gameMode: string) => void;
  deleteByRoomId: (roomId: string) => void;
  deletePlayerofRoomByPeerId: (peerId: string) => void;
}
