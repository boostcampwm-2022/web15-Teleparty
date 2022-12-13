import { CatchMindControllerPort } from "../useCases/ports/CatchMind.controller.port";
import { CatchMindUseCase } from "../useCases/catchMind.useCase";

import { DomainConnecter } from "../../../utils/domainConnecter";
import { StartData } from "../../../types/catchMind.type";

const connecter = DomainConnecter.getInstance();
const gameService: CatchMindControllerPort = new CatchMindUseCase();

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
