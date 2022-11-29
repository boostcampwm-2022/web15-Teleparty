import { CatchMindInputPort } from "./CatchMindInput.port";
import { CatchMindService } from "../entity/catchMind.service";
import { Player } from "../entity/catchMind";

import { DomainConnecter } from "../../../utils/domainConnecter";

// export class CatchMindApiController {
//   gameService: CatchMindInputPort = new CatchMindService();

//   gameStart(
//     goalScore: number,
//     players: string[],
//     roundTime: number,
//     roomId: string,
//     totalRound: number
//   ) {
//     const playerList = Array.from(players, (player: string): Player => {
//       return { id: player, score: 0, isReady: false };
//     });

//     this.gameService.gameStart(
//       goalScore,
//       playerList,
//       roundTime,
//       roomId,
//       totalRound
//     );
//   }

//   // quitPlayer(roomId: string, playerId: string) {
//   //   this.gameService.quitGame(roomId, playerId);
//   // }
// }

const connecter = DomainConnecter.getInstance();
const gameService: CatchMindInputPort = new CatchMindService();

connecter.register(
  "game-start",
  (
    goalScore: number,
    players: string[],
    roundTime: number,
    roomId: string,
    totalRound: number
  ) => {
    const playerList = Array.from(players, (player: string): Player => {
      return { id: player, score: 0, isReady: false };
    });

    gameService.gameStart(goalScore, playerList, roundTime, roomId, totalRound);
  }
);
