import { AlbumData } from "../domains/garticphone/entity/albumData";
import { Player } from "../domains/garticphone/entity/player";

export type DataType = "keyword" | "painting";

export interface GarticPlayerData {
  id: string;
  isInputEnded: boolean;
  isExit: boolean;
  album: AlbumData[];
}

export interface GarticGameData {
  players: Player[];
  drawTime: number;
  keywordTime: number;
  roomId: string;
  totalRound?: number;
  currentRound?: number;
  sendIdx?: number;
  orderSeed?: number;
}

export interface StartData {
  roomId: string;
  drawTime: number;
  keywordTime: number;
  players: string[];
}
