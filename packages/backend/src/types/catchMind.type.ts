import { Player } from "../domains/catchMind/entity/player";

export type CatchMindInfo = {
  roundTime: number;
  currentRound: number;
  turnPlayer: string;
};

export type StartGameData = {
  totalRound: number;
  roundInfo: CatchMindInfo;
};

export type RoundEndData = {
  roundWinner: string | null;
  suggestedWord: string;
  playerScoreMap: { [K: string]: number };
  isLastRound: boolean;
};

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
