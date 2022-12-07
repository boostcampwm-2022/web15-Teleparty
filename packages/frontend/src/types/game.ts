export interface Player {
  peerId: string;
  userName: string;
  avatarURL: string;
  isHost: boolean;
  isMicOn: boolean;
  isAudioDetected: boolean;
}

export interface GamePlayer extends Player {
  isCurrentTurn?: boolean;
  isReady?: boolean;
  score?: number;
}

export interface GameInfo {
  gameMode: string;
  totalRound: number;
  roundInfo: CatchMindRoundInfo & GarticRoundInfo;
}

export interface CatchMindRoundInfo {
  roundTime: number;
  currentRound: number;
  turnPlayer: string;
}

export interface GarticRoundInfo {
  roundTime: number;
  currentRound: number;
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

export interface AlbumType {
  peerId: string;
  keyword?: string;
  img?: string;
}
