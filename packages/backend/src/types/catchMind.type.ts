import { Player } from "../domains/catchMind/entity/player";

export type StartData = {
  goalScore: number;
  players: string[];
  roundTime: number;
  roomId: string;
  totalRound: number;
};

export interface PlayerData {
  id: string;
  score?: number;
  isReady?: boolean;
}

export interface CatchMindData {
  goalScore: number;
  players: Player[] | string[];
  roundTime: number;
  roomId: string;
  totalRound: number;
  keyword?: string;
  currentRound?: number;
  turnPlayerIdx?: number;
}
