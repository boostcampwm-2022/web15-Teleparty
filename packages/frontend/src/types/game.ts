export interface Player {
  peerId: string;
  userName: string;
  avatarURL: string;
  isHost: boolean;
  isMicOn: boolean;
}

export interface GamePlayer extends Player {
  isCurrentTurn?: boolean;
  isReady?: boolean;
  score?: number;
}

export interface CatchMineRoundInfo {
  roundTime: number;
  currentRound: number;
  turnPlayer: string;
}

type PlayerScoreMap = {
  [K: string]: number;
};

export interface CatchMindRoundEndInfo {
  roundWinner: string | null;
  suggestedWord: string;
  playerScoreMap: PlayerScoreMap;
  isLastRound: boolean;
}
