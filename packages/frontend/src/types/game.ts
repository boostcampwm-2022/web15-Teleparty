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
