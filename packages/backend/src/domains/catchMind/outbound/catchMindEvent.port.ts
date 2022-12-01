import { Player } from "../entity/catchMind";

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

export interface CatchMindEventPort {
  gameStart: (roomId: string, data: StartGameData) => void;
  drawStart: (roomId: string, player: Player) => void;
  roundEnd: (roomId: string, data: RoundEndData) => void;
  roundReady: (roomId: string, player: Player) => void;
  roundStart: (roomId: string, data: CatchMindInfo) => void;
  playerExit: (roomId: string, playerId: string) => void;
}
