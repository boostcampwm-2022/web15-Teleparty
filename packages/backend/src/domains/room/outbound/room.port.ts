import { GAME_MODE, Room } from "../entity/room.entity";
import { Player } from "../../player/entity/player.entitiy";

export type PlayerInfo = {
  peerId: string;
  userName: string;
  avataURL: string;
  isHost: boolean;
  isMicOn: boolean;
};

export type GameMode = {
  roomId: string;
  gameMode: string;
};
export interface JoinPlayerTotalInfo {
  roomId: string;
  players: PlayerInfo[];
}

export interface RoomEvent {
  join: (data: JoinPlayerTotalInfo, peerId: string) => void;
  newJoin: (data: PlayerInfo, roomId: string) => void;
  modeChange: (data: GameMode, roomId: string) => void;
  quitPlayer: (data: JoinPlayerTotalInfo, roomId: string) => void;
}

export interface RoomApiPort {
  gameStart: (
    roomId: string,
    gameMode: GAME_MODE,
    players: string[],
    totalRound: number,
    roundTime: number,
    goalScore: number
  ) => void;
  chatting: (senderId: string, roomId: string, message: string) => void;
  playerQuit: (gameMode: GAME_MODE, roomId: string, playerId: string) => void;
  getAllPlayer: () => Player[];
}

export interface RoomRepositoryDataPort {
  create: (roomId: string) => Room;
  savePlayers: (roomId: string, players: string[]) => void;
  findOneByRoomId: (roomId?: string) => Room | undefined;
  findOneByPeerId: (peerId: string) => Room | undefined;
  findAll: () => Room[];
  updateHostByRoomId: (roomId: string, peerId: string) => void;
  updateStateByRoomId: (roomId: string, state: boolean) => void;
  updateGameModeByRoomId: (roomId: string, gameMode: GAME_MODE) => void;
  deleteByRoomId: (roomId: string) => void;
  deletePlayerofRoomByPeerId: (peerId: string) => void;
}
