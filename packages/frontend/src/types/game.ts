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

export interface GameInfo {
  gameMode: string;
  totalRound: number;
  roundInfo: CatchMindRoundInfo;
}

export interface CatchMindRoundInfo {
  roundTime: number;
  currentRound: number;
  turnPlayer: string;
}
