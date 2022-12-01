import { CatchMindInputPort } from "./CatchMindInput.port";
import { CatchMindService } from "../entity/catchMind.service";

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
    gameService.gameStart(goalScore, players, roundTime, roomId, totalRound);
  }
);

connecter.register(
  "catchMind/player-quit",
  ({ roomId, playerId }: { roomId: string; playerId: string }) => {
    gameService.quitDuringGame(roomId, playerId);
  }
);
