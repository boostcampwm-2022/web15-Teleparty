import { Room } from "../entity/room.entity";
import { Player } from "../entity/player.entitiy";
import {
  GameMode,
  GAME_MODE,
  JoinPlayerTotalInfo,
  NewPlayer,
  PlayerInfo,
} from "../../../types/room";

export interface RoomEvent {
  join: (data: JoinPlayerTotalInfo, peerId: string) => void;
  newJoin: (data: PlayerInfo, roomId: string) => void;
  modeChange: (data: GameMode, roomId: string) => void;
  quitPlayer: (roomId: string, peerId: string) => void;
  sendError: (peerId: string, message: string) => void;
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
  deleteByRoomId: (roomId: string) => void;
  deletePlayer: (peerId: string, room: Room) => void;
  release: (id: string) => void;
}
