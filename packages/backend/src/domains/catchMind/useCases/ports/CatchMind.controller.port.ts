export interface CatchMindControllerPort {
  gameStart: (
    goalScore: number,
    players: string[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) => void;
  inputKeyword: (roomId: string, keyword: string, playerId: string) => void;
  checkAnswer: (roomId: string, answer: string, playerId: string) => void;
  roundReady: (roomId: string, playerId: string) => void;
  exitGame: (roomId: string, playerId: string) => void;
}
