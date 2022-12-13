import { CatchMindInputPort } from "../useCases/CatchMindInput.port";
import { CatchMindService } from "../useCases/catchMind.service";

import { DomainConnecter } from "../../../utils/domainConnecter";

type StartData = {
  goalScore: number;
  players: string[];
  roundTime: number;
  roomId: string;
  totalRound: number;
};

const connecter = DomainConnecter.getInstance();
const gameService: CatchMindInputPort = new CatchMindService();

connecter.register(
  "catchMind/game-start",
  ({ goalScore, players, roundTime, roomId, totalRound }: StartData) => {
    console.log("game start", roomId);
    gameService.gameStart(goalScore, players, roundTime, roomId, totalRound);
  }
);

connecter.register(
  "catchMind/player-quit",
  ({ roomId, playerId }: { roomId: string; playerId: string }) => {
    gameService.exitGame(roomId, playerId);
  }
);
