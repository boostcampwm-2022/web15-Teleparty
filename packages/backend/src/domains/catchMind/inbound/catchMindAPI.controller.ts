import { CatchMindInputPort } from "./CatchMindInput.port";
import { CatchMindService } from "../entity/catchMind.service";
import { Player } from "../entity/catchMind";

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
    const playerList = Array.from(players, (player: string): Player => {
      return { id: player, score: 0, isReady: false };
    });

    gameService.gameStart(goalScore, playerList, roundTime, roomId, totalRound);
  }
);

connecter.register(
  "catchMind/player-quit",
  ({ roomId, playerId }: { roomId: string; playerId: string }) => {
    gameService.quitDuringGame(roomId, playerId);
  }
);
