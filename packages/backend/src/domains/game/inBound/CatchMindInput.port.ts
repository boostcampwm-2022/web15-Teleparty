import { Player } from "../entity/game";

export interface CatchMindInputPort {
  goalScore: number;
  players: Player[];
  roundTime: number;
  roomId: string;
  gameStart: (gameMode: string) => void;
  drawStart: (keyword: string) => void;
  roundEnd: (winner: string | null) => void;
  checkAnswer: (answer: string, playerId: string) => void;
  roundReady: (id: string) => void;
  roundStart: () => void;
}
