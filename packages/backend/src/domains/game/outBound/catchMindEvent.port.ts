export type CatchMindInfo = {
  roundTime: number;
  currentRound: number;
  turnPlayer: string;
};

export type StartGameData = {
  gameMode: string;
  totalRound: number;
  roundInfo: CatchMindInfo;
};

export type RoundEndData = {
  roundWinner: string | null;
  playerScoreList: { peerId: string; score: number }[];
  isLastRound: boolean;
};

export interface CatchMindEvent {
  roomId: string;
  gameStart: (data: StartGameData) => void;
  drawStart: (id: string) => void;
  roundEnd: (data: RoundEndData) => void;
  roundReady: (id: string) => void;
  roundStart: (data: CatchMindInfo) => void;
}
