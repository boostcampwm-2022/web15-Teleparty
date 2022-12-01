export interface CatchMindInputPort {
  gameStart: (
    goalScore: number,
    players: string[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) => void;
  drawStart: (roomId: string, keyword: string) => void;
  checkAnswer: (roomId: string, answer: string, playerId: string) => void;
  roundReady: (roomId: string, playerId: string) => void;
  exitGame: (roomId: string, playerId: string) => void;
  quitDuringGame: (roomId: string, playerId: string) => void;
}
