import { Player } from "../domains/room/entity/player.entitiy";

export type GAME_MODE = "CatchMind" | "Garticphone" | "";

export interface RoomData {
  roomId: string;
  players?: Player[];
  host?: string;
  state?: boolean;
  gameMode?: GAME_MODE;
  totalRound?: number;
  roundTime?: number;
  goalScore?: number;
  maxPlayer?: number;
}

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
  gameMode: GAME_MODE;
};
export interface JoinPlayerTotalInfo {
  roomId: string;
  players: PlayerInfo[];
}

export interface QuitPlayerInfo {
  peerId: string;
}
