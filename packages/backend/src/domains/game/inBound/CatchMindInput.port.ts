import { CatchMind } from "../entity/catchMind";
import { Player } from "../entity/catchMind";

export interface CatchMindInputPort {
  gameStart: (
    goalScore: number,
    players: Player[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) => void;
  drawStart: (roomId: string, keyword: string) => void;
  checkAnswer: (roomId: string, nswer: string, playerId: string) => void;
  roundReady: (roomId: string, playerId: string) => void;
}
