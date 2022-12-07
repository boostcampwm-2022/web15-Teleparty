import { GAME_MODE, Room } from "../entity/room.entity";
import { Player } from "../entity/player.entitiy";

export type PlayerInfo = {
  peerId: string;
  userName: string;
  avataURL: string;
  isHost: boolean;
  isMicOn: boolean;
};

export type NewPlayer = {
  peerId: string;
  userName: string;
  avata: string;
  roomId: string;
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
  quitPlayer: (roomId: string, peerId: string) => void;
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
}

export interface RoomRepositoryDataPort {
  create: (roomId: string) => Room;
  createUser: (data: NewPlayer) => Player;
  save: (roomId: string, room: Room) => void;
  findAllPlayer: () => string[];
  findOneByRoomId: (roomId: string) => Promise<Room | undefined>;
  findOneByPeerId: (roomId: string) => Promise<Room | undefined>;
  findPlayerByPeerId: (peerId: string) => Promise<Player | undefined>;
  findPlayersByPeerIds: (peerIds: string[]) => Promise<Player[] | undefined>;
  updateHostByRoomId: (roomId: string, peerId: string) => void;
  updateStateByRoomId: (roomId: string, state: boolean) => void;
  updateGameModeByRoomId: (roomId: string, gameMode: GAME_MODE) => void;
  deleteByRoomId: (roomId: string) => void;
  deletePlayer: (peerId: string, room: Room) => void;
}
